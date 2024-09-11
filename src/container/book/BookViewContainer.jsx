
import { fetchBook, setBookInView } from "../../actions/BookActions"
import { useDispatch,useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect ,useLayoutEffect,useState} from "react"
import { fetchArrayOfPages, fetchPage } from "../../actions/PageActions"
import InfiniteScroll from "react-infinite-scroll-component"
import DashboardItem from "../../components/DashboardItem"
import "../../styles/BookView.css"
import "../../App.css"
import PageSkeleton from "../../components/PageSkeleton"
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
import Contributors from "../../domain/models/contributor"
import { PageType } from "../../core/constants"
function BookViewContainer(props){
    const navigate = useNavigate()
    const pathParams = useParams()
    const dispatch = useDispatch()
    const book = useSelector(state=>state.books.bookInView)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [pages,setPages]=useState([])
    const [hasMore,setHasMore]=useState(false)
    const followedBooks = useSelector(state=>state.users.followedBooks)
    const homeCollection = useSelector(state=>state.users.homeCollection)
    const bookmarkLibrary = useSelector(state=>state.libraries.bookmarkLibrary)
    const [following,setFollowing]=useState(null)
    const [bookmarked,setBookmarked]=useState(false)

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
    const bookScreen = ()=>{
        if(book){
        return(<div style={{flexDirection:"column"}} className="two-panel">
        <Helmet>
     <title>{book.title}</title>
     <meta
    name="description"
    content={book.purpose}/>
    
     </Helmet>
     <div className="left-bar">
         {bookInfo()}
     </div>
     <div className="right-bar">
        <div className="content-list dashboard">
         {pageList()}
         </div>
     </div>
    </div>)
    }else{
    return <PageSkeleton/>
}
    }
    const getBook=()=>{ 
        dispatch(fetchBook(pathParams))
        // .then(result=>{
                // checkResult(result,payload=>{
                //     const {book}=payload
                //     getPages(book)
                //     const profileParams = {
                //         id:  book.profileId
                //     }
                //     dispatch(fetchProfile(profileParams))
                //     fetchFollows()
            //     },(er)=>{

            //     })
            // })
    }
    
    useEffect(()=>{
        if(currentProfile){
            dispatch(fetchFollowBooksForProfile({profile: currentProfile})).then(
                result=>checkResult(result,payload=>{

                },err=>{

                })
            )
        }
       
    },[])

 
    const getPages=(bookItem)=>{
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
    }

    useLayoutEffect(()=>{
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
            if( book.storyIdList.length>0){
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
            const {followBook} = payload
            setFollowing(followBook)
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
        },err=>{
           
        })})
    }else{
        window.alert("Log in first")
    }
}

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
    const lookingWrong =(<div className="evenly container view">
          
    <h2>Looking in the wrong place</h2>
</div> )
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
const checkBookPermission= ()=>{
    if(book){
        if(book.privacy){
                if(currentProfile){
                    if(book.profileId==currentProfile.id
                    ||book.commenters.includes(currentProfile.userId)||
                    book.readers.includes(currentProfile.userId)||
                    book.editors.includes(currentProfile.userId)||
                    book.writers.includes(currentProfile.userId)) {
                   console.log("A")
                    return bookScreen()
                
                }else{
                    console.log("B")
                    return lookingWrong 
                }
             }else{
                console.log("C")
                return lookingWrong 
             } 
        }else{
            console.log("D")
            return bookScreen()
        }
    }
    console.log("E")
    return <PageSkeleton/>
}
     
return checkBookPermission()
// if(bookLoading && !book){
//     return <PageSkeleton />
// }else{  
//     if(book && !error){

//     return(<div style={{flexDirection:"column"}} className="two-panel">
//            <Helmet>
//         <title>{book.title}</title>
//         <meta
//       name="description"
//       content={book.purpose}/>
      
//         </Helmet>
//         <div className="left-bar">
           
//             {bookInfo()}
            

//         </div>
//         <div className="right-bar">
//            <div className="content-list dashboard">
//             {pageList()}
//             </div>
//         </div>
        

//     </div>)}else{
//         return lookingWrong
    
//     }
//     }
}
export default BookViewContainer

// (<div style={{flexDirection:"column"}} className="two-panel">
// <Helmet>
// <title>{book.title}</title>
// <meta
// name="description"
// content={book.purpose}/>

// </Helmet>
// <div className="left-bar">
//  {bookInfo()}
// </div>
// <div className="right-bar">
// <div className="content-list dashboard">
//  {pageList()}
//  </div>
// </div>
// </div>)