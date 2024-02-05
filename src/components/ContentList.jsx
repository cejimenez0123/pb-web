

import { useState,useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import InfiniteScroll from 'react-infinite-scroll-component';
import { getProfilePages } from '../actions/PageActions';
import { getProfileBooks } from '../actions/BookActions';
import { getProfileLibraries } from '../actions/LibraryActions';
import PageListItem from './PageListItem';
import "../styles/MyProfile.css"
import Book from '../domain/models/book'
import ListItem from './ListItem';
import { Button} from "@mui/material";
import checkResult from "../core/checkResult";
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import debounce from "../core/debounce";
import { btnStyle } from "../styles/styles";
export default function ContentList({profile}){
    const [page,setPage] = useState(1)  
    const [listType,setListType]=useState("page")
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const [isContentVisible, setIsContentVisible] = useState(true)
    const [hasMorePages,setHasMorePages]=useState(true)
    const [hasMoreBooks,setHasMoreBooks]=useState(true)
    const [hasMoreLibraries,setHasMoreLibraries]=useState(true)
    const [pages,setPages] = useState([])
    const [books,setBooks] = useState([])
    const [libraries,setLibraries]=useState([])
   
    const [sortTime,setSortTime]=useState(false)
    const [sortAlpha,setSortAlpha]=useState(false)
    const dispatch = useDispatch()
    useEffect(()=>{
        fetchPageData()
        fetchBookData()
        fetchLibraryData()
    },[profile])

    const pageList=()=>{
        const empty = (<div className="empty">
            Empty
        </div>)
        if(pages!=null ){    
            return (
                <div className="content-list">
            <InfiniteScroll
                dataLength={pages.length}
                next={fetchPageData}
                hasMore={hasMorePages} // Replace with a condition based on your data source
                loader={<p>Loading...</p>}
                endMessage={
                    <div className="no-more-data">
                        <p>No more data to load.</p>
                    </div>
                }
            >
             {pages.map(page =>{
                     return(<PageListItem key={page.id} page={page} onDelete={()=>{
                      let filtered= pages.filter(p=>{return p!==page})
                      setPages(filtered);
                     }}/>)
             })}
         </InfiniteScroll>
         </div>
        )
             }else{
                 return empty
             }}
    useEffect(()=>{},[pagesInView])     
    const fetchPageData = () =>{
            const params = {profile:profile,page,groupBy:9}
            
            dispatch(getProfilePages(params)).then((result) => {
                checkResult(result,payload=>{
                const {pageList}=payload
                setPages(pageList)
                setHasMorePages(false)
            },err=>{
                setHasMorePages(false)
            })
        })
    }
    const fetchBookData=()=>{
       
            const params = {profile:profile,page,groupBy:9}
             dispatch(getProfileBooks(params)).then((result) => {
                checkResult(result,payload=>{
                    const {bookList}=payload
                    setBooks(bookList)
                    setHasMoreBooks(false)
                },err=>{
                    setHasMoreBooks(false)
                })
            
            }).catch((err) => {
                setHasMoreBooks(false)
            });
    }
    
    const fetchLibraryData=()=>{
        
          
                const params = {profile:profile,page,groupBy:9}
                dispatch(getProfileLibraries(params)).then(result=>{
                    checkResult(result,payload=>{
                        const {libList}=payload
                        setLibraries(libList)
                        setHasMoreLibraries(false)
                    },err=>{
                        setHasMoreLibraries(false)
                    })
              
                }).catch((err)=>{
                    setHasMoreLibraries(false)
                })
            
    }
    const contentList = () =>{
        
        const empty = (<div className="empty">
            <h1>
            Empty
            </h1>
        </div>)
        if(listType=="page"){
           if(pages!=null  && pages.length>0){    
           return pageList()
            }else{
                return empty
            }}
            else if(listType=="book"){
             if(books!=null && books.length>0){  
               return  (<div className="content-list">
                <InfiniteScroll 
          
                   dataLength={books.length}
                   next={fetchBookData}
                   hasMore={hasMoreBooks}
                   loader={<div>
                       Loading...
                   </div>}
                   endMessage={<div className="no-more-data">
                       <p>No more data to load.</p>
                       </div>
                   }
                   >
                       {books.map((book)=>{
   
                        return (<div key={book.id}>
                            <ListItem   ownerProfileId={book.profileId}
                                        title={book.title}
                                        id={book.id}
                                        type={Book.className} item={book}/>
                                </div>)
                       })}
                   </InfiniteScroll>
                   </div>)
           
            }else{
                return empty
            }}else if(listType=="library"){
         
            if(libraries!=null && libraries.length>0){
                return(
                    <div >
                    <InfiniteScroll
              
                    dataLength={libraries.length}
                    next={fetchLibraryData}
                    hasMore={hasMoreLibraries}
                    loader={<p>Loading...</p>}
                    endMessage={<div className="no-more-data"><p>No more data to load.</p></div>}
                >
                    {libraries.map((library)=>{
        
                        return (<div key={library.id}>
                            <ListItem   ownerProfileId={library.profileId}
                                        key={library.id}
                                        title={library.name}
                                        type={"library"}
                                        id={library.id}
                                        item={library}/>
                        </div>)
                    })}
                    </InfiniteScroll>
                    </div>
                )}else{
                    return empty
                }
            
            }else{
          
                return(<div>
               {pageList()}
            </div>)
            
        }
    }
    const setSortOrderTime=()=>{
        
        if(sortTime){
            let newPages = [...pages].sort((a,b)=>{
                return b.created - a.created
            })
            setPages(newPages);
            let newBooks = [...books].sort((a,b)=>{
                return b.updatedAt - a.updatedAt
            })
            setBooks(newBooks)
            let newLibraries = [...libraries].sort((a,b)=>{
                return b.updatedAt - a.updatedAt
            })
            setLibraries(newLibraries)
        }else{
            let newPages = [...pages].sort((a,b)=>{
                return a.created - b.created
            })
            setPages(newPages);
            let newBooks = [...books].sort((a,b)=>{
                return a.updatedAt - b.updatedAt
            })
            setBooks(newBooks)
            let newLibraries = [...libraries].sort((a,b)=>{
                return a.updatedAt - b.updatedAt
            })
            setLibraries(newLibraries)
        }
    }
    const setSortOrderAlpha=(sort)=>{
        setSortAlpha(sort)
        if(sort){
        let newPages = [...pages].sort((a,b)=>{
            if (a.title < b.title) {
                return -1;
              }
              if (a.title > b.title) {
                return 1;
              }
              return 0;
        })
        setPages(newPages);
        let newBooks = [...books].sort((a,b)=>{
            if (a.title < b.title) {
                return -1;
              }
              if (a.title > b.title) {
                return 1;
              }
              return 0;
        })
        setBooks(newBooks);
        let newLibraries = [...libraries].sort((a,b)=>{
            if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
        })
        setLibraries(newLibraries);
        }else{
            let newPages = [...pages].sort((a,b)=>{
                if (b.title < a.title) {
                    return -1;
                  }
                  if (b.title > a.title) {
                    return 1;
                  }
                  return 0;
            })
            setPages(newPages);
            let newBooks = [...books].sort((a,b)=>{
                if (b.title < a.title) {
                    return -1;
                  }
                  if (b.title > a.title) {
                    return 1;
                  }
                  return 0;
            })
            setBooks(newBooks);
            let newLibraries = [...libraries].sort((a,b)=>{
                if (b.name < a.name) {
                    return -1;
                  }
                  if (b.name > a.name) {
                    return 1;
                  }
                  return 0;
            })
            setLibraries(newLibraries)
        }
         
    }
    const handleContentClick=(name)=>{
        setListType(name)
        setIsContentVisible(!isContentVisible)
        setIsContentVisible(true)
    } 

    return(<div >
                <div className="inner">
                <div className="btn-row">
                    <div>
                                    <Button style={btnStyle}
                                            onClick={()=>{
                                                handleContentClick("page")
                                            }}>
                                        Page
                                    </Button>
                                    <Button style={btnStyle} onClick={()=>{
                                            handleContentClick("book")
                                        }}>
                                        Book
                                    </Button>
                                    <Button style={btnStyle}onClick={()=>{
                                            handleContentClick("library")

                                        }}>
                                        Library
                                    </Button>
                    </div>
                    <div className="sort">
                        {sortTime?<Button style={btnStyle} onClick={()=>{
                                setSortTime(false)
                                setSortOrderTime()
                            }}>
                                    New to Old
                            </Button>:
                            <Button style={btnStyle}
                                    onClick={()=>{
                                setSortTime(true)
                                setSortOrderTime()
                            }}
                            >Old to New</Button>}
                        <Button style={btnStyle}
                        onClick={()=>{
                            
                        setSortOrderAlpha(!sortAlpha)}}>
                            <SortByAlphaIcon/>
                        </Button>
                    </div>
                </div>
                         
                            <div
        className={`${isContentVisible ? "visible" : "hidden"}`}
        style={{
          maxHeight: isContentVisible ? "" : "0",
          transition: "max-height 0.3s ease-in-out"
        }}
      > 
           
            {
             contentList()
            }
 </div>
           </div>            
    </div>)
}


