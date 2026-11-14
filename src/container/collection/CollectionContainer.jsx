
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import {  useParams } from "react-router";

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
import useScrollTracking from "../../core/useScrollTracking.jsx";


import { IonContent, useIonRouter } from "@ionic/react";

import RoomPreview from "../../components/room/RoomPreview.jsx";
import styles from "../../styles/style.js";
import TabBar from "../../components/TabBar.jsx";
import PlumbHead from "../head.jsx";
import PlumbButton from "../../components/profile/FollowButton.jsx";

// ---------------------------------------------------------
// Layout
// ---------------------------------------------------------
const TABS = {
  INSIDE: "inside",
  MEMBERS: "members",
  ABOUT: "about"
 
};


 const tabs = [
      { key: TABS.INSIDE, label: "inside" },
       { key: TABS.MEMBERS, label: "members" },
   { key: TABS.ABOUT, label: "about" },
   

 
   
  ];
const PAGE =""

const SECTION =""

const BUTTON = styles.button.base

const SECONDARY_BUTTON =
  `${styles.button.secondary} px-6 py-3 ${BUTTON}`;

const PRIMARY_BUTTON =
  `${styles.button.primary} px-6 py-3 ${BUTTON}`;





// ---------------------------------------------------------
// Main page
// ---------------------------------------------------------

export default function CollectionContainer() {
  const { id } = useParams();

  const dispatch = useDispatch();
const router = useIonRouter()
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
  const [loadError, setLoadError] = useState(false);
  const [tab, setTab] = useState(TABS.INSIDE);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const actionLock = useRef(false);
  const sentHistoryRef = useRef(null);

  // -------------------------------------------------------
  // Verify that the Redux collection belongs to this route
  // -------------------------------------------------------

  const isCurrentCollection =
    Boolean(
      id &&
      collection?.id != null &&
      String(collection.id) === String(id)
    );

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
const [following,setFollowing]=useState(!!role)
  // -------------------------------------------------------
  // Load collection
  // -------------------------------------------------------

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setLoadError(true);
      return;
    }

    let cancelled = false;

    async function loadCollection() {
      setLoading(true);
      setLoadError(false);

      try {
        const action = currentProfile
          ? fetchCollectionProtected({ id })
          : fetchCollection({ id });

        const result = await dispatch(action);

        if (cancelled) return;

        checkResult(
          result,
          (payload) => {
            if (cancelled) return;

            const col = payload?.collection;

            if (!col) {
              setLoadError(true);
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
            if (cancelled) return;

            setLoadError(true);
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

        setLoadError(true);
        setLoading(false);

        showAlert({
          message:
            error?.message ||
            "Unexpected error occurred.",
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
  // Clear stale lists when changing rooms
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
  }, [id, dispatch]);

  // -------------------------------------------------------
  // Home / Archive system rooms
  // -------------------------------------------------------

  const homeCol = useMemo(() => {
    const profileCollections =
      currentProfile?.profileToCollections;

    if (!profileCollections) return null;

    return (
      profileCollections.find(
        (item) => item.type === "home"
      )?.collection || null
    );
  }, [currentProfile?.profileToCollections]);

  const archiveCol = useMemo(() => {
    const profileCollections =
      currentProfile?.profileToCollections;

    if (!profileCollections) return null;

    return (
      profileCollections.find(
        (item) => item.type === "archive"
      )?.collection || null
    );
  }, [currentProfile?.profileToCollections]);

  // -------------------------------------------------------
  // Collection history
  // -------------------------------------------------------

  useEffect(() => {
    if (
      !currentProfile?.id ||
      !isCurrentCollection ||
      !collection?.id
    ) {
      return;
    }

    const historyKey =
      `${currentProfile.id}:${collection.id}`;

    if (sentHistoryRef.current === historyKey) {
      return;
    }

    sentHistoryRef.current = historyKey;

    dispatch(
      postCollectionHistory({
        profile: currentProfile,
        collection,
      })
    );
  }, [
    currentProfile?.id,
    collection?.id,
    id,
    isCurrentCollection,
    dispatch,
  ]);

  // -------------------------------------------------------
  // Scroll tracking
  // -------------------------------------------------------

  useScrollTracking({
    contentType: "collection",
    contentId: isCurrentCollection
      ? collection?.id
      : undefined,
    authorId: isCurrentCollection
      ? collection?.profileId
      : undefined,
    enableCompletion: false,
  });

  // -------------------------------------------------------
  // Recommended rooms
  // -------------------------------------------------------

  // Keep the existing placeholder until the recommendation
  // fetcher is connected.
  const recommended = {
    items: [],
  };

  // -------------------------------------------------------
  // Follow
  // -------------------------------------------------------

  const handleFollow = async () => {
    if (actionLock.current) return;

    actionLock.current = true;

    try {
      if (!currentProfile || !isCurrentCollection) {
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
          setFollowing(true)
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
    } catch (error) {
      showAlert({
        message:
          error?.message ||
          "Unable to follow this room.",
        type: AlertType.error,
      });
    } finally {
      actionLock.current = false;
    }
  };

  // -------------------------------------------------------
  // Unfollow
  // -------------------------------------------------------

  const handleUnfollow = async () => {
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

    try {
      const result = await dispatch(
        deleteCollectionRole({
          id,
          role,
        })
      );

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
    } catch (error) {
      showAlert({
        message:
          error?.message ||
          "Unable to unfollow this room.",
        type: AlertType.error,
      });
    }
        setFollowing(false)
  };

  // -------------------------------------------------------
  // Bookmark / Archive state
  // -------------------------------------------------------

  const initBookmarked = useMemo(() => {
    if (!isCurrentCollection || !homeCol) {
      return null;
    }

    return (
      collection.parentCollections?.find(
        (item) =>
          item.parentCollectionId === homeCol.id
      ) || null
    );
  }, [
    collection,
    isCurrentCollection,
    homeCol,
  ]);
const [isBookmarked,setIsBookmarked]=useState(initBookmarked)
  const initArchived = useMemo(() => {
    if (!isCurrentCollection || !archiveCol) {
      return null;
    }

    return (
      collection.parentCollections?.find(
        (item) =>
          item.parentCollectionId === archiveCol.id
      ) || null
    );
  }, [
    collection,
    isCurrentCollection,
    archiveCol,
  ]);
const [isArchived,setIsArchived]=useState(initArchived)
  // -------------------------------------------------------
  // Save / unsave Home
  // -------------------------------------------------------

  const handleBookmark = async () => {
    // const tcid = collection.parentCollections?.find(
    //     (item) =>
    //       item.parentCollectionId === homeCol.id
    //   ).id
    //       const archive =
      let homeCol = currentProfile.profileToCollections.find(
        (col) => col.type === "home"
      )

    if (!currentProfile) {
      showAlert({
        message: "Please sign in",
        type: AlertType.error,
      });

      return;
    }

    if (!homeCol || !isCurrentCollection) {
      return;
    }

    setBookmarkLoading(true);

    try {
      if (!isBookmarked) {
        const result = await dispatch(
          addCollectionListToCollection({
            id: homeCol.id,
            list: [collection.id],
            profile: currentProfile,
          })
        );

        checkResult(
          result,
          () => {
            setIsBookmarked(true)
            showAlert({
              message: "Saved to Home.",
              type: AlertType.success,
            });
          },
          (error) => {
            showAlert({
              message:
                error?.message ||
                "Unable to save to Home.",
              type: AlertType.error,
            });
          }
        );
      } else {
        const result = await dispatch(
          deleteCollectionFromCollection({
            tcId: tcid,
          })
        );

        checkResult(
          result,
          () => {
                setIsBookmarked(false)
            showAlert({
              message: "Removed from Home.",
              type: AlertType.success,
            });
          },
          (error) => {
            showAlert({
              message:
                error?.message ||
                "Unable to remove from Home.",
              type: AlertType.error,
            });
          }
        );
      }
    } catch (error) {

      showAlert({
        message:
          error?.message ||
          "Unable to update Home.",
        type: AlertType.error,
      });
    } 
  };

  // -------------------------------------------------------
  // Save / unsave Archive
  // -------------------------------------------------------

  const handleArchive = async () => {
        const tcid = collection.parentCollections?.find(
        (item) =>
          item.parentCollectionId === archiveCol.id
      ).id
    if (!currentProfile) {
      showAlert({
        message: "Please sign in",
        type: AlertType.error,
      });

      return;
    }

    if (!archiveCol || !isCurrentCollection) {
      return;
    }

    setBookmarkLoading(true);

    try {
      if (!isArchived) {
        const result = await dispatch(
          addCollectionListToCollection({
            id: archiveCol.id,
            list: [collection.id],
            profile: currentProfile,
          })
        );

        checkResult(
          result,
          () => {
            setIsArchived(true)
            showAlert({
              message: "Saved to Archive.",
              type: AlertType.success,
            });
          },
          (error) => {
            showAlert({
              message:
                error?.message ||
                "Unable to save to Archive.",
              type: AlertType.error,
            });
          }
        );
      } else {
        const result = await dispatch(
          deleteCollectionFromCollection({
            tcId: isArchived.id,
          })
        );

        checkResult(
          result,
          () => {
            setIsArchived(false)
            showAlert({
              message: "Removed from Archive.",
              type: AlertType.success,
            });
          },
          (error) => {
            showAlert({
              message:
                error?.message ||
                "Unable to remove from Archive.",
              type: AlertType.error,
            });
          }
        );
      }
    } catch (error) {
      showAlert({
        message:
          error?.message ||
          "Unable to update Archive.",
        type: AlertType.error,
      });
    } finally {
      setBookmarkLoading(false);
    }
  };

  // -------------------------------------------------------
  // Loading
  // -------------------------------------------------------

  // Do not render the previous room while a new route is loading.
  if (
    loading ||
    (collection && !isCurrentCollection && !loadError)
  ) {
    return <CollectionLoading />;
  }

  // -------------------------------------------------------
  // Access denied
  // -------------------------------------------------------

  if (
    isCurrentCollection &&
    !loading &&
    !canSee
  ) {
    return (
      <IonContent
        scrollY={true}
       
        fullscreen
      >
        <ErrorBoundary>
         <main className={styles.pageShell.base+" "+styles.pageShell.padded}>
            <div className={``}>
              <div className="mx-auto max-w-xl text-center">
                <p className="mb-4 text-xs uppercase tracking-[0.18em] text-text-secondary">
                  Room
                </p>

                <h1 className="mb-4 font-serif text-3xl sm:text-4xl text-text-primary dark:text-cream">
                  This room is private.
                </h1>

                <p className="mb-8 text-text-secondary dark:text-gray-300">
                  You do not have permission to view
                  what is inside this room.
                </p>

                <div
                  type="button"
                  onClick={() =>
                    router.push(Paths.collections.path)
                  }
                  className={PRIMARY_BUTTON}
                >
                  Back to Rooms
                </div>
              </div>
            </div>
          </main>
        </ErrorBoundary>
      </IonContent>
    );
  }

  // -------------------------------------------------------
  // Unavailable / failed load
  // -------------------------------------------------------

  if (
    loadError ||
    !isCurrentCollection
  ) {
    return (
      <IonContent
        scrollY={true}
        className="page-content"
        fullscreen
      >
        <ErrorBoundary>
        <main className={styles.pageShell.base+" "+styles.pageShell.padded+" "+styles.pageShell.scroll}>
            <div className={``}>
              <div className="mx-auto max-w-xl text-center">
                <p className="mb-4 text-xs uppercase tracking-[0.18em] text-text-secondary">
                  Room
                </p>

                <h1 className="mb-4 font-serif text-3xl sm:text-4xl text-text-primary dark:text-cream">
                  This room isn't available.
                </h1>

                <p className="mb-8 text-text-secondary dark:text-gray-300">
                  We couldn't load this room. You can
                  return to Rooms and try again.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(Paths.collections.path)
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
  // Main
  // -------------------------------------------------------

  return (
    <IonContent>
    <ErrorBoundary>
<main className={styles.pageShell.base+" "+styles.pageShell.scroll}>
 

        
        <PlumbHead
        onClick={()=>router.goBack()}
title={collection.title}
backText="Room"
profile={collection.profile}
isPrivate={collection.isPrivate}
type={collection.type}

        />


        <section className="border-b border-card-border dark:border-white/10">
          <div className={``}>
            <div className="flex max-w-2xl p-2 mt-4 mx-auto flex-wrap items-center gap-2">
              
<PlumbButton
  currentProfile={currentProfile}
  isSelf={false}
  label={following?"Following":"Follow"}
  following={following}
  onClick={() =>
    following
      ? handleUnfollow()
      : handleFollow()
  }
/>



              {currentProfile &&  (homeCol?.id !=id) && (<>
                <PlumbButton 
                
                onClick={handleBookmark}
                following={isBookmarked}
                label={isBookmarked
                    ? "Saved to Home"
                    : "Save to Home"}
                />
        
                </>
              )}

              {currentProfile && (archiveCol?.id!=id) && (
                <>
                <PlumbButton
                 currentProfile={currentProfile}
                isSelf={false}
                following={isArchived}
                 
                  onClick={handleArchive}
                  label= {isArchived
                    ? "In Archive"
                    : "Save to Archive"}
                  />
        </>
              )}

              {canEdit && (
                <div
                  type="button"
                  onClick={() =>
                    router.push(
                      Paths.editCollection.createRoute(
                        collection.id
                      )
                    )
                  }
               className={styles.button.base+ " "+styles.button.secondary }
                >
                  Edit room
                </div>
              )}

              {canAdd && (
                <div
                  type="button"
                  onClick={() =>
                    router.push(
                      Paths.addToCollection.createRoute(
                        collection.id
                      )
                    )
                  }
                  className={styles.button.base+" "+styles.button.primary}
                >
                  Add to Room
                </div>
              )}
            </div>
          </div>
        </section>

        {/* --------------------------------------------- */}
        {/* Room tabs and content */}
        {/* --------------------------------------------- */}

        <section className={""}>
      
    
   
            <div             className={styles.tabs.pill.container+" max-w-2xl mx-auto flex justify-center justify-around pb-40 "}>
           
              <TabBar
           
                tabs={tabs}
                active={tab}
                onChange={setTab}
              />
      
 </div>  
       
            <div className={styles.pageShell.body+" pb-20"}>
              {tab === "inside" && (
                <InsideRoom
                router={router}
                  collection={collection}
                  canAdd={canAdd}
                  canEdit={canEdit}
                
                />
              )}

              {tab === "members" && (
                <MemberTab
                  collection={collection}
                 router={router}
                />
              )}

              {tab === "about" && (
                <AboutTab
                  collection={collection}
                      router={router}
                />
              )}
            </div>
     
        </section>

        {/* --------------------------------------------- */}
        {/* Recommended rooms */}
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
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-text-secondary">
                  Keep exploring
                </p>

                <h2 className="font-serif text-2xl text-text-primary dark:text-cream sm:text-3xl">
                  Other rooms
                </h2>
              </div>

              <RecommendedRooms
                rooms={recommended.items}
                router={router}
           
              />
            </div>
          </section>
        )}
     
      </main>
    </ErrorBoundary>
    </IonContent>
  );
}

// =========================================================
// INSIDE ROOM
// =========================================================

function InsideRoom({
  collection,
  canAdd,
  canEdit,
 router
}) {
  const currentProfileId = useSelector(
    (state) => state.users.currentProfile?.id
  );

  const orderedContent = useMemo(() => {
    const pages = (
      collection?.storyIdList ?? []
    )
      .filter((item) => item?.story)
      .map((item, index) => ({
        kind: "page",
        content: item.story,
        index: item.index ?? index,
      }));

    const rooms = (
      collection?.childCollections ?? []
    )
      .filter((item) => item?.childCollection)
      .map((item, index) => ({
        kind: "room",
        content: item.childCollection,
        index: item.index ?? index,
      }));

    return [...pages, ...rooms].sort((a, b) => {
      const aIndex =
        a.index == null
          ? Number.POSITIVE_INFINITY
          : a.index;

      const bIndex =
        b.index == null
          ? Number.POSITIVE_INFINITY
          : b.index;

      return aIndex - bIndex;
    });
  }, [collection]);

  const isOwner =
    collection?.profileId === currentProfileId;

  const canModify =
    canEdit ||
    isOwner ||
    collection?.isOpenCollaboration;

  if (!orderedContent.length) {
    return (
      <div className="pt-8">
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-card-border
            p-8
            text-center
            dark:border-white/10
            sm:p-12
          "
        >
          <p className="font-serif text-2xl text-text-primary dark:text-cream">
            Nothing lives here yet.
          </p>

          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary dark:text-gray-300">
            A room can hold writing, other rooms,
            or both. Start somewhere.
          </p>

          {(canModify || canAdd) && (
            <button
              type="button"
              onClick={() =>
                router.push(
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
      </div>
    );
  }

  return (
    <div className={"pt-8 "+styles.pageShell.body}>
      <RoomSectionHeading
        eyebrow="Inside"
        title="What's here"
        description="Writing and rooms collected together."
      />

      <div className="mt-8 space-y-10">
        {orderedContent.map((entry, index) => {
          if (entry.kind === "page") {
            return (
              <div
                key={`page-${entry.content.id}-${index}`}
              >
                <PageList
                  items={[entry.content]}
                  isGrid={false}
                  hasMore={false}
                  getMore={() => {}}
                  forFeedback={false}
                />
              </div>
            );
          }

          if (entry.kind === "room") {
            return (
              <RoomPreview
                key={`room-${entry.content.id}-${index}`}
                room={entry.content}
             router={router}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

function MemberTab({
  collection,
  router

}) {
  const roles = useMemo(() => {
    const contributors = [
      ...(collection?.roles ?? []).filter(
        (member) =>
          member?.profile?.id !==
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
      .filter((member) => member?.profile?.id)
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
        <div
          className="
            mt-6
            divide-y divide-card-border
            border-y border-card-border
            dark:divide-white/10
            dark:border-white/10
          "
        >
          {roles.map((member) => (
            <button
              key={member.profile.id}
              type="button"
              onClick={() =>
                router.push(
                  Paths.profile.createRoute(
                    member.profile.id
                  )
                )
              }
              className="
                my-2
                flex
                w-[100%]
                items-center
                justify-between
                gap-4
                rounded-2xl
           
                py-4
                text-left
                transition-colors
                hover:bg-black/[0.02]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-button-primary-bg/40
                dark:hover:bg-white/[0.03]
                sm:px-8
              "
            >
              <ProfileCircle
                profile={member.profile}
                includeUsername={true}
              />

              <span
                className="
                  shrink-0
                  text-xs
                  capitalize
                  text-text-secondary
                  dark:text-gray-300
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

function AboutTab({
  collection,
}) {
  return (
    <section className="pt-8">
      <RoomSectionHeading
        eyebrow="About"
        title="About this room"
      />

      <div className="mt-6 max-w-2xl space-y-8">
        {collection?.purpose && (
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-text-secondary">
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

        {collection?.location?.city && (
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-text-secondary">
              Location
            </p>

            <p className="text-sm text-text-primary dark:text-cream">
              {collection.location.city}
            </p>
          </div>
        )}

        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.16em] text-text-secondary">
            Access
          </p>

          <p className="text-sm leading-relaxed text-text-secondary dark:text-gray-300">
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


function RecommendedRooms({
  rooms,
  router
}) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {rooms.map((room) => (
        <RoomPreview
          key={room.id}
          room={room}
          router={router}
     
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
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-text-secondary">
          {eyebrow}
        </p>
      )}

      <h2 className="font-serif text-2xl text-text-primary dark:text-cream sm:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary dark:text-gray-300">
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

        py-10
        text-center
        dark:border-white/10
      "
    >
      <p className="text-sm text-text-secondary dark:text-gray-300">
        {message}
      </p>

      {canAdd &&
        buttonLabel &&
        onClick && (
          <button
            type="button"
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
    <main
      role="status"
      aria-label="Loading room content"
      className={styles.pageShell.base+" "+styles.pageShell.padded+" "+styles.pageShell.scroll}
        >
      <div className={`${PAGE} pt-10 sm:pt-14`}>
        <div className="mb-10 h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-white/10" />

        <div className="mb-5 h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/10" />

        <div className="h-12 w-3/4 max-w-2xl animate-pulse rounded bg-gray-200 dark:bg-white/10 sm:h-16" />

        <div className="mt-5 max-w-xl space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        </div>

        <div className="mt-8 h-8 w-40 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
      </div>

      <div className="mt-10 border-y border-card-border dark:border-white/10">
        <div className={`${PAGE} py-4`}>
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        </div>
      </div>

      <div className={`${PAGE} space-y-5 py-10`}>
        <div className="h-7 w-40 animate-pulse rounded bg-gray-200 dark:bg-white/10" />

        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="
                h-40
                animate-pulse
                rounded-2xl
                bg-gray-200
                dark:bg-white/10
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