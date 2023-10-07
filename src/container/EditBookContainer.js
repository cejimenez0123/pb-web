import { useParams } from "react-router-dom"
import { useDispatch,useSelector } from "react-redux"
import { useState,useEffect } from "react"
import { fetchBook,fetchBookRoles,saveRolesForBook,updateBook } from "../actions/BookActions"
import "../styles/EditBook.css"
import { fetchAllProfiles } from "../actions/UserActions"
import Page from "../domain/models/page"
import { fetchArrayOfPages } from "../actions/PageActions"
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
    const [bookPurpose,savePage] = useState("")
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
            fetchProfile()
            dispatch(fetchArrayOfPages(book.pageIdList))

        }).catch((err) => {
            
        });
              
    }
    useEffect(()=>{
        if(book){
            getPages(book.pageIdList)
        }
      
    },[book])
    const saveRoles=()=>{
        if(book!=null){
            const readers = bookRoles.filter(role => role.role == RoleType.reader)
            const commenters = bookRoles.filter(role => role.role == RoleType.commenter)
            const editors = bookRoles.filter(role => role.role == RoleType.editor)
            const writers = bookRoles.filter(role => role.role == RoleType.writer)
        const params = {
            bookId: book.id,
            readers,
            commenters,
            editors,
            writers}
    

        dispatch(saveRolesForBook(params))
        }}
    
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

    },[book])
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
        profile.userId,
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
       let roles = newBookRoles.filter(bookRole=>bookRole.profile == profile.id)
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
            <div className="book-roles">
                {bookRolesView()}
            </div>
            <div className="profile-list">
        <InfiniteScroll
        dataLength={profileList.length}
        next={fetchProfile}
        hasMore={profileHasMore} // Replace with a condition based on your data source
        loader={<p>Loading...</p>}
        endMessage={<p>No more data to load.</p>}
        scrollableTarget="scrollableDiv"
        >
            {profileList.map(profile=>{

                return(<div key={profile.id}>
                    {profile.username}
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
        return(  <SortableList
            items={listItems}
            setItems={setListItems}
            itemRender={(item)=>{
               return sortItem(item)}}>
            
            </SortableList>)
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
            <button type="button" onDoubleClick={()=>handleRemove(item.item)
            }>Remove</button>
        </div>))
    }
    const handleTitleChange = (e)=>{
        setBookTitle(e.target.value)
    }
    const handleSave = (e)=>{
        e.preventDefault()
        if(book!=null){
            saveRoles()
            const pageIdList = listItems.map(page=>  page.id)
            const params = {book:book,
                            title: bookTitle,
                            pageIdList:pageIdList,
                            privacy: bookIsPrivate,
                            writingIsOpen: writingIsOpen}
            dispatch(updateBook(params))
        }
    }
    if(!bookLoading && book!=null){
        
    

    return(<div className="container">
         
        <div className="left-side-bar">
            <h5> {book.title}</h5>
            <h6> {book.purpose}</h6>
        
            
        </div>
        <div className="main-bar">
        <div>
        <div>

      
            {sortableList()}
    </div>

    </div>
        </div>
        <div className="right-side-bar">
            <form onSubmit={(e)=>handleSave(e)}>
                <input onChange={(e)=>handleTitleChange(e)} type="text" className="form-control" value={bookTitle}/>
                <input onChange={()=>{
                    setBookPrivacy(!bookIsPrivate)
                }}type="checkbox" name="privacy" value={bookIsPrivate}/>
                <input onChange={()=>{
                    setWritingIsOpen(!writingIsOpen)
                }
                }type="checkbox" name="writingIsOpen" value={writingIsOpen}/>
                <button type="submit">Save</button>
            </form>
            <div className="roles">
                <div>
                    {roleList()}
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