
import { fetchBook } from "../actions/BookActions"
import { useDispatch,useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect ,useState} from "react"
import { fetchArrayOfPages } from "../actions/PageActions"
import InfiniteScroll from "react-infinite-scroll-component"
import DashboardItem from "../components/DashboardItem"
import "../styles/BookView.css"
function BookViewContainer({book,pages}){
    const navigate = useNavigate()
    const pathParams = useParams()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const bookLoading = useSelector(state=>state.books.loading)
    const pageLoading = useSelector(state=>state.pages.loading)
    const [hasMore,setHasMore]=useState(false)
    const [page,setPage] = useState(1)
    const getBook=()=>{
      
      const bookId =pathParams["id"]
      const parameters = {
        id: bookId,
      }
        // const id =  pathParams["id"]
        // console.log(`PageViewContainer ${JSON.stringify(pathParams)}`)
        dispatch(fetchBook(parameters)).then((result) => {
           
        }).catch((err) => {
            
        });
              
    }
    const goToEditBook =(e)=>{

        
    }
    const getPages = (pageIdList)=>{
        const params = {pageIdList:pageIdList}
    
        dispatch(fetchArrayOfPages(params)).then((result) => {
            if(!result.error){
                setHasMore(true)
            }else{
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
                    <div>
                     <InfiniteScroll 
                            dataLength={pages.length}
                            next={()=>getPages(book.pageIdList)}
                            hasMore={pages.length < book.pageIdList.length} // Replace with a condition based on your data source
                            loader={<p>Loading...</p>}
                            endMessage={<p>No more data to load.</p>}
                            scrollableTarget="scrollableDiv"
     >
         {pages.map(page =>{
                 return(<DashboardItem page={page}/>)
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
    if(!!currentProfile && currentProfile.id == book.profileId)
    <a ket={book.id}onClick={(e)=>goToEditBook(e)}>Edit</a>
    if(!bookLoading && book!=null){
        
    

    return(<div className="container">
          
        <div className="left-side-bar">
            <h5> {book.title}</h5>
            <h6> {book.purpose}</h6>
            <button type="button" className="follow-btn" onClick={()=>{

            }}>Follow</button>
            
        </div>
        <div className="main-bar">
            {pageList()}
        </div>
        <div className="right-side-bar">
        </div>

    </div>)}else{
        
        return(<div>
            Loading...
        </div>)
}}
export default BookViewContainer