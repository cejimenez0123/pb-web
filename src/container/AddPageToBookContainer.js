
import { fetchBook } from "../actions/BookActions"
import { getProfilePages } from "../actions/PageActions"
import { useDispatch,useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { useEffect ,useState} from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { Add } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { updateBookContent } from "../actions/BookActions"
import { canAddToItem } from "../core/constants"
import { PageType } from "../core/constants"
function AddPageToBookContainer({books}){
    const pathParams = useParams()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const bookLoading = useSelector(state=>state.books.loading)
    const pageLoading = useSelector(state=>state.pages.loading)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const bookInView = useSelector(state=>state.books.bookInView)
    const [pageIdList,setPageIdList] = useState()
    const [hasMore,setHasMore]=useState(false)
    const [page,setPage] = useState(1)
    const getBook =()=>{
       if(!!currentProfile){
            const id = pathParams["id"]
            if(bookInView.id != id || bookInView==null){
                fetchBook({id})
            }
    }}
    const getPages =()=>{
        if(currentProfile){
            const params = {
                profile: currentProfile
            }
            dispatch(getProfilePages(params)).then(result=>{
                setHasMore(false)
            })
    
        }
      }
    useEffect(()=>{
        if(canAddToItem(bookInView,currentProfile)){
        const params = {
            book: bookInView,
            pageIdList: pageIdList
        }
        dispatch(updateBookContent(params))}else{
            alert("Unable")
        }
    },[pageIdList])
    useEffect(()=>{
     
            getBook()
        
    },[])
    useEffect(()=>{
        setHasMore(true)
        getPages()
    },[bookInView])

    
    const pageList =()=>{
        if(pageLoading==false && !!bookInView){
            if(pagesInView.length !=0){
                return(
                    <div>
                       <InfiniteScroll 
                            dataLength={pagesInView.length}
                            next={getPages}
                            hasMore={hasMore} // Replace with a condition based on your data source
                            loader={<p>Loading...</p>}
                            endMessage={<p>No more data to load.</p>}
                            scrollableTarget="scrollableDiv">
         {pagesInView.map(page=>{
           
            
            return(
                <PageItem page={page} setPageIdList={setPageIdList(prevState=>[...prevState,page.id])}/>
            )
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

    if(!bookLoading && bookInView!=null){
        
    

    return(<div className="container">
          
        <div className="left-side-bar">
            <h5> {bookInView.title}</h5>
            <h6> {bookInView.purpose}</h6>
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
function PageItem({page,setPageIdList}){
    const [show,setShow]=useState(false)
    let pageDataElement = (<div></div>)
    switch(page.type){
        case PageType.text:
            pageDataElement = <div className='dashboard-content' dangerouslySetInnerHTML={{__html:page.data}}></div>
        break;
        case PageType.picture:
            pageDataElement = <img className='' src={page.data} alt={page.title}/>
        break;
        case PageType.video:
            pageDataElement = <video src={page.data}/>
        break;
        default:
            pageDataElement = <div className='dashboard-content' dangerouslySetInnerHTML={{__html:page.data}}/>
        break;
    }
    return(<div>

          
        <div className="list-item">
            <h5>{page.title}</h5> <IconButton onClick={()=>{
                setPageIdList()
            }

            }><Add/></IconButton>
            
        </div>
        <div style={{display: show? "":"none"}}>
            {pageDataElement}
        </div>
        </div>)
}
export default AddPageToBookContainer