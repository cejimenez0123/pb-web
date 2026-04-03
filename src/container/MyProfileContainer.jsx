


import settings from "../images/icons/settings.svg"
import React, { useContext, useEffect, useMemo, useState } from "react";
import { IonContent, IonImg, useIonRouter } from "@ionic/react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { Preferences } from "@capacitor/preferences";
import { debounce } from "lodash";
import Context from "../context";
import Enviroment from "../core/Enviroment";

import {
  fetchProfile,
  getCurrentProfile,
 
} from "../actions/UserActions";

import {

  setPagesInView,
} from "../actions/PageActions";

import {

  setCollections,
} from "../actions/CollectionActions";

import ErrorBoundary from "../ErrorBoundary";
import ProfileInfo from "../components/profile/ProfileInfo";
import fetchCity from "../core/fetchCity";
import Paths from "../core/paths";
import { createFollow, deleteFollow } from "../actions/FollowAction";
import TabBar from "../components/TabBar";
const TABS = {
  POSTS: "posts",
  COLLECTIONS: "collections",
  COMMUNITIES: "communities",
  ABOUT: "about",
};
function MyProfileContainer() {
    const { setSeo, setError,  } = useContext(Context);

  const profile = useSelector((state) => state.users.currentProfile);

  const collectionsRaw = profile?.collections||[]
  // useSelector((state) => state.books.collections?? []);

  const pagesRaw = profile?.stories||[]
  // useSelector((state) => state.pages.pagesInView ?? []);

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
    
    dispatch(setPagesInView({ pages: profile.stories }));
  }

  if (profile.collections) {
    dispatch(setCollections
   
      ({ collections: profile.collections }));
  }
}, [profile, dispatch]);


 
  useEffect(() => {
  if (!profile) return;
  dispatch(setPagesInView({ pages: profile.stories || [] }));
  dispatch(setCollections({ collections: profile.collections || [] }));
}, [profile, dispatch]);

  // ── Follow logic
  useEffect(() => {
    if (!profile) return;
    if (profile.id === profile.id) setFollowing(true);
    else setFollowing(profile.followers?.find((f) => f.followerId === profile.id) ?? null);
  }, [ profile]);

  // const onClickFollow = debounce(() => {
  //   // if (!currentProfile) return setError("Please login first!");
  //   if (!profile) return;

  //   if (following) dispatch(deleteFollow({ follow: following }));
  //   else dispatch(createFollow({ follower: profile, following: profile }));
  // }, 200);

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
  console.log(profile)
  if (!profile) return <IonContent
  fullscreen
  scroll-y="true"
  style={{ "--background": Enviroment.palette.cream, paddingTop: "env(safe-area-inset-top)" }}
>Loading...</IonContent>;
  return (
    <ErrorBoundary>
      <IonContent
  fullscreen
  scroll-y="true"
  style={{ "--background": Enviroment.palette.cream, paddingTop: "env(safe-area-inset-top)" }}
>
        <div className="max-w-2xl mx-auto px-4 pb-24 pt-safe space-y-8">
<div className='flex mt-4  sm:pt-20 p-4 flex-row justify-between'>

                  
            </div>
          {/* Header */}
          <div className="space-y-6 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ProfileInfo profile={profile} compact />
                    <h5 className="text-xl text-emerald-800">{profile?.username.toLowerCase()}</h5>
              </div>
         
            </div>

            <div className="flex justify-between text-center">
            <StatChip value={profile["_count"].followers}
               label="Followers" />
              <StatChip value={profile["_count"].following} label="Following" />
            </div>

            {(profile?.bio || profile?.selfStatement) && (
              <p className="text-sm text-gray-700 leading-relaxed">
                {profile.bio ?? profile.selfStatement}
              </p>
            )}

            {(profile?.hashtags ?? profile?.tags)?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(profile.hashtags ?? profile.tags).slice(0, 5).map((tag, i) => (
                  <Pill key={i} onClick={()=>router.push(Paths.hashtag.createRoute(tag.id))}
                  label={`#${typeof tag === "string" ? tag : tag.name ?? tag.tag}`} />
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
      {/* <FollowButton following={following} onClick={()=>{onClickFollow()}}isSelf={true}
      /> */}
           <div className="px-2"><TabBar tabs={tabs} active={tab} onChange={setTab} /></div> 
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