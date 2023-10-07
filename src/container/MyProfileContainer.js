import React, { useEffect } from 'react';
import { useDispatch,useSelector } from "react-redux";
import ProfileCard from '../components/ProfileCard';
import { useNavigate} from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from 'react';
import { getCurrentProfile } from '../actions/UserActions';
import { getProfilePages } from '../actions/PageActions';
import { getProfileBooks } from '../actions/BookActions';
import { getProfileLibraries } from '../actions/LibraryActions';
import PageListItem from '../components/PageLIstItem';
import "../styles/MyProfile.css"
import Book from '../domain/models/book'
import Page from '../domain/models/page'
import Library from '../domain/models/library'
import { current } from '@reduxjs/toolkit';
import ListItem from '../components/ListItem';
import { List } from '@mui/material';



function MyProfileContainer({pagesInView,booksInView,currentProfile,librariesInView,authState}){
    const navigate = useNavigate()
    const [page,setPage] = useState(1)
    const [hasMorePages,setHasMorePages]=useState(false)
    const [hasMoreBooks,setHasMoreBooks]=useState(false)
    const [hasMoreLibraries,setHasMoreLibraries]=useState(false)
    const [listType,setListType]=useState("page")
    const [pending,setPending] = useState(false)
    const dispatch = useDispatch()
    const [isContentVisible, setIsContentVisible] = useState(true)

    useEffect(()=>{
        if(!!currentProfile){
            fetchPageData()
            fetchBookData()
            fetchLibraryData()
        }
    },[currentProfile])
    const fetchPageData = () =>{
        if(currentProfile){
            const params = {profileId:currentProfile.id,page,groupBy:9}
             dispatch(getProfilePages(params)).then((result) => {
                setHasMorePages(true)
                const newPage = page+1 
                setPage(newPage)
            }).catch((err) => {
                setHasMorePages(false)
            });}
    }
    const fetchBookData=()=>{
        if(currentProfile){

            const params = {profileId:currentProfile.id,page,groupBy:9}
             dispatch(getProfileBooks(params)).then((result) => {
                setHasMoreBooks(true)
                
            
            }).catch((err) => {
                setHasMoreBooks(false)
            });}
    }
    const fetchLibraryData=()=>{
            if(currentProfile){
                const params = {profileId:currentProfile.id,page,groupBy:9}
                dispatch(getProfileLibraries(params)).then(()=>{
                    setHasMoreLibraries(true)
                }).catch((err)=>{
                    setHasMoreLibraries(false)
                })
            }
    }


    const pageList=()=>{
        const empty = (<div>
            Empty
        </div>)
        if(pagesInView!=null ){    
            return (<div className="page-list">
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
            
        

    const contentList = () =>{
        const empty = (<div>
            Empty
        </div>)
        switch(listType){
            case "page":{
           if(pagesInView!=null ){    
           return (<div className="page-list">
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
               return (<div className='book-list'>
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
                return(<div>
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
   

    if( currentProfile){ 
    
    return(
        <div className='container'>
        <div  className='container-row'>
            <div className=''>
                <div classNAme="left-side-bar">
                    <ul className='list-unstyled'>
                                    {/* <a href="/page/new">  */}<li onClick={()=>{
                                        navigate("/page/new")
                                    }}className='btn btn-primary mb-3'>Create Page</li>
                                   <li
                                    onClick={()=>{
                                        navigate("/book/new")
                                    }} className='btn btn-primary mb-3' >Create Book</li>
                                    <li 
                                    onClick={()=>{
                                        navigate("/library/new")
                                    }}
                                    className='btn btn-primary mb-3'>Create Library</li>
                    </ul>
                </div>
            </div>
                        <div className='main-bar'>
                            <div>
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
                            </div>
                            <div
        className={`content ${isContentVisible ? "visible" : "hidden"}`}
        style={{
          maxHeight: isContentVisible ? "80vh" : "0",
          transition: "max-height 0.3s ease-in-out"
        }}
      > {
        contentList()
        }
       
      </div>   
                       
                        </div>
                        <div className="right-side-bar">
                            <ProfileCard currentProfile={currentProfile}/>
                        </div>  
        </div>

        </div>
    )}else{
        return(<div>
Loading...
        </div>)
    }}
export default MyProfileContainer

