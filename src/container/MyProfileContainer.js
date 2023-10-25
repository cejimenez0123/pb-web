import React, { useEffect } from 'react';
import { useDispatch,useSelector } from "react-redux";
import ProfileCard from '../components/ProfileCard';
import { useNavigate} from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from 'react';
import "../styles/MyProfile.css"
import ContentList from '../components/ContentList';
import { Button,} from '@mui/material';
import {Dropdown,MenuButton,Menu,MenuItem} from '@mui/joy'
import theme from "../theme"
import MediaQuery from 'react-responsive';
function MyProfileContainer({pagesInView,booksInView,currentProfile,librariesInView,authState}){
    const navigate = useNavigate()
    
    const [pending,setPending] = useState(false)
    if( currentProfile){ 
    
    return(
        <div className='container reverse'>
        {/* <div  className='container-row'> */}
          <MediaQuery minWidth={"800px"}>
            <div className="left-side-bar">
                        <div className='create-buttons'>
                                    
                                       <Dropdown>
                        <MenuButton
                         style={{backgroundColor: theme.palette.secondary.main,
                            color:theme.palette.secondary.contrastText}}
                        variant="outlined"
           >
                                        Create Page
                     
          </MenuButton>
          <Menu>
          <MenuItem onClick={()=>{
                                        navigate("/page/new")
                                    }}>
                            Text
                        </MenuItem>
          <MenuItem onClick={()=>{
          }
                            }> 
                            Picture
                        </MenuItem>
                       
                        
            
          </Menu>
        </Dropdown>
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
            </MediaQuery>
            <div className='main-bar'>
                    <ContentList currentProfile={currentProfile} pagesInView={pagesInView} booksInView={booksInView} librariesInView={librariesInView}/>
            </div>
                    
            <div className="right-side-bar">
                    <ProfileCard currentProfile={currentProfile}/>
            </div>  
    {/* </div> */}
    </div>
    )}else{
        return(<div>
Loading...
        </div>)
    }}

export default MyProfileContainer