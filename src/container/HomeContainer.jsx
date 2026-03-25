// import { useEffect, useState, useContext, useMemo,  } from 'react';
// import "../styles/MyProfile.css";
// import { useDispatch, useSelector } from "react-redux";
// import { createStory, fetchRecommendedStories, updateStory,getPrompts  } from '../actions/StoryActions';
// import Paths from '../core/paths';
// import { debounce, set, truncate } from 'lodash';
// import calendar from '../images/icons/calendar.svg'
// import settings from "../images/icons/settings.svg"
// import { setPageInView, setPagesInView, setEditingPage, setHtmlContent } from '../actions/PageActions.jsx';
// import { sendGAEvent } from '../core/ga4.js';
// import CreateCollectionForm from '../components/collection/CreateCollectionForm';
// import checkResult from '../core/checkResult';
// import { PageType } from '../core/constants';
// import Context from '../context';
// import FeedbackDialog from '../components/page/FeedbackDialog';
// import { IonText,  IonContent, IonSpinner,   useIonViewWillEnter, IonImg, useIonRouter, IonList } from '@ionic/react';
// import { Preferences } from '@capacitor/preferences';
// import axios from "axios";
// import ErrorBoundary from '../ErrorBoundary.jsx';

// import { useDialog } from '../domain/usecases/useDialog.jsx';
// // import requestLocation from '../core/requestLocation.jsx';
// import { findWorkshopGroups} from '../actions/WorkshopActions.jsx';
// import { getCurrentProfile } from '../actions/UserActions.jsx';
// import requestLocation from '../core/requestLocation.js';
// import DataElement from '../components/page/DataElement.jsx';
// import isValidUrl from '../core/isValidUrl.js';
// import Enviroment from '../core/Enviroment.js';
// import StoryItem from '../components/page/StoryItem.jsx';



//   const fetchPrompts = ()=>{
//   dispatch(getPrompts()).then(res=>checkResult(res,({prompts})=>{
//     // setPrompts(prompts)

//   },(err)=>{
//     console.log(err)
//   }))
//   }


// function useProfileDependentEffects(currentProfile, isGlobal) {
//   const dispatch = useDispatch();
//   const isNative = Capacitor.isNativePlatform();

//   const [results, setResults] = useState({
//     workshops: [],
//     stories: [],
//     prompts: [],
//     location: null,
//   });

//   const fetchPrompts = async () => {
//     try {
//       const res = await dispatch(getPrompts());
//       checkResult(res, ({ prompts }) => {
//          let sort = [...prompts].sort((a,b)=>new Date(b.updated)-new Date(a.updated))
//         setResults(prev => ({ prompts:sort,...prev}));
//       });
//     } catch (err) {
//       console.error("Failed fetching prompts:", err);
//     }
//   };

//   const fetchStories = async () => {
//     try {
//       const res = await dispatch(fetchRecommendedStories());
//       checkResult(res, ({ stories }) => {
//         setResults(prev => ({ ...prev, stories }));
//       });
//     } catch (err) {
//       console.error("Failed fetching stories:", err);
//     }
//   };

//   const fetchWorkshops = async () => {
//     if (!currentProfile) return;
//     try {
//       const res = await dispatch(findWorkshopGroups({
//         location: currentProfile.location,
//         radius: 50,
//         global: isGlobal
//       }));
//       checkResult(res, ({ groups }) => {
//          let sort = [...groups].sort((a,b)=>new Date(b.updated)-new Date(a.updated))
//         setResults(prev => ({ ...prev, workshops: sort|| [] }));
//       });
//     } catch (err) {
//       console.error("Failed fetching workshops:", err);
//     }
//   };

//   const fetchLocation = () => {
//     if (isGlobal) {
//       isNative ? requestLocation() : navigator.geolocation.getCurrentPosition(
//         (pos) => setResults(prev => ({
//           ...prev,
//           location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
//         })),
//         (err) => console.error("Location error:", err)
//       );
//     }
//   };

//   useEffect(() => {
//     if (!currentProfile) return;

//     fetchWorkshops();
//     fetchStories();
//     fetchPrompts();
//     fetchLocation();
//   }, [currentProfile, isGlobal]);

//   return results;
// }


// function HomeContainer() {
//   // const [tab, setTab] = useState("page");
//     const [isGlobal,setIsGlobal]=useState(true)
//     const currentProfile = useSelector(state=>state.users.currentProfile)
//   // useProfileDependentEffects(currentProfile, isGlobal);
//   const router = useIonRouter()
//   const dispatch = useDispatch();

//   const { seo, setSeo ,setError} = useContext(Context);
//   const collections = useSelector(state => state.books.collections);
//   const [search, setSearch] = useState("");

//     const isNative = Capacitor.isNativePlatform();
//   const [filterType, setFilterType] = useState("Filter");
//   const {openDialog,closeDialog,dialog,resetDialog}=useDialog()
//   const { workshops, stories, prompts, location } = useProfileDependentEffects(currentProfile, isGlobal);
//   const [feedback, setFeedback] = useState("");
//   const [loading,setLoading]=useState(false);
//   const [whatsHappeningList,setWhatsHappeningList]=useState(stories)
 
//     const sortedWorkshops = useMemo(() => {
//   return [...workshops].sort((a,b) => a.title.localeCompare(b.title));
// }, [workshops]);
//     const filteredPrompts = useMemo(() => {
//       if(!prompts){
//         return []
//       }
//   return prompts.filter(p => p?.story && p?.story?.data); // or any filter you need
// }, [prompts]);

//   const filterTypes = {
//     filter: "Filter",
//     recent: "Recent",
//     oldest: "Oldest",
//     feedback: "Feedback",
//     AZ: "A-Z",
//     ZA: "Z-A"
//   };




//  useEffect(() => {
//   if (currentProfile) {
//     setSeo(prev => ({
//       ...prev,
//       title: `Plumbum (${currentProfile.username}) Home`,
//       description: `Welcome to ${currentProfile.username}'s home on Plumbum.`,
//       url: `https://plumbum.app/${currentProfile.username}`,
//     }));
//   }
// }, [currentProfile, setSeo]);

//   const filteredSortedStories = useMemo(() => {
//     let result = stories || [];

//     if (filterType === filterTypes.feedback) {
//       result = result.filter(s => s.needsFeedback);
//     } else {
//       switch (filterType) {
//         case filterTypes.recent:
//           result = [...result].sort((a, b) => new Date(b.updated) - new Date(a.updated));
//           break;
//         case filterTypes.oldest:
//           result = [...result].sort((a, b) => new Date(a.updated) - new Date(b.updated));
//           break;
//         case filterTypes.AZ:
//           result = [...result].sort((a, b) => a.title.localeCompare(b.title));
//           break;
//         case filterTypes.ZA:
//           result = [...result].sort((a, b) => b.title.localeCompare(a.title));
//           break;
//         default:
//           break;
//       }
//     }

//     if (search.trim().length > 0) {
//       const lowerSearch = search.toLowerCase();
//       result = result.filter(s => s.title && s.title.toLowerCase().includes(lowerSearch));
//     }

//     return result;
//   }, [stories, filterType, search]);

//   const filteredSortedCollections = useMemo(() => {
//     let result = collections || [];
//     if(filterType==filterTypes.feedback){
//       result = collections.filter(col=>col.type=="feedback"||col.purpose.toLowerCase().includes("feedback"))
//     }
//     switch (filterType) {
//       case filterTypes.AZ:
//         result = [...result].sort((a, b) => a.title.localeCompare(b.title));
//         break;
//       case filterTypes.ZA:
//         result = [...result].sort((a, b) => b.title.localeCompare(a.title));
//         break;
//       case filterTypes.recent:
//         result = [...result].sort((a, b) => new Date(b.updated) - new Date(a.updated));
//         break;
//       case filterTypes.oldest:
//         result = [...result].sort((a, b) => new Date(a.updated) - new Date(b.updated));
//         break;
//       default:
//         break;
//     }

//     if (search.trim().length > 0) {
//       const lowerSearch = search.toLowerCase();
//       result = result.filter(c => c && c.title && c.title.toLowerCase().includes(lowerSearch));
//     }

//     return result;
//   }, [collections, filterType, search]);



//   const ClickWriteAStory = debounce(() => {
//     if (currentProfile?.id) {
//       sendGAEvent("Create", "Write a Story", "Click Write Story");
//       dispatch(createStory({
//         profileId: currentProfile.id,
//         privacy: true,
//         type: PageType.text,
//         title: "Unititled",
//         commentable: true
//       })).then(res => checkResult(res, payload => {
//         if (payload.story) {
//           dispatch(setEditingPage({ page: payload.story }));
//           dispatch(setPageInView({ page: payload.story }));
//         router.push(Paths.editPage.createRoute(payload.story.id),'forward', 'push');
//         }else{
//           windowl.alert("COULD NOT CREATE STORY")
//         }
//       },err=>{
//         // setErrorLocal(err.message)
//       }));
//     }
//   }, 5);



//   const getFile = async (file) => {
//     try {
//       const accessToken = (await Preferences.get({ key: "googledrivetoken" })).value;
//       if (!file?.id || !accessToken) return;

//       const url = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/html`;
//       const response = await axios.get(url, {
//         headers: { 'Authorization': `Bearer ${accessToken}` },
//         responseType: 'text'
//       });

//       const htmlContent = response.data;
//       dispatch(createStory({
//         profileId: currentProfile.id,
//         data: htmlContent,
//         isPrivate: true,
//         approvalScore: 0,
//         type: PageType.text,
//         title: file.name,
//         commentable: false
//       })).then(res => checkResult(res, ({ story }) => {
    
//         if (story) {
          
//           dispatch(setEditingPage({ page:story }));
//           dispatch(setPageInView({ page:story }));
//           dispatch(setHtmlContent({ html:story.data })); 
//           router.push(Paths.editPage.createRoute(story.id),'forward', 'push');
  
//         }
  
//       }, err =>{}))
//         //  setErrorLocal(err.message)
//         // )
      
//     } catch (error) {
//       console.error("Error fetching Google Doc:", error);
//       // setErrorLocal(error.message);
//     }
//   };

// // const openFeedback=(item,isFeedback)=>{
// //    openDialog({...dialog,disagree:null,agree:null,disagreeText:null,scrollY:false,text:
// //     <FeedbackDialog
  
// //       page={item}
 
// //       isFeedback={isFeedback}
// //       handleChange={setFeedback}
// //       handleFeedback={(item) => {
      
// //            closeDialog()
// //         const params = { ...item, description:feedback, page: item, id: item.id, needsFeedback: true };
// //         dispatch(updateStory(params)).then(res => {
// //           checkResult(res, payload => {
         
// //       if (payload.story) router.push(Paths.workshop.createRoute(payload.story.id,"forward"));
// //           });
// //         });
// //       }}
// //       handlePostPublic={() => {resetDialog()}}
// //       handleClose={() => setFeedback(null)}
// //     />})
// //               dispatch(setPageInView({ page: item }));
// //             }


// useEffect(() => {
//   if (stories && stories.length > 0) {
//     let sort = [...stories].sort((a,b)=>new Date(b.updated)-new Date(a.updated))
//     setWhatsHappeningList(sort);
//   }
// }, [stories]);

//     useIonViewWillEnter(() => {
//   const initProfile = async () => {
//     if (!currentProfile) {
//       await dispatch(getCurrentProfile());
//     }

//     // Only run after profile exists
//     if (currentProfile) {
//       fetchStories();
//       fetchPrompts();
//       fetchWorkshops();
//       isGlobal && (isNative ? requestLocation() : webRequestLocation());
//     }

//     await getDriveToken();
//   };

// }, [currentProfile]);
// const handleGlobal=()=>{ setIsGlobal(!isGlobal)}

//   if (!currentProfile) {
//     return (
//       // <IonContent fullscreen={true} className='pt-12' style={{'--background': '#f4f4e0'}}>
//         <div>
//         <IonSpinner />
//         </div>
//         // </IonContent>
//     );
//   }


// return<ErrorBoundary>

   

//   <div  className='mt-12 mb-4'>
// <div className="relative flex flex-col justify-around mx-auto mt-2 max-w-[60rem] rounded-lg gap-4">

//     <div>
//     <h4 className='text-[1rem] px-4 text-emerald-800 font-bold mb-4'>
//       What's happening in your communities
//     </h4><div >
//    <IonList style={{backgroundColor:"#f4f4e0"}} ><div className='flex flex-row  bg-cream overflow-x-auto overflow-y-hidden  w-full'>
//      {whatsHappeningList.length==0?[1,2,3].map(t=><div
//      style={{backgroundColor:"#f4f4e0"}} className='skeleton mx-4 min-w-[20em] min-h-[20em]'/>):whatsHappeningList.map(story=>
// // 

//   <StoryItem page={story} isGrid={true}/>
  
// )}
//      </div></IonList></div>
//     </div>
//    <span className=''><div className='flex flex-row'>     <h4 className='text-[1rem] px-4 text-emerald-800 font-bold mb-4'>

//      Workshops near you 
//     </h4>
//    <input 
//   type="checkbox" 
//   checked={isGlobal} 
//   onChange={handleGlobal} 
//   className={`
//     toggle 
//     mx-4
//     border-2 border-emerald-800 border-opacity-50 my-auto
//     ${!isGlobal ? 'toggle-success bg-emerald-600' : 'toggle-success bg-slate-400'} 
    
//   `} 
// /><h4> {isGlobal?"Global":"Local"}</h4></div>
// {/* <IonList> */}

//   {/* <div className='flex flex-row  overflow-scroll'> */}
// <div className="flex flex-row overflow-scroll gap-4 px-4 py-4">
//   {sortedWorkshops.map((workshop) => (
//     <WorkshopItem key={workshop.id} item={workshop} router={router} />
//   ))}
// </div>

//   {/* </div> */}
// {/* </IonList> */}

// </span> 
//       <h4 className='text-[1rem] px-4 text-emerald-800 font-bold mb-4'>
//      Writing Prompts for you
//     </h4>
 
//       {/* <IonList> */}
//            <div className='flex-row bg-cream  px-4 overflow-scroll flex min-h-[20em] gap-4'>
//         {filteredPrompts.length==0?[1,2,3].map(t=><div className='skeleton min-w-[20em] min-h-[20em]'/>):filteredPrompts.map(({story})=><StoryItem page={story} isGrid={true} />)}
//       </div>
//    {/* </IonList> */}

//     <div className="flex flex-col items-center justify-cetner h-[15em] bottom-0  mt-4  md:items-start gap-4 w-full md:w-2/3  ">

//       {/* Row 1: Write a Story + Create Collection */}
    


//     </div>
//   </div>

//   {/* Search + Tabs stay unchanged */}
//   <div className='mx-auto md:mt-8 flex flex-col md:w-page'>
  

//   </div>
// </div>
// </ErrorBoundary>
// // </IonContent>
// }

// export default HomeContainer

// const WorkshopItem = ({ item, router }) => {
//   return (
//     <div
//       className="bg-white shadow-md rounded-xl p-4 min-w-[15rem] cursor-pointer hover:shadow-xl transition-shadow duration-200"
//       onClick={() => {
//         const targetPath = Paths.collection.createRoute(item.id);
  
//           router.push(targetPath, "forward");
  
//       }}
//     >
//       <div className="flex flex-col justify-between h-full">
//         <h2 className="text-lg font-semibold text-emerald-800 mb-2 truncate">
//           {item.title}
//         </h2>
//         <p className="text-sm text-gray-600 line-clamp-3">
//           {item.description || "No description available."}
//         </p>
//         <div className="mt-2 flex items-center justify-between">
//           <span className="text-xs text-gray-500">
//             {item.location || "Online / TBD"}
//           </span>
//           <span className="text-xs font-bold text-emerald-600">
//             {item.participants ? `${item.participants} participants` : ""}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

import { useEffect, useState, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createStory, fetchRecommendedStories, updateStory, getPrompts } from '../actions/StoryActions';
import { setPageInView, setEditingPage, setHtmlContent } from '../actions/PageActions.jsx';
import { sendGAEvent } from '../core/ga4.js';
import Paths from '../core/paths';
import checkResult from '../core/checkResult';
import { PageType } from '../core/constants';
import Context from '../context';
import { IonText, IonContent, IonSpinner, IonList, IonItem, IonLabel, IonToggle, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { Preferences } from '@capacitor/preferences';
import axios from "axios";
import { debounce } from 'lodash';
import ErrorBoundary from '../ErrorBoundary.jsx';
import { getCurrentProfile } from '../actions/UserActions.jsx';
import { findWorkshopGroups } from '../actions/WorkshopActions.jsx';
import requestLocation from '../core/requestLocation.js';
import StoryItem from '../components/page/StoryItem.jsx';


// Section Header Component
const SectionHeader = ({ title, right }) => (
  <div className="flex items-center justify-between px-1 mb-2 mt-6">
    <IonText className="text-lg font-semibold text-gray-900">{title}</IonText>
    {right}
  </div>
);

// Workshop Card Component
const WorkshopItem = ({ item, router }) => (
  <IonItem  style={{"--background":"#f4f4e0"}} onClick={() => router.push(Paths.collection.createRoute(item.id))} className="bg-cream ">
    <IonLabel>
      <h2 className="text-md font-semibold text-emerald-800 truncate">{item.title}</h2>
      <p className="text-sm text-gray-600 line-clamp-3">{item.description || "No description available."}</p>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{item.location || "Online / TBD"}</span>
        {item.participants ? <span className="font-bold text-emerald-600">{item.participants} participants</span> : null}
      </div>
    </IonLabel>
  </IonItem>
);

// Hook for fetching profile-dependent data
function useProfileDependentEffects(currentProfile, isGlobal) {
  const dispatch = useDispatch();
  const isNative = Capacitor.isNativePlatform();

  const [results, setResults] = useState({
    workshops: [],
    stories: [],
    prompts: [],
    location: null,
  });

  const fetchPrompts = async () => {
    try {
      const res = await dispatch(getPrompts());
      checkResult(res, ({ prompts }) => {
        const sorted = [...prompts].sort((a,b)=>new Date(b.updated)-new Date(a.updated));
        setResults(prev => ({ ...prev, prompts: sorted }));
      });
    } catch (err) { console.error("Failed fetching prompts:", err); }
  };

  const fetchStories = async () => {
    try {
      const res = await dispatch(fetchRecommendedStories());
      checkResult(res, ({ stories }) => setResults(prev => ({ ...prev, stories })));
    } catch (err) { console.error("Failed fetching stories:", err); }
  };

  const fetchWorkshops = async () => {
    if (!currentProfile) return;
    try {
      const res = await dispatch(findWorkshopGroups({
        location: currentProfile.location,
        radius: 50,
        global: isGlobal
      }));
      checkResult(res, ({ groups }) => {
        const sorted = [...groups].sort((a,b)=>new Date(b.updated)-new Date(a.updated));
        setResults(prev => ({ ...prev, workshops: sorted || [] }));
      });
    } catch (err) { console.error("Failed fetching workshops:", err); }
  };

  const fetchLocation = () => {
    if (!isGlobal) return;
    if (isNative) requestLocation();
    else navigator.geolocation.getCurrentPosition(
      pos => setResults(prev => ({ ...prev, location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } })),
      err => console.error("Location error:", err)
    );
  };

  useEffect(() => {
    if (!currentProfile) return;
    fetchPrompts();
    fetchStories();
    fetchWorkshops();
    fetchLocation();
  }, [currentProfile, isGlobal]);

  return results;
}

// Main HomeContainer Component
function HomeContainer() {
  const [isGlobal, setIsGlobal] = useState(true);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const router = useIonRouter();
  const { seo, setSeo } = useContext(Context);

  const currentProfile = useSelector(state => state.users.currentProfile);
  const collections = useSelector(state => state.books.collections);

  const { workshops, stories, prompts } = useProfileDependentEffects(currentProfile, isGlobal);
  const [whatsHappeningList, setWhatsHappeningList] = useState([]);

  const sortedWorkshops = useMemo(() => [...workshops].sort((a,b) => a.title.localeCompare(b.title)), [workshops]);
  const filteredPrompts = useMemo(() => prompts?.filter(p => p?.story?.data) || [], [prompts]);

  // Update “What’s Happening” section
  useEffect(() => {
    if (stories?.length) {
      const sorted = [...stories].sort((a,b)=>new Date(b.updated)-new Date(a.updated));
      setWhatsHappeningList(sorted);
    }
  }, [stories]);

  useEffect(() => {
    if (!currentProfile) return;
    setSeo(prev => ({
      ...prev,
      title: `Plumbum (${currentProfile.username}) Home`,
      description: `Welcome to ${currentProfile.username}'s home on Plumbum.`,
      url: `https://plumbum.app/${currentProfile.username}`,
    }));
  }, [currentProfile, setSeo]);

  const handleGlobal = () => setIsGlobal(!isGlobal);

  const ClickWriteAStory = debounce(() => {
    if (!currentProfile?.id) return;
    sendGAEvent("Create", "Write a Story", "Click Write Story");
    dispatch(createStory({
      profileId: currentProfile.id,
      privacy: true,
      type: PageType.text,
      title: "Untitled",
      commentable: true
    })).then(res => checkResult(res, payload => {
      if (!payload.story) return window.alert("COULD NOT CREATE STORY");
      dispatch(setEditingPage({ page: payload.story }));
      dispatch(setPageInView({ page: payload.story }));
      router.push(Paths.editPage.createRoute(payload.story.id), 'forward', 'push');
    }));
  }, 5);

  if (!currentProfile) return <div className="flex justify-center mt-12"><IonSpinner /></div>;

  return (
    <ErrorBoundary>
 <IonContent fullscreen={true} className='pt-12' style={{'--background': '#f4f4e0'}}>
        <div className="max-w-[60rem] mx-auto px-4 mt-4">
          
          {/* Stories */}
          <SectionHeader title="What's happening in your communities" />
          <div className="flex gap-4 overflow-x-auto pb-2">
            {whatsHappeningList.length
              ? whatsHappeningList.map(story => <StoryItem key={story.id} page={story} isGrid />)
              : [1,2,3].map(i => <div key={i} className="skeleton min-w-[20em] min-h-[20em]" />)
            }
          </div>

          {/* Workshops */}
          <SectionHeader
            title="Workshops near you"
            right={
              <div className="flex items-center gap-2">
                <IonText className="text-sm">{isGlobal ? "Global" : "Local"}</IonText>
                <IonToggle checked={isGlobal} onIonChange={handleGlobal} />
              </div>
            }
          />
          {/* <IonList inset> */}
          <div className='flex-row col'>
            {sortedWorkshops.map(workshop => (
              <WorkshopItem key={workshop.id} item={workshop} router={router} />
            ))}
            </div>
          {/* </IonList> */}

          {/* Prompts */}
          <SectionHeader title="Writing Prompts for you" />
          <div className="flex flex-row gap-3">
            {filteredPrompts.length
              ? filteredPrompts.map(({ story }) => <StoryItem key={story.id} page={story} />)
              : [1,2,3].map(i => <div key={i} className="skeleton min-w-[20em] min-h-[20em]" />)
            }
          </div>
        </div>
      </IonContent>
    </ErrorBoundary>
  );
}

export default HomeContainer;