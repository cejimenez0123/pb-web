
import { useEffect,useState} from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useSelector,useDispatch } from "react-redux"
import {  
    fetchArrayOfPages,
            fetchPage} from "../../actions/PageActions"
import { useParams, useNavigate  } from "react-router-dom"
import {updateHomeCollection,
        createFollowLibrary,
        deleteFollowLibrary,
        fetchFollowLibraryForProfile,
    } from "../../actions/UserActions"
    import BookListItem from "../../components/BookListItem"
import { fetchLibrary, setLibraryInView } from "../../actions/LibraryActions"
import DashboardItem from "../../components/DashboardItem"
import "../../styles/Library.css"
import { fetchBook } from "../../actions/BookActions"
import SettingsIcon from '@mui/icons-material/Settings';
import { Button } from "@mui/material"
import theme from "../../theme"
import "../../App.css"
import checkResult from "../../core/checkResult"
import Add from "@mui/icons-material/Add"
import { IconButton } from "@mui/joy"
import uuidv4 from "../../core/uuidv4"
import { iconStyle } from "../../styles/styles"
import {Helmet} from "react-helmet"
function LibraryViewContainer(props){
    const pathParams = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const libraryInView = useSelector(state=>state.libraries.libraryInView)
    const loading = useSelector(state=>state.libraries.loading)
    const followedLibraries = useSelector(state=>state.users.followedLibraries)
    const [following,setFollowing]= useState(null)
    const [itemsInView,setItemsInView] = useState([])
    const [hasMore,setHasMore] = useState(false)
    const [error,setError]= useState(false)
    const [errorMessage,setErrorMessage] = useState("Error")
    const homeCollection = useSelector(state=>state.users.homeCollection)

    useEffect(()=>{
        dispatch(fetchLibrary(pathParams)).then(result=>{
                checkResult(result,payload=>{
                    const {library } = payload
                    checkLibraryPermission(library)
                    isFollowing()
                },err=>{
                
                }) 
            })
    },[])
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
        if(libraryItem.privacy){
            if(currentProfile){
                let founa = libraryItem.readers.find(id=>currentProfile && id==currentProfile.userId)
                let founb=  libraryItem.commenters.find(id=> currentProfile && id==currentProfile.userId)
                let founc =  libraryItem.writers.find(id=>currentProfile && id==currentProfile.userId)
                let found =  libraryItem.editors.find(id=>currentProfile && id==currentProfile.userId)
                let owner = currentProfile &&  libraryItem.profileId == currentProfile.id        
                 
                if(founa || founb || founc || found||owner) {
                    setError(false)
                    fetchData(libraryItem)
                }else{
                    setError(true)
                    setErrorMessage("Not for your viewing")
                }
            }else{
                setError(true)
                setErrorMessage("Not for your viewing")
            }
                
            }else{
                setError(false)
                fetchData(libraryItem)
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
                    <SettingsIcon style={iconStyle}/>
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
            return (<IconButton  onClick={()=>{
            setLibraryInView({library:libraryInView})
            navigate(`/library/${libraryInView.id}/add`)
    
           }}>
                <Add style={iconStyle}/>
            </IconButton>)
        }}
        return(<div></div>)
    }
    const deleteFollowLibraryAction = ()=>{
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
    }}
    const onClickFollow = ()=>{
        if(currentProfile){
        if(libraryInView){
            deleteFollowLibraryAction()
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
                >Reader
                </Button>)  : (<Button style={{backgroundColor:theme.palette.secondary.main,
                color:theme.palette.secondary.contrastText}}
                variant="outlined"
                onClick={onClickFollow}
                >Read
                </Button>)
    }
    
 
    const getPages = (libraryItem) =>{

        if(libraryItem){
            dispatch(fetchArrayOfPages({pageIdList:libraryItem.pageIdList})).then(result=>
                checkResult(result,payload=>{
                    let {pageList} = payload
                    let list =  pageList.map(page=>{return {uId:`${uuidv4}_${page.id}`,page:page}})
                    setItemsInView(prevState=>[...prevState,...list])
                },err=>{
                    console.error(err)
                }))
            
        }else{
            setError(true)
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
                libraryItem.bookIdList.forEach(bookId=>{
                    dispatch(fetchBook({id:bookId})).then(result=>{
                        checkResult(result,payload=>{
                            const {book}=payload
                            book.pageIdList.forEach(pageId=>{
                                    dispatch(fetchPage({id:pageId})).then(result=>{
                                        checkResult(result,payload=>{
                                            const {page}=payload
                                            const story = {uId:`${uuidv4}_${book.id}_${page.id}`,book:book,page:page}
                                            setItemsInView(prevState=>[...prevState,story])
                                            setError(false)
                                        },err=>{
                                        })
                                    })
                                })
                            
                        },err=>{
                            setErrorMessage("Error "+err.message)
                        })
                    })
                
                setError(false)
                })
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
    
            if(itemsInView.length>0 && libraryInView){
               
            return(<div className="content-list">
                <div className="">
                <InfiniteScroll 
                dataLength={itemsInView.length}
                next={()=>fetchData(libraryInView)}
                hasMore={hasMore} 
                loader={<p>Loading...</p>}
                endMessage={<div  className="no-more-data"><p>No more data to load.</p></div>}
                scrollableTarget="scrollableDiv"
                >
                    <div>
                {
                    itemsInView.map((story)=>{
                        
                            if(story.page){
                            
                                return(<div key={story.page.id+"_"+uuidv4()}>
                                
                                <DashboardItem book={story.book} library={libraryInView}
                                                page={story.page}/>
                            </div>)}else if(story.book){
                                return(<div key={story.book.id+"_"+uuidv4()}>
                                    
                                    <BookListItem book={story.book}/>
                                    </div>)
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
            return(<div className="error"><h6>{errorMessage}</h6></div>)
        }
        
        
    }
  const helmet = ()=>{
    if(libraryInView){
    return<Helmet>
    <title>{libraryInView.title}</title>
    <meta
  name="description"
  content={libraryInView.purpose}
/>
    </Helmet>
    }
  }
    return (
    <div>
    {helmet()}
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