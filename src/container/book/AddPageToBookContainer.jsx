
import { fetchBook,  } from "../../actions/BookActions"
import { appendSaveRolesForPage, getProfilePages } from "../../actions/PageActions"
import { useDispatch,useSelector } from "react-redux"
import { useParams,useNavigate } from "react-router-dom"
import { useEffect ,useState} from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { Add } from "@mui/icons-material"
import { IconButton,Menu,MenuItem } from "@mui/material"
import { updateBookContent } from "../../actions/BookActions"
import checkResult from "../../core/checkResult"
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImageIcon from '@mui/icons-material/Image';
import debounce from "../../core/debounce"
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import { Button } from "@mui/joy"
import LinkIcon from '@mui/icons-material/Link';
import theme from '../../theme'
import CreateIcon from '@mui/icons-material/Create';
import Paths from "../../core/paths"
import PageItem from "../../components/PageItem"
function AddPageToBookContainer(){
    const navigate = useNavigate()
    const pathParams = useParams()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)

    const pageLoading = useSelector(state=>state.pages.loading)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const bookInView = useSelector(state=>state.books.bookInView)
    const [pages,setPages]=useState([])
    const [pageIdList,setPageIdList] = useState([])
    const [hasMore,setHasMore]=useState(false)
    const [anchorEl,setAnchorEl]=useState(null)
    const [sortAlpha,setSortAlpha] = useState(false)
    const [sortTime,setSortTime] = useState(false)
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
               checkResult(result,payload=>{
                    const {pageList}=payload
                    setPages(pageList)
               },err=>{

               })
            })
    
        }
      }
      
    
    useEffect(()=>{
     
            getBook()
            getPages()
    },[])
  
    const saveBook =(page)=>{
        let idList = pageIdList
         idList.push(page.id)
        let owner = bookInView.profileId == currentProfile.id
        let editor = bookInView.editors.find(id => id==currentProfile.userId)
        let writer = bookInView.writers.find(id=>id==currentProfile.userId)
     
        if(owner || bookInView.writingIsOpen || Boolean(editor)||Boolean(writer)){
        
            const params = {
                book: bookInView,
                pageIdList: idList
            }
            dispatch(updateBookContent(params)).then(result=>{
                checkResult(result,payload=>{
                    const {book} = payload
                    let readers = [...book.readers,...book.writers,...book.editors,...book.commenters]
                    const params = {
                        pageIdList:idList,
                        readers
                    }
                    alert("Updated Book Content")
                    setPageIdList(idList)
                    dispatch(appendSaveRolesForPage(params)).then(result=>{
                        checkResult(result,payload=>{
                            window.alert("Updated Roles for Pages")
                        },()=>{
                            
                        })
                    })
                    
                },()=>{
    
                })
                    
                
    
            })}
    }
    const setSortOrderTime=()=>{
        
        if(sortTime){

        if(pages){

        let newPages = [...pages].sort((a,b)=>{
            return b.created - a.created
        })
        setPages(newPages);
    }
  
        }else{
            if(pages){
            let newPages = [...pages].sort((a,b)=>{
                return a.created - b.created
            })
    
            setPages(newPages);
        }
        }
    }
    
    const setSortOrderAlpha=()=>{

        if(sortAlpha){
        let newPages = [...pages].sort((a,b)=>{
            if (a.title < b.title) {
                return -1;
              }
              if (a.title > b.title) {
                return 1;
              }
              return 0;
        })
        setPages(newPages);
 
        }else{
            let newPages = [...pages].sort((a,b)=>{
                if (b.title < a.title) {
                    return -1;
                  }
                  if (b.title > a.title) {
                    return 1;
                  }
                  return 0;
            })
            setPages(newPages);
        
        }
    }
    const pageList =()=>{
        if(pageLoading==false && !!bookInView){
            if(pagesInView && pagesInView.length !=0){
                const btnStyle = {backgroundColor:"transparent"}
                return(
                    <div>
                          <div className="inner">

                           
                    <div className="btn-row">
                            <div>

                            </div>
                            <div>
                                <IconButton onClick={()=>{
                                    setSortAlpha(!sortAlpha)
                                    setSortOrderAlpha()
                                    
                                }}>
                                    <SortByAlphaIcon style={{color:theme.palette.primary.contrastText}}/>
                                </IconButton>
                                {sortTime?<Button style={btnStyle} onClick={()=>{
                                setSortTime(false)
                                setSortOrderTime()
                            }}>
                                    New to Old
                            </Button>:
                            <Button style={btnStyle} onClick={()=>{
                                setSortTime(true)
                                setSortOrderTime()
                            }}
                            >Old to New</Button>}
                            </div>
                            </div>
                        </div>
                       <InfiniteScroll 
                            dataLength={pages.length}
                            next={getPages}
                            hasMore={hasMore} // Replace with a condition based on your data source
                            loader={<p>Loading...</p>}
                            endMessage={<p>No more data to load.</p>}
                            scrollableTarget="scrollableDiv">
         {pages.map((page)=>{
           
            
            return(
                <PageItem key={page.key}page={page} setPageIdList={()=>{
                    debounce(saveBook(page),5)
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
    return(<div className="screen">
          
        <div className="left-bar">
            <div className="info create">
        
            <h5> {bookInView.title}</h5>
            <div className="purpose">
            <h6 > {bookInView.purpose}</h6>
            </div>  
            <div>
            <IconButton onClick={()=>{
                navigate(`/book/${bookInView.id}`)}}>
                <VisibilityIcon/></IconButton> 
                <IconButton onClick={(e)=>setAnchorEl(e.currentTarget)}>
                <Add/>
                </IconButton > 
                <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={()=>setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={()=>navigate(Paths.editor.text())}><CreateIcon/></MenuItem>
        <MenuItem  onClick={()=>navigate(Paths.editor.image())}><ImageIcon/></MenuItem>
        <MenuItem  onClick={()=>navigate(Paths.editor.link())}><LinkIcon/></MenuItem>
      </Menu> 
                <IconButton onClick={()=>{navigate(`/page/image`)}}>
                    <ImageIcon/>
                </IconButton>
                </div>
            </div>
            
        </div>
        <div className="right-bar">
            {pageList()}
        </div>
        

    </div>)}else{

        return(<div>
            Loading
        </div>)
    }
}

export default AddPageToBookContainer