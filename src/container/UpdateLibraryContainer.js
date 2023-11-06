import { useEffect, useState } from "react"
import { useSelector,useDispatch } from "react-redux"
import {fetchArrayOfBooks, fetchBook} from "../actions/BookActions"
import { fetchArrayOfPages,clearPagesInView} from "../actions/PageActions"
import {    updateLibrary,
            fetchLibrary,
            saveRolesForLibrary,
            updateLibraryContent } from "../actions/LibraryActions"
import { useParams,useNavigate } from "react-router-dom"
import { getCurrentProfile } from "../actions/UserActions"
import InfiniteScroll from "react-infinite-scroll-component"
import RoleList from "../components/RoleList"
import "../styles/UpdateLibrary.css"
import {Checkbox , Button, FormGroup, TextField,FormControlLabel } from "@mui/material"
import { RoleType } from "../core/constants"
import useAuth from "../core/useAuth"
import checkResult from "../core/checkResult"
import uuidv4 from "../core/uuidv4"
function UpdateLibraryContainer(props) {
    const authHook = useAuth() 
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const pathParams = useParams()
    const libraryInView = useSelector(state=>state.libraries.libraryInView)
    const [libraryName, setLibraryName]= useState("")
    const [writingIsOpen,setWritingIsOpen]=useState(false)
    const [privacy,setPrivacy]=useState(false)
    const [purpose,setPurpose]=useState("")
    const [hasMore,setHasMore]=useState(true)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const bookmarkLibrary = useSelector(state=>state.libraries.bookmarkLibrary)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const booksInView = useSelector(state=>state.books.booksInView)
    const [itemsInLibrary,setItemsInLibrary] = useState([])
    const [roleList,setRoleList]=useState([])
    const [contentItems,setContentItems]=useState([])
    const [listItems,setListItems]=useState([])
    const { id } = pathParams
    useEffect(()=>{
        
            if(currentProfile){
            
            }else{
                // if(authHook.user){
                //     const params = {
                //      userId: authHook.user.uid
                //     }
                //     dispatch(getCurrentProfile(params))
                // }
            }
    }

    ,[])
    const start =()=>{
        dispatch(fetchLibrary(pathParams)).then((result)=>{
            setLibrary()
            dispatch(clearPagesInView())
            fetchData()
          
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
  
    useEffect(()=>{
        if(libraryInView!=null && libraryInView.id==id){
            setContentItems([])
            setListItems([])
            fetchBooks()
            fetchPages()
        }else{
            start()
        }
    },[])
    useEffect(()=>{     
       setLibrary()
    },[])


    const fetchBooks =()=>{
        if(libraryInView){
            
            libraryInView.bookIdList.forEach(bId=>{
                const params ={
                    id: bId
                }
                setHasMore(true)
                dispatch(fetchBook(params)).then(result=>checkResult(result,payload=>{
                        const {book}=payload;
                        let uId = `${book.id}_${uuidv4()}`
                        const item = {uId:uId,book:book }
                        setListItems(prevState=>[...prevState,item])
                        setHasMore(false)
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
        if(libraryInView){
            // const paramsA = {pageIdList:libraryInView.pageIdList,profile:currentProfile}
            libraryInView.pageIdList.forEach(pId=>{
                dispatch(fetchPages({id:pId})).then(result=>checkResult(result,payload=>{
                    const {page}= payload
                    let item = {uId:`${page.id}_${uuidv4()}`,page:page}
                    setListItems(prevState=>[...prevState,item])
                },err=>{

                }))
            })
        }
                

}

    const fetchData = () =>{
        if(currentProfile){
        const params = { 
            profileId: currentProfile.id,
            page: 1,
            groupBy: 9
        }
        fetchPages()
    }}
    const libraryInfo=()=>{
        return (<div className="library-update">
            <FormGroup>
            
                <TextField type="text"  value={libraryName} 
                                    onChange={(e)=>{
                                        setLibraryName(e.target.value)
                                    }

                }/>
                    <FormControlLabel control={<Checkbox checked={privacy} onChange={(e)=>{

            setPrivacy(!privacy)}} />} label="Private" />
        
                 <FormControlLabel control={<Checkbox  onChange={(e)=>{
                    setWritingIsOpen(!writingIsOpen)
                }} checked={writingIsOpen} />} label="Writing is Open" />
               
                <Button style={{ backgroundColor: "rgb(24, 69, 24)",
    color:"white"}}type="submit" variant="outlined" onClick={(e)=>updateLibraryDetails(e)}>Update</Button>
            </FormGroup>
          
        </div>)
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
            const {payload} = result
            if(payload.error!=null){
                let error  = window.confirm(`${payload.error.message}`)
                window.alert(error)
            }else{
                let updateed = window.confirm(`Updated`)
                window.alert(updateed)
            }
        })
        const pageIdList  = itemsInLibrary.filter(item => item.type==="page").map(item => item.item.id)
        const bookIdList  = itemsInLibrary.filter(item => item.type==="book").map(item => item.item.id)
        const contentParams = {
            library: libraryInView,
            pageIdList: pageIdList,
            bookIdList: bookIdList
        }

        dispatch(updateLibraryContent(contentParams)).then((result) =>{
            let {id }= pathParams
            if(result.error==null){
            navigate(`/library/${id}`)
            }
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
        dispatch(saveRolesForLibrary(roleParams))


    }
    const listItem = (hash)=>{
     
        if(hash.page){
            const {page} = hash
            
        return(
            <div key={`${hash.uId}`}className="sort-item">
            <div>{page.title}</div>
            <Button  onDoubleClick={()=>handleRemove(hash)
            }>Remove</Button>
        </div>)
        
    }else if(hash.book){
        const {book} = hash
        return(
            <div key={`${hash.uId}`}className="sort-item">
            <div>{book.title}</div>
            <Button  onDoubleClick={()=>handleRemove(hash)
            }>Remove</Button>
        </div>)
    }else{
            <div key={`${hash.uId}`} className="sort-item">  
            <h1>Page Deleted</h1><Button  onDoubleClick={()=>handleRemove(hash)
            }>Remove</Button></div>
        }
    }
    const contentList = ()=>{
        if(contentItems!=null){
        return (<div >
            <InfiniteScroll
      dataLength={contentItems.length}
      next={fetchData}
      hasMore={hasMore} // Replace with a condition based on your data source
      loader={<p>Loading...</p>}
      endMessage={<p>No more data to load.</p>}
    >
        {listItems.map(item =>{
            return listItem(item)
        //    let item = itemsInLibrary.find(ha=>{
        //         return ha.item.id == hash.item.id
        //     })
                
        //         return(<div className="list-item "key={hash.item.id}>
        //             <div className="item-info">
        //                 <h5>{hash.type}</h5>
        //                 <h5>{hash.item.title}</h5>
        //             </div>
        //             <input type="checkbox" checked={item} onChange={()=>{
                        
        //                     if(item){
        //                         let newList = itemsInLibrary.filter(  item => item.item.id !== hash.item.id)
        //                         setItemsInLibrary(newList)
        //                     }else{
        //                         setItemsInLibrary(prevState=>[...prevState,hash])
        //                     }
                    
        //             }}/>
        //         </div>)
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
                <RoleList item={libraryInView} getRoles={(roleList) => {
                
                setRoleList(roleList)
                }}/>
                  
            </div>
          </div>
        </div>

    </div>)
}
function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }
export default UpdateLibraryContainer