

import { useState,useEffect } from "react"
import { useDispatch } from "react-redux"
import InfiniteScroll from 'react-infinite-scroll-component';
import { getProfilePages } from '../actions/PageActions';
import { getProfileBooks } from '../actions/BookActions';
import { getProfileLibraries } from '../actions/LibraryActions';
import PageListItem from '../components/PageLIstItem';
import "../styles/MyProfile.css"
import Book from '../domain/models/book'
import Page from '../domain/models/page'
import Library from '../domain/models/library'
import ListItem from '../components/ListItem';

export default function ContentList({currentProfile,pagesInView,booksInView,librariesInView}){
    const [page,setPage] = useState(1)  
    const [listType,setListType]=useState("page")
    const [isContentVisible, setIsContentVisible] = useState(true)
    const [hasMorePages,setHasMorePages]=useState(false)
    const [hasMoreBooks,setHasMoreBooks]=useState(false)
    const [hasMoreLibraries,setHasMoreLibraries]=useState(false)
    const dispatch = useDispatch()
    useEffect(()=>{
        if(currentProfile){
            fetchPageData()
            fetchBookData()
            fetchLibraryData()
        }
    },[currentProfile])
    const pageList=()=>{
        const empty = (<div>
            Empty
        </div>)
        if(pagesInView!=null ){    
            return (<div className="content-list">
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
         </div> )
             }else{
                 return empty
             }}
            
    const fetchPageData = () =>{
        if(currentProfile){
            const params = {profileId:currentProfile.id,page,groupBy:9}
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
            const params = {profileId:currentProfile.id,page,groupBy:9}
             dispatch(getProfileBooks(params)).then((result) => {
                setHasMoreBooks(false)
                
            
            }).catch((err) => {
                setHasMoreBooks(false)
            });}
    }
    const fetchLibraryData=()=>{
            if(currentProfile){
                setHasMoreBooks(true)
                const params = {profileId:currentProfile.id,page,groupBy:9}
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
        switch(listType){
            case "page":{
           if(pagesInView!=null ){    
           return (<div >
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
        </div> )
            }else{
                return empty
            }}
            case "book":{
             if(booksInView!=null && booksInView.length>0){  
               return (<div>
               {<InfiniteScroll 
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
                            <ListItem  title={book.title} id={book.id} type={Book.className()} item={book}/>
                                </div>)
                       })}
                   </InfiniteScroll>}
           </div>)
            }else{
                return empty
            }}
            case "library":{
            if(librariesInView!=null && librariesInView.length>0){
                return(<div >
                    <InfiniteScroll
                    dataLength={librariesInView.length}
                    next={fetchLibraryData}
                    hasMore={hasMoreLibraries}
                    loader={<p>Loading...</p>}
                    endMessage={<p>No more data to load.</p>}
                >
                    {librariesInView.map((library)=>{
        
                        return (<div key={library.id}>
                            <ListItem key={library.id} title={library.name} type={"library"} id={library.id} item={library}/>
                        </div>)
                    })}
                    </InfiniteScroll>
                </div>)}else{
                    return empty
                }
            }

    
            default:{
                return(<div>
               {pageList()}
            </div>)}
            
        }
    }
    const handleContentClick=(className)=>{
        setIsContentVisible(!isContentVisible)
        setIsContentVisible(true)
       
    
       
    } 
    return(<div className="content-list">
                <div className="btn-row">
                                    <button onClick={()=>{
                                        handleContentClick(Page.className())
                                        setListType(Page.className)
                                            contentList()
                                      
                                        }}>
                                        Page
                                    </button>
                                    <button onClick={()=>{
                                        handleContentClick(Book.className())
                                        setListType(Book.className)
                                        contentList();
                                        
                                    
                                        }}>
                                        Book
                                    </button>
                                    <button onClick={()=>{
                                            handleContentClick(Library.className())
                                        setListType(Library.className);
                                    
                                        }}>
                                        Library
                                    </button>
                </div>
                         
                            <div
        className={`content ${isContentVisible ? "visible" : "hidden"}`}
        style={{
          maxHeight: isContentVisible ? "80vh" : "0",
          transition: "max-height 0.3s ease-in-out"
        }}
      > 
            <div className="content">
            {
             contentList()
            }
        </div> 
           </div>            
    </div>)
}


