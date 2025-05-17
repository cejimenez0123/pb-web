
import { useSelector,useDispatch} from 'react-redux'
import { useState,useEffect, useLayoutEffect, useContext } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import "../styles/Discovery.css"
import "../Dashboard.css"
import ErrorBoundary from '../ErrorBoundary'
import {getPublicStories, setPagesInView } from '../actions/PageActions'
import { getPublicCollections, setCollections } from '../actions/CollectionActions'
import { getPublicLibraries} from '../actions/LibraryActions.jsx'
import checkResult from '../core/checkResult'
import { useMediaQuery } from "react-responsive"
import BookListItem from '../components/BookListItem'
import grid from "../images/grid.svg"
import stream from "../images/stream.svg"
import { initGA,sendGAEvent } from '../core/ga4.js'
import ListView from '../components/page/ListView.jsx'
import ScrollDownButton from '../components/ScrollDownButton.jsx'
import Context from '../context.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
import Paths from '../core/paths.js'
import { Helmet } from 'react-helmet'
import Enviroment from '../core/Enviroment.js'
import useScrollTracking from '../core/useScrollTracking.jsx'
function DiscoveryContainer(props){
    const {currentProfile,setSeo,seo}=useContext(Context)
    useLayoutEffect(()=>{
        initGA()
     
        
   },[])
    
    const navigate = useNavigate()
     const cols = useSelector(state=>state.books.collections)
    const books = useSelector(state=>state.books.books)
    const libraries = useSelector(state=>state.books.libraries)
    const [isGrid,setIsGrid] = useState(false)
   const location = useLocation()
    const dispatch = useDispatch()
   useScrollTracking({name:"discovery"})
  
    const pagesInView = useSelector((state)=>state.pages.pagesInView)
    const [hasMoreLibraries,setHasMoreLibraries] =useState(false)
    const isNotPhone = useMediaQuery({
        query: '(min-width: 999px)'
      })
    const [viewItems,setViewItems]=useState([])
    useLayoutEffect(()=>{

       let list = [...pagesInView,...cols].filter(item=>item).sort((a,b)=>{
           let date = 1000*60*60*24
           let k = 4;
           if (a.priority || b.priority) {
            if (a.priority && b.priority) {
              let ageA = (Date.now() - a.updated) / date;
              let ageB = (Date.now() - b.updated) / date;
        
              let scoreA = a.priority / (ageA + k);
              let scoreB = b.priority / (ageB + k);
        
              if (scoreA > scoreB) return 1; // higher score first
              if (scoreA < scoreB) return -1;
              return 0;
            }
        
            // Only one has priority — show it first
            if(a.priority){
            return a.priority ? -1 : 1;
            }
        
          // No priority on either — fallback to created date
          return b.created - a.created; // recent first
        
           
            }
            return new Date(a.updated).getTime() - new Date(b.updated).getTime()
            
        })
         setViewItems(list)       
    },[pagesInView,books])
   
    // },[pagesInView,books])
    useEffect(
        ()=>{
            if(!isNotPhone){
                setIsGrid(false)
            }
        },[isNotPhone]
    )


    useLayoutEffect(()=>{
        dispatch(setPagesInView({pages:[]}))
        fetchContentItems()
        fetchLibraries()
        setSeo({title:"Plumbum (Discovery) - Read Fresh Writing", description:"Explore events, workshops, and writer meetups on Plumbum.", name:"Plumbum", type:""})

    },[currentProfile,location.pathname])

    const libraryForums = ()=>{
        if(libraries!=null){
            return (<> 
            <h3 className={`text-emerald-900 ${isNotPhone?'ml-16 pl-6 ':'ml-16'} mb-4 lora-bold font-extrabold text-2xl`}>Communities</h3>
            <div className='mb-12'><InfiniteScroll
            className=' flex flex-row min-h-50 md:min-h-6 max-w-[100vw] '
            dataLength={libraries.length}
            next={fetchLibraries}
          
            hasMore={hasMoreLibraries}
            endMessage={<div className='flex min-w-72 mont-medium'><span className='mx-auto my-auto text-center rounded-full p-3  text-emerald-400 '><h6 className=''>Join the community. <br/>Apply to join today.</h6><h6>Share your own work.</h6><h6> This is what we have for now.</h6></span></div>}
            >
                {libraries.map(library=>{
                    return     <div key={library.id}>
                  <BookListItem book={library}/></div>
           
                })}
            </InfiniteScroll></div></>)
        }
    }
    const bookList = ()=>{
        if(books!=null){
            return(
        
    <div className=''> <h3 className=' text-emerald-900
    text-left 
    font-extrabold 
  ml-16 lora-bold mb-4 text-2xl'>Collections</h3>
                <InfiniteScroll
            className={`  min-h-50 md:min-h-60 flex-row flex`}
            dataLength={books.length}
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

                {books.map((book,i)=>{
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

    const fetchContentItems = ()=>{
            dispatch(setPagesInView({pages:[]}))
            dispatch(setCollections({collections:[]}))
            dispatch(getPublicStories())
            dispatch(getPublicCollections())
           
    }
    const fetchLibraries = ()=>{
            setHasMoreLibraries(true)
            dispatch(getPublicLibraries())
            .then(result=>checkResult(result,payload=>{
            
                setHasMoreLibraries(false)
            },err=>{
                setHasMoreLibraries(false)
            }))
        }
        const onClickForGrid =(bool)=>{


            setIsGrid(bool)
            if(bool){
                sendGAEvent("Click Grid View Discovery","Click Grid View Discovery","Grid Icon",0)
             
            }else{
                sendGAEvent("Click Stream View Discovery","Click Stream View Discovery","Stream Icon",0)
            }
        }
        return(
            <ErrorBoundary>
                <Helmet>   
      {/* <title>{seo?seo.title:"Plumbum Writers"}</title>
       <meta property="og:image" content={Enviroment.logoChem} /> */}
      <meta property="og:url" content={`${Enviroment.domain}${location.pathname}`} />
      <meta property="og:description" content="Explore events, workshop projects together, and join other writers." />
 
      <meta name="twitter:image" content={Enviroment.logoChem} />
    </Helmet>
            {/* <div 

            className=' w-screen mt-4' > */}

              <div className=' text-left ' >
               
               
                {libraryForums()}
                </div>
                <div className='mb-12'>
                {bookList()} 
                </div>
                <div className='flex max-w-[96vw] md:w-[50em] mx-auto flex-col '>
                    <span className='flex flex-row'>

                        <h3 className=' text-emerald-900
                                        font-extrabold 
                                        text-2xl 
                                        text-left 
                                        mx-4
                                        lora-bold
                                        my-4 l
                                        lg:mb-4'>Pages</h3>
                        
                       {isNotPhone? <div className='flex flex-row'><button onClick={()=>onClickForGrid(true)}
                                className=' bg-transparent 
                                            ml-2 mr-0 px-1 border-none py-0'>
                                <img src={grid}/>
                        </button>
                        <button onClick={()=>onClickForGrid(false)}
                                className='bg-transparent border-none px-1 py-0'>
                                    <img src={stream}/>
                        </button></div>:null}

                        </span>
                     
                        </div>
<span className='flex justify-center'>
                   <ListView items={viewItems}/>
                   </span>           
            
                 
                    <div className=' lg:flex-1  lg:mx-4'>
                       <div className='w-24  mx-auto '>
                       
                                        <div className=''>
                   
                    </div>
                    </div>
                    {!currentProfile?<ScrollDownButton  text={"Join the community"} onClick={()=>{
                        sendGAEvent("Navigate to Apply","Navigate to Apply","Join the community",0,false)
                        navigate(Paths.apply())
                    }}/>:null}
                    </div>
            </ErrorBoundary>
        )

}

export default DiscoveryContainer