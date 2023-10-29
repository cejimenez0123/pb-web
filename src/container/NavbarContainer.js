import React ,{ useState } from 'react'
import { useSelector,useDispatch} from 'react-redux'
import '../App.css'
import "../styles/Navbar.css"
import {signOutAction} from "../actions/UserActions"
import { useNavigate } from 'react-router-dom'
import history from '../history'
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
            Avatar
        } from '@mui/material'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import theme from '../theme'
import debounce from "../core/debounce"
import CreateIcon from '@mui/icons-material/Create';
import MediaQuery from 'react-responsive'
import ImageIcon from '@mui/icons-material/Image';

const PageName = {
  home: "Home",

create: "Create",
  discovery:"Discovery",
  login:"Log In"
}
const pages = [PageName.home,

   PageName.create,
   PageName.discovery, PageName.login]
function NavbarContainer(props){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleCloseNavMenu = (page) => {
      if(page===PageName.login){
          navigate("/login")                    
      }else if(page===PageName.home){
          navigate("/")
      }else if(page===PageName.discovery){
          navigate("/discovery")
      }
    }
   
    const [anchorEl, setAnchorEl] = useState(null);
    
  
   
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
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
    const settings = [SettingName.profile,SettingName.account,SettingName.logout]; 
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [open,setOpen]= useState(false)
    const [anchorElUser, setAnchorElUser] = useState(null);
    
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
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
                onBlur={()=>{
                  setAnchorElNav(null)
                }}
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


          if(currentProfile){
                        if(page==PageName.create){

                            
                            return(
                            
                          <div key={page}>
                               
                            
                    <List>
                      <MenuItem onClick={()=>{
                        setAnchorElNav(null)
                        navigate("/")
                      }} sx={{ pl: 4 }}>
                              Home
                      </MenuItem>
                      <MenuItem 
                        onClick={()=>{
                          setAnchorElNav(null)
                          navigate("/discovery")
                        }}
                        sx={{ pl: 4 }}>
                              Discovery
                      </MenuItem>
                      <MenuItem key="page" 
                        onClick={(e)=>{
                          setAnchorElNav(null)
                          navigate("/page/new")}}sx={{ pl: 4 }}
                        >
                          Page <CreateIcon/>
                   </MenuItem>
                        <MenuItem key={`image`} 
                        onClick={(e)=>{
                          setAnchorElNav(null)
                          navigate("/page/image")}}sx={{ pl: 4 }}
                        >
                          Page <ImageIcon/>
                    </MenuItem>

                        <MenuItem  key="book" 
                                    onClick={()=>{ 
                                      setAnchorElNav(null)
                                      navigate("/book/new")
                                      }} 
                                    sx={{ pl: 4 }}>
                            <ListItemText primary="Book" />
                        </MenuItem>
                         <MenuItem key="library" onClick={()=>{ 
                          
                          setAnchorElNav(null)
                          navigate("/library/new")}} sx={{ pl: 4 }}>
                           <ListItemText primary="Library" />
                         </MenuItem>
               
                             </List>
                          
                             </div>)}else{
                                return(<div key={page}>

                                </div>)
                             }
                                }else{
                      
                       if(page ==PageName.create){
                        return
                       }else{
                   return( 
                  <MenuItem onClick={()=>         
                        handleCloseNavMenu(page)
                  } key={page} >
                    <Typography onClick={()=>         
                        handleCloseNavMenu(page)
                  }  textAlign="center">{page}</Typography>
                  </MenuItem>)}
                  }
            })
          }
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
              {
              pages.map((page) => {
               
               // return (<CreateNavItem close={()=>{setAnchorElNav(null)}}key={page} page={page}/>)
               if(page==PageName.create){
                if(currentProfile){
                  return(
                    <div key={page}>
                      <MediaQuery minWidth={"800px"}>
                        <Button 
                id="demo-customized-button"
                aria-controls={anchorEl ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={anchorEl ? 'true' : undefined}
                sx={{ my: 2, color: 'white', display: 'block' }} 
                onClick={(e)=>debounce(handleClick(e),5)}>
                        Create  {anchorEl ? <ExpandLess /> : <ExpandMore />}
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
                MenuListProps={{
              'aria-labelledby': 'demo-customized-button',
                    }}>    
                  
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
            </Menu>
            </MediaQuery>
            </div>
            )
          }else{
            return
            }
             }else{
                if(currentProfile && page!=PageName.login){
                  
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
             )}
             
          }}
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

