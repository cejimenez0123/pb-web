
import { useMemo, useState } from "react";
import { IonContent, useIonRouter } from "@ionic/react";
import { useSelector } from "react-redux";
import ErrorBoundary from "../ErrorBoundary";
import ProfileInfo from "../components/profile/ProfileInfo";
import Paths from "../core/paths";

import PaginatedList from "../components/page/PaginatedList";

import {
  getMyCollections,
} from "../actions/CollectionActions";



import useDebounce from "../core/useDebounce";
import ProfileSectionTabs from "../components/profile/ProfileSectionTabs";
import EventsSection from "../components/collection/EventsSection";
import PortfolioSection from "../components/collection/PortfolioSection";
import EmptyState from "../components/general/EmptyState";
import styles from "../styles/style";
import DetailsSection from "../components/profile/DetailsSection";
import ArchiveSection from "../components/profile/ArchiveSection";
import TabBar from "../components/TabBar";
const SETTINGS=(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="30px" width="30px" fill="currentColor"><path d="M9.25,22l-0.4-3.2q-0.32-0.13-0.61-0.3T7.68,18.13L4.7,19.38L1.95,14.63l2.58-1.95Q4.5,12.5 4.5,12.34q0-0.16 0-0.34t0-0.34t0.03-0.34L1.95,9.38L4.7,4.63L7.68,5.88Q7.95,5.68 8.25,5.5t0.6-0.3L9.25,2h5.5l0.4,3.2q0.33,0.13 0.61,0.3t0.56,0.38L19.3,4.63l2.75,4.75l-2.57,1.95q0.02,0.18 0.02,0.34t0,0.34t0,0.34t-0.05,0.34l2.57,1.95l-2.75,4.75l-2.95-1.25q-0.27,0.2-0.57,0.38t-0.6,0.3L14.75,22H9.25ZM11,20h1.98l0.35-2.65q0.78-0.2 1.44-0.59t1.21-0.94l2.47,1.03l0.98-1.7l-2.15-1.63q0.13-0.35 0.17-0.74T17.5,12t-0.05-0.79q-0.05-0.39-0.17-0.74l2.15-1.63l-0.98-1.7L15.98,8.2q-0.55-0.57-1.21-0.96T13.33,6.65L13,4H11.03L10.68,6.65Q9.9,6.85 9.24,7.24T8.03,8.17L5.55,7.15L4.58,8.85l2.15,1.6Q6.6,10.83 6.55,11.2T6.5,12q0,0.4 0.05,0.77t0.17,0.75L4.58,15.15l0.98,1.7L8.03,15.8q0.55,0.58 1.21,0.96t1.44,0.59L11,20Zm1.05-4.5q1.45,0 2.47-1.03T15.55,12T14.53,9.52T12.05,8.5q-1.47,0-2.49,1.02T8.55,12t1.01,2.47t2.49,1.03ZM12,12Z"/></svg>)
const PENCIL=(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="18px" width="18px" fill="currentColor"><path d="M5,19H6.43L16.2,9.23L14.78,7.8L5,17.58V19ZM3,21V16.75L16.2,3.57q0.3-0.28 0.66-0.43T17.63,3q0.4,0 0.78,0.15T19.05,3.6L20.43,5q0.3,0.27 0.44,0.65T21,6.4q0,0.4-0.14,0.76T20.43,7.82L7.25,21H3ZM19,6.4L17.6,5L19,6.4ZM15.48,8.52L14.78,7.8L16.2,9.23l-0.72-0.7Z"/></svg>)
const EYE=(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="18px" width="18px" fill="currentColor"><path d="M8.1,21.21q-1.82-0.79-3.17-2.14Q3.58,17.73 2.79,15.9T2,12Q2,9.92 2.79,8.1Q3.58,6.27 4.93,4.93Q6.28,3.57 8.1,2.79Q9.93,2 12,2t3.9,0.79t3.17,2.14q1.35,1.35 2.14,3.17Q22,9.92 22,12t-0.79,3.9t-2.14,3.17q-1.35,1.35-3.17,2.14T12,22q-2.07,0-3.9-0.79Zm9.58-3.54Q20,15.35 20,12T17.68,6.32T12,4T6.33,6.32T4,12t2.33,5.68T12,20t5.68-2.32ZM7.75,16.25Q6,14.5 6,12T7.75,7.75T12,6t4.25,1.75T18,12t-1.75,4.25T12,18T7.75,16.25Zm7.08-1.43Q16,13.65 16,12T14.83,9.17T12,8T9.18,9.17T8,12t1.18,2.82T12,16t2.83-1.18Zm-4.24-1.41Q10,12.83 10,12t0.59-1.41T12,10t1.41,0.59Q14,11.18 14,12t-0.59,1.41T12,14t-1.41-0.59Z"/></svg>)
const TABS = {
  PORTFOLIO: "portfolio",
  ARCHIVE: "archive",
  COLLECTIONS: "collections",
  EVENTS: "events",
  DETAILS: "details",
};
 const tabs = [
   { key: TABS.PORTFOLIO, label: "portfilo" },
    { key: TABS.ARCHIVE, label: "archive" },
    { key: TABS.COLLECTIONS, label: "collections" },
    {key:TABS.EVENTS, label:"events"},
    { key: TABS.DETAILS, label: "details" },
   
  ];

const PAGE_SIZE = 8;

function MyProfileContainer() {
  const router = useIonRouter();

  const profile = useSelector(
    (state) => state.users.currentProfile
  );

  const authResolved = useSelector(
    (state) => state.users.authResolved
  );

  const librariesCache = useSelector(
    (state) =>
      state.pagination.byKey?.["libraries"]?.pages?.[1] ?? []
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

  const communities = {
    items: librariesCache,
  };

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

  return (
    <IonContent scrollY={true} fullscreen>
      <ErrorBoundary>
   
            <div className={styles.pageShell.base}>
             <div className={styles.pageShell.inner}>
<section
  aria-labelledby="my-profile-heading"
  className={styles.profile.mine.header}
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
    onClick={() => router.push(Paths.profile.editRoute(profile.id))}
    className={`
      ${styles.button.base}
   bg-transparent
   text-plumb-mint
      min-h-11 px-5 py-2.5
      inline-flex 
      flex flex-col
   
    `}
  >
  
    {/* <icon name="pencil" size="sm" /> */}
    <span className="mb-2">Edit profile</span>
      {PENCIL}
  </button>

  <button
    type="button"
    onClick={() => router.push(Paths.profile.createRoute(profile.id))}
    className={`
      ${styles.button.base}
      text-plumb-blueSea
      bg-transparent
      min-h-11 px-5 py-2.5
      inline-flex items-center justify-center 
     
      flex flex-col
      dark:border dark:border-current
    `}
  >
    
    {/* <icon name="eye" size="sm" /> */}
    <span className="mb-2">Preview</span>
    {EYE}
  </button>

  <button
    type="button"
    aria-label="Settings"
    title="Settings"
    onClick={() => router.push(Paths.settings)}
    className={`
      ${styles.button.base}
      ${styles.button.iconUtility}
      min-h-11 min-w-11 p-2.5
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
              <section
                aria-label="Profile sections"
                className={styles.tabs.container}

              >
                <div className="overflow-x-scroll">
                <TabBar    
                     tabs={tabs}            
                        active={tab}
                  onChange={setTab} />
           </div>
              </section>

              <section
                aria-live="polite"
                className={styles.profile.mine.content+" px-4"}
              >
                {tab === TABS.PORTFOLIO && (
                  <PortfolioSection
                    profile={profile}
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
                    profile={profile}
                    router={router}
                    search={archiveSearch}
                    setSearch={setArchiveSearch}
                    searchInput={archiveSearchInput}
                    setSearchInput={setArchiveSearchInput}
                    debouncedSearch={archiveDebouncedSearch}
                    storiesParams={storiesParams}
                  />
                )}

                {tab === TABS.COLLECTIONS && (
                  <CollectionsSection
                    profile={profile}
                    router={router}
                    search={collectionsSearch}
                    setSearch={setCollectionsSearch}
                    searchInput={collectionsSearchInput}
                    setSearchInput={setCollectionsSearchInput}
                    debouncedSearch={collectionsDebouncedSearch}
                  />
                )}

                {tab === TABS.EVENTS && (
                  <EventsSection
                    profile={profile}
                    router={router}
                    search={eventsSearch}
                    setSearch={setEventsSearch}
                    searchInput={eventsSearchInput}
                    setSearchInput={setEventsSearchInput}
                    debouncedSearch={eventsDebouncedSearch}
                  />
                )}

                {tab === TABS.DETAILS && (
                  <DetailsSection
                  profile={profile}
                    router={router}
                    search={eventsSearch}
                    setSearch={setEventsSearch}
                    // searchInput={eventsSearchInput}
                    // setSearchInput={setEventsSearchInput}
                    debouncedSearch={eventsDebouncedSearch}
                    // profile={profile}
                    // router={router}
                    // communities={communities.items}
                  />
                )}
              </section>
            </div>
          {/* </div>
        </main> */}
        </div>
      </ErrorBoundary>
    </IonContent>
  );
}



function CollectionsSection({
  profile,
  router,
  search,
  debouncedSearch,
  setSearch,
  searchInput,
  setSearchInput,
}) {
  return (
    <section aria-labelledby="collections-heading">
      <div className={styles.profile.mine.sectionHeader}>
        <div>
          <h2
            id="collections-heading"
            className={styles.profile.mine.sectionTitle}
          >
            Collections
          </h2>

          <p className={styles.profile.mine.sectionDescription}>
            Places and groups of work I'm part of.
          </p>
        </div>

        <label className="w-full sm:max-w-[18rem]">
          <span className="sr-only">
            Search collections
          </span>

          <input
            type="search"
            value={searchInput}
            onChange={(e) => {
              const value = e.target.value;
              setSearchInput(value);
              setSearch(value);
            }}
            placeholder="Search"
            aria-label="Search collections"
            className={styles.profile.mine.search}
          />
        </label>
      </div>

      <div className="mt-6">
        <PaginatedList
          cacheKey="collections"
          params={{}}
          fetcher={getMyCollections}
          pageSize={PAGE_SIZE}
          search={debouncedSearch}
          emptyState={
            <EmptyState
              text={
                search
                  ? "No matching collections."
                  : "No collections yet."
              }
            />
          }
          renderItem={(item) => (
            <CollectionRoomCard
              key={item.id}
              item={item}
              profile={profile}
              onClick={() =>
                router.push(
                  Paths.collection.createRoute(item.id)
                )
              }
            />
          )}
        />
      </div>
    </section>
  );
}

function CollectionRoomCard({
  item,
  profile,
  onClick,
}) {
  const title =
    item?.title?.trim() || "Untitled";

  const purpose =
    item?.purpose?.trim() || "";

  const isWorkshop =
    item?.isWorkshop === true ||
    item?.type === "feedback";

  const role = getCollectionRole({
    item,
    profile,
  });

  const stories = Array.isArray(item?.storyIdList)
    ? item.storyIdList
    : [];

  const roles = Array.isArray(item?.roles)
    ? item.roles
    : [];

  const writerCount = roles.filter(
    (membership) =>
      membership?.role === "writer"
  ).length;

  const memberCount = roles.filter(
    (membership) =>
      membership?.role !== "owner"
  ).length;

  const visibleStories = stories
    .filter((storyLink) => storyLink?.story)
    .slice(0, 2);

  const hasMoreStories =
    stories.length > visibleStories.length;

  const contentCount = stories.length;

  const isOwner = role === "owner";

  const isNew =
    item?.updated &&
    profile?.lastNotified &&
    new Date(item.updated).getTime() >
      new Date(profile.lastNotified).getTime();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open ${title}${
        isWorkshop ? " workshop" : " collection"
      }`}
      className={styles.profile.mine.collectionItem}
    >
      <div className="flex w-[100%] items-start gap-4">
        {/* Updated indicator */}
        <div
          className="w-2 shrink-0 pt-2.5"
          aria-hidden={!isNew}
        >
          {isNew && (
            <span
              aria-label="Updated since your last visit"
              className={styles.profile.mine.updated}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          {/* Type + role */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className={styles.profile.mine.type}>
              {isWorkshop
                ? "Workshop"
                : "Collection"}
            </span>

            {role && (
              <>
                <span
                  aria-hidden="true"
                  className="text-plumb-border dark:text-plumb-darkBorder"
                >
                  ·
                </span>

                <span className={styles.profile.mine.role}>
                  {formatCollectionRole(role)}
                </span>
              </>
            )}
          </div>

          <h3 className={styles.profile.mine.title}>
            {title}
          </h3>

          {purpose && (
            <p className={styles.profile.mine.purpose}>
              {purpose}
            </p>
          )}

          {isWorkshop ? (
            <WorkshopMeta
              role={role}
              writerCount={writerCount}
              memberCount={memberCount}
              contentCount={contentCount}
              isOwner={isOwner}
            />
          ) : (
            <CollectionMeta
              role={role}
              contentCount={contentCount}
              childCollectionCount={
                Array.isArray(item?.childCollections)
                  ? item.childCollections.length
                  : 0
              }
              updated={item?.updated}
            />
          )}

          {/* Content preview */}
          {visibleStories.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {visibleStories.map(
                  (storyLink, index) => {
                    const story = storyLink?.story;

                    const storyTitle =
                      story?.title?.trim() ||
                      "Untitled";

                    return (
                      <span
                        key={
                          storyLink?.id ||
                          story?.id ||
                          index
                        }
                        className={styles.profile.mine.storyTag}
                        title={storyTitle}
                      >
                        {storyTitle}
                      </span>
                    );
                  }
                )}

                {hasMoreStories && (
                  <span
                    className={
                      styles.profile.mine.metaSecondary
                    }
                  >
                    +{contentCount -
                      visibleStories.length}{" "}
                    more
                  </span>
                )}
              </div>
            </div>
          )}

          {contentCount === 0 && (
            <p className={styles.profile.mine.activity}>
              {isWorkshop
                ? role === "writer"
                  ? "Your piece will appear here."
                  : "No pieces in this room yet."
                : "No pieces in this collection yet."}
            </p>
          )}

          {item?.updated && (
            <p className={styles.profile.mine.activity}>
              {isWorkshop
                ? `Active ${formatRelativeDate(
                    item.updated
                  )}`
                : `Updated ${formatDate(
                    item.updated
                  )}`}
            </p>
          )}
        </div>

        <span
          aria-hidden="true"
          className={styles.profile.mine.arrow}
        >
          →
        </span>
      </div>
    </button>
  );
}

function WorkshopMeta({
  role,
  writerCount,
  memberCount,
  contentCount,
  isOwner,
}) {
  const parts = [];

  if (contentCount > 0) {
    parts.push(
      `${contentCount} ${
        contentCount === 1
          ? "piece"
          : "pieces"
      }`
    );
  } else {
    parts.push("No pieces");
  }

  if (writerCount > 0) {
    parts.push(
      `${writerCount} ${
        writerCount === 1
          ? "writer"
          : "writers"
      }`
    );
  }

  return (
    <div className={styles.profile.mine.meta}>
      <span className={styles.profile.mine.metaText}>
        {parts.join(" · ")}
      </span>

      {role === "commenter" && (
        <>
          <span
            aria-hidden="true"
            className="text-plumb-border dark:text-plumb-darkBorder"
          >
            ·
          </span>

          <span
            className={
              styles.profile.mine.metaSecondary
            }
          >
            You’re here to read and respond
          </span>
        </>
      )}

      {role === "writer" && (
        <>
          <span
            aria-hidden="true"
            className="text-plumb-border dark:text-plumb-darkBorder"
          >
            ·
          </span>

          <span
            className={
              styles.profile.mine.metaSecondary
            }
          >
            You’re writing here
          </span>
        </>
      )}

      {isOwner && (
        <>
          <span
            aria-hidden="true"
            className="text-plumb-border dark:text-plumb-darkBorder"
          >
            ·
          </span>

          <span
            className={
              styles.profile.mine.metaSecondary
            }
          >
            You created this room
          </span>
        </>
      )}
    </div>
  );
}

function CollectionMeta({
  role,
  contentCount,
  childCollectionCount,
  updated,
}) {
  const parts = [];

  parts.push(
    `${contentCount} ${
      contentCount === 1
        ? "piece"
        : "pieces"
    }`
  );

  if (childCollectionCount > 0) {
    parts.push(
      `${childCollectionCount} ${
        childCollectionCount === 1
          ? "collection"
          : "collections"
      }`
    );
  }

  return (
    <div className={styles.profile.mine.meta}>
      <span className={styles.profile.mine.metaText}>
        {parts.join(" · ")}
      </span>

      {role && (
        <>
          <span
            aria-hidden="true"
            className="text-plumb-border dark:text-plumb-darkBorder"
          >
            ·
          </span>

          <span
            className={
              styles.profile.mine.metaSecondary
            }
          >
            {getCollectionRoleDescription(role)}
          </span>
        </>
      )}

      {updated && (
        <span
          className={
            styles.profile.mine.metaSecondary
          }
        >
          · Updated {formatDate(updated)}
        </span>
      )}
    </div>
  );
}

function getCollectionRole({
  item,
  profile,
}) {
  if (!item || !profile?.id) {
    return null;
  }

  if (
    item.profileId &&
    item.profileId === profile.id
  ) {
    return "owner";
  }

  const membership =
    Array.isArray(item.roles)
      ? item.roles.find(
          (role) =>
            role?.profileId === profile.id
        )
      : null;

  return membership?.role || null;
}

function formatCollectionRole(role) {
  const labels = {
    owner: "Owner",
    writer: "Writer",
    commenter: "Commenter",
    editor: "Editor",
    reader: "Reader",
  };

  return labels[role] || role;
}

function getCollectionRoleDescription(role) {
  const descriptions = {
    owner: "You created this",
    writer: "You contribute work",
    commenter: "You give feedback",
    editor: "You help shape this",
    reader: "You can read this",
  };

  return descriptions[role] || "";
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(parsed);
}

function formatRelativeDate(date) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const diff =
    Date.now() - parsed.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "just now";
  }

  if (diff < hour) {
    const minutes = Math.floor(
      diff / minute
    );

    return `${minutes} ${
      minutes === 1
        ? "minute"
        : "minutes"
    } ago`;
  }

  if (diff < day) {
    const hours = Math.floor(
      diff / hour
    );

    return `${hours} ${
      hours === 1
        ? "hour"
        : "hours"
    } ago`;
  }

  if (diff < 7 * day) {
    const days = Math.floor(
      diff / day
    );

    return `${days} ${
      days === 1
        ? "day"
        : "days"
    } ago`;
  }

  return formatDate(date);
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