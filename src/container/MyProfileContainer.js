import React, { useEffect } from 'react';
import { useDispatch,useSelector } from "react-redux";
import ProfileCard from '../components/ProfileCard';
import { useNavigate} from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from 'react';
import "../styles/MyProfile.css"
import ContentList from '../components/ContentList';


function MyProfileContainer({pagesInView,booksInView,currentProfile,librariesInView,authState}){
    const navigate = useNavigate()
    
    const [pending,setPending] = useState(false)
    if( currentProfile){ 
    
    return(
        <div className='container'>
        <div  className='container-row'>
          
            <div className="left-side-bar">
                    <ul className='list-unstyled'>
                                    <li onClick={()=>{
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
          
            <div className='main-bar'>
                    <ContentList currentProfile={currentProfile} pagesInView={pagesInView} booksInView={booksInView} librariesInView={librariesInView}/>
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