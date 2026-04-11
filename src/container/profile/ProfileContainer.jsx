 import {  IonContent, useIonViewDidLeave, useIonViewWillEnter,  } from '@ionic/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { createFollow, deleteFollow } from '../../actions/FollowAction';

import Context from '../../context';


import {
  fetchProfile,

  
 
} from "../../actions/UserActions"
import loadingGif from "../../images/loading.gif"
import {
getPublicProfilePages,
getProtectedProfilePages,
  setPagesInView,
} from "../../actions/PageActions";

import {
 
  getProtectedProfileCollections,
  getPublicProfileCollections,
  setCollections,
} from "../../actions/CollectionActions";
import Enviroment from '../../core/Enviroment';
import ErrorBoundary from "../../ErrorBoundary";
import ProfileInfo from "../../components/profile/ProfileInfo";
import fetchCity from "../../core/fetchCity";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useIonRouter } from '@ionic/react';
import { useParams } from 'react-router';
import debounce from '../../core/debounce';
import { Preferences } from '@capacitor/preferences';
import Paths from '../../core/paths';
import checkResult from '../../core/checkResult';
import TabBar from '../../components/TabBar';
import PaginatedPageList from '../../components/page/PaginatedPageList';
import PageProfileList from '../../components/page/PageProfileList';
import FollowButton from '../../components/profile/FollowButton';
import CommunitiesPanel from '../../components/profile/CommunitiesPanel';
import AboutPanel from '../../components/profile/AboutPanel';
const TABS = {
  POSTS: "posts",
  COLLECTIONS: "collections",
  COMMUNITIES: "communities",
  ABOUT: "about",
};

const tabWrapper = "max-w-lg mx-auto px-4 pb-4"// same for both containers
const WRAP           = "max-w-2xl mx-auto px-4";
const PAGE_PADDING_Y = "pb-24 pt-safe";
const HEADER_PADDING = "py-8";
const HEADER_STACK   = "space-y-6";
const STATS_GAP      = "flex gap-8";
const TOOLBAR_STACK  = "space-y-4";
const SEARCH_ROW     = "flex items-center py-8 flex-row gap-3";
const CONTENT_STACK  = "space-y-10 min-h-[40rem]";
const SECTION_STACK  = "space-y-4";
const SKELETON_PADDING = "px-4 py-8";
const SKELETON_STACK = "space-y-8";

function ProfileContainer() {
    const { setSeo, setError,  } = useContext(Context);

  const{ profileInView:profile, currentProfile }= useSelector((state) => state.users);
  const [followingCount,setFollowingCount]=useState(0)
    const [followerCount,setFollowerCount]=useState(0)
      const [search, setSearch] = useState("");
  const pagesRaw = useSelector((state) => state.pages.pagesInView ?? []);
  const collectionsRaw = useSelector((state) => state.books.collections?? []);
  const collections = useMemo(
    () => collectionsRaw.filter(Boolean).filter((col) => (search ?col && col?.childCollections?.length == 0&& col.title?.toLowerCase().includes(search.toLowerCase()) : true)),
    [collectionsRaw, search]
  );
  const communities = useMemo(
    () => collectionsRaw.filter(col=>(col && col.type=="library"||col?.childCollections?.length>0)).filter((col) => (search ? col.title?.toLowerCase().includes(search.toLowerCase()) : true)),
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

const [isLoading, setIsLoading] = useState(true);
const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch();
  const router = useIonRouter();
  const { id } = useParams();

  const [tab, setTab] = useState(TABS.POSTS);

useEffect(() => {
  if (profile) {
    // slight delay prevents flicker on fast loads
    const t = setTimeout(() => {
      setIsLoading(false);
      setIsReady(true);
    }, 120); // 100–200ms sweet spot

    return () => clearTimeout(t);
  }
}, [profile]);
  // ── Derived

// ── Tabs constants ─────────────────────────────────────

useEffect(()=>{
   if(profile){
      dispatch(getPublicProfilePages({profile}))
      dispatch(getPublicProfileCollections({profile}))
   }
},[profile])
// ── Pill Component ─────────────────────────────────────
const Pill = ({ label,onClick }) => (
  <span onClick={onClick} className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
    {label}
  </span>
);

// ── Section Label ─────────────────────────────────────
const SectionLabel = ({ children }) => (
  <p className="text-xs text-gray-400 uppercase tracking-wide">{children}</p>
);

useIonViewDidLeave(() => {
  dispatch(setPagesInView({ pages: [] }));
  dispatch(setCollections({ collections: [] }));
});
    
    const [following, setFollowing] = useState(null);
   

     const onClickFollow = debounce(() => {
    // if (!currentProfile) return setError("Please login first!");
    if (profile.id  === currentProfile.id) return;

    if (following) dispatch(deleteFollow({ follow: following })).then(res=>{
           setFollowerCount(prev=>prev-1)
        setFollowing(null)
    })
    else dispatch(createFollow({ follower:currentProfile, following: profile })).then((res)=>{
      checkResult(res,payload=>{
     setFollowerCount(prev=>prev+1)
     
          setFollowing(payload.follow)
      },err=>{

      })
    });
  }, 200);
   




// const AboutPanel = ({ profile:prof,city}) => {


//   const hashTags = prof?.hashtags ?? [];
//   if (!prof) return null;


//   return (
//     <div className="space-y-6">
//     {/* <div>
//         <p className="text-sm text-gray-700 leading-relaxed">
//           {  prof.selfStatement}
//         </p>
//         </div> */}
//             <div className="space-y-6 px-4">
//       {(profile.bio || profile.selfStatement) && (
//         <p className="text-sm text-gray-700 leading-relaxed">
//           {profile.bio ?? profile.selfStatement}
//         </p>
//       )}

  
//   <p className="text-xs text-gray-400 uppercase">Location</p>
// { isPendingLocation ? (
//         <div className="mt-1 h-4 w-32 bg-gray-200 skeleton rounded animate-pulse shadow-sm" />
//       ) : (
//         <p className="text-sm text-gray-700 mt-1">{locationName}</p>
//       )}
//         {/* {!isPendingLocation &&locationName.length>0 ? (
//           <p className="text-sm text-gray-700 mt-1">{locationName}</p>
//         ) : (
//           <div className="mt-1 h-4 w-32 bg-gray-200 rounded animate-pulse shadow-sm" />
//         )} */}
//       {hashTags.length > 0 && (
//         <div>
//           <p className="text-xs text-gray-400 uppercase mb-2">Interests</p>
//           <div className="flex flex-wrap gap-2">
//             {hashTags.slice(0, 5).map((tag, i) => (
//               <Pill key={i} onClick={()=>router.push(Paths.hashtag.createRoute(tag.id))}label={`#${tag.name }`} />
//             ))}
//           </div>
//         </div>
         
//       )}</div></div>)
//     }


{/* // ── Minimal Empty State ────────────────────────────── */}
const EmptyState = ({ text }) => (
  <div className="text-center py-12">
    <p className="text-sm text-gray-400">{text}</p>
  </div>
)
// ── Stub Components for Missing Ones ────────────────
const PageList = ({ items }) => (
  
  <div className="space-y-2">
    {items.map((p) => {
     
      return<div key={p.id} onClick={()=>router.push(Paths.page.createRoute(p.id))}className="p-2 border border-seaBlue rounded">{p?.title?.length>0 ? p.title:"Untitled"}</div>
 } )}
  </div>
);
const IndexList = ({ items ,router}) => (
  <div className="space-y-2">
    {items.map((i) => (
      <div onClick={()=>router.push(Paths.collection.createRoute(i.id))}key={i.id} className="p-2 border rounded-full bg-base-bg border-purple px-4 py-3">{i.title ??i.name}</div>
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
    dispatch(setPagesInView({ pages: profile.stories }));
  }

  if (profile.collections) {
    dispatch(setCollections
   
      ({ collections: profile.collections }));
  }
setFollowerCount(profile["_count"]?.followers)
setFollowingCount(profile["_count"]?.following)
}, [profile, dispatch]);




  // ── Fetch
  useIonViewWillEnter(() => {
    dispatch(fetchProfile({ id }));


  }, [id, dispatch]);

  // ── Follow logic




  
  useEffect(() => {
    if (!profile) return;
    setSeo({
      title: `${profile.username} on Plumbum`,
      description: profile.bio || profile.selfStatement || `Read stories by ${profile.username}.`,
      url: `${Enviroment.domain}/profile/${profile.id}`,
      type: "profile",
    });
  }, [profile, setSeo]);
const tabs = [
  { key: TABS.POSTS, label: "Posts" },
  { key: TABS.COLLECTIONS, label: "Collections" },
  { key: TABS.COMMUNITIES, label: "Communities" },
  { key: TABS.ABOUT, label: "About" },
];
 const [isSelf,setIsSelf]=useState(false)
useEffect(() => {
  if (!profile || !currentProfile) return;
  setIsSelf(profile.id === currentProfile.id);
}, [profile, currentProfile]);
  // ── Render
   const [locationName,setLocationName]=useState("Location not specified")
  const [isPendingLocation,setIsPendingLocation]=useState(true)
  useEffect(()=>{
    setIsPendingLocation(true)
    console.log("Fetching city for location:", profile?.location)
  async function city(){
    
    let address =await fetchCity(profile?.location)
    setLocationName(address)
    setIsPendingLocation(false)
  }
  profile?.location?.city?setLocationName(prof.location.city):profile?.location&& city()
  },[])
    
  return (
    <ErrorBoundary>
      
<IonContent style={{ "--background": Enviroment.palette.cream }} fullscreen>
  {/* <div className="relative max-w-2xl mx-auto px-4 pb-24 pt-safe"> */}
<div className={`${WRAP} ${PAGE_PADDING_Y}`}> 
    {/* 🔹 Skeleton Layer */}
    <div
      className={`
        absolute inset-0 transition-opacity duration-300
        ${isLoading ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      
      <ProfileSkeleton />
    </div>

    {/* 🔹 Real Content */}
    <div
      className={`
        transition-opacity duration-300
        ${isReady ? "opacity-100" : "opacity-0"}
      `}
    >
     


          {/* Header */}
         <div className={`${HEADER_PADDING} ${HEADER_STACK}`}>
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ProfileInfo profile={profile} compact />
              </div>
              </div> */}
<div className="flex items-center justify-between">
  <div className="flex items-center gap-4">

    {/* Avatar (inside ProfileInfo) */}
    <ProfileInfo profile={profile} compact />

    {/* Name + Username */}
    <div className="flex flex-col  leading-tight">
      {/* <span className="font-semibold text-base text-gray-900">
        {profile.displayName || "Unnamed"}
      </span> */}

      <span className=" ">
       <h6 className='text-[1rem] text-soft'>@{profile?.username?.toLowerCase()}</h6> 
      </span>
    </div>

  </div>
  
</div>
      {(communities?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 uppercase">Communities</p>
                <div className="flex flex-wrap gap-2 ">
            {communities.slice(0, 3).map((c) => <div >
                    <Pill
                   key={c.id} 
                  baseClass="border-blue bg-base-bg"
                  onClick={()=>router.push(Paths.collection.createRoute(c.id),"forward")}
                  label={c.title} /></div>)}
                </div>
              </div>
            )}
        <div className={STATS_GAP}>
             
              <StatChip value={followerCount} label="Followers" />
              <StatChip value={followingCount} label="Following" />
            </div>

            {(profile?.bio || profile?.selfStatement) && (
              <p className="text-sm text-gray-700 leading-relaxed">
                {profile.bio ?? profile.selfStatement}
              </p>
            )}

            {(profile?.hashtags ?? profile?.tags)?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(profile.hashtags ?? profile.tags).slice(0, 5).map((tag, i) => (
                  <Pill key={i} onClick={()=>router.push(Paths.collection.createRoute(tag.id))} label={`#${typeof tag === "string" ? tag : tag.name ?? tag.tag}`} />
                ))}
              </div>
            )}

            {(profile?.communities?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 uppercase">Communities</p>
                <div className="flex flex-wrap gap-2">
                  {profile.communities.slice(0, 3).map((c) => <Pill onClick={()=>router.push(Paths.collection.createRoute(c.id))} key={c.id} label={c.name} />)}
                </div>
              </div>
            )}
          </div>

          {/* Search + Tabs */}
          {/* <div className={`${SEARCH_ROW}`}> */}
              {/* <div className="w-full flex-row flex"> */}
              <div className={`${SEARCH_ROW}`}>
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
    <FollowButton isSelf={isSelf} prof={profile} onClick={onClickFollow}follow={following} current={currentProfile}  />
        </div>
  </div>
  <div className={tabWrapper}>
            <TabBar tabs={tabs} active={tab} onChange={setTab} />
            </div>
           
{/* <div> */}
      
          <div className={`${WRAP} space-y-10 min-h-[40rem]`}>
            {tab === TABS.POSTS && (
              <>
                {search.length==0 && recentPosts.length > 0 && (
                  <section className="space-y-4">
                    <SectionLabel>Recent</SectionLabel>
                    <PageProfileList items={recentPosts} router={router} />
                  </section>
                )}

                {pages.length > 0 && (
                  <section className="space-y-4">
                    <SectionLabel>All Posts</SectionLabel>
              
                    <PaginatedPageList items={pages} router={router}/>
                  </section>
                )}

                {pages.length === 0 && <EmptyState text="No posts yet." />}
              </>
            )}

            {tab === TABS.COLLECTIONS && (
              collections.length > 0 ? <div className='pt-8'><IndexList items={collections} router={router}/></div> : <EmptyState text="No collections yet." />
            )}

            {tab === TABS.COMMUNITIES && <CommunitiesPanel communities={communities} router={router} />}
            {tab === TABS.ABOUT && <AboutPanel router={router} profile={profile}  />}
          </div>

          {/* Explore */}
          <div className="pt-6 pb-10 border-t border-gray-100">
            <ExploreList />
          </div>
        </div>
    
      </IonContent>
    </ErrorBoundary>
  );
}

export default ProfileContainer;

function ProfileSkeleton() {
  return (
<div className={`animate-pulse ${SKELETON_PADDING} ${SKELETON_STACK}`}>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-base-300 skeleton"></div>
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-base-300 rounded skeleton"></div>
          <div className="h-3 w-24 bg-base-200 rounded skeleton"></div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between">
        {[1,2].map(i => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-4 w-10 bg-base-300 rounded skeleton"></div>
            <div className="h-3 w-16 bg-base-200 rounded skeleton"></div>
          </div>
        ))}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-base-200 rounded skeleton"></div>
        <div className="h-3 w-5/6 bg-base-200 rounded skeleton"></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-8 w-20 rounded-full bg-base-300 skeleton"></div>
        ))}
      </div>

      {/* Content blocks */}
      <div className="space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="h-24 w-full bg-base-200 rounded-xl skeleton"></div>
        ))}
      </div>
    </div>
  );
}