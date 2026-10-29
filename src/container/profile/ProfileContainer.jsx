
import { IonContent, useIonViewDidLeave, useIonViewWillEnter, useIonRouter } from "@ionic/react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { createFollow, deleteFollow } from "../../actions/FollowAction";
import { fetchProfile } from "../../actions/UserActions";
import {
  getPublicProfilePages,
  setPagesInView,
} from "../../actions/PageActions";
import {
  getPublicProfileCollections,
  setCollections,
} from "../../actions/CollectionActions";

import ErrorBoundary from "../../ErrorBoundary";
import ProfileInfo from "../../components/profile/ProfileInfo";
import FollowButton from "../../components/profile/FollowButton";
import TabBar from "../../components/TabBar";
import PageProfileList from "../../components/page/PageProfileList";
import PaginatedList from "../../components/page/PaginatedList";
import SectionHeader from "../../components/SectionHeader";
import CommunitiesPanel from "../../components/profile/CommunitiesPanel";
import AboutPanel from "../../components/profile/AboutPanel";
import RecommendedProfiles from "../../components/page/RecommendedProfile";
import ReportContentDialog from "../../components/auth/ReportProfileDialog";

import fetchCity from "../../core/fetchCity";
import debounce from "../../core/debounce";
import Paths from "../../core/paths";
import checkResult from "../../core/checkResult";
import styles from "../../styles/style";

import horiz from "../../images/icons/more_vert.svg";

const TABS = {
  POSTS: "pages",
  COLLECTIONS: "collections",
  COMMUNITIES: "communities",
  ABOUT: "about",
};

const Pill = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={styles.profile.pill}
  >
    {label}
  </button>
);

const StatChip = ({ value, label }) => (
  <div className={styles.profile.stat}>
    <span className={styles.profile.statValue}>{value ?? 0}</span>
    <span className={styles.profile.statLabel}>{label}</span>
  </div>
);

const EmptyState = ({ text }) => (
  <div className={styles.profile.empty}>{text}</div>
);

function ProfileContainer() {
  const { profileInView: profile, currentProfile } = useSelector(
    (state) => state.users
  );

  const pagesRaw = useSelector(
    (state) => state.pages.pagesInView ?? []
  );

  const collectionsRaw = useSelector(
    (state) => state.books.collections ?? []
  );

  const dispatch = useDispatch();
  const router = useIonRouter();
  const { id } = useParams();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState(TABS.POSTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [following, setFollowing] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isSelf, setIsSelf] = useState(false);
  const [locationName, setLocationName] = useState(
    "Location not specified"
  );
  const [isReportDialogOpen, setReportDialogOpen] = useState(false);
  const [isBlockDialogOpen, setBlockDialogOpen] = useState(false);
  const [success, setSuccess] = useState(null);

  const collections = useMemo(
    () =>
      collectionsRaw
        .filter(Boolean)
        .filter((col) => col?.childCollections?.length === 0)
        .filter(
          (col) =>
            !search ||
            col.title?.toLowerCase().includes(search.toLowerCase())
        ),
    [collectionsRaw, search]
  );

  const communities = useMemo(
    () =>
      collectionsRaw
        .filter(
          (col) =>
            col &&
            (col.type === "library" || col?.childCollections?.length > 0)
        )
        .filter(
          (col) =>
            !search ||
            col.title?.toLowerCase().includes(search.toLowerCase())
        ),
    [collectionsRaw, search]
  );

  const pages = useMemo(
    () =>
      pagesRaw
        .filter(Boolean)
        .filter(
          (page) =>
            !search ||
            page.title?.toLowerCase().includes(search.toLowerCase())
        ),
    [pagesRaw, search]
  );

  const recentPosts = useMemo(
    () =>
      [...pagesRaw]
        .filter(Boolean)
        .sort(
          (a, b) =>
            new Date(b.updated ?? b.created) -
            new Date(a.updated ?? a.created)
        )
        .slice(0, 5),
    [pagesRaw]
  );

  const tabs = [
    { key: TABS.POSTS, label: "Pages" },
    { key: TABS.COLLECTIONS, label: "Collections" },
    { key: TABS.COMMUNITIES, label: "Communities" },
    { key: TABS.ABOUT, label: "About" },
  ];

  // Loading state
  useEffect(() => {
    if (!profile) return;

    const timeout = setTimeout(() => {
      setIsLoading(false);
      setIsReady(true);
    }, 120);

    return () => clearTimeout(timeout);
  }, [profile]);

  // Populate the profile's pages, collections, and counts.
  useEffect(() => {
    if (!profile) return;

    if (profile.stories) {
      dispatch(setPagesInView({ pages: profile.stories }));
    }

    if (profile.collections) {
      dispatch(setCollections({ collections: profile.collections }));
    }

    setFollowerCount(profile._count?.followers ?? 0);
    setFollowingCount(profile._count?.following ?? 0);
  }, [profile, dispatch]);

  useEffect(() => {
    if (!profile || !currentProfile) return;
    setIsSelf(profile.id === currentProfile.id);
  }, [profile, currentProfile]);

  // Resolve the profile's location.
  useEffect(() => {
    if (!profile?.location) {
      setLocationName("Location not specified");
      return;
    }

    if (profile.location.city) {
      setLocationName(profile.location.city);
      return;
    }

    fetchCity(profile.location).then(setLocationName);
  }, [profile?.location]);

  // Fetch the requested profile when the Ionic view enters.
  useIonViewWillEnter(() => {
    dispatch(fetchProfile({ id }));
  }, [id, dispatch]);

  // Clear profile-specific lists when leaving the view.
  useIonViewDidLeave(() => {
    dispatch(setPagesInView({ pages: [] }));
    dispatch(setCollections({ collections: [] }));
  });

  // Follow / unfollow
  const onClickFollow = debounce(() => {
    if (!profile || !currentProfile) return;
    if (profile.id === currentProfile.id) return;

    if (following) {
      dispatch(deleteFollow({ follow: following })).then(() => {
        setFollowerCount((prev) => Math.max(0, prev - 1));
        setFollowing(null);
      });
    } else {
      dispatch(
        createFollow({
          follower: currentProfile,
          following: profile,
        })
      ).then((res) => {
        checkResult(res, (payload) => {
          setFollowerCount((prev) => prev + 1);
          setFollowing(payload.follow);
        });
      });
    }
  }, 200);

  if (!profile || isLoading) {
    return (
      <ErrorBoundary>
        <IonContent fullscreen>
          <main className={`${styles.profile.page} min-h-screen`}>
            <ProfileSkeleton />
          </main>
        </IonContent>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
     <IonContent fullscreen>
         <main className={`${styles.profile.page} min-h-screen`}>
          <div className={styles.profile.content}>
            {/* Profile header */}
            <header className={styles.profile.header}>
              <div className={styles.profile.identity}>
                <ProfileInfo profile={profile} compact />

                <h2 className={styles.profile.username}>
                  @{profile?.username?.toLowerCase()}
                </h2>
              </div>

              {communities.length > 0 && (
                <section className="space-y-2">
                  <p className={styles.profile.sectionLabel}>
                    Communities
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {communities.slice(0, 3).map((community) => (
                      <Pill
                        key={community.id}
                        label={community.title}
                        onClick={() =>
                          router.push(
                            Paths.collection.createRoute(community.id)
                          )
                        }
                      />
                    ))}
                  </div>
                </section>
              )}

              <div className={styles.profile.stats}>
                <StatChip value={followerCount} label="Followers" />
                <StatChip value={followingCount} label="Following" />
              </div>

              {(profile.bio || profile.selfStatement) && (
                <p className={styles.profile.body}>
                  {profile.bio ?? profile.selfStatement}
                </p>
              )}

              {(profile.hashtags ?? profile.tags)?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(profile.hashtags ?? profile.tags)
                    .slice(0, 5)
                    .map((tag, index) => {
                      const label =
                        typeof tag === "string"
                          ? tag
                          : tag.name ?? tag.tag;

                      return (
                        <Pill
                          key={tag.id ?? `${label}-${index}`}
                          label={`#${label}`}
                          onClick={() => {
                            if (tag.id) {
                              router.push(
                                Paths.collection.createRoute(tag.id)
                              );
                            }
                          }}
                        />
                      );
                    })}
                </div>
              )}
            </header>

            {/* Report / block dialogs */}
            <ReportContentDialog
              contentType="profile"
              contentId={profile.id}
              mode="report"
              reportedProfileId={profile.id}
              isOpen={isReportDialogOpen}
              onClose={() => setReportDialogOpen(false)}
              onSuccess={() => setSuccess("Report submitted")}
            />

            <ReportContentDialog
              contentType="profile"
              mode="block"
              contentId={profile.id}
              reportedProfileId={profile.id}
              isOpen={isBlockDialogOpen}
              onClose={() => setBlockDialogOpen(false)}
              onSuccess={() => setSuccess("Profile blocked")}
            />

            {success && (
              <div
                role="status"
                className={styles.profile.status}
              >
                <div className="flex items-center justify-between gap-3">
                  <span>{success}</span>
                  <button
                    type="button"
                    onClick={() => setSuccess(null)}
                    className="shrink-0 rounded-full px-2 py-1"
                    aria-label="Dismiss notification"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Search, follow, and profile actions */}
            <div className={styles.profile.searchRow}>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search this profile"
                aria-label="Search this profile"
                className={styles.profile.search}
              />

              <div className={styles.profile.actions}>
                <FollowButton
                  isSelf={isSelf}
                  prof={profile}
                  onClick={onClickFollow}
                  follow={following}
                  current={currentProfile}
                />

                {!isSelf && (
                  <div className="dropdown dropdown-end shrink-0">
                    <button
                      type="button"
                      className={styles.profile.menuButton}
                      aria-label="Profile actions"
                      aria-haspopup="menu"
                    >
                      <img
                        src={horiz}
                        alt=""
                        aria-hidden="true"
                        className="h-5 w-5"
                      />
                    </button>

                    <ul
                      tabIndex={0}
                      role="menu"
                      className={`dropdown-content menu ${styles.profile.menu}`}
                    >
                      <li role="none">
                        <button
                          type="button"
                          role="menuitem"
                          className={styles.profile.menuItem}
                          onClick={() => setReportDialogOpen(true)}
                        >
                          Report
                        </button>
                      </li>

                      <li role="none">
                        <button
                          type="button"
                          role="menuitem"
                          className={`${styles.profile.menuItem} ${styles.profile.menuItemDanger}`}
                          onClick={() => setBlockDialogOpen(true)}
                        >
                          Block
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Profile tabs */}
            <div className={styles.profile.tabWrapper}>
              <TabBar
                tabs={tabs}
                active={tab}
                onChange={setTab}
              />
            </div>

            {/* Tab content */}
            <div className={styles.profile.tabContent}>
              {tab === TABS.POSTS && (
                <>
                  {!search && recentPosts.length > 0 && (
                    <section className={styles.profile.section}>
                      <SectionHeader title="Recent" />
                      <PageProfileList
                        items={recentPosts}
                        router={router}
                      />
                    </section>
                  )}

                  <section className={styles.profile.section}>
                    <SectionHeader title="All Pages" />

                    <PaginatedList
                      cacheKey={`stories:${id}`}
                      key="getPublicProfilePages"
                      fetcher={getPublicProfilePages}
                      params={{ profileId: id }}
                      pageSize={8}
                      renderItem={(page) => (
                        <button
                          key={page.id}
                          type="button"
                          onClick={() =>
                            router.push(
                              Paths.page.createRoute(page.id)
                            )
                          }
                          className={styles.profile.listItem}
                        >
                          <div className="text-left mx-4">
                            {page?.title?.length > 0
                              ? page.title
                              : "Untitled"}
                          </div>
                        </button>
                      )}
                    />
                  </section>

                  {pages.length === 0 && (
                    <EmptyState text="No posts yet." />
                  )}
                </>
              )}

              {tab === TABS.COLLECTIONS && (
                <section className={`${styles.profile.section} pt-2`}>
                  <PaginatedList
                    cacheKey={`collections:${id}`}
                    fetcher={getPublicProfileCollections}
                    params={{ profileId: id }}
                    pageSize={8}
                    renderItem={(collection) => (
                      <button
                        key={collection.id}
                        type="button"
                        onClick={() =>
                          router.push(
                            Paths.collection.createRoute(collection.id)
                          )
                        }
                        className={styles.profile.listItem}
                      >
                        <div className="text-left mx-4">
                                 {collection.title?.length > 0 ? collection.title : "Untitled"}
                        </div>
                      </button>
                    )}
                  />
                </section>
              )}

              {tab === TABS.COMMUNITIES && (
                <CommunitiesPanel
                  id={id}
                  fetch={(args) =>
                    getPublicProfileCollections({
                      profileId: id,
                      ...args,
                    })
                  }
                  communities={communities}
                  router={router}
                />
              )}

              {tab === TABS.ABOUT && (
                <AboutPanel
                  router={router}
                  profile={profile}
                  locationName={locationName}
                />
              )}
            </div>

            {/* Recommendations */}
            <section className="pb-6">
              <RecommendedProfiles profileId={id} />
            </section>
          </div>
        </main>
      </IonContent>
    </ErrorBoundary>
  );
}

export default ProfileContainer;

function ProfileSkeleton() {
  return (
    <div
      className={`${styles.profile.skeleton} motion-reduce:animate-none`}
      aria-label="Loading profile"
      role="status"
    >
      <div className="flex items-center gap-4">
        <div className={styles.profile.skeletonCircle} />

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className={`${styles.profile.skeletonLine} w-32`} />
          <div className={`${styles.profile.skeletonLine} w-24`} />
        </div>
      </div>

      <div className="flex gap-8">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="flex flex-col items-center gap-2"
          >
            <div className={`${styles.profile.skeletonLine} w-10`} />
            <div className={`${styles.profile.skeletonLine} w-16`} />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className={`${styles.profile.skeletonLine} w-full`} />
        <div className={`${styles.profile.skeletonLine} w-5/6`} />
      </div>

      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-8 w-20 rounded-full bg-plumb-border dark:bg-plumb-dark-surface"
          />
        ))}
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className={styles.profile.skeletonCard}
          />
        ))}
      </div>
    </div>
  );
}
