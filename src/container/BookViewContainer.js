
import { fetchBook, setBookInView } from "../actions/BookActions"
import { useDispatch,useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect ,useState} from "react"
import { fetchArrayOfPages, fetchPage } from "../actions/PageActions"
import InfiniteScroll from "react-infinite-scroll-component"
import DashboardItem from "../components/DashboardItem"
import "../styles/BookView.css"
import { clearPagesInView } from "../actions/PageActions"
import {Button, IconButton} from "@mui/material"
import theme from "../theme"
import { setBookmarkLibrary, updateLibraryContent } from "../actions/LibraryActions"
import { fetchProfile ,createFollowBook,deleteFollowBook,fetchFollowBooksForProfile, updateHomeCollection, getCurrentProfile} from "../actions/UserActions"
import { Add, Settings } from "@mui/icons-material"
import debounce from "../core/debounce"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import checkResult from "../core/checkResult"
import useAuth from "../core/useAuth"
import history from "../history"
import { current } from "@reduxjs/toolkit"
function BookViewContainer({book}){

    const navigate = useNavigate()
    const pathParams = useParams()
    const dispatch = useDispatch()
    const bookLoading = useSelector(state=>state.books.loading)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const pageLoading = useSelector(state=>state.pages.loading)
    const [pages,setPages]=useState([])
    const [hasMore,setHasMore]=useState(false)
    const followedBooks = useSelector(state=>state.users.followedBooks)
    const homeCollection = useSelector(state=>state.users.homeCollection)
    const bookmarkLibrary = useSelector(state=>state.libraries.bookmarkLibrary)
    const [following,setFollowing]=useState(null)
    const [bookmarked,setBookmarked]=useState(false)
    const [error,setError]=useState(false)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
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
                        dispatch(setBookmarkLibrary({library}))
                         let found =library.bookIdList.find(id=>id==book.id)
                        setBookmarked(Boolean(found))
                        },()=>{
                        window.alert("Error saving bookmark")
                    })
                })
            }else{
                if(!Boolean(bookmarked)){
                    window.alert("You'll need to set a bookmark library")
                }else if(!Boolean(currentProfile)){
                    window.alert("First log in")
                }
            }
        }
        
    }
    const getBook=()=>{
      
      const bookId =pathParams["id"]
      
    if(book==null || (book!=null && book.id!=bookId)){
        const parameters = {
            id: bookId,
          }
        checkFetchBook(parameters)
    }else{
        const parameters = {
            id: book.id,
          }
        if(book.privacy ){
            checkFetchBook(parameters)
        }else{
             const params = { book: null}
             dispatch(setBookInView(params))
           
        }
    }
    }
    const checkFetchBook=(parameters)=>{
        dispatch(clearPagesInView())
        dispatch(fetchBook(parameters)).then((result) => {
            checkResult(result,(payload)=>{

            if(payload.book && payload.book.privacy){ 
                let founa = payload.book.readers.find(id=>currentProfile && id==currentProfile.userId)
                let founb= payload.book.commenters.find(id=> currentProfile && id==currentProfile.userId)
                let founc = payload.book.writers.find(id=>currentProfile && id==currentProfile.userId)
                let found = payload.book.editors.find(id=>currentProfile && id==currentProfile.userId)
                let owner = currentProfile && payload.book.profileId == currentProfile.id        
                console.log("TOUCH")
                if(founa || founb || founc || found||owner) {
                    setError(false)
                }else{
                if(!bookLoading && !currentProfile){
                    setError(true)
                }else if(!currentProfile){
                    history.back()
                }}
            }else{
                setError(false)
                const profileParams = {
                    id: payload.book.profileId
                }
                dispatch(fetchProfile(profileParams))}
            },(err)=>{
                setError(true)
            })
                
        });
    }
    useEffect(()=>{
        if(book){
            const params = {
                id:book.id
            }
            checkFetchBook(params)
        }
       
    },[currentProfile])
    const getPages = ()=>{
        setPages([])
        if(book){
            if(!book.privacy){
                setHasMore(true)
                book.pageIdList.forEach(pId=>{
                    const params ={ id:pId}
                    dispatch(fetchPage(params)).then(result=>{
                        checkResult(result,payload=>{
                            const {page} = payload
                            setPages(prevState=>[...prevState,page])
                        },err=>{
                            setPages(prevState=>[...prevState,{id:pId}])
                        })
                    })})
                if(pages.length==book.pageIdList.length){
                    setHasMore(false)
                }
            }else{
    
        setHasMore(true)
                book.pageIdList.forEach(pId=>{
                    const params ={ id:pId}
                    dispatch(fetchPage(params)).then(result=>{
                        checkResult(result,payload=>{
                            const {page} = payload
                            setPages(prevState=>[...prevState,page])
                        },err=>{
                            setPages(prevState=>[...prevState,{id:pId}])
                        })
                    })})
                if(pages.length==book.pageIdList.length){
                    setHasMore(false)
                }
        }}}
    
    useEffect(()=>{

        if(book){
            setHasMore(true)
            getPages(book.pageIdList)
            fetchFollows()
        }else{
            getBook()
            fetchFollows()
            getPages()
        }

    },[book,currentProfile])
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
                    let fb= followList.find(fb=>fb!=null && book && fb.bookId == book.id && fb.profileId==currentProfile.id)
                    setFollowing(fb)
                },()=>{

                })

            })
            
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
                
                if(page){
                    return(<DashboardItem  key={page.id} book={book}page={page}/>)
                }else{
                    return(<div className="Empty"> Page has been deleted</div>)
                }
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
  if(book && !error){

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
        

    </div>)}else if(error){
        return(
            <div className="evenly container view">
          
            <h2>This book isn't for your eyes.</h2>
             
     
            
    
        </div> 
        )  
    
    }else{
        <div className="container">

            <h1>Book is loading</h1>

        </div>
    }
}
export default BookViewContainer