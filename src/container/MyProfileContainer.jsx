// import { useEffect, useState, useContext, useMemo, useLayoutEffect } from 'react';
// import "../styles/MyProfile.css";
// import { useDispatch, useSelector } from "react-redux";
// import { createStory, updateStory,  } from '../actions/StoryActions';
// import { setCollections} from '../actions/CollectionActions';
// import IndexList from '../components/page/IndexList';
// import Paths from '../core/paths';
// import { debounce } from 'lodash';
// import calendar from '../images/icons/calendar.svg'
// import settings from "../images/icons/settings.svg"
// import { setPageInView, setPagesInView, setEditingPage, setHtmlContent } from '../actions/PageActions.jsx';
// import { sendGAEvent } from '../core/ga4.js';
// import CreateCollectionForm from '../components/collection/CreateCollectionForm';
// import checkResult from '../core/checkResult';
// import { PageType } from '../core/constants';
// import ProfileInfo from '../components/profile/ProfileInfo';
// import Context from '../context';
// import FeedbackDialog from '../components/page/FeedbackDialog';
// import { IonText, IonInput, IonContent, IonSpinner, IonPage,  useIonViewWillEnter, IonImg, useIonRouter } from '@ionic/react';
// import GoogleDrivePicker from '../components/GoogleDrivePicker.jsx';
// import { Preferences } from '@capacitor/preferences';
// import axios from "axios";
// import StoryCollectionTabs from '../components/page/StoryCollectionTabs.jsx';
// import ErrorBoundary from '../ErrorBoundary.jsx';

// import { getCurrentProfile } from '../actions/UserActions.jsx';
// import { useDialog } from '../domain/usecases/useDialog.jsx';

// function ButtonWrapper({ onClick, children, className = "", style = {}, tabIndex = 0, role = "button" }) {
//   return (
//     <span
//       role={role}
//       tabIndex={tabIndex}
//       onClick={onClick}
//       onKeyDown={e => {
//         if (e.key === 'Enter' || e.key === ' ') {
//           e.preventDefault();
//           onClick();
//         }
//       }}
//       className={`rounded-full flex btn items-center justify-center ${className}`}
//       style={style}
//     >
//       {children}
//     </span>
//   );
// }
// import { getGeocode } from "use-places-autocomplete";

// function MyProfileContainer({ presentingElement }) {
//   const [tab, setTab] = useState("page");
//   const router = useIonRouter()
//   const dispatch = useDispatch();

//   const currentProfile = useSelector(state=>state.users.currentProfile)
//   const stories = useSelector(state => state.pages.pagesInView);
//   // const dialog = useSelector(state => state.users.dialog);
//   const { seo, setSeo ,setError} = useContext(Context);
//   const collections = useSelector(state => state.books.collections);
//   const [search, setSearch] = useState("");
//   const [filterType, setFilterType] = useState("Filter");
//   const [driveToken, setDriveToken] = useState(null);
//   const [description, setFeedback] = useState("");
//   const [errorLocal, setErrorLocal] = useState(null);
//   const [feedbackPage, setFeedbackPage] = useState(null);
//   const {openDialog,closeDialog,dialog,resetDialog}=useDialog()
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

// // Add this effect to MyProfileContainer
// // useEffect(() => {
// //   const syncProfile = async () => {
// //     if (!currentProfile) {
// //       const { value } = await Preferences.get({ key: "token" });
// //       if (value) {
// //         dispatch(getCurrentProfile());
// //       } else {
// //         router.push("/");
// //       }
// //     }
// //   };
// //   syncProfile(); // call it directly
// // }, [currentProfile, dispatch, router]);


//   const getDriveToken = async () => {
//     try {
//       const accessToken = (await Preferences.get({ key: "googledrivetoken" })).value;
//       setDriveToken(accessToken);
//     } catch (error) {
//       console.error("Error fetching drive token:", error);
//       setErrorLocal(error.message);
//     }
//   };
  
//     useIonViewWillEnter(() => {
//   const init = async () => {
//     try {
     
//       await getDriveToken();
//     } catch (err) {
//       console.error("Initialization error:", err);
//       setErrorLocal(err.message);
//     }
//   };
//   init();

//   },[router])

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
//         setErrorLocal(err.message)
//       }));
//     }
//   }, 5);


//   const ClickCreateACollection = () => {
//      try {
//     sendGAEvent("create_collection_open", {
//       area: "collections",
//       modal_type: "create_collection",
//       user_id: currentProfile?.id || null, // optional, if you want to track
//     });
//   } catch (e) {
//     console.warn("GA event failed", e);
//   }

// openDialog({
//   // title: "Create Collection",
//   text: <CreateCollectionForm onClose={resetDialog} />,
//   disagreeText: "Close", // optional button
//   // onClose: closeDialog,
//   breakpoint: 1, // if you want a half-sheet style
// });

//   };

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
//            dispatch(setHtmlContent({ page:story.data }));
//           router.push(Paths.editPage.createRoute(story.id));
//           resetDialog()
//         }
//         // dispatch(setEditingPage({ page: story }));
//     // closeDialog()
//       }, err => setErrorLocal(err.message)));
//     } catch (error) {
//       console.error("Error fetching Google Doc:", error);
//       setErrorLocal(error.message);
//     }
//   };


  
// useEffect(() => {
//   if (!currentProfile) return;
//   if (currentProfile.stories && currentProfile.stories.length > 0) {
//     dispatch(setPagesInView({ pages: currentProfile.stories }));
//   }
//   if (currentProfile.collections && currentProfile.collections.length > 0) {
//     dispatch(setCollections({ collections: currentProfile.collections }));
//   }
// }, [currentProfile, dispatch]);


//   if (!currentProfile) {
//     return (
//       <IonContent>
//         <div>
//         <IonSpinner />
//         </div>
//         </IonContent>
//     );
//   }
// return<IonContent fullscreen={true} className='pt-12' style={{'--background': '#f4f4e0'}}><ErrorBoundary>

//                     <div className='flex mt-4  sm:pt-20 p-4 flex-row justify-between'>
//                          <IonImg  onClick={()=> router.push(Paths.editProfile,"forward")} className="bg-soft s mr-4 max-w-10 max-h-10 rounded-full p-2 " src={settings}/> 

          
                  
//                     </div>
//   <div >

//   <div className="relative flex flex-col md:flex-row justify-around mx-auto p-6 mt-2 max-w-[60rem] rounded-lg gap-6">

//     <div className="md:w-1/3 max-w-[60em] h-[16em] mb-[4em] flex justify-center md:justify-start">
//       <ProfileInfo profile={currentProfile} />
//     </div>
    

//   </div>

//   {/* Search + Tabs stay unchanged */}
//   <div className='mx-auto md:mt-8 flex flex-col md:w-page'>
//     <div className="flex items-center mb-8 mx-auto h-9 max-w-[85vw] pr-4 rounded-full bg-transparent">

//       <select
//         onChange={e => setFilterType(e.target.value)}
//         value={filterType}
//         className="select w-24 text-emerald-800 rounded-full bg-transparent"
//       >
//         {Object.entries(filterTypes).map(([, val]) => (
//           <option key={val} value={val}>{val}</option>
//         ))}
//       </select>
//     </div>

//     <div className='h-fit min-h-[55rem] mx-auto'>
//       <StoryCollectionTabs
//         tab={tab}
//         setTab={setTab}
//         colList={() => <IndexList type="collection" 
//         items={filteredSortedCollections} 
        
//         />}
//         storyList={() => (
//           <IndexList
//             type="story"
//             items={filteredSortedStories}
//             handleFeedback={item => {
//               setFeedbackPage(item);
//               dispatch(setPageInView({ page: item }));
//             }}
//           />
//         )}
//       />
//     </div>
// {/* 
//     <FeedbackDialog
//       presentingElement={presentingElement}
//       page={feedbackPage}
//       open={!!feedbackPage}
//       isFeedback
//       handleChange={setFeedback}
//       handleFeedback={() => {
//         if (!feedbackPage) return;
//         const params = { ...feedbackPage, description, page: feedbackPage, id: feedbackPage.id, needsFeedback: true };
//         dispatch(updateStory(params)).then(res => {
//           checkResult(res, payload => {
//             if (payload.story) navigate(Paths.workshop.createRoute(payload.story.id));
//           });
//         });
//       }}
//       handlePostPublic={() => {resetDialog()}}
//       handleClose={() => setFeedbackPage(null)}
//     /> */}
//   </div>
// </div>
// </ErrorBoundary></IonContent>
// }

// export default MyProfileContainer;
import React, { useContext, useEffect, useMemo, useState } from "react";
import { IonContent, useIonRouter } from "@ionic/react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { Preferences } from "@capacitor/preferences";
import { debounce } from "lodash";
// import fetchCity from "../core/fetchCity";
import Context from "../context";
import Enviroment from "../core/Enviroment";

import {
  fetchProfile,
  getCurrentProfile,
 
} from "../actions/UserActions";

import {
  getProtectedProfilePages,
  getPublicProfilePages,
  setPagesInView,
} from "../actions/PageActions";

import {
  getProtectedProfileCollections,
  getPublicProfileCollections,
  setCollections,
} from "../actions/CollectionActions";

import ErrorBoundary from "../ErrorBoundary";
import ProfileInfo from "../components/profile/ProfileInfo";
import fetchCity from "../core/fetchCity";
import Paths from "../core/paths";
import { createFollow, deleteFollow } from "../actions/FollowAction";
const TABS = {
  POSTS: "posts",
  COLLECTIONS: "collections",
  COMMUNITIES: "communities",
  ABOUT: "about",
};
function MyProfileContainer() {
    const { setSeo, setError,  } = useContext(Context);

  const profile = useSelector((state) => state.users.currentProfile);
  // console.log("POP>DS",profile)
  const collectionsRaw = useSelector((state) => state.books.collections?? []);
  console.log(collectionsRaw)
  const pagesRaw = useSelector((state) => state.pages.pagesInView ?? []);

  const dispatch = useDispatch();
  const router = useIonRouter();
  const { id } = useParams();

  const [tab, setTab] = useState(TABS.POSTS);
  const [search, setSearch] = useState("");
  const [following, setFollowing] = useState(null);

  // ── Derived
  const collections = useMemo(
    () => collectionsRaw.filter(Boolean).filter((col) => (search ? col.title?.toLowerCase().includes(search.toLowerCase()) : true)),
    [collectionsRaw, search]
  );
  const pages = useMemo(
    () => pagesRaw.filter(Boolean).filter((page) => (search ? page.title?.toLowerCase().includes(search.toLowerCase()) : true)),
    [pagesRaw, search]
  );
  const recentPosts = useMemo(
    () => [...pagesRaw].filter(Boolean).sort((a, b) => new Date(b.updated ?? b.created) - new Date(a.updated ?? a.created)).slice(0, 5),
    [pagesRaw]
  );
// ── Tabs constants ─────────────────────────────────────


// ── Pill Component ─────────────────────────────────────
const Pill = ({ label,onClick }) => (
  <span onClick={()=>onClick()}
  
  className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
    {label}
  </span>
);

// ── Section Label ─────────────────────────────────────
const SectionLabel = ({ children }) => (
  <p className="text-xs text-gray-400 uppercase tracking-wide">{children}</p>
);

// ── Search Bar ────────────────────────────────────────
// const SearchBar = ({ value, onChange }) => (

// );

// ── Follow Button ─────────────────────────────────────


// ── TabBar ────────────────────────────────────────────
const tabs = [
  { key: TABS.POSTS, label: "Posts" },
  { key: TABS.COLLECTIONS, label: "Collections" },
  { key: TABS.COMMUNITIES, label: "Communities" },
  { key: TABS.ABOUT, label: "About" },
];


const TabBar = ({ active, onChange }) => (
<div className="flex justify-center gap-2 bg-gray-100 rounded-xl p-1">
  {/* <div className="flex w-full max-w-md sm:max-w-xl justify-between"> */}
    {tabs.map((tab) => (
      <button
        key={tab.key}
        onClick={() => onChange(tab.key)}
        className={`
          flex-1 text-center py-1.5 text-sm rounded-lg transition
          ${active === tab.key 
            ? "text-white bg-soft shadow-sm" 
            : "bg-softBlue text-soft"}
        `}
      >
        {tab.label}
      </button>
    ))}
  {/* </div> */}
</div>)
{/* <div className="flex justify-center bg-gray-100 rounded-xl p-1">
  <div className="flex gap-2 w-full sm:w-auto sm:max-w-[80%] justify-between sm:justify-center">
   
    {tabs.map((tab) => (
      <button
        key={tab.key}
        style={{fontSize:"1em"}}
        onClick={() => onChange(tab.key)}
        className={`
   mx-2 text-sm py-1.5 rounded-lg transition
          ${active === tab.key ? "text-white bg-soft  shadow-sm" : "bg-softBlue text-soft"}
        `}
      >
        {tab.label}
        
      </button>
    ))}
    </div>
  </div> */}

const FollowButton = ({ following, onClick, isSelf }) => {

  if (isSelf) return null;
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-1.5 text-sm rounded-lg transition
        ${following ? "bg-gray-200 text-gray-800" : "bg-black text-white"}
      `}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
};
// ── Communities Panel ─────────────────────────────────
const CommunitiesPanel = ({ profile }) => {
const communities  = profile.collections.filter(col=>col.type=="library")
console.log(communities)
  // c= profile?.communities ?? [];
  if (!communities.length)
    return <div className="text-center py-12 text-sm text-gray-400">No communities yet.</div>;

  return (
    <div className="space-y-4">
      {communities.map((c) => (
        <div key={c.id} onClick={()=>router.push(Paths.collection.createRoute(c.id))}className="p-4 rounded-xl bg-gray-50">
          <p className="text-sm font-medium text-gray-900">{c.title}</p>
          {c.purpose&& <p className="text-sm text-gray-500 mt-1">{c.purpose}</p>}
        </div>
      ))}
    </div>
  );
};

// ── About Panel ──────────────────────────────────────
const AboutPanel = ({ profile }) => {
  const [locationName,setLocationName]=useState("")
  useEffect(()=>{
    
  async function city(){let address =await fetchCity(profile.location)
if(locationName.length>0){
    setLocationName(address)
}
  }
  profile?.location ?setLocationName(profile.location.city):city()
  },[profile])
  if (!profile) return null;

  const hashtags = profile.hashtags ?? profile.tags ?? [];

  return (
    <div className="space-y-6">
      {(profile.bio || profile.selfStatement) && (
        <p className="text-sm text-gray-700 leading-relaxed">
          {profile.bio ?? profile.selfStatement}
        </p>
      )}

      <div>
          <p className="text-xs text-gray-400 uppercase">Location</p>
          <p className="text-sm text-gray-700 mt-1">{locationName}</p>
        </div>


      {hashtags.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase mb-2">Interests</p>
          <div className="flex flex-wrap gap-2">
            {hashtags.slice(0, 5).map((tag, i) => (
              <Pill key={i} onClick={()=>router.push(Paths.hashtag.createRoute(tag.id))}label={`#${typeof tag === "string" ? tag : tag.name ?? tag.tag}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Minimal Empty State ──────────────────────────────
const EmptyState = ({ text }) => (
  <div className="text-center py-12">
    <p className="text-sm text-gray-400">{text}</p>
  </div>
);

// ── Stub Components for Missing Ones ────────────────
const PageList = ({ items }) => (

  <div className="space-y-2">
    {items.map((p) => {

      return<div key={p.id} onClick={()=>{router.push(Paths.page.createRoute(p.id))}} className="p-2 border border-seaBlue rounded">{p?.title?.length>0 ? p.title:"Untitled"}</div>
 } )}
  </div>
);
const IndexList = ({ items }) => (
  <div className="space-y-2">
    {items.map((i) => (
      
      <div key={i.id} onClick={()=>router.push(Paths.collection.createRoute(i.id))} className="p-2 border rounded">{i.title ??i.name}</div>
    ))}
  </div>
);
const ExploreList = () => <div className="text-center text-gray-400 py-4">Explore placeholder</div>;
const StatChip = ({ value, label }) => (
  <div className="flex flex-col text-center">
    <span className="font-bold">{value}</span>
    <span className="text-xs text-gray-400">{label}</span>
  </div>
);

// ── Main Container ──────────────────────────────────


useEffect(() => {
  if (!profile) return;
  if (profile.stories) {
    console.log("DSSDX",profile.stories)
    dispatch(setPagesInView({ pages: profile.stories }));
  }

  if (profile.collections) {
    dispatch(setCollections
   
      ({ collections: profile.collections }));
  }
}, [profile, dispatch]);


  // ── Auth Sync
  useEffect(() => {
    const syncProfile = async () => {
      if (!profile) {
        const { value } = await Preferences.get({ key: "token" });
        if (value) dispatch(getCurrentProfile());
        else router.push("/");
      }
    };
    syncProfile();
  }, [profile, dispatch, router]);

  // ── Fetch
  useEffect(() => {
    dispatch(fetchProfile({ id }));

    const fetchContent = async () => {
      const token = (await Preferences.get({ key: "token" })).value;

      if (token && profile?.id === id) {
        dispatch(getProtectedProfilePages({ profile: { id } }));
        dispatch(getProtectedProfileCollections({ profile: { id } }));
      } else {
        dispatch(getPublicProfilePages({ profile: { id } }));
        dispatch(getPublicProfileCollections({ profile: { id } }));
      }
    };

    fetchContent();
  }, [id, dispatch]);

  // ── Follow logic
  useEffect(() => {
    if (!profile) return;
    if (profile.id === profile.id) setFollowing(true);
    else setFollowing(profile.followers?.find((f) => f.followerId === profile.id) ?? null);
  }, [ profile]);

  const onClickFollow = debounce(() => {
    // if (!currentProfile) return setError("Please login first!");
    if (!profile  === profile.id) return;

    if (following) dispatch(deleteFollow({ follow: following }));
    else dispatch(createFollow({ follower: profile, following: profile }));
  }, 200);

  // const isSelf = currentProfile?.id === profile?.id;

  // ── SEO
  useEffect(() => {
    if (!profile) return;
    setSeo({
      title: `${profile.username} on Plumbum`,
      description: profile.bio || profile.selfStatement || `Read stories by ${profile.username}.`,
      url: `${Enviroment.domain}/profile/${profile.id}`,
      type: "profile",
    });
  }, [profile, setSeo]);

  // ── Render
  return (
    <ErrorBoundary>
      <IonContent             style={{ "--background": "#f4f4e0" }} fullscreen className="bg-cream">
        <div className="max-w-2xl mx-auto px-4 pb-24 pt-safe space-y-8">

          {/* Header */}
          <div className="space-y-6 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ProfileInfo profile={profile} compact />
              </div>
             
            </div>

            <div className="flex justify-between text-center">
              {/* <StatChip value={pagesRaw.length} label="Posts" />
              <StatChip value={collectionsRaw.length} label="Collections" /> */}
              <StatChip value={profile?.followers?.length} label="Followers" />
              <StatChip value={profile?.following?.length} label="Following" />
            </div>

            {(profile?.bio || profile?.selfStatement) && (
              <p className="text-sm text-gray-700 leading-relaxed">
                {profile.bio ?? profile.selfStatement}
              </p>
            )}

            {(profile?.hashtags ?? profile?.tags)?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(profile.hashtags ?? profile.tags).slice(0, 5).map((tag, i) => (
                  <Pill key={i} onClick={()=>router.push(Paths.hashtag.createRoute(tag.id))}label={`#${typeof tag === "string" ? tag : tag.name ?? tag.tag}`} />
                ))}
              </div>
            )}

            {(profile?.communities?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 uppercase">Communities</p>
                <div className="flex flex-wrap gap-2">
                  {profile.communities.slice(0, 3).map((c) => <Pill 
                   key={c.id} 
                   onClick={()=>router.push(Paths.collection.createRoute(c.id)
                  )}
                  label={c.title} />)}
                </div>
              </div>
            )}
          </div>

          {/* Search + Tabs */}
          <div className="space-y-4">
              <div className="w-full">
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search"
      className="
      border-soft border rounded-full
        w-full px-4 py-2
  bg-cream
        text-sm text-soft
        placeholder-gray-400
        focus:outline-none focus:ring-1 focus:ring-gray-300
      "
    />

  </div>
      <FollowButton following={following} onClick={()=>{onClickFollow()}}isSelf={true}
      />
            <TabBar active={tab} onChange={setTab} />
          </div>

          {/* Content */}
          <div className="space-y-10 min-h-[40rem]">
            {tab === TABS.POSTS && (
              <>
                {search.length==0 && recentPosts.length > 0 && (
                  <section className="space-y-4">
                    <SectionLabel>Recent</SectionLabel>
                    <PageList items={recentPosts} />
                  </section>
                )}

                {pages.length > 0 && (
                  <section className="space-y-4">
                    <SectionLabel>All Posts</SectionLabel>
                    <PageList items={pages} />
                  </section>
                )}

                {pages.length === 0 && <EmptyState text="No posts yet." />}
              </>
            )}

            {tab === TABS.COLLECTIONS && (
              collections.length > 0 ? <IndexList items={collections} /> : <EmptyState text="No collections yet." />
            )}

            {tab === TABS.COMMUNITIES && <CommunitiesPanel profile={profile} />}
            {tab === TABS.ABOUT && <AboutPanel profile={profile} />}
          </div>

          {/* Explore */}
          <div className="pt-6 border-t border-gray-100">
            <ExploreList />
          </div>
        </div>
      </IonContent>
    </ErrorBoundary>
  );
}

export default MyProfileContainer;