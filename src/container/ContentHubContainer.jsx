import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useLayoutEffect, useContext } from 'react';
import '../styles/Discovery.css';
import '../Dashboard.css';
import ErrorBoundary from '../ErrorBoundary.jsx';
import { getPublicStories, setPagesInView } from '../actions/PageActions.jsx';
import { getPublicCollections, setCollections } from '../actions/CollectionActions.js';
import { AnimatePresence, motion } from "framer-motion";
import {  sendGAEvent} from '../core/ga4.js';
import Context from '../context.jsx';
import Paths from '../core/paths.js';
import useScrollTracking from '../core/useScrollTracking.jsx';
import sortItems from '../core/sortItems.js';
import {  IonContent, useIonRouter, useIonViewWillEnter } from '@ionic/react';

import Enviroment from '../core/Enviroment.js';
import useProfileDependentEffects from '../core/useProfileDependentEffects.jsx';
import HomeEmbed from './HomeContainer.jsx';
import DashboardEmbed from './DashboardContainer.jsx';

function ContentHubContainer() {
  const { seo,setSeo } = useContext(Context);
  const  currentProfile = useSelector(state=>state.users.currentProfile)

  const dispatch = useDispatch();
    const [tab, setTab] = useState("dash");
  const cols = useSelector(state => state.books.collections);
  const [isGlobal,setIsGlobal]=useState(true)
  const pagesInView = useSelector(state => state.pages.pagesInView);
  const { workshops, stories, prompts } = useProfileDependentEffects(currentProfile,isGlobal);


  tab && useScrollTracking({ name: tab });
  useLayoutEffect(() => {
  if (tab === "home") {
    setSeo(prev => ({
      ...prev,
      title: "Discover Writing, Events & Workshops | Plumbum",
      description:
        "Discover new writing, collections, events, and workshops on Plumbum. Explore fresh work from writers and literary communities.",
      type: "website",
    }));
  }

  if (tab === "dash") {
    setSeo(prev => ({
      ...prev,
      title: "Your Writing Dashboard | Plumbum",
      description:
        "Manage your writing, collections, reading activity, and community participation on Plumbum.",
      type: "profile",
      robots: "noindex, nofollow", // important
    }));
  }
}, [tab, setSeo]);


 useLayoutEffect(() => {
  if (tab === "home") {
    setSeo({
      title: "Plumbum — Discover Writing, Events & Workshops",
      description:
        "Explore fresh writing, collections, events, and workshops on Plumbum.",
      name: "Plumbum",
      type: "website",
    });
  }

  if (tab === "dash") {
    setSeo({
      title: "Plumbum — Your Writing Dashboard",
      description:
        "Manage your writing, collections, and reading activity on Plumbum.",
      name: "Plumbum",
      type: "profile",
    });
  }
}, [tab, setSeo]);




 
  useIonViewWillEnter(()=>{
    fetchContentItems()
  })
 
  const fetchContentItems = () => {
    dispatch(setPagesInView({ pages: [] }));
    dispatch(setCollections({ collections: [] }));
    dispatch(getPublicStories());
    dispatch(getPublicCollections());
  };






console.log("FDDF",{ workshops, stories, prompts })

  return (
  
      <ErrorBoundary>
<IonContent fullscreen style={{"--background":Enviroment.palette.cream,paddingTop:"10em",paddingBottom:"10em"}} scrollY={true}>
   
        
  <DiscDashTabs tab={tab} setTab={setTab} disc={() =><HomeEmbed workshops={workshops} stories={stories}
  prompts={prompts||[]} isGlobal={isGlobal} setIsGlobal={setIsGlobal}/>} dash={()=><DashboardEmbed />} />

</IonContent>
 
      </ErrorBoundary>

  );
}

export default ContentHubContainer




 function DiscDashTabs({ tab, setTab, disc, dash}) {
    const { seo,setSeo } = useContext(Context);
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const router = useIonRouter()
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 20 : -20, // smaller distance for tighter slide
      opacity: 0,
      position: "absolute",
      width: "100vw",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
      width: "100vw",
    },
    exit: (direction) => ({
      x: direction > 0 ? -20 : 20,
      opacity: 0,
      position: "absolute",
      width: "100vw",
    }),
  };

  //  return <IonContent style={{"--background":Enviroment.palette.cream}} fullscreen={true} scrollY={true}>
 
         {/* <div className='flex mt-4  pt-8 sm:pt-16 px-4 flex-row justify-between'>
   */}
                    {/* </div> */}
    
   return <div className="pt-12 bg-cream">
      {/* Tabs */}
      <div className="flex justify-center lg:justify-start lg:mx-12 mb-2">
        <div className="flex rounded-full border overflow-clip min-h-12 sm:w-[40em] lg:w-[30em] border-emerald-600">
          <button
            className={`px-4 py-2 transition-colors w-[45vw]  sm:w-[20em] lg:w-[15em]  ${
              tab === "home"
                ? "bg-soft text-white"
                : "text-soft bg-transparent"
            }`}
          onClick={() => {
  sendGAEvent("tab_select", {
    tab: "discovery",
    intent: "explore_new_content",
    surface: "discovery_dashboard",
    logged_in: Boolean(currentProfile),
  });
  setTab("home");
}}

          >
           Home
          </button>
           {currentProfile&&currentProfile.id?<button
            className={`px-4 py-2 transition-colors w-[45vw]   sm:w-[20em] lg:w-[15em] ${
              tab === "dash"
                ? "bg-emerald-700 text-white"
                : "text-emerald-700 bg-transparent"
            }`}
            onClick={() => {
  sendGAEvent("tab_select", {
    tab: "dashboard",
    intent: "manage_own_content",
    surface: "discovery_dashboard",
    logged_in: true,
  });
  setTab("dash");
}}

        
          >
            Dashboard
          </button>:<button
            className={`px-4 py-2 transition-colors w-[45vw]  sm:w-[20em] lg:w-[15em] ${
              tab === "dash"
                ? "bg-emerald-700 text-white"
                : "text-emerald-700 bg-transparent"
            }`}
            onClick={() => router.push(Paths.login())}
          >
           Log In
          </button>}
        </div>
      </div>
      <div className='bg-cream'>
        <AnimatePresence custom={tab === "collection" ? 1 : -1} mode="wait">
          <motion.div
            key={tab}
            custom={tab === "collection" ? 1 : -1}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.26, // faster
              ease: "easeOut", // more responsive
            }}
           
            className="w-full text-soft"
          >
            {tab === "home" ? disc() :dash()}
          </motion.div>
        </AnimatePresence>
      </div>
      </div>
{/* </IonContent> */}
  
}

