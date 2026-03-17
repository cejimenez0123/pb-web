

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


function NavbarContainer({ isDesktop}) {
  const currentProfile = useSelector(state=>state.users.currentProfile)
  return isDesktop
    ? <DesktopNavbar currentProfile={currentProfile} />
    : <MobileNavbar currentProfile={currentProfile} />
}

export default NavbarContainer

function DesktopNavbar({currentProfile}){

return(

<div className="navbar bg-emerald-800">

  <div className="navbar-start">
   <h1 className='text-white text-xl px-4'>Pb</h1>
  </div>

  <div className="navbar-center">
    <MenuHorizontal pages={pages} currentProfile={currentProfile}/>
  </div>

  <div className="navbar-end">
   {currentProfile&& <NavProfileDropdown currentProfile={currentProfile}/>}
  </div>

</div>

)

}

function MobileNavbar({currentProfile}){

       
return(

<div className="navbar fixed bottom-0 w-full flex-row flex justify-around bg-soft">
  {currentProfile && <HomeButton/>}
  <DiscoveryButton/>

  {currentProfile
    ? <SearchButton/>
    : <AboutButton/>
  }

  {currentProfile && <CreateButton/>}

  {currentProfile && <WorkshopButton/>}

  {currentProfile?<ProfileButton currentProfile={currentProfile}/>:<SearchButton/>}

</div>

)

}
function NavProfileDropdown({currentProfile}){
 const [profilePic,setProfilePic]=useState(Enviroment.blankProfile)
  const dispatch = useDispatch()
  

    const router =useIonRouter()

    useEffect(()=>{
      if(currentProfile){
          if(isValidUrl(currentProfile.profilePic)){
              setProfilePic(currentProfile.profilePic)
        
          }else{
           setProfilePic(Enviroment.imageProxy(currentProfile.profilePic))
         
          }
        }else{
          setProfilePic(null)
        }
  },[currentProfile])

return(
<div className="dropdown dropdown-end">
  <button className="btn btn-circle overflow-hidden avatar">
    <img 
      src={profilePic} 
      className="object-cover w-full h-full relative" 
    />
  </button>

  <ul className="dropdown-content menu bg-cream p-2 shadow rounded">
    <li>
      <button 
        className="w-full text-left" 
        onClick={() => router.push(Paths.myProfile, "forward")}
      >
        Profile
      </button>
    </li>
    <li>
      <button 
        className="w-full text-left" 
        onClick={() => router.push(Paths.notifications(), "forward")}
      >
        Notifications
      </button>
    </li>
    <li>
      <button 
        className="w-full text-left" 
        onClick={() => dispatch(signOutAction({ profile: currentProfile }))}
      >
        Logout
      </button>
    </li>
  </ul>
</div>
)

}
function DiscoveryButton(){

const router = useIonRouter()

return (
  <div className="flex flex-col">
    <IonImg
      src={library}
      style={{width:"3em",height:"3em",filter:"invert(100%)"}}
      onClick={()=>router.push(Paths.discovery)}
    />
    <h6 className="text-white text-xs">Discovery</h6>
  </div>
)

}


function SearchButton(){

const router = useIonRouter()

return (
  <div className="flex flex-col">
    <IonImg
      src={search}
      style={{width:"3em",height:"3em",filter:"invert(100%)"}}
      onClick={()=>router.push("/search")}
    />
    <h6 className="text-white text-xs">Search</h6>
  </div>
)

}



function AboutButton(){

const router = useIonRouter()

return (
  <div
    onClick={()=>router.push(Paths.about())}
    className="flex flex-col"
  >
    <IonImg
      src={home}
      style={{width:"3em",height:"3em"}}
    />
    <h6 className="text-white text-xs">About</h6>
  </div>
)

}

function HomeButton(){

const router = useIonRouter()

return (
  <div
    onClick={()=>router.push(Paths.home)}
    className="flex flex-col"
  >
    <IonImg
      src={home}
      style={{width:"3em",height:"3em"}}
    />
    <h6 className="text-white text-xs">Home</h6>
  </div>
)

}
function WorkshopButton(){

const router = useIonRouter()
const dispatch = useDispatch()

return (
  <div className="flex flex-col">
    <IonImg
      src={hammer}
      style={{width:"3em",height:"3em",filter:"invert(100%)"}}
      onClick={()=>{
        dispatch(setPageInView({page:null}))
        router.push(Paths.workshop.reader())
      }}
    />
    <h6 className="text-white text-xs">Workshop</h6>
  </div>
)

}



function ProfileButton({currentProfile}){

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

return (
  <div
    onClick={()=>currentProfile
      ? router.push(Paths.myProfile)
      : router.push(Paths.login())
    }
    className="flex rounded-full max-h-8 flex-col"
  >
    <div className="btn btn-ghost btn-circle avatar">
      <div className="overflow-hidden max-h-10 rounded-full">
        <IonImg
          className="object-fit max-h-10"
          src={profilePic}
        />
      </div>
    </div>
  </div>
)

}

function NavCreateDropdown({

  
}) {
const {resetDialog,openDialog,dialog}=useDialog()
const dispatch = useDispatch()
const router = useIonRouter()
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
const menuItems = [
  {
    label:"Story",
    icon:CreateIcon,
    action:ClickWriteAStory
  },
  {
    label:"Pictures",
    icon:ImageIcon,
    action:()=>{
      dispatch(setHtmlContent({html:""}))
      dispatch(setEditingPage({page:null}))
      router.push(Paths.editor.image)
    }
  },
  {
    label:"Link",
    icon:LinkIcon,
    action:()=>{
      dispatch(setHtmlContent({html:""}))
      dispatch(setEditingPage({page:null}))
      router.push(Paths.editor.link)
    }
  },
  {
    label:"Collection",
    action:()=>{
      openDialog({
        text:<CreateCollectionForm onClose={resetDialog}/>,
        disagreeText:"Close",
        breakpoint:1
      })
    }
  }
]

return(

<li className="dropdown dropdown-bottom">

<a role="button" className="text-white no-underline">
Create
</a>

<ul className="dropdown-content bg-cream menu rounded-box w-52 p-2 shadow">

{menuItems.map(item=>(
<li key={item.label} onClick={item.action}>

<a className="flex gap-2 items-center justify-center text-soft">

{item.icon && (
<IonImg
src={item.icon}
style={{width:"1.4rem",height:"1.4rem"}}
/>
)}

{item.label}

</a>

</li>
))}

</ul>

</li>

)

}

function MenuHorizontal({ pages, currentProfile }) {
  const router = useIonRouter()
  const dispatch = useDispatch()
  const { openDialog, resetDialog } = useDialog()

  const handleCloseNavMenu = (page) => {
    switch (page) {
      case "About": router.push(Paths.about()); break
      case "Discovery": router.push(Paths.discovery); break
      case "Search": router.push("/search"); break
      case "Workshop": 
        dispatch(setPageInView({ page: null }))
        router.push(Paths.workshop.reader()); break
      case "Log In": router.push(Paths.login()); break
      case "Join Now": router.push(Paths.apply()); break
      case "Feedback": router.push(Paths.feedback()); break
    }
  }

  return (
    <ul className="menu menu-horizontal px-1">
      {pages.map(page => {
        if (page === "Create" && currentProfile) {
          return <NavCreateDropdown
            key="create"
            router={router}
            openDialog={openDialog}
            resetDialog={resetDialog}
          />
        }

        if (page === "Workshop" && !currentProfile) return null
        if (page === "Log In" && currentProfile) return null
        if (page === "Join Now" && !currentProfile) return null

        return (
          <li key={page} onClick={() => handleCloseNavMenu(page)}>
            <a className="text-white no-underline">{page}</a>
          </li>
        )
      })}
    </ul>
  )
}



function CreateButton(){

const router = useIonRouter()
const dispatch = useDispatch()

return (
  <div className="flex flex-col">
    <IonImg
      src={addCircle}
      style={{width:"3em",height:"3em",filter:"invert(100%)"}}
      onClick={()=>{
        dispatch(setHtmlContent({html:""}))
        dispatch(setEditingPage({page:null}))
        router.push(Paths.editor.story)
      }}
    />
    <h6 className="text-white text-xs">Create</h6>
  </div>
)

}

