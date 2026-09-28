


import { useContext, useMemo, useState } from "react";
import { IonContent, useIonRouter } from "@ionic/react";
import { useSelector } from "react-redux";

import Context from "../context";
import ErrorBoundary from "../ErrorBoundary";
import ProfileInfo from "../components/profile/ProfileInfo";
import Paths from "../core/paths";
import Pill from "../components/Pill";
import AboutPanel from "../components/profile/AboutPanel";
import EmptyState from "../components/EmptyState";
import PaginatedList from "../components/page/PaginatedList";
import ListPill from "../components/page/ListPill";

import {
  getMyCollections,
} from "../actions/CollectionActions";

import {
  getMyStories,
} from "../actions/StoryActions";

import usePaginatedResource from "../core/usePaginatedResource";
import useDebounce from "../core/useDebounce";
import ProfileSectionTabs from "../components/profile/ProfileSectionTabs";
import EventsSection from "../components/collection/EventsSection";
import PortfolioSection from "../components/collection/PortfolioSection";

const TABS = {
  PORTFOLIO: "portfolio",
  ARCHIVE: "archive",
  COLLECTIONS: "collections",
  EVENTS: "events",
  DETAILS: "details",
};



const PAGE_SIZE = 8;


function MyProfileContainer() {
  const { setSeo } = useContext(Context);
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


  // const [searchInput, setSearchInput] = useState("");
  // const [search, setSearch] = useState("");

  // const debouncedSearch = useDebounce(search, 300);

const [portfolioSearchInput, setPortfolioSearchInput] = useState("");
const [portfolioSearch, setPortfolioSearch] = useState("");

const [archiveSearchInput, setArchiveSearchInput] = useState("");
const [archiveSearch, setArchiveSearch] = useState("");

const [collectionsSearchInput, setCollectionsSearchInput] = useState("");
const [collectionsSearch, setCollectionsSearch] = useState("");

const [eventsSearchInput, setEventsSearchInput] = useState("");
const [eventsSearch, setEventsSearch] = useState("");

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
    <IonContent
      scrollY={true}
      className="page-content"
      fullscreen
    >
      <ErrorBoundary>
        <main
          className="
            min-h-full
            bg-cream
            text-gray-800
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[76rem]
              px-6
              pb-20
              pt-16
              sm:px-10
              lg:px-12
            "
          >
            {/* PROFILE HEADER */}

            <section
              className="
                flex
                flex-col
                gap-8
                sm:flex-row
                sm:items-center
              "
            >
              <ProfileInfo profile={profile} />

              <div className="min-w-0">
                <h1
                  className="
                    font-serif
                    text-[2.5rem]
                    leading-tight
                    text-gray-900
                    sm:text-[3rem]
                  "
                >
                  {profile?.name ||
                    profile?.username ||
                    "Your Profile"}
                </h1>

                {profile?.username && (
                  <p className="mt-1 text-sm text-gray-500">
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
                  className="
                    mt-4
                    text-sm
                    text-emerald-800
                    transition
                    hover:text-emerald-950
                  "
                >
                  See what other people see →
                </button>
              </div>
            </section>
<section className="mt-10 w-[100%] mx-auto max-w-[48rem]">
<section className="mt-14 sm:mt-16">

  <ProfileSectionTabs
  active={tab}
  onChange={setTab}
/>
</section>


          

           
<section className="mt-10 w-[100%]  max-w-[48rem]">
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
{/* 
              {tab === TABS.ARCHIVE && (
                <ArchiveSection
                  profile={profile}
                  router={router}
                  search={search}
                  setSearch={setSearch}
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  debouncedSearch={debouncedSearch}
                  storiesParams={storiesParams}
                />
              )} */}
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
                  communities={communities.items}
                />
              )}
            </section>
            </section>
          </div>
        </main>
      </ErrorBoundary>
    </IonContent>
  );
}



function ArchiveSection({
  profile,
  router,
  search,
  setSearch,
  searchInput,
  setSearchInput,
  debouncedSearch,
  storiesParams,
}) {
  return (
    <section>
      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-soft
          pb-5
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <h2 className="font-serif text-2xl text-gray-900">
            Archive
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Everything I've written.
          </p>
        </div>

        <input
          value={searchInput}
          onChange={(e) => {
            const value = e.target.value;
            setSearchInput(value);
            setSearch(value);
          }}
          placeholder="Search"
          className="
            w-full
            rounded-full
            border
            border-soft
            bg-cream
            px-4
            py-2
            text-sm
            text-gray-800
            placeholder-gray-400
            outline-none
            focus:border-emerald-700
            sm:max-w-[18rem]
          "
        />
      </div>

      <div className="mt-6">
        <PaginatedList
          cacheKey="stories"
          params={storiesParams}
          fetcher={getMyStories}
          pageSize={PAGE_SIZE}
          enabled={!!profile?.id}
          search={debouncedSearch}
          emptyState={
            <EmptyState
              text={
                search
                  ? "No matching stories."
                  : "No stories yet."
              }
            />
          }
          renderItem={(item) => (
            <ListPill
              key={item.id}
              item={item}
              profile={profile}
              onClick={() =>
                router.push(
                  Paths.page.createRoute(item.id)
                )
              }
            />
          )}
        />
      </div>
    </section>
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
    <section>
      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-soft
          pb-5
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <h2 className="font-serif text-2xl text-gray-900">
            Collections
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Places and groups of work I'm part of.
          </p>
        </div>

        <input
          value={searchInput}
          onChange={(e) => {
            const value = e.target.value;

            setSearchInput(value);
            setSearch(value);
          }}
          placeholder="Search"
          className="
            w-full
            rounded-full
            border
            border-soft
            bg-cream
            px-4
            py-2
            text-sm
            text-gray-800
            placeholder-gray-400
            outline-none
            focus:border-emerald-700
            sm:max-w-[18rem]
          "
        />
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
                  Paths.collection.createRoute(
                    item.id
                  )
                )
              }
            />
          )}
        />
      </div>
    </section>
  );
}
// function CollectionsSection({
//   profile,
//   router,
//   search,
//   debouncedSearch,
// }) {
//   return (
//     <section>
//       <div className="border-b border-soft pb-5">
//         <h2 className="font-serif text-2xl text-gray-900">
//           Collections
//         </h2>

//         <p className="mt-1 text-sm text-gray-500">
//           Places and groups of work I'm part of.
//         </p>
//       </div>

//       <div className="mt-6">
//         <PaginatedList
//           cacheKey="collections"
//           params={{ type: "book" }}
//           fetcher={getMyCollections}
//           pageSize={PAGE_SIZE}
//           search={debouncedSearch}
//           emptyState={
//             <EmptyState
//               text={
//                 search
//                   ? "No matching collections."
//                   : "No collections yet."
//               }
//             />
//           }
//           renderItem={(item) => (
//             <CollectionRoomCard
//               key={item.id}
//               item={item}
//               profile={profile}
//               onClick={() =>
//                 router.push(
//                   Paths.collection.createRoute(item.id)
//                 )
//               }
//             />
//           )}
//         />
//       </div>
//     </section>
//   );
// }

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
      className="
        group
        w-[100%]
        border-b
        border-soft
        bg-transparent
        px-3
        py-5
        text-left
        transition
        duration-200
        hover:bg-cream/50
        active:scale-[0.995]
        sm:px-4
      "
    >
      <div className="flex w-[100%] items-start gap-4">
        {/* New indicator */}
        <div className="w-2 shrink-0 pt-2.5">
          {isNew && (
            <span
              aria-label="Updated"
              className="
                block
                h-2
                w-2
                rounded-full
                bg-emerald-700
              "
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          {/* Type + role */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className="
                text-[0.68rem]
                uppercase
                tracking-[0.12em]
                text-gray-400
              "
            >
              {isWorkshop
                ? "Workshop"
                : "Collection"}
            </span>

            {role && (
              <>
                <span
                  aria-hidden="true"
                  className="text-gray-300"
                >
                  ·
                </span>

                <span
                  className="
                    text-[0.68rem]
                    font-medium
                    uppercase
                    tracking-[0.12em]
                    text-emerald-800
                  "
                >
                  {formatCollectionRole(role)}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3
            className="
              mt-2
              font-serif
              text-[1.2rem]
              leading-snug
              text-gray-900
              transition-colors
              duration-200
              group-hover:text-emerald-800
            "
          >
            {title}
          </h3>

          {/* Purpose */}
          {purpose && (
            <p
              className="
                mt-1.5
                max-w-[42rem]
                line-clamp-2
                font-serif
                text-sm
                leading-relaxed
                text-gray-500
              "
            >
              {purpose}
            </p>
          )}

          {/* Workshop information */}
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
                    const story =
                      storyLink?.story;

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
                        className="
                          max-w-[14rem]
                          truncate
                          rounded-full
                          border
                          border-soft
                          bg-cream
                          px-3
                          py-1.5
                          text-xs
                          text-gray-600
                        "
                        title={storyTitle}
                      >
                        {storyTitle}
                      </span>
                    );
                  }
                )}

                {hasMoreStories && (
                  <span
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    +{contentCount -
                      visibleStories.length}{" "}
                    more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Empty workshop/collection */}
          {contentCount === 0 && (
            <p
              className="
                mt-3
                text-xs
                text-gray-400
              "
            >
              {isWorkshop
                ? role === "writer"
                  ? "Your piece will appear here."
                  : "No pieces in this room yet."
                : "No pieces in this collection yet."}
            </p>
          )}

          {/* Activity */}
          {item?.updated && (
            <p
              className="
                mt-4
                text-xs
                text-gray-400
              "
            >
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

        {/* Arrow */}
        <span
          aria-hidden="true"
          className="
            shrink-0
            pt-1
            text-lg
            leading-none
            text-gray-300
            transition-all
            duration-200
            group-hover:translate-x-1
            group-hover:text-emerald-700
          "
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
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span
        className="
          text-xs
          font-medium
          text-gray-600
        "
      >
        {parts.join(" · ")}
      </span>

      {role === "commenter" && (
        <>
          <span
            aria-hidden="true"
            className="text-gray-300"
          >
            ·
          </span>

          <span
            className="
              text-xs
              text-gray-400
            "
          >
            You’re here to read and respond
          </span>
        </>
      )}

      {role === "writer" && (
        <>
          <span
            aria-hidden="true"
            className="text-gray-300"
          >
            ·
          </span>

          <span
            className="
              text-xs
              text-gray-400
            "
          >
            You’re writing here
          </span>
        </>
      )}

      {isOwner && (
        <>
          <span
            aria-hidden="true"
            className="text-gray-300"
          >
            ·
          </span>

          <span
            className="
              text-xs
              text-gray-400
            "
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
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span
        className="
          text-xs
          font-medium
          text-gray-600
        "
      >
        {parts.join(" · ")}
      </span>

      {role && (
        <>
          <span
            aria-hidden="true"
            className="text-gray-300"
          >
            ·
          </span>

          <span
            className="
              text-xs
              text-gray-400
            "
          >
            {getCollectionRoleDescription(
              role
            )}
          </span>
        </>
      )}

      {updated && (
        <span
          className="
            text-xs
            text-gray-400
          "
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

  // Collection.profileId represents
  // the collection creator/owner.
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

  return (
    descriptions[role] ||
    ""
  );
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
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

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "";
  }

  const diff =
    Date.now() - parsed.getTime();

  const minute =
    60 * 1000;

  const hour =
    60 * minute;

  const day =
    24 * hour;

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
// function CollectionsSection({
//   profile,
//   router,
//   search,
//   debouncedSearch,
// }) {
//   return (
//     <section>
//       <div className="border-b border-soft pb-5">
//         <h2 className="font-serif text-2xl text-gray-900">
//           Collections
//         </h2>

//         <p className="mt-1 text-sm text-gray-500">
// Places and groups of work I'm part of.
//         </p>
//       </div>

//       <div className="mt-6">
//         <PaginatedList
//           cacheKey="collections"
//           params={{ type: "book" }}
//           fetcher={getMyCollections}
//           pageSize={PAGE_SIZE}
//           search={debouncedSearch}
//           emptyState={
//             <EmptyState
//               text={
//                 search
//                   ? "No matching collections."
//                   : "No collections yet."
//               }
//             />
//           }
//           renderItem={(item) => (
//             <ListPill
//               key={item.id}
//               item={item}
//               profile={profile}
//               onClick={() =>
//                 router.push(
//                   Paths.collection.createRoute(item.id)
//                 )
//               }
//             />
//           )}
//         />
//       </div>
//     </section>
//   );
// }

function DetailsSection({
  profile,
  router,
  communities,
}) {
  return (
    <section>
      <div className="border-b border-soft pb-5">
        <h2 className="font-serif text-2xl text-gray-900">
          Details
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          A little more about me.
        </p>
      </div>

      <div className="mt-6 max-w-[48rem]">
        <AboutPanel
          router={router}
          profile={profile}
        />

        {profile?.hashtag?.length > 0 && (
          <div className="mt-10">
            <p className="text-xs uppercase text-gray-400">
              Hashtags
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {[...profile.hashtag]
                .slice(0, 10)
                .map((tag, index) => (
                  <Pill
                    key={index}
                    onClick={() =>
                      router.push(
                        Paths.hashtag.createRoute(
                          tag.hashtag.id
                        )
                      )
                    }
                    label={`#${
                      tag.hashtag.name ?? tag.tag
                    }`}
                  />
                ))}
            </div>
          </div>
        )}

        {communities?.length > 0 && (
          <div className="mt-10">
            <p className="text-xs uppercase text-gray-400">
              Communities
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {communities.slice(0, 10).map((community) => (
                <Pill
                  key={community.id}
                  baseClass="border-blue bg-base-bg"
                  onClick={() =>
                    router.push(
                      Paths.collection.createRoute(
                        community.id
                      ),
                      "forward"
                    )
                  }
                  label={community.title}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
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
        <h1 className="font-serif text-2xl text-emerald-800">
          Welcome to Plumbum
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Sign in to view your profile, stories, collections,
          and communities.
        </p>

        <button
          type="button"
          onClick={() => router.push(Paths.login)}
          className="
            mt-6
            rounded-full
            bg-emerald-700
            px-6
            py-3
            text-sm
            text-white
            shadow-md
            transition
            active:scale-95
          "
        >
          Log in / Sign up
        </button>
      </div>
    </IonContent>
  );
}