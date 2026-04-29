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

import EmptyState from "../components/EmptyState";
import { getMyCollections, getProfileRecommendations } from "../actions/CollectionActions";
import { getMyStories } from "../actions/StoryActions";
import PaginatedList from "../components/page/PaginatedList";
import usePaginatedResource from "../core/usePaginatedResource";
import ListPill from "../components/page/ListPill";
import SectionHeader from "../components/SectionHeader";
import useDebounce from "../core/useDebounce";
import { setPageData } from "../actions/PageActions";
import getBackground from "../core/getbackground";
import usePushNotificationListener from "../domain/usecases/usePushNotificationListener";

const TABS = {
  POSTS: "pages",
  COLLECTIONS: "collections",
  COMMUNITIES: "communities",
  ABOUT: "about",
};
const WRAP = "w-[100%] max-w-[50em] px-4 mx-auto ";
const tabWrapper = "max-w-lg mx-auto px-4 pb-4"; // same for both containers
function MyProfileContainer() {


  const { setSeo  } = useContext(Context);
  const profile = useSelector((state) => state.users.currentProfile);
const storiesCache = useSelector((state) => state.pagination.byKey?.["stories"]?.pages?.[1] ?? []);
const collectionsCache = useSelector((state) => state.pagination.byKey?.["collections:all"]?.pages?.[1] ?? []);
const librariesCache = useSelector((state) => state.pagination.byKey?.["libraries:all"]?.pages?.[1] ?? []);
const { items: explorList, page: explorePage, setPage: setExplorePage, totalCount: exploreTotalCount} = usePaginatedResource({
    cacheKey: "profile:recommendations",
    fetcher: getProfileRecommendations,
    pageSize: 10,
    enabled: !!profile?.id,
    select: (res) => ({ items: res.groups, totalCount: res.totalCount })})
const recentPosts = storiesCache.slice(0, 5);
const recentCollections = collectionsCache.slice(0, 5);
const communities = { items: librariesCache };
   const pageSize = 10;

useEffect(() => {
  console.log("PROFILE CHANGED", profile);
}, [profile]);






  const router = useIonRouter();
const [searchInput, setSearchInput] = useState("");
const [search, setSearch] = useState("");
const debouncedSearch = useDebounce(search, 300);
 
  const [tab, setTab] = useState(TABS.POSTS);






const tabs = [
  { key: TABS.POSTS, label: "Pages" },
  { key: TABS.COLLECTIONS, label: "Collections" },
  { key: TABS.COMMUNITIES, label: "Communities" },
  { key: TABS.ABOUT, label: "About" },
];





// ── Minimal Empty State ──────────────────────────────




const IndexList = ({ items, profile,router }) => (
  <div className="space-y-2">
    {items.map((i) => (
      <ListPill key={i.id} item={i} profile={profile} onClick={()=>router.push(Paths.collection.createRoute(i.id))}
   />
    ))}
  </div>
)

const StatChip = ({ value, label }) => (
  <div className="flex flex-col text-center">
    <span className="font-bold dark:text-cream">{value}</span>
    <span className="text-xs dark:text-cream text-gray-400">{label}</span>
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

// const [search, setSearch] = useState("");


const authResolved = useSelector((state) => state.users.authResolved);


if (!authResolved) return <IonContent  scrollY={true}
className='page-content' fullscreen />;// blank while auth checks
if (!profile) return <EmptyProfileState />; // only show this when truly logged out;
  return (

      <IonContent  scrollY={true}
className='page-content' fullscreen 

>
      <ErrorBoundary>
        <div className="  overflow-y-auto bg-cream  dark:bg-base-bgDark space-y-8">
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
                    <h5 className="text-xl dark:text-cream text-emerald-800">{profile?.username?.toLowerCase()}</h5>
              </div>
         
            </div>

          

            {(profile?.bio || profile?.selfStatement) && (
              <p className="text-sm text-gray-700 dark:text-cream leading-relaxed">
                {profile.bio ?? profile.selfStatement}
              </p>
            )}

            {profile?.hashtag?.length > 0 && (<div className="space-y-2 px-4">
              <p className="text-xs text-gray-400 uppercase">❤️ Hashtags</p>
        
              <div className="flex flex-wrap gap-2">
                 
                {[...profile.hashtag].slice(0, 5).map((tag, i) => {
                  
                  return<Pill key={i} onClick={()=>router.push(Paths.hashtag.createRoute(tag.hashtag.id))}
                  label={`#${tag.hashtag.name ?? tag.tag}`} />
})}
              </div>
                  </div>
            )}

            {(communities.items?.length ?? 0) > 0 && (
              <div className="space-y-2 px-4">
                <p className="text-xs text-gray-400 uppercase">Communities</p>
                <div className="flex flex-wrap gap-2 ">
        {communities?.items?.slice(0, 3).map((c) => {
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
  value={searchInput}
  onChange={(e) => {
    const val = e.target.value;
    setSearchInput(val);
    setSearch(val); // immediate or controlled elsewhere
  }}
      placeholder="Search"
      className="
  
      border-soft border rounded-full
        w-full px-4 py-2
        mx-4
          bg-cream
        dark:bg-base-bgDark 
        dark:border-cream
        

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
         
                    <SectionHeader title={"Recent"}/>
                    <PageProfileList items={recentPosts} type={"story"}  router={router}/>
                  </section>
                )}

              
                  <section className="space-y-4">

                    <SectionHeader title={"All Pages"}/>

 <PaginatedList
  cacheKey="stories"
  fetcher={getMyStories}
  pageSize={8}
  search={debouncedSearch}
  emptyState={   Array.from({ length: pageSize }).map((_, i) => (
                   <div
        key={i}
   className="px-3 py-5 rounded-full skeleton  border border-blue border-1 bg-base-bg backdrop-blur-sm shadow-sm active:scale-[0.98] transition"
      >
       <span className="min-h-14 "></span>
      </div>
      ))}

  renderItem={(p) => (

    <ListPill key={p.id}item={p} profile={profile} onClick={()=>router.push(Paths.page.createRoute(p.id))}/>
)}
/>



         </section>     
         </>
            )}    
        

            

           {tab === TABS.COLLECTIONS && (
  <>
    {search.length === 0 && recentCollections.length > 0 && (
      <section className="space-y-4">
        <SectionHeader title="Recent" />
        <IndexList items={recentCollections} profile={profile} router={router} />
      </section>
    )}

    <SectionHeader title="All Collections" />
    <PaginatedList
      cacheKey="collections"
      params={{ type: "book", search: debouncedSearch }}
      fetcher={getMyCollections}
      pageSize={8}
      search={debouncedSearch}
      emptyState={<EmptyState text={search ? "No matching collections." : "No collections yet."} />}
      renderItem={(i) => (
        <ListPill key={i.id} item={i} profile={profile} onClick={() => router.push(Paths.collection.createRoute(i.id))} />
      )}
    />
  </>)


          }

            {tab === TABS.COMMUNITIES && <CommunitiesPanel router={router} communities={communities.items} />}
            {tab === TABS.ABOUT && <AboutPanel router={router} profile={profile}  />}
          </div>
</div>
</div>
     <div className=' bg-cream '>
            <ExploreList items={explorList} page={explorePage} totalCount={exploreTotalCount} setPage={setExplorePage}/>
          </div>
     
   </div>
          {/* Explore */}

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


