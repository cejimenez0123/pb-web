
import { fetchBook, setBookInView } from "../actions/BookActions"
import { useDispatch,useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect ,useState} from "react"
import { fetchArrayOfPages } from "../actions/PageActions"
import InfiniteScroll from "react-infinite-scroll-component"
import DashboardItem from "../components/DashboardItem"
import "../styles/BookView.css"
import { clearPagesInView } from "../actions/PageActions"
import {Button, IconButton} from "@mui/material"
import theme from "../theme"
import { updateLibraryContent } from "../actions/LibraryActions"
import { fetchProfile ,createFollowBook,deleteFollowBook,fetchFollowBooksForProfile, updateHomeCollection, getCurrentProfile} from "../actions/UserActions"
import { Add, Settings } from "@mui/icons-material"
import debounce from "../core/debounce"
import { canAddToItem } from "../core/constants"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import checkResult from "../core/checkResult"
import useAuth from "../core/useAuth"
function BookViewContainer({book,pages}){
    const authState = useAuth()
    const navigate = useNavigate()
    const pathParams = useParams()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const pageLoading = useSelector(state=>state.pages.loading)
    const [hasMore,setHasMore]=useState(false)
    const followedBooks = useSelector(state=>state.users.followedBooks)
    const homeCollection = useSelector(state=>state.users.homeCollection)
    const bookmarkLibrary = useSelector(state=>state.libraries.bookmarkLibrary)
    const [following,setFollowing]=useState(null)
    const [bookmarked,setBookmarked]=useState(false)
    
    useEffect(()=>{
        if(bookmarkLibrary && book){
           let found = bookmarkLibrary.bookIdList.find(id=>id==book.id)
           setBookmarked(Boolean(found))
        }
    },[book,bookmarkLibrary])
    const onBookmarkPage = ()=>{
        if(bookmarked && book){
        let bookIdList = bookmarkLibrary.bookIdList.filter(id=>id!=book.id)
        const params = {
            library:bookmarkLibrary,
            pageIdList:bookmarkLibrary.pageIdList,
            bookIdList:bookIdList
              }
              dispatch(updateLibraryContent(params))
              setBookmarked(false)
        }else{
            if(bookmarkLibrary && currentProfile &&book){
                const bookIdList = [...bookmarkLibrary.bookIdList,book.id]
                const params = {
                    library:bookmarkLibrary,
                    pageIdList:bookmarkLibrary.pageIdList,
                    bookIdList:bookIdList
                      }
                dispatch(updateLibraryContent(params)).then(result=>{
                    checkResult(result,(payload)=>{
                    const {library} = payload
                         let found =library.bookIdList.find(id=>id==book.id)
                        setBookmarked(Boolean(found))
                        },()=>{
    
                    })
                })
            }
        }
        
    }
    const getBook=()=>{
      
      const bookId =pathParams["id"]
      const parameters = {
        id: bookId,
      }
       if(book==null || (book!=null && book.id!=bookId)){
        dispatch(clearPagesInView())
        dispatch(fetchBook(parameters)).then((result) => {
            checkResult(result,(payload)=>{
                const profileParams = {
                    id: payload.book.profileId
                }
                dispatch(fetchProfile(profileParams))
            },()=>{

            })
                
        }).catch((err) => {
            
        });
    }else{
        const profileParams = {
            id: book.profileId,
        }
        dispatch(fetchProfile(profileParams));
    }
    }
    const getPages = (pageIdList)=>{
        const params = {pageIdList:pageIdList}
    
        dispatch(fetchArrayOfPages(params)).then((result) => {
            if(!result.error){
          
                setHasMore(false)
            }
        }).catch((err) => {
            setHasMore(false)
        });

    }
    useEffect(()=>{

        if(book){
            setHasMore(true)
            getPages(book.pageIdList)
            fetchFollows()
        }else{
            getBook()
            fetchFollows()
        }

    },[book])
    useEffect(()=>{
        fetchFollows()
    },[currentProfile])
   
    const fetchFollows=()=>{
        if(currentProfile && book){
            const params = {
                profile: currentProfile

            }
            dispatch(fetchFollowBooksForProfile(params)).then(result=>{
                checkResult(result,payload=>{
                    const {followList}=payload
                    let fb= followList.find(fb=>fb!=null && fb.bookId == book.id && fb.profileId==currentProfile.id)
                    setFollowing(fb)
                },()=>{

                })

            })
            
        }else{
            if(authState.user && !Boolean(currentProfile) || (currentProfile && currentProfile.userId == authState.user.uid)){
                const params = {
                    userId: authState.user.uid,
                }
                dispatch(getCurrentProfile(params))
            }
        }
    }
   
    const pageList =()=>{
        if(pageLoading==false && !!book){
            if(pages && pages.length !=0){
                return(
                    <div className="content">
                     <InfiniteScroll 
                            dataLength={pages.length}
                            next={()=>getPages(book.pageIdList)}
                            hasMore={hasMore} // Replace with a condition based on your data source
                            loader={<p>Loading...</p>}
                            endMessage={<p>No more data to load.</p>}
                            scrollableTarget="scrollableDiv"
     >
         {pages.map(page =>{
                 return(<DashboardItem  key={page.id} book={book}page={page}/>)
         })}
     </InfiniteScroll>
                    </div>
                )
            }else{
                return(
                <h1>0</h1>
            )}
        }else{
            return (<div>
                Loading...
            </div>)
        }
    }
    const followBookClick = ()=>{
        if(currentProfile){
        const params = {
            book: book,
            profile:currentProfile
        }
        dispatch(createFollowBook(params)).then(result=>{
           checkResult(result,payload=>{ 
            let books = [...homeCollection.books]
            let id = homeCollection.books.find(id=>book.id)
            if(!id){
               books=[...homeCollection.books,book.id]
            }
            let libraries = [...homeCollection.libraries]
            let pages = [...homeCollection.pages]
            let profiles = [...homeCollection.profiles]
            const homeParams ={
                profile: currentProfile,
                books: books,
                pages: pages,
                libraries:libraries,
                profiles:profiles
            }
            dispatch(updateHomeCollection(homeParams))
        },()=>{
            window.alert("Log in first")
        })})
    }}

    const deleteFollowBookClick = ()=>{ 
       
        if(currentProfile && book){
            let fb = followedBooks.find(fb=>
                fb!=null && fb.id==`${currentProfile.id}_${book.id}`)
            const params = {
                followBook: fb,
                book: book,
                profile: currentProfile
            }
            dispatch(deleteFollowBook(params)).then(()=>{
                fetchFollows()
            })
        }
    }
    let editDiv = (<div>

    </div>)
    const followDiv = ()=>{
        return following?(
            <Button variant="outlined" 
                    style={{backgroundColor:theme.palette.secondary.light,
                            color:theme.palette.secondary.dark}
                    } 
                    lassName="follow-btn"
                    onClick={()=> debounce(deleteFollowBookClick(),10)}>Following</Button>)
    :(<Button    variant="outlined" 
                                style={{backgroundColor:theme.palette.secondary.main,
                                        color:theme.palette.secondary.contrastText}}
                                className="follow-btn"
    onClick={
       ()=>debounce(followBookClick(),10)
   }>Follow</Button>)}

    if(followedBooks && currentProfile && book && book.profileId == currentProfile.id){
        editDiv = (<Button
                        key={book.id}
                        onClick={(e)=>{
                            navigate(`/book/${book.id}/edit`)
                    }}><Settings/></Button>)
    }
           


    
   const addBtn =()=>{
    
    if(currentProfile&&book){
        let owner = book.profileId == currentProfile.id
        let writer =book.writers.find(id=>currentProfile.userId==id)
        let editor = book.editors.find(id=>currentProfile.userId==id)
       if(Boolean(owner)||Boolean(writer)||Boolean(editor)){
        return (<IconButton onClick={()=>{
        setBookInView({book})
        navigate(`/book/${book.id}/add`)

       }}>
            <Add/>
        </IconButton>)
    }}
    return(<div></div>)
}
  if(book){

    return(<div className="evenly container view">
          
        <div className="left-bar">
            <div className="info view">
            <h5> {book.title}</h5>
            <div className="purpose">
            <h6> {book.purpose}</h6>
           
            </div>
            {followDiv()}
            <div>

            <div className="button-row">
            {addBtn()}
            {editDiv}
            {bookmarked?<IconButton onClick={onBookmarkPage}><BookmarkIcon/></IconButton>:
            <IconButton disabled={!currentProfile}onClick={onBookmarkPage}><BookmarkBorderIcon/></IconButton>}
                   </div>
                   </div>
            </div>
        </div>
        <div className="right-bar">
           <div className="content-list dashboard">
            {pageList()}
            </div>
        </div>
        

    </div>)}else{
        <div className="container">

            <h1>Book is loading</h1>

        </div>
    }
}
export default BookViewContainer