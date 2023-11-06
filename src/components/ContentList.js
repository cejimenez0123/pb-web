

import { useState,useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import InfiniteScroll from 'react-infinite-scroll-component';
import { getProfilePages } from '../actions/PageActions';
import { fetchArrayOfBooksAppened, getProfileBooks } from '../actions/BookActions';
import { fetchBookmarkLibrary, getProfileLibraries } from '../actions/LibraryActions';
import PageListItem from './PageListItem';
import "../styles/MyProfile.css"
import Book from '../domain/models/book'
import ListItem from '../components/ListItem';
import { Button, IconButton } from "@mui/material";
import checkResult from "../core/checkResult";
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
export default function ContentList({currentProfile,pagesInView}){
    const [page,setPage] = useState(1)  
    const [listType,setListType]=useState("page")
    const [isContentVisible, setIsContentVisible] = useState(true)
    const [hasMorePages,setHasMorePages]=useState(false)
    const [hasMoreBooks,setHasMoreBooks]=useState(false)
    const [pages,setPages] = useState([])
    const [books,setBooks] = useState([])
    const [libraries,setLibraries]=useState([])
    const booksInView = useSelector(state=>state.books.booksInView)
    const librariesInView = useSelector(state=>state.libraries.librariesInView)
    const [hasMoreLibraries,setHasMoreLibraries]=useState(false)
    const [sortTime,setSortTime]=useState(true)
    const [sortAlpha,setSortAlpha]=useState(false)
    const dispatch = useDispatch()
    useEffect(()=>{
        if(currentProfile){
            const params = {id: currentProfile.bookmarkLibraryId}
            dispatch(fetchBookmarkLibrary(params)).then(result=>{
                checkResult(result,payload=>{
                    const {library} = payload
                    const params = {bookIdList:library.bookIdList}
                    dispatch(fetchArrayOfBooksAppened(params))
                },()=>{

                })
            })
            fetchPageData()
            fetchBookData()
            fetchLibraryData()
        }
    },[])
    const pageList=()=>{
        const empty = (<div className="empty">
            Empty
        </div>)
        if(pagesInView!=null ){    
            return (
                <div className="content">
            <InfiniteScroll
           dataLength={pagesInView.length}
           next={fetchPageData}
           hasMore={hasMorePages} // Replace with a condition based on your data source
           loader={<p>Loading...</p>}
           endMessage={<div className="no-more-data"><p>No more data to load.</p></div>}
         >
             {pagesInView.map(page =>{
                     return(<PageListItem key={page.id} page={page}/>)
             })}
         </InfiniteScroll>
         </div>
        )
             }else{
                 return empty
             }}
            
    const fetchPageData = () =>{
        if(currentProfile){
            const params = {profile:currentProfile,page,groupBy:9}
                setHasMorePages(true)
                dispatch(getProfilePages(params)).then((result) => {
                    checkResult(result,payload=>{
                        const {pageList}=payload
                        setPages(pageList)
                        setHasMorePages(false)
                    },err=>{
                        setHasMorePages(false)
                    })
        
            }).catch((err) => {
                setHasMorePages(false)
            });}
    }
    const fetchBookData=()=>{
        if(currentProfile){
            setHasMoreBooks(true)
            const params = {profile:currentProfile,page,groupBy:9}
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
            });}
    }
    const fetchLibraryData=()=>{
            if(currentProfile){
                setHasMoreLibraries(true)
                const params = {profile:currentProfile,page,groupBy:9}
                dispatch(getProfileLibraries(params)).then(result=>{
                    checkResult(result,payload=>{
                        const {libList}=payload
                        setLibraries(libList)
                        setHasMoreLibraries(false)
                    },err=>{

                    })
              
                }).catch((err)=>{
                    setHasMoreLibraries(false)
                })
            }
    }
    const contentList = () =>{
        
        const empty = (<div className="empty">
            <h1>
            Empty
            </h1>
        </div>)
        if(listType=="page"){
           if(pages!=null  && pages.length>0){    
           return (
            <div className="">
           <InfiniteScroll
           
        
          dataLength={pagesInView.length}
          next={fetchPageData}
          hasMore={hasMorePages} // Replace with a condition based on your data source
          loader={<p>Loading...</p>}
          endMessage={<div className="no-more-data"><p>No more data to load.</p></div>}
        >
            {pages.map(page =>{
                    return(<PageListItem key={page.id} page={page}/>)
            })}
        </InfiniteScroll>
        </div>
         )
            }else{
                return empty
            }}
            else if(listType=="book"){
             if(books!=null && books.length>0){  
               return  (<div className="">
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

        if(pages){

        let newPages = [...pages].sort((a,b)=>{
            return b.created - a.created
        })
        setPages(newPages);
    }
    if(books){
        let newBooks = [...books].sort((a,b)=>{
            return b.updatedAt - a.updatedAt
        })
        setBooks(newBooks)
    }
    if(libraries){
        let newLibraries = [...libraries].sort((a,b)=>
        {
            return b.updatedAt - a.updatedAt
        }
            )
            setLibraries(newLibraries)
    }
        }else{
            if(pages){
            let newPages = [...pages].sort((a,b)=>{
                return a.created - b.created
            })
    
            setPages(newPages);
        }
        if(books){
            let newBooks = [...books].sort((a,b)=>{
                return a.updatedAt - b.updatedAt
            })
            setBooks(newBooks)}
            if(libraries){
            let newLibraries = [...libraries].sort((a,b)=>
            {
                return a.updatedAt - b.updatedAt
            }
                )
            setLibraries(newLibraries)
        }
        }
    }
    const setSortOrderAlpha=()=>{

        if(sortAlpha){
        let newPages = [...pages].sort((a,b)=>{
            if (a.title < b.title) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
        })
        setPages(newPages);
        let newBooks = [...books].sort((a,b)=>{
            if (a.title < b.title) {
                return -1;
              }
              if (a.name > b.name) {
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
    return(<div className="column">
                <div className="inner">
                <div className="btn-row">
                    <div>
                                    <Button className="btn" onClick={()=>{
                                        handleContentClick("page")
                                        }}>
                                        Page
                                    </Button>
                                    <Button className="btn" onClick={()=>{
                                        handleContentClick("book")
                                     
                                        
                                    
                                        }}>
                                        Book
                                    </Button>
                                    <Button className="btn" onClick={()=>{
                                            handleContentClick("library")

                                        }}>
                                        Library
                                    </Button>
                    </div>
                    <div className="sort">
                        {sortTime?<Button onClick={()=>{
                                setSortTime(false)
                                setSortOrderTime()
                            }}>
                                    New to Old
                            </Button>:
                            <Button onClick={()=>{
                                setSortTime(true)
                                setSortOrderTime()
                            }}
                            >Old to New</Button>}
                        <Button onClick={()=>{
                            setSortAlpha(!sortAlpha)
                            setSortOrderAlpha()}}>
                            <SortByAlphaIcon/>
                        </Button>
                    </div>
                </div>
                         
                            <div
        className={`content-list my  ${isContentVisible ? "visible" : "hidden"}`}
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


