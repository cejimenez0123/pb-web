

import { useContext, useEffect, useLayoutEffect,useState } from 'react'
import { useDispatch} from 'react-redux'
import '../App.css'
import "../styles/Navbar.css"
import addCircle from "../images/icons/plus.app.svg"
import {signOutAction} from "../actions/UserActions"

import { Preferences } from "@capacitor/preferences";
import home from "../images/icons/home.svg"
import menu from "../images/icons/menu.svg"
import library from "../images/icons/book.svg"
import search from "../images/icons/magnifyingglass.svg"
import { debounce, filter } from 'lodash'
import hammer from "../images/icons/hammer.svg"
import LinkIcon from '../images/icons/link.svg';
import CreateIcon from '../images/icons/ink_pen.svg'
import ImageIcon from '../images/icons/image.svg'
import Paths from '../core/paths'
import { createStory } from '../actions/StoryActions'
import checkResult from '../core/checkResult'
import CreateCollectionForm from '../components/collection/CreateCollectionForm'
import { setEditingPage, setHtmlContent, setPageInView } from '../actions/PageActions.jsx'
import isValidUrl from '../core/isValidUrl'
import Enviroment from '../core/Enviroment'
import Context from '../context.jsx'
import { initGA, sendGAEvent } from '../core/ga4.js'
import {IonImg, IonList, IonText, useIonRouter,} from '@ionic/react';
import { useSelector } from 'react-redux'
import { Capacitor } from '@capacitor/core'
import { PageType } from '../core/constants.js'
import { useMediaQuery } from 'react-responsive'
import { useDialog } from '../domain/usecases/useDialog.jsx'
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
  const {isPhone,isNotPhone,setError,setSuccess}=useContext(Context)
  // const dialog =useSelector(state=>state.users.dialog)
const {dialog,openDialog,closeDialog,resetDialog}=useDialog()
  useLayoutEffect(()=>{
    initGA()
  },[])
    const isTablet =  useMediaQuery({
    query: '(max-width: 1100px)'
  }) 
  const hidePaths = [Paths.signup,Paths.onboard,Paths.about() ];
  
  const showNav= !hidePaths.some(path => location.pathname ? location.pathname.includes(path) : location.includes(path))
  
  const isClip = import.meta.env.MODE=="clip"
  const pages = isClip?[...[ 
                PageName.about,
                PageName.discovery,
                PageName.workshop,
                PageName.search,
                PageName.create, 
    
                ]]:[...[ 
                PageName.about,
                
                PageName.discovery,
                PageName.workshop,
                PageName.search,
                PageName.create, 
                PageName.login,
                PageName.apply,
                PageName.feedback
                ]]
    const dispatch = useDispatch()
const router = useIonRouter()
    const [profilePic,setProfilePic]=useState(Enviroment.blankProfile)

  



    useEffect(()=>{
      if(currentProfile){
          if(isValidUrl(currentProfile.profilePic)){
              setProfilePic(currentProfile.profilePic)
        
          }else{
           setProfilePic(Enviroment.imageProxy(currentProfile.profilePic))
         
          }
        }
  },[currentProfile])

const open=()=>{
 
  let dia = {...dialog}
  dia.title = null
  dia.isOpen = true
  dia.onClose= ()=>{
    closeDialog()
  }
  dia.disagreeText="Close"
  dia.disagree=()=>{
    closeDialog()
  }
  dia.scrollY=false
  dia.agree = null
  dia.agreeText=null
  dia.text=<CreateCollectionForm onClose={()=>{
resetDialog()
  }}/>
 openDialog(dia)
}
    const openDialogAction = ()=>{
      router.push("/search")
    }
    const handleCloseNavMenu = (page) => {
 sendGAEvent({
    category: "navigation",
    action: "click_nav_menu",
    label: page, 
  });
   
      if(page==PageName.login){
          router.push(Paths.login())                    
      }else if(page===PageName.discovery){
          router.push(Paths.discovery)
      }else if(page===PageName.about){
        router.push(Paths.about())
      }else if(page==PageName.workshop){
        dispatch(setPageInView({page:null}))
      router.push(Paths.workshop.reader())
      }else if(page==PageName.apply){
       router.push(Paths.onboard)
      }else if(page==PageName.feedback){
       router.push(Paths.feedback())
      }else{
          router.push(Paths.discovery)
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
             <li tabIndex={page}  onClick={ClickWriteAStory}><a  >Story</a></li>
             <li  tabIndex={page}    onClick={(e)=>{
          dispatch(setHtmlContent({html:""}))
            dispatch(setEditingPage({page:null}))
          router.push(Paths.editor.image)}}><a>     
            Pictures</a></li>
             <li tabIndex={page} ><a    onClick={()=>{
              dispatch(setHtmlContent({html:""}))
                dispatch(setEditingPage({page:null}))
    router.push(Paths.editor.link)}}
    >
    Link</a></li>
           <li  tabIndex={page}  onClick={()=>{ 
             
               openDialog({
                 // title: "Create Collection",
                 text: <CreateCollectionForm onClose={resetDialog} />,
                 disagreeText: "Close", // optional button
                 // onClose: closeDialog,
                 breakpoint: 1, // if you want a half-sheet style
               });
                 
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
          router.push(Paths.editPage.createRoute(data.story.id))
      },e=>{
        setError(e.message)
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
              
               <IonImg src={CreateIcon}/>Story</a></li>
             <li   tabIndex={2}   onClick={(e)=>{
            
    dispatch(setHtmlContent({html:""}))
           dispatch(setEditingPage({page:null}))
          router.push(Paths.editor.image)}}><a className='mx-auto'>     <IonImg src={ImageIcon} style={{width:"1.5rem",height:"1.5rem"}}/>Pictures</a></li>
             <li tabIndex={3} ><a    onClick={()=>{
                dispatch(setHtmlContent({html:""}))
                dispatch(setEditingPage({page:null}))
    router.push(Paths.editor.link)}} className='mx-auto'>
   <IonImg src={LinkIcon}/>Link</a></li>
           <li tabIndex={4}  onClick={()=>{ 

openDialog()

         } }><a onClick={()=>{ 

openDialog({
  // title: "Create Collection",
  text: <CreateCollectionForm onClose={resetDialog} />,
  disagreeText: "Close", // optional button
  // onClose: closeDialog,
  breakpoint: 1, // if you want a half-sheet style
});
                 
         } } className='text-emerald-800 mx-auto'>Collection</a></li></ul></li>:null)

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
                           
                             router.push(Paths.myProfile)
                              break;
                          case SettingName.logout:
                            handleSignOut()
                              break;
              
                          case SettingName.notifications:
                            router.push(Paths.notifications())
                            break;
                          default:
                              break;
                         }  }
             
  const handleSignOut =async () => {
 
    await Preferences.clear()
   router.push(Paths.login())
    dispatch(signOutAction())
  
   
};
let isNative = Capacitor.isNativePlatform()

if(!showNav) return null
return !isNotPhone||isNative||isTablet&&home?(<div className='fixed h-[4rem] top-0 w-[100vw] shadow-lg z-50'><div className="navbar flex items-start  justify-between px-4 sm:px-20 max-w-[100%] h-54 bg-soft">

   <div className='flex flex-col'>
   <IonImg src={library} style={{width:"3em",height:"3em",filter:"invert(100%)"}}
    onClick={()=>{router.push(Paths.discovery)}}/>
      <h6 className='text-white text-xs'>Discovery</h6>
    </div>
   {!currentProfile ?<div  onClick={()=>handleCloseNavMenu(PageName.about)} className='flex flex-col'>
    <IonImg style={{width:"3em",height:"3em"}} 
      src={home} /><h6 className='text-white text-xs'>About</h6></div>:
   <div className='flex flex-col'>
    <IonImg src={search} style={{width:"3em",height:"3em",filter:"invert(100%)"}}
    
    onClick={()=>router.push("/search")}/>
      <h6 className='text-white text-xs'>Search</h6>
    </div>}
    {currentProfile &&
     <div className="dropdown dropdown-top ">
  <div tabIndex={0} role="button"><div><IonImg src={addCircle}  style={{width:"3em",height:"3em",filter:"invert(100%)"} } /> <h6 className='text-white text-xs'>Create</h6></div>
</div>
  <ul tabIndex="-1" className="dropdown-content  menu text-center bg-cream rounded-box z-1 w-52 p-2 -translate-x-1/2 left-1/2  shadow-sm">
                 <li     onClick={(e)=>{
            
          dispatch(setHtmlContent({html:""}))
          dispatch(setEditingPage({page:null}))
          router.push(Paths.editor.image)}}><a className='mx-auto text-soft'> Picture</a></li>
   <li onClick={ClickWriteAStory}><a className='mx-auto text-soft' > Story </a></li>
    <li><a className='mx-auto text-soft' onClick={()=>{
              dispatch(setHtmlContent({html:""}))
                dispatch(setEditingPage({page:null}))
 router.push(Paths.editor.link)}}
    >
  Link</a></li>
    <li onClick={()=>{openDialog({
      // title: "Create Collection",
      text: <CreateCollectionForm onClose={resetDialog} />,
      disagreeText: "Close", // optional button
      // onClose: closeDialog,
      breakpoint: 1, // if you want a half-sheet style
    });}}className='text-soft'><a className='text-soft'>Collection</a></li>
  </ul>
</div>}
{currentProfile && <div className='flex flex-col'>
  <IonImg src={hammer} style={{width:"3em",height:"3em",filter:"invert(100%)"}} onClick={()=>{
         dispatch(setPageInView({page:null}))
       router.push(Paths.workshop.reader())
  }}/>
  <h6 className='text-white text-xs'>Workshop</h6>
  </div>}
     {currentProfile? <div onClick={()=>currentProfile?router.push(Paths.myProfile):router.push(Paths.login())} className={`flex rounded-full max-h-8 flex-col`}>
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        {/* <div className="w-4"> */}
    <div  className="overflow-hidden max-h-10 rounded-full ">
    <IonImg className="object-fit max-h-10 "  src={profilePic}/></div>

        </div> 
       


      </div>   : <div className='flex flex-col'>
    <IonImg src={search} style={{width:"3em",height:"3em",filter:"invert(100%)"}}
    
    onClick={()=>router.push("/search")}/>
      <h6 className='text-white text-xs'>Search</h6>
    </div>}
 </div></div>):(<div className="navbar flex items-start  max-w-[100vw] px-4 h-54 bg-emerald-800">
     <div className='navbar-start '>
    {isNative?menuDropdown():
    <a  onClick={()=>currentProfile?router.push(Paths.calendar()):router.push("/")}className="btn btn-ghost text-white lora-bold text-xl">{"Plumbum"}</a>}
  </div>
  <div className='navbar-center'>
      {!isNative?menuHoriz():  <a  onClick={()=>currentProfile?router.push(Paths.calendar()):router.push("/")}className="btn btn-ghost text-white lora-bold text-xl">Pb</a>}
  </div>

 
  <div className="navbar-end">
  {(currentProfile&&currentProfile.id)? 
  <div className={`dropdown ${isTablet?"dropdown-top":"dropdown-bottom"} dropdown-end`}>
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-5 rounded-full">
        <div  className="overflow-hidden rounded-full max-w-8  max-h-8 ">
    <IonImg  onClick={()=>currentProfile?router.push(Paths.myProfile):router.push(Paths.login())} className="object-fit sm:w-12 sm:h-12 " src={profilePic}/></div>
    
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
