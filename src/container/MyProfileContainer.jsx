import { useContext, useEffect, useMemo,useRef, useState } from "react";
import { IonContent, useIonRouter } from "@ionic/react";
import { useSelector, useDispatch } from "react-redux";
import Context from "../context";
import Enviroment from "../core/Enviroment";
import ErrorBoundary from "../ErrorBoundary";
import ProfileInfo from "../components/profile/ProfileInfo";
import Paths from "../core/paths";
import TabBar from "../components/TabBar";
import settings from "../images/icons/settings.svg"
import ExploreList from "../components/collection/ExploreList";
import Pill from "../components/Pill";
import CommunitiesPanel from "../components/profile/CommunitiesPanel";
import AboutPanel from "../components/profile/AboutPanel";
import debounce from "../core/debounce";
import PageProfileList from "../components/page/PageProfileList";
import PaginatedIndexList from "../components/PaginatedIndexList";
import PaginatedPageList from "../components/page/PaginatedPageList";
import EmptyState from "../components/EmptyState";
import { getMyCollections } from "../actions/CollectionActions";
import { getMyStories } from "../actions/StoryActions";
import PaginatedList from "../components/page/PaginatedList";
import PaginatedItem from "../components/page/PaginatediItem";
import checkResult from "../core/checkResult";
const TABS = {
  POSTS: "posts",
  COLLECTIONS: "collections",
  COMMUNITIES: "communities",
  ABOUT: "about",
};
const WRAP = "w-[100%] max-w-[50em] px-4 mx-auto ";
const tabWrapper = "max-w-lg mx-auto px-4 pb-4"; // same for both containers
function MyProfileContainer() {
  const { setSeo  } = useContext(Context);
  const profile = useSelector((state) => state.users.currentProfile);
  const {myCollections:collectionsRaw}=useSelector(state=>state.books)
  const pageSize = 20;
  const {
  page,
  setPage,
  items:storyItems,
  loading:pageLoading,
  totalCount:storyTotalCount,
  totalPages,
} = usePaginatedStories({
  profileId: profile?.id,
  pageSize: pageSize,
});

const pagesRaw = useSelector(state => state.pages.myPages ?? storyItems??[]);

  const dispatch = useDispatch();

const communities = useMemo(
  () =>
    (collectionsRaw ?? []).filter(
      (col) => (col?.childCollections?.length > 0) > 0
    ),
  [collectionsRaw]
);

  const router = useIonRouter();
const debouncedSearch = useMemo(
  () => debounce((value) => setSearch(value), 250),
  []
);

useEffect(() => {
  return () => debouncedSearch.cancel?.();
}, [debouncedSearch]);
 
  // const { id } = useParams();

  const [tab, setTab] = useState(TABS.POSTS);
  const [search, setSearch] = useState("");
  // const [following, setFollowing] = useState(null);
 



  // ── Derived
 const collections = useMemo(
  () =>
    (collectionsRaw ?? [])
      .filter(Boolean)
      .filter((col) =>
        search
          ? col.childCollections == 0 &&
            col.title?.toLowerCase().includes(search.toLowerCase())
          : true
      ),
  [collectionsRaw, search]

  );
 const recentCollections = useMemo(
  () =>
    [...(collectionsRaw ?? [])]
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date(b.updated ?? b.created) -
          new Date(a.updated ?? a.created)
      )
      .slice(0, 5),
  [collectionsRaw]
);

  const sortedPages = useMemo(() => {
  return [...(pagesRaw ?? [])].sort(
    (a, b) =>
      new Date(b.updated ?? b.created) -
      new Date(a.updated ?? a.created)
  );
}, [pagesRaw]);

const recentPosts = sortedPages.slice(0, 5);
// ── Tabs constants ─────────────────────────────────────

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


  
  useEffect(() => {
    if (!profile) return;
    setSeo({
      title: `${profile?.username} on Plumbum`,
      description: profile?.bio || profile?.selfStatement || `Read stories by ${profile?.username}.`,
      url: `${Enviroment.domain}/profile/${profile?.id}`,
      type: "profile",
    });
  }, [profile, setSeo]);


 
 if (!profile) return <EmptyProfileState />;
  return (

      <IonContent fullscreen scrollY={true}
  style={{ "--background": Enviroment.palette.base.background}}
>
      <ErrorBoundary>
        <div className=" pb-24   space-y-8">
<div className='flex sm:pt-16 flex-col justify-center'>
<div className=" p-4 ">
  {/* {Enviroment.palette.button.} */}
<button  onClick={() => router.push(Paths.editProfile)}
className="bg-soft rounded-full p-2"><img src={settings} /></button>
</div>
                  
            </div>
          {/* Header */}
          <div className={`${WRAP} max-w-[50em] px-4 pt-8 space-y-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ProfileInfo profile={profile} compact />
                    <h5 className="text-xl text-emerald-800">{profile?.username?.toLowerCase()}</h5>
              </div>
         
            </div>

            <div className="flex justify-between text-center">
            <StatChip value={profile?._count?.followers ?? ""}
               label="Followers" />
              <StatChip value={profile?._count?.following??""} label="Following" />
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
              <div className="space-y-2 px-4">
                <p className="text-xs text-gray-400 uppercase">Communities</p>
                <div className="flex flex-wrap gap-2 ">
        {communities.slice(0, 3).map((c) => {
  const path = Paths.collection.createRoute(c.id);

  return (
    <Pill
      key={c.id}
      baseClass="border-blue bg-base-bg"
      onClick={() => router.push(path, "forward")}
      label={c.title}
    />
  );
})}
                </div>
              </div>
            )}
          </div>

          {/* Search + Tabs */}
          <div className={`${WRAP} space-y-4`}>

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
  <div className={tabWrapper}> 
           <TabBar tabs={tabs} active={tab} onChange={setTab} />
      </div>    

          {/* Content */}
         <div className={`${WRAP} space-y-10 min-h-[40rem]`}>
            {tab === TABS.POSTS && (
              <>
                {search.length==0 && recentPosts.length > 0 && (
                  <section className="space-y-4">
                    <SectionLabel>Recent</SectionLabel>
                    <PageProfileList items={recentPosts}  router={router}/>
                  </section>
                )}

              
                  <section className="space-y-4">
                    <SectionLabel>All Posts</SectionLabel>
<PaginatedList
  items={storyItems}
  page={page}
  setPage={setPage}
  pageSize={pageSize}
  totalCount={storyTotalCount}
  loading={pageLoading}
  emptyState={<EmptyState text="No posts yet." />}
  renderItem={(page) => (
    <PageProfileList items={[page]} router={router} />
  )}
/>
         </section>     
         </>
            )}    
        

            

            {tab === TABS.COLLECTIONS && (
              collections.length === 0 ? (
  <EmptyState text={search ? "No matching collections." : "No collections yet."} />
) : (
  <>
    {search.length === 0 && recentCollections.length > 0 && (
      <section className="space-y-4">
        <SectionLabel>Recent</SectionLabel>
        <IndexList items={recentCollections} router={router} />
      </section>
    )}

    <SectionLabel>All Collections</SectionLabel>
    <PaginatedIndexList router={router} items={collections} />
  </>
)
            
            )
          }

            {tab === TABS.COMMUNITIES && <CommunitiesPanel router={router} communities={communities} />}
            {tab === TABS.ABOUT && <AboutPanel router={router} profile={profile}  />}
          </div>
</div>
</div>
   </div>
          {/* Explore */}
     <div className='min-h-[28rem]'>
            <ExploreList/>
          </div>
     
           </ErrorBoundary>
      </IonContent>
 
  );
}

export default MyProfileContainer;


function EmptyProfileState() {
  const router = useIonRouter();

  return (
    <IonContent
      fullscreen
   
      style={{ "--background": Enviroment.palette.base.background }}
    >
      <div className="max-w-[50em] mx-auto px-4 pt-16 space-y-6 text-center">

        <h1 className="text-2xl font-semibold text-emerald-800">
          Welcome to Plumbum
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed">
          Sign in to view your profile, stories, collections, and communities.
        </p>

        <div
          onClick={() => router.push(Paths.login)}
          className="
            mx-auto w-fit px-6 py-3
            rounded-full
            bg-emerald-700 text-white
            shadow-md active:scale-95 transition
          "
        >
          Log in / Sign up
        </div>

      </div>
    </IonContent>
  );
}

// import { useEffect, useRef, useState } from "react";
// import { useDispatch } from "react-redux";
// import { getMyStories } from "../actions/StoryActions";

function usePaginatedStories({
  profileId,
  pageSize = 20,
  prefetch = true,
}) {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [pageCache, setPageCache] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const inFlight = useRef(new Set());

  const currentItems = pageCache[page] || [];
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    if (!profileId) return;

    const fetchPage = async (p) => {
      const skip = (p - 1) * pageSize;

      // 🧠 prevent duplicate requests
      if (pageCache[p] || inFlight.current.has(p)) return;

      inFlight.current.add(p);
      setLoading(true);

      try {
        const res = await dispatch(
          getMyStories({ skip, take: pageSize })
        ).unwrap();

        setPageCache((prev) => ({
          ...prev,
          [p]: res.pageList,
        }));

        setTotalCount(res.totalCount);
      } catch (err) {
        console.error("pagination error", err);
      }

      inFlight.current.delete(p);
      setLoading(false);
    };

    // 1. fetch current page
    fetchPage(page);

    // 2. prefetch next pages
    if (prefetch) {
      [page + 1, page + 2].forEach((p) => {
        if (p > totalPages) return;

        fetchPage(p);
      });
    }
  }, [page, profileId]);

  return {
    page,
    setPage,
    items: currentItems,
    loading,
    totalCount,
    totalPages,
  };
}