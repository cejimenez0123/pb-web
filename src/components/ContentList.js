

import { useState,useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import InfiniteScroll from 'react-infinite-scroll-component';
import { getProfilePages } from '../actions/PageActions';
import { getProfileBooks } from '../actions/BookActions';
import { getProfileLibraries } from '../actions/LibraryActions';
import PageListItem from './PageListItem';
import "../styles/MyProfile.css"
import Book from '../domain/models/book'
import ListItem from '../components/ListItem';
import { Button } from "@mui/material";

export default function ContentList({currentProfile,pagesInView}){
    const [page,setPage] = useState(1)  
    const [listType,setListType]=useState("page")
    const [isContentVisible, setIsContentVisible] = useState(true)
    const [hasMorePages,setHasMorePages]=useState(false)
    const [hasMoreBooks,setHasMoreBooks]=useState(false)
    const booksInView = useSelector(state=>state.books.booksInView)
    const librariesInView = useSelector(state=>state.libraries.librariesInView)
    const [hasMoreLibraries,setHasMoreLibraries]=useState(false)
    const dispatch = useDispatch()
    useEffect(()=>{
        if(currentProfile){
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
           endMessage={<p>No more data to load.</p>}
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
                setHasMoreBooks(true)
                dispatch(getProfilePages(params)).then((result) => {
                setHasMorePages(false)
                const newPage = page+1 
                setPage(newPage)
            }).catch((err) => {
                setHasMorePages(false)
            });}
    }
    const fetchBookData=()=>{
        if(currentProfile){
            setHasMoreBooks(true)
            const params = {profile:currentProfile,page,groupBy:9}
             dispatch(getProfileBooks(params)).then((result) => {
                setHasMoreBooks(false)
                
            
            }).catch((err) => {
                setHasMoreBooks(false)
            });}
    }
    const fetchLibraryData=()=>{
            if(currentProfile){
                setHasMoreBooks(true)
                const params = {profile:currentProfile,page,groupBy:9}
                dispatch(getProfileLibraries(params)).then(()=>{
                    setHasMoreLibraries(false)
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
           if(pagesInView!=null ){    
           return (
            <div className="content">
           <InfiniteScroll
           
        
          dataLength={pagesInView.length}
          next={fetchPageData}
          hasMore={hasMorePages} // Replace with a condition based on your data source
          loader={<p>Loading...</p>}
          endMessage={<p>No more data to load.</p>}
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
            else if(listType=="book"){
             if(booksInView!=null && booksInView.length>0){  
               return  (<div className="content">
                <InfiniteScroll 
          
                   dataLength={booksInView.length}
                   next={fetchBookData}
                   hasMore={hasMoreBooks}
                   loader={<div>
                       Loading...
                   </div>}
                   endMessage={
                       <p>No more data to load.</p>
                   }
                   >
                       {booksInView.map((book)=>{
   
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
         
            if(librariesInView!=null && librariesInView.length>0){
                return(
                    <div className="content">
                    <InfiniteScroll
              
                    dataLength={librariesInView.length}
                    next={fetchLibraryData}
                    hasMore={hasMoreLibraries}
                    loader={<p>Loading...</p>}
                    endMessage={<p>No more data to load.</p>}
                >
                    {librariesInView.map((library)=>{
        
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
    const handleContentClick=(name)=>{
        setListType(name)
        setIsContentVisible(!isContentVisible)
        setIsContentVisible(true)
       
       
    
       
    } 
    return(<div className="column">
                <div className="inner">
                <div className="btn-row">
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


