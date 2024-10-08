import React,{ useEffect, useState }  from 'react';
import ProfileCard from '../components/ProfileCard';
import { useNavigate} from 'react-router-dom';
import "../styles/MyProfile.css"
import { ExpandLess,ExpandMore } from '@mui/icons-material';
import theme from "../theme"
import {Skeleton} from "@mui/material"
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';
import debounce from "../core/debounce"
import { setEditingPage } from '../actions/PageActions';
import {useDispatch,useSelector} from "react-redux"
import LinkIcon from '@mui/icons-material/Link';
import notifications from "../images/icons/notifications.svg"
import settings from "../images/icons/settings.svg"
import {  
    Menu,
    MenuItem,
    Button,
    List,
    ListItemButton,
} from '@mui/material'
import { getCurrentProfile } from '../actions/UserActions';
import PageIndexList from '../components/page/PageIndexList';
function MyProfileContainer(props){
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [media,setMedia]=useState()
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const dispatch = useDispatch()
    useEffect(()=>{
        if(!currentProfile){
            dispatch(getCurrentProfile()).then(res=>console.log("Resd",res))
        }
    
    },[])
    
            return(
            <div className=''>
                    <div className='bg-dark w-full lg:h-72 m-4 pb-4 rounded-lg'>
                    <div className='text-right mt-2'>
                        <button className='bg-dark'>
                            <img src={settings}/>
                        </button>
                        <button className='bg-dark'>
                            <img 
                            src={notifications}/>
                        </button>
                        </div>
                        <div>
                            <div className='flex-row flex w-48'>
                        <img className={"w-36 h-36 ml-6 rounded-lg"}src={currentProfile.profilePic}/>
                        <div className=' ml-4 mt-1 text-left'>
                            <h5 className='text-xl font-bold'>{currentProfile.username}</h5>
                            <p>{currentProfile.selfStatement}</p>
                           <div className='mt-4 pt-2'>
                            <button className='bg-green-600 text-white  text-xl text-bold'>
                                Write a Story
                            </button>
                            <button className='bg-green-600 md:ml-4 text-white text-xl  text-bold'>
                                Create Collection
                            </button>
                            </div> 
                        </div>
                        </div>
                        <div className='text-left mt-6'>
                        <button className='bg-dark font-bold text-green-100'>
                                Page
                            </button>
                            <button className='bg-dark font-bold text-green-100'>
                                Books
                            </button>
                            <button className='bg-dark font-bold text-green-100'>
                                Library
                            </button>
                            
                        </div>
                        </div>
                      
                      
                      
                    </div>
                <PageIndexList/>
                   
            </div>
        )
     
        
    }


    
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