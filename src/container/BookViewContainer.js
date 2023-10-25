
import { fetchBook } from "../actions/BookActions"
import { useDispatch,useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect ,useState} from "react"
import { fetchArrayOfPages } from "../actions/PageActions"
import InfiniteScroll from "react-infinite-scroll-component"
import DashboardItem from "../components/DashboardItem"
import "../styles/BookView.css"
import { clearPagesInView } from "../actions/PageActions"
import {Button} from "@mui/material"
import theme from "../theme"
import { fetchProfile ,createFollowBook} from "../actions/UserActions"
import { Settings } from "@mui/icons-material"
function BookViewContainer({book,pages}){
    const navigate = useNavigate()
    const pathParams = useParams()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const profile= useSelector(state=>state.users.profileInView)
    const bookLoading = useSelector(state=>state.books.loading)
    const pageLoading = useSelector(state=>state.pages.loading)
    const [hasMore,setHasMore]=useState(false)
    const [page,setPage] = useState(1)
    const followedBooks = useSelector(state=>state.users.followedBooks)
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
    const goToEditBook =(e)=>{

        
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
        
    },[])
    useEffect(()=>{

        if(!!book){
            setHasMore(true)
            getPages(book.pageIdList)
        }

    },[book])
    
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
                 return(<DashboardItem book={book}page={page}/>)
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
        dispatch(createFollowBook(params))
        }else{
            window.alert("Log in first")
        }
    }
    let editDiv = (<div>

    </div>)
    let followDiv = (<Button variant="outlined" style={{backgroundColor:theme.palette.secondary.main,color:theme.palette.secondary.contrastText}}className="follow-btn"
    onClick={
       followBookClick
   }>Follow</Button>)
    if(followedBooks && currentProfile && book && currentProfile.id == book.profileId){
   editDiv = (<Button
   key={book.id}onClick={(e)=>goToEditBook(e)}>Edit<Settings/></Button>)
   let fb = followedBooks.find(fb=>fb.id==`${currentProfile.id}_${book.id}`)
    if(fb){
       followDiv= (<Button variant="outlined" style={{backgroundColor:theme.palette.secondary.light,color:theme.palette.secondary.dark}
       } onClick={()=>{}}>Following</Button>)
    }    

}
    if( book!=null){ 
    
  

    return(<div className="evenly container view">
          
        <div className="left-bar">
            <div className="info view">
            <h5> {book.title}</h5>
            <div className="purpose">
            <h6> {book.purpose}</h6>
            </div>
            {followDiv}
            
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