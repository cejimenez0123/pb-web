
import {
  IonContent,
  useIonViewWillEnter,
  useIonRouter,
} from "@ionic/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import {
  createFollow,
  deleteFollow,
} from "../../actions/FollowAction";

import {
  getPublicProfileCollections,
} from "../../actions/CollectionActions";

import { fetchProfile } from "../../actions/UserActions";

import ErrorBoundary from "../../ErrorBoundary";
import ProfileInfo from "../../components/profile/ProfileInfo";
import FollowButton from "../../components/profile/FollowButton";
import TabBar from "../../components/TabBar";
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
import grabId from "../../core/grabId";

const TABS = {
  POSTS: "pages",
  COLLECTIONS: "rooms",
  COMMUNITIES: "communities",
  ABOUT: "about",
};

const tabs = [
  { key: TABS.POSTS, label: "posts" },
  { key: TABS.COLLECTIONS, label: "collections" },
  { key: TABS.COMMUNITIES, label: "communities" },
  { key: TABS.ABOUT, label: "about" },
];

const EmptyState = ({ text }) => (
  <div className={styles.profile.empty}>
    {text}
  </div>
);
const PENCIL=(<svg className="p-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="30px" width="30px" fill="currentColor"><path d="M5,19H6.43L16.2,9.23L14.78,7.8L5,17.58V19ZM3,21V16.75L16.2,3.57q0.3-0.28 0.66-0.43T17.63,3q0.4,0 0.78,0.15T19.05,3.6L20.43,5q0.3,0.27 0.44,0.65T21,6.4q0,0.4-0.14,0.76T20.43,7.82L7.25,21H3ZM19,6.4L17.6,5L19,6.4ZM15.48,8.52L14.78,7.8L16.2,9.23l-0.72-0.7Z"/></svg>)

function ProfileContainer() {

const id = grabId(location.pathname)
  const dispatch = useDispatch();
  const router = useIonRouter();

  const {
    profileInView: profile,
    currentProfile,
  } = useSelector((state) => state.users);

  const profileReady = Boolean(
    id && profile?.id === id
  );

  const isSelf = Boolean(
    profileReady &&
    currentProfile?.id &&
    currentProfile.id === profile.id
  );

  const { showPrompt, showAlert } = useAlert();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState(TABS.POSTS);

  const [following, setFollowing] = useState(null);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

  const [locationName, setLocationName] = useState(
    "Location not specified"
  );

  const [isReportDialogOpen, setReportDialogOpen] = useState(false);
  const [isBlockDialogOpen, setBlockDialogOpen] = useState(false);
  const [success, setSuccess] = useState(null);

  const followLock = useRef(false);

  const communityStyles = styles.communities;

  // Fetch the profile whenever this Ionic view is entered.
  useIonViewWillEnter(
    useCallback(() => {
      if (id) {
        dispatch(fetchProfile({ id }));
      }
    }, [id, dispatch])
  );


const portfolioResource = usePaginatedResource({
  cacheKey: `public-portfolio-${id}`,
  fetcher: getPublicProfileCollections,
  params: { id },
  pageSize: 8,
  enabled: profileReady,
  infinite: true,
});

  const portfolioCollections = portfolioResource?.items[0]?.childCollections?.map(c=>c.childCollection) ?? []
  const portfolioPages = portfolioResource?.items[0]?.storyIdList?.map(c=>c.story) ?? []
  const normalizedSearch = search.trim().toLowerCase();

  const matchesSearch = useCallback(
    (value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(normalizedSearch),
    [normalizedSearch]
  );

  // Communities are library collections.
  const communities = useMemo(
    () =>
      portfolioCollections.filter(
        (collection) => collection?.type === "library"
      ),
    [portfolioCollections]
  );

  // Books are book collections.
  const books = useMemo(
    () =>
      portfolioCollections.filter(
        (collection) => collection?.type === "book"
      ),
    [portfolioCollections]
  );
 








  const visiblePosts = useMemo(
    () =>
      portfolioPages.filter(
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
    [portfolioPages, normalizedSearch, matchesSearch]
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

  // Initialize the follow relationship for the current viewer.
  // The protected profile response should only include relationships
  // that the current viewer is allowed to see.
  useEffect(() => {
    if (!profileReady || !currentProfile?.id) {
      setFollowing(null);
      return;
    }

    const existingFollow = (profile.followers ?? []).find(
      (follow) =>
        follow?.followerId === currentProfile.id ||
        follow?.follower?.id === currentProfile.id
    );

    setFollowing(existingFollow ?? null);
  }, [
    profileReady,
    profile?.id,
    profile?.followers,
    currentProfile?.id,
  ]);

  // Resolve the profile's location.
  useEffect(() => {
    let active = true;

    const resolveLocation = async () => {
      if (!profileReady || !profile?.location) {
        setLocationName("Location not specified");
        return;
      }

      if (profile.location.city) {
        setLocationName(profile.location.city);
        return;
      }

      setLocationName("Location not specified");

      try {
        const city = await fetchCity(profile.location);

        if (active) {
          setLocationName(city || "Location not specified");
        }
      } catch (error) {
        console.error("Location lookup failed:", error);

        if (active) {
          setLocationName("Location not specified");
        }
      }
    };

    resolveLocation();

    return () => {
      active = false;
    };
  }, [profileReady, profile?.location]);

  // Follow / unfollow.
  const onClickFollow = useCallback(async () => {
    if (
      followLock.current ||
      isUpdatingFollow ||
      isSelf ||
      !profileReady
    ) {
      return;
    }

    if (!currentProfile?.id) {
      showPrompt({
        message: "You need to join Plumbum first!",
        agreeText: "Apply",
        agree: () => router.push(Paths.apply()),
      });

      return;
    }

    followLock.current = true;
    setIsUpdatingFollow(true);

    try {
      if (following?.id) {
        await dispatch(
          deleteFollow({ follow: following })
        ).unwrap();

        setFollowing(null);
      } else {
        const result = await dispatch(
          createFollow({
            follower: currentProfile,
            following: profile,
          })
        ).unwrap();

        if (!result?.follow?.id) {
          throw new Error("Follow record was not returned.");
        }

        setFollowing(result.follow);
      }
    } catch (error) {
      console.error("Follow action failed:", error);

      showAlert({
        message: "Couldn't update your follow. Please try again.",
        type: "error",
      });
    } finally {
      followLock.current = false;
      setIsUpdatingFollow(false);
    }
  }, [
    isUpdatingFollow,
    isSelf,
    profileReady,
    currentProfile,
    following,
    profile,
    dispatch,
    showPrompt,
    showAlert,
    router,
  ]);

  // Do not render stale profile data while another profile is loading.
  if (!profileReady) {
    return (
      <IonContent fullscreen>
        <ErrorBoundary>
          <main className={`${styles.profile.page} min-h-screen`}>
            <ProfileSkeleton />
          </main>
        </ErrorBoundary>
      </IonContent>
    );
  }

  const isPortfolioLoading =
    portfolioResource.isLoading &&
    portfolioCollections.length === 0;

  const followLabel =
    following?.approved === false
      ? "Requested"
      : following
        ? "Following"
        : "Follow";

  return (
    <IonContent fullscreen={true} scrollY={true}>
      <ErrorBoundary>
        <main className={styles.pageShell.base}>
          <header className={`${styles.pageShell.head} px-2`}>
            <div className="flex flex-row justify-end">
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

            <div className={styles.profile.identity}>
              <ProfileInfo profile={profile} compact />

              <h2 className={styles.profile.username}>
                @{profile?.username?.toLowerCase()}
              </h2>
            </div>

            {communities.length > 0 && (
              <section className="my-4 space-y-2">
                <p className={styles.pageShell.sectionLabel}>
                  Communities
                </p>

                <div className="flex flex-wrap gap-2">
                  {communities.slice(0, 3).map((community) => (
                    <Pill
                      key={community.id}
                      label={community.title}
                      baseClass="bg-plumb-blueSea/10 hover:bg-plumb-accent"
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
              <p className={`${styles.profile.body} my-4`}>
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

                    if (!label) return null;

                    return (
                      <Pill
                        key={tag.id ?? `${label}-${index}`}
                        label={`#${label}`}
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

            <div className="mt-4">
              <FollowButton
                label={followLabel}
                following={Boolean(following)}
                isSelf={isSelf}
                onClick={onClickFollow}
                disabled={isSelf || isUpdatingFollow}
              />
            </div>
          </header>

          <section id="Stop">
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
              {isPortfolioLoading && (
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
{/* Posts */}
{tab === TABS.POSTS && !isPortfolioLoading && (
  <section aria-labelledby="profile-posts-heading">
    <div className="mb-6">
      <p className="
        mb-2
        text-[11px] font-semibold uppercase
        tracking-[0.14em]
        text-text-secondary dark:text-gray-400
      ">
        Writing
      </p>

      <h2
        id="profile-posts-heading"
        className={styles.profile.mine.sectionTitle}
      >
        Posts
      </h2>

      <p className={`${styles.profile.body} mt-2`}>
        Writing shared through this portfolio.
      </p>
    </div>

    {visiblePosts.length > 0 ? (
      <div className="

        grid grid-cols-1 gap-4
        md:grid-cols-2
      ">
        {visiblePosts.map((post) => (
          <div
            key={post.id}
            type="button"
            onClick={() =>
              router.push(Paths.page.createRoute(post.id))
            }
            className="

              group
              flex w-[100%] flex-col
              rounded-2xl
              border border-plumb-mint/70
              dark:border-plumb-mintLight/70
              bg-card
              p-5 sm:p-6
              text-left
              transition-all
              hover:-translate-y-0.5
              hover:border-primary/40
              hover:shadow-sm
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
      
              dark:bg-dark-surface
              dark:hover:border-primary/50
            "
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="
                text-[11px]
                font-semibold uppercase
                tracking-[0.14em]
                text-text-secondary
                dark:text-gray-400
              ">
                Post
              </span>

              <span className="
                text-sm text-text-secondary/60
                transition-all
                group-hover:translate-x-1
                group-hover:text-primary
                dark:text-gray-400
              ">
                ↗
              </span>
            </div>

            <h3 className="
              font-serif
              text-xl sm:text-2xl
              leading-snug
              text-text-primary
              transition-colors
              group-hover:text-primary
              dark:text-cream
            ">
              {post.title?.trim() || "Untitled"}
            </h3>

            {post.description && (
              <p className="
                mt-3
                line-clamp-3
                text-sm leading-relaxed
                text-text-secondary
                dark:text-gray-300
              ">
                {post.description}
              </p>
            )}

            <div className="
              mt-auto flex items-center
              justify-between
              border-t border-card-border
              pt-4 mt-5
              dark:border-white/10
            ">
              <span className="
                text-xs
                text-text-secondary
                dark:text-gray-400
              ">
                Read post
              </span>

              <span className="
                text-sm font-medium
                text-primary
                opacity-80
                transition-opacity
                group-hover:opacity-100
              ">
                Open →
              </span>
            </div>
          </div>
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
              {tab === TABS.COLLECTIONS && !isPortfolioLoading && (
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
                    <PortfolioCollectionList
                      items={visibleBooks}
                      router={router}
                      childLabel="Inside this collection"
                      communityStyles={communityStyles}
                    />
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
              {tab === TABS.COMMUNITIES && !isPortfolioLoading && (
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
                    <PortfolioCollectionList
                      items={visibleCommunities}
                      router={router}
                      childLabel="Related collections"
                      communityStyles={communityStyles}
                    />
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
        </main>
      </ErrorBoundary>
    </IonContent>
  );
}

export default ProfileContainer;

// function PortfolioCollectionList({
//   items,
//   router,
//   childLabel,
//   communityStyles,
// }) {
//   return (
//     <div className="space-y-5">
//       {items.map((collection) => {
//         const children = (collection.childCollections ?? [])
//           .map((relation) => relation?.childCollection)
//           .filter((child) => child?.isPrivate === false);

//         return (
//           <article
//             key={collection.id}
//             className="space-y-3"
//           >
//             <button
//               type="button"
//               onClick={() =>
//                 router.push(
//                   Paths.collection.createRoute(collection.id)
//                 )
//               }
//               className={`${communityStyles.item} w-[100%] text-left`}
//             >
//               <p className={communityStyles.title}>
//                 {collection.title?.trim() || "Untitled"}
//               </p>

//               {collection.purpose && (
//                 <p className={communityStyles.purpose}>
//                   {truncate(collection.purpose, 120)}
//                 </p>
//               )}
//             </button>

//             {children.length > 0 && (
//               <div className="pl-3">
//                 <p
//                   className={`${styles.pageShell.sectionLabel} mb-2`}
//                 >
//                   {childLabel}
//                 </p>

//                 <div className="flex flex-wrap gap-2">
//                   {children.map((child) => (
                   
//                       <span
//                         key={
//                           child?.id||
//                           index
//                         }
//                         className={styles.profile.mine.storyTag}
//                         title={storyTitle}
//                       >
//                         {child.titlee}
//                       </span>
                    
//                     // <Pill
//                     //   key={child.id}
//                     //   label={child.title?.trim() || "Untitled"}
//                     //   onClick={() =>
//                     //     router.push(
//                     //       Paths.collection.createRoute(child.id)
//                     //     )
//                     //   }
//                     // />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </article>
//         );
//       })}
//     </div>
//   );
// }

function PortfolioCollectionList({
  items,
  router,
  childLabel,
  communityStyles,
}) {
  return (
    <div className="space-y-6">
      {items.map((collection) => {
        const children = (collection.childCollections ?? [])
          .map((relation) => relation?.childCollection)
          .filter((child) => child?.isPrivate === false);

        const title = collection.title?.trim() || "Untitled";

        return (
          <div
            key={collection.id}
            className="

              overflow-hidden
              rounded-2xl
              border border-plumb-mint/70
                dark:border-plumb-mintLight/70
              border-1
              bg-card
              transition-colors
              hover:border-primary/40
             
              dark:bg-dark-surface
            "
          >
            {/* Main collection */}
            <button
              type="button"
              onClick={() =>
                router.push(
                  Paths.collection.createRoute(collection.id)
                )
              }
              className="
                group
                w-[100%]
                p-5 sm:p-6
                text-left
                transition-colors
                hover:bg-base-200/50
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-inset
                focus-visible:ring-primary
                dark:hover:bg-white/[0.04]
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-text-secondary
                      dark:text-gray-400
                    ">
                      Collection
                    </span>

                    {children.length > 0 && (
                      <>
                        <span className="text-text-secondary/50">·</span>
                        <span className="
                          text-xs
                          text-text-secondary
                          dark:text-gray-400
                        ">
                          {children.length} {children.length === 1 ? "room" : "rooms"}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="
                    font-serif
                    text-xl sm:text-2xl
                    leading-snug
                    text-text-primary
                    transition-colors
                    group-hover:text-primary
                    dark:text-cream
                  ">
                    {title}
                  </h3>

                  {collection.purpose && (
                    <p className="
                      mt-2
                      max-w-2xl
                      text-sm
                      leading-relaxed
                      text-text-secondary
                      dark:text-gray-300
                    ">
                      {truncate(collection.purpose, 180)}
                    </p>
                  )}
                </div>

                <span className="
                  mt-1
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-full
                  border border-card-border
                  text-text-secondary
                  transition-all
                  group-hover:translate-x-1
                  group-hover:border-primary/40
                  group-hover:text-primary
                  dark:border-white/10
                  dark:text-gray-300
                ">
                  <span aria-hidden="true">{PENCIL}</span>
                </span>
              </div>
            </button>

            {/* Child rooms */}
            {children.length > 0 && (
              <div className="
                border-t border-card-border
                px-5 py-4 sm:px-6
                dark:border-white/10
              ">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-text-secondary
                    dark:text-gray-400
                  ">
                    {childLabel || "Inside this collection"}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() =>
                        router.push(
                          Paths.collection.createRoute(child.id)
                        )
                      }
                      className="
                        group/child
                        flex min-w-0 items-center gap-3
                        rounded-xl
                        px-3 py-3
                        text-left
                        transition-colors
                        hover:bg-base-200
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-primary
                        dark:hover:bg-white/[0.06]
                      "
                    >
                      <span className="
                        flex h-8 w-8 shrink-0
                        items-center justify-center
                        rounded-lg
                        bg-base-200
                        text-text-secondary
                        dark:bg-white/10
                        dark:text-gray-300
                      ">
                        <span aria-hidden="true">↳</span>
                      </span>

                      <span className="
                        min-w-0 flex-1 truncate
                        text-sm font-medium
                        text-text-primary
                        transition-colors
                        group-hover/child:text-primary
                        dark:text-gray-200
                      ">
                        {child.title?.trim() || "Untitled"}
                      </span>

                      <span className="
                        shrink-0
                        text-sm
                        text-text-secondary/60
                        transition-transform
                        group-hover/child:translate-x-0.5
                        group-hover/child:text-primary
                      ">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

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
