import React ,{useEffect, useState } from 'react'
import {connect, useSelector,useDispatch} from 'react-redux'
import '../App.css'
import "../styles/Navbar.css"
import {signOutAction} from "../actions/UserActions"
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
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
            Avatar,Popover
        } from '@mui/material'
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import theme from '../theme'

import MediaQuery from 'react-responsive'
function NavbarContainer(props){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentProfile= useSelector((state)=>{return state.users.currentProfile;});
    const PageName = {
        home: "Home",
        create: "Create",
        discovery:"Discovery",
        login:"Log In"
    }
    const SettingName = {
        profile: "Profile",
        account: "Account",
        logout: "Log Out"
    }
    const pages = [PageName.home, PageName.create,PageName.discovery, PageName.login];
    const settings = [SettingName.profile,SettingName.account,SettingName.logout];
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElCreateA,setAnchorElCreateA] = React.useState(null);
    const [anchorElCreateB,setAnchorElCreateB] = React.useState(null);
    const [open,setOpen]= useState(false)
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
//
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseNavMenu = (page) => {
        if(page==PageName.login){
            navigate("/login")                    
        }else if(page==PageName.home){
            navigate("/")
        }else if(page==PageName.discovery){
            navigate("/discovery")
        };
        setAnchorElNav(null);
    };
  
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };
    const handleOpenClick = ()=>{
        setOpen(!open)
    }
 
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
                            onClick={handleOpenNavMenu}
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
                        if(page==PageName.create){

                            if(currentProfile){
                            return(
                            
                          <div>
                               
                               <MenuItem key={page} onClick={handleOpenClick}>
                    <Typography textAlign="center">{page}</Typography>
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </MenuItem>

                             
                             <Collapse in={open} timeout="auto" unmountOnExit>
                             <List>
                          
                           <ListItemButton key="page" 
                           onClick={(e)=>setAnchorElCreateB(e.target)}sx={{ pl: 4 }}>
                          
                         Page {anchorElCreateB ? <ExpandLess /> : <ExpandMore />}
                         </ListItemButton>
                         <Collapse in={anchorElCreateB} timeout="auto" unmountOnExit>
                            <List>
                                <ListItemButton onClick={()=>{ navigate("/page/new")}}>
                                    <ListItemText primary="Text"/>
                                </ListItemButton>
                                <ListItemButton onClick={()=>{navigate("/page/new/image")}}>
                                    <ListItemText primary="Picture"/>
                                </ListItemButton>
                            </List>
                            </Collapse>
                         <ListItemButton key="book" onClick={()=>{ navigate("/book/new")}} sx={{ pl: 4 }}>
                         
                           <ListItemText primary="Book" />
                         </ListItemButton>
                         <ListItemButton key="library" onClick={()=>{ navigate("/library/new")}} sx={{ pl: 4 }}>
                           <ListItemText primary="Library" />
                         </ListItemButton>
               
                             </List>
                             </Collapse>
                             </div>)}else{
                                return(<div>

                                </div>)
                             }
                                }else{
                        if(currentProfile && page==PageName.login){
                            return
                        }else{
                   return( 
                  <MenuItem onClick={()=>         
                        handleCloseNavMenu(page)
                  } key={page} >
                    <Typography onClick={()=>         
                        handleCloseNavMenu(page)
                  }  textAlign="center">{page}</Typography>
                  </MenuItem>)
                  }
}})}
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

                if(page=='Create'){
                    if(currentProfile){
             return(
           <div>
            <MediaQuery minWidth={"800px"}>

                <Button 
                    id="demo-customized-button"
                    aria-controls={anchorEl ? 'demo-customized-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={anchorEl ? 'true' : undefined}
                    sx={{ my: 2, color: 'white', display: 'block' }} 
                    onClick={handleClick}>
                Create
                {anchorEl ? <ExpandLess /> : <ExpandMore />}
                </Button >
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom', // Position the menu below the button
                        horizontal: 'left',  // Position the menu to the left of the button
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    MenuListProps={{
                  'aria-labelledby': 'demo-customized-button',
        }}

            >    
            
            <MenuItem key="page" onBlurCapture={()=>setAnchorElCreateA(null)} onClick={(e)=>{
                if(!anchorElCreateA){
                setAnchorElCreateA(e.target)}else{
                    setAnchorElCreateA(false)
                }
            }}>
                     
                         Page{anchorElCreateA ? <ExpandLess /> : <ExpandMore />}
                         </MenuItem>
                         <Collapse in={anchorElCreateA} timeout="auto" unmountOnExit>
                            <List>
                                <ListItemButton onClick={()=>{ navigate("/page/new")}}>
                                    <ListItemText primary="Text"/>
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Picture"/>
                                </ListItemButton>
                            </List>
                            </Collapse>
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
        </MediaQuery>
    </div>)}else{
                return
              }
                 }else{
                    if(currentProfile && page==PageName.login){
                        return 
                    }else{
                return (
                <Button
                  key={page}
                  onClick={()=>
                    handleCloseNavMenu(page)
                }
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
                 )}}}
              )}
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

