
import { useMemo, useState } from "react";
import { IonContent, useIonRouter } from "@ionic/react";
import { useSelector } from "react-redux";
import ErrorBoundary from "../ErrorBoundary";
import ProfileInfo from "../components/profile/ProfileInfo";
import Paths from "../core/paths";
import {
  getMyCollections,
} from "../actions/CollectionActions";
import useDebounce from "../core/useDebounce";
import EventsSection from "../components/collection/EventsSection";
import PortfolioSection from "../components/collection/PortfolioSection";
import styles from "../styles/style";
import DetailsSection from "../components/profile/DetailsSection";
import ArchiveSection from "../components/profile/ArchiveSection";
import TabBar from "../components/TabBar";
import usePaginatedResource from "../core/usePaginatedResource";
import CollectionsSection from "../components/collection/CollectionsSection";
import { getMyProfileCollections } from "../actions/ProfileActions";
import HomeSection from "../components/HomeSection";

const SETTINGS=(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="30px" width="30px" fill="currentColor"><path d="M9.25,22l-0.4-3.2q-0.32-0.13-0.61-0.3T7.68,18.13L4.7,19.38L1.95,14.63l2.58-1.95Q4.5,12.5 4.5,12.34q0-0.16 0-0.34t0-0.34t0.03-0.34L1.95,9.38L4.7,4.63L7.68,5.88Q7.95,5.68 8.25,5.5t0.6-0.3L9.25,2h5.5l0.4,3.2q0.33,0.13 0.61,0.3t0.56,0.38L19.3,4.63l2.75,4.75l-2.57,1.95q0.02,0.18 0.02,0.34t0,0.34t0,0.34t-0.05,0.34l2.57,1.95l-2.75,4.75l-2.95-1.25q-0.27,0.2-0.57,0.38t-0.6,0.3L14.75,22H9.25ZM11,20h1.98l0.35-2.65q0.78-0.2 1.44-0.59t1.21-0.94l2.47,1.03l0.98-1.7l-2.15-1.63q0.13-0.35 0.17-0.74T17.5,12t-0.05-0.79q-0.05-0.39-0.17-0.74l2.15-1.63l-0.98-1.7L15.98,8.2q-0.55-0.57-1.21-0.96T13.33,6.65L13,4H11.03L10.68,6.65Q9.9,6.85 9.24,7.24T8.03,8.17L5.55,7.15L4.58,8.85l2.15,1.6Q6.6,10.83 6.55,11.2T6.5,12q0,0.4 0.05,0.77t0.17,0.75L4.58,15.15l0.98,1.7L8.03,15.8q0.55,0.58 1.21,0.96t1.44,0.59L11,20Zm1.05-4.5q1.45,0 2.47-1.03T15.55,12T14.53,9.52T12.05,8.5q-1.47,0-2.49,1.02T8.55,12t1.01,2.47t2.49,1.03ZM12,12Z"/></svg>)
const PENCIL=(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="18px" width="18px" fill="currentColor"><path d="M5,19H6.43L16.2,9.23L14.78,7.8L5,17.58V19ZM3,21V16.75L16.2,3.57q0.3-0.28 0.66-0.43T17.63,3q0.4,0 0.78,0.15T19.05,3.6L20.43,5q0.3,0.27 0.44,0.65T21,6.4q0,0.4-0.14,0.76T20.43,7.82L7.25,21H3ZM19,6.4L17.6,5L19,6.4ZM15.48,8.52L14.78,7.8L16.2,9.23l-0.72-0.7Z"/></svg>)
const EYE=(<svg  className="mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="18px" width="18px" fill="currentColor"><path d="M8.1,21.21q-1.82-0.79-3.17-2.14Q3.58,17.73 2.79,15.9T2,12Q2,9.92 2.79,8.1Q3.58,6.27 4.93,4.93Q6.28,3.57 8.1,2.79Q9.93,2 12,2t3.9,0.79t3.17,2.14q1.35,1.35 2.14,3.17Q22,9.92 22,12t-0.79,3.9t-2.14,3.17q-1.35,1.35-3.17,2.14T12,22q-2.07,0-3.9-0.79Zm9.58-3.54Q20,15.35 20,12T17.68,6.32T12,4T6.33,6.32T4,12t2.33,5.68T12,20t5.68-2.32ZM7.75,16.25Q6,14.5 6,12T7.75,7.75T12,6t4.25,1.75T18,12t-1.75,4.25T12,18T7.75,16.25Zm7.08-1.43Q16,13.65 16,12T14.83,9.17T12,8T9.18,9.17T8,12t1.18,2.82T12,16t2.83-1.18Zm-4.24-1.41Q10,12.83 10,12t0.59-1.41T12,10t1.41,0.59Q14,11.18 14,12t-0.59,1.41T12,14t-1.41-0.59Z"/></svg>)
const TABS = {
  PORTFOLIO: "portfolio",
  ARCHIVE: "archive",
  ROOM: "rooms",
  EVENTS: "events",
  DETAILS: "details",
  HOME:"home"
};


const PAGE_SIZE = 8;

function MyProfileContainer() {
  const router = useIonRouter();

  const profile = useSelector(
    (state) => state.users.currentProfile
  );

  const authResolved = useSelector(
    (state) => state.users.authResolved
  );



  const [tab, setTab] = useState(TABS.PORTFOLIO);

  const [portfolioSearchInput, setPortfolioSearchInput] =
    useState("");
  const [portfolioSearch, setPortfolioSearch] =
    useState("");

  const [archiveSearchInput, setArchiveSearchInput] =
    useState("");
  const [archiveSearch, setArchiveSearch] =
    useState("");

  const [collectionsSearchInput, setCollectionsSearchInput] =
    useState("");
  const [collectionsSearch, setCollectionsSearch] =
    useState("");

  const [eventsSearchInput, setEventsSearchInput] =
    useState("");
  const [eventsSearch, setEventsSearch] =
    useState("");

  const portfolioDebouncedSearch = useDebounce(
    portfolioSearch,
    300
  );

  const archiveDebouncedSearch = useDebounce(
    archiveSearch,
    300
  );

  const collectionsDebouncedSearch = useDebounce(
    collectionsSearch,
    300
  );

  const eventsDebouncedSearch = useDebounce(
    eventsSearch,
    300
  );
const archiveCollectionsResource = usePaginatedResource({
  params: { type: "archive" },
  cacheKey: "profile:collections",
  fetcher: getMyProfileCollections,
  pageSize: PAGE_SIZE,
  enabled: authResolved && Boolean(profile),
  search: archiveDebouncedSearch,
});
const homeCollectionsResource = usePaginatedResource({
  params: { type: "home" },
  cacheKey: "profile:collections",
  fetcher: getMyProfileCollections,
  pageSize: 4,
  enabled: authResolved && Boolean(profile),
  search:""
});
console.log(profile.profileToCollections)
const eventCollectionsResource = usePaginatedResource({
  params: { type: "events" },
cacheKey: "profile:collections",
  fetcher: getMyProfileCollections,
  pageSize: PAGE_SIZE,
  enabled: authResolved && Boolean(profile),
  search: eventsDebouncedSearch,
});

const portfolioCollectionsResource = usePaginatedResource({
  params: { type: "portfolio" },
  cacheKey: "profile:collections",
  fetcher: getMyProfileCollections,
  pageSize: PAGE_SIZE,
  enabled: authResolved && Boolean(profile),
  search: portfolioDebouncedSearch,
});

const collectionsResource = usePaginatedResource({
  cacheKey: "profile:collections",
  fetcher: getMyCollections,
  pageSize: PAGE_SIZE,
  enabled: authResolved && Boolean(profile),
  search: collectionsDebouncedSearch,
});

const profileCollectionIds = useMemo(() => {
  const associations = profile?.profileToCollections ?? [];

  return associations.reduce((ids, association) => {
    if (association?.type && association?.collectionId) {
      ids[association.type] = association.collectionId;
    }

    return ids;
  }, {});
}, [profile?.profileToCollections]);
const tabs = [
  {
    key: TABS.HOME,
    label: "Home",
    collectionId: profileCollectionIds.home,
  },
  {
    key: TABS.PORTFOLIO,
    label: "Portfolio",
    collectionId: profileCollectionIds.portfolio,
  },
  {
    key: TABS.ARCHIVE,
    label: "Archive",
    collectionId: profileCollectionIds.archive,
  },
  {
    key: TABS.ROOM,
    label: "Rooms",
  },
  {
    key: TABS.EVENTS,
    label: "Events",
    collectionId: profileCollectionIds.events,
  },
  {
    key: TABS.DETAILS,
    label: "Details",
  },
];
  const storiesParams = useMemo(
    () => ({
      type: "",
    }),
    []
  );

  if (!authResolved) {
    return (
      <IonContent
        scrollY={true}
 
        fullscreen
      />
    );
  }

  if (!profile) {
    return <EmptyProfileState />;
  }

  console.log(tabs)
  return (
    <IonContent scrollY={true} fullscreen={true}>
      <ErrorBoundary>
   
            <main className={[styles.pageShell.base,styles.pageShell.topMargin,styles.pageShell.scroll].join(" ")}>
             <div className={""}>
<section

  className={styles.pageShell.head}
>
  <ProfileInfo profile={profile} />

  <div className="min-w-0 flex-1">
    <h1
      id="my-profile-heading"
      className={styles.profile.mine.name}
    >
      {profile?.name ||
        profile?.username ||
        "Your Profile"}
    </h1>

    {profile?.username && (
      <p className={styles.profile.mine.username}>
        @{profile.username}
      </p>
    )}


    <div className="mt-5 flex flex-row flex-wrap  ">


  <button
    type="button"
    onClick={() => router.push(Paths.profile.createRoute(profile.id))}
    className={`
      ${styles.button.base}
      text-plumb-blueSea
      bg-transparent
      min-h-11 px-5 py-2.5
      inline-flex items-center justify-center 
     
 
      dark:border dark:border-current
    `}
  >
    
<span className="flex flex-col text-center my-auto justify-center">
    <span className={styles.text.subLabel}>Preview</span>
    {EYE}
    </span>
  </button>   

  <button
    type="button"
    aria-label="Settings"
    title="Settings"
    onClick={() => router.push(Paths.editProfile)}
    className={`
      ${styles.button.base}
      ${styles.button.iconUtility}
    my-auto p-6 
      inline-flex items-center justify-center
      rounded-xl
      dark:border dark:border-current
    `}
  >
    {SETTINGS}
  </button>
</div>
  </div>
</section>

                      <div             className={styles.tabs.pill.container+" "}>
       
           
              <TabBar
                tabs={tabs}
                active={tab}
                onChange={setTab}
                className="mx-auto"
              />
      
</div>

              <section
                aria-live="polite"
                className={styles.profile.mine.content+" px-4"}
              >
                    {tab === TABS.HOME && (<HomeSection 
                    id={tabs.find(t=>t.key==TABS.HOME).collectionId}
 profile={profile}
  resource={homeCollectionsResource}
  router={router}
  search={portfolioSearch}
  setSearch={setPortfolioSearch}
  searchInput={portfolioSearchInput}
  setSearchInput={setPortfolioSearchInput}
  debouncedSearch={portfolioDebouncedSearch}
                    
                    />)}
        {tab === TABS.PORTFOLIO && (
<PortfolioSection
id={tabs.find(t=>t.key==TABS.PORTFOLIO).collectionId}

  profile={profile}
  resource={portfolioCollectionsResource}
  router={router}
  search={portfolioSearch}
  setSearch={setPortfolioSearch}
  searchInput={portfolioSearchInput}
  setSearchInput={setPortfolioSearchInput}
  debouncedSearch={portfolioDebouncedSearch}
/>
)}
             

                {tab === TABS.ARCHIVE && (
                  <ArchiveSection
                  id={tabs.find(t=>t.key==TABS.ARCHIVE).collectionId}
    profile={profile}
    router={router}
     search={archiveSearch}
                    setSearch={setArchiveSearch}
                    searchInput={archiveSearchInput}
                    setSearchInput={setArchiveSearchInput}
                    debouncedSearch={archiveDebouncedSearch}
                    storiesParams={storiesParams}

    resource={archiveCollectionsResource}
                  
                  />
                )}

        {tab === TABS.ROOM && (
  <CollectionsSection
    profile={profile}
    router={router}
    search={collectionsSearch}
    
    setSearch={setCollectionsSearch}
    searchInput={collectionsSearchInput}
    setSearchInput={setCollectionsSearchInput}
    resource={collectionsResource}
  />
)}

                {tab === TABS.EVENTS && (
                  <EventsSection
                  id={tabs.find(t=>t.key==TABS.EVENTS).collectionId}
                   profile={profile}
    router={router}

    search={eventsSearch}
    setSearch={setEventsSearch}

    searchInput={eventsSearchInput}

    setSearchInput={setEventsSearchInput}
    // resource={eventsResource}
    resource={eventCollectionsResource}
                  
                  />
                )}

                {tab === TABS.DETAILS && (
                  <DetailsSection
                  profile={profile}
                    router={router}
                    search={eventsSearch}
                    setSearch={setEventsSearch}
                   
                    debouncedSearch={eventsDebouncedSearch}
                 
                  />
                )}
              </section>
            </div>
       
        </main>
      </ErrorBoundary>
    </IonContent>
  );
}













export default MyProfileContainer;

function EmptyProfileState() {
  const router = useIonRouter();

  return (
    <IonContent fullscreen>
      <div
        className="
          mx-auto
          max-w-[50rem]
          px-6
          pt-16
          text-center
        "
      >
        <h1 className={styles.profile.mine.emptyTitle}>
          Welcome to Plumbum
        </h1>

        <p className={styles.profile.mine.emptyText}>
          Sign in to view your profile, stories,
          collections, and communities.
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(Paths.login)
          }
          className={`${styles.button.primary} ${styles.profile.mine.emptyButton}`}
        >
          Log in / Sign up
        </button>
      </div>
    </IonContent>
  );
}