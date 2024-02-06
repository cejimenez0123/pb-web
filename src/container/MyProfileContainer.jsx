import React,{ useState }  from 'react';
import ProfileCard from '../components/ProfileCard';
import { useNavigate} from 'react-router-dom';
import "../styles/MyProfile.css"
import ContentList from '../components/ContentList';
import { ExpandLess,ExpandMore } from '@mui/icons-material';
import theme from "../theme"
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';
import debounce from "../core/debounce"
import { setEditingPage } from '../actions/PageActions';
import {useDispatch} from "react-redux"
import LinkIcon from '@mui/icons-material/Link';
import {  
    Menu,
    MenuItem,
    Button,
    List,
    ListItemButton,
    Typography
    
} from '@mui/material'
import { btnStyle } from '../styles/styles';

function MyProfileContainer({booksInView,currentProfile,librariesInView}){

   
    if( currentProfile){ 
        return(
            <div className='two-panel'>
            <div className='left-bar'>
                    <ContentList profile={currentProfile}  booksInView={booksInView} librariesInView={librariesInView}/>
            </div>         
            <div className="right-bar">
                    <ProfileCard profile={currentProfile}/>
                    <CreateButtons />
                
            </div>  
   
    </div>
    )}else{
        return(<div>
Loading...
        </div>)
    }}

    
function CreateButtons (props){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [anchorCreate,setAnchorCreate]=useState(null)
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
                boxShadow:"0 5px 18px rgba(0, 0, 0, 0.6)",
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
                     <MenuItem onClick={(e)=>{

                     
                    if(anchorCreate){
                        setAnchorCreate(null)
                    }else{
                        setAnchorCreate(e.currentTarget)
                    }    
                }
                } key={"page"} >
                  
                    Page {anchorCreate?<ExpandMore/>:<ExpandLess/>}
                  </MenuItem>
                          <List style={{display:Boolean(anchorCreate)?"":"none"}}>
                            <ListItemButton key="page" 
                              onClick={(e)=>{
                                dispatch(setEditingPage({page:null}))
                                setAnchorCreate(null)
                                navigate("/page/text")}}
                                sx={{ pl: 4 }}
                            >
                              <CreateIcon/>
                            </ListItemButton>
                            <ListItemButton key={`image`} 
                              onClick={(e)=>{
                              dispatch(setEditingPage({page:null}))
                              setAnchorCreate(null)
                              navigate("/page/image")}}
                              sx={{ pl: 4}}
                            >
                              <ImageIcon/>
                            </ListItemButton>
                            <ListItemButton     
                    sx={{ pl: 4 }} 
                    onClick={()=>{
                      dispatch(setEditingPage({page:null}))
                      handleClose()
                      navigate("/page/link")}}>
                     <LinkIcon/>
                    </ListItemButton>
                          </List>
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