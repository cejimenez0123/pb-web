
import { useEffect,useState} from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useSelector,useDispatch } from "react-redux"
import {  
            fetchPage} from "../actions/PageActions"
import { useParams, useNavigate  } from "react-router-dom"
import {updateHomeCollection,
        createFollowLibrary,
        deleteFollowLibrary,
        fetchFollowLibraryForProfile,
    fetchProfile} from "../actions/UserActions"
import { fetchLibrary, setLibraryInView } from "../actions/LibraryActions"
import DashboardItem from "../components/DashboardItem"
import "../styles/Library.css"
import { fetchBook } from "../actions/BookActions"
import SettingsIcon from '@mui/icons-material/Settings';
import { Button } from "@mui/material"
import theme from "../theme"
import "../App.css"
import checkResult from "../core/checkResult"
import Add from "@mui/icons-material/Add"
import { IconButton } from "@mui/joy"
// const useStyles = makeStyles({
//     pokemonCardsArea: {
//       paddingTop: "30px",
//       paddingLeft: "15%",
//       paddingRight: "15%",
//       width: "100%"
//     },
//     pokemonImage: {
//       height: "160px",
//       width: "160px"
//     },
//     progress: {
//       position: "fixed",
//       top: "50%",
//       left: "50%",
//       marginTop: "-100px",
//       marginLeft: "-100px"
//     }
//   });
function LibraryViewContainer(props){
    const pathParams = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const libraryInView = useSelector(state=>state.libraries.libraryInView)
    const followedLibraries = useSelector(state=>state.users.followedLibraries)
    const [following,setFollowing]= useState(null)
    const [itemsInView,setItemsInView] = useState([])
    const [hasMore,setHasMore] = useState(false)
    const [error,setError]= useState(false)
    const [errorMessage,setErrorMessage] = useState("Error")
    const homeCollection = useSelector(state=>state.users.homeCollection)
    
    useEffect(()=>{
      
        const id =  pathParams["id"]
        if(libraryInView==null || (libraryInView!=null && libraryInView.id !== id)){
           
            const params = {id: id}
            dispatch(fetchLibrary(params)).then(result=>{
                checkResult(result,payload=>{
                    const {library } = payload
                    checkLibraryPermission(library)
                    isFollowing()
                },err=>{

                }) 
            })
        }else{
            checkLibraryPermission(libraryInView)
            isFollowing()
        }
        
    },[])
    useEffect(()=>{
        isFollowing()
    },[libraryInView])
    const isFollowing = () =>{
        if(currentProfile && libraryInView){
            const params = {
                profile: currentProfile
            }
        
        dispatch(fetchFollowLibraryForProfile(params)).then(result=>{
            checkResult(result,payload=>{
                const {followList } = payload

                let found = followList.find(fl=>fl && fl.libraryId===libraryInView.id && fl.profileId === currentProfile.id)
                setFollowing(found)
            },()=>{

            })
        })
        }
    }
    const checkLibraryPermission= (libraryItem)=>{
        if( libraryItem.privacy){
            if(currentProfile){
                let founa = libraryItem.readers.find(id=>currentProfile && id==currentProfile.userId)
                let founb=  libraryItem.commenters.find(id=> currentProfile && id==currentProfile.userId)
                let founc =  libraryItem.writers.find(id=>currentProfile && id==currentProfile.userId)
                let found =  libraryItem.editors.find(id=>currentProfile && id==currentProfile.userId)
                let owner = currentProfile &&  libraryItem.profileId == currentProfile.id        
                 
                if(founa || founb || founc || found||owner) {
                    setError(false)
                    fetchData(libraryItem)
                    const profileParams = {
                        id:  libraryItem.profileId
                    }
                    dispatch(fetchProfile(profileParams))
                  
                }else{
                    setError(true)
                }
            }else{
                setError(true)
            }
                
            }else{
                setError(false)
                fetchData(libraryItem)
                const profileParams = {
                        id:  libraryItem.profileId
                    }
                dispatch(fetchProfile(profileParams)) 
            }
    }
   
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
                            <div className="button-row">
                                {followDiv()}
                                {button} 
                                {addBtn()}
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
    const addBtn =()=>{
    
        if(currentProfile&&libraryInView){
            let owner = libraryInView.profileId == currentProfile.id
            let writer =libraryInView.writers.find(id=>currentProfile.userId==id)
            let editor = libraryInView.editors.find(id=>currentProfile.userId==id)
           if(Boolean(owner)||Boolean(writer)||Boolean(editor)||libraryInView.writingIsOpen){
            return (<IconButton onClick={()=>{
            setLibraryInView({library:libraryInView})
            navigate(`/library/${libraryInView.id}/add`)
    
           }}>
                <Add/>
            </IconButton>)
        }}
        return(<div></div>)
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
                    if(homeCollection){
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
                    }
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
    
 
    const getPages = (libraryItem) =>{
        if(libraryItem){
            setHasMore(true)
            libraryItem.pageIdList.forEach(pageId=>{
                dispatch(fetchPage({id:pageId})).then(result=>{
                    checkResult(result,payload=>{
                            const {page}=payload
                            if(page){
                                const story ={page:page}
                                if(!itemsInView.includes(story)){
                                setItemsInView(prevState=>[...prevState,story])
                                }
                            }
                            setHasMore(false)
                    },(err)=>{
                        setHasMore(false)
                    })
                })
            })
        }else{
            setErrorMessage('Library is Null')
        }
    }
    const fetchData = (libraryItem) =>{
        setItemsInView([])
        getPages(libraryItem)
        getBooks(libraryItem)
    }
    const getBooks=(libraryItem)=>{
            if(libraryItem){
                if(libraryItem.bookIdList.length>0){
                setHasMore(true)
                libraryItem.bookIdList.forEach(bookId=>{
                    dispatch(fetchBook({id:bookId})).then(result=>{
                        checkResult(result,payload=>{
                            const {book}=payload
                            if(book.pageIdList.length>0){
                                book.pageIdList.forEach(pageId=>{
                                    dispatch(fetchPage({id:pageId})).then(result=>{
                                        checkResult(result,payload=>{
                                            const {page}=payload
                                            const story = {book:book,page:page}
                                            let found = itemsInView.includes(story)
                                            if(!Boolean(found)){
                                            setItemsInView(prevState=>[...prevState,story])
                                            }
                                            setHasMore(false)
                                            setError(false)
                                        },err=>{
                                        
                                            setHasMore(false)
                                        })
                                    })
                                })
                            }else{
                                const story = {book:book}
                                setItemsInView(prevState=>[...prevState, story])
                                setHasMore(false)
                            }
                        },err=>{
                            setError(true)
                            setErrorMessage("Error "+err.message)
                        })
                    })
                })
                setError(false)
            }
        }else{
            setError(true)
            setErrorMessage("Library null")
        }
    }
    
    const contentList = ()=>{
        if(!error){
            const empty = (<div className="empty">
            <h1>
            Empty
            </h1>
        </div>)
    
            if(itemsInView.length>0 &&(libraryInView &&(libraryInView.bookIdList.length>0 || libraryInView.pageIdList.length>0))){
            return(<div className="content-list">
                <div className="content">
                <InfiniteScroll 
                dataLength={itemsInView.length}
                next={()=>checkLibraryPermission(libraryInView)}
                hasMore={itemsInView.length<[...libraryInView.bookIdList,...libraryInView.pageIdList].length} // Replace with a condition based on your data source
                loader={<p>Loading...</p>}
                endMessage={<div  className="no-more-data"><p>No more data to load.</p></div>}
                scrollableTarget="scrollableDiv"
                >
                    <div>
                {
                    itemsInView.map((story)=>{
                        
                            if(story.page){
                            
                                return(<div key={story.page.id}>
                                
                                <DashboardItem book={story.book} library={libraryInView}
                                                page={story.page}/>
                            </div>)}else{
                                return(<div>{JSON.stringify(story.book)}</div>)
                            }
                    })}
                </div>
                </InfiniteScroll> 
                </div>
            </div>
            )}else{
                return empty
            }
        }else{
            return(<div><h5>{errorMessage}</h5></div>)
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