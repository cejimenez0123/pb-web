
import { useEffect,useState} from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useSelector,useDispatch } from "react-redux"
import {    fetchArrayOfPages, 
            fetchArrayOfPagesAppened,
            clearPagesInView  } from "../actions/PageActions"
import { useParams, useNavigate  } from "react-router-dom"
import {updateHomeCollection,
        createFollowLibrary,
        deleteFollowLibrary,
        fetchAllProfiles, 
        fetchFollowLibraryForProfile} from "../actions/UserActions"
import { fetchLibrary } from "../actions/LibraryActions"
import DashboardItem from "../components/DashboardItem"
import "../styles/Library.css"
import { fetchArrayOfBooks } from "../actions/BookActions"
import SettingsIcon from '@mui/icons-material/Settings';
import { Button } from "@mui/material"
import theme from "../theme"
import "../App.css"
import checkResult from "../core/checkResult"
function LibraryViewContainer(props){
    const pathParams = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const libraryInView = useSelector(state=>state.libraries.libraryInView)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const followedLibraries = useSelector(state=>state.users.followedLibraries)
    const [following,setFollowing]= useState(null)
    const [itemsInView,setItemsInView] = useState([])
    const [hasMore,setHasMore] = useState(false)
    const [error,setError]= useState(false)
    const [errorMessage,setErrorMessage] = useState("Error")
    const homeCollection = useSelector(state=>state.users.homeCollection)
    
    useEffect(()=>{
        dispatch(fetchAllProfiles())
        if(libraryInView==null || (libraryInView!=null && libraryInView.id != pathParams["id"])){
            const id =  pathParams["id"]
            const params = {id: id}
            dispatch(clearPagesInView())
            dispatch(fetchLibrary(params)).then(result=>{
                if(result.error==null){
                    const {payload} = result
                    if(payload.error==null){
                        getPages()
                        isFollowing()
                        
                    }
                }
               
                
            })
        }else{
            dispatch(clearPagesInView())
            getPages()
            isFollowing()
    
        }
    },[])
    const isFollowing = () =>{
        if(currentProfile && libraryInView){
            const params = {
                profile: currentProfile
            }
        
        dispatch(fetchFollowLibraryForProfile(params)).then(result=>{
            checkResult(result,payload=>{
                const {followList } = payload

                let found = followList.find(fl=>fl.libraryId==libraryInView.id && fl.profileId == currentProfile.id)
                setFollowing(found)
            })
        })
    }}
    useEffect(()=>{
            getPages()
            getBooks()
    
    },[])
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
               
                return  (<div className="info view">
                            <div className="inner">
                            <h2 className="name">{lib.name}</h2>
                            <p className="purpose"> {lib.purpose}</p>
                            <div className="button-row reverse">
                                {button} 
                                {followDiv()}
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
            let follow = followedLibraries.find(fl=>fl!=null && fl.libraryId == libraryInView.id && fl.profileId == currentProfile.id)
            if(follow){
                const params = {
                    followLibrary: follow,
                    profile: currentProfile,
                    library: libraryInView
                }
                dispatch(deleteFollowLibrary(params)).then((result)=>{
                    if(result.error==null){
                        const {payload}= result
                        if(payload.error==null){
                            setFollowing(null)
                        }
                    }

                })
            }else{
                const params = {
                        library: libraryInView,
                        profile: currentProfile}
                dispatch(createFollowLibrary(params)).then((result)=>{
                    if(result.error==null){
                        const {payload }= result
                        if(payload.error==null){
                            setFollowing(payload.followLibrary)
                    
                    let libraries = [...homeCollection.libraries]
                      let id = homeCollection.libraries.find(id=>libraryInView.id==id)
                      if(!id){
                        libraries= [...homeCollection.libraries,libraryInView.id]
                      }
                      let books = [...homeCollection.books]
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
             }else{
                window.alert("Follow error: Try logging in again")
             }}})
    }

    }else{
        window.alert("You'll need to login first")
    }
    }
    const followDiv = ()=>{

        return following? 
    (<Button style={{backgroundColor:theme.palette.secondary.light,
                color:theme.palette.secondary.contrastText}}
                variant="outlined"
                onClick={onClickFollow}
                >Following
                </Button>)  : (<Button style={{backgroundColor:theme.palette.secondary.main,
                color:theme.palette.secondary.contrastText}}
                variant="outlined"
                onClick={onClickFollow}
                >Follow
                </Button>)
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
                <div className="content">
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
            </div>
            )}else{

                return(<div className="content-list">
                    <div className="content">

                   
                    Content Loading...
                    </div>
                </div>)

            }}else{
                return(<div className="content-list">
                    <div className="error">
                    <h2 >{errorMessage}</h2>
                    </div>
                </div>)
            }
        
        
    }
    
    return (
    <div>
    <div className="two-panel">
        <div className="left-bar">
        {contentList()}
        </div>
                    
             
        <div className="right-bar">
      
                {libraryInfo()}
           
        </div>
        </div>
    </div>)


}



export default LibraryViewContainer