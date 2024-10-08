import { useSelector,useDispatch} from 'react-redux'
import DashboardItem from '../components/page/DashboardItem'
import { useState,useEffect ,useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import "../styles/Discovery.css"
import ErrorBoundary from '../ErrorBoundary'
import {getPublicStories } from '../actions/PageActions'
import { getPublicBooks } from '../actions/CollectionActions'
import { getPublicLibraries, setLibraryInView } from '../actions/LibraryActions'
import checkResult from '../core/checkResult'
import MediaQuery, { useMediaQuery } from "react-responsive"
import BookListItem from '../components/BookListItem'
import Paths from '../core/paths'
import uuidv4 from '../core/uuidv4'
import ReactGA from "react-ga4"
import grid from "../images/grid.svg"
import stream from "../images/stream.svg"
function DiscoveryContainer(props){
    
    useEffect(()=>{
        ReactGA.send({ hitType: "pageview", page: window.location.pathname+window.location.search, title: "About Page" })
    },[])


    const [isGrid,setIsGrid] = useState(false)
    const isNotPhone = useMediaQuery({
        query: '(min-width: 768px)'
      })
    useEffect(
        ()=>{
            if(!isNotPhone){
                setIsGrid(false)
            }
        },[isNotPhone]
    )
    const navigate = useNavigate()
    const dispatch = useDispatch()
    let booksInView = []
    let bookCol = useSelector(state=>state.books.booksInView)
    if(bookCol){
  booksInView =[...bookCol].sort(
            (a,b)=>{
            
                return new Date(b.created)- new Date(a.created)
            }   
        )  
    }
   
    const pagesInView = useSelector((state)=>state.pages.pagesInView)
    const [hasMoreLibraries,setHasMoreLibraries] =useState(false)
    const libCollection = useSelector(state=>state.libraries.librariesInView)
    let librariesInView = []
        if(libCollection && libCollection.length>0){
            librariesInView =libCollection.sort((a,b)=>{
   
                return b.created- a.created
            })
        }
   
    useEffect(()=>{
        fetchContentItems()
        fetchLibraries()
    },[])
const navigateToLibrary = (library)=>{
    dispatch(setLibraryInView({library:library}))
    navigate(Paths.library.createRoute(library.id))
}
    const libraryForums = ()=>{
        if(librariesInView!=null){
            return (<InfiniteScroll
            dataLength={librariesInView.length}
            next={fetchLibraries}
            style={{display:"flex",flexDirections:"row"}}
            hasMore={hasMoreLibraries}
            >
                {librariesInView.map(library=>{
                    const id = `${library.id}_${uuidv4()}`
                    return(<div key={id} 
                                onClick={()=>navigateToLibrary(library)} className='item'> 
                                <div className='purpose'> 
                                    <p>{library.purpose}</p>
                                </div>
                                <div className='name'>
                                    <h5> {library.name}</h5>
                                </div>
                    </div>)
                })}
            </InfiniteScroll>)
        }
    }
    const bookList = ()=>{
        if(booksInView!=null){
            return(
        
    
                <InfiniteScroll
            className={`mt-1   ${isNotPhone?"flex-col":"flex-row"} flex`}
            dataLength={booksInView.length}
            next={fetchContentItems}
            hasMore={false}
            >
                {booksInView.map(book=>{
                    let id = `${book.id}_${uuidv4()}`
                    return(
                        <div key={id}>
                            <BookListItem book={book}/>
                        </div>)
                })}
</InfiniteScroll>
   )

        }
    }
    const pageList = ()=>{
        if(pagesInView!=null){
            return(<div 
            //id="grid page-list "
            >
               <InfiniteScroll
            dataLength={pagesInView.length}
            next={fetchContentItems}
            scrollThreshold={1}
            hasMore={false}
            style={isGrid?{overflow:"unset"}:{display:"flex",flexDirections:"row"}}
            >

               <div className={isGrid && isNotPhone?'grid grid-cols-2 lg:gap-4':""}>
              {pagesInView.map(page=>{
                    const id = `${page.id}_${uuidv4()}`
                    return(<div id={id}>
                        <DashboardItem isGrid={isGrid} key={page.id} page={page}/>
                    </div>)
                })}
                </div>
            </InfiniteScroll> </div>)
        }
    }
    const fetchContentItems = ()=>{
    
            dispatch(getPublicStories()).then(result=>checkResult(
                result,payload=>{
                    
               
                },err=>{
                    window.alert(err)
                })
             
            )
            dispatch(getPublicBooks()).then(result=>checkResult(result,
                payload=>{
                
             
                  
                },err=>{

                })
            )   
        }
        const fetchLibraries = ()=>{
            setHasMoreLibraries(true)
            dispatch(getPublicLibraries()).then(result=>checkResult(result,payload=>{
            
                setHasMoreLibraries(false)
            },err=>{

            }))
        }
        const onClickForGrid =(bool)=>{


            setIsGrid(bool)
            if(bool){
                ReactGA.event({
                    category: "Discovery",
                    action: "Click for Grid View",
                    label: "GRID ICON", 
                    nonInteraction: false
                  });
            }else{
                ReactGA.event({
                    category: "Discovery",
                    action: "Click for Stream",
                    label: "STREAM ICON", 
                    nonInteraction: false
                  });
            }
        }
        return(
            <ErrorBoundary>
            <div 
            //id="discover" 
            className=' mx-auto ' >
            <div style={{paddingTop:"3em"}}>
                <h1 >Discovery</h1>
                </div>
              <div className=' text-left' >
               
                <h3 className='text-white sm:ml-36 ml-8 sm:pl-4 font-extrabold text-2xl'>Libraries</h3>
                {libraryForums()}
                    
                <div className='flex  flex-col-reverse lg:flex-row'>
                    <div className=' lg:w-128 lg:ml-32 lg:mr-16 lg:ml-16 '>

                        <div className='flex flex-row'>
                        <h3 className=' text-white  
                                        font-extrabold 
                                        text-2xl 
                                        text-left 
                                        mx-4
                                        my-4 pl-2 l
                                        lg:mb-4'>Pages</h3>
                        {isNotPhone?<div className='flex flex-row'><button onClick={()=>onClickForGrid(true)}
                                className=' bg-transparent 
                                            ml-2 mr-0 px-1 py-0'>
                                <img src={grid}/>
                        </button>
                        <button onClick={()=>onClickForGrid(false)}
                                className='bg-transparent px-1 py-0'>
                                    <img src={stream}/>
                        </button></div>:null}
                        </div>
                    {pageList()}
                    </div>
                    <div className=' lg:flex-1  lg:mx-4'>
                       <div className='w-24  mx-auto '>
                        <h3 className=' text-white 
                                        text-left 
                                        font-extrabold 
                                        pl-2 pt-2 mt-1 mx-4 text-2xl'>Books</h3>
                                        <div className=''>
                    {bookList()}
                    </div>
                    </div>
                    </div>
                    </div > 
           
                    </div>
                    </div>
             
            </ErrorBoundary>
        )

}

export default DiscoveryContainer