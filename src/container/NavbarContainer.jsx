import React ,{ useEffect, useLayoutEffect,useState } from 'react'
import { useSelector,useDispatch} from 'react-redux'
import '../App.css'
import "../styles/Navbar.css"
import {signOutAction} from "../actions/UserActions"
import { useNavigate } from 'react-router-dom'
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
import isValidUrl from '../core/isValidUrl'
import ProfileCircle from '../components/profile/ProfileCircle'
import Collection from '../domain/models/collection'
import Enviroment from '../core/Enviroment'
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
function NavbarContainer({profile}){
  const isPhone =  useMediaQuery({
    query: '(max-width: 600px)'
  })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [profilePic,setProfilePic]=useState(Enviroment.blankProfile)
    const currentProfile= useSelector((state)=>state.users.currentProfile);
    const [anchorElNavCreate,setAnchorElNavCreate] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null);
      const [openDialog,setOpenDialog]=useState(false)
    useEffect(()=>{
      if(currentProfile){
          if(isValidUrl(currentProfile.profilePic)){
              setProfilePic(currentProfile.profilePic)
        
          }else{
           getDownloadPicture(currentProfile.profilePic).then(image=>{
              setProfilePic(image)
           } )
          }}else{
            setProfilePic(Enviroment.blankProfile)
          }
  },[currentProfile])

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

    const handleClose = () => {
        setAnchorEl(null);
    };
 
    
    const SettingName = {
        profile: "Profile",
        account: "Account",
        logout: "Log Out"
    }
    const settings = [SettingName.profile,
                      SettingName.account,
                      SettingName.logout]; 
   



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
return !currentProfile?
(<li onClick={()=>handleCloseNavMenu(page) } 
    key={page} >
<a className=' text-emerald-800 no-underline' textAlign="center">{page}</a>
</li>):null

}else if(page==PageName.search){
return (<li onClick={()=>openDialogAction()} 
        key={page} >
    <a className=' text-emerald-800 no-underline' textAlign="center">{page}</a>
  </li>)

}else{
return(  <li onClick={()=>handleCloseNavMenu(page) } >
<a   className=' text-emerald-800  no-underline' key={page} >
{page}</a></li>

)
} })
        }
      
      </ul>
    </div>
  
  </div>
  <div className='navbar-center lg:navbar-start'>
    <a  onClick={()=>navigate("/")}className="btn btn-ghost text-white lora-bold text-xl">{isPhone?"Pb":"Plumbum"}</a>
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
       <ul      tabIndex={1} className="p-2 dropdown-content text-center bg-emerald-50 menu menu-sm rounded-box  ">
         <li onClick={ClickWriteAStory}><a className='mx-auto '  >  <CreateIcon className='text-emerald-800'/></a></li>
         <li    onClick={(e)=>{
        dispatch(setPageInView({page:null}))
        dispatch(setEditingPage({page:null}))
      handleClose()
      dispatch(setHtmlContent(""))
      navigate(Paths.editor.image())}}><a className='mx-auto'>     <ImageIcon className='text-emerald-800'/></a></li>
         <li><a    onClick={()=>{
dispatch(setPageInView({page:null}))
dispatch(setEditingPage({page:null}))
handleClose()
dispatch(setHtmlContent(""))
navigate(Paths.editor.link())}} className='mx-auto'>
<LinkIcon className='text-emerald-800'/></a></li>
       <li  onClick={()=>{ 
             handleClose()
             setOpenDialog(true)
             
     } }><a className='text-emerald-800 mx-auto'>Collection</a></li></ul></li>:null)

}else if(page == PageName.login){
return !currentProfile?
(<li onClick={()=>handleCloseNavMenu(page) } 
    key={page} >
<a className=' text-white no-underline' textAlign="center">{page}</a>
</li>):null

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
  {currentProfile?<div className="navbar-end">
  <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-5 rounded-full">
          {profilePic!=Enviroment.blankProfile?<div  className="overflow-hidden rounded-full max-w-8  max-h-8 ">
    <img className="object-fit  " src={profilePic}/></div>:null}
    
        </div> 
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-emerald-50 rounded-box z-[1] mt-3 w-52 p-2 shadow">
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
                              
                    }}><a className='text-emerald-800'>{setting}</a></li>
                  ))}
                       </ul>

    </div>
    </div>:null}
    <Dialog open={openDialog}>
<CreateCollectionForm  onClose={()=>setOpenDialog(false)}/>
    </Dialog>
</div>)

}

export default NavbarContainer

