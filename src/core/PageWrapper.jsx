

import { useDialog } from '../domain/usecases/useDialog';

import {
  IonBackButton,
  IonButtons,
  IonPage,
  IonToolbar,
  IonHeader,
  useIonRouter,
  IonImg,
  IonText,
  IonButton,
  IonList,
  IonLoading
} from '@ionic/react';
import { useEffect, useRef, useContext, useState } from 'react';
import Context from '../context';
import { useMediaQuery } from 'react-responsive';
import Paths from './paths';
import SearchButton from '../components/SearchButton'; // import memoized component
import menu from "../images/icons/menu.svg"
import { Capacitor } from '@capacitor/core';
import { useSelector } from 'react-redux';

import { useDispatch } from 'react-redux';
import Enviroment from './Enviroment';
import { IonContent } from '@ionic/react';
import ReferralForm from '../components/auth/ReferralForm';
import { setPageInView } from '../actions/PageActions';
import checkResult from './checkResult';
import { Preferences } from '@capacitor/preferences';
import getBackground from './getbackground';
import { getMyStories } from '../actions/StoryActions';
import PaginatedList from '../components/page/PaginatedList';
import shortName from './shortName';
// import { IonContext } from '@ionic/react/dist/types/contexts/IonContext';
// spacing rules (mentally or constants)
const SPACING = {
  pageX: "px-5",     // horizontal padding
  sectionY: "py-6",  // vertical section spacing
  gap: "gap-4",      // default gap
  gapSm: "gap-3",
  gapLg: "gap-6",
};
const PageWrapper = ({
  children,
  showHeader = true,
  presentHeader = true,
  showBackbutton = true,
  showSearchButton = true,
   showMenubutton = true,

  title = ''
}) => {

  const [menuOpen, setMenuOpen] = useState(false);
  const pageRef = useRef(null);
  const router = useIonRouter();
  const { setPresentingEl } = useContext(Context);
  //  const isDev = import.meta.env.VITE_NODE_ENV=="dev"
const isNativePlatform = Capacitor.isNativePlatform();
const pageSize = 6
const isNative = isNativePlatform
const {currentProfile}=useSelector(state=>state.users)
  const isAuthed = !!currentProfile?.id;
const myCollections=useSelector(state=>state.books.myCollections.filter(t=>t))
const myStories=useSelector(state=>state.pages.myPages.filter(t=>t))
// const  /
  const [isOnline, setIsOnline] = useState(navigator.onLine);
const isDesktop = useMediaQuery({ query: '(min-width: 60.1em)' }) // 768px
// const isMobileOrTablet = useMediaQuery({ query: '(max-width: 60em)' })
const [homeCol, setHomeCol] = useState(null);
const dispatch = useDispatch()
const [token,setToken]=useState(null)
    const [archiveCol, setArchiveCol] = useState(null);
    const { openDialog, dialog,resetDialog } = useDialog()
   

 
       useEffect(() => {
                    
                    if (currentProfile?.profileToCollections) {
                      let home = currentProfile?.profileToCollections.find(pTc => pTc.type === "home")?.collection || null;
                      setHomeCol(home);
                
                      let archive = currentProfile?.profileToCollections.find(pTc => pTc.type === "archive")?.collection || null;
                      setArchiveCol(archive);
                    }
                
      }, [currentProfile]);

  

  const openYourWorkshops=()=>{
  
      openDialog({
      title: "Your Workshops",
    scrollY: false,
    breakpoint: 1,
  
  
      disagree:()=>resetDialog(),
      text: (<div className=''>
  
        <div className={`bg-cream overflow-y-auto border border-1 rounded-xl border-soft px-4 ${isNative? "h-[36rem] sm:h-[40rem] md:h-[48rem] lg:h-[50rem]":"h-[30rem] sm:h-[40rem] md:h-[48rem] lg:h-[50rem]"}`}> 
          <IonList
           style={{
            backgroundColor: Enviroment.palette.cream,
           
          }}>
             
         
          {results.map(workshop=>{
            return<li className=' my-2 bg-cream' onClick={()=>{
              router.push(Paths.collection.createRoute(workshop.id))
              resetDialog()
            }}><div className='p-4 w-[100%] border-1 border border-soft rounded-xl'><h6>{workshop.title}</h6></div></li>
          })}
        
          </IonList>
  </div>
        
      </div>
      )})
    
  }

  const openCollections = () => {
  
  openDialog({
    title: "Collections",
    scrollY: false,
    breakpoint: 1,

    disagree: () => resetDialog(),

    text: (
      <div className="h-[80vh] flex flex-col bg-cream">

        {/* HEADER SPACE (optional if your dialog already has one) */}
        <div className="p-4">
          <h3 className="text-lg">Your Collections</h3>
        </div>

        {/* SCROLL AREA */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">

          <IonList
            style={{
              backgroundColor: Enviroment.palette.cream,
            }}
          >
            {myCollections.map((story) => (
              <li
                key={story.id}
                className="my-2"
                onClick={() => {
                  router.push(Paths.collection.createRoute(story.id));
                  resetDialog();
                }}
              >
                <div className="p-4 w-full border border-soft rounded-xl bg-cream">
                  <h6>{story?.title??"Untitled"}</h6>
                </div>
              </li>
            ))}
          </IonList>

        </div>
      </div>
    ),
  });
};
let signedOutMenu = [{ label: "Discovery", action: () => {router.push(Paths.discovery) }},
          { label: "Events", action: () => {router.push(Paths.calendar())} },
        ]
        
let signedInMenu = [
             { label: "Discovery", action: () => {router.push(Paths.discovery) }},
               { label: "Pages", action: () => {openPages()} },
  { label: "Events", action: () => {router.push(Paths.calendar())} },
 { label: "Studio", action: () => {
  dispatch(setPageInView({page:null}))
  router.push(Paths.workshop.reader())} },

  { label: "Your drafts", action: () => {openDrafts() }},
  { label: "Collections", action: () => {openCollections()} },
  { label: "Libraries", action: () => {openCommunities()} },
    { label: "Saved", action: () => {router.push(Paths.collection.createRoute(homeCol?.id))} },
  { label: "Archives", action: () => {router.push(Paths.collection.createRoute(archiveCol?.id))} },
 
  { label: "Dashboard", action: () => {router.push(Paths.home) }},

  { label: "Notifications", action: () => {router.push(Paths.notifications())}}]
  const menuArr = currentProfile && currentProfile.id ? signedInMenu:signedOutMenu
  const openDrafts = () => {
  openDialog({
    title: "Drafts",
    scrollY: false,
    // breakpoint: 1,
    height:90,
    disagree: () => resetDialog(),

    text: (
      <div className="h-[80vh] flex flex-col bg-cream">

      
          <PaginatedList
  cacheKey="stories"
  fetcher={getMyStories}
  pageSize={pageSize}
  params={{ status: "draft" }}
  enableInternalSearch={true}
  renderItem={(story) => (
    <div
      key={story.id}
      onClick={() => {
        router.push(Paths.page.createRoute(story?.id));
        resetDialog();
      }}
      className="p-4 border border-blue dark:text-cream border-1 rounded-xl"
    >
      {shortName(story?.title, 40) || "Untitled"}
    </div>
  )}
/>
      </div>
    ),
  });
};
      const openCommunities=()=>{
        const communities = myCollections.filter(col=>col.type=="library")
   openDialog({
      title: "Communities",
    scrollY: false,
    breakpoint: 1,
  
  
      disagree:()=>resetDialog(),
      text: (<div className=''>
          <div className={`bg-cream overflow-y-scroll ${isNative? "h-[35rem]":"h-[30rem]"}`}> 
    
           <PaginatedList
       cacheKey="collections:type=library"
        fetcher={getMyCollections}
        pageSize={pageSize}
        enableInternalSearch={true}
        params={{ type: "library" }} // ✅ THIS NOW WORKS
        renderItem={(y) => (
          <div
            onClick={() => {
              router.push(Paths.collection.createRoute(story.id));
              resetDialog();
            }}
            className="p-4 border border-purple rounded-xl"
          >
            <h4 className="text-[.9rem]">
              {y.title || "Untitled"}
            </h4>
          </div>
        )}
      />
      </div>
        
      </div>
      )})}
  const openPages=()=>{
     openDialog({
      title: "Pages",
    scrollY: false,
     height: 80, 
     text: (
  <div className="flex flex-col h-full">
    
    <div className="bg-cream overflow-y-auto flex-1">
       <div>
   <PaginatedList
   
  cacheKey="stories"
  fetcher={getMyStories}
  pageSize={pageSize}
 
  enableInternalSearch={true}
  renderItem={(story) => (
        <div
          key={story.id}
          onClick={() => {
            router.push(Paths.page.createRoute(story?.id));
            resetDialog();
          }}
          className="p-4 border border-blue dark:text-cream border-1 rounded-xl"
        >
          {shortName(story?.title,40) || "Untitled"}
        </div>
      )}
    />  </div>
    </div>

  </div>
)})

  }
   const openReferral=()=>{
     openDialog({
      title: "Referral",
    scrollY: false,
     height: 80, 
     text: (
  <div className="flex flex-col h-full">
    
    <div className="bg-cream overflow-y-auto flex-1">
     <ReferralForm  onClose={resetDialog}/>
    </div>

  </div>
)})

  }
  useEffect(() => {
    if (pageRef.current) setPresentingEl(pageRef.current);
  }, []);

  const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.goBack();
    } else {
      router.push(Paths.discovery);
    }
  };
   const handleReload = () => {
    // this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };
if (!isOnline) {
  return (
 <IonPage
  ref={pageRef}
  style={{ 
    ...getBackground(),
    height: '100%', 

  }}
>
      <IonContent fullscreen className="ion-padding">
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          
          {/* Icon / visual cue */}
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
            <span className="text-2xl">📡</span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Internet Connection
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
            You’re offline. Please check your connection and try again.
          </p>

          {/* Button */}
          <button
            onClick={handleReload}
            className="
              mt-6 px-6 py-3
              rounded-full
              bg-black text-white
              text-sm font-medium
              active:scale-95 transition
              shadow-sm
            "
          >
            Try Again
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
}

  return (
  <IonPage
  ref={pageRef}
  style={{ 
    ...getBackground(),
    height: '100%', 
    paddingTop: isDesktop ? '8em' : '0.0em',
  }}

     
    >
      {presentHeader && !isDesktop && (
        <IonHeader >
          <div >
          <IonToolbar style={{
    '--background': Enviroment.palette.base.soft,
    '--color': Enviroment.palette.text.inverse // text color
  }} >
            {showBackbutton ? (
              <IonButtons slot="start">
                <IonBackButton
  defaultHref={Paths.discovery}
  onClick={handleBack}
  style={{ '--color': Enviroment.palette.text.inverse }}
/>
              </IonButtons>):(<IonButtons onClick={()=>router.push(Paths.discovery)}slot="start">
                <h2 className='azkin flex-1 min-w-[4rem] px-2 pt-1 text-[1.5rem]'>Pb</h2>
              </IonButtons>)}
              {showSearchButton && (<SearchButton onClick={() => router.push("/search")} />)}
    
         
         
                    {showMenubutton && (
    <IonButtons slot="end">
      <div  onClick={() => setMenuOpen(true)}>
      <IonImg src={menu}  
      style={{
        width: "2.5em",
        height: "2.5em",
        
    '--background': Enviroment.palette.base.soft,
    '--color': Enviroment.palette.base.text || '#000'}
      }/>
 </div>
    </IonButtons>
  )}
          </IonToolbar>
          </div>
        </IonHeader>
      )}
      
    <div className={`
  fixed inset-0 z-[999] transition-all duration-300
   ${menuOpen ? "pointer-events-auto" : "pointer-events-none"} `}>
  <div
    onClick={() => setMenuOpen(false)}
    className={`
      absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300
      ${menuOpen ? "opacity-100" : "opacity-0"}
    `}
  />

  {/* DRAWER */}
  <div
  style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    className={`
overflow-y-auto pb-20
      absolute left-0 top-0 h-[100dvh] w-[85%] max-w-[22em]
      bg-[#f8f6f1] shadow-xl rounded-r-3xl
      transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
      ${menuOpen ? "translate-x-0" : "-translate-x-full"}
    `}
  >
    <div className="p-6 flex flex-col h-full">

      {/* PROFILE */}
      {/* <div className="flex items-center gap-3 mb-8"> */}
        {/* <IonImg
          src="/profile.jpg"
          className="w-14 h-14 rounded-md object-cover"
        /> */}
        {/* <div className='pt-12'> */}
          <div className="flex items-center gap-3 pb-6 pt-10 overflow-y-scroll border-b border-soft">
    <div>
    <p className="text-xs text-soft opacity-60">Welcome back</p>
<p className="text-base font-semibold text-soft">
  {currentProfile?.username || "Guest"}
</p>
    </div>
  </div>
      {/* </div> */}

      {/* NAV */}
      <div className="flex flex-col gap-4 py-6">
      
{menuArr.map((item) => (
  <button
    key={item.label}
   className="
   rounded-s-full
          text-left 
          text-[1rem] 
          bg-base-surface
          text-soft 
          my-1
       
          hover:bg-purple
          hover:text-green
          transition
        " onClick={() => {
      setMenuOpen(false); // close menu first
      item.action();      // then run custom logic
    }}
  >
    {item.label}
  </button>
))}
        
      </div>

      <div className="flex-1" />

      {/* FOOTER */}
      <div className="flex flex-col  gap-3 pb-20 border-t border-soft">
  
      {currentProfile &&   <button onClick={() =>{ 
          openReferral()
       setMenuOpen(false)}}
          className=" rounded-s-full
          text-left 
          text-[1rem] 
          bg-base-surface
          text-soft 
          my-1
         
          hover:bg-purple
        hover:text-green
          transition"
    
           >Refer a friend 🥰</button>}
        <button  className=" rounded-s-full
          text-left 
          text-[1rem] 
          bg-base-surface
          text-soft 
          my-1
        
          hover:bg-purple
         hover:text-green
          transition"
    onClick={() => router.push(Paths.feedback())}>Report a bug</button>
        {currentProfile && <button className=" rounded-s-full
          text-left 
          text-[1rem] 
          bg-base-surface
          text-soft 
          my-1
        
          hover:bg-purple
          hover:text-green
          transition"
    onClick={() => router.push(Paths.editProfile)}>Settings ⚙️</button>}
      </div>

    </div>
  </div>
</div>
      {children}
    </IonPage>
  );
};

export default PageWrapper;