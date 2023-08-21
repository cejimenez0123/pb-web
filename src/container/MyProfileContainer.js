import React, { useEffect } from 'react';
import { useDispatch,useSelector } from "react-redux";
import ProfileCard from '../components/ProfileCard';
import { useNavigate} from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from 'react';
import { getCurrentProfile } from '../actions/UserActions';
import { getProfilePages } from '../actions/PageActions';
import { getProfileBooks } from '../actions/BookActions';
import PageListItem from '../components/PageLIstItem';
import "../styles/MyProfile.css"
import Book from '../domain/models/book'
import Page from '../domain/models/page'
import Library from '../domain/models/library'
import { current } from '@reduxjs/toolkit';

function MyProfileContainer({pagesInView,booksInView,currentProfile,authState}){
    const navigate = useNavigate()
   let loading =  useSelector((state)=>state.users.loading)
   const [page,setPage] = useState(1)
   const [hasMorePages,setHasMorePages]=useState(false)
   const [hasMoreBooks,setHasMoreBooks]=useState(false)
  
    const [pending,setPending] = useState(false)
   const dispatch = useDispatch()
   const [isContentVisible, setIsContentVisible] = useState(true)
    // useEffect(()=>{
        
    //     if(!authState.user){
    //         if(!!authState.user && authState.user.isAnonymous){
    //         const params = {userId: authState.user.id}
    //         dispatch(getCurrentProfile(params))}else{
    //             navigate("/login")
    //         }
    //     }else{

    //     }
    // })
    useEffect(()=>{
        if(!!currentProfile){
            fetchPageData()
            fetchBookData()
        }
    },[currentProfile])
    const fetchPageData = () =>{
        if(!!currentProfile){
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
        if(!!currentProfile){
            const params = {profileId:currentProfile.id,page,groupBy:9}
             dispatch(getProfileBooks(params)).then((result) => {
                setHasMoreBooks(true)
                
            
            }).catch((err) => {
                setHasMoreBooks(false)
            });}
    }

if( !!currentProfile){
    const pageList=()=>{
        return (<div className="page-list">
        <InfiniteScroll
       dataLength={pagesInView}
       next={fetchPageData}
       hasMore={hasMorePages} // Replace with a condition based on your data source
       loader={<p>Loading...</p>}
       endMessage={<p>No more data to load.</p>}
     >
         {pagesInView.map(page =>{
                 return(<PageListItem page={page}/>)
         })}
     </InfiniteScroll>
     </div> )
            
            }
    const bookList = ()=>{

        return (<div className='book-list'>

        </div>)
    }
    const handleContentClick=(className)=>{
        setIsContentVisible(!isContentVisible)
    }     
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
                                    <li className='btn btn-primary mb-3'>Create Library</li>
                    </ul>
                </div>
            </div>
                        <div className='main-bar'>
                            <div>
                                <div className="btn-row">
                                    <button onClick={()=>handleContentClick(Page.className)}>
                                        Page
                                    </button>
                                    <button onClick={()=>handleContentClick(Book.className)}>
                                        Book
                                    </button>
                                    <button onClick={()=>handleContentClick(Library.className)}>
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
      > {pageList()}
       
      </div>   
                       
                        </div>
                        <div className="right-side-bar">
                            <ProfileCard currentProfile={currentProfile}/>
                        </div>  
        </div>
{/*                                 
                                <section>
         */}
                        {/* <div onClick={(e)=>this.handleModalClose(e)} style={{width: "100%",display: this.state.showStartLibraries}} class="modal">
                            <div   class="modalContent">
                              <span  class="close">&times;</span>
                               
                                <form  className="startForm" onSubmit={(e)=>this.startLib(e)}>
                                    <h4>Name of Library:</h4>
                                    <br/>
                                    <input type="text" name="name" placeholder="untitled"/>
                                    <br/>
                                    <label> Intro to Library: </label>
                                    <br/>
                                    <textarea/>
                                    <h4> Privacy:</h4>
                                    <select name="privacy">
                                        <option value="private">Private</option>
                                        <option value="public">Public</option>
                                    </select>
                                    <br/>
                                        <input type="submit" value="Create"/>
                                </form> 
                            </div>
                        </div> */}
                                    
                                        {/* <div onClick={(e)=>this.handleModalClose(e)} style={{display: this.state.showStartBook}} class="modal">
                            <div   class="modalContent">
                              <span  class="close">&times;</span>
                              <div  className="modalIndex">
                             
                                <form onSubmit={(e)=>this.startBook(e)}>
                                 <div className="startForm">
                                    <label htmlFor="name">Name of Book:  </label>
                                    <br/>
                                    <input type="text"  className="form-control" name="name" placeholder="untitled"/>
                                    <br/>
                                    <label> Introduction to Book</label>
                                    <br/>
                                    <textarea className=" form-control" placeholder="What's the why" rows="3"/>
                                    <br/>
                                    <label> Privacy:</label>
                                    <select className="form-control" name="privacy">
                                        <option value="private">Private</option>
                                        <option value="public">Public</option>
                                    </select>
                                    <br/>
                                        <input type="submit" value="Create"/>
                                        </div>
                                </form>
                                
                            </div>
                        </div>
                    </div> */}
                    {/* "start-btn btn btn-secondary btn-dark btn-sm */}
                       
                                {/* </section>
                                
                          
                    </div>
                    <Modal button={<h3>Books</h3>} className={"book-index"} content={<BookIndex books={this.props.followedBooks}/>}/>
                  
                          <Modal button={ <h3 >Libraries</h3> } className={"lib-index"} content={<LibraryIndex libraries={this.props.libraries} bookLibraries={this.props.bookLibraries}/>
                      }/>
                    </div>
                     
                      <div >
                      <div className="pageMain">
                   <BottomScrollListener onBottom={()=>this.handleOnBottom()}>
                <Pages pages={this.props.pagesInView} />
         </BottomScrollListener>
                </div>
                </div>
                <a href={`/user/${this.props.currentUser.id}/settings`} >
                                    <img src="https://img.icons8.com/ios/50/000000/settings.png"/>
                                </a>
            </div>
            </div> */}
        </div>
    )}else{
        return(<div>
Loading...
        </div>)
    }}
export default MyProfileContainer

