import React ,{ useContext, useEffect, useLayoutEffect,useState } from 'react'
import { useDispatch} from 'react-redux'
import '../App.css'
import "../styles/Navbar.css"
import {signOutAction} from "../actions/UserActions"
import { useLocation, useNavigate } from 'react-router-dom'
import menu from "../images/icons/menu.svg"
import getDownloadPicture from '../domain/usecases/getDownloadPicture'
import { debounce } from 'lodash'
import LinkIcon from '@mui/icons-material/Link';
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';
import Paths from '../core/paths'
import { searchDialogToggle } from '../actions/UserActions'
import { createStory } from '../actions/StoryActions'
import checkResult from '../core/checkResult'
import Dialog from '@mui/material/Dialog';

import CreateCollectionForm from '../components/collection/CreateCollectionForm'
import { setEditingPage, setHtmlContent, setPageInView } from '../actions/PageActions.jsx'
import { useMediaQuery } from 'react-responsive'
import isValidUrl from '../core/isValidUrl'
import Enviroment from '../core/Enviroment'
import Context from '../context.jsx'
import { initGA, sendGAEvent } from '../core/ga4.js'
import { IonImg } from '@ionic/react'
const PageName = {
  home: "Home",
  about:"About",
  create: "Create",
  discovery:"Discovery",
  login:"Log In",
  search:"Search",
  workshop:"Workshop",
  apply:"Join Now",
  feedback:"Feedback"
}
const pages = [ 
                PageName.home,
                PageName.about,
                PageName.discovery,
                PageName.workshop,
                PageName.search,
                PageName.create, 
                PageName.login,
                PageName.apply,
                PageName.feedback
                ]
function NavbarContainer(props){
  
  const {isPhone,isHorizPhone}=useContext(Context)
  useLayoutEffect(()=>{
    initGA()
  },[])
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [profilePic,setProfilePic]=useState(Enviroment.blankProfile)
    const {currentProfile}=useContext(Context)
   const pathName = useLocation().pathname


  const [openDialog,setOpenDialog]=useState(false)
    useEffect(()=>{
      if(currentProfile){
          if(isValidUrl(currentProfile.profilePic)){
              setProfilePic(currentProfile.profilePic)
        
          }else{
           getDownloadPicture(currentProfile.profilePic).then(image=>{
              setProfilePic(image)
           } )
          }}
  },[currentProfile,pathName])

    const openDialogAction = ()=>{
      dispatch(searchDialogToggle({open:true}))
    }
    const handleCloseNavMenu = (page) => {
      sendGAEvent("Click Nav Menu",`Click Horiz Nav ${page}`)
    
      if(page==PageName.login){
          navigate(Paths.login())                    
      }else if(page===PageName.discovery){
          navigate(Paths.discovery())
      }else if(page===PageName.about){
        navigate(Paths.about())
      }else if(page==PageName.workshop){
        dispatch(setPageInView({page:null}))
        navigate(Paths.workshop.reader())
      }else if(page==PageName.home){
        navigate(Paths.home())
      }else if(page==PageName.apply){
        navigate(Paths.apply())
      }else if(page==PageName.feedback){
        navigate(Paths.feedback())
      }

    }  
 
    const [openCreate,setOpenCreate] = useState(false)

  
 
    
    const SettingName = {
        profile: "Profile",
        account: "Account",
        logout: "Log Out",
        notifications:"Notifications"
    }
    const settings = [SettingName.profile,
                      SettingName.account,
                      SettingName.notifications,
                      SettingName.logout,
                      ]; 
   

      const menuDropdown=()=>{
        return(
        <div className={`dropdown ${isPhone?"dropdown-top":""} lg:hidden`}>
          <div tabIndex={0} onTouchEnd={()=>{
            sendGAEvent("Click Nav Menu","Click Mobile Nav Menu",null,null,false)
          }}role="button" className="btn btn-ghost ">
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
    }else if(page==PageName.about||page==PageName.login||page==PageName.apply){
      return !currentProfile?<li onClick={()=>handleCloseNavMenu(page) } 
      key={page} >
    <a  className=' text-emerald-800 no-underline' textAlign="center">{page}</a>
    </li>:null
    }else if( page==PageName.create){
    
        return(currentProfile?  
            <li  
         
         className="z-[2]  w-52">
        
         <a      tabIndex={1} role="button" className=' text-emerald-800 text-center no-underline'  tabndex="0">Create</a>
           <ul      tabIndex={1} className="p-2 menu menu-sm rounded-box  ">
             <li onClick={ClickWriteAStory}><a  >  <CreateIcon className='text-emerald-800'/></a></li>
             <li    onClick={(e)=>{
            dispatch(setPageInView({page:null}))
            dispatch(setEditingPage({page:null}))
     
          dispatch(setHtmlContent(""))
          navigate(Paths.editor.image())}}><a>     <ImageIcon className='text-emerald-800'/></a></li>
             <li><a    onClick={()=>{
    dispatch(setPageInView({page:null}))
    dispatch(setEditingPage({page:null}))

    dispatch(setHtmlContent(""))
    navigate(Paths.editor.link())}}>
    <LinkIcon className='text-emerald-800'/></a></li>
           <li  onClick={()=>{ 
             
                 setOpenDialog(true)
                 
         } }><a className='text-emerald-800'>Collection</a></li></ul></li>:null)
    
    }else if(page == PageName.login){
    return !currentProfile?
    (<li onClick={()=>handleCloseNavMenu(page) } 
        key={page} >
    <a className=' text-emerald-800 no-underline' textAlign="center">{page}</a>
    </li>):null
    
    }else if(page == PageName.apply){
      return currentProfile?
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
      
    
    
     )
      }

    const ClickWriteAStory = debounce(()=>{
      sendGAEvent("Create","Create Button Click Nav","Click Nav Create")
        
        dispatch(createStory({profileId:currentProfile.id,privacy:true,type:"html",
        title:"",commentable:true
      })).then(res=>checkResult(res,data=>{
      
          dispatch(setPageInView({page:data.story}))
          dispatch(setEditingPage({page:data.story}))
          navigate(Paths.editPage.createRoute(data.story.id))
      },e=>{

      }))},10)
          
    
      const menuHoriz=()=>{
        return<div className={` h-[100%] `}>
        <ul className="menu menu-horizontal px-1">
        {pages.map((page) => {
    if(page==PageName.workshop||page==PageName.home){
      return currentProfile?<li   onClick={()=>handleCloseNavMenu(page) } 
      key={page} >
    <a  className=' text-white no-underline' textAlign="center">{page}</a>
    </li>:null
    }else if(page==PageName.about||page==PageName.login||page==PageName.apply){
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
    
          dispatch(setHtmlContent(""))
          navigate(Paths.editor.image())}}><a className='mx-auto'>     <ImageIcon className='text-emerald-800'/></a></li>
             <li><a    onClick={()=>{
    dispatch(setPageInView({page:null}))
    dispatch(setEditingPage({page:null}))

    dispatch(setHtmlContent(""))
    navigate(Paths.editor.link())}} className='mx-auto'>
    <LinkIcon className='text-emerald-800'/></a></li>
           <li  onClick={()=>{ 

                 setOpenDialog(true)
                 
         } }><a className='text-emerald-800 mx-auto'>Collection</a></li></ul></li>:null)
    
    }else if(page == PageName.login){
    return !currentProfile?
    (<li onClick={()=>handleCloseNavMenu(page) } 
        key={page} >
    <a className=' text-white no-underline' textAlign="center">{page}</a>
    </li>):null
    
    }else if(page == PageName.apply){
      return currentProfile?
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
      }
  // }
  return(<div className="navbar max-w-[100vw] bg-emerald-800">
     <div className='navbar-start '>
    {isPhone?menuDropdown():
    <a  onClick={()=>navigate("/")}className="btn btn-ghost text-white lora-bold text-xl">{"Plumbum"}</a>}
  </div>
  <div className='navbar-center'>
      {!isPhone?menuHoriz():  <a  onClick={()=>navigate("/")}className="btn btn-ghost text-white lora-bold text-xl">Pb</a>}
  </div>

 
  <div className="navbar-end">
  {currentProfile&&localStorage.getItem("token")? 
  <div className={`dropdown ${isPhone?"dropdown-top":"dropdown-bottom"} dropdown-end`}>
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-5 rounded-full">
        <div  className="overflow-hidden rounded-full max-w-8  max-h-8 ">
    <IonImg className="object-fit  " src={profilePic}/></div>
    
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
                                      dispatch(signOutAction()).then(res=>checkResult(res,payload=>{
                                        localStorage.clear()
                                        navigate("/")
                                      },err=>{
                                        
                                      }))
                                  }else if(setting== SettingName.account){
                                      navigate("/profile/edit")
                                  }else if(setting==SettingName.notifications){
                                    navigate(Paths.notifications())
                                  }
                              
                    }}><a className='text-emerald-800'>{setting}</a></li>
                  ))}
                       </ul>

    </div>:<div className=''/>}
    </div>
    
    
    
    
    
  
    <Dialog open={openDialog}>
<CreateCollectionForm  onClose={()=>setOpenDialog(false)}/>
    </Dialog>
</div>)

}

export default NavbarContainer

