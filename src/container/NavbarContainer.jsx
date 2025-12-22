

import { useContext, useEffect, useLayoutEffect,useState } from 'react'
import { useDispatch} from 'react-redux'
import '../App.css'
import "../styles/Navbar.css"
import addCircle from "../images/icons/add_circle.svg"
import {signOutAction,setDialog} from "../actions/UserActions"
import { useLocation, useNavigate } from 'react-router-dom'
import { Preferences } from "@capacitor/preferences";
import menu from "../images/icons/menu.svg"
import library from "../images/icons/library.svg"
import search from "../images/icons/search.svg"
import { debounce } from 'lodash'
import hammer from "../images/icons/hammer.svg"
import LinkIcon from '../images/icons/link.svg';
import CreateIcon from '../images/icons/ink_pen.svg'
import ImageIcon from '../images/icons/image.svg'
import Paths from '../core/paths'
import { searchDialogToggle } from '../actions/UserActions'
import { createStory } from '../actions/StoryActions'
import checkResult from '../core/checkResult'
import CreateCollectionForm from '../components/collection/CreateCollectionForm'
import { setEditingPage, setHtmlContent, setPageInView } from '../actions/PageActions.jsx'
import isValidUrl from '../core/isValidUrl'
import Enviroment from '../core/Enviroment'
import Context from '../context.jsx'
import { initGA, sendGAEvent } from '../core/ga4.js'
import {IonImg, IonList, IonText,} from '@ionic/react';
import { useSelector } from 'react-redux'
import { Capacitor } from '@capacitor/core'
import { PageType } from '../core/constants.js'
import { useMediaQuery } from 'react-responsive'
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


function NavbarContainer(){
const currentProfile=useSelector(state=>state.users.currentProfile)
  const {isPhone}=useContext(Context)
  const dialog =useSelector(state=>state.users.dialog)
  useLayoutEffect(()=>{
    initGA()
  },[])
    const isTablet =  useMediaQuery({
    query: '(max-width: 1100px)'
  }) 
  const isClip = import.meta.env.MODE=="clip"
  const pages = isClip?[...[ 
                PageName.about,
                PageName.discovery,
                PageName.workshop,
                PageName.search,
                PageName.create, 
    
                ]]:[...[ 
                Capacitor.isNativePlatform()||currentProfile? PageName.home:PageName.about,
                
                PageName.discovery,
                PageName.workshop,
                PageName.search,
                PageName.create, 
                PageName.login,
                PageName.apply,
                PageName.feedback
                ]]
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [profilePic,setProfilePic]=useState(Enviroment.blankProfile)

   const pathName = useLocation().pathname



    useEffect(()=>{
      if(currentProfile){
          if(isValidUrl(currentProfile.profilePic)){
              setProfilePic(currentProfile.profilePic)
        
          }else{
           setProfilePic(Enviroment.imageProxy(currentProfile.profilePic))
         
          }
        }
  },[currentProfile])

const openDialog=()=>{
  let dia = {...dialog}
  dia.title = "Create Collection"
  dia.isOpen = true
  dia.onClose= ()=>{
    let dia = {...dialog}
    dia.isOpen = false
    dispatch(setDialog(dia))
  }
  dia.agree = null
  dia.agreeText=null
  dia.text=<CreateCollectionForm onClose={()=>{

    let dia = {...dialog}
    dia.isOpen = false
    dispatch(setDialog(dia))
  }}/>
  dispatch(setDialog(dia))
}
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
  
 
    
    const SettingName = {
        profile: "Profile",
        // account: "Account",
        logout: "Log Out",
        notifications:"Notifications"
    }
    const settings = [SettingName.profile,
                      // SettingName.account,
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
          <IonList
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-cream rounded-box z-[1] mt-3 w-52 p-2 shadow">
              {pages.map((page) => {
    if(page==PageName.workshop||page==PageName.home){
      return currentProfile?<li  tabIndex={page} onClick={()=>handleCloseNavMenu(page) } 
      key={page} >
    <a  className=' text-emerald-800 no-underline' textAlign="center">{page}</a>
    </li>:null
    }else if(page==PageName.about||page==PageName.login||page==PageName.apply){
      return !currentProfile?<li tabIndex={page}  onClick={()=>handleCloseNavMenu(page) } 
      key={page} >
    <a  className=' text-emerald-800 no-underline' textAlign="center">{page}</a>
    </li>:null
    }else if( page==PageName.create){
        return(currentProfile?  
            <li  
        
         tabIndex={page} 
         className="z-[2]  w-52">
        
         <a       onClick={ClickWriteAStory}   tabIndex={1} role="button" className=' text-emerald-800 text-center no-underline'  tabndex="0">Create</a>
           <ul      tabIndex={1} className="p-2 menu menu-sm rounded-box  ">
             <li tabIndex={page}  onClick={ClickWriteAStory}><a  >  <IonImg src={CreateIcon}/></a></li>
             <li  tabIndex={page}    onClick={(e)=>{
          dispatch(setHtmlContent({html:""}))
            dispatch(setEditingPage({page:null}))
          navigate(Paths.editor.image())}}><a>     
            <IonImg src={ImageIcon}/></a></li>
             <li tabIndex={page} ><a    onClick={()=>{
              dispatch(setHtmlContent({html:""}))
                dispatch(setEditingPage({page:null}))
    navigate(Paths.editor.link())}}
    >
    <IonImg src={LinkIcon}/></a></li>
           <li  tabIndex={page}  onClick={()=>{ 
             
                 openDialog()
                 
         } }><a className='text-emerald-800'>Collection</a></li></ul></li>:null)
    
    }else if(page == PageName.login){
    return !currentProfile?
    (<li tabIndex={page}  onClick={()=>handleCloseNavMenu(page) } 
         >
    <a className=' text-emerald-800 no-underline' textAlign="center">{page}</a>
    </li>):null
    
    }else if(page == PageName.apply){
      return currentProfile?
      (<li tabIndex={page} 
        onClick={()=>handleCloseNavMenu(page) } 
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
          
          </IonList>
        </div>
      
    
    
     )
      }

    const ClickWriteAStory = debounce(()=>{
     
      sendGAEvent("Create","Create Button Click Nav","Click Nav Create")
     
        dispatch(createStory({profileId:currentProfile.id,privacy:true,type:PageType.text,
        title:"Unititled",commentable:true
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
      return currentProfile?<li  onClick={()=>handleCloseNavMenu(page) } 
      key={page} >
    <a  className=' text-white no-underline' textAlign="center">{page}</a>
    </li>:null
    }else if(page==PageName.about||page==PageName.login||page==PageName.apply){
      return !currentProfile?<li onClick={()=>handleCloseNavMenu(page) } 
      key={page} >
    <a  className=' text-white no-underline' textAlign="center">{page}</a>
    </li>:null
    }else if( page==PageName.create){
    
        return(currentProfile&&currentProfile.id?  
            <li  
         
         className={`z-[2] dropdown ${isTablet?"dropdown-top":"dropdown-bottom"} w-52`}>
        
         <a      role="button" className=' text-white text-center no-underline' tabindex="0">Create</a>
           <ul     className="p-2 dropdown-content text-center bg-cream menu menu-sm rounded-box  ">
            
             <li tabIndex={1}  onClick={ClickWriteAStory}><a className='mx-auto '  > 
              
               <IonImg src={CreateIcon}/></a></li>
             <li   tabIndex={2}   onClick={(e)=>{
            
    dispatch(setHtmlContent({html:""}))
           dispatch(setEditingPage({page:null}))
          navigate(Paths.editor.image())}}><a className='mx-auto'>     <IonImg src={ImageIcon} /></a></li>
             <li tabIndex={3} ><a    onClick={()=>{
                dispatch(setHtmlContent({html:""}))
                dispatch(setEditingPage({page:null}))
    navigate(Paths.editor.link())}} className='mx-auto'>
   <IonImg src={LinkIcon}/></a></li>
           <li tabIndex={4}  onClick={()=>{ 

openDialog()
                 
         } }><a className='text-emerald-800 mx-auto'>Collection</a></li></ul></li>:null)
    
    }else if(page == PageName.login){
    return !currentProfile?
    (<li onClick={()=>handleCloseNavMenu(page) } 
        key={page} >
    <a className=' text-white no-underline' textAlign="center">{page}</a>
    </li>):null
    
    }else if(page == PageName.apply){
      return currentProfile&&currentProfile.id?
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
      const handleSettingNav=(page)=>{  
    
                         switch(page){
                          case SettingName.profile:
                           
                              navigate(Paths.myProfile)
                              break;
                          case SettingName.logout:
                            handleSignOut()
                              break;
              
                          case SettingName.notifications:
                            navigate(Paths.notifications())
                            break;
                          default:
                              break;
                         }  }
             
  const handleSignOut =async () => {
 
    await Preferences.clear()
    navigate(Paths.login())
    dispatch(signOutAction())
  
   
};
 return isPhone||Capacitor.isNativePlatform()?(<div className="navbar flex items-start  justify-between px-4 max-w-[100vw] h-54 bg-emerald-800">
   <IonImg src={library} style={{width:"3em",height:"3em"}}
    onClick={()=>{navigate(Paths.discovery())}}/>
   
    <IonImg src={search} style={{width:"3em",height:"3em"}}
    onClick={openDialogAction}/>
     <div className="dropdown dropdown-top ">
  <div tabIndex={0} role="button"><IonImg src={addCircle}  style={{width:"3em",height:"3em"} } /></div>

  <ul tabIndex="-1" className="dropdown-content menu text-center bg-base-100 rounded-box z-1 w-52 p-2 -translate-x-1/2 left-1/2  shadow-sm">
                 <li     onClick={(e)=>{
            
    dispatch(setHtmlContent({html:""}))
           dispatch(setEditingPage({page:null}))
          navigate(Paths.editor.image())}}><a className='mx-auto'>     <IonImg src={ImageIcon} /></a></li>
   <li><a className='mx-auto'>   <IonImg src={CreateIcon}/></a></li>
    <li><a className='mx-auto' onClick={()=>{
              dispatch(setHtmlContent({html:""}))
                dispatch(setEditingPage({page:null}))
    navigate(Paths.editor.link())}}
    >
    <IonImg src={LinkIcon}/></a></li>
    <li><a>Collection</a></li>
  </ul>
</div>
    {/* <div className={`dropdown dropdown-top lg:hidden`}>
    <IonImg src={addCircle} onClick={ClickWriteAStory} style={{width:"3em",height:"3em"}}/>
            <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-cream rounded-box z-[1] mt-3 w-52 p-2 shadow">
      {settings.map((setting) => (
                    
                    <li  key={setting} 
                              onClick={()=>{
                          handleSettingNav(setting)
                              
                    }}><a className='text-emerald-800'>{setting}</a></li>
                  ))}
                       </ul>
  </div> */}
  <IonImg src={hammer} style={{width:"3em",height:"3em"}} onClick={()=>{
         dispatch(setPageInView({page:null}))
        navigate(Paths.workshop.reader())
  }}/>
  <div onClick={()=>navigate(Paths.myProfile)} className={`dropdown ${isTablet?"dropdown-top":"dropdown-bottom"} dropdown-end`}>
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-5 rounded-full">
        <div  className="overflow-hidden rounded-full max-w-8  max-h-8 ">
    <IonImg className="object-fit  " src={profilePic}/></div>
    
        </div> 
      </div>
      </div>
 </div>):(<div className="navbar flex items-start  max-w-[100vw] h-54 bg-emerald-800">
     <div className='navbar-start '>
    {isPhone?menuDropdown():
    <a  onClick={()=>currentProfile?navigate(Paths.calendar()):navigate("/")}className="btn btn-ghost text-white lora-bold text-xl">{"Plumbum"}</a>}
  </div>
  <div className='navbar-center'>
      {!isPhone?menuHoriz():  <a  onClick={()=>currentProfile?navigate(Paths.calendar()):navigate("/")}className="btn btn-ghost text-white lora-bold text-xl">Pb</a>}
  </div>

 
  <div className="navbar-end">
  {(currentProfile&&currentProfile.id)? 
  <div className={`dropdown ${isTablet?"dropdown-top":"dropdown-bottom"} dropdown-end`}>
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-5 rounded-full">
        <div  className="overflow-hidden rounded-full max-w-8  max-h-8 ">
    <IonImg className="object-fit  " src={profilePic}/></div>
    
        </div> 
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-cream rounded-box z-[1] mt-3 w-52 p-2 shadow">
      {settings.map((setting) => (
                    
                    <li  key={setting} 
                              onClick={()=>{
                          handleSettingNav(setting)
                              
                    }}><a className='text-emerald-800'>{setting}</a></li>
                  ))}
                       </ul>

    </div>:<div className=''/>}
    </div>

 
</div>)

}

export default NavbarContainer
