import { useSelector,useDispatch} from 'react-redux'
import DashboardItem from '../components/page/DashboardItem'
import { useState,useEffect, useLayoutEffect, useContext } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import "../styles/Discovery.css"
import ErrorBoundary from '../ErrorBoundary'
import {getPublicStories, setPagesInView } from '../actions/PageActions'
import { getPublicBooks, getPublicCollections, setCollections } from '../actions/CollectionActions'
import { getPublicLibraries} from '../actions/LibraryActions.jsx'
import checkResult from '../core/checkResult'
import { useMediaQuery } from "react-responsive"
import BookListItem from '../components/BookListItem'
import grid from "../images/grid.svg"
import stream from "../images/stream.svg"
import { initGA,sendGAEvent } from '../core/ga4.js'
import BookDashboardItem from '../components/collection/BookDashboardItem.jsx'
import ScrollDownButton from '../components/ScrollDownButton.jsx'
import Context from '../context.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
import Paths from '../core/paths.js'
import { Helmet } from 'react-helmet'
import Enviroment from '../core/Enviroment.js'
function DiscoveryContainer(props){
    
    useEffect(()=>{
        initGA()
        sendGAEvent("View Discovery Page","Page View Discovery","Discovery",0,true)
   },[])
    const {currentProfile}=useContext(Context)
    const navigate = useNavigate()
     const cols = useSelector(state=>state.books.collections)
    const books = useSelector(state=>state.books.books)
    const libraries = useSelector(state=>state.books.libraries)
    const [isGrid,setIsGrid] = useState(false)
   const location = useLocation()
    const dispatch = useDispatch()
   
  
    const pagesInView = useSelector((state)=>state.pages.pagesInView)
    const [hasMoreLibraries,setHasMoreLibraries] =useState(false)
    const isNotPhone = useMediaQuery({
        query: '(min-width: 999px)'
      })
    const [viewItems,setViewItems]=useState([])
    useLayoutEffect(()=>{

       let list = [...pagesInView,...cols].filter(item=>item).sort((a,b)=>{
           
   
            return ((a.priority*900005) + new Date(a.updated).getTime()) < ((b.priority*9000005) + new Date(b.updated).getTime())
            
    
               
    },[pagesInView,books])
    setViewItems(list)
    },[pagesInView,books])
    useEffect(
        ()=>{
            if(!isNotPhone){
                setIsGrid(false)
            }
        },[isNotPhone]
    )


    useEffect(()=>{
        dispatch(setPagesInView({pages:[]}))
        fetchContentItems()
        fetchLibraries()
    },[currentProfile])

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
    const listView = ()=>{
        if(viewItems){
            const filteredItems = viewItems.filter(item => item);
            return(<div 
                className={`${isGrid?"":"w-[96vw] md:w-page"}  mx-auto `}
                >
                   <InfiniteScroll
                dataLength={viewItems.length}
                next={fetchContentItems}
                scrollThreshold={1}
                hasMore={false}
                    >
                   
    <div 
    className={`${
        isGrid && isNotPhone ? ' grid-container' : ''
      }`}
    
    >
        { filteredItems.map((item, i) => {
      const id = `${item.id}_${i}`;

     
      if (item && item.storyIdList && item.storyIdList.length > 0) {
        return (
          <div 
            className={isGrid ? "grid-item" : "m-1 w-[96vw] md:w-page shadow-md rounded-lg h-fit"}
            key={id}
          >
            <BookDashboardItem isGrid={isGrid} book={item} />
          </div>
        );
      }

   
      if (item.data && !filteredItems.some(book => book && book.storyIdList && book.storyIdList.includes(stc=>stc.storyId==item.id))) {
        return (
          <div 
            className={isGrid ? "grid-item" : "m-1 w-[96vw] md:w-page shadow-md rounded-lg h-fit"}
            key={id}
          >
            <DashboardItem isGrid={isGrid} page={item} />
          </div>
        );
      }

      return null;
    })}

                    </div>
                </InfiniteScroll> </div>)
        }
    }
    const pageList = ()=>{
        if(pagesInView!=null){
            return(<div 
            className={`${isGrid?"":"w-[96vw] md:w-page"}  mx-auto `}
            >
               <InfiniteScroll
            dataLength={pagesInView.length}
            next={fetchContentItems}
            scrollThreshold={1}
            hasMore={false}
                >
               
<div 
className={`${
    isGrid && isNotPhone ? ' grid-container' : ''
  }`}

>
 
                {pagesInView.filter(page=>page).map((page,i)=>{

                    const id = `${page.id}_${i}`
                    return(<div 
                        className={isGrid?"grid-item  ":"m-1 w-[96vw] md:w-page shadow-md rounded-lg h-fit "}
                        key={id}
                    >               
                        <DashboardItem isGrid={isGrid} key={id} page={page}/>
                    </div>)
                })}
                </div>
            </InfiniteScroll> </div>)
        }
    }
    const fetchContentItems = ()=>{
            dispatch(setPagesInView({pages:[]}))
            dispatch(setCollections({collections:[]}))
            dispatch(getPublicStories())
            dispatch(getPublicCollections())
            dispatch(getPublicBooks())  
        
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
      <title>{"Plumbum Writers"}</title>
       <meta property="og:image" content={"https://i.ibb.co/zWNymxQd/event-24dp-314-D1-C-FILL0-wght400-GRAD0-opsz24.png"} />
      <meta property="og:url" content={`${Enviroment.domain}${location.pathname}`} />
      <meta property="og:description" content="Explore events, workshop projects together, and join other writers." />
 
      <meta name="twitter:image" content={`${"https://i.ibb.co/zWNymxQd/event-24dp-314-D1-C-FILL0-wght400-GRAD0-opsz24.png"}`} />
    </Helmet>
            <div 

            className=' max-w-[100vw] mt-4' >

              <div className=' text-left ' >
               
               
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
                        {isNotPhone?<div className='flex flex-row pb-8'><button onClick={()=>onClickForGrid(true)}
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
    {listView()}
                   
                  
                    </div>
                    </div>
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