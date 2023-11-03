import { useParams } from "react-router-dom"
import { useDispatch,useSelector } from "react-redux"
import { useState,useEffect,Component } from "react"
import { fetchBook,saveRolesForBook,updateBook } from "../actions/BookActions"
import "../styles/EditBook.css"
import { fetchAllProfiles } from "../actions/UserActions"
import {  fetchArrayOfPages } from "../actions/PageActions"
import { SortableList } from '@thaddeusjiang/react-sortable-list';
import '@thaddeusjiang/react-sortable-list/dist/index.css';
import BookRole from "../domain/models/bookrole"
import { RoleType } from "../core/constants"
import Profile from "../domain/models/profile"
import { TextareaAutosize } from '@mui/base/TextareaAutosize'
import { TextField ,Checkbox, FormControlLabel,Button, FormGroup} from "@mui/material"
import RoleList from "../components/RoleList"
import theme from "../theme"
import checkResult from "../core/checkResult"
import { current } from "@reduxjs/toolkit"
function EditBookContainer({book,pages}){   
    const pathParams = useParams()
    const dispatch = useDispatch()
    const bookLoading = useSelector(state=>state.books.loading)
    const [newBookRoles, setNewBookRoles ]= useState([BookRole])
    const [profileList,setProfileList] = useState([Profile])
    const profilesInView = useSelector(state=>state.users.profilesInView)
    const [bookTitle,setBookTitle] = useState("")
    const [bookIsPrivate,setBookPrivacy]= useState(false)
    const [bookPurpose,setBookPurpose] = useState("")
    const [writingIsOpen,setWritingIsOpen]= useState(false)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [profileHasMore,setProfileHasMore]= useState(false)
    const [listItems, setListItems] = useState([
    ]);
    const getBook=()=>{
      
      const bookId =pathParams["id"]
   
      const parameters = {
        id: bookId,
      }
    // if(book==null || book.id != bookId){
       if(book==null || book.id != bookId){ 
     dispatch(fetchBook(parameters)).then((result) => {
            const {payload} = result
            const {gotBook} = payload
            setBookTitle(gotBook.title)
            setBookPrivacy(gotBook.privacy)
            setWritingIsOpen(gotBook.writingIsOpen)
            setBookPurpose(gotBook.purpose)
            getPages(gotBook.pageIdList)
         
            fetchProfile()
      

        }).catch((err) => {
            
        });
       }else if(book!=null && book.id == bookId) {
            setBookTitle(book.title)
            setBookPrivacy(book.privacy)
            setWritingIsOpen(book.writingIsOpen)
            setBookPurpose(book.purpose)
            getPages(book.pageIdList)
       }
    }
    useEffect(()=>{
        getBook()
    },[book])
  

    
    const fetchProfile=()=>{
        dispatch(fetchAllProfiles()).then((result) => {
            const {payload} = result
            const {profileList } = payload
            const list = profileList.filter(profile=>{
                const br  = newBookRoles.find(br=>
                    br.profileId == profile.id)
                return !br
            })
            setProfileList(list)
        })
    }
    const getPages = (pageIdList)=>{
        const params = {pageIdList:pageIdList,profile:currentProfile}
      if(pageIdList.length > 0){
        dispatch(fetchArrayOfPages(params)).then((result) => {
            checkResult(result,payload=>{

        
                const {pageList} = payload
                setListItems([])
                if(book.pageIdList.length>0){
                book.pageIdList.forEach(id=>
                    {
                        let page = pageList.find(p=>p.id==id)
                        const item = {id:id, item:page}
                        setListItems(prevState=>[...prevState,item])
                    })
                }
            },()=>{

            })
            }).catch((err) => {
          
        });
    }else{
        setListItems([])
    }
    }
    
    useEffect(()=>{
     
            getBook()
        
    },[])


const handleRemove = (hash)=>{
  
    let list  =listItems.filter((item)=>{return item.item && hash.item && item.item.id != hash.item.id})
    
    setListItems(list)
    console.log(`ldsisn ${JSON.stringify(list)}`)
    
}
const sortableList = ()=>{
    if(listItems.length == 0){
        return (<div>
            Empty
        </div>)
   
    }else if(listItems){
        let index = 0
        return( <div id="sort-list">
            Double Click to Remove
         <SortableList
        
            items={listItems}
            setItems={setListItems}
            itemRender={(item)=>{
                index+=1
               return sortItem(item,index)}}>
            
            </SortableList>
            </div>)
    }else{
        return(<div>
            Loading...
        </div>)
    }
}

    const sortItem = (item,index)=>{
        if(item.item){
        return(
            <div key={`${item.id}_${index}`}className="sort-item">
            <h1>{item.item.title} </h1>
            <Button  onDoubleClick={()=>handleRemove(item)
            }>Remove</Button>
        </div>)
        
    }else{
            <div key={`${item.id}_${index}`} className="sort-item">  
            Page Delete<Button  onDoubleClick={()=>handleRemove(item)
            }>Remove</Button></div>
        }
    }
    const handleTitleChange = (e)=>{
        setBookTitle(e.target.value)
    }
    const handleSave = (e)=>{
        e.preventDefault()
        if(book!=null){
            let pageIdList = []
            if(listItems.length>0){
              pageIdList  = listItems.map(page=>  page.id)
            }
           

            const params = {book:book,
                            title: bookTitle,
                            pageIdList:pageIdList,
                            purpose: bookPurpose,
                            privacy: bookIsPrivate,
                            writingIsOpen: writingIsOpen}
            dispatch(updateBook(params)).then(result=>{
                checkResult(result,payload=>{
                    window.alert("Book Info Updated")
                    getPages(pageIdList)
                })
               
            })
            const readers = newBookRoles.filter(role => role.role == RoleType.reader).map(role=>role.profile.userId)
            const commenters = newBookRoles.filter(role => role.role == RoleType.commenter).map(role=>role.profile.userId)
            const editors = newBookRoles.filter(role => role.role == RoleType.editor).map(role=>role.profile.userId)
            const writers = newBookRoles.filter(role => role.role == RoleType.writer).map(role=>role.profile.userId)
            
       
            const rolesParams = {
            book: book,
            readers,
            commenters,
            editors,
            writers}
    

        dispatch(saveRolesForBook(rolesParams)).then(result=>{
            checkResult(result,payload=>{
                window.alert("Roles saved successfully")
            })
        })
        }
    }
    const form = ()=>{
        return( <FormGroup style={{padding:"0 2em",margin:"auto"}} >
            <TextField
                style={{backgroundColor:theme.palette.primary.contrastText}}
                onChange={(e)=>handleTitleChange(e)}
                id="standard-required"
                label="Title"
                value={bookTitle}
            />
            <FormControlLabel 
            control={<Checkbox checked={bookIsPrivate} onChange={()=>{
                setBookPrivacy(!bookIsPrivate)
            }}/>} label="Private" 
               value={bookIsPrivate}/>
                 <FormControlLabel 
                    control={<Checkbox 
                                checked={writingIsOpen}
                                onChange={()=>{
                                    setWritingIsOpen(!writingIsOpen) 
                                }}/>} 
                                label="Writing is Open to Others"
                            />
               <div id="purpose">
                <label>Purpose</label>         
                <TextareaAutosize value={bookPurpose}
                                            minRows={3} 
                                            onChange={(e)=>{
                                            setBookPurpose(e.target.value)   
                                        }}  
                                            
                                    />
                     </div> 
            
                <Button onClick={handleSave} style={{backgroundColor:theme.palette.secondary.main}}variant="contained"type="submit">Save</Button>
            </FormGroup>)}
    if(!bookLoading && book!=null){

    return(<div id="EditBook" className="container">
            
            <div className="left-bar">
                {sortableList()}
            </div>

      
            
    
            <div className="right-bar">
                <div className="edit">
                <div >
                    {form()}
                <div className="roles">
                    <RoleList item={book} book={book} type={"book"} getRoles={roles=>{
                        setNewBookRoles(roles)
                    }} />
                </div>
                </div>
            </div>
        </div>

    </div>)}else{
        
        return(<div>
            Loading...
        </div>)
    }
}




export default EditBookContainer