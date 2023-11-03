import React,{ useEffect, useState }  from 'react';
import ProfileCard from '../components/ProfileCard';
import { useNavigate} from 'react-router-dom';
import "../styles/MyProfile.css"
import ContentList from '../components/ContentList';
import { ExpandLess,ExpandMore } from '@mui/icons-material';
import theme from "../theme"
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';
import debounce from "../core/debounce"
import {  
    Menu,
    MenuItem,
    Button,
    
} from '@mui/material'

function MyProfileContainer({pagesInView,booksInView,currentProfile,librariesInView}){


    if( currentProfile){ 
        return(
            <div className='container reverse'>
            <div className='main-bar'>
                    <ContentList currentProfile={currentProfile} pagesInView={pagesInView} booksInView={booksInView} librariesInView={librariesInView}/>
            </div>         
            <div className="right-side-bar">
                    <ProfileCard currentProfile={currentProfile}/>
                
                    <CreateButtons />
                
            </div>  
   
    </div>
    )}else{
        return(<div>
Loading...
        </div>)
    }}
function CreateButtons (props){
    const navigate = useNavigate()
    const [anchorEl,setAnchorEl]= useState(null)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose =()=>{
        setAnchorEl(null);
    }
    return(  <div className='create-buttons'>
                 <Button 
                id="demo-customized-button"
                style={{backgroundColor:theme.palette.primary.main,
                color:theme.palette.primary.contrastText,
                padding:"1em 2em"}}
                aria-controls={anchorEl ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={anchorEl ? 'true' : undefined}
                sx={{ my: 2, color: 'white', display: 'block' }} 
                onClick={(e)=>debounce(handleClick(e),5)}>
                        Create {anchorEl ? <ExpandLess /> : <ExpandMore />}
                      </Button >
                     <Menu
                anchorEl={anchorEl}
                open={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom', // Position the menu below the button
                    horizontal: 'left',  // Position the menu to the left of the button
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                style={{width: "10em",}}
                MenuListProps={{
              'aria-labelledby': 'demo-customized-button',
                    }}>    
             
                    <MenuItem onClick={()=>navigate("/page/new")}>
                      Page <CreateIcon/>
                    </MenuItem>
                    <MenuItem onClick={()=>navigate("/page/image")}>
                      Page <ImageIcon/>
                    </MenuItem>
                    <MenuItem onClick={()=>{
                        navigate("/book/new")
                    }}>
                        Book
                    </MenuItem>
                    <MenuItem onClick={()=>{
                        navigate("/library/new")
                    }}>
                        Library
                    </MenuItem>
            </Menu>
        </div>)
}
export default MyProfileContainer