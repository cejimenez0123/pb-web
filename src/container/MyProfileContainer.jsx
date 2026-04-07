


import { useContext, useEffect, useMemo, useState } from "react";
import { IonContent, useIonRouter } from "@ionic/react";
import { useSelector, useDispatch } from "react-redux";
import Context from "../context";
import Enviroment from "../core/Enviroment";
import ErrorBoundary from "../ErrorBoundary";
import ProfileInfo from "../components/profile/ProfileInfo";
import Paths from "../core/paths";
import TabBar from "../components/TabBar";
import ExploreList from "../components/collection/ExploreList";
import Pill from "../components/Pill";
import CommunitiesPanel from "../components/profile/CommunitiesPanel";
import AboutPanel from "../components/profile/AboutPanel";
import debounce from "../core/debounce";
import PageProfileList from "../components/page/PageProfileList";
import PaginatedIndexList from "../components/PaginatedIndexList";
import PaginatedPageList from "../components/page/PaginatedPageList";
import EmptyState from "../components/EmptyState";
const TABS = {
  POSTS: "posts",
  COLLECTIONS: "collections",
  COMMUNITIES: "communities",
  ABOUT: "about",
};
function MyProfileContainer() {
    const { setSeo, setError,  } = useContext(Context);

  const profile = useSelector((state) => state.users.currentProfile);
  const {myCollections:collectionsRaw}=useSelector(state=>state.books)
  const {myPages:pagesRaw}=useSelector(state=>state.pages)
  const communities  =collectionsRaw?.filter(col=>col?.type=="library")??[]
 
;
const debouncedSearch = useMemo(
  () => debounce((value) => setSearch(value), 250),
  []
);
useEffect(() => {
  return () => debouncedSearch.cancel?.();
}, [debouncedSearch]);
  const dispatch = useDispatch();
  const router = useIonRouter();
  // const { id } = useParams();

  const [tab, setTab] = useState(TABS.POSTS);
  const [search, setSearch] = useState("");
  const [following, setFollowing] = useState(null);
  //  
  //  const collectionsRaw = myCollections||[]
  



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
  // const recentPosts = useMemo(
  //   () => [...pagesRaw].filter(Boolean).sort((a, b) => new Date(b.updated ?? b.created) - new Date(a.updated ?? a.created)).slice(0, 5),
  //   [pagesRaw]
  // );
  const sortedPages = useMemo(() => {
  return [...pagesRaw].sort(
    (a, b) => new Date(b.updated ?? b.created) - new Date(a.updated ?? a.created)
  );
}, [pagesRaw]);

const recentPosts = sortedPages.slice(0, 5);
// ── Tabs constants ─────────────────────────────────────


// ── Pill Component ─────────────────────────────────────
// const Pill = ({ label,onClick }) => (
//   <span onClick={()=>onClick()}
  
//   className="text-xs px-3 py-1 shadow-sm rounded-full bg-gray-100 text-soft">
//     {label}
//   </span>
// );

// ── Section Label ─────────────────────────────────────
const SectionLabel = ({ children }) => (
  <p className="text-xs text-gray-400 uppercase tracking-wide">{children}</p>
);


const tabs = [
  { key: TABS.POSTS, label: "Posts" },
  { key: TABS.COLLECTIONS, label: "Collections" },
  { key: TABS.COMMUNITIES, label: "Communities" },
  { key: TABS.ABOUT, label: "About" },
];





// ── Minimal Empty State ──────────────────────────────




const IndexList = ({ items, router }) => (
  <div className="space-y-2">
    {items.map((i) => (
      <div
        key={i.id}
        onClick={() => router.push(Paths.collection.createRoute(i.id))}
        className="p-3 rounded-full border border-purple border-1 bg-base-bg backdrop-blur-sm shadow-sm active:scale-[0.98] transition"
      >
        <span className="text-[0.95rem] font-medium text-gray-800">
          {i.title ?? i.name ?? "Untitled"}
        </span>
      </div>
    ))}
  </div>
)

// const ExploreList = () => <div className="text-center text-gray-400 py-4">Explore placeholder</div>;
const StatChip = ({ value, label }) => (
  <div className="flex flex-col text-center">
    <span className="font-bold">{value}</span>
    <span className="text-xs text-gray-400">{label}</span>
  </div>
);

// ── Main Container ──────────────────────────────────




 
//   useEffect(() => {
//   if (!profile) return;
//   dispatch(setPagesInView({ pages: profile.stories || [] }));
//   dispatch(setCollections({ collections: profile.collections || [] }));
// }, [profile, dispatch]);

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
  style={{ "--background": Enviroment.palette.base.surface}}
>Loading...</IonContent>;
  return (

      <IonContent
  fullscreen
  scroll-y="true"
  style={{ "--background": Enviroment.palette.base.background}}
>
      <ErrorBoundary>
        <div className=" pb-24   space-y-8">
<div className='flex sm:pt-16 flex-col justify-center'>

                  
            </div>
          {/* Header */}
          <div className="space-y-6 max-w-2xl  mx-auto p-8">
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
                  {communities.slice(0, 3).map((c) => <div >
                    <Pill
                   key={c.id} 
                  baseClass="border-blue bg-base-bg"
                  onClick={()=>router.push(Paths.collection.createRoute(c.id),"forward")}
                  label={c.title} /></div>)}
                </div>
              </div>
            )}
          </div>

          {/* Search + Tabs */}
          <div className="space-y-4 ">

    <div className="max-w-xl mx-auto">
                    <div className="w-full">
    <input
      value={search}
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="Search"
      className="
  
      border-soft border rounded-full
        w-full px-4 py-2
        mx-4
  bg-cream
        text-sm text-soft
        placeholder-gray-400
        focus:outline-none focus:ring-1 focus:ring-gray-300
        mb-4 
      "
    />

  </div>
  <div className="mx-1"> 
           <TabBar tabs={tabs} active={tab} onChange={setTab} />
      </div>    

          {/* Content */}
          <div className="space-y-10  px-4 pt-4 min-h-[40rem]">
            {tab === TABS.POSTS && (
              <>
                {search.length==0 && recentPosts.length > 0 && (
                  <section className="space-y-4">
                    <SectionLabel>Recent</SectionLabel>
                    <PageProfileList items={recentPosts}  router={router}/>
                  </section>
                )}

                {pages.length > 0 && (
                  <section className="space-y-4">
                    <SectionLabel>All Posts</SectionLabel>
                  
                    <PaginatedPageList items={pages} router={router} />
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
                   <IndexList items={recentCollections} router={router}/>
                   
                  </section>
                )}
                <SectionLabel>All Collections</SectionLabel>
                <PaginatedIndexList router={router} items={collections}/></> 
              
              : <EmptyState text="No collections yet." />
            )
          }

            {tab === TABS.COMMUNITIES && <CommunitiesPanel router={router} communities={communities} />}
            {tab === TABS.ABOUT && <AboutPanel router={router} profile={profile} hashtags={profile.hashtags}/>}
          </div>
</div>
</div>
          {/* Explore */}
          <div className="pt-6 border-t border-gray-100">
            <ExploreList/>
          </div>
        </div>
           </ErrorBoundary>
      </IonContent>
 
  );
}

export default MyProfileContainer;