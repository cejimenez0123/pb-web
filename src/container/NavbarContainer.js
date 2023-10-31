import React ,{ useLayoutEffect,useEffect, useState } from 'react'
import { useSelector,useDispatch} from 'react-redux'
import '../App.css'
import "../styles/Navbar.css"
import {signOutAction} from "../actions/UserActions"
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import debounce from '../core/debounce'
import { 
            Container,
            Toolbar,
            Typography,
            Box,
            IconButton,
            Menu,
            MenuItem,
            Button,
            Tooltip,
            Avatar,
        
        } from '@mui/material'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import theme from '../theme'
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';
import { create } from '@mui/material/styles/createTransitions'

const PageName = {
  home: "Home",
  create: "Create",
  discovery:"Discovery",
  login:"Log In"
}
const pages = [ PageName.home,
                PageName.create,
                PageName.discovery, 
                PageName.login]
function NavbarContainer(props){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElNavCreate,setAnchorElNavCreate] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const createRef = React.useRef()
    
  //   useEffect(()=>{
      
  // },[createRef])
    const handleCloseNavMenu = (page) => {
      if(page===PageName.login){
          navigate("/login")                    
      }else if(page===PageName.home){
          navigate("/")
      }else if(page===PageName.discovery){
          navigate("/discovery")
      }
      setAnchorElNav(null)
    }  

    const [openCreate,setOpenCreate] = useState(false)
    const handleClick = (event) => {
      // setAnchorEl(createRef?.current)
      setOpenCreate(!openCreate)
      if(anchorEl) {
        setAnchorEl(null)
      }else{
        setAnchorEl(event.currentTarget);}
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const currentProfile= useSelector((state)=>{return state.users.currentProfile;});
    const SettingName = {
        profile: "Profile",
        account: "Account",
        logout: "Log Out"
    }
    const settings = [SettingName.profile,
                      SettingName.account,
                      SettingName.logout]; 
   
    const handleOpenElNavCreate = (event) => {
      if(anchorElNavCreate){
        setAnchorElNavCreate(null)
      }else{
      setAnchorElNavCreate(event.currentTarget);}
  };
    const handleOpenNavMenu = (event) => {
      
      
        setAnchorElNav(event.currentTarget);
      
    };
  
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };
  

    return (
        <AppBar position="static"
                style={{backgroundColor:theme.palette.primary.dark}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        onClick={()=>{
                            navigate("/")
                        }}
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'helvetica',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                Pb
                    </Typography>
  
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={(e)=>handleOpenNavMenu(e)}
                            color="inherit"
                        >
                <MenuIcon />
              </IconButton>
              <Menu
              
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => {
                        if( page==PageName.create){

                            
                            return currentProfile?(
                            
                          <div key={page}>  
                           <MenuItem onClick={(e)=>         
                        handleOpenElNavCreate(e)
                  } key={page} >
                    <Typography textAlign="center">{page}
                    {anchorElNavCreate?<ExpandMore/>: <ExpandLess/>}</Typography>
                  </MenuItem>
                   
                    <List style={{display:anchorElNavCreate?"":"none"}}>
                      <ListItemButton key="page" 
                        onClick={(e)=>{
                          
                          navigate("/page/new")}}sx={{ pl: 4 }}
                        >
                          Page <CreateIcon/>
                   </ListItemButton>
                        <ListItemButton key={`image`} 
                        onClick={(e)=>{
                          handleClose()
                          navigate("/page/image")}}sx={{ pl: 4 }}
                        >
                          Page <ImageIcon/>
                    </ListItemButton>

                        <ListItemButton  key="book" 
                                    onClick={()=>{ 
                                      handleClose()
                                      navigate("/book/new")
                                      }} 
                                    sx={{ pl: 4 }}>
                            <ListItemText primary="Book" />
                        </ListItemButton>
                         <ListItemButton key="library" onClick={()=>{ 
                          
                          handleClose()
                          navigate("/library/new")}} sx={{ pl: 4 }}>
                           <ListItemText primary="Library" />
                         </ListItemButton>
               
                             </List>
                            
                             </div>):(<div></div>)
                        }else if(PageName.login){
                  return currentProfile?(<div></div>):
                (<MenuItem onClick={()=>handleCloseNavMenu(page) } 
                            key={page} >
                        <Typography textAlign="center">{page}</Typography>
                      </MenuItem>)

                    }
            })
          }
          <MenuItem onClick={()=>{handleCloseNavMenu(PageName.home)}}>
            {PageName.home}
          </MenuItem>
          <MenuItem onClick={()=>{handleCloseNavMenu(PageName.discovery)}}>
            {PageName.discovery}
          </MenuItem>
              </Menu>
            </Box>
            
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'helvetica',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Pb
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => {
                if( page==PageName.create){
                
                  return currentProfile?(<div>
                    <Button 
                      key={page}
                      ref={createRef}
            
                aria-controls="simple-menu"
                aria-haspopup="true"
               
                sx={{ my: 2, color: 'white', display: 'block' }} 
                onClick={(e)=>{
                
                  debounce(handleClick(e),5)
                }}>
                        Create {Boolean(anchorEl) ? <ExpandLess /> : <ExpandMore />}
                      </Button >
                  <Menu
                    sx={{ mt: '45px' }}
                    id="simple-menu"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem 
                      onClick={()=>{
                        handleClose()
                        navigate("/page/new")
                        }}>
                      Page <CreateIcon/>
                    </MenuItem>
                    <MenuItem onClick={()=>{
                      handleClose()
                      navigate("/page/image")}}>
                      Page <ImageIcon/>
                    </MenuItem>
                    <MenuItem onClick={()=>{
                        handleClose()
                        navigate("/book/new")
                    }}>
                        Book
                    </MenuItem>
                    <MenuItem onClick={()=>{
                        handleClose()
                        navigate("/library/new")
                    }}>
                        Library
                    </MenuItem>
                  </Menu></div>)
                  
           
                  :(<div></div>) 
                }else if(currentProfile && page==PageName.login){
                  return(<div></div>)
                
                }else{     
              return(<Button
    key={page}
    onClick={()=>handleCloseNavMenu(page)}
    sx={{ my: 2, color: 'white', display: 'block' }}
  >
    {page}
  </Button>)}
                })
            
              }
            </Box>
            {currentProfile?
            <Box style={{display: currentProfile ? "":"none"}} sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={`${currentProfile.username}`} src={currentProfile.profilePicture} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                    
                  <MenuItem key={setting} 
                            onClick={()=>{
                                if(setting== SettingName.profile){
                                    navigate("/profile/home")
                                }else if(setting== SettingName.logout){
                                    dispatch(signOutAction())
                                }else if(setting== SettingName.account){
                                    navigate("/profile/edit")
                                }
                                handleCloseUserMenu()
                  }}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>:<div></div>}
          </Toolbar>
        </Container>
      </AppBar>
    );
}
export default NavbarContainer

