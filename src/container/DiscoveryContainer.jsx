import { useSelector,useDispatch} from 'react-redux'
import DashboardItem from '../components/DashboardItem'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import "../styles/Discovery.css"
import ErrorBoundary from '../ErrorBoundary'
import {getPublicStories } from '../actions/PageActions'
import { getPublicBooks } from '../actions/CollectionActions'
import { getPublicLibraries, setLibraryInView } from '../actions/LibraryActions'
import checkResult from '../core/checkResult'
import MediaQuery from "react-responsive"
import BookListItem from '../components/BookListItem'
import Paths from '../core/paths'
import uuidv4 from '../core/uuidv4'
import ReactGA from "react-ga4"
function DiscoveryContainer(props){
    ReactGA.send({ hitType: "pageview", page: window.location.pathname+window.location.search, title: "About Page" })

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
            hasMore={hasMoreLibraries}
            style={{display:"flex",flexDirections:"row"}}>
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
        <div 
        //id="book-list"
        >
            <MediaQuery minWidth={"768px"}>
                <InfiniteScroll
            className='mt-1'
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
            </MediaQuery>
            <MediaQuery maxWidth={"768px"}>
                <InfiniteScroll
            style={{display:"flex",flexDirection:"row"}}
            dataLength={booksInView.length}
            next={fetchContentItems}
            hasMore={false}
            >
                {booksInView.map(book=>{
                    const id = `${book.id}_${uuidv4()}`
                    return(<div key={id}>
                       <BookListItem book={book}/>
                       </div>)
                })}

            </InfiniteScroll>
            </MediaQuery></div>)
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
            hasMore={false}
            >
                {pagesInView.map(page=>{
                    const id = `${page.id}_${uuidv4()}`
                    return(<div id={id}>
                        <DashboardItem key={page.id} page={page}/>
                    </div>)
                })}

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
       
        return(
            <ErrorBoundary>
            <div id="discover"  >
            <div style={{paddingTop:"3em"}}>
                <h1 >Discovery</h1>
                </div>
              <div >
                <div id="library-forums">
                <h3 className='text-white font-extrabold text-2xl'>Libraries</h3>
                {libraryForums()}
                    </div>
                <div className='flex flex-col-reverse lg:flex-row'>
                    <div className='lg:mx-4'>
                        <h3 className='text-white font-extrabold text-2xl text-left my-4 pl-2 lg:mb-4'>Pages</h3>
                    {pageList()}
                    </div>
                    <div className='lg:mx-4'>
                       <h3 className='text-white text-left font-extrabold pl-2 pt-2 mt-1 text-2xl'>Books</h3>
                    {bookList()}
                    </div>
                    </div > 
           
                    </div>
                    </div>
             
            </ErrorBoundary>
        )

}

export default DiscoveryContainer