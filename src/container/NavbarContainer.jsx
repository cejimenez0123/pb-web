

import { useContext, useEffect,useRef,useCallback, useLayoutEffect,useState } from 'react'
import { useDispatch} from 'react-redux'
import '../App.css'
import "../styles/Navbar.css"
import person from "../images/icons/person.png"
import addCircle from "../images/icons/plus.app.svg"
import {signOutAction} from "../actions/UserActions"
import calendar from "../images/icons/calendar.svg"
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
import { setEditingPage, setHtmlContent, setPageInView, setPagesInView } from '../actions/PageActions.jsx'
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
import { createCollection } from '../actions/CollectionActions.js'
import submitCollection from '../core/submitCollection'
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

const navItem =
  "flex-1 flex flex-col items-center justify-center bg-soft text-white active:scale-95 transition-transform";
function MobileNavbar({currentProfile}){

   
  return (
    <div className="fixed bottom-0 w-[100%] bg-soft border-t border-white/10">
      <div className="flex flex-row justify-between items-center px-2 py-2 max-w-md mx-auto">
        <HomeButton />
        <EventButton />
        {currentProfile && <CreateButton />}
        {currentProfile && <WorkshopButton />}
        <ProfileButton currentProfile={currentProfile} />
      </div>
    </div>
  );


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
        onClick={() => router.push(Paths.myProfile, "forward","replace")}
      >
        Profile
      </button>
    </li>
    <li>
      <button 
        className="w-full text-left" 
        onClick={() => router.push(Paths.notifications(), "forward","replace")}
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
  <div className="flex flex-col"
     onClick={()=>router.push(Paths.discovery,"forward","replace")}>
    <IonImg
      src={library}
      style={{width:"3em",height:"3em",filter:"invert(100%)"}}
   
    />
    <h6 className="text-white text-xs">Discovery</h6>
  </div>
)

}



function AboutButton(){

const router = useIonRouter()

return (
  <div
    onClick={()=>router.push(Paths.about(),"forward","replace")}
        className={navItem}
  >
    <IonImg
      src={home}
      style={{width:"3em",height:"3em"}}
    />
    <h6 className="text-white text-xs">About</h6>
  </div>
)

}


function EventButton(){

const router = useIonRouter()
const handleClick=()=>{
()=>router.push(Paths.calendar(),"forward")
}
return (
  <button onClick={handleClick} className={navItem}>
      <IonImg src={calendar} className="max-w-6 max-h-6 mb-1 invert " />
      <span className="text-[11px]">Studio</span>
    </button>
 
)

}



// function HomeButton() {
//   const router = useIonRouter();
//   const currentProfile = useSelector((state) => state.users.currentProfile);

//   // Memoized handler prevents re-creation every render
//   const handleClick = useCallback(() => {
//     if (currentProfile) {
//       router.push(Paths.home, "forward"); // no replace
//     } else {
//       router.push(Paths.about(), "forward");
//     }
//   }, [currentProfile, router]);

//   return (
//     <button onClick={handleClick}  className={navItem}>
//     <IonImg
//       src={home}
//       style={{width:"3em",height:"3em",backgroundColor:Enviroment.palette.soft}}
//     />
//     <h6 className="text-white text-xs">Home</h6>
//     </button>
//   );
// }
function HomeButton() {
  const router = useIonRouter();
  const currentProfile = useSelector((state) => state.users.currentProfile);

  const handleClick = useCallback(() => {
    if (currentProfile) {
      router.push(Paths.home, "forward");
    } else {
      router.push(Paths.about(), "forward");
    }
  }, [currentProfile, router]);

  return (
    <button onClick={handleClick} className={navItem}>
      <IonImg src={home} className="w-6 h-6 mb-1 " />
      <span className="text-[11px]">Home</span>
    </button>
  );
}
function WorkshopButton(){

const router = useIonRouter()
const dispatch = useDispatch()
const handleClick=()=>{
  dispatch(setPageInView({page:null}))
        router.push(Paths.workshop.reader(),"forward")
}
return (

  <button onClick={handleClick} className={navItem}>
      <IonImg src={hammer} className="max-w-6 max-h-6 mb-1 invert " />
      <span className="text-[11px]">Studio</span>
    </button>
  
)

}




function ProfileButton({currentProfile}) {
  const router = useIonRouter();

  const handle = useCallback(() => {
    if (currentProfile) {
      router.push(Paths.myProfile, "forward", );
    } else {
      router.push(Paths.login(), "forward");
    }
  }, [currentProfile, router]);

  return (
    <button onClick={handle} className={navItem}>
      <IonImg src={person} className="max-w-6 max-h-6 mb-1 invert " />
      <span className="text-[11px]">Profile</span>
    </button>
 
  );
}


function NavCreateDropdown({

  
}) {

  const dispatch = useDispatch();
  const router = useIonRouter();
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const { openDialog } = useDialog();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    purpose: "",
    isPrivate: true,
    isOpenCollaboration: false,
  });
  const [submitting, setSubmitting] = useState(false);
  // const [error, setError] = useState(null);
    useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const ClickWriteAStory = debounce(()=>{
     
      sendGAEvent("Create","Create Button Click Nav","Click Nav Create")
     
        dispatch(createStory({profileId:currentProfile.id,privacy:true,type:PageType.text,
        title:"Unititled",commentable:true
      })).then(res=>checkResult(res,data=>{
      
          dispatch(setPageInView({page:data.story}))
          dispatch(setEditingPage({page:data.story}))
          router.push(Paths.editPage.createRoute(data.story.id),'forward', 'replace');
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
      router.push(Paths.editor.image,"forward")
    }
  },
  {
    label:"Link",
    icon:LinkIcon,
    action:()=>{
      dispatch(setHtmlContent({html:""}))
      dispatch(setEditingPage({page:null}))
      router.push(Paths.editor.link,"forward")
    }
  },
  {
    label:"Collection",
    action:()=>{
      
      handleOpenCreateCollection({dispatch,router,currentProfile,submitCollection,formData,openDialog,setFormData:setFormData,setSubmitting,submitting,setError})
  
    }
  }
]

return(

 <li ref={dropdownRef} className="dropdown dropdown-bottom relative">
      <a
        role="button"
        className="text-white no-underline"
        onClick={() => setIsOpen((prev) => !prev)}
      >
Create
</a>

{isOpen && (
  <ul className="dropdown-content bg-cream menu rounded-box w-52 p-2 shadow">
    {menuItems.map((item) => (
      <li
        key={item.label}
    onClick={() => {
    setIsOpen(false); // close dropdown immediately
    // run action in next tick to ensure dropdown closes visually first
    setTimeout(() => {
      item.action();
    }, 0);
  }}
      >
        <a className="flex gap-2 items-center justify-center text-soft">
          {item.icon && <IonImg src={item.icon} style={{ width: "1.4rem", height: "1.4rem" }} />}
          {item.label}
        </a>
      </li>
    ))}
  </ul>
)}

</li>

)

}

function MenuHorizontal({ pages, currentProfile }) {
  const router = useIonRouter()
  const dispatch = useDispatch()
  const { openDialog, resetDialog } = useDialog()

  const handleCloseNavMenu = (page) => {
    switch (page) {
      case "About": router.push(Paths.about(),"forward","replace"); break
      case "Discovery": router.push(Paths.discovery,"forward","replace"); break
      case "Search": router.push("/search","forward","replace"); break
      case "Workshop": 
        dispatch(setPageInView({ page: null }))
        router.push(Paths.workshop.reader(),"forward","replace"); break
      case "Log In": router.push(Paths.login(),"forward","replace"); break
      case "Join Now": router.push(Paths.apply(),"forward","replace"); break
      case "Feedback": router.push(Paths.feedback(),"forward","replace"); break
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

function CreateButton() {
  const dispatch = useDispatch();
  const router = useIonRouter();
  const { openDialog } = useDialog();
  
  const [formData, setFormData] = useState({
    name: "",
    purpose: "",
    isPrivate: true,
    isOpenCollaboration: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen,setIsOpen]=useState(false)
const {currentProfile }= useSelector(state=>state.users)

  const ClickWriteAStory = debounce(() => {
    if (currentProfile?.id) {
      sendGAEvent("Create", "Write a Story", "Click Write Story");
      dispatch(createStory({
        profileId: currentProfile.id,
        privacy: true,
        type: PageType.text,
        title: "Unititled",
        commentable: true
      })).then(res => checkResult(res, payload => {
        if (payload.story) {
          dispatch(setEditingPage({ page: payload.story }));
          dispatch(setPageInView({ page: payload.story }));
        router.push(Paths.editPage.createRoute(payload.story.id),'forward', 'replace');
        }else{
          windowl.alert("COULD NOT CREATE STORY")
        }
      },err=>{
        setErrorLocal(err.message)
      }));
    }
  }, 5);


  const handleNavigate = (type) => {
   

    switch (type) {
      case "write":
       ClickWriteAStory()
        break;
      case "image":
        router.push(Paths.editor.image,"forward");
        break;
      case "link":
        router.push(Paths.editor.link,"forward");
        break;
      case "collection":{
      
             handleOpenCreateCollection({dispatch,submitCollection,initPages:[],router,currentProfile,formData,setFormData,openDialog,setSubmitting,submitting,setError})
    

   }
        break;
      default:
        break;
    }
  };

  return (
    // <>   
    //     {isOpen && <div className="absolute bottom-full mb-2 w-36 bg-white rounded-xl shadow-lg py-2 z-50">
    //       {["write", "image", "link", "collection"].map((item) => (
    //         <button
    //           key={item}
    //           onClick={() => handleNavigate(item)}
    //           className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
    //         >
    //           {item}
    //         </button>
    //       ))}
    //     </div>}
    //   {/* )} */}
    //  <button    onClick={() => setIsOpen((prev) => !prev)} className={navItem}>
   
    //   <IonImg src={addCircle} className="w-6 h-6 mb-1 invert" />
    //   <span className="text-[11px]">Home</span>
    // </button>
    // </>
<div
  tabIndex={0} // make div focusable
  onBlur={(e) => {
    // Check if focus went outside this div
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsOpen(false);
    }
  }}
  className="relative inline-block"
>
  <button
    onClick={() => setIsOpen(prev => !prev)}
    className={navItem}
  >
    <IonImg src={addCircle} className="w-6 h-6 mb-1 invert" />
    <span className="text-[11px]">Home</span>
  </button>

  {isOpen && (
    <div className="absolute bottom-full mb-2 w-36 bg-white rounded-xl shadow-lg py-2 z-50">
      {["write", "image", "link", "collection"].map((item) => (
        <button
          key={item}
          onClick={() => handleNavigate(item)}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
        >
          {item}
        </button>
      ))}
    </div>
  )}
</div>
  );
}

const handleOpenCreateCollection = ({initPages=[],submitCollection,dispatch,currentProfile,router,formData,setFormData,setSubmitting,openDialog,submitting,error,setError}) => {

  openDialog({
    text: (
   <CreateCollectionForm
  initPages={initPages}
  formData={formData}      // <-- live state
  setFormData={setFormData} // <-- updater
  error={error}
/>
    ),
    title: "Create Collection",
    agreeText: "Create",
    agree: () =>{
      submitCollection({
        formData,
        dispatch,
        router,
        currentProfile,
        initPages,
        openDialog,
        setFormData,
        setSubmitting,
        setError,
      })},
    disagreeText: "Cancel",
    breakpoint: 0.9,
  });
};