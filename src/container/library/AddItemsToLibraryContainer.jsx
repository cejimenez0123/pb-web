



import {  getProfileBooks} from "../../actions/BookActions"
import { getProfilePages } from "../../actions/PageActions"
import { useDispatch,useSelector } from "react-redux"
import { useParams,useNavigate } from "react-router-dom"
import { useEffect ,useState} from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { Add } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { PageType } from "../../core/constants"
import checkResult from "../../core/checkResult"
import VisibilityIcon from '@mui/icons-material/Visibility';
import { btnStyle } from "../../styles/styles"
import debounce from "../../core/debounce"
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import { Button } from "@mui/joy"
import theme from "../../theme"
import { appendLibraryContent, fetchLibrary } from "../../actions/LibraryActions"
function AddItemsToLibraryContainer(){
    const navigate = useNavigate()
    const pathParams = useParams()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const libraryInView = useSelector(state=>state.libraries.libraryInView)
    const [hasMore,setHasMore]=useState(false)
    const [listItems,setListItems]=useState([])
    const [sortAlpha,setSortAlpha] = useState(false)
    const [sortTime,setSortTime] = useState(false)
    const getBooks =()=>{
        if(currentProfile){
            setHasMore(true)
            const params = {profile: currentProfile}
            dispatch(getProfileBooks(params)).then(result => checkResult(result,payload=>{
                const {bookList}=payload
                const stories =bookList.map(book =>{return{item:book,type:"book"}})
                setListItems(stories)
                setHasMore(false)
            },err=>{
            setHasMore(false)
            }
        ))
    }
}

    const getPages =()=>{
        if(currentProfile && libraryInView){
            const params = {profile:currentProfile}
            setHasMore(true)
            dispatch(getProfilePages(params)).then(result=>checkResult(result,payload=>{
                const {pageList}=payload
                const stories =pageList.map(page=>{return{item:page,type:"page"}})
                setListItems(prevState=>[...prevState, ...stories])
                setHasMore(false)
            },err=>{
                setHasMore(false)
            }))
        }
    }
    
    const getLibrary=()=>{
        const {id}=pathParams
        if(libraryInView==null || libraryInView.id != id){
            dispatch(fetchLibrary(pathParams)).then(result=>checkResult(
                result,payload=>{
                },err=>{

                }
            ))
        }
    }
    useEffect(()=>{
        getLibrary()
    },[])
    useEffect(()=>{
        fetchData()
    },[])
    const fetchData=()=>{
        setListItems([])
        getBooks()
        getPages()
    }
    const saveLibrary =(bookIdList,pageIdList)=>{
        
        let owner = libraryInView.profileId == currentProfile.id
        let editor = libraryInView.editors.find(id => id==currentProfile.userId)
        let writer = libraryInView.writers.find(id=>id==currentProfile.userId)
     
        if(owner || libraryInView.writingIsOpen || Boolean(editor)||Boolean(writer)){
        
            const params = {
                library: libraryInView,
                pageIdList:pageIdList,
                bookIdList:bookIdList
            
            }
            dispatch(appendLibraryContent(params)).then(result=>{
                checkResult(result,payload=>{
                    window.alert("Success")
                },err=>{
                    window.alert("Error"+err.message)
                })
            })
           }
    }
    const setSortOrderTime=()=>{
        
        if(sortTime){

        if(listItems){

        let newItems = [...listItems].sort((a,b)=>{
            return b.item.created - a.item.created
        })
        setListItems(newItems);
    }
  
        }else{
            if(listItems){
            let newItems = [...listItems].sort((a,b)=>{
                return a.item.created - b.item.created
            })
    
            setListItems(newItems);
            }
        }
    }
    
    const setSortOrderAlpha=()=>{

        if(sortAlpha){
        let newItems = [...listItems].sort((a,b)=>{
            if (a.item.title < b.item.title) {
                return -1;
              }
              if (a.item.title > b.item.title) {
                return 1;
              }
              return 0;
        })
        setListItems(newItems);
 
        }else{
            let newItems = [...listItems].sort((a,b)=>{

                if (b.item.title < a.item.title) {
                    return -1;
                  }
                  if (b.item.title > a.item.title) {
                    return 1;
                  }
                  return 0;
            })
        setListItems(newItems);
        
        }
    }
    const addItemItemToIdList =(story)=>{
            if(story.type=="page"){
                const list = [...libraryInView.pageIdList,story.item.id]
            
                saveLibrary(libraryInView.bookIdList,list)
            }else if(story.type=="book"){
                const list = [...libraryInView.bookIdList,story.item.id]
            
                saveLibrary(list,libraryInView.pageIdList)
            }

    }
    const pageList =()=>{
        if(libraryInView!=null){
            if(listItems.length>0){
                const btnStyle = {backgroundColor:"#50874F"}
                return(
                    <div>
                        <div>
                            <div className="inner">

                           
                            <div className="btn-row" >
                                <div></div>
                                <div>
                                <IconButton  onClick={()=>{
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
                        </div>
                       <InfiniteScroll 
                            dataLength={listItems.length}
                            next={fetchData}
                            hasMore={hasMore} // Replace with a condition based on your data source
                            loader={<p>Loading...</p>}
                            endMessage={<p>No more data to load.</p>}
                            scrollableTarget="scrollableDiv">
         {listItems.map((story)=>{
           let word = story.type
           const firstLetter = word.charAt(0)
           const firstLetterCap = firstLetter.toUpperCase()
           const remainingLetters = word.slice(1)
           const capitalizedWord = firstLetterCap + remainingLetters
            return(
                <div key={story.item.id}>
                    <div className="list-item">
                        <a className="title">
                            <h6>{capitalizedWord}:{story.item.title}</h6>
                        </a>
                        <div className="button-row">
                        <IconButton onClick={()=>{
                            debounce(addItemItemToIdList(story),5)
                            }}>
                            <Add/>
                    </IconButton>
                    </div>
        </div> 
        </div>
            
            )})
         }
     </InfiniteScroll>
                    </div>
                )
            }else{
                return(
                <div className="empty">
                    <h1>Empty</h1>
                </div>
            )}
        }else{
            return (<div>
                Loading...
            </div>)
        }
    }


        
    
    if(libraryInView){
    return(<div className="screen">
          
        <div className="left-bar">
            <div className="info create">
        
            {libraryInView.name.length>0?<h5> {libraryInView.name}</h5>:<h5>Untitled</h5>}
            <div className="purpose">
            <h6 > {libraryInView.purpose}</h6>
            </div>  
            <div>
            <IconButton onClick={()=>{
                navigate(`/library/${libraryInView.id}`)}}>
                <VisibilityIcon/></IconButton> 
           
                </div>
            </div>
            
        </div>
        <div className="right bar">
            {pageList()}
        </div>
       

    </div>)}else{

        return(<div>
            Loading
        </div>)
    }
}
export default AddItemsToLibraryContainer