
import { useEffect,useState} from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useSelector,useDispatch } from "react-redux"
import { fetchArrayOfPages, fetchArrayOfPagesAppened } from "../actions/PageActions"
import { useParams } from "react-router-dom"
import { createFollowLibrary, deleteFollowLibrary, fetchAllProfiles } from "../actions/UserActions"
import { fetchLibrary } from "../actions/LibraryActions"
import DashboardItem from "../components/DashboardItem"
import "../styles/Library.css"
import { clearPagesInView } from "../actions/PageActions"
import BookRole from "../domain/models/bookrole"
import { fetchArrayOfBooks } from "../actions/BookActions"
import { useNavigate } from "react-router-dom"
import SettingsIcon from '@mui/icons-material/Settings';
import { Button } from "@mui/material"
import theme from "../theme"
function LibraryViewContainer(props){
    const pathParams = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const libraryInView = useSelector(state=>state.libraries.libraryInView)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const followedLibraries = useSelector(state=>state.users.followedLibraries)
    const [itemsInView,setItemsInView] = useState([])
    const [hasMore,setHasMore] = useState(false)
    const [error,setError]= useState(false)
    const [errorMessage,setErrorMessage] = useState("Error")
    useEffect(()=>{
        dispatch(fetchAllProfiles())
        if(libraryInView==null || (libraryInView!=null && libraryInView.id != pathParams["id"])){
            const id =  pathParams["id"]
            const params = {id: id}
            dispatch(clearPagesInView())
            dispatch(fetchLibrary(params)).then(result=>{
                getPages()
                
            })
        }else{
        
            dispatch(clearPagesInView())
            getPages()
            
            
        }
      
    },[])
    useEffect(()=>{
            getPages()
            getBooks()
    
    },[libraryInView])
    const libraryInfo=()=>{
        if(libraryInView!=null){
            const lib = libraryInView
                let button = (<div></div>)
                if(currentProfile!= null && currentProfile.id == libraryInView.profileId){
                    button = (<Button onClick={()=>{
                        navigate(`/library/${libraryInView.id}/edit`)
                    }}>
                    <SettingsIcon style={{color:"black"}}/>
                </Button>)
                }
                let follow = null
                if(currentProfile && libraryInView && followedLibraries && followedLibraries.length>0){
                   follow = followedLibraries.find(fl=>
                        fl!=null && fl.id == `${currentProfile.id}_${libraryInView.id}`
                    )
                }
                let followDiv = (<Button style={{backgroundColor:theme.palette.secondary.main,
                    color:theme.palette.secondary.contrastText}}
                    variant="outlined"
                    onClick={onClickFollow}
                    >Follow
                    </Button>)
               
                if(follow){
                    followDiv = (<Button style={{backgroundColor:theme.palette.secondary.light,
                        color:theme.palette.secondary.contrastText}}
                        variant="outlined"
                        onClick={onClickFollow}
                        >Following
                        </Button>)
                }
                return  (<div className="info">
                            <div className="inner">
                            <h2 className="name">{lib.name}</h2>
                            <p className="purpose"> {lib.purpose}</p>
                            <div className="button-row reverse">
                                {button} 
                                {followDiv}
                            </div>
                            </div>
                        </div>
                        )
                        
                    }else{

                    return(<div>
                            Loading...
                        </div>)
                }
    }
    const onClickFollow = ()=>{
        if(currentProfile && libraryInView){
            let follow = followedLibraries.find(fl=>fl.id==`${currentProfile.id}_${libraryInView.id}`)
            if(follow){
                const params = {
                    followLibrary: follow,
                    profile: currentProfile,
                    library: libraryInView
                }
                dispatch(deleteFollowLibrary(params))
            }else{
                const params = {
                        library: libraryInView,
                        profile: currentProfile}
                dispatch(createFollowLibrary(params))
    }

    }else{
        window.alert("You'll need to login first")
    }
    }
    const getPages = () =>{
        setHasMore(true)
        if(libraryInView!=null){

            const pageIdList = libraryInView.pageIdList
            const params = {pageIdList: pageIdList}
        if(pageIdList.length>0){
            dispatch(fetchArrayOfPages(params)).then((result) => {

                if(result.error ==null ){
                  
                    let newState = []
                    const {payload } = result
                    const {pageList } = payload
                
                    if(payload.error==null){
                      if(pageList.length>0){ 
                        setError(false)
                        setItemsInView(prevState=>{
                        pageList.forEach((page) => {
                        
                            const item = prevState.find(item=> item.id == page.id)
                            if(item==null){
                                newState.push(page)
                            }
                        
                        })
                        return [...prevState,...newState]

                    })
                }else{
                    setErrorMessage("Library is empty")
                    setErrorMessage(true)
                }
                }else{
                        setErrorMessage(`${payload.error.message}`)
                        setError(true)
                    }
                }else{
                    setErrorMessage(result.error.message)
                    setError(true)
                }
            
               setHasMore(false)
            }).catch((err) => {
                
            });
        }else{
            setErrorMessage('Library is empty')
        }}
    }
    const getBooks=()=>{
            if(libraryInView && libraryInView.bookIdList.length > 0){
                setHasMore(true)
                let params = {bookIdList: libraryInView.bookIdList};

                dispatch(fetchArrayOfBooks(params)).then(result=>{
                    let pageIdList = []
                    if(result.error ==null){
                        const { payload } = result
                        const {bookList} = payload
                        if(payload.error == null){
                            setError(false)
                        setItemsInView((prevState)=>{
                          
                            let newState = []
                            bookList.forEach((book) => {
    
                                const item = prevState.find(item=>{return item.id == book.id})
                                
                                if(item==null){
                                    newState.push(book)
                                }
                            
                            })
                            return [...prevState,...newState]
    
                        })
                        bookList.forEach(book =>{
                           
                            if( book.pageIdList[0]!=null && pagesInView!=null){
                                let id = book.pageIdList[0]
                                let page = pagesInView.find(page => page.id==id)
                                let alreadyInList =  pageIdList.find(aId=> aId==id)
                                if(page==null && alreadyInList==null){
                                    pageIdList.push(id)
                                }
                            }

                        })
                    }else{
                        setError(true)
                    }
                        if(pageIdList.length>0){
                        
                            const params = {pageIdList: pageIdList}
                            dispatch(fetchArrayOfPagesAppened(params)).then(result=>{
                                if(result.error==null){
                                    const {payload}= result
                                    const { pageList } = payload

                                }
                            })
                        }

                    }
                    setHasMore(false)
                })
                
            }else{
                if(itemsInView.length == 0){
                    setErrorMessage('Library is empty')
                    setError(true)
                }
            }
    }
    
    const contentList = ()=>{
        if(!error){
        if(itemsInView!=null ){
            return(<div className="content-list">

                <InfiniteScroll 
                dataLength={itemsInView.length}
                next={getPages}
                hasMore={hasMore} // Replace with a condition based on your data source
                loader={<p>Loading...</p>}
                endMessage={<p>No more data to load.</p>}
                scrollableTarget="scrollableDiv"
                >
                {
                    itemsInView.map((story)=>{
                        if(story.pageIdList!=null){
                            let id =  story.pageIdList[0]
                            let page  = null
                             if(pagesInView){
                                page = pagesInView.find(page=> page.id == id)
                            }
                           
                            
                            if(page){
                            
                                return(<div key={story.id}>
                                
                                <DashboardItem  library={libraryInView}
                                                book={story} 
                                                page={page}/>
                            </div>)}
                            }else{
                                return(
                
                                <div key={story.id}>
            
                                        <DashboardItem library={libraryInView} page={story}/>
                    
                </div>)
            }})
        }
                </InfiniteScroll> 
            </div>
            )}else{

                return(<div className="content-list">
                    Content Loading...
                </div>)

            }}else{
                return(<div className="content-list">
                    <div className="error">
                    <h2 >{errorMessage}</h2>
                    </div>
                </div>)
            }
        
        
        }
    
    return (<div id="container">
        <div className="left-bar">
                    {contentList()}
             
        </div>
        <div className="right-bar">
      
                {libraryInfo()}
           
        </div>
    </div>)


}

export default LibraryViewContainer