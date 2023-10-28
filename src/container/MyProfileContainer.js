import React,{ useState }  from 'react';
import ProfileCard from '../components/ProfileCard';
import { useNavigate} from 'react-router-dom';
import "../styles/MyProfile.css"
import ContentList from '../components/ContentList';
import { Button} from '@mui/material';
import { ExpandLess,ExpandMore } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import theme from "../theme"
import MediaQuery from 'react-responsive';
function MyProfileContainer({pagesInView,booksInView,currentProfile,librariesInView,authState}){
    const navigate = useNavigate()
    const [anchorElCreate,setAnchorElCreate]= useState(null)
    if( currentProfile){ 
        return(
            <div className='container reverse'>
                <MediaQuery minWidth={"800px"}>
                <div className="left-side-bar">
                    <div className='create-buttons'>
                        <Button key="page" 
                        onBlurCapture={()=>setAnchorElCreate(null)}
                        onClick={(e)=>{
                            if(!anchorElCreate){
                                setAnchorElCreate(e.target)}else{
                                setAnchorElCreate(false)
                            }
                        }}
                        style={{
                            backgroundColor: theme.palette.secondary.main,
                            color:theme.palette.secondary.contrastText
                            }}
                        variant="outlined"
                        >
                            Create Page{anchorElCreate ? <ExpandLess /> : <ExpandMore />}
                        </Button>
                        <Collapse  in={anchorElCreate} 
                                    timeout="auto"
                                    unmountOnExit>
                            <List>
                                <ListItemButton onClick={()=>{ navigate("/page/new")}}>
                                    <ListItemText primary="Text"/>
                                </ListItemButton>
                                <ListItemButton onClick={()=>{navigate("/page/image")}} >
                                    <ListItemText  primary="Picture"/>
                                </ListItemButton>
                            </List>
                        </Collapse>     
                        <Button
                            style={{backgroundColor: theme.palette.secondary.main,
                                    color:theme.palette.secondary.contrastText}}
                            onClick={()=>{
                                        navigate("/book/new")
                                    }} 
                            variant="outlined"
                        >Create Book
                        </Button>
                        <Button
                            onClick={()=>{
                                    navigate("/library/new")
                                }}
                            style={{    backgroundColor: theme.palette.secondary.main,
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
   
    </div>
    )}else{
        return(<div>
Loading...
        </div>)
    }}

export default MyProfileContainer