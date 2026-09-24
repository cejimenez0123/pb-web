

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import { useAlert } from "../../core/useAlert.jsx";
import AlertType from "../../core/AlertType.js";

import PageList from "../../components/page/PageList";
import ProfileCircle from "../../components/profile/ProfileCircle.jsx";
import ErrorBoundary from "../../ErrorBoundary";

import {
  addCollectionListToCollection,
  deleteCollectionFromCollection,
  fetchCollection,
  fetchCollectionProtected,
  getRecommendedCollections,
  setCollections,
} from "../../actions/CollectionActions";

import {
  deleteCollectionRole,
  postCollectionRole,
} from "../../actions/RoleActions";

import {
  postCollectionHistory,
} from "../../actions/HistoryActions.js";

import {
  setPagesInView,
} from "../../actions/PageActions.jsx";

import {
  RoleType,
} from "../../core/constants";

import Paths from "../../core/paths.js";
import checkResult from "../../core/checkResult.js";
import computePermissions from "../../core/compusePermissions.jsx";
import usePaginatedResource from "../../core/usePaginatedResource.jsx";
import useScrollTracking from "../../core/useScrollTracking.jsx";

import { motion } from "framer-motion";
import { IonContent } from "@ionic/react";


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
  "focus:outline-none focus:ring-2 focus:ring-button-primary-bg/30";

const SECONDARY_BUTTON =
  `${BUTTON} border border-card-border bg-card-background ` +
  `text-text-primary hover:border-button-primary-bg ` +
  `hover:text-text-brand`;

const PRIMARY_BUTTON =
  `${BUTTON} bg-button-primary-bg text-white ` +
  `hover:bg-button-primary-hover`;


// ---------------------------------------------------------
// Main page
// ---------------------------------------------------------

export default function CollectionContainer() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const { showAlert } = useAlert();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const collection = useSelector(
    (state) => state.books.collectionInView
  );

  const collections = useSelector(
    (state) => state.books.collections
  );

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("inside");

  const [homeCol, setHomeCol] = useState(null);
  const [archiveCol, setArchiveCol] = useState(null);

  const [isBookmarked, setIsBookmarked] = useState(null);
  const [isArchived, setIsArchived] = useState(null);

  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [sentHistory, setSentHistory] = useState(false);

  const actionLock = useRef(false);


  // -------------------------------------------------------
  // Permissions
  // -------------------------------------------------------

  const {
    canSee,
    canAdd,
    canEdit,
    role,
  } = computePermissions(
    collection,
    currentProfile,
    {
      getAccessList: (c) => c?.roles ?? [],
      getAccessRole: (r) => r.role,
      isPrivate: (c) => c?.isPrivate,
      isOpen: (c) => c?.isOpenCollaboration,

      canWriteRoles: [
        RoleType.writer,
        RoleType.editor,
      ],

      canEditRoles: [
        RoleType.editor,
      ],
    }
  );


  // -------------------------------------------------------
  // Load collection
  // -------------------------------------------------------

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function loadCollection() {
      setLoading(true);

      try {
        const action = currentProfile
          ? fetchCollectionProtected({ id })
          : fetchCollection({ id });

        const result = await dispatch(action);

        if (cancelled) return;

        checkResult(
          result,
          (payload) => {
            const col = payload?.collection;

            if (!col) {
              setLoading(false);
              return;
            }

            const sortedPages = [
              ...(col.storyIdList ?? []),
            ]
              .filter((item) => item?.story)
              .sort(
                (a, b) =>
                  (a.index ?? 0) - (b.index ?? 0)
              )
              .map((item) => item.story);

            dispatch(
              setPagesInView({
                pages: sortedPages,
              })
            );

            setLoading(false);
          },
          (error) => {
            setLoading(false);

            showAlert({
              message:
                error?.status === 403
                  ? "You do not have permission to view this room."
                  : error?.message ||
                    "Failed to load this room.",
              type: AlertType.error,
            });
          }
        );
      } catch (error) {
        if (cancelled) return;

        setLoading(false);

        showAlert({
          message: "Unexpected error occurred.",
          type: AlertType.error,
        });
      }
    }

    loadCollection();

    return () => {
      cancelled = true;
    };
  }, [id, currentProfile?.id]);


  // -------------------------------------------------------
  // Clear stale content when changing rooms
  // -------------------------------------------------------

  useEffect(() => {
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
  }, [id]);


  // -------------------------------------------------------
  // Home / Archive system rooms
  // -------------------------------------------------------

  useLayoutEffect(() => {
    const profileCollections =
      currentProfile?.profileToCollections;

    if (!profileCollections) {
      setHomeCol(null);
      setArchiveCol(null);
      return;
    }

    const home =
      profileCollections.find(
        (item) => item.type === "home"
      )?.collection || null;

    const archive =
      profileCollections.find(
        (item) => item.type === "archive"
      )?.collection || null;

    setHomeCol(home);
    setArchiveCol(archive);
  }, [currentProfile]);


  // -------------------------------------------------------
  // Determine saved state
  // -------------------------------------------------------

  useEffect(() => {
    if (!collection) return;

    const parents =
      collection.parentCollections ?? [];

    if (homeCol) {
      const homeRelationship = parents.find(
        (item) =>
          item.parentCollectionId === homeCol.id
      );

      setIsBookmarked(
        homeRelationship || null
      );
    }

    if (archiveCol) {
      const archiveRelationship = parents.find(
        (item) =>
          item.parentCollectionId === archiveCol.id
      );

      setIsArchived(
        archiveRelationship || null
      );
    }

    setBookmarkLoading(false);
  }, [
    collection,
    homeCol,
    archiveCol,
  ]);


  // -------------------------------------------------------
  // History
  // -------------------------------------------------------

  useEffect(() => {
    if (
      sentHistory ||
      !currentProfile?.id ||
      !collection?.id
    ) {
      return;
    }

    setSentHistory(true);

    dispatch(
      postCollectionHistory({
        profile: currentProfile,
        collection,
      })
    );
  }, [
    currentProfile?.id,
    collection?.id,
    sentHistory,
  ]);


  // -------------------------------------------------------
  // Scroll tracking
  // -------------------------------------------------------

  useScrollTracking({
    contentType: "collection",
    contentId: collection?.id,
    authorId: collection?.profileId,
    enableCompletion: false,
  });


  // -------------------------------------------------------
  // Recommended rooms
  // -------------------------------------------------------

  const pageSize = 10;

  const recommended = usePaginatedResource({
    cacheKey:
      `recommended-collections:${collection?.id}`,

    fetcher: getRecommendedCollections,

    pageSize,

    enabled: !!collection?.id,

    params: {
      colId: collection?.id,
      type: collection?.type,
    },

    select: (res) => ({
      items: res.collections,
      totalCount: res.totalCount,
    }),
  });


  // -------------------------------------------------------
  // Follow
  // -------------------------------------------------------

  const handleFollow = async () => {
    if (actionLock.current) return;

    actionLock.current = true;

    try {
      if (!currentProfile || !collection) {
        showAlert({
          message: "Please sign in",
          type: AlertType.error,
        });

        return;
      }

      let followRole =
        collection.followersAre ??
        RoleType.commenter;

      if (
        currentProfile.id ===
        collection.profileId
      ) {
        followRole = RoleType.editor;
      }

      const result = await dispatch(
        postCollectionRole({
          type: followRole,
          profileId: currentProfile.id,
          collectionId: collection.id,
        })
      );

      checkResult(
        result,
        () => {
          showAlert({
            message:
              "You are now following this room.",
            type: AlertType.success,
          });
        },
        (error) => {
          showAlert({
            message:
              error?.message ||
              "Unable to follow this room.",
            type: AlertType.error,
          });
        }
      );
    } finally {
      actionLock.current = false;
    }
  };


  // -------------------------------------------------------
  // Unfollow
  // -------------------------------------------------------

  const handleUnfollow = () => {
    if (
      currentProfile?.id ===
      collection?.profile?.id
    ) {
      showAlert({
        message:
          "This is yours — you cannot unfollow your own room.",
        type: AlertType.error,
      });

      return;
    }

    if (!currentProfile || !role) {
      showAlert({
        message: "Please sign in",
        type: AlertType.error,
      });

      return;
    }

    dispatch(
      deleteCollectionRole({
        id,
        role,
      })
    ).then((result) => {
      checkResult(
        result,
        () => {
          showAlert({
            message: "Unfollowed room.",
            type: AlertType.success,
          });
        },
        (error) => {
          showAlert({
            message:
              error?.message ||
              "Unable to unfollow this room.",
            type: AlertType.error,
          });
        }
      );
    });
  };


  // -------------------------------------------------------
  // Save / unsave Home
  // -------------------------------------------------------

  const handleBookmark = () => {
    if (!currentProfile) {
      showAlert({
        message: "Please sign in",
        type: AlertType.error,
      });

      return;
    }

    if (!homeCol || !collection) return;

    setBookmarkLoading(true);

    if (!isBookmarked) {
      setIsBookmarked(true);

      dispatch(
        addCollectionListToCollection({
          id: homeCol.id,
          list: [collection.id],
          profile: currentProfile,
        })
      ).then((result) => {
        checkResult(
          result,
          () => {
            showAlert({
              message: "Saved to Home.",
              type: AlertType.success,
            });

            setBookmarkLoading(false);
          },
          (error) => {
            setIsBookmarked(null);

            showAlert({
              message:
                error?.message ||
                "Unable to save to Home.",
              type: AlertType.error,
            });

            setBookmarkLoading(false);
          }
        );
      });
    } else {
      const relationship = isBookmarked;

      setIsBookmarked(null);

      dispatch(
        deleteCollectionFromCollection({
          tcId: relationship.id,
        })
      ).then((result) => {
        checkResult(
          result,
          () => {
            showAlert({
              message: "Removed from Home.",
              type: AlertType.success,
            });

            setBookmarkLoading(false);
          },
          () => {
            setIsBookmarked(relationship);
            setBookmarkLoading(false);
          }
        );
      });
    }
  };


  // -------------------------------------------------------
  // Save / unsave Archive
  // -------------------------------------------------------

  const handleArchive = () => {
    if (!currentProfile) {
      showAlert({
        message: "Please sign in",
        type: AlertType.error,
      });

      return;
    }

    if (!archiveCol || !collection) return;

    setBookmarkLoading(true);

    if (!isArchived) {
      setIsArchived(true);

      dispatch(
        addCollectionListToCollection({
          id: archiveCol.id,
          list: [collection.id],
          profile: currentProfile,
        })
      ).then((result) => {
        checkResult(
          result,
          () => {
            showAlert({
              message: "Saved to Archive.",
              type: AlertType.success,
            });

            setBookmarkLoading(false);
          },
          (error) => {
            setIsArchived(null);

            showAlert({
              message:
                error?.message ||
                "Unable to save to Archive.",
              type: AlertType.error,
            });

            setBookmarkLoading(false);
          }
        );
      });
    } else {
      const relationship = isArchived;

      setIsArchived(null);

      dispatch(
        deleteCollectionFromCollection({
          tcId: relationship.id,
        })
      ).then((result) => {
        checkResult(
          result,
          () => {
            showAlert({
              message: "Removed from Archive.",
              type: AlertType.success,
            });

            setBookmarkLoading(false);
          },
          () => {
            setIsArchived(relationship);
            setBookmarkLoading(false);
          }
        );
      });
    }
  };


  // -------------------------------------------------------
  // Access denied
  // -------------------------------------------------------

  if (!loading && collection && !canSee) {
    return (
            <IonContent
      scrollY={true}
      className="page-content"
      fullscreen
    >
      <ErrorBoundary>
    
        <main className="h-[100%] bg-base-surface dark:bg-base-bgDark">
          <div className={`${PAGE} py-24`}>
            <div className="max-w-xl mx-auto text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-text-secondary mb-4">
                Room
              </p>

              <h1 className="font-serif text-3xl sm:text-4xl text-text-primary dark:text-cream mb-4">
                This room is private.
              </h1>

              <p className="text-text-secondary dark:text-gray-400 mb-8">
                You do not have permission to view
                what is inside this room.
              </p>

              <button
                onClick={() =>
                  history.push(Paths.collections.path)
                }
                className={PRIMARY_BUTTON}
              >
                Back to Rooms
              </button>
            </div>
          </div>
        </main>
      </ErrorBoundary>
      </IonContent>
    );
  }


  // -------------------------------------------------------
  // Loading
  // -------------------------------------------------------

  if (loading || !collection) {
    return (
      <CollectionLoading />
    );
  }


  // -------------------------------------------------------
  // Main
  // -------------------------------------------------------

  return (
    <ErrorBoundary>
      
      <main className="    h-[100%]
     
        overflow-y-auto
        overscroll-contain
        bg-base-surface
        text-text-primary
        dark:bg-base-bgDark
        dark:text-cream
    ">

        {/* --------------------------------------------- */}
        {/* Header / Room identity */}
        {/* --------------------------------------------- */}

        <section className="border-b border-card-border dark:border-white/10">
          <div className={`${PAGE} pt-10 sm:pt-14 pb-8`}>

            <button
              onClick={() =>
                history.push(Paths.collections.path)
              }
              className="
                inline-flex items-center gap-2
                text-sm text-text-secondary
                hover:text-text-brand
                transition-colors
                mb-8
              "
            >
              <span aria-hidden="true">←</span>
              <span>Rooms</span>
            </button>


            <div className="max-w-3xl">

              <div className="flex flex-wrap items-center gap-2 mb-4">

                {collection.isWorkshop && (
                  <span
                    className="
                      inline-flex items-center
                      rounded-full
                      bg-softBlue
                      px-3 py-1
                      text-xs font-medium
                      text-text-primary
                    "
                  >
                    Workshop
                  </span>
                )}

                {collection.type && (
                  <span
                    className="
                      inline-flex items-center
                      rounded-full
                      border border-card-border
                      px-3 py-1
                      text-xs font-medium
                      text-text-secondary
                    "
                  >
                    {formatRoomType(collection.type)}
                  </span>
                )}

                {collection.isPrivate && (
                  <span
                    className="
                      inline-flex items-center
                      rounded-full
                      border border-card-border
                      px-3 py-1
                      text-xs
                      text-text-secondary
                    "
                  >
                    Private
                  </span>
                )}
              </div>


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
                "
              >
                {collection.title ||
                  "Untitled Room"}
              </h1>


              {collection.purpose && (
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
                  {collection.purpose}
                </p>
              )}


              {/* Creator */}
              {collection.profile && (
                <div className="mt-7 flex items-center gap-3">
                  <ProfileCircle
                    profile={collection.profile}
                    includeUsername={true}
                  />
                </div>
              )}

            </div>
          </div>
        </section>


        {/* --------------------------------------------- */}
        {/* Actions */}
        {/* --------------------------------------------- */}

        <section className="border-b border-card-border dark:border-white/10">
          <div
            className={`${PAGE} py-4`}
          >
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >

              {currentProfile && (
                <button
                  disabled={bookmarkLoading}
                  onClick={
                    role
                      ? handleUnfollow
                      : handleFollow
                  }
                  className={
                    role
                      ? PRIMARY_BUTTON
                      : SECONDARY_BUTTON
                  }
                >
                  {role
                    ? "Following"
                    : "Follow"}
                </button>
              )}


              {currentProfile && (
                <button
                  disabled={bookmarkLoading}
                  onClick={handleBookmark}
                  className={SECONDARY_BUTTON}
                >
                  {isBookmarked
                    ? "Saved to Home"
                    : "Save to Home"}
                </button>
              )}


              {currentProfile && (
                <button
                  disabled={bookmarkLoading}
                  onClick={handleArchive}
                  className={SECONDARY_BUTTON}
                >
                  {isArchived
                    ? "In Archive"
                    : "Save to Archive"}
                </button>
              )}


              {canAdd && (
                <button
                  onClick={() =>
                    history.push(
                      Paths.addToCollection.createRoute(
                        collection.id
                      )
                    )
                  }
                  className={PRIMARY_BUTTON}
                >
                  Add to Room
                </button>
              )}

            </div>
          </div>
        </section>


        {/* --------------------------------------------- */}
        {/* Tabs */}
        {/* --------------------------------------------- */}

        <section>
          <div className={`${PAGE}`}>

            <RoomTabs
              tab={tab}
              setTab={setTab}
            />

            <div className="pb-16">

              {tab === "inside" && (
                <InsideRoom
                  collection={collection}
                  collections={collections}
                  canAdd={canAdd}
                  canEdit={canEdit}
                  history={history}
                />
              )}

              {tab === "members" && (
                <MemberTab
                  collection={collection}
                  history={history}
                />
              )}

              {tab === "about" && (
                <AboutTab
                  collection={collection}
                />
              )}

            </div>
          </div>
        </section>


        {/* --------------------------------------------- */}
        {/* Recommended */}
        {/* --------------------------------------------- */}

        {recommended.items?.length > 0 && (
          <section
            className="
              border-t
              border-card-border
              dark:border-white/10
            "
          >
            <div className={`${PAGE} ${SECTION}`}>

              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-text-secondary mb-2">
                  Keep exploring
                </p>

                <h2 className="font-serif text-2xl sm:text-3xl text-text-primary dark:text-cream">
                  Other rooms
                </h2>
              </div>

              <RecommendedRooms
                rooms={recommended.items}
                history={history}
              />

            </div>
          </section>
        )}

      </main>
    </ErrorBoundary>
  );
}


// =========================================================
// INSIDE ROOM
// =========================================================

function InsideRoom({
  collection,
  collections,
  canAdd,
  history,
}) {
  const pagesInView = useSelector(
    (state) => state.pages.pagesInView
  );

  const isOwner =
    collection?.profileId ===
    useSelector(
      (state) => state.users.currentProfile?.id
    );


  const childRooms = useMemo(() => {
    return (collection?.childCollections ?? [])
      .map((item) =>
        item?.childCollection || item
      )
      .filter(Boolean);
  }, [collection]);


  const hasRooms =
    childRooms.length > 0;

  const hasPages =
    pagesInView?.length > 0;


  const canModify =
    isOwner ||
    collection?.isOpenCollaboration;


  return (
    <div className="space-y-12">

      {/* ------------------------------------------- */}
      {/* Child rooms */}
      {/* ------------------------------------------- */}

      {hasRooms && (
        <section className="pt-8">

          <RoomSectionHeading
            eyebrow="Rooms"
            title="Inside this room"
            description="Other rooms collected here."
          />

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
              mt-6
            "
          >
            {childRooms.map((room) => (
              <RoomPreview
                key={room.id}
                room={room}
                history={history}
              />
            ))}
          </div>

        </section>
      )}


      {/* ------------------------------------------- */}
      {/* Pages */}
      {/* ------------------------------------------- */}

      <section
        className={
          hasRooms
            ? "border-t border-card-border dark:border-white/10 pt-10"
            : "pt-8"
        }
      >

        <RoomSectionHeading
          eyebrow="Writing"
          title="Pages"
          description="Writing that lives in this room."
        />


        {hasPages ? (
          <div className="mt-6">
            <PageList
              items={pagesInView}
              isGrid={false}
              hasMore={false}
              getMore={() => {}}
              forFeedback={false}
            />
          </div>
        ) : (
          <EmptyRoomContent
            message="No pages in this room yet."
            canAdd={canModify || canAdd}
            buttonLabel="Add a Page"
            onClick={() =>
              history.push(
                Paths.addToCollection.createRoute(
                  collection.id
                )
              )
            }
          />
        )}

      </section>


      {/* ------------------------------------------- */}
      {/* Completely empty room */}
      {/* ------------------------------------------- */}

      {!hasRooms && !hasPages && (
        <section className="pt-8">
          <div
            className="
              border
              border-dashed
              border-card-border
              rounded-2xl
              p-8
              sm:p-12
              text-center
            "
          >
            <p className="font-serif text-2xl text-text-primary dark:text-cream">
              Nothing lives here yet.
            </p>

            <p className="mt-2 max-w-md mx-auto text-sm text-text-secondary">
              A room can hold writing, other rooms,
              or both. Start somewhere.
            </p>

            {(canModify || canAdd) && (
              <button
                onClick={() =>
                  history.push(
                    Paths.addToCollection.createRoute(
                      collection.id
                    )
                  )
                }
                className={`${PRIMARY_BUTTON} mt-6`}
              >
                Add something
              </button>
            )}
          </div>
        </section>
      )}

    </div>
  );
}


// =========================================================
// ROOM PREVIEW
// =========================================================

function RoomPreview({
  room,
  history,
}) {
  const childCount =
    room?.childCollections?.length ?? 0;

  const pageCount =
    room?.storyIdList?.length ?? 0;


  return (
    <button
      onClick={() =>
        history.push(
          Paths.collection.createRoute(
            room.id
          )
        )
      }
      className="
        group
        w-full
        text-left
        rounded-2xl
        border
        border-card-border
        bg-card-background
        p-5
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-button-primary-bg
        hover:shadow-sm
        dark:bg-base-surfaceDark
        dark:border-white/10
      "
    >

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          {room?.type && (
            <p
              className="
                text-[0.68rem]
                uppercase
                tracking-[0.16em]
                text-text-secondary
                mb-2
              "
            >
              {formatRoomType(room.type)}
            </p>
          )}

          <h3
            className="
              font-serif
              text-xl
              text-text-primary
              dark:text-cream
              group-hover:text-text-brand
              transition-colors
            "
          >
            {room?.title ||
              "Untitled Room"}
          </h3>

          {room?.purpose && (
            <p
              className="
                mt-2
                text-sm
                leading-relaxed
                text-text-secondary
                line-clamp-2
              "
            >
              {room.purpose}
            </p>
          )}

        </div>


        <span
          className="
            text-lg
            text-text-secondary
            group-hover:text-text-brand
            transition-colors
          "
          aria-hidden="true"
        >
          →
        </span>

      </div>


      <div
        className="
          flex
          flex-wrap
          gap-x-4
          gap-y-1
          mt-5
          text-xs
          text-text-secondary
        "
      >
        {pageCount > 0 && (
          <span>
            {pageCount}{" "}
            {pageCount === 1
              ? "page"
              : "pages"}
          </span>
        )}

        {childCount > 0 && (
          <span>
            {childCount}{" "}
            {childCount === 1
              ? "room"
              : "rooms"}
          </span>
        )}

        {pageCount === 0 &&
          childCount === 0 && (
            <span>Empty</span>
          )}
      </div>

    </button>
  );
}


// =========================================================
// MEMBERS
// =========================================================

function MemberTab({
  collection,
  history,
}) {
  const roles = useMemo(() => {
    const contributors = [
      ...(collection?.roles ?? [])
        .filter(
          (role) =>
            role?.profile?.id !==
            collection?.profile?.id
        ),

      collection?.profile
        ? {
            role: "owner",
            profile: collection.profile,
          }
        : null,
    ];

    return contributors
      .filter(Boolean)
      .sort((a, b) =>
        String(a.role).localeCompare(
          String(b.role)
        )
      );
  }, [collection]);


  return (
    <section className="pt-8">

      <RoomSectionHeading
        eyebrow="People"
        title="Members"
        description="People with a role in this room."
      />


      {roles.length > 0 ? (
        <div className="mt-6 divide-y divide-card-border dark:divide-white/10 border-y border-card-border dark:border-white/10">

          {roles.map((member) => (
            <button
              key={member.profile.id}
              onClick={() =>
                history.push(
                  Paths.profile.createRoute(
                    member.profile.id
                  )
                )
              }
              className="
                w-full
                py-4
                flex
                items-center
                justify-between
                gap-4
                text-left
                hover:bg-black/[0.02]
                dark:hover:bg-white/[0.03]
                transition-colors
              "
            >

              <ProfileCircle
                profile={member.profile}
                includeUsername={true}
              />

              <span
                className="
                  text-xs
                  capitalize
                  text-text-secondary
                "
              >
                {member.role}
              </span>

            </button>
          ))}

        </div>
      ) : (
        <div className="mt-6">
          <EmptyRoomContent
            message="No members yet."
          />
        </div>
      )}

    </section>
  );
}


// =========================================================
// ABOUT
// =========================================================

function AboutTab({
  collection,
}) {
  return (
    <section className="pt-8">

      <RoomSectionHeading
        eyebrow="About"
        title="About this room"
      />


      <div
        className="
          mt-6
          max-w-2xl
          space-y-8
        "
      >

        {collection?.purpose && (
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-text-secondary mb-3">
              Purpose
            </p>

            <p
              className="
                text-base
                leading-relaxed
                text-text-primary
                dark:text-cream
              "
            >
              {collection.purpose}
            </p>
          </div>
        )}


        {collection?.location && (
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-text-secondary mb-3">
              Location
            </p>

            <p className="text-sm text-text-primary dark:text-cream">
              {collection.location.city}
            </p>
          </div>
        )}


        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-text-secondary mb-3">
            Access
          </p>

          <p className="text-sm leading-relaxed text-text-secondary">
            {collection.isPrivate
              ? "Private room"
              : collection.isOpenCollaboration
                ? "Open collaboration"
                : "Public room"}
          </p>
        </div>

      </div>

    </section>
  );
}


// =========================================================
// TABS
// =========================================================

function RoomTabs({
  tab,
  setTab,
}) {
  const tabs = [
    {
      id: "inside",
      label: "Inside",
    },
    {
      id: "members",
      label: "Members",
    },
    {
      id: "about",
      label: "About",
    },
  ];


  return (
    <div
      className="
        sticky
        top-0
        z-10
        -mx-4
        px-4
        bg-base-surface/95
        dark:bg-base-bgDark/95
        backdrop-blur
        border-b
        border-card-border
        dark:border-white/10
      "
    >
      <div className="flex gap-6 overflow-x-auto">

        {tabs.map((item) => {
          const active =
            tab === item.id;

          return (
            <button
              key={item.id}
              onClick={() =>
                setTab(item.id)
              }
              className={`
                relative
                py-4
                text-sm
                whitespace-nowrap
                transition-colors
                ${
                  active
                    ? "text-text-primary dark:text-cream font-medium"
                    : "text-text-secondary hover:text-text-primary"
                }
              `}
            >
              {item.label}

              {active && (
                <motion.span
                  layoutId="room-tab-indicator"
                  className="
                    absolute
                    left-0
                    right-0
                    bottom-0
                    h-0.5
                    rounded-full
                    bg-button-primary-bg
                  "
                />
              )}
            </button>
          );
        })}

      </div>
    </div>
  );
}


// =========================================================
// RECOMMENDED ROOMS
// =========================================================

function RecommendedRooms({
  rooms,
  history,
}) {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-4
      "
    >
      {rooms.map((room) => (
        <RoomPreview
          key={room.id}
          room={room}
          history={history}
        />
      ))}
    </div>
  );
}


// =========================================================
// SECTION HEADING
// =========================================================

function RoomSectionHeading({
  eyebrow,
  title,
  description,
}) {
  return (
    <div>
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
            text-text-secondary
            max-w-xl
          "
        >
          {description}
        </p>
      )}
    </div>
  );
}


// =========================================================
// EMPTY STATE
// =========================================================

function EmptyRoomContent({
  message,
  canAdd = false,
  buttonLabel,
  onClick,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-dashed
        border-card-border
        dark:border-white/10
        px-6
        py-10
        text-center
      "
    >
      <p className="text-sm text-text-secondary">
        {message}
      </p>

      {canAdd &&
        buttonLabel &&
        onClick && (
          <button
            onClick={onClick}
            className={`${SECONDARY_BUTTON} mt-5`}
          >
            {buttonLabel}
          </button>
        )}
    </div>
  );
}


// =========================================================
// LOADING
// =========================================================

function CollectionLoading() {
  return (
    <main className="min-h-screen bg-base-surface dark:bg-base-bgDark">

      <div className={`${PAGE} pt-10 sm:pt-14`}>

        <div className="h-4 w-16 rounded bg-gray-200 dark:bg-white/10 animate-pulse mb-10" />

        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-white/10 animate-pulse mb-5" />

        <div className="h-12 sm:h-16 w-3/4 max-w-2xl rounded bg-gray-200 dark:bg-white/10 animate-pulse" />

        <div className="mt-5 space-y-2 max-w-xl">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
          <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
        </div>

        <div className="mt-8 h-8 w-40 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />

      </div>


      <div className="border-y border-card-border dark:border-white/10 mt-10">
        <div className={`${PAGE} py-4`}>
          <div className="h-5 w-32 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
        </div>
      </div>


      <div className={`${PAGE} py-10 space-y-5`}>
        <div className="h-7 w-40 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />

        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="
                h-40
                rounded-2xl
                bg-gray-200
                dark:bg-white/10
                animate-pulse
              "
            />
          ))}
        </div>
      </div>

    </main>
  );
}


// =========================================================
// Helpers
// =========================================================

function formatRoomType(type) {
  if (!type) return "";

  const labels = {
    book: "Book",
    library: "Library",
    feedback: "Feedback",
    home: "Home",
    archive: "Archive",
  };

  return (
    labels[type] ||
    String(type)
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      )
  );
}