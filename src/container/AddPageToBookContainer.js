
import { fetchBook, setBookInView } from "../actions/BookActions"
import { appendSaveRolesForPage, getProfilePages } from "../actions/PageActions"
import { useDispatch,useSelector } from "react-redux"
import { useParams,useNavigate } from "react-router-dom"
import { useEffect ,useState} from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { Add } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { updateBookContent } from "../actions/BookActions"
import { canAddToItem } from "../core/constants"
import { PageType } from "../core/constants"
import checkResult from "../core/checkResult"
import VisibilityIcon from '@mui/icons-material/Visibility';
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';
function AddPageToBookContainer({books}){
    const navigate = useNavigate()
    const pathParams = useParams()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const bookLoading = useSelector(state=>state.books.loading)
    const pageLoading = useSelector(state=>state.pages.loading)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const bookInView = useSelector(state=>state.books.bookInView)
    const [pageIdList,setPageIdList] = useState([])
    const [hasMore,setHasMore]=useState(false)
    const [page,setPage] = useState(1)
    const getBook =()=>{
       if(currentProfile){
            const id = pathParams["id"]
            if(bookInView.id != id || bookInView==null){
                dispatch(fetchBook({id})).then(result=>{
                    checkResult(result,payload=>{
                        const {book}=payload
                        setPageIdList(book.pageIdList)
                    })
                })
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
     
            getBook()
            getPages()
    },[])
  
    const saveBook =(page)=>{
        let list = [...pageIdList,page.id]
        let owner = bookInView.profileId == currentProfile.id
        let editor = bookInView.editors.find(id => id==currentProfile.userId)
        let writer = bookInView.writers.find(id=>id==currentProfile.userId)
     
        if(owner || bookInView.writingIsOpen || Boolean(editor)||Boolean(writer)){
        
            const params = {
                book: bookInView,
                pageIdList: list
            }
            dispatch(updateBookContent(params)).then(result=>{
                checkResult(result,payload=>{
                    const {book} = payload
                    let readers = [...book.readers,...book.writers,...book.editors,...book.commenters]
                    const params = {
                        pageIdList:list,
                        readers
                    }
                    setPageIdList(list)
                    dispatch(appendSaveRolesForPage(params)).then(result=>{
                        checkResult(result,payload=>{
                            window.alert("Success!")
                        },()=>{
                            
                        })
                    })
                    
                },()=>{
    
                })
                    
                
    
            })}
    }
    
    const pageList =()=>{
        if(pageLoading==false && !!bookInView){
            if(pagesInView && pagesInView.length !=0){
                return(
                    <div>
                       <InfiniteScroll 
                            dataLength={pagesInView.length}
                            next={getPages}
                            hasMore={hasMore} // Replace with a condition based on your data source
                            loader={<p>Loading...</p>}
                            endMessage={<p>No more data to load.</p>}
                            scrollableTarget="scrollableDiv">
         {pagesInView.map((page)=>{
           
            
            return(
                <PageItem key={page.key}page={page} setPageIdList={()=>{
                    saveBook(page)
                }}/>
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


        
    
    if(bookInView){
    return(<div className="container">
          
        <div className="left-side-bar">
            <div className="info create">
        
            <h5> {bookInView.title}</h5>
            <div className="purpose">
            <h6 > {bookInView.purpose}</h6>
            </div>  
            <div>
            <IconButton onClick={()=>{
                navigate(`/book/${bookInView.id}`)}}>
                <VisibilityIcon/></IconButton> 
            <IconButton onClick={()=>{navigate(`/page/new`)}}>
                <CreateIcon/>
                </IconButton>  
                <IconButton onClick={()=>{navigate(`/page/image`)}}>
                    <ImageIcon/>
                </IconButton>
                </div>
            </div>
            
        </div>
        <div className="main-bar">
            {pageList()}
        </div>
        <div className="right-side-bar">
        </div>

    </div>)}else{

        return(<div>
            Loading
        </div>)
    }
}
function PageItem({page,setPageIdList}){
    const [show,setShow]=useState(false)
    let pageDataElement = (<div></div>)
    switch(page.type){
        case PageType.text:
            pageDataElement = <div className='dashboard-content text' dangerouslySetInnerHTML={{__html:page.data}}></div>
        break;
        case PageType.picture:
            pageDataElement = <img className='dashborad-content' src={page.data} alt={page.title}/>
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
            <a className="title"><h6 onClick={()=>{setShow(!show)}}>{page.title}</h6>
            </a>
            
             <IconButton onClick={()=>{
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