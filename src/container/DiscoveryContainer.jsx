import { useSelector,useDispatch} from 'react-redux'
import DashboardItem from '../components/page/DashboardItem'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import "../styles/Discovery.css"
import ErrorBoundary from '../ErrorBoundary'
import {getPublicStories } from '../actions/PageActions'
import { getPublicBooks } from '../actions/CollectionActions'
import { getPublicLibraries, setLibraryInView } from '../actions/LibraryActions'
import checkResult from '../core/checkResult'
import { useMediaQuery } from "react-responsive"
import BookListItem from '../components/BookListItem'
import Paths from '../core/paths'
import uuidv4 from '../core/uuidv4'
import ReactGA from "react-ga4"
import grid from "../images/grid.svg"
import stream from "../images/stream.svg"
import InfoTooltip from '../components/InfoTooltip'
function DiscoveryContainer(props){
    
    useEffect(()=>{
        ReactGA.send({ hitType: "pageview", page: window.location.pathname+window.location.search, title: "About Page" })
    },[])

    const [errorMessage,setErrorMessage]=useState(null)
    const [isGrid,setIsGrid] = useState(false)
    const isNotPhone = useMediaQuery({
        query: '(min-width: 999px)'
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
    let bookCol = useSelector(state=>state.books.collections)
    if(bookCol){
  booksInView =[...bookCol].sort(
            (a,b)=>{
            
                return new Date(b.created)- new Date(a.created)
            }   
        )  
    }
   
    const pagesInView = useSelector((state)=>state.pages.pagesInView)
    const [hasMoreLibraries,setHasMoreLibraries] =useState(false)
    const [librariesInView,setLibraries]=useState([])
    const libCollection = useSelector(state=>state.libraries.librariesInView)
 
    useEffect(()=>{
   
   setLibraries(libCollection)
    },[libCollection])
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
            className='min-h-24'
            dataLength={librariesInView.length}
            next={fetchLibraries}
            style={{display:"flex",flexDirections:"row"}}
            hasMore={hasMoreLibraries}
            endMessage={<div className='flex min-w-72 mont-medium'><span className='mx-auto my-auto text-center rounded-full p-3  text-emerald-400 '><h6 className=''>Join the community. <br/>Apply to join today.</h6><h6>Share your own work.</h6><h6> This is what we have for now.</h6></span></div>}
            >
                {librariesInView.map(library=>{
                    return     <div key={library.id}>
                  <BookListItem book={library}/></div>
           
                })}
            </InfiniteScroll>)
        }
    }
    const bookList = ()=>{
        if(booksInView!=null){
            return(
        
    <div className='md:ml-12'> <h3 className=' text-emerald-900
    text-left 
    font-extrabold 
    pl-4   mx-4 lora-bold text-2xl'>Collections</h3>
                <InfiniteScroll
            className={`   min-h-[12rem] flex-row flex`}
            dataLength={booksInView.length}
            next={fetchContentItems}
            hasMore={false}
            endMessage={<div className='flex min-w-72 mont-medium'>
                <span className='mx-auto my-auto text-center rounded-full p-3  text-emerald-400 '>
                    <h6 className=''>
                        Join the community. <br/>Apply to join today.
                        </h6><h6>Share your own work.</h6>
                        <h6> This is what we have for now.</h6>
                        </span></div>}
            >

                {booksInView.map((book,i)=>{
                    let id = `${book.id}_${i}`
                    return(
                        <div key={id} className='my-auto'>
                            <BookListItem book={book}/>
                        </div>)
                })}
</InfiniteScroll>
</div>)

        }
    }
    const pageList = ()=>{
        if(pagesInView!=null){
            return(<div 
            className=' w-[96vw] md:w-page mx-auto '
            >
               <InfiniteScroll
            dataLength={pagesInView.length}
            next={fetchContentItems}
            scrollThreshold={1}
            hasMore={false}
                >
               
<div 
// className={`${isGrid && isNotPhone ? 'flex flex-wrap flex-row flex-col items-top' : ''}`}
// className={`max-w-screen mx-auto ${
//     isGrid && isNotPhone ? 'flex flex-wrap ' : ''
//   }`}
// className={` ${
//     isGrid && isNotPhone ? 'grid gap-1 grid-cols-2 auto-rows-auto max-w-[52em] items-start break-inside-avoid  grid-flow-row  ' : 'max-w-screen '
//   }`}
className={`${
    isGrid && isNotPhone ? 'grid-cols-2 grid gap-2 ' : ''
  }`}
//   className={`max-w-screen mx-auto ${
//     isGrid && isNotPhone ? ' grid  grid-flow-row-dense grid-cols-2 ' : ''
//   }`}
>
 
                {pagesInView.filter(page=>page).map(page=>{

                    const id = `${page.id}_${uuidv4()}`
                    return(<div 
                        // className={isGrid?"max-w-[22em]":"m-1  h-fit "}
                        key={id}
                        // className=" mb-4 "
                        className="break-inside-avoid mb-4  auto-cols-min"
     
                    >
                        
                        <DashboardItem isGrid={isGrid} key={page.id} page={page}/>
                    </div>)
                })}
                </div>
            </InfiniteScroll> </div>)
        }
    }
    const fetchContentItems = ()=>{
    
            dispatch(getPublicStories())
            
            dispatch(getPublicBooks())  
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

            className=' max-w-[100vw] mt-4' >

              <div className=' text-left ' >
               
                <h3 className={`text-emerald-900 ${isNotPhone?'ml-16 pl-6 ':'pl-4 ml-4'} pb-4 lora-bold font-extrabold text-2xl`}>Communities</h3>
                <div className='mb-12'>
                {libraryForums()}
                </div>
                <div className='mb-12'>
                {bookList()} 
                </div>
                <div className='flex max-w-[96vw] md:w-page mx-auto flex-col '>
                    

                        <h3 className=' text-emerald-900
                                        font-extrabold 
                                        text-2xl 
                                        text-left 
                                        mx-4
                                        lora-bold
                                        my-4 l
                                        lg:mb-4'>Pages</h3>
                        {isNotPhone?<div className='flex flex-row'><button onClick={()=>onClickForGrid(true)}
                                className=' bg-transparent 
                                            ml-2 mr-0 px-1 border-none py-0'>
                                <img src={grid}/>
                        </button>
                        <button onClick={()=>onClickForGrid(false)}
                                className='bg-transparent border-none px-1 py-0'>
                                    <img src={stream}/>
                        </button></div>:null}
                        </div>
<div className='max-w-screen'>
    
                    {pageList()}
                  
                    </div>
                    </div>
                    <div className=' lg:flex-1  lg:mx-4'>
                       <div className='w-24  mx-auto '>
                       
                                        <div className=''>
                   
                    </div>
                    </div>
            
                 
           
                    </div>
                    </div>
             
            </ErrorBoundary>
        )

}

export default DiscoveryContainer