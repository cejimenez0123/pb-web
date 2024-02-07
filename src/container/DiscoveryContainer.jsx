import { useSelector,useDispatch} from 'react-redux'
import DashboardItem from '../components/DashboardItem'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import "../styles/Discovery.css"
import ErrorBoundary from '../ErrorBoundary'
import {getPublicPages } from '../actions/PageActions'
import { getPublicBooks } from '../actions/BookActions'
import { getPublicLibraries, setLibraryInView } from '../actions/LibraryActions'
import checkResult from '../core/checkResult'
import MediaQuery from "react-responsive"
import BookListItem from '../components/BookListItem'
import Paths from '../core/paths'
import uuidv4 from '../core/uuidv4'
function DiscoveryContainer(props){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const booksInView = [...useSelector(state=>state.books.booksInView)].sort(
        (a,b)=>{
        
            return b.created- a.created
        }   
    )  
    const pagesInView = useSelector((state)=>state.pages.pagesInView)
    const [hasMoreLibraries,setHasMoreLibraries] =useState(false)
    const librariesInView = [...useSelector(state=>state.libraries.librariesInView)]
.sort((a,b)=>{
   
    return b.created- a.created
})
   
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
        <div id="book-list">
            <MediaQuery minWidth={"768px"}>
                <InfiniteScroll
            
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
            return(<div id="page-list">
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
    
            dispatch(getPublicPages()).then(result=>checkResult(
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
                <h3 className='label'>Libraries</h3>
                {libraryForums()}
                    </div>
                <div id='forums-list'>
                    <div>
                        <h3 className='label'>Pages</h3>
                    {pageList()}
                    </div>
                    <div>
                       <h3 className='label'>Books</h3>
                    {bookList()}
                    </div>
                    </div>
           
                        </div>
                    </div>
             
            </ErrorBoundary>
        )

}

export default DiscoveryContainer