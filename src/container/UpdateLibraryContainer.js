import { useEffect, useState } from "react"
import { useSelector,useDispatch } from "react-redux"
import { fetchBook} from "../actions/BookActions"
import { clearPagesInView,fetchPage} from "../actions/PageActions"
import {    updateLibrary,
            fetchLibrary,
            saveRolesForLibrary,
            updateLibraryContent, 
            deleteLibrary,
        } from "../actions/LibraryActions"
import { useParams,useNavigate } from "react-router-dom"

import InfiniteScroll from "react-infinite-scroll-component"
import RoleList from "../components/RoleList"
import "../styles/UpdateLibrary.css"
import {Checkbox , Button, FormGroup, TextField,FormControlLabel,IconButton } from "@mui/material"
import { RoleType } from "../core/constants"
import useAuth from "../core/useAuth"
import checkResult from "../core/checkResult"
import uuidv4 from "../core/uuidv4"
import { Textarea } from "@mui/joy"
import theme from "../theme"
import { Add, Visibility } from "@mui/icons-material"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
function UpdateLibraryContainer(props) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const pathParams = useParams()
    const libraryInView = useSelector(state=>state.libraries.libraryInView)
    const [libraryName, setLibraryName]= useState("")
    const [writingIsOpen,setWritingIsOpen]=useState(false)
    const [privacy,setPrivacy]=useState(false)
    const [purpose,setPurpose]=useState("")
    const [hasMore,setHasMore]=useState(true)
    const [open,setOpen]=useState(false)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const booksInView = useSelector(state=>state.books.booksInView)
    const [roleList,setRoleList]=useState([])
    const [listItems,setListItems]=useState([])
    const { id } = pathParams
 
    useEffect(()=>{
        if(libraryInView && libraryInView.id === id){
            setLibrary()
            fetchData()
        }else {
            start()
        }
    },[])
    const start =()=>{
        dispatch(fetchLibrary(pathParams)).then((result)=>{
            setLibrary()
            dispatch(clearPagesInView())
            
          
        })
    }
    const setLibrary=()=>{
        if(libraryInView ){
            setLibraryName(libraryInView.name)
            setWritingIsOpen(libraryInView.writingIsOpen)
            setPrivacy(libraryInView.privacy)
            setPurpose(libraryInView.purpose)

        }
    }
   


    const fetchBooks =()=>{
        if(libraryInView && libraryInView.bookIdList.length>0){
            libraryInView.bookIdList.forEach(bId=>{
                const params ={
                    id: bId
                }
                setHasMore(true)
                dispatch(fetchBook(params)).then(result=>checkResult(result,payload=>{
                        const {book}=payload;
                        if(book){
                        let uId = `${book.id}_${uuidv4()}`
                        const item = {uId:uId,book:book }
                        setListItems(prevState=>[...prevState,item])
                        setHasMore(false)
                        }
                },err=>{
                    setHasMore(false)
                }))
            })}else{
                    setHasMore(false)
                }
            }
        
    const handleRemove = (item)=>{
        let list =listItems
        let newList = list.filter(i=>{return item.uId !== i.uId})
        setListItems(newList)
            
                
    }
    const fetchPages=()=>{
        if(libraryInView && libraryInView.pageIdList.length>0){
            setHasMore(true)
            libraryInView.pageIdList.forEach(pId=>{
                dispatch(fetchPage({id:pId})).then(result=>checkResult(result,payload=>{
                    const {page}= payload
                    if(page){
                    let item = {uId:`${page.id}_${uuidv4()}`,page:page}
                    setListItems(prevState=>[...prevState,item])
                    setHasMore(false)
                    }
                },err=>{
                    setHasMore(false)
                }))
            })
        }else{
            setHasMore(false)
        }
                

}

    const fetchData = () =>{
        if(currentProfile){
            setListItems([])
            fetchPages()
            fetchBooks()
        }
    }
    const libraryInfo=()=>{
        return (<div className="info create">
            <FormGroup style={{padding:"1em"}}>
            
                <TextField style={{backgroundColor:theme.palette.primary.contrastText}}type="text" 
                label="Name"
                placeholder="Library Name"
                value={libraryName} 
                                    onChange={(e)=>{
                                        setLibraryName(e.target.value)
                                    }

                }/>
                    <FormControlLabel control={<Checkbox checked={privacy} onChange={(e)=>{

            setPrivacy(!privacy)}} />} label={privacy?"Private":"Public"} />
        
                 <FormControlLabel control={<Checkbox  onChange={(e)=>{
                    setWritingIsOpen(!writingIsOpen)
                }} checked={writingIsOpen} />} label={writingIsOpen?"Writing is Open":"Writing is Closed"} />
               <div>
                <h6>Purpose</h6>
               <Textarea value={purpose} onChange={(e)=>setPurpose(e.target.value)}/>
               </div>
                <Button style={{ marginTop:"2em",backgroundColor: theme.palette.primary.main,
    color:theme.palette.error.contrastText}}type="submit" variant="outlined" onClick={(e)=>updateLibraryDetails(e)}>Update</Button>
            </FormGroup>
            <div>
                <div>
                    {libraryInView?<IconButton onClick={()=>navigate(`/library/${libraryInView.id}`)}><Visibility/></IconButton>:<div></div>}
                    {libraryInView?<IconButton onClick={()=>navigate(`/library/${libraryInView.id}/add`)}><Add/></IconButton>:<div></div>}
                </div>
                <Button onClick={()=>setOpen(true)}style={{ width:"100%",margin:"auto",marginTop:"4em",backgroundColor: theme.palette.error.main,
    color:theme.palette.error.contrastText}}>Delete</Button>
            </div>
        </div>)
    }
    const handleDelete = () => {
        const params = {library:libraryInView}
        dispatch(deleteLibrary(params)).then(result=>{
            navigate(`/profile/home`)
        })
    }
    const updateLibraryDetails = (e) => {
        e.preventDefault();

        const params ={
            library: libraryInView,
            name: libraryName,
            purpose: purpose,
            privacy: privacy,
            writingIsOpen: writingIsOpen 
        }
        dispatch(updateLibrary(params)).then(result=>{
            checkResult(result,payload=>{
                let updated = window.confirm(`Updated`)
                window.alert(updated)
            },err=>{
                window.alert(`Error`+err.message)

            })
        })
        const pIdList  = listItems.filter(item => item.page!==null).map(item => item && item.page && item.page.id)
        const bIdList  = listItems.filter(item => item.book!==null).map(item => item && item.book && item.book.id)
        const pageIdList = pIdList.filter(id=>id!=null)
        const bookIdList = bIdList.filter(id=>id!=null)
        const contentParams = {
            library: libraryInView,
            pageIdList: pageIdList,
            bookIdList: bookIdList
        }

        dispatch(updateLibraryContent(contentParams)).then((result) =>{
            checkResult(result,payload=>{
                    window.alert("Success Library Content")
            },err=>{
                window.alert("Error" +err.message);
            })
        })

        const writers = roleList.filter(role=>role.role==RoleType.writer).map(role=>role.profile.userId)
        const editors = roleList.filter(role=>role.role==RoleType.editor).map(role=>role.profile.userId)
        const commenters = roleList.filter(role=>role.role==RoleType.commenter).map(role=>role.profile.userId)
        const readers = roleList.filter(role=>role.role==RoleType.reader).map(role=>role.profile.userId)
        const roleParams = {library:libraryInView,
            readers,
            commenters,
            editors,
            writers}
        dispatch(saveRolesForLibrary(roleParams)).then(result=>{
            checkResult(result,payload=>{
                window.alert("Roles Saved Successfully")
            },err=>{
                window.alert("Error saving roles")
            })
        })


    }
    const listItem = (hash)=>{
     
        if(hash.page){
            const {page} = hash
            
        return(
            <div key={`${hash.uId}`}className="list-item">
            <div>Page:{page.title}</div>
            <Button  onDoubleClick={()=>handleRemove(hash)
            }>Remove</Button>
        </div>)
        
    }else if(hash.book){
        const {book} = hash
        return(
            <div key={`${hash.uId}`}className="list-item">
            <div>Book:{book.title}</div>
            <Button  onDoubleClick={()=>handleRemove(hash)
            }>Remove</Button>
        </div>)
    }else{
            <div key={`${hash.uId}`} className="list-item">  
            <h1>Page Deleted</h1><Button  onDoubleClick={()=>handleRemove(hash)
            }>Remove</Button></div>
        }
    }
    const contentList = ()=>{
        if(libraryInView && (libraryInView.bookIdList.length>0 || libraryInView.pageIdList.length>0)){
        return (<div >
            <InfiniteScroll
      dataLength={listItems.length}
      next={fetchData}
      hasMore={listItems.length<(libraryInView.bookIdList.length+libraryInView.pageIdList.length)} // Replace with a condition based on your data source
      loader={<p>Loading...</p>}
      endMessage={<div className="no-more-data"><p>No more data to load.</p></div>}
    >
        {listItems.map(item =>{
            return listItem(item)
        })}
    </InfiniteScroll>
        </div>)}else{
            return(<div>
                    So Empty
            </div>)
        }
    }
  
    return (<div className="container">
        <div className="left-side-var">

        </div>
        <div className="main-bar">
        <div className="content-list">
            {contentList()}
            </div>
        </div>
        <div className="right-side-var">
            <div className="info">
                <div>
            {libraryInfo()}
            </div>
            <div>
               {libraryInView? <RoleList item={libraryInView} type="library" getRoles={(roleList) => {
                
                setRoleList(roleList)
                }}/>:<div></div>}
                  
            </div>
          </div>
        </div>
        <Dialog
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Deleting?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this page?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Disagree</Button>
          <Button onClick={()=>handleDelete()} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>)
}

export default UpdateLibraryContainer