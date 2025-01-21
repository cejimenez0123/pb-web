import React ,{ useEffect, useLayoutEffect,useState } from 'react'
import { useSelector,useDispatch} from 'react-redux'
import '../App.css'
import "../styles/Navbar.css"
import {signOutAction} from "../actions/UserActions"
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import menu from "../images/icons/menu.svg"
import getDownloadPicture from '../domain/usecases/getDownloadPicture'
import { debounce } from 'lodash'
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
import { setEditingPage, setHtmlContent, setPageInView } from '../actions/PageActions'
import { useMediaQuery } from 'react-responsive'
import ProfileCircle from '../components/profile/ProfileCircle'
import Collection from '../domain/models/collection'
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
  PageName.home,
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
      if(page==PageName.login){
          navigate(Paths.login())                    
      }else if(page===PageName.discovery){
          navigate(Paths.discovery())
      }else if(page===PageName.about){
        navigate(Paths.about())
      }else if(page==PageName.workshop){
        navigate(Paths.workshop.reader())
      }else if(page==PageName.home){
        navigate(Paths.home())
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
    const handleOpenElPage = debounce((e) => {
      if(anchorElPage) {
        setAnchorElPage(null)
      }else{
        setAnchorElPage(e.target);
      }
    },10)
    const ClickWriteAStory = debounce(()=>{
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
          handleClose()
          dispatch(setPageInView({page:data.story}))
          dispatch(setEditingPage({page:data.story}))
          navigate(Paths.editPage.createRoute(data.story.id))
      },e=>{

      }))},10)
          
    
      
  // }
  return(<div className="navbar bg-emerald-800">
  <div className="navbar-start">
    <div className="dropdown lg:hidden">
      <div tabIndex={0} role="button" className="btn btn-ghost ">
        <img src={menu}/>

      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-emerald-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          {pages.map((page) => {
if(page==PageName.workshop||page==PageName.home){
  return currentProfile?<li   onClick={()=>handleCloseNavMenu(page) } 
  key={page} >
<a  className=' text-emerald-800 no-underline' textAlign="center">{page}</a>
</li>:null
}else if(page==PageName.about||page==PageName.login){
  return !currentProfile?<li onClick={()=>handleCloseNavMenu(page) } 
  key={page} >
<a  className=' text-emerald-800 no-underline' textAlign="center">{page}</a>
</li>:null
}else if( page==PageName.create){

    return(currentProfile?  
        <li  
     
     className="z-[2]  w-52">
    
     <a      tabIndex={1} role="button" className=' text-emerald-800 text-center no-underline' tabindex="0">Create</a>
       <ul      tabIndex={1} className="p-2 menu menu-sm rounded-box  ">
         <li onClick={ClickWriteAStory}><a  >  <CreateIcon className='text-emerald-800'/></a></li>
         <li    onClick={(e)=>{
        dispatch(setPageInView({page:null}))
        dispatch(setEditingPage({page:null}))
      handleClose()
      dispatch(setHtmlContent(""))
      navigate(Paths.editor.image())}}><a>     <ImageIcon className='text-emerald-800'/></a></li>
         <li><a    onClick={()=>{
dispatch(setPageInView({page:null}))
dispatch(setEditingPage({page:null}))
handleClose()
dispatch(setHtmlContent(""))
navigate(Paths.editor.link())}}>
<LinkIcon className='text-emerald-800'/></a></li>
       <li  onClick={()=>{ 
             handleClose()
             setOpenDialog(true)
             
     } }><a className='text-emerald-800'>Collection</a></li></ul></li>:null)

}else if(page == PageName.login){
return currentProfile?(<div></div>):
(<li onClick={()=>handleCloseNavMenu(page) } 
    key={page} >
<a className=' text-emerald-800 no-underline' textAlign="center">{page}</a>
</li>)

}else if(page==PageName.search){
return (<li onClick={()=>openDialogAction()} 
        key={page} >
    <a className=' text-emerald-800 no-underline' textAlign="center">{page}</a>
  </li>)

}else{
return(  <li onClick={()=>handleCloseNavMenu(page) } >
<a   className=' text-emerald-800 no-underline' key={page} >
{page}</a></li>

)
}
          })
        }
      
      </ul>
    </div>
    <a  onClick={()=>navigate("/")}className="btn btn-ghost text-xl">Pb</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
    {pages.map((page) => {
if(page==PageName.workshop||page==PageName.home){
  return currentProfile?<li   onClick={()=>handleCloseNavMenu(page) } 
  key={page} >
<a  className=' text-white no-underline' textAlign="center">{page}</a>
</li>:null
}else if(page==PageName.about||page==PageName.login){
  return !currentProfile?<li onClick={()=>handleCloseNavMenu(page) } 
  key={page} >
<a  className=' text-white no-underline' textAlign="center">{page}</a>
</li>:null
}else if( page==PageName.create){

    return(currentProfile?  
        <li  
     
     className="z-[2] dropdown w-52">
    
     <a      tabIndex={1} role="button" className=' text-white text-center no-underline' tabindex="0">Create</a>
       <ul      tabIndex={1} className="p-2 dropdown-content menu menu-sm rounded-box  ">
         <li onClick={ClickWriteAStory}><a  >  <CreateIcon className='text-emerald-800'/></a></li>
         <li    onClick={(e)=>{
        dispatch(setPageInView({page:null}))
        dispatch(setEditingPage({page:null}))
      handleClose()
      dispatch(setHtmlContent(""))
      navigate(Paths.editor.image())}}><a>     <ImageIcon className='text-emerald-800'/></a></li>
         <li><a    onClick={()=>{
dispatch(setPageInView({page:null}))
dispatch(setEditingPage({page:null}))
handleClose()
dispatch(setHtmlContent(""))
navigate(Paths.editor.link())}}>
<LinkIcon className='text-emerald-800'/></a></li>
       <li  onClick={()=>{ 
             handleClose()
             setOpenDialog(true)
             
     } }><a className='text-emerald-800'>Collection</a></li></ul></li>:null)

}else if(page == PageName.login){
return currentProfile?(<div></div>):
(<li onClick={()=>handleCloseNavMenu(page) } 
    key={page} >
<a className=' text-white no-underline' textAlign="center">{page}</a>
</li>)

}else if(page==PageName.search){
return (<li onClick={()=>openDialogAction()} 
        key={page} >
    <a className=' text-white no-underline' textAlign="center">{page}</a>
  </li>)

}else{
return(  <li onClick={()=>handleCloseNavMenu(page) } >
<a   className=' text-white no-underline' key={page} >
{page}</a></li>

)
}
          })
        }

    </ul>
  </div>
  <div className="navbar-end">
  <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-5 rounded-full">
          {currentProfile?<ProfileCircle profile={currentProfile}/>:null}
    
        </div> 
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-emerald-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
      {settings.map((setting) => (
                    
                    <li key={setting} 
                              onClick={()=>{
                                  if(setting== SettingName.profile){
                                      navigate(Paths.myProfile())
                                  }else if(setting== SettingName.logout){
                                      dispatch(signOutAction())
                                  }else if(setting== SettingName.account){
                                      navigate("/profile/edit")
                                  }
                                  handleCloseUserMenu()
                    }}><a>{setting}</a></li>
                  ))}
                       </ul>

    </div>
    </div>
    <Dialog open={openDialog}>
<CreateCollectionForm  onClose={()=>setOpenDialog(false)}/>
    </Dialog>
</div>)

}

export default NavbarContainer

