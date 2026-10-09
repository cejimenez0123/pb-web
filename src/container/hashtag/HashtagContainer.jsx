import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useIonRouter,
  IonContent,
} from "@ionic/react";

import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router";

import ErrorBoundary from "../../ErrorBoundary";

import {
  fetchHashtag,
  followHashtag,
  getRecommendedHashtagCollections,
  unfollowHashtag,
} from "../../actions/HashtagActions";

import { setCollections } from "../../actions/CollectionActions";

import {
  appendToPagesInView,
  setPagesInView,
} from "../../actions/PageActions.jsx";

import { BookListItem } from "../../components/collection/BookListItem";
import DashboardItem from "../../components/page/DashboardItem";
import ExploreList from "../../components/collection/ExploreList.jsx";

import Paths from "../../core/paths.js";
import checkResult from "../../core/checkResult";
import AlertType from "../../core/AlertType.js";
import { useAlert } from "../../core/useAlert.jsx";
import useScrollTracking from "../../core/useScrollTracking.jsx";
import usePaginatedResource from "../../core/usePaginatedResource.jsx";

import grid from "../../images/grid.svg";
import stream from "../../images/stream.svg";


// ---------------------------------------------------------
// Layout
// ---------------------------------------------------------

const PAGE =
  "w-full max-w-[52rem] mx-auto px-4 sm:px-6 lg:px-8";

const SECTION =
  "py-8 sm:py-10";

const BUTTON =
  "inline-flex items-center justify-center h-11 px-5 rounded-full " +
  "text-sm font-medium transition-all duration-200 " +
  "focus:outline-none focus:ring-2 focus:ring-button-primary-bg/30 " +
  "disabled:opacity-50 disabled:pointer-events-none";

const PRIMARY_BUTTON =
  `${BUTTON} bg-button-primary-bg text-white hover:bg-button-primary-hover`;

const SECONDARY_BUTTON =
  `${BUTTON} border border-card-border bg-card-background ` +
  `text-text-primary hover:border-button-primary-bg ` +
  `hover:text-text-brand`;

const PAGE_SIZE = 20;


// ---------------------------------------------------------
// Main
// ---------------------------------------------------------

export default function HashtagContainer() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useIonRouter();

  const { showAlert } = useAlert();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const collections = useSelector(
    (state) => state.books.collections ?? []
  );

  const pagesInView = useSelector(
    (state) => state.pages.pagesInView ?? []
  );

  const [hashtag, setHashtag] = useState(null);
  const [loading, setLoading] = useState(true);

  const [following, setFollowing] = useState(false);
  const [followPending, setFollowPending] = useState(false);

  const [isGrid, setIsGrid] = useState(false);

  const isNotPhone = useMediaQuery({
    query: "(min-width: 999px)",
  });


  // -------------------------------------------------------
  // Recommended collections
  // -------------------------------------------------------

  const {
    items,
    totalCount,
    page,
    setPage,
  } = usePaginatedResource({
    cacheKey: `hashtag-recommendations:${id}`,
    fetcher: getRecommendedHashtagCollections,
    params: {
      hashtagIds: [id],
    },
    pageSize: PAGE_SIZE,
    enabled: !!id,
    select: (res) => ({
      items: res?.collections ?? [],
      totalCount: res?.totalCount ?? 0,
    }),
  });


  // -------------------------------------------------------
  // Derived content
  // -------------------------------------------------------

  const libraries = useMemo(
    () =>
      collections.filter(
        (collection) =>
          collection &&
          collection.childCollections?.length > 0
      ),
    [collections]
  );

  const regularCollections = useMemo(
    () =>
      collections.filter(
        (collection) =>
          collection &&
          collection.childCollections?.length === 0
      ),
    [collections]
  );

  const stories = useMemo(
    () =>
      pagesInView.filter(Boolean),
    [pagesInView]
  );


  // -------------------------------------------------------
  // Scroll / responsive behavior
  // -------------------------------------------------------

  useScrollTracking({
    contentType: "hashtag",
    contentId: id,
  });

  useEffect(() => {
    if (!isNotPhone) {
      setIsGrid(false);
    }
  }, [isNotPhone]);


  // -------------------------------------------------------
  // Load hashtag
  // -------------------------------------------------------

  useLayoutEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function loadHashtag() {
      setLoading(true);

      /*
       * Clear stale room content when moving
       * from one hashtag to another.
       */
      dispatch(
        setCollections({
          collections: [],
        })
      );

      dispatch(
        setPagesInView({
          pages: [],
        })
      );

      try {
        const result = await dispatch(
          fetchHashtag({ id })
        );

        if (cancelled) return;

        checkResult(
          result,
          (payload) => {
            if (cancelled) return;

            const fetchedHashtag =
              payload?.hashtag;

            if (!fetchedHashtag) {
              showAlert({
                message: "No hashtag found",
                type: AlertType.error,
              });

              setLoading(false);
              return;
            }

            setHashtag(fetchedHashtag);

            setFollowing(
              !!fetchedHashtag.followers?.some(
                (follower) =>
                  follower.followerId ===
                  currentProfile?.id
              )
            );


            // ---------------------------------------------
            // Direct hashtag stories
            // ---------------------------------------------

            const directStories =
              fetchedHashtag.stories
                ?.map((item) => item?.story)
                .filter(Boolean) ?? [];

            dispatch(
              setPagesInView({
                pages: directStories,
              })
            );


            // ---------------------------------------------
            // Direct hashtag collections
            // ---------------------------------------------

            const hashtagCollections =
              fetchedHashtag.collections
                ?.map(
                  (item) =>
                    item?.collection
                )
                .filter(Boolean) ?? [];

            dispatch(
              setCollections({
                collections:
                  hashtagCollections,
              })
            );


            // ---------------------------------------------
            // Stories inside hashtag collections
            // ---------------------------------------------

            fetchedHashtag.collections?.forEach(
              (relationship) => {
                const storyList =
                  relationship?.collection
                    ?.storyIdList ?? [];

                storyList.forEach(
                  (storyRelationship) => {
                    if (
                      storyRelationship?.story
                    ) {
                      dispatch(
                        appendToPagesInView({
                          pages: [
                            storyRelationship.story,
                          ],
                        })
                      );
                    }
                  }
                );
              }
            );

            setLoading(false);
          },
          (error) => {
            if (cancelled) return;

            setLoading(false);

            showAlert({
              message:
                error?.message ??
                "Unable to load hashtag.",
              type: AlertType.error,
            });
          }
        );
      } catch (error) {
        if (cancelled) return;

        setLoading(false);

        showAlert({
          message:
            error?.message ??
            "Unable to load hashtag.",
          type: AlertType.error,
        });
      }
    }

    loadHashtag();

    return () => {
      cancelled = true;
    };
  }, [
    id,
    currentProfile?.id,
  ]);


  // -------------------------------------------------------
  // Follow
  // -------------------------------------------------------

  const handleFollow = async () => {
    if (!currentProfile) {
      router.push(Paths.login);
      return;
    }

    if (!hashtag?.id || followPending) {
      return;
    }

    setFollowPending(true);

    try {
      if (following) {
        const result = await dispatch(
          unfollowHashtag({
            hashtagId: hashtag.id,
          })
        );

        checkResult(
          result,
          () => {
            setFollowing(false);
          },
          (error) => {
            showAlert({
              message:
                error?.message ??
                "Unable to unfollow hashtag.",
              type: AlertType.error,
            });
          }
        );
      } else {
        const result = await dispatch(
          followHashtag({
            hashtagId: hashtag.id,
          })
        );

        checkResult(
          result,
          () => {
            setFollowing(true);
          },
          (error) => {
            showAlert({
              message:
                error?.message ??
                "Unable to follow hashtag.",
              type: AlertType.error,
            });
          }
        );
      }
    } finally {
      setFollowPending(false);
    }
  };


  // -------------------------------------------------------
  // Loading
  // -------------------------------------------------------

  if (loading || !hashtag) {
    return <HashtagLoading />;
  }


  // -------------------------------------------------------
  // Main
  // -------------------------------------------------------

  return (
    <IonContent
      fullscreen
      className="page-content"
    >
      <ErrorBoundary>
         <main className=" h-[100%]  w-[100%]  overflow-scroll bg-plumb-surface  text-text-primary">
   
{/* 
        <main
          className="
            min-h-[100%]
            overflow-y-scroll
            overscroll-contain
            bg-plumb-surface 
            text-text-primary
            dark:bg-base-bgDark
            dark:text-cream
          "
        > */}

          {/* ================================================= */}
          {/* Hashtag identity */}
          {/* ================================================= */}

          <section
            className="
              border-b
              border-card-border
              dark:border-white/10
            "
          >
            <div
              className={`
                ${PAGE}
                pt-10
                sm:pt-14
                pb-10
              `}
            >

              <div className="
                flex
                flex-col
                sm:flex-row
                sm:items-end
                sm:justify-between
                gap-6
              ">

                <div className="min-w-0">

                  <p className="
                    text-xs
                    uppercase
                    tracking-[0.18em]
                    text-text-secondary
                    mb-4
                  ">
                    Hashtag
                  </p>

                  <h1
                    className="
                      font-serif
                      text-4xl
                      sm:text-5xl
                      lg:text-6xl
                      leading-[1.05]
                      tracking-tight
                      text-text-primary
                      dark:text-cream
                      break-words
                    "
                  >
                    #{hashtag.name}
                  </h1>

                  <p
                    className="
                      mt-5
                      max-w-2xl
                      text-base
                      sm:text-lg
                      leading-relaxed
                      text-text-secondary
                      dark:text-gray-300
                    "
                  >
                    A place for writing and rooms
                    gathered around the same idea.
                  </p>

                </div>


                {currentProfile && (
                  <button
                    type="button"
                    onClick={handleFollow}
                    disabled={followPending}
                    className={
                      following
                        ? SECONDARY_BUTTON
                        : PRIMARY_BUTTON
                    }
                  >
                    {followPending
                      ? "..."
                      : following
                        ? "Following"
                        : "Follow"}
                  </button>
                )}

              </div>

            </div>
          </section>


          {/* ================================================= */}
          {/* Libraries */}
          {/* ================================================= */}

          {libraries.length > 0 && (
            <section
              className="
                border-b
                border-card-border
                dark:border-white/10
              "
            >
              <div
                className={`${PAGE} ${SECTION}`}
              >

                <SectionHeading
                  eyebrow="Rooms"
                  title="Libraries"
                  description="Larger rooms gathered around this idea."
                />

                <div
                  className="
                    mt-7
                    flex
                    gap-4
                    overflow-x-auto
                    no-scrollbar
                    pb-2
                    -mx-1
                    px-1
                  "
                >
                  {libraries.map((library) => (
                    <div
                      key={library.id}
                      className="
                        shrink-0
                        w-[17rem]
                        sm:w-[20rem]
                      "
                    >
                      <BookListItem
                        book={library}
                      />
                    </div>
                  ))}
                </div>

              </div>
            </section>
          )}


          {/* ================================================= */}
          {/* Collections */}
          {/* ================================================= */}

          <section
            className={`${PAGE} ${SECTION}`}
          >

            <SectionHeading
              eyebrow="Rooms"
              title="Collections"
              description={
                regularCollections.length > 0
                  ? "Places writers have intentionally gathered their work."
                  : "Collections gathered around this idea will appear here."
              }
            />


            {regularCollections.length > 0 ? (

              <div
                className="
                  mt-7
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-4
                "
              >
                {regularCollections.map(
                  (collection) => (
                    <div
                      key={collection.id}
                      className="min-w-0"
                    >
                      <BookListItem
                        book={collection}
                      />
                    </div>
                  )
                )}
              </div>

            ) : (

              <EmptySection
                title="No collections yet."
                description="Someone might make the first one."
              />

            )}

          </section>


          {/* ================================================= */}
          {/* Stories */}
          {/* ================================================= */}

          <section
            className="
              border-t
              border-card-border
              dark:border-white/10
            "
          >

            <div
              className={`${PAGE} ${SECTION}`}
            >

              <div
                className="
                  flex
                  items-end
                  justify-between
                  gap-4
                "
              >

                <SectionHeading
                  eyebrow="Writing"
                  title="Stories"
                  description={
                    stories.length > 0
                      ? "Writing gathered around this idea."
                      : "The first story could start the conversation."
                  }
                />


                {isNotPhone &&
                  stories.length > 0 && (

                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        shrink-0
                      "
                    >

                      <ViewButton
                        active={isGrid}
                        onClick={() =>
                          setIsGrid(true)
                        }
                        icon={grid}
                        label="Grid view"
                      />

                      <ViewButton
                        active={!isGrid}
                        onClick={() =>
                          setIsGrid(false)
                        }
                        icon={stream}
                        label="List view"
                      />

                    </div>

                  )}

              </div>


              {stories.length > 0 ? (

                <div
                  className={`
                    mt-7
                    ${
                      isGrid
                        ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                        : "space-y-4"
                    }
                  `}
                >
                  {stories.map(
                    (story, index) => (
                      <div
                        key={`${story.id}_${index}`}
                        className="
                          break-inside-avoid
                        "
                      >
                        <DashboardItem
                          item={story}
                          index={index}
                          isGrid={isGrid}
                          page={story}
                        />
                      </div>
                    )
                  )}
                </div>

              ) : (

                <EmptySection
                  title="No stories yet."
                  description="Maybe yours will be the first."
                />

              )}

            </div>

          </section>


          {/* ================================================= */}
          {/* Explore */}
          {/* ================================================= */}

          {items?.length > 0 && (

            <section
              className="
                border-t
                border-card-border
                dark:border-white/10
              "
            >

              <div
                className={`${PAGE} ${SECTION}`}
              >
{/* 
                <SectionHeading
                  eyebrow="Beyond this room"
                  title="Explore"
                  description="A few other places you might wander into."
                /> */}

                <div className="mt-7">
                  <ExploreList
                    items={items}
                    totalCount={totalCount}
                    page={page}
                    setPage={setPage}
                  />
                </div>

              </div>

            </section>

          )}

        </main>

      </ErrorBoundary>
    </IonContent>
  );
}


// =========================================================
// SECTION HEADING
// =========================================================

function SectionHeading({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="max-w-2xl">

      {eyebrow && (
        <p
          className="
            text-xs
            uppercase
            tracking-[0.18em]
            text-text-secondary
            mb-2
          "
        >
          {eyebrow}
        </p>
      )}

      <h2
        className="
          font-serif
          text-2xl
          sm:text-3xl
          text-text-primary
          dark:text-cream
        "
      >
        {title}
      </h2>

      {description && (
        <p
          className="
            mt-2
            text-sm
            leading-relaxed
            text-text-secondary
            dark:text-gray-300
          "
        >
          {description}
        </p>
      )}

    </div>
  );
}


// =========================================================
// VIEW BUTTON
// =========================================================

function ViewButton({
  active,
  onClick,
  icon,
  label,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`
        p-2
        rounded-lg
        transition-colors
        ${
          active
            ? "bg-base-soft"
            : "bg-transparent opacity-50 hover:opacity-100"
        }
      `}
    >
      <img
        src={icon}
        className="w-5 h-5"
        alt=""
      />
    </button>
  );
}


// =========================================================
// EMPTY SECTION
// =========================================================

function EmptySection({
  title,
  description,
}) {
  return (
    <div
      className="
        mt-7
        rounded-2xl
        border
        border-dashed
        border-card-border
        dark:border-white/10
        px-6
        py-10
        sm:py-12
        text-center
      "
    >

      <h3
        className="
          font-serif
          text-xl
          sm:text-2xl
          text-text-primary
          dark:text-cream
        "
      >
        {title}
      </h3>

      {description && (
        <p
          className="
            mt-2
            text-sm
            leading-relaxed
            text-text-secondary
            dark:text-gray-300
          "
        >
          {description}
        </p>
      )}

    </div>
  );
}


// =========================================================
// LOADING
// =========================================================

function HashtagLoading() {
  return (
    <IonContent
      fullscreen
      className="page-content"
    >
      <main
        className="
          min-h-[100%]
          bg-plumb-surface 
          dark:bg-base-bgDark
        "
      >

        {/* Hero */}

        <section
          className="
            border-b
            border-card-border
            dark:border-white/10
          "
        >
          <div
            className={`${PAGE} pt-10 sm:pt-14 pb-10`}
          >

            <div
              className="
                h-3
                w-20
                rounded
                bg-base-soft
                animate-pulse
                mb-5
              "
            />

            <div
              className="
                h-12
                sm:h-16
                w-3/4
                max-w-xl
                rounded
                bg-base-soft
                animate-pulse
              "
            />

            <div className="mt-5 space-y-2 max-w-xl">
              <div
                className="
                  h-4
                  w-full
                  rounded
                  bg-base-soft
                  animate-pulse
                "
              />

              <div
                className="
                  h-4
                  w-4/5
                  rounded
                  bg-base-soft
                  animate-pulse
                "
              />
            </div>

          </div>
        </section>


        {/* Content */}

        <div className={`${PAGE} py-10`}>

          <div
            className="
              h-4
              w-24
              rounded
              bg-base-soft
              animate-pulse
              mb-3
            "
          />

          <div
            className="
              h-8
              w-40
              rounded
              bg-base-soft
              animate-pulse
            "
          />

          <div
            className="
              mt-7
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
            "
          >
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="
                    h-40
                    rounded-2xl
                    bg-base-soft
                    animate-pulse
                  "
                />
              )
            )}
          </div>

        </div>

      </main>
    </IonContent>
  );
}