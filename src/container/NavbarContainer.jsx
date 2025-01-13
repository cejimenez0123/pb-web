import React ,{ useEffect, useLayoutEffect,useState } from 'react'
import { useSelector,useDispatch} from 'react-redux'
import '../App.css'
import "../styles/Navbar.css"
import {signOutAction} from "../actions/UserActions"
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import getDownloadPicture from '../domain/usecases/getDownloadPicture'
import { debounce } from 'lodash'
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
import LinkIcon from '@mui/icons-material/Link';
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';
import Paths from '../core/paths'
import { searchDialogToggle } from '../actions/UserActions'
import SearchDialog from '../components/SearchDialog'
import { createStory } from '../actions/StoryActions'
import checkResult from '../core/checkResult'
import Dialog from '@mui/material/Dialog';
import ReactGA from 'react-ga4'
import CreateCollectionForm from '../components/collection/CreateCollectionForm'
import { setHtmlContent, setPageInView } from '../actions/PageActions'
import { useMediaQuery } from 'react-responsive'
const PageName = {
  home: "Home",
  about:"About",
  create: "Create",
  discovery:"Discovery",
  login:"Log In",
  search:"Search",
  workshop:"Workshop"
}
const pages = [ 
                PageName.about,
                PageName.discovery,
                PageName.workshop,
                PageName.search,
                PageName.create, 
                PageName.login,
                ]
function NavbarContainer(props){
  const isPhone =  useMediaQuery({
    query: '(max-width: 600px)'
  })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElNavCreate,setAnchorElNavCreate] = useState(null);
    const [anchorElPage,setAnchorElPage] = useState(null);
    const [anchorElPageSmall,setAnchorElPageSmall] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedImage,setSelectedImage]=useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s")
    const [openDialog,setOpenDialog]=useState(false)
   
    const createRef = React.useRef()
    const pageRef = React.useRef()
    const openDialogAction = ()=>{
      dispatch(searchDialogToggle({open:true}))
    }
    const handleCloseNavMenu = (page) => {
      if(page===PageName.login){
          navigate("/login")                    
      }else if(page===PageName.home){
          navigate("/")
      }else if(page===PageName.discovery){
          navigate("/discovery")
      }else if(page===PageName.about){
        navigate(Paths.about())
      }else if(page==PageName.workshop){
        navigate(Paths.workshop.reader())
      }
      setAnchorElNav(null)
    }  
  
    const [openCreate,setOpenCreate] = useState(false)
    const handleClick = (event) => {
      setOpenCreate(!openCreate)
      if(anchorEl) {
        setAnchorEl(null)
      }else{
        setAnchorEl(event.currentTarget);
      }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClosePage = () => {
      setAnchorElPage(null);
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
  useLayoutEffect( ()=>{
    if(currentProfile){
    if( !currentProfile.profilePic.includes("http")){
        getDownloadPicture(currentProfile.profilePic).then(url=>{
           
            setSelectedImage(url)
        })
    }else{
        setSelectedImage(currentProfile.profilePic)
    }
  }
    
},[currentProfile])
  const handleElPageSmall = (event) => {
    if(anchorElPageSmall){
      setAnchorElPageSmall(null)
    }else{
    setAnchorElPageSmall(event.currentTarget);
  }
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
    const handleOpenElPage = (e) => {
      if(anchorElPage) {
        setAnchorElPage(null)
      }else{
        setAnchorElPage(e.currentTarget);
      }
    }
    const ClickWriteAStory = ()=>{
      ReactGA.event({
          category: "Page",
          action: "Navigate To Editor",
          label: "Write a Story", 
          value: currentProfile.id,
          nonInteraction: false
        });
        
        dispatch(createStory({profileId:currentProfile.id,privacy:true,type:"html",
        title:"",commentable:true
      })).then(res=>checkResult(res,data=>{
      
          navigate(Paths.editPage.createRoute(data.story.id))
      },e=>{

      }))
          
    
      
  }
    return (
      <div className='bg-emerald-900'>
        <AppBar position="static"
               className='bg-transparent'>
            <Container >
                <Toolbar disableGutters={true}>
                    <Typography
                        onClick={()=>{
                            navigate("/discovery")
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
                        
                        if(page==PageName.home || page==PageName.discovery){
                            return( (<MenuItem onClick={()=>handleCloseNavMenu(page) } 
                            key={page} >
                        <Typography textAlign="center">{page}</Typography>
                      </MenuItem>)
)
                        }else if(page==PageName.workshop){
                          return currentProfile?<MenuItem onClick={()=>handleCloseNavMenu(page) } 
                          key={page} >
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>:null
                        }else if( page==PageName.create){

                            
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
                            handleElPageSmall(e)
                         }}sx={{ pl: 4 }}
                        >
                         Page {anchorElPageSmall?<ExpandMore/>:<ExpandLess/>}
                          </ListItemButton>
                          <List style={{display:anchorElPageSmall?"":"none"}}>
                            <ListItemButton key="page" 
                              onClick={(e)=>{
                                ClickWriteAStory()
                              }
                              }
                                sx={{ pl: 6 }}
                            >
                              <CreateIcon/>
                            </ListItemButton>
                            <ListItemButton key={`image`} 
                              onClick={(e)=>{
                                dispatch(setPageInView({page:null}))
                              handleClose()
                              dispatch(setHtmlContent(""))
                              navigate(Paths.editor.image())}}
                              sx={{ pl: 6 }}
                            >
                              <ImageIcon/>
                            </ListItemButton>
                            <ListItemButton     
                    sx={{ pl: 6 }} 
                    onClick={()=>{
                      dispatch(setPageInView({page:null}))
                      handleClose()
                      navigate(Paths.editor.link())}}>
                     <LinkIcon/>
                    </ListItemButton>
                          </List>
                          <ListItemButton  key="Collection" 
                                    onClick={()=>{ 
                                     handleClose()
                                     setOpenDialog(true)
                                     
                                      }} 
                                    sx={{ pl: 4 }}>
                            <ListItemText primary="Collection" />
                        </ListItemButton>
               
                             </List>
                            
                             </div>):(<div></div>)
                        }else if(page == PageName.login){
                  return currentProfile?(<div></div>):
                (<MenuItem onClick={()=>handleCloseNavMenu(page) } 
                            key={page} >
                        <Typography textAlign="center">{page}</Typography>
                      </MenuItem>)

                    }else if(page==PageName.search){
                      return (<MenuItem onClick={()=>openDialogAction()} 
                                key={page} >
                            <Typography textAlign="center">{page}</Typography>
                          </MenuItem>)
    
                        }else{
                      return(<MenuItem onClick={()=>handleCloseNavMenu(page) } 
                      key={page} >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>)
                    }
            })
          }
              </Menu>
            </Box>
            
            <Typography
              variant="h5"
              noWrap
              component="a"
              onClick={()=>navigate("/discovery")}
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
                onClick={(e)=>debounce(handleClick(e),1)
                }>

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
                      ref={pageRef}
            
              
                onClick={(e)=>{
                
                  debounce(
                   handleOpenElPage(e),5)
                }}>
                    Page {Boolean(anchorElPage)?<ExpandLess/>:<ExpandMore/>}
                    </MenuItem>
                    <List  
         
                    style={{display:Boolean(anchorEl)&&Boolean(anchorElPage)?"":"none" }}
                    // open={Boolean(anchorEl)&&Boolean(anchorElPage)}
                    onClose={handleClosePage}>
                      <ListItemButton 
                      sx={{ pl: 4}}
                      onClick={()=>{
                        handleClose()
                        ClickWriteAStory()
                        }}>
                      <CreateIcon/>
                    </ListItemButton>
               
                    <ListItemButton     
                    sx={{ pl: 4 }} 
                    onClick={()=>{
                      handleClose()
                      navigate(Paths.editor.image())}}>
                     <ImageIcon/>
                    </ListItemButton>
                    <ListItemButton     
                    sx={{ pl: 4 }} 
                    onClick={()=>{
                
                      handleClose()
                      navigate("/page/link")}}>
                     <LinkIcon/>
                    </ListItemButton>
                    </List>

                  
                  
                     <MenuItem onClick={()=>{
                        handleClose()
                        setOpenDialog(true)
                    }}>
                       Collection
                    </MenuItem> 
                  </Menu>
                  </div>
                  )
                  // 
           
                  :(<div></div>) 
                }else if(page==PageName.workshop){
                  return( currentProfile?<Button
                    key={page}
                    onClick={()=>navigate(Paths.workshop.reader())}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page}
                  </Button>:null)
                }else if(page ==PageName.search){
                  return(<Button
                    key={page}
                    onClick={()=>openDialogAction()}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page}
                  </Button>)
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
                  <Avatar alt={`${currentProfile.username}`} src={selectedImage} />
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
      <Dialog 
      fullScreen={isPhone}
      
      className={
                "bg-emerald-400 bg-opacity-30 "
              }
              PaperProps={{
                style: {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                 overflow:"hidden",
                 height:"100%",
                 width:"100%",
                
                },
              }}
            
              open={openDialog}
              onClose={()=>setOpenDialog(false)}>
                <CreateCollectionForm onClose={()=>{
                  setOpenDialog(false)
                }}/>
              </Dialog>
    
      </div>
    );
}

export default NavbarContainer

