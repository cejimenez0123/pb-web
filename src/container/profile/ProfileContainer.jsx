 import {  IonContent, useIonViewDidLeave, useIonViewWillEnter,  } from '@ionic/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { createFollow, deleteFollow } from '../../actions/FollowAction';

import Context from '../../context';


import {
  fetchProfile,

  
 
} from "../../actions/UserActions"

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
const TABS = {
  POSTS: "posts",
  COLLECTIONS: "collections",
  COMMUNITIES: "communities",
  ABOUT: "about",
};
function ProfileContainer() {
    const { setSeo, setError,  } = useContext(Context);

  const{ profileInView:profile, currentProfile }= useSelector((state) => state.users);
  const [followingCount,setFollowingCount]=useState(0)
    const [followerCount,setFollowerCount]=useState(0)
  const collectionsRaw = useSelector((state) => state.books.collections?? []);

  const pagesRaw = useSelector((state) => state.pages.pagesInView ?? []);

  const dispatch = useDispatch();
  const router = useIonRouter();
  const { id } = useParams();

  const [tab, setTab] = useState(TABS.POSTS);
  const [search, setSearch] = useState("");


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

useEffect(()=>{
    if(currentProfile){
      dispatch(getProtectedProfilePages({profile}))
      dispatch(getProtectedProfileCollections({profile}))
    }else{
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
   



// ── Communities Panel ─────────────────────────────────
const CommunitiesPanel = ({prof}) => {
    // const prof = useSelector(state=>state.users.profileInView)
    if(!prof && !prof.collections)return null

const communities  = prof.collections.filter(col=>col.type=="library")
  
  if (!communities.length)
    return <div className="text-center py-12 text-sm text-gray-400">No communities yet.</div>;

  return (
    <div className="space-y-4">
      {communities.map((c) => (
        <div key={c.id} className="p-4 rounded-xl bg-gray-50">
          <p className="text-sm font-medium text-gray-900">{c.title}</p>
          {c.purpose&& <p className="text-sm text-gray-500 mt-1">{c.purpose}</p>}
        </div>
      ))}
    </div>
  );
};


const AboutPanel = ({ profile:prof }) => {
  const [locationName,setLocationName]=useState("")
  const [isPendingLocation,setIsPendingLocation]=useState(false)
  useEffect(()=>{
    setIsPendingLocation(true)
    console.log("Fetching city for location:", prof.location)
  async function city(){let address =await fetchCity(prof.location)
  
    setLocationName(address)
    setIsPendingLocation(false)
  }
  prof?.location?.city?setLocationName(prof.location.city):city()
  },[])

  const hashTags = prof?.hashtags ?? [];
  if (!prof) return null;


  return (
    <div className="space-y-6">
    <div>
        <p className="text-sm text-gray-700 leading-relaxed">
          {  prof.selfStatement}
        </p>
        </div>

  
  <p className="text-xs text-gray-400 uppercase">Location</p>
  {prof.location?.city ? (
        <p className="text-sm text-gray-700 mt-1">{prof.location.city}</p>
      ) : isPendingLocation ? (
        <div className="mt-1 h-4 w-32 bg-gray-200 rounded animate-pulse shadow-sm" />
      ) : (
        <p className="text-sm text-gray-700 mt-1">Location not specified</p>
      )}
        {/* {!isPendingLocation &&locationName.length>0 ? (
          <p className="text-sm text-gray-700 mt-1">{locationName}</p>
        ) : (
          <div className="mt-1 h-4 w-32 bg-gray-200 rounded animate-pulse shadow-sm" />
        )} */}
      {hashTags.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase mb-2">Interests</p>
          <div className="flex flex-wrap gap-2">
            {hashTags.slice(0, 5).map((tag, i) => (
              <Pill key={i} onClick={()=>router.push(Paths.hashtag.createRoute(tag.id))}label={`#${tag.name }`} />
            ))}
          </div>
        </div>
         
      )}</div>)
    }


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
useEffect(()=>{
  try{
  setIsSelf(prof.id==current.id)

  }catch(err){
    console.log(isSelf)
  }
},[profile,currentProfile])
  // ── Render
 
    if (!profile) return <IonContent
  fullscreen
  scroll-y="true"
  style={{ "--background": Enviroment.palette.cream, paddingTop: "env(safe-area-inset-top)" }}
>Loading...</IonContent>;
  return (
    <ErrorBoundary>
      <IonContent             style={{ "--background": Enviroment.palette.cream }} fullscreen className="bg-cream">
        <div className="max-w-2xl mx-auto px-4 pb-24 pt-safe space-y-8">

          {/* Header */}
          <div className="space-y-6 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ProfileInfo profile={profile} compact />
              </div>
              </div>

            <div className="flex justify-between text-center">
             
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
    <FollowButton isSelf={isSelf} prof={profile} onClick={onClickFollow}follow={following} current={currentProfile}  />
        
  </div>
            <TabBar tabs={tabs} active={tab} onChange={setTab} />
          </div>

          {/* Content */}
          <div className="space-y-10 min-h-[40rem]">
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

            {tab === TABS.COMMUNITIES && <CommunitiesPanel prof={profile} />}
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

export default ProfileContainer;