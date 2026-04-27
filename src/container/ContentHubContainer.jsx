import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useLayoutEffect, useContext } from 'react';
import '../styles/Discovery.css';
import '../Dashboard.css';
import ErrorBoundary from '../ErrorBoundary.jsx';
import { getPublicStories, setPagesInView } from '../actions/PageActions.jsx';
import { getMyCollections, getPublicCollections, setCollections } from '../actions/CollectionActions.js';
import { AnimatePresence, motion } from "framer-motion";
import {  sendGAEvent} from '../core/ga4.js';
import Context from '../context.jsx';
import Paths from '../core/paths.js';
import useScrollTracking from '../core/useScrollTracking.jsx';
import {  IonContent, useIonRouter, useIonViewWillEnter } from '@ionic/react';

import Enviroment from '../core/Enviroment.js';
import useProfileDependentEffects from '../core/useProfileDependentEffects.jsx';
import HomeEmbed from './HomeContainer.jsx';
import DashboardEmbed from './DashboardContainer.jsx';
import getBackground from '../core/getbackground.jsx';
import usePushNotificationListener from '../domain/usecases/usePushNotificationListener.jsx';


function ContentHubContainer() {
  const { seo,setSeo } = useContext(Context);
  const  currentProfile = useSelector(state=>state.users.currentProfile)


    const [tab, setTab] = useState("dash");
  const [isGlobal,setIsGlobal]=useState(true)

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



  return (
<IonContent 
  fullscreen 

  style={{
   ...getBackground(), // use base.bg not cream, they differ slightly
    "--min-height":"100%"       // use ionic var not paddingBottom
  }} 
  scrollY={true}
>
        
      <ErrorBoundary>
{/* <div className='ion-padding'>  */}
  <DiscDashTabs tab={tab} setTab={setTab} disc={() =><HomeEmbed workshops={workshops} stories={stories}
  prompts={prompts} isGlobal={isGlobal} setIsGlobal={setIsGlobal}/>} dash={()=><DashboardEmbed />} />

{/* </div> */}
 
      </ErrorBoundary>
</IonContent>
  );
}

export default ContentHubContainer



function DiscDashTabs({ tab, setTab, disc, dash}) {
  const currentProfile = useSelector(state=>state.users.currentProfile)
  const router = useIonRouter()

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 20 : -20,
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

  return (
    <IonContent fullscreen>
      <div className="pt-12 dark:bg-base-bgDark bg-base-surface">
        <div className="flex justify-center lg:justify-start lg:mx-12 mb-2">
          <div className="flex rounded-full mx-auto  border overflow-clip min-h-12 sm:w-[40em] lg:w-[30em] border-soft">
            <button
              className={`px-4 py-2 transition-colors w-[45vw] sm:w-[20em] lg:w-[15em] ${
                tab === "home" ? "bg-soft text-white" : "text-soft bg-transparent"
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

            {currentProfile?.id ? (
              <button
                className={`px-4 py-2 transition-colors w-[45vw] sm:w-[20em] lg:w-[15em] ${
                  tab === "dash" ? "bg-soft text-white" : "text-soft bg-transparent"
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
              </button>
            ) : (
              <button
                className={`px-4 py-2 transition-colors w-[45vw] sm:w-[20em] lg:w-[15em] ${
                  tab === "dash" ? "bg-soft text-white" : "text-soft bg-transparent"
                }`}
                onClick={() => router.push(Paths.login)}
              >
                Log In
              </button>
            )}
          </div>
        </div>

        <div className="bg-base-bg">
          <AnimatePresence custom={tab === "collection" ? 1 : -1} mode="wait">
            <motion.div
              key={tab}
              custom={tab === "collection" ? 1 : -1}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.26, ease: "easeOut" }}
              className="w-full text-soft"
            >
              {tab === "home" ? disc() : dash()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </IonContent>
  );
}
//  function DiscDashTabs({ tab, setTab, disc, dash}) {

//     const currentProfile = useSelector(state=>state.users.currentProfile)
//     const router = useIonRouter()
//   const variants = {
//     enter: (direction) => ({
//       x: direction > 0 ? 20 : -20, // smaller distance for tighter slide
//       opacity: 0,
//       position: "absolute",
//       width: "100vw",
//     }),
//     center: {
//       x: 0,
//       opacity: 1,
//       position: "relative",
//       width: "100vw",
//     },
//     exit: (direction) => ({
//       x: direction > 0 ? -20 : 20,
//       opacity: 0,
//       position: "absolute",
//       width: "100vw",
//     }),
//   };


    
//    return <IonContent fullscreen><div className="pt-12  bg-cream">
//       {/* Tabs */}
//       <div className="flex justify-center lg:justify-start lg:mx-12 mb-2">
//         <div className="flex rounded-full border overflow-clip min-h-12 sm:w-[40em] lg:w-[30em] border-emerald-600">
//           <button
//             className={`px-4 py-2 transition-colors w-[45vw]  sm:w-[20em] lg:w-[15em]  ${
//               tab === "home"
//                 ? "bg-soft text-white"
//                 : "text-soft bg-transparent"
//             }`}
//           onClick={() => {
//   sendGAEvent("tab_select", {
//     tab: "discovery",
//     intent: "explore_new_content",
//     surface: "discovery_dashboard",
//     logged_in: Boolean(currentProfile),
//   });
//   setTab("home");
// }}

//           >
//            Home
//           </button>
//            {currentProfile&&currentProfile.id?<button
//             className={`px-4 py-2 transition-colors w-[45vw]   sm:w-[20em] lg:w-[15em] ${
//               tab === "dash"
//                 ? "bg-emerald-700 text-white"
//                 : "text-emerald-700 bg-transparent"
//             }`}
//             onClick={() => {
//   sendGAEvent("tab_select", {
//     tab: "dashboard",
//     intent: "manage_own_content",
//     surface: "discovery_dashboard",
//     logged_in: true,
//   });
//   setTab("dash");
// }}

        
//           >
//             Dashboard
//           </button>:<button
//             className={`px-4 py-2 transition-colors w-[45vw]  sm:w-[20em] lg:w-[15em] ${
//               tab === "dash"
//                 ? "bg-emerald-700 text-white"
//                 : "text-emerald-700 bg-transparent"
//             }`}
//             onClick={() => router.push(Paths.login)}
//           >
//            Log In
//           </button>}
//         </div>
//       </div>
//       <div className='bg-cream'>
//         <AnimatePresence custom={tab === "collection" ? 1 : -1} mode="wait">
//           <motion.div
//             key={tab}
//             custom={tab === "collection" ? 1 : -1}
//             variants={variants}
//             initial="enter"
//             animate="center"
//             exit="exit"
//             transition={{
//               duration: 0.26, // faster
//               ease: "easeOut", // more responsive
//             }}
           
//             className="w-full text-soft"
//           >
//             {tab === "home" ? disc() :dash()}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//       </div>

//   </IonContent>
// }

