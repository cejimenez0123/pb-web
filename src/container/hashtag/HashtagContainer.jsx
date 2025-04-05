import { useSelector,useDispatch} from 'react-redux'
import DashboardItem from '../../components/page/DashboardItem'
import { useState,useEffect, useLayoutEffect, useContext } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import ErrorBoundary from '../../ErrorBoundary'
import checkResult from '../../core/checkResult'
import { useMediaQuery } from "react-responsive"
import BookListItem from '../../components/BookListItem'
import { initGA,sendGAEvent } from '../../core/ga4.js'
import grid from "../../images/grid.svg"
import stream from "../../images/stream.svg"
import InfoTooltip from '../../components/InfoTooltip'
import loadingGif from "../../images/loading.gif"
import { fetchHashtag } from '../../actions/HashtagActions'
import { setCollections } from '../../actions/CollectionActions'
import { appendToPagesInView, setPagesInView } from '../../actions/PageActions.jsx'
import Context from '../../context'
export default function HashtagContainer(props){
    const location = useLocation()
    const params = useParams()
    const {id}=params
    const {setError}=useContext(Context)
    const collections = useSelector(state=>state.books.collections)
    const [hash,setHashtag]=useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()

   
    const pagesInView = useSelector((state)=>state.pages.pagesInView)
    const [books,setBooks]=useState(collections.filter(col=>col.childCollections.length==0))
    const [libraries,setLibraries]=useState(collections.filter(col=>col.childCollections.length>0))

    const [hasMoreLibraries,setHasMoreLibraries]=useState(true)
    const [hasMoreBooks,setHasMoreBooks]=useState(true)
    const [hasMorePages,setHasMorePages]=useState(true)
    useLayoutEffect(()=>{
        initGA()
        if(hash){

        
        sendGAEvent(`Hashtag View-${hash.name} - ${id}`,`}`,hash.name)
        }
 },[])
    useLayoutEffect(()=>{
        setBooks(collections.filter(col=>col.childCollections.length==0))
        setLibraries(collections.filter(col=>col.childCollections.length>0))
    },[collections])
  
    const [isGrid,setIsGrid] = useState(false)
    const isNotPhone = useMediaQuery({
        query: '(min-width: 999px)'
      })
      const addPages=(cols)=>{
        for(let i=0;i<cols.length;i++){
          const stories = cols[i].collection.storyIdList.map(sTc=>sTc.story)
          dispatch(appendToPagesInView({pages:stories}))
        }
      }
      const getHashtag=()=>{
        const {id}=params
        dispatch(setCollections({collections:[]}))
        dispatch(setPagesInView({pages:[]}))
        dispatch(fetchHashtag({id})).then(res=>{
            checkResult(res,payload=>{
        
                const {hashtag}=payload
                if(hashtag){
                setHashtag(hashtag)
            
                    
                dispatch(setCollections({collections:hashtag.collections.map(co=>co.collection)}))
                addPages(hashtag.collections)
              

                setHasMoreBooks(false)
                setHasMoreLibraries(false)
                setHasMorePages(false)
                }else{
                    setError("No hashtag")
                }
            },err=>{

                setHasMoreBooks(false)
                setHasMoreLibraries(false)
                setHasMorePages(false)
            })
        })
      }
      useLayoutEffect(()=>{
       
           getHashtag()
      },[id])
    useEffect(
        ()=>{
            if(!isNotPhone){
                setIsGrid(false)
            }
        },[isNotPhone]
    )

    

    const libraryForums = ()=>{
    
            return (<InfiniteScroll
            className='min-h-[12rem] flex max-w-[100vw] flex-row'
            dataLength={libraries.length}
    
         
            hasMore={hasMoreLibraries}
            endMessage={<div className='flex  min-w-72 px-24 j mont-medium'><span className='mx-auto my-auto text-center rounded-full p-3  text-emerald-400 '><h6 className=''>Join the community. <br/>Apply to join today.</h6><h6>Share your own work.</h6><h6> This is what we have for now.</h6></span></div>}
            >
                {libraries.map(library=>{
                    return     <div key={library.id}>
                  <BookListItem book={library}/></div>
           
                })}
            </InfiniteScroll>)
       
    }
    const bookList = ()=>{
        
            return(
        
    <div className='w-[100vw]'> <h3 className=' text-emerald-900
    text-left 
    font-extrabold 
     lora-bold text-2xl ml-4 md:ml-24'>Collections</h3>
                <InfiniteScroll
            className={`  max-w-[100vw] my-2 min-h-[12rem]  flex-row flex`}
            dataLength={books.length}
          
            hasMore={hasMoreBooks}
            endMessage={<div className='flex min-w-72 mont-medium'>
                <span className='mx-auto my-auto text-center rounded-full p-3  text-emerald-400 '>
                    <h6 className=''>
                        Join the community. <br/>Apply to join today.
                        </h6><h6>Share your own work.</h6>
                        <h6> This is what we have for now.</h6>
                        </span></div>}
            >

                {books.map((book,i)=>{
                    console.log("Bxok-",book)
                    let id = `${book.id}_${i}`
                    return(
                        <div key={id} >
                            <BookListItem book={book}/>
                        </div>)
                })}
</InfiniteScroll>
</div>)

        
    }
    const pageList = ()=>{
        
            
            return(<div 
            className=' w-[96vw] md:w-page mx-auto '
            >
               <InfiniteScroll
            dataLength={pagesInView.length}
            next={()=>{

            }}
        endMessage={<div className='flex'>
            <h2  className='mx-auto my-12 text-emerald-800 lora-medium'>You can write for the hashtag<br/> Add a hashtag to your work.</h2>
        </div>}
            loader={<div className='flex'>
                <img className="max-h-36 mx-auto my-12 max-w-36"src={loadingGif}/>
            </div>}
            scrollThreshold={1}
            hasMore={hasMorePages}
                >
               
<div 

className={`${
    isGrid ? 'grid-cols-2 grid gap-2 ' : ''
  }`}

>
 
                {pagesInView.filter(page=>page).map((page,i)=>{

                    const id = `${page.id}_${i}`
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
    

        const onClickForGrid =(bool)=>{


            setIsGrid(bool)
            if(bool){
                sendGAEvent("Click","Click for Grid View on Hashtag Page","Grid Icon")

            }else{
                sendGAEvent("Click","Click for Stream View on Hashtag Page","Stream Icon")

            
            }
        }
        return(
            <ErrorBoundary>
            <div 

            className=' max-w-[100vw] mt-4' >
               {hash? <div className='w-[100%] flex '>
                    <h1 className='lora-bold mx-auto py-12 md:py-24'>#{hash.name}</h1>
                </div>:null}
              <div className=' text-left ' >
              {libraries.length>0?<>
             <h3 className={`text-emerald-900 ${isNotPhone?'ml-16 pl-6 ':'pl-4 ml-4'} pb-4 lora-bold font-extrabold text-2xl`}>Communities</h3>
                <div className='mb-12'>
                {libraryForums()}
                </div></> :null}
                <div className='mb-12'>
                {books.length>0?bookList() :null}
                </div>
                <div className='flex max-w-[96vw] md:w-page mx-auto flex-col '>
                    

                        <h3 className=' text-emerald-900
                                        font-extrabold 
                                        text-2xl 
                                        text-left 
                                        mx-auto md:mx-4
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