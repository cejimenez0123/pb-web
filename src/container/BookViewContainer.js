
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
import { fetchProfile ,createFollowBook,deleteFollowBook,fetchFollowBooksForProfile, updateHomeCollection} from "../actions/UserActions"
import { Add, Settings } from "@mui/icons-material"
import debounce from "../core/debounce"
import { canAddToItem } from "../core/constants"
function BookViewContainer({book,pages}){
    const navigate = useNavigate()
    const pathParams = useParams()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const pageLoading = useSelector(state=>state.pages.loading)
    const [hasMore,setHasMore]=useState(false)
    const followedBooks = useSelector(state=>state.users.followedBooks)
    const homeCollection = useSelector(state=>state.users.homeCollection)
    const getBook=()=>{
      
      const bookId =pathParams["id"]
      const parameters = {
        id: bookId,
      }
       if(book==null || (book!=null && book.id!=bookId)){
        dispatch(clearPagesInView())
        dispatch(fetchBook(parameters)).then((result) => {
            const {payload} = result
            if(payload.error!=null){
                const profileParams = {
                    id: payload.book.profileId
                }
                dispatch(fetchProfile(profileParams))
            }
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
     
            getBook()
            fetchFollows()
    },[])
    useEffect(()=>{

        if(book){
            setHasMore(true)
            getPages(book.pageIdList)
            fetchFollows()
        }

    },[book])
   
    const fetchFollows=()=>{
        if(currentProfile){
            const params = {
                profile: currentProfile

            }
            dispatch(fetchFollowBooksForProfile(params))
            
        }
    }
    const pageList =()=>{
        if(pageLoading==false && !!book){
            if(pages.length !=0){
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
        dispatch(createFollowBook(params)).then(()=>{
            let books = [...homeCollection.books,book.id]
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
        })
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
            dispatch(deleteFollowBook(params)).then(()=>{
                fetchFollows()
            })
        }
    }
    let editDiv = (<div>

    </div>)
    let followDiv = (<Button    variant="outlined" 
                                style={{backgroundColor:theme.palette.secondary.main,
                                        color:theme.palette.secondary.contrastText}}
                                className="follow-btn"
    onClick={
       ()=>debounce(followBookClick(),10)
   }>Follow</Button>)
    if(followedBooks && currentProfile && book ){
    editDiv = (<Button
    key={book.id}onClick={(e)=>{
        navigate(`/book/${book.id}/edit`)
    }}>Edit<Settings/></Button>)
    let fb = followedBooks.find(fb=>{
       return fb!=null && fb.profileId ==currentProfile.id && fb.bookId == book.id})
    if(fb){
        followDiv= (
            <Button variant="outlined" 
                    style={{backgroundColor:theme.palette.secondary.light,
                            color:theme.palette.secondary.dark}
                    } 
                    lassName="follow-btn"
                    onClick={()=> debounce(deleteFollowBookClick(),10)}>Following</Button>)
    }    

}
    if( book!=null){ 
    let addBtn = (<div>

    </div>)
    if(currentProfile!=null && canAddToItem(book,currentProfile)){
       addBtn= (<IconButton onClick={()=>{
        setBookInView({book})
        navigate(`/book/${book.id}/add`)

       }}>
            <Add/>
        </IconButton>)
   
    }
  

    return(<div className="evenly container view">
          
        <div className="left-bar">
            <div className="info view">
            <h5> {book.title}</h5>
            <div className="purpose">
            <h6> {book.purpose}</h6>
            </div>
            {followDiv}
            {addBtn}
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