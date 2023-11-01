import { useParams } from "react-router-dom"
import { useDispatch,useSelector } from "react-redux"
import { useState,useEffect } from "react"
import { fetchBook,saveRolesForBook,updateBook } from "../actions/BookActions"
import "../styles/EditBook.css"
import { fetchAllProfiles } from "../actions/UserActions"
import {  fetchArrayOfPages } from "../actions/PageActions"
import { MenuItem } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '@mui/base/MenuButton'
import { Menu } from '@mui/base/Menu';
import { SortableList } from '@thaddeusjiang/react-sortable-list';
import '@thaddeusjiang/react-sortable-list/dist/index.css';
import InfiniteScroll from "react-infinite-scroll-component"
import BookRole from "../domain/models/bookrole"
import { RoleType } from "../core/constants"
import Profile from "../domain/models/profile"
import { TextareaAutosize } from '@mui/base/TextareaAutosize'
import { TextField ,Checkbox, FormControlLabel,Button, FormGroup} from "@mui/material"
import RoleList from "../components/RoleList"
import theme from "../theme"
import checkResult from "../core/checkResult"
function EditBookContainer({book,pages}){
    
    const pathParams = useParams()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const bookLoading = useSelector(state=>state.books.loading)
    const pageLoading = useSelector(state=>state.pages.loading)
    const [newBookRoles, setNewBookRoles ]= useState([BookRole])
    const bookRoles = useSelector(state=>state.books.bookRoles)
    const [profileList,setProfileList] = useState([Profile])
    const profilesInView = useSelector(state=>state.users.profilesInView)
    const [bookTitle,setBookTitle] = useState("")
    const [bookIsPrivate,setBookPrivacy]= useState(false)
    const [bookPurpose,setBookPurpose] = useState("")
    const [writingIsOpen,setWritingIsOpen]= useState(false)
    const [hasMore,setHasMore]=useState(false)
    const [profileHasMore,setProfileHasMore]= useState(false)
    const [page,setPage] = useState(1)
    const [listItems, setListItems] = useState([
    ]);
    const getBook=()=>{
      
      const bookId =pathParams["id"]
   
      const parameters = {
        id: bookId,
      }
     dispatch(fetchBook(parameters)).then((result) => {
            const {payload} = result
            const {book} = payload
            setBookTitle(book.title)
            setBookPrivacy(book.privacy)
            setWritingIsOpen(book.writingIsOpen)
            setBookPurpose(book.purpose)
            if(book.pageIdList.length>0){
                dispatch(fetchArrayOfPages(book.pageIdList))
            }
         
            fetchProfile()
      

        }).catch((err) => {
            
        });
              
    }
    useEffect(()=>{
        if(book){
            getPages(book.pageIdList)
        }
      
    },[])

    
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
        const params = {pageIdList:pageIdList}
    
        dispatch(fetchArrayOfPages(params)).then((result) => {
            if(!result.error){
                const {payload } = result
                const {pageList} = payload
                setListItems(pageList)
              
            }
        }).catch((err) => {
            setHasMore(false)
        });

    }
    
    useEffect(()=>{
     
            getBook()
        
    },[])
    useEffect(()=>{

        if(book){
            setHasMore(true)
            getPages(book.pageIdList)
        }

    },[])
const bookRolesView =  ()=>{
    if(newBookRoles!=null && newBookRoles.length > 0){

        return (<div>
            {       
                    newBookRoles.map((role)=>{
                        let username = ""
                        let id = ""
                        let profile = profilesInView.find(prof=>prof.id==role.profileId)
                        if(profile){
                            username=profile.username
                            id = profile.id
                        }
                        return(<div key={id}>
                            <div>
                                {username}
                            </div>
                            <Dropdown>
                                <MenuButton>
                                {role.role}
                                </MenuButton>
                                <Menu>
                                    <MenuItem onClick={()=>handleChosingProfileRole(profile,"")}>
                                        Delete
                                    </MenuItem>
                                    <MenuItem onClick={()=>handleChosingProfileRole(profile,RoleType.editor)}>
                                        Editor
                                    </MenuItem>
                                    <MenuItem onClick={()=>handleChosingProfileRole(profile,RoleType.writer)}>
                                        Writer
                                    </MenuItem>
                                    <MenuItem onClick={()=>handleChosingProfileRole(profile,RoleType.commenter)}>
                                        Commenter
                                    </MenuItem>
                                    <MenuItem onClick={()=>handleChosingProfileRole(profile,RoleType.reader)}>
                                        Reader
                                    </MenuItem>
                                </Menu>
                            </Dropdown>
                            </div>)
                    })
                }
        </div>)
    }else{
        return(<div >

        </div>)
    }
}
const handleChosingProfileRole =(profile,role)=>{
    const br = new BookRole( null,
        profile,
        book.id,
        role
        )
   
    if(role.length > 0){
    
        let profiles = profileList.filter(prof=>{
            return profile.id != prof.id
        })
        setNewBookRoles(prevState=>{
            return [...prevState,br]
        })
        setProfileList(profiles)
        
    }else{
       let roles = newBookRoles.filter(bookRole=>bookRole.profile.id == profile.id)
       setNewBookRoles(roles) 
       setProfileList(prevState=>{
            return [...prevState, profile]
        })
    }

}

const roleList = ()=>{
    if(profileList!=null && profileList.length > 0){
        return ( 
        <div>
            <div className="item-roles">
                {bookRolesView()}
            </div>
            <div className="role-list">
        <InfiniteScroll
        dataLength={profileList.length}
        next={fetchProfile}
        hasMore={profileHasMore} // Replace with a condition based on your data source
        loader={<p>Loading...</p>}
        endMessage={<p>No more data to load.</p>}
        scrollableTarget="scrollableDiv"
        >
            {profileList.map(profile=>{

                return(<div className="role-item" key={profile.id}>
                    
                    <div>
                        {profile.username}
                    </div>
                    <div>
                    <Dropdown>
                        <MenuButton>
                            Role
                        </MenuButton>
                        <Menu>
                            <MenuItem onClick={()=>handleChosingProfileRole(profile,RoleType.editor)}>
                                Editor
                            </MenuItem>
                            <MenuItem onClick={()=>handleChosingProfileRole(profile,RoleType.writer)}>
                                Writer
                            </MenuItem>
                            <MenuItem onClick={()=>handleChosingProfileRole(profile,RoleType.commenter)}>
                                Commenter
                            </MenuItem>
                            <MenuItem onClick={()=>handleChosingProfileRole(profile,RoleType.reader)}>
                                Reader
                            </MenuItem>
                        </Menu>
                    </Dropdown> 
                    </div>
                </div>)
            })}
        </InfiniteScroll>
        </div>
        </div>)
    }else{
        return (<div>
            Loading...
        </div>)
    }
}
const handleRemove = (page)=>{
    let list  =listItems.filter((item)=>{return item.id != page.id})
    setListItems(list)
    setHasMore(false)
}
const sortableList = ()=>{
    if(listItems.length == 0){
        return (<div>
            Empty
        </div>)
   
    }else  if(!!listItems){

        return( <div id="sort-list">

         <SortableList
        
            items={listItems}
            setItems={setListItems}
            itemRender={(item)=>{
               return sortItem(item)}}>
            
            </SortableList>
            </div>)
    }else{
        return(<div>
            Loading...
        </div>)
    }
}

    const sortItem = (item)=>{
        return((
            <div className="sort-item">
            <h1>{item.item.title} </h1>
            <Button  onDoubleClick={()=>handleRemove(item.item)
            }>Remove</Button>
        </div>))
    }
    const handleTitleChange = (e)=>{
        setBookTitle(e.target.value)
    }
    const handleSave = (e)=>{
        e.preventDefault()
        if(book!=null){
            
            const pageIdList = listItems.map(page=>  page.id)
            const params = {book:book,
                            title: bookTitle,
                            pageIdList:pageIdList,
                            purpose: bookPurpose,
                            privacy: bookIsPrivate,
                            writingIsOpen: writingIsOpen}
            dispatch(updateBook(params)).then(result=>{
                checkResult(result,payload=>{
                    window.alert("Book Info Updated")
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
    if(!bookLoading && book!=null){
        
        const form = ()=>{
            return( <FormGroup style={{padding:"0 2em",margin:"auto"}} >
                <TextField
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
                </FormGroup>)
        }

    return(<div id="EditBook" className="container">
            
            <div className="left-bar">
            {sortableList()}
            </div>

      
            
    
            <div className="right-bar">
                <div className="edit">
                <div >
                    {form()}
                <div className="roles">
                    <RoleList book={book} type={"book"} getRoles={roles=>{
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