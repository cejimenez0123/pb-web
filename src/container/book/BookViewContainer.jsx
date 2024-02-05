
import { fetchBook, setBookInView } from "../../actions/BookActions"
import { useDispatch,useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect ,useState} from "react"
import { fetchPage } from "../../actions/PageActions"
import InfiniteScroll from "react-infinite-scroll-component"
import DashboardItem from "../../components/DashboardItem"
import "../../styles/BookView.css"
import "../../App.css"
import {Button, IconButton} from "@mui/material"
import theme from "../../theme"
import { setBookmarkLibrary,
        updateLibraryContent } from "../../actions/LibraryActions"
import {    fetchProfile ,
            createFollowBook,
            deleteFollowBook,
            fetchFollowBooksForProfile, 
            updateHomeCollection, 
            } from "../../actions/UserActions"
import { Add, Settings } from "@mui/icons-material"
import debounce from "../../core/debounce"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import checkResult from "../../core/checkResult"
import { iconStyle } from "../../styles/styles"
import {Helmet} from "react-helmet"
import Page from "../../domain/models/page"
import { PageType } from "../../core/constants"
import Contributors from "../../domain/models/contributor"
function BookViewContainer({book}){
    const navigate = useNavigate()
    const pathParams = useParams()
    const dispatch = useDispatch()
    const bookLoading = useSelector(state=>state.books.loading)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [pages,setPages]=useState([])
    const [hasMore,setHasMore]=useState(false)
    const followedBooks = useSelector(state=>state.users.followedBooks)
    const homeCollection = useSelector(state=>state.users.homeCollection)
    const bookmarkLibrary = useSelector(state=>state.libraries.bookmarkLibrary)
    const [following,setFollowing]=useState(null)
    const [bookmarked,setBookmarked]=useState(false)
    const [error,setError]=useState(false)

    
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
        const params = {id:bookId}
        dispatch(fetchBook(params)).then(result=>{
                checkResult(result,payload=>{
                    const {book}=payload
                    fetchFollows()
                },(er)=>{})
            })
    }
    

    useEffect(()=>{
        if(book){
            checkBookPermission(book)
        }
    },[book,currentProfile])
    const checkBookPermission= (bookItem)=>{
       
        if( bookItem.privacy){
            if(currentProfile){
                let founa = bookItem.readers.find(id=>currentProfile && id==currentProfile.userId)
                let founb=  bookItem.commenters.find(id=> currentProfile && id==currentProfile.userId)
                let founc =  bookItem.writers.find(id=>currentProfile && id==currentProfile.userId)
                let found =  bookItem.editors.find(id=>currentProfile && id==currentProfile.userId)
                let owner = currentProfile &&  bookItem.profileId == currentProfile.id        
                 
                if(founa || founb || founc || found||owner) {

                    getPages(bookItem)
                    const profileParams = {
                        id:  bookItem.profileId
                    }
                    dispatch(fetchProfile(profileParams))
                    setError(false)
                }else{
                    setError(true)
                }  }else{
                    setError(true)
                }     
            }else{
                setError(false)
                getPages(bookItem)
                const profileParams = {
                        id:  bookItem.profileId
                    }
                dispatch(fetchProfile(profileParams)) 
            }
    }
    const getPages=(bookItem)=>{
        setPages([])
     
        if(bookItem.pageIdList && pages.length==bookItem.pageIdList.length){
            setHasMore(false)
        }else if(bookItem.pageIdList &&bookItem.pageIdList.length==0){
            setHasMore(false)   
        }else if(bookItem.pageIdList){
            setHasMore(true)
            for(let i=0;i<bookItem.pageIdList.length;i++){
                const pId = bookItem.pageIdList[i]
                        const params = {id:pId}
                    dispatch(fetchPage(params)).then(result=>{
                        checkResult(result,payload=>{
                                const {page} = payload
                                let newPages = pages
                                newPages[i]=page
                                setPages(newPages)
                                setHasMore(false)
                        },err=>{
                            setPages(prevState=>[...prevState,new Page(pId,"Deleted","Deleted","Delted",0,false,false,PageType.text,new Contributors([],[],[],[]))])
                            setHasMore(false)
                        })
                    })}
    
    }else{
        setPages([])
        setHasMore(false)
    }}
    useEffect(()=>{
        getBook()
    },[])
    useEffect(()=>{
        if(bookmarkLibrary && book){
           let found = bookmarkLibrary.bookIdList.find(id=>id==book.id)
           setBookmarked(Boolean(found))
        }
    },[bookmarkLibrary])
   
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
            
        }else{
            setFollowing(null)
        }
    }
   
    const pageList =()=>{
        if(book){
            if(book.pageIdList.length>0){
                return(
                    <div className="content">
                     <InfiniteScroll 
                            dataLength={pages.length}
                            next={()=>getPages(book)}
                            hasMore={hasMore} // Replace with a condition based on your data source
                            loader={<p>Loading...</p>}
                            endMessage={<div className="no-more-data">
                             <p>No more data to load.</p>   </div>}
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
                A Loading...
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
            dispatch(deleteFollowBook(params)).then(result=>{
               checkResult(result,payload=>{
                    setFollowing(null)
               },()=>{
                window.alert("Error deleting follow")
               })
            })
        }
    }
    let editDiv =() => {if(followedBooks && currentProfile && book && book.profileId == currentProfile.id){
        return(<Button
        style={iconStyle}
                        key={book.id}
                        onClick={(e)=>{
                            setBookInView({book})
                            navigate(`/book/${book.id}/edit`)
                    }}><Settings/></Button>)
                }else{
                    return(<div></div>)
                }
    }
    const followDiv = ()=>{
        return following?(
            <Button variant="outlined" 
                    style={{backgroundColor:theme.palette.secondary.light,
                            color:theme.palette.secondary.dark}
                    } 
                    lassName="follow-btn"
                    onClick={()=> debounce(deleteFollowBookClick(),10)}>Reader</Button>)
    :(<Button    variant="outlined" 
                                style={{backgroundColor:theme.palette.secondary.main,
                                        color:theme.palette.secondary.contrastText}}
                                className="follow-btn"
    onClick={
       ()=>debounce(followBookClick(),10)
   }>Read</Button>)}

   function canAddContent(){
    if(currentProfile){
    let owner = book.profileId == currentProfile.id
    let writer =null
    if(book.writers){
       writer= book.writers.find(id=>currentProfile.userId==id)
    }
   
    let editor = null
    if(book.editors){
      editor = book.editors.find(id=>currentProfile.userId==id)
    }

    return Boolean(owner)||Boolean(writer)||Boolean(editor)

    }else{
        return false
    }
   }
           


    
   const addBtn =()=>{
    
    if(currentProfile&&book){
        
       if(canAddContent()){
        return (<IconButton 
            style={iconStyle}
            onClick={()=>{
        setBookInView({book})
        navigate(`/book/${book.id}/add`)

       }}>
            <Add/>
        </IconButton>)
    }}
    return(<div></div>)
}

const bookInfo = ()=>{
    return(<div  className="info view">
            <div className="">
                <h4 className="" > {book.title}</h4>
                    <div className="">
                        <h6> {book.purpose}</h6>
                    </div>
            </div>
            <div className="button-row">
            {followDiv()}
            {addBtn()}
            {editDiv()}
            {bookmarked?<IconButton style={iconStyle} onClick={onBookmarkPage}><BookmarkIcon/></IconButton>:
            <IconButton style={iconStyle} disabled={!currentProfile}onClick={onBookmarkPage}><BookmarkBorderIcon/></IconButton>}  
            </div>
    </div>)
}
  if(book && !error){

    return(<div className="screen">
           <Helmet>
        <title>{book.title}</title>
        <meta
      name="description"
      content={book.purpose}
    />
        </Helmet>
        <div className="left-bar">
           
            {bookInfo()}
            

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