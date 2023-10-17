
import { useEffect,useState} from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useSelector,useDispatch } from "react-redux"
import { fetchArrayOfPages, fetchArrayOfPagesAppened } from "../actions/PageActions"
import { useParams } from "react-router-dom"
import { fetchAllProfiles } from "../actions/UserActions"
import { fetchLibrary } from "../actions/LibraryActions"
import DashboardItem from "../components/DashboardItem"
import "../styles/Library.css"
import { clearPagesInView } from "../actions/PageActions"
import BookRole from "../domain/models/bookrole"
import { fetchArrayOfBooks } from "../actions/BookActions"
import { useNavigate } from "react-router-dom"
import SettingsIcon from '@mui/icons-material/Settings';
import { Button } from "@mui/material"
function LibraryViewContainer(props){
    const pathParams = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const libraryInView = useSelector(state=>state.libraries.libraryInView)
    const profilesInView = useSelector(state=>state.users.profilesInView)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const booksInView = useSelector(state=>state.books.booksInView)
    const [itemsInView,setItemsInView] = useState([])
    const [hasMorePages,setHasMorePages] = useState(false)
    const [error,setError]= useState(false)
    const [errorMessage,setErrorMessage] = useState("Error")
    useEffect(()=>{
        dispatch(fetchAllProfiles())
        if(libraryInView==null){
            const id =  pathParams["id"]
            const params = {id: id}
            dispatch(clearPagesInView())
            dispatch(fetchLibrary(params)).then(result=>{
                getPages()
                
            })
        }else{
            console.log(`csdfffsx ${JSON.stringify(libraryInView)}`)
            dispatch(clearPagesInView())
            getPages()
            
            
        }
      
    },[])
    useEffect(()=>{
        if(libraryInView!=null){
            getPages()
        }
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
                return  (<div className="info">
                            <h2 className="namee">{lib.name}</h2>
                            <p className="purpose"> {lib.purpose}</p>
                            <div className="button-row reverse">
                                {button}
                            </div>
                        </div>
                        )
                        
                    }else{

                    return(<div>
                            Loading...
                        </div>)
                }
    }
    const getPages = () =>{
        if(libraryInView!=null){

            const pageIdList = libraryInView.pageIdList
            const params = {pageIdList: pageIdList}

            dispatch(fetchArrayOfPages(params)).then((result) => {

                if(result.error ==null ){
                  
                    let newState = []
                    const {payload } = result
                    const {pageList } = payload
                    console.log(`dwwdw${JSON.stringify(payload)}`)
                    if(payload.error==null){
                        setError(false)
                    setItemsInView(prevState=>{
                       
                        pageList.forEach((page) => {
                            console.log(`Pds ${JSON.stringify(prevState)}`)
                            const item = prevState.find(item=> item.id == page.id)
                            if(item==null){
                                newState.push(page)
                            }
                        
                        })
                        return [...prevState,...newState]

                    })
                    setHasMorePages(false)
                }else{
                        setErrorMessage("B")
                        setError(true)
                    }
                }else{
                    setErrorMessage("A")
                    setError(true)
                }
            
                getBooks()
            }).catch((err) => {
                
            });
        }else{
            console.error("Library null")
        }
    }
    const getBooks=()=>{
            if(libraryInView && libraryInView.bookIdList.length > 0){
                
                let params = {bookIdList: libraryInView.bookIdList};

                dispatch(fetchArrayOfBooks(params)).then(result=>{
                    let pageIdList = []
                    if(result.error ==null){
                        const { payload } = result
                        const {bookList} = payload
                        console.log(`dssffs ${JSON.stringify(payload)}`)
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
                })
            }
    }
    
    const contentList = ()=>{
        if(!error){
        if(itemsInView!=null && itemsInView.length>0 ){
            return(<div className="content-list">

                <InfiniteScroll
                dataLength={itemsInView.length}
                next={getPages}
                hasMore={hasMorePages} // Replace with a condition based on your data source
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
                            let profile = null
                            if(profilesInView){
                                profile = profilesInView.find(profile => profile.id == story.profileId)
                            }
                            
                            if(page){
                           let title = (
                                <div>
                                    <a onClick={
                                        ()=>{
                                            navigate(`/book/${story.id}`)
                                            }
                                        }>
                                {story.title} 
                                </a>{` > `} <a
                                        onClick={()=>{
                                            navigate(`/page/${page.id}`)
                                        }}
                                >{page.title}</a>
                            </div>)
                            let profileDiv = (<div>
                                    
                            </div>)
                            if(profile){
                                profileDiv=(<div>
                                    <h6>
                                    {profile.username}
                                    </h6>
                                </div>)
                            }
                            
                                return(<div className="content-item " key={story.id}>
                                    {/* <div className="item-row">
                                     
                                </div> */}
                                <DashboardItem book={story} page={page}/>
                            </div>)}
            }else{
               const profile = profilesInView.find(profile => profile.id == story.profileId)
                let profileDiv = (<div>
                                    
                    </div>)
                    if(profile){
                        profileDiv=(<div id="username">
                            <h6>
                            {profile.username}
                            </h6>
                        </div>)
                    }          
                return(
                
                <div  className="content-item"  key={story.id}>
                    <div className="item-row">
                        <h6 id="title"> {story.title}</h6>
                        {profileDiv}

                    </div>
                    
                    <DashboardItem page={story}/>
                    
                </div>)
            }})
        }
                </InfiniteScroll>
            </div>
            )}else{

                return(<div>
                    Content Loading...
                </div>)

            }}else{
                return(<div>
                    {errorMessage}
                </div>)
            }
        
        
        }
    
    return (<div id="container">
        <div className="left-side-bar">
           
        </div>
        <div className="main-side-bar">
                {contentList()}
        </div>
        <div className="right-side-bar">
        <div>
                {libraryInfo()}
            </div>
        </div>
    </div>)


}

export default LibraryViewContainer