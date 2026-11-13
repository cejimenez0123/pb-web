
import { IonContent, useIonViewDidLeave, useIonViewWillEnter, useIonRouter,} from "@ionic/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {createFollow,deleteFollow} from "../../actions/FollowAction"
import { fetchProfile } from "../../actions/UserActions";
import {

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

import PaginatedList from "../../components/page/PaginatedList";

import AboutPanel from "../../components/profile/AboutPanel";
import RecommendedProfiles from "../../components/page/RecommendedProfile";
import ReportContentDialog from "../../components/auth/ReportProfileDialog";

import fetchCity from "../../core/fetchCity";
import Paths from "../../core/paths";
import styles from "../../styles/style";

import horiz from "../../images/icons/more_vert.svg";
import Pill from "../../components/Pill";
import ListPill from "../../components/page/ListPill";
import { useAlert } from "../../core/useAlert";
import usePaginatedResource from "../../core/usePaginatedResource";
import { truncate } from "lodash";

const TABS = {
  POSTS: "pages",
  COLLECTIONS: "rooms",
  COMMUNITIES: "communities",
  ABOUT: "about",
};


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

  const [following, setFollowing] = useState(null);
  const communityStyles = styles.communities
  const [isSelf, setIsSelf] = useState(false);
  const [locationName, setLocationName] = useState(
    "Location not specified"
  );
  const [isReportDialogOpen, setReportDialogOpen] = useState(false);
  const [isBlockDialogOpen, setBlockDialogOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const portfolioResource = usePaginatedResource({
    cacheKey: `public-portfolio-${id}`,
    fetcher: getPublicProfileCollections,
    params: { profileId: id },
    pageSize: 8,
    enabled: Boolean(id),
    infinite: true,
  });

  // All portfolio collections loaded so far.
  const portfolioCollections = portfolioResource.items;

  // Search is local to the portfolio data already loaded.
  const normalizedSearch = search.trim().toLowerCase();

  const matchesSearch = useCallback(
    (value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(normalizedSearch),
    [normalizedSearch]
  );

  // Communities are exclusively library collections.
  const communities = useMemo(
    () =>
      portfolioCollections.filter(
        (collection) => collection?.type === "library"
      ),
    [portfolioCollections]
  );

  // Books are exclusively book collections.
  const books = useMemo(
    () =>
      portfolioCollections.filter(
        (collection) => collection?.type === "book"
      ),
    [portfolioCollections]
  );

  // Stories are gathered from the portfolio collections.
  // Deduplicate stories that appear in more than one collection.
  const posts = useMemo(() => {
    const storiesById = new Map();

    portfolioCollections.forEach((collection) => {
      (collection?.storyIdList ?? []).forEach((association) => {
        const story = association?.story;

        if (
          !story?.id ||
          story.isPrivate !== false ||
          story.status === "draft"
        ) {
          return;
        }

        if (!storiesById.has(story.id)) {
          storiesById.set(story.id, story);
        }
      });
    });

    return Array.from(storiesById.values()).sort(
      (a, b) =>
        new Date(b.updated ?? b.created ?? 0) -
        new Date(a.updated ?? a.created ?? 0)
    );
  }, [portfolioCollections]);

  const visiblePosts = useMemo(
    () =>
      posts.filter(
        (post) =>
          !normalizedSearch ||
          matchesSearch(post.title) ||
          matchesSearch(post.description)
      ),
[posts, normalizedSearch, matchesSearch]
  );

  const visibleCommunities = useMemo(
    () =>
      communities.filter(
        (collection) =>
          !normalizedSearch ||
          matchesSearch(collection.title) ||
          matchesSearch(collection.purpose)
      ),
    [communities, normalizedSearch, matchesSearch]
  );

  const visibleBooks = useMemo(
    () =>
      books.filter(
        (collection) =>
          !normalizedSearch ||
          matchesSearch(collection.title) ||
          matchesSearch(collection.purpose) ||
          (collection.childCollections ?? []).some(
            (relation) =>
              matchesSearch(relation?.childCollection?.title) ||
              matchesSearch(relation?.childCollection?.purpose)
          )
      ),
    [books, normalizedSearch, matchesSearch]
  );

  const tabs = [
    { key: TABS.POSTS, label: "Posts" },
    { key: TABS.COLLECTIONS, label: "Collections" },
    { key: TABS.COMMUNITIES, label: "Communities" },
    { key: TABS.ABOUT, label: "About" },
  ];

  // Loading state
  useEffect(() => {
    if (!profile) return;

    const timeout = setTimeout(() => {
      setIsLoading(false);
      // setIsReady(true);
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

    // setFollowerCount(profile._count?.followers ?? 0);
    // setFollowingCount(profile._count?.following ?? 0);
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
 const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
const {showPrompt}=useAlert()
const onClickFollow = async () => {
    console.log("[Follow] Handler reached");
if(!currentProfile?.id){
  showPrompt({message:"You need to join Plumbum frist!",agreeText:"Apply",
    agree:()=>{
        router.push(Paths.apply())
  }})
}

  setIsUpdatingFollow(true);

  try {
    if (following?.id) {
      await dispatch(
        deleteFollow({ follow: following })
      ).unwrap();

      setFollowing(null);
      setFollowerCount((prev) => Math.max(0, prev - 1));
    } else {
      // const result = await dispatch(createFoll)
      const result = await dispatch(
        createFollow({
          follower: currentProfile,
          following: profile,
        })
      ).unwrap();

      if (!result?.follow) {
        throw new Error("Follow record was not returned.");
      }

      setFollowing(result.follow);
      setFollowerCount((prev) => prev + 1);
    }
  } catch (error) {
    console.error("Follow action failed:", error);
  } finally {
    setIsUpdatingFollow(false);
  }
};

  if (!profile || isLoading) {
    return (

        <IonContent fullscreen>
                <ErrorBoundary>
          <main className={`${styles.profile.page} min-h-screen`}>
            <ProfileSkeleton />
          </main>
          </ErrorBoundary>
        </IonContent>
      // </ErrorBoundary>
    );
  }

  return (
  
     <IonContent fullscreen={true} scrollY={true} >
        <ErrorBoundary>

         <main className={styles.pageShell.base+" "+styles.pageShell.scroll+" "}>
       
            <header 
            className={styles.pageShell.head+" px-2"}
            >
              <div className="flex flex-row justify-end">    {!isSelf && (
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
                )}</div>
              <div className={styles.profile.identity}>
                <ProfileInfo profile={profile} compact />

                <h2 className={styles.profile.username}>
                  @{profile?.username?.toLowerCase()}
                </h2>
              </div>

              {communities.length > 0 && (
                <section className="my-4 space-y-2">
                  <p className={styles.profile.sectionLabel}>
                    Communities
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {communities.slice(0, 3).map((community) => (
                      <Pill
                        key={community.id}
                        label={community.title}
                        baseClass=" bg-plumb-blueSea/10 hover:bg-plumb-accent"
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


              

              {(profile.bio || profile.selfStatement) && (
                <p className={styles.profile.body+" my-4"}>
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
         
<div className={"mt-4 "}>
 <FollowButton
  label={following ? "Following" : "Follow"}
  following={!!following}
  isSelf={isSelf}
  onClick={onClickFollow}
  disabled={isSelf || isUpdatingFollow}
/>
</div>
   </header>
{/*  */}

         
                              {/* Portfolio navigation and content */}
            <section className="px-3 pb-8">
              {/* Search */}
              <div className={`${styles.profile.searchRow} mb-4`}>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search this profile"
                  aria-label="Search this profile"
                  className={styles.profile.search}
                />
              </div>

              {/* Tabs */}
              <div className={`${styles.tabs.pill.container} mb-5`}>
                <TabBar
                  tabs={tabs}
                  active={tab}
                  onChange={setTab}
                  className="mx-auto"
                />
              </div>

              <div className={styles.pageShell.body}>
                {/* Initial portfolio loading */}
                {portfolioResource.isLoading &&
                  portfolioCollections.length === 0 && (
                    <div
                      className="space-y-4 py-6"
                      role="status"
                      aria-live="polite"
                    >
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className={styles.profile.skeletonCard}
                        />
                      ))}
                      <span className="sr-only">
                        Loading portfolio
                      </span>
                    </div>
                  )}

                {/* Posts */}
                {tab === TABS.POSTS &&
                  !(
                    portfolioResource.isLoading &&
                    portfolioCollections.length === 0
                  ) && (
                    <section aria-labelledby="profile-posts-heading">
                      <div className="mb-4">
                        <h2
                          id="profile-posts-heading"
                          className={styles.profile.mine.sectionTitle}
                        >
                          Posts
                        </h2>
                        <p className={styles.profile.body}>
                          Writing shared through this portfolio.
                        </p>
                      </div>

                      {visiblePosts.length > 0 ? (
                        <div className="space-y-3">
                          {visiblePosts.map((post) => (
                            <ListPill
                              key={post.id}
                              item={{ story: post }}
                              onClick={() =>
                                router.push(
                                  Paths.page.createRoute(post.id)
                                )
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          text={
                            normalizedSearch
                              ? "No posts match your search."
                              : "No public posts in this portfolio yet."
                          }
                        />
                      )}
                    </section>
                  )}

                {/* Collections / Books */}
                {tab === TABS.COLLECTIONS &&
                  !(
                    portfolioResource.isLoading &&
                    portfolioCollections.length === 0
                  ) && (
                    <section aria-labelledby="profile-collections-heading">
                      <div className="mb-4">
                        <h2
                          id="profile-collections-heading"
                          className={styles.profile.mine.sectionTitle}
                        >
                          Collections
                        </h2>
                        <p className={styles.profile.body}>
                          Books and collections shared in this portfolio.
                        </p>
                      </div>

                      {visibleBooks.length > 0 ? (
                        <div className="space-y-5">
                          {visibleBooks.map((collection) => {
                            const children = (
                              collection.childCollections ?? []
                            )
                              .map(
                                (relation) => relation?.childCollection
                              )
                              .filter(
                                (child) =>
                                  child && child.isPrivate === false
                              );

                            return (
                              <article
                                key={collection.id}
                                className="space-y-3"
                              >
                                <div
                                  role="link"
                                  tabIndex={0}
                                  onClick={() =>
                                    router.push(
                                      Paths.collection.createRoute(
                                        collection.id
                                      )
                                    )
                                  }
                                  onKeyDown={(event) => {
                                    if (
                                      event.key === "Enter" ||
                                      event.key === " "
                                    ) {
                                      event.preventDefault();
                                      router.push(
                                        Paths.collection.createRoute(
                                          collection.id
                                        )
                                      );
                                    }
                                  }}
                                  className={`${communityStyles.item} cursor-pointer`}
                                >
                                  <p className={communityStyles.title}>
                                    {collection.title?.trim() ||
                                      "Untitled"}
                                  </p>

                                  {collection.purpose && (
                                    <p className={communityStyles.purpose}>
                                      {truncate(collection.purpose, 120)}
                                    </p>
                                  )}
                                </div>

                                {children.length > 0 && (
                                  <div className="pl-3">
                                    <p className={`${styles.profile.sectionLabel} mb-2`}>
                                      Inside this collection
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                      {children.map((child) => (
                                        <Pill
                                          key={child.id}
                                          label={
                                            child.title?.trim() ||
                                            "Untitled"
                                          }
                                          onClick={() =>
                                            router.push(
                                              Paths.collection.createRoute(
                                                child.id
                                              )
                                            )
                                          }
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </article>
                            );
                          })}
                        </div>
                      ) : (
                        <EmptyState
                          text={
                            normalizedSearch
                              ? "No collections match your search."
                              : "No public collections in this portfolio yet."
                          }
                        />
                      )}
                    </section>
                  )}

                {/* Communities */}
                {tab === TABS.COMMUNITIES &&
                  !(
                    portfolioResource.isLoading &&
                    portfolioCollections.length === 0
                  ) && (
                    <section aria-labelledby="profile-communities-heading">
                      <div className="mb-4">
                        <h2
                          id="profile-communities-heading"
                          className={styles.profile.mine.sectionTitle}
                        >
                          Communities
                        </h2>
                        <p className={styles.profile.body}>
                          Communities this profile has chosen to share.
                        </p>
                      </div>

                      {visibleCommunities.length > 0 ? (
                        <div className="space-y-5">
                          {visibleCommunities.map((community) => {
                            const children = (
                              community.childCollections ?? []
                            )
                              .map(
                                (relation) => relation?.childCollection
                              )
                              .filter(
                                (child) =>
                                  child && child.isPrivate === false
                              );

                            return (
                              <article
                                key={community.id}
                                className="space-y-3"
                              >
                                <div
                                  role="link"
                                  tabIndex={0}
                                  onClick={() =>
                                    router.push(
                                      Paths.collection.createRoute(
                                        community.id
                                      )
                                    )
                                  }
                                  onKeyDown={(event) => {
                                    if (
                                      event.key === "Enter" ||
                                      event.key === " "
                                    ) {
                                      event.preventDefault();
                                      router.push(
                                        Paths.collection.createRoute(
                                          community.id
                                        )
                                      );
                                    }
                                  }}
                                  className={`${communityStyles.item} cursor-pointer`}
                                >
                                  <p className={communityStyles.title}>
                                    {community.title?.trim() ||
                                      "Untitled"}
                                  </p>

                                  {community.purpose && (
                                    <p className={communityStyles.purpose}>
                                      {truncate(community.purpose, 120)}
                                    </p>
                                  )}
                                </div>

                                {children.length > 0 && (
                                  <div className="pl-3">
                                    <p className={`${styles.profile.sectionLabel} mb-2`}>
                                      Related collections
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                      {children.map((child) => (
                                        <Pill
                                          key={child.id}
                                          label={
                                            child.title?.trim() ||
                                            "Untitled"
                                          }
                                          onClick={() =>
                                            router.push(
                                              Paths.collection.createRoute(
                                                child.id
                                              )
                                            )
                                          }
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </article>
                            );
                          })}
                        </div>
                      ) : (
                        <EmptyState
                          text={
                            normalizedSearch
                              ? "No communities match your search."
                              : "No public communities in this portfolio yet."
                          }
                        />
                      )}
                    </section>
                  )}

                {/* About */}
                {tab === TABS.ABOUT && (
                  <section aria-label="About this profile">
                    <AboutPanel
                      router={router}
                      profile={profile}
                      locationName={locationName}
                    />
                  </section>
                )}

                {/* Portfolio pagination */}
                {tab !== TABS.ABOUT &&
                  portfolioResource.hasMore && (
                    <div className="flex justify-center py-7">
                      <button
                        type="button"
                        onClick={() =>
                          portfolioResource.setPage(
                            portfolioResource.page + 1
                          )
                        }
                        disabled={portfolioResource.isLoading}
                        className={`${styles.profile.menuButton} px-5 py-3`}
                      >
                        {portfolioResource.isLoading
                          ? "Loading..."
                          : "Load more"}
                      </button>
                    </div>
                  )}

                {/* Recommendations */}
                <section className="pt-8 pb-6">
                  <RecommendedProfiles profileId={id} />
                </section>
              </div>
            </section>
          {/*  */}
          </main>
     </ErrorBoundary>
      </IonContent>

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
