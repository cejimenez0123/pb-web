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
            Avatar,
        } from '@mui/material'
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import theme from '../theme'


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
    const [open,setOpen]= useState(false)
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    
    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseNavMenu = (page) => {
       
                        if(page==PageName.login){
                   
                            navigate("/login")
                            
                        }else if(page==PageName.home){
                        
                            navigate("/")
                        }else if(page==PageName.discovery){
                        
                            navigate("/discovery")
                        };
                      
                    ;
                setAnchorElNav(null);
    };
  
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };
    const handleOpenClick = ()=>{
        setOpen(!open)
    }
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
                               {/* <ListItemButton onClick={handleClick}> */}
                               <MenuItem key={page} onClick={handleOpenClick}>
                    <Typography textAlign="center">{page}</Typography>
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </MenuItem>

                             
                             <Collapse in={open} timeout="auto" unmountOnExit>
                             <List>
                          
                           <ListItemButton onClick={()=>{ navigate("/page/new")}}sx={{ pl: 4 }}>
                           <ListItemText primary="Page" />
                         </ListItemButton>
                         <ListItemButton onClick={()=>{ navigate("/book/new")}} sx={{ pl: 4 }}>
                         
                           <ListItemText primary="Book" />
                         </ListItemButton>
                         <ListItemButton onClick={()=>{ navigate("/library/new")}} sx={{ pl: 4 }}>
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
                <Button 
                  id="demo-customized-button"
                  aria-controls={anchorEl ? 'demo-customized-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={anchorEl ? 'true' : undefined}
                sx={{ my: 2, color: 'white', display: 'block' }} onClick={handleClick}>
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
          <MenuItem onClick={()=>{
                            navigate("/page/new")
                            }}> 
                            Page
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
//   export default ResponsiveAppBar;  
function mapState(state){

  return{
//     users: state.users.users,
//   loggedIn: state.users.loggedIn,
//   currentUser: state.users.currentUser,
//   books: state.books.books,
//   libraries: state.libraries.libraries
}
}
function mapDispatch(dispatch){
  return{
    // getCurrentUser: ()=>dispatch(SET_CURRENT_USER())
}
}
export default connect(mapState,mapDispatch)(NavbarContainer)


