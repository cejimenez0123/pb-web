
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
        className="page-content"
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
   
            <div className={styles.profile.mine.page}>
              {/* PROFILE HEADER */}
              {/* <section
         
                aria-labelledby="my-profile-heading"
                className={styles.profile.mine.header}
              >
                <ProfileInfo profile={profile} />

                <div className="min-w-0">
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

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        Paths.profile?.createRoute
                          ? Paths.profile.createRoute(profile.id)
                          : "/profile"
                      )
                    }
                    className={`${styles.button.secondary} mt-4`}
                  >
                    See what other people see
                    <span aria-hidden="true"> →</span>
                  </button>
                </div>
              </section> */}
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

    <div className="mt-4 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() =>
          router.push(Paths.profile.editRoute(profile.id))
        }
        className={`${styles.button.base} ${styles.button.primary} px-5 py-2.5`}
      >
        <icon name="pencil" size="sm" />
        <span className="ml-2">Edit profile</span>
      </button>

      <button
        type="button"
        onClick={() =>
          router.push(
            Paths.profile.createRoute(profile.id)
          )
        }
        className={`${styles.button.base} ${styles.button.secondary} px-5 py-2.5`}
      >
        <icon name="eye" size="sm" />
        <span className="ml-2">Preview</span>
      </button>

      <button
        type="button"
        aria-label="Settings"
        onClick={() => router.push(Paths.settings)}
        className={`${styles.button.base} ${styles.button.cancel} size-11`}
      >
        <icon name="settings" size="lg" />
      </button>
    </div>
  </div>
</section>
              <section
                aria-label="Profile sections"
                className={styles.profile.mine.sections}

              >
                <TabBar    
                     tabs={tabs}            
                        active={tab}
                  onChange={setTab} />
           
              </section>

              <section
                aria-live="polite"
                className={styles.profile.mine.content}
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