import React, { useEffect } from 'react';
import { useDispatch,useSelector } from "react-redux";
import ProfileCard from '../components/ProfileCard';
import { useNavigate} from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from 'react';
import "../styles/MyProfile.css"
import ContentList from '../components/ContentList';
import { Button } from '@mui/material';
import theme from "../theme"
function MyProfileContainer({pagesInView,booksInView,currentProfile,librariesInView,authState}){
    const navigate = useNavigate()
    
    const [pending,setPending] = useState(false)
    if( currentProfile){ 
    
    return(
        <div className='container'>
        <div  className='container-row'>
          
            <div className="left-side-bar">
                        <div className='create-buttons'>
                                    <Button onClick={()=>{
                                        navigate("/page/new")
                                    }}
                                    style={{backgroundColor: theme.palette.secondary.main,
                                        color:theme.palette.secondary.contrastText}}
                                    variant="outlined"
                                    >Create Page</Button>
                                   <Button
                                   style={{backgroundColor: theme.palette.secondary.main,
                                    color:theme.palette.secondary.contrastText}}
                                    onClick={()=>{
                                        navigate("/book/new")
                                    }} 
                                    variant="outlined"
                                    >Create Book</Button>
                                    <Button
                                    onClick={()=>{
                                        navigate("/library/new")
                                    }}
                                    style={{backgroundColor: theme.palette.secondary.main,
                                        color:theme.palette.secondary.contrastText}}
                                    variant="outlined"
                                   >Create Library</Button>
                    </div>
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