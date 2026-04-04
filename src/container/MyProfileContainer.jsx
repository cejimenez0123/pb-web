


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

  getMyCollections,
  setCollections,
} from "../actions/CollectionActions";

import ErrorBoundary from "../ErrorBoundary";
import ProfileInfo from "../components/profile/ProfileInfo";
import fetchCity from "../core/fetchCity";
import Paths from "../core/paths";
import { createFollow, deleteFollow } from "../actions/FollowAction";
import TabBar from "../components/TabBar";
import { getMyStories } from "../actions/StoryActions";
import ExploreList from "../components/collection/ExploreList";
const TABS = {
  POSTS: "posts",
  COLLECTIONS: "collections",
  COMMUNITIES: "communities",
  ABOUT: "about",
};
function MyProfileContainer() {
    const { setSeo, setError,  } = useContext(Context);

  const profile = useSelector((state) => state.users.currentProfile);
  const {myCollections}=useSelector(state=>state.books)
  const {myPages:myStories}=useSelector(state=>state.pages)
  const communities  = myCollections.filter(col=>col.type=="library")
 
  // useSelector((state) => state.pages.pagesInView ?? []);
  const dispatch = useDispatch();
  const router = useIonRouter();
  const { id } = useParams();

  const [tab, setTab] = useState(TABS.POSTS);
  const [search, setSearch] = useState("");
  const [following, setFollowing] = useState(null);
  //  
   const collectionsRaw = myCollections|| profile?.collections||[]
    const pagesRaw = myStories || profile.stories || []
useEffect(() => {
    if (profile) {
      dispatch(getMyCollections());
      dispatch(getMyStories());
    }
  }, [profile, dispatch]);



  // ── Derived
  const collections = useMemo(
    () => collectionsRaw.filter(Boolean).filter((col) => (search ? col.title?.toLowerCase().includes(search.toLowerCase()) : true)),
    [collectionsRaw, search]
  );
    const recentCollections = useMemo(
    () => [...collectionsRaw].filter(Boolean).sort((a, b) => new Date(b.updated ?? b.created) - new Date(a.updated ?? a.created)).slice(0, 5),
    [collectionsRaw]
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
  
  className="text-xs px-3 py-1 shadow-sm rounded-full bg-gray-100 text-soft">
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
// const CommunitiesPanel = ({ profile }) => {


//   // c= profile?.communities ?? [];
//   if (!communities.length)
//     return <div className="text-center py-12 text-sm text-gray-400">No communities yet.</div>;

//   return (
//     <div className="space-y-4">
//       {communities.map((c) => (
//         <div key={c.id} onClick={()=>router.push(Paths.collection.createRoute(c.id))}className="p-4 rounded-xl bg-gray-50">
//           <p className="text-sm font-medium text-gray-900">{c.title}</p>
//           {c.purpose&& <p className="text-sm text-gray-500 mt-1">{c.purpose}</p>}
//         </div>
//       ))}
//     </div>
//   );
// };


const CommunitiesPanel = ({communities }) => {
  const router = useIonRouter();

  // const communities = profile?.communities ?? [];

  const [page, setPage] = useState(1);
  const limit = 6; // adjust based on feel

  const totalPages = Math.ceil(communities.length / limit);

  const paginatedCommunities = useMemo(() => {
    const start = (page - 1) * limit;
    return communities.slice(start, start + limit);
  }, [communities, page]);

  if (!communities.length) {
    return (
      <div className="text-center py-12 text-sm text-gray-400">
        No communities yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* List */}
      {paginatedCommunities.map((c) => (
        <div
          key={c.id}
          onClick={() => router.push(Paths.collection.createRoute(c.id))}
          className="p-4 rounded-xl bg-gray-50 active:scale-[0.98] transition"
        >
          <p className="text-sm font-medium text-gray-900">
            {c.title.length>0?c.title:"Untitled"}
          </p>

          {c.purpose && (
            <p className="text-sm text-gray-500 mt-1">
              {c.purpose}
            </p>
          )}
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      )}
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
// const PageList = ({ items }) => (

//   <div className="space-y-2">
//     {items.map((p) => {

//       return<div key={p.id} onClick={()=>{router.push(Paths.page.createRoute(p.id))}} className="p-2 border border-seaBlue rounded">{p?.title?.length>0 ? p.title:"Untitled"}</div>
//  } )}
//   </div>
// );
const PageList = ({ items, router }) => (
    <div className="space-y-2">
    {items.map((p) => (
      <div
        key={p.id}
        onClick={() => router.push(Paths.page.createRoute(p.id))}
        className="p-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm active:scale-[0.98] transition"
      >
        <span className="text-[0.95rem] font-medium text-gray-800">
        {p?.title?.length > 0 ? p.title : "Untitled"}
        </span>
      </div>
    ))}
  </div>
);

const PaginationControls = ({ page, totalPages, setPage }) => {
  const [input, setInput] = useState(page);

  useEffect(() => {
    setInput(page);
  }, [page]);

  const goToPage = () => {
    const p = Number(input);
    if (p >= 1 && p <= totalPages) {
      setPage(p);
    } else {
      setInput(page); // reset if invalid
    }
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-white/60 backdrop-blur-md border border-gray-200 shadow-sm">
      
      {/* Prev */}
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition
          ${page === 1 
            ? "text-gray-300" 
            : "text-seaBlue active:scale-95"}
        `}
      >
        ‹
      </button>

      {/* Center (page indicator + input) */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Page</span>

        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={goToPage}
          onKeyDown={(e) => e.key === "Enter" && goToPage()}
          className="w-12 text-center bg-transparent border-b border-gray-300 focus:border-seaBlue outline-none"
        />

        <span className="text-gray-400">of {totalPages}</span>
      </div>

      {/* Next */}
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition
          ${page === totalPages 
            ? "text-gray-300" 
            : "text-seaBlue active:scale-95"}
        `}
      >
        ›
      </button>
    </div>
  );
};
const PaginatedPageList = ({ items }) => {
  const router = useIonRouter();

  const [page, setPage] = useState(1);
  const limit = 10; // items per page

  const totalPages = Math.ceil(items.length / limit);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return items.slice(start, end);
  }, [items, page]);

  return (
    <div className="space-y-4">
      <PageList items={paginatedItems} router={router} />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  );
};
const IndexList = ({ items, router }) => (
  <div className="space-y-2">
    {items.map((i) => (
      <div
        key={i.id}
        onClick={() => router.push(Paths.collection.createRoute(i.id))}
        className="p-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm active:scale-[0.98] transition"
      >
        <span className="text-[0.95rem] font-medium text-gray-800">
          {i.title ?? i.name ?? "Untitled"}
        </span>
      </div>
    ))}
  </div>
);


// const CollectionPaginationControls = ({ page, totalPages, setPage }) => {
//   const [input, setInput] = useState(page);

//   useEffect(() => {
//     setInput(page);
//   }, [page]);

//   const goToPage = () => {
//     const p = Number(input);
//     if (p >= 1 && p <= totalPages) {
//       setPage(p);
//     } else {
//       setInput(page);
//     }
//   };

//   // show only nearby pages (like iOS)
//   const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1)
//     .filter((p) => Math.abs(p - page) <= 2);

//   return (
//     <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-white/60 backdrop-blur-md border border-gray-200 shadow-sm">
      
//       {/* Prev */}
//       <button
//         disabled={page === 1}
//         onClick={() => setPage(page - 1)}
//         className={`px-3 py-1.5 rounded-full text-sm font-medium transition
//           ${page === 1 
//             ? "text-gray-300" 
//             : "text-seaBlue active:scale-95"}
//         `}
//       >
//         ‹
//       </button>

//       {/* Center (page indicator + input) */}
//       <div className="flex items-center gap-2 text-sm">
//         <span className="text-gray-500">Page</span>

//         <input
//           type="number"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onBlur={goToPage}
//           onKeyDown={(e) => e.key === "Enter" && goToPage()}
//           className="w-12 text-center bg-transparent border-b border-gray-300 focus:border-seaBlue outline-none"
//         />

//         <span className="text-gray-400">of {totalPages}</span>
//       </div>

//       {/* Next */}
//       <button
//         disabled={page === totalPages}
//         onClick={() => setPage(page + 1)}
//         className={`px-3 py-1.5 rounded-full text-sm font-medium transition
//           ${page === totalPages 
//             ? "text-gray-300" 
//             : "text-seaBlue active:scale-95"}
//         `}
//       >
//         ›
//       </button>
//     </div>
//   );
// };

const PaginatedIndexList = ({ items }) => {
  const router = useIonRouter();

  const [page, setPage] = useState(1);
  const limit = 8;

  const totalPages = Math.ceil(items.length / limit);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * limit;
    return items.slice(start, start + limit);
  }, [items, page]);

  return (
    <div className="space-y-4">
      <IndexList items={paginatedItems} router={router} />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  );
};
// const ExploreList = () => <div className="text-center text-gray-400 py-4">Explore placeholder</div>;
const StatChip = ({ value, label }) => (
  <div className="flex flex-col text-center">
    <span className="font-bold">{value}</span>
    <span className="text-xs text-gray-400">{label}</span>
  </div>
);

// ── Main Container ──────────────────────────────────




 
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

  
  useEffect(() => {
    if (!profile) return;
    setSeo({
      title: `${profile.username} on Plumbum`,
      description: profile.bio || profile.selfStatement || `Read stories by ${profile.username}.`,
      url: `${Enviroment.domain}/profile/${profile.id}`,
      type: "profile",
    });
  }, [profile, setSeo]);


 
  if (!profile) return <IonContent
  fullscreen
  scroll-y="true"
  style={{ "--background": Enviroment.palette.cream}}
>Loading...</IonContent>;
  return (
    <ErrorBoundary>
      <IonContent
  fullscreen
  scroll-y="true"
  style={{ "--background": Enviroment.palette.cream }}
>
        <div className="max-w-2xl mx-auto px-4 pb-24  space-y-8">
<div className='flex sm:pt-16 p-4 flex-row justify-between'>

                  
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
            <StatChip value={profile["_count"]?.followers??""}
               label="Followers" />
              <StatChip value={profile["_count"]?.following??""} label="Following" />
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

            {(communities?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 uppercase">Communities</p>
                <div className="flex flex-wrap gap-2 ">
                  {communities.slice(0, 3).map((c) => <Pill 
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
                    <PageList items={recentPosts}  router={router}/>
                  </section>
                )}

                {pages.length > 0 && (
                  <section className="space-y-4">
                    <SectionLabel>All Posts</SectionLabel>
                    {/* <PageList items={pages} /> */}
                    <PaginatedPageList items={pages} />
                  </section>
                )}

                {pages.length === 0 && <EmptyState text="No posts yet." />}
              </>
            )}

            {tab === TABS.COLLECTIONS && (
              collections.length > 0 ?<>
                 {search.length==0 && recentPosts.length > 0 && (
                  <section className="space-y-4">
                    <SectionLabel>Recent</SectionLabel>
                    <IndexList items={recentCollections}/>
                   
                  </section>
                )}
                    <SectionLabel>All Collections</SectionLabel>
                <PaginatedIndexList items={collections}/></> 
              
              : <EmptyState text="No collections yet." />
            )
          }

            {tab === TABS.COMMUNITIES && <CommunitiesPanel communities={communities} />}
            {tab === TABS.ABOUT && <AboutPanel profile={profile} />}
          </div>

          {/* Explore */}
          <div className="pt-6 border-t border-gray-100">
            <ExploreList/>
          </div>
        </div>
      </IonContent>
    </ErrorBoundary>
  );
}

export default MyProfileContainer;