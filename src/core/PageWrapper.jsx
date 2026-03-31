
import {
  IonBackButton,
  IonButtons,
  IonPage,
  IonToolbar,
  IonHeader,
  useIonRouter,
  IonTitle,
  IonList,
  IonImg,
  IonText,
  IonButton,
  IonContent,
} from '@ionic/react';
import Enviroment from './Enviroment';
import { useEffect, useRef, useContext, useState } from 'react';
import Context from '../context';
import { useMediaQuery } from 'react-responsive';
import Paths from './paths';
import SearchButton from '../components/SearchButton';
import menu from "../images/icons/menu.svg";
import { Capacitor } from '@capacitor/core';
import { useSelector } from 'react-redux';
import { useDialog } from '../domain/usecases/useDialog';

const PageWrapper = ({
  children,
  showHeader = true,
  showBackbutton = true,
  showSearchButton = true,
  showMenubutton = true,
  title = ''
}) => {

    const [homeCol, setHomeCol] = useState(null);
    const [archiveCol, setArchiveCol] = useState(null);
    const { openDialog, dialog,resetDialog } = useDialog()
  const {currentProfile} = useSelector(state=>state.users)
  const pageRef = useRef(null);
  const router = useIonRouter();
  const { setPresentingEl } = useContext(Context);
const [menuOpen, setMenuOpen] = useState(false);
  const isDesktop = useMediaQuery({ query: '(min-width: 60.1em)' });
  const isMobileOrTablet = useMediaQuery({ query: '(max-width: 60em)' });
  const isNative = Capacitor.isNativePlatform();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
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
            paddingTop: "0.5em"
          }}>
             
         
          {results.map(workshop=>{
            return<li className=' my-2 bg-cream' onClick={()=>{
              router.push(Paths.collection.createRoute(workshop.id))
              resetDialog()
            }}><div className='p-4 w-[100%] border-1 border border-soft rounded-xl'><h4>{workshop.title}</h4></div></li>
          })}
        
          </IonList>
  </div>
        
      </div>
      )})
    
  }
  // const openCollections=()=>{
  //  openDialog({
  //     title: "Collections",
  //   scrollY: false,
  //   breakpoint: 1,
  
  
  //     disagree:()=>resetDialog(),
  //     text: (<div className=''>
  //             <div className={`bg-cream overflow-y-auto ${isNative? "h-[36rem]":"h-[30rem]"}`}> 
  //         <IonList 
  //          style={{
  //           backgroundColor: Enviroment.palette.cream,
           
  //         }}>
           
  //         {currentProfile.collections.map(story=>{
  //           return<li className=' my-2 bg-cream' onClick={()=>{
  //             router.push(Paths.collection.createRoute(story.id))
  //             resetDialog()
  //           }}><div className='p-4 w-[100%] border-1 border border-soft rounded-xl'><h4>{story.title}</h4></div></li>
  //         })}
     
  //         </IonList>
  
  //            </div>
  //     </div>
  //     )})}
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
            {currentProfile.collections.map((story) => (
              <li
                key={story.id}
                className="my-2"
                onClick={() => {
                  router.push(Paths.collection.createRoute(story.id));
                  resetDialog();
                }}
              >
                <div className="p-4 w-full border border-soft rounded-xl bg-cream">
                  <h4>{story.title}</h4>
                </div>
              </li>
            ))}
          </IonList>

        </div>
      </div>
    ),
  });
};
  const openDrafts = () => {
  openDialog({
    title: "Drafts",
    scrollY: false,
    breakpoint: 1,

    disagree: () => resetDialog(),

    text: (
      <div className="h-[80vh] flex flex-col bg-cream">

      
        <div className="flex-1 overflow-y-auto px-4 pb-6">

          <IonList
            style={{
              backgroundColor: Enviroment.palette.cream,
            }}
          >
            {currentProfile.stories.filter(s=>s.status=="draft"||s.status=="fragment").map((story) => (
              <li
                key={story.id}
                className="my-2"
                onClick={() => {
                  router.push(Paths.page.createRoute(story.id));
                  resetDialog();
                }}
              >
                <div className="p-4 w-full border border-soft rounded-xl bg-cream">
                  <h4>{story.title.length>0?story.title:"Untitled"}</h4>
                </div>
              </li>
            ))}
          </IonList>

        </div>
      </div>
    ),
  });
};
      const openCommunities=()=>{
        const communities = currentProfile.collections.filter(col=>col.type=="library")
   openDialog({
      title: "Communities",
    scrollY: false,
    breakpoint: 1,
  
  
      disagree:()=>resetDialog(),
      text: (<div className=''>
          <div className={`bg-cream overflow-y-scroll ${isNative? "h-[35rem]":"h-[30rem]"}`}> 
    
          <IonList style={{backgroundColor:Enviroment.palette.cream}}>
          
          {communities.map(story=>{
            return<li className=' my-2 bg-cream' onClick={()=>{
              router.push(Paths.collection.createRoute(story.id))
              resetDialog()
            }}><div className='p-4 w-[100%] border-1 border border-soft rounded-xl'><h4>{story.title.length?story.title:
          "Untitled"}</h4></div></li>
          })}
      
          </IonList>
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
      <IonList
        style={{
          backgroundColor: Enviroment.palette.cream,
        }}
      >
        {currentProfile.stories.map((story) => {
          return (
            <li
              key={story.id}
              className="my-2 bg-cream"
              onClick={() => {
                router.push(Paths.page.createRoute(story.id));
                resetDialog();
              }}
            >
              <div className="p-4 w-full border border-soft rounded-xl active:scale-[0.98] transition">
                <h4>
                  {story?.title?.length > 0 ? story.title : "Untitled"}
                </h4>
              </div>
            </li>
          );
        })}
      </IonList>
    </div>

  </div>
)})
  //     text: ( <div className="flex flex-col h-full">
    
  //   <div className="bg-cream overflow-y-auto flex-1">
   
  //                {/* <div className={`bg-cream overflow-y-auto ${isNative? "h-[36rem]":"h-[30rem]"}`}>  */}
  //         <IonList 
  //          style={{
  //           backgroundColor: Enviroment.palette.cream,
           
  //         }}>
  //         {currentProfile.stories.map(story=>{
  //           return<li className=' my-2 bg-cream' onClick={()=>{
  //             router.push(Paths.page.createRoute(story.id))
  //             resetDialog()
  //           }}><div className='p-4 w-[100%] border-1 border border-soft rounded-xl'><h4>{story?.title?.length>0?story.title:"Untitled"}</h4></div></li>
  //         })}
          
  //         </IonList>
  // </div>
        
  //     </div>
      // )
  }
  useEffect(() => {
    if (currentProfile?.profileToCollections) {
      let home = currentProfile.profileToCollections.find(pTc => pTc.type === "home")?.collection || null;
      setHomeCol(home);

      let archive = currentProfile.profileToCollections.find(pTc => pTc.type === "archive")?.collection || null;
      setArchiveCol(archive);
    }

  }, [currentProfile]);
  useEffect(() => {
    if (pageRef.current) setPresentingEl(pageRef.current);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  const handleRetry = () => {
    if (navigator.onLine) {
      setIsOnline(true);
      // Optional: force reload content or trigger a data fetch
      window.location.reload();
    }
  };

  if (!isOnline) {
    // Offline UI
    return (
      <IonPage >
       <IonContent >
        <div className='h-[100%] w-[100%] flex'> 
        <div className="my-auto mx-auto text-center">
          <IonText color="medium">
            <h2>No Internet Connection</h2>
            <p>Please check your connection and try again.</p>
          </IonText>
          <IonButton onClick={handleRetry} style={{ marginTop: '1em' }}>
            Retry
          </IonButton>
          </div>
        </div>
        {/* </div> */}
        </IonContent>
      </IonPage>
    );
  }
const handleBack = () => {
  // Only redirect if there is no history
  if (!router.canGoBack()) {
    router.push(Paths.discovery);
  } else {
    router.goBack();
  }
};
  return (
    <IonPage
  ref={pageRef}
  className={menuOpen ? "overflow-hidden" : ""}  style={{ height: '100%', paddingTop: isDesktop ? '5em' : '0' }}>
      {isMobileOrTablet && (showHeader && Capacitor.isNativePlatform() ? (
        <IonHeader translucent>
          <IonToolbar>
         { showBackbutton ? (
          <IonButtons slot="start">
              <IonBackButton
  defaultHref={Paths.discovery}
  onClick={(e) => {
    e.stopPropagation();
   

    
    handleBack()
  }}
/></IonButtons>
            ) : (
              <IonButtons slot="start">
                <IonText>Pb</IonText>
              </IonButtons>
            )}
            {showSearchButton && <SearchButton onClick={() => router.push("/search")} />}
            {showMenubutton && (
          <IonButtons slot="end">
  <button
    onClick={() => setMenuOpen(true)}
    className="p-2"
  >
    <IonImg
      src={menu}
      style={{
        width: "2.2em",
        height: "2.2em",
        filter:
          "invert(33%) sepia(86%) saturate(749%) hue-rotate(111deg) brightness(92%) contrast(91%)",
        pointerEvents: "none", // 🔥 important
      }}
    />
  </button>
</IonButtons>
            )}
               {showMenubutton && (
             <IonButtons slot="end">
  <button
    onClick={() => setMenuOpen(true)}
    className="p-2"
  >
    <IonImg
      src={menu}
      style={{
        width: "2.2em",
        height: "2.2em",
        filter:
          "invert(33%) sepia(86%) saturate(749%) hue-rotate(111deg) brightness(92%) contrast(91%)",
        pointerEvents: "none", // 🔥 important
      }}
    />
  </button>
</IonButtons>
            )}
          </IonToolbar>
        </IonHeader>
      ) : (
        <div className='bg-cream'>
          <IonHeader translucent>
            <IonToolbar>
              <IonButtons slot="start">
                <IonText>
                  <h3 className='text-[1rem]'>Pb</h3>
                </IonText>
              </IonButtons>
              {showSearchButton && <SearchButton onClick={() => router.push("/search")} />}
                    {showMenubutton && (
         <IonButtons slot="end">
  <button
    onClick={() => setMenuOpen(true)}
    className="p-2"
  >
    <IonImg
      src={menu}
      style={{
        width: "2.2em",
        height: "2.2em",
        filter:
          "invert(33%) sepia(86%) saturate(749%) hue-rotate(111deg) brightness(92%) contrast(91%)",
        pointerEvents: "none", // 🔥 important
      }}
    />
  </button>
</IonButtons>
            )}
            </IonToolbar>
          </IonHeader>
        </div>
      ))}
   {/* 🔥 SLIDING MENU */}
<div className={`
  fixed inset-0 z-[999] transition-all duration-300
  ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}
`}>

  {/* BACKDROP */}
  <div
    onClick={() => setMenuOpen(false)}
    className={`
      absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300
      ${menuOpen ? "opacity-100" : "opacity-0"}
    `}
  />

  {/* DRAWER */}
  <div
    className={`
      absolute left-0 top-0 h-full w-[85%] max-w-[22em]
      bg-[#f8f6f1] shadow-xl rounded-r-3xl
      transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
      ${menuOpen ? "translate-x-0" : "-translate-x-full"}
    `}
  >
    <div className="p-6 flex flex-col h-full">

      {/* PROFILE */}
      <div className="flex items-center gap-3 mb-8">
        <IonImg
          src="/profile.jpg"
          className="w-14 h-14 rounded-md object-cover"
        />
        <div>
          <p className="text-sm text-gray-500">Welcome back</p>
          <p className="text-lg font-semibold">Plumbum</p>
        </div>
      </div>

      {/* NAV */}
      <div className="flex flex-col gap-5 text-[1.05rem] text-emerald-700">
        {[
  { label: "Events", action: () => {router.push(Paths.calendar())} },
  { label: "Pages", action: () => {openPages()} },
  { label: "Your drafts", action: () => {openDrafts() }},
  { label: "Collections", action: () => {openCollections()} },
  { label: "Libraries", action: () => {openCommunities()} },
  { label: "Archives", action: () => {router.push(Paths.collection.createRoute(archiveCol.id))} },
  { label: "Studio", action: () => {router.push(Paths.workshop.reader())} },
  { label: "Dashboard", action: () => {router.push(Paths.home) }},
  { label: "Saved", action: () => {router.push(Paths.collection.createRoute(homeCol.id))} },
  { label: "Notifications", action: () => {router.push(Paths.notifications())} },
].map((item) => (
  <button
    key={item.label}
    className="text-left hover:text-emerald-900 transition"
    onClick={() => {
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
      <div className="flex flex-col gap-4 text-emerald-700">
        <button onClick={() => setMenuOpen(false)}>Refer a friend 🥰</button>
        <button onClick={() => setMenuOpen(false)}>Report a bug</button>
        <button onClick={() => setMenuOpen(false)}>Settings ⚙️</button>
      </div>

    </div>
  </div>
</div>
      {children}
    </IonPage>
  );
};

export default PageWrapper;