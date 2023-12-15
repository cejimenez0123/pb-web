import { useSelector,useDispatch} from 'react-redux'
import DashboardItem from '../components/DashboardItem'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import "../styles/Discovery.css"
import ErrorBoundary from '../ErrorBoundary'
import {getPublicPages } from '../actions/PageActions'
import { getPublicBooks } from '../actions/BookActions'
import { getPublicLibraries } from '../actions/LibraryActions'
import checkResult from '../core/checkResult'
import MediaQuery from "react-responsive"
import BookListItem from '../components/BookListItem'
import Paths from '../core/paths'
function DiscoveryContainer(props){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const booksInView = [...useSelector(state=>state.books.booksInView)].sort(
        (a,b)=>{
        
            return b.created- a.created
        }   
    )  
    const pagesInView = useSelector((state)=>state.pages.pagesInView)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [hasMoreLibraries,setHasMoreLibraries] =useState(false)
    // const [librariesInView,setLibraryInView]=useState([])
const librariesInView = [...useSelector(state=>state.libraries.librariesInView)]
.sort((a,b)=>{
   
    return b.created- a.created
})
    const [contentItems,setContentItems]=useState([])
    let [hasMore,setHasMore]=useState(false)
    useEffect(()=>{
       
        setContentItems([])
        fetchContentItems()
        fetchLibraries()
    },[])
    // useEffect(()=>{sortContent()},[pagesInView])

    const libraryForums = ()=>{
        if(librariesInView!=null){
            return (<InfiniteScroll
            dataLength={librariesInView.length}
            next={fetchLibraries}
            hasMore={hasMoreLibraries}
            style={{display:"flex",flexDirections:"row"}}>
                {librariesInView.map(library=>{
                    return(<div onClick={()=>{
                        navigate(Paths.library.createRoute(library.id))
                    }} className='item'> 
                    <div className='purpose'> <p>{library.purpose}</p></div>
                    <div className='name'><h5> {library.name}</h5></div>
                      
                        
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
                    return(<BookListItem book={book}/>)
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
                    return(<BookListItem book={book}/>)
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
                    return(<div >
                        <DashboardItem key={page.id} page={page}/>
                    </div>)
                })}

            </InfiniteScroll> </div>)
        }
    }
    const fetchContentItems = ()=>{
            setHasMore(true) 
            dispatch(getPublicPages()).then(result=>checkResult(
                result,payload=>{
                    
                    const {pageList} = payload
               
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
                const {libraryList}=payload
              
            
                setHasMoreLibraries(false)
            },err=>{

            }))
        }
        const dashboardItem=(hash)=>{
            if(Array.isArray(hash)){
                return (<div className='discover-pair'>
                    {hash.map(aItem=>{
                        switch(aItem.type){
                           case "book":{
                            
                                return(<div className='pair-item'>
                                    <div className='pair-inner'>
                                    <a onClick={()=>{
                                    navigate(`/book/${aItem.book.id}`)
                                }}><h3>{aItem.book.title}</h3></a>
                                <p>{aItem.book.purpose}</p>
                                </div>
                                </div>)
                            }
                            case "library":{
                                return(<div className='pair-item'>
                                    <div className='pair-inner'>                                <a onClick={()=>{
                                    navigate(`/library/${aItem.library.id}`)
                                }}><h3>{aItem.library.name}</h3></a>
                                <p>{aItem.library.purpose}</p>
                                </div>
                                </div>)
                            }
                            default:{
                                return(<h2>Nothing</h2>)
                            }
                        }
                    })}
                </div>)
            }else{
                
            switch(hash.type){
                case 'page':{
                    
                    return (
                      
                       
                        <DashboardItem page={hash.page}/>
                       
                    )
                }
                case 'book':{
                    if(hash.book!=null){
                        let i = 1
                
                        if(hash.page!=null){
                            let foundItem =  contentItems.find(item=>item.page!=null && item.page.id == hash.page.id)
                            if(!Boolean(foundItem)){
                                return(<DashboardItem book={hash.book} page={hash.page}/>)
                            }else{

                                return(<div></div>)
                            }
                            
                        }
                     
                        if(hash.page){
                        
                            return(
                            <DashboardItem book={hash.book} page={hash.page}/>
                        )
                   
                        }else{
                    return(<div></div>)
                        }
                    }else{
                    return(<div></div>)
                }
                }
                case 'library':{
                    // return(<div>

                    // </div>)
                }
                    default:{
                        return (<div>
                            </div>)
                    }
          
        }}}
        return(
            <ErrorBoundary>
            <div id="discover"  >
            <div style={{paddingTop:"3em",textAlign:"center"}}>
                <h1 >Discovery</h1>
                </div>
                {/* <div className='content-list dashboard'> */}
              <div >
                <div id="library-forums">
                <label ><h4>Libraries</h4></label>
                {libraryForums()}
                    </div>
                <div id='forums-list'>
                    <div>
                        <label>
                           <h4> Pages</h4>
                        </label>
                    
                    {pageList()}
                    </div>
                    <div>
                        <label><h4>Books</h4></label>
                 
                    {bookList()}
                    </div>
                    </div>
                {/* <InfiniteScroll
           dataLength={contentItems.length}
           next={fetchContentItems}
           hasMore={hasMore} // Replace with a condition based on your data source
           loader={<p>Loading...</p>}
           endMessage={<div className='no-more-data'>
           <h6 >No more data to load.</h6>  </div>}>
                {contentItems.map(content=>{
                    return dashboardItem(content)
                })}
                            </InfiniteScroll> */}
                        </div>
                    </div>
                {/* </div> */}
            </ErrorBoundary>
        )

}

export default DiscoveryContainer