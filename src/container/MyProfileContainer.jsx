


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


  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);






  
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
  />
)}

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
              )}

              {tab === TABS.COLLECTIONS && (
                <CollectionsSection
                  profile={profile}
                  router={router}
                  search={search}
                  debouncedSearch={debouncedSearch}
                />
              )}

        {tab === TABS.EVENTS && (
  <EventsSection
    profile={profile}
    router={router}
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
}) {
  return (
    <section>
      <div className="border-b border-soft pb-5">
        <h2 className="font-serif text-2xl text-gray-900">
          Collections
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Groups of work I've gathered together.
        </p>
      </div>

      <div className="mt-6">
        <PaginatedList
          cacheKey="collections"
          params={{ type: "book" }}
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
            <ListPill
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