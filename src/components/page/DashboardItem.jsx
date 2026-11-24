
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { useIonRouter } from "@ionic/react";

import "../../Dashboard.css";

import {
  deletePageApproval,
  createPageApproval,
    requestStoryAccess,
  getStoryAccessStatus,
} from "../../actions/PageActions";

import {
  addStoryListToCollection,
  deleteStoryFromCollection,
} from "../../actions/CollectionActions";

import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";

import { useAlert } from "../../core/useAlert";
import AlertType from "../../core/AlertType";
import { useDialog } from "../../domain/usecases/useDialog";

import ProfileCircle from "../profile/ProfileCircle";
import ShareList from "./ShareList";
import StoryPreview from "./StoryPreview";

import styles from "../../styles/style";
import { PageType } from "../../core/constants";
import computePermissions from "../../core/compusePermissions";
import PageDataElement from "./PageDataElement";

const theme = styles.dashboardItem;
const EMPTY_ARRAY = [];

const DEFAULT_PREVIEW_LENGTH = 300;
const BOOKMARK=(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M5,21V5Q5,4.17 5.59,3.59T7,3H17q0.82,0 1.41,0.59T19,5V21l-7-3L5,21Zm2-3.05l5-2.15l5,2.15V5H7V17.95ZM7,5H17H12H7Z"/></svg>)
const BOOKMARK_FILL=(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M5,21V5Q5,4.17 5.59,3.59T7,3H17q0.82,0 1.41,0.59T19,5V21l-7-3L5,21Z"/></svg>)
/*
 * Remove HTML markup when calculating preview length.
 */
function getStoryTextLength(data) {
  if (typeof data !== "string") return 0;

  return data
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#\d+;|&#x[\da-f]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim().length;
}

/*
 * Find an existing bookmark.
 *
 * Archive takes priority over Home.
 */


/*
 * Find the preferred destination for a new bookmark.
 */

function getProfileCollections(profile) {
  const collections = profile?.profileToCollections;

  return Array.isArray(collections)
    ? collections.flat(Infinity).filter(Boolean)
    : [];
}

function getHomeCollection(profile) {
  return getProfileCollections(profile).find(
    (item) =>
      item?.type === "home" &&
      (item.collectionId || item.collection?.id)
  ) ?? null;
}

function findHomeBookmark(profile, storyId) {
  if (!storyId) return null;

  const home = getHomeCollection(profile);

  const storyLink = home?.collection?.storyIdList?.find(
    (item) => String(item?.storyId) === String(storyId)
  );

  if (!storyLink) return null;

  return {
    ...storyLink,
    stId: storyLink.id || storyLink._id,
    collectionId: home.collectionId || home.collection?.id,
  };
}

function DashboardItem({
  page,
  isGrid,
  shortenTo,
  showPermissionRequest = true,
}) {
  const dispatch = useDispatch();
  const router = useIonRouter();
const [accessStatus, setAccessStatus] = useState("none");
const [accessPending, setAccessPending] = useState(false);
  const { showPrompt, showAlert } = useAlert();
  const { openDialog } = useDialog();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

const [bookmarkOverride, setBookmarkOverride] = useState(undefined);

const bookmarkKey = `${currentProfile?.id || ""}:${page?.id || ""}`;

const reduxBookmark = useMemo(
  () => findHomeBookmark(currentProfile, page?.id),
  [currentProfile, page?.id]
);

const bookmarked =
  bookmarkOverride?.key === bookmarkKey
    ? bookmarkOverride.value
    : reduxBookmark;

  // Local state is reserved for UI feedback and pending operations.
  const [likeFound, setLikeFound] = useState(null);

  const [bookmarkPending, setBookmarkPending] =
    useState(false);

  const [likePending, setLikePending] =
    useState(false);



  /*
   * Keep local interaction state synchronized with Redux.
   */
useEffect(() => {
  if (!currentProfile?.id || !page?.id) {
    setLikeFound(null);
    return;
  }

  const foundLike =
    currentProfile.likedStories?.find(
      (like) => like?.storyId === page.id
    );

  setLikeFound(foundLike ?? null);
}, [currentProfile, page?.id]);
  /*
   * Preview calculations.
   */
  const previewLength = useMemo(() => {
    const value = Number(shortenTo);

    return Number.isFinite(value) && value > 0
      ? Math.floor(value)
      : DEFAULT_PREVIEW_LENGTH;
  }, [shortenTo]);

  const storyTextLength = useMemo(
    () => getStoryTextLength(page?.data),
    [page?.data]
  );
useEffect(() => {
  let active = true;

  if (
    !page?.id ||
    !page?.isPrivate ||
    !currentProfile?.id
  ) {
    setAccessStatus("none");
    return () => {
      active = false;
    };
  }

  // Owners and already-approved readers don't need a request.
  const alreadyApproved = page.betaReaders?.some(
    (entry) =>
      entry.profileId === currentProfile.id &&
      entry.approved === true
  );

  const isOwner =
    page.authorId === currentProfile.id ||
    page.author?.id === currentProfile.id;

  if (alreadyApproved || isOwner) {
    setAccessStatus("approved");

    return () => {
      active = false;
    };
  }

  setAccessStatus("checking");

  dispatch(
    getStoryAccessStatus({ id: page.id })
  )
    .unwrap()
    .then((result) => {
      if (active) {
        setAccessStatus(result.status || "none");
      }
    })
    .catch((error) => {
      console.error("Unable to check story access:", error);

      if (active) {
        setAccessStatus("none");
      }
    });

  return () => {
    active = false;
  };
}, [
  dispatch,
  page?.id,
  page?.isPrivate,
  page?.authorId,
  page?.author?.id,
  page?.betaReaders,
  currentProfile?.id,
]);
  /*
   * Loading state.
   */
  if (!page) {
    return (
      <div
        className={theme.skeleton}
        aria-hidden="true"
      />
    );
  }

  /*
   * Author information.
   */
  const authorName =
    page.author?.username ||
    page.author?.name ||
    "Writer";

  const authorId =
    page.author?.id ||
    page.authorId ||
    page.profileId;

  /*
   * Privacy / permissions.
   */


 

  const hasMoreContent =

    page.type === PageType.text &&
    storyTextLength > previewLength;

  /*
   * Navigation.
   */
  const handleOpenStory = (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!page.id) return;

    router.push(
      Paths.page.createRoute(page.id),
      "forward"
    );
  };

  const handleOpenProfile = (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!authorId) return;

    router.push(
      Paths.profile.createRoute(authorId),
      "forward"
    );
  };
  const { canSee } = computePermissions(
  page,
  currentProfile,
  {
    isOwner: (story, profile) => {
      if (!story || !profile) return false;

      return (
        story.author?.id === profile.id ||
        story.profileId === profile.id ||
        story.authorId === profile.id
      );
    },
getAccessList: (story) =>
  (story.betaReaders ?? []).filter(
    (entry) => entry.approved === true
  ),

getAccessRole: (entry) =>
  entry.role ?? entry.permission,
  

    isPrivate: (story) => story.isPrivate,

    isOpen: () => false,

    canWriteRoles: ["commenter", "editor"],
    canEditRoles: ["editor"],
  }
);

  const handleApprovalClick = async (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!currentProfile?.id || likePending) {
      if (!currentProfile?.id) {
        showAlert({
          message: "Please sign up to like stories.",
          type: AlertType.success,
        });
      }

      return;
    }

    setLikePending(true);

    const previousLike = likeFound;

    // Optimistic update.
    setLikeFound(previousLike ? null : true);

    try {
      const action = previousLike
        ? deletePageApproval({
            id: previousLike.id,
          })
        : createPageApproval({
            story: page,
            profile: currentProfile,
          });

      const result = await dispatch(action);

      checkResult(
        result,
        (payload) => {
          if (previousLike) {
            setLikeFound(null);
            return;
          }

          const createdLike =
            payload?.profile?.likedStories?.find(
              (item) => item?.storyId === page.id
            );

          setLikeFound(createdLike ?? true);
        },
        (error) => {
          setLikeFound(previousLike);

          console.error(
            "Story reaction failed:",
            error
          );
        }
      );
    } catch (error) {
      setLikeFound(previousLike);
      console.error("Story reaction failed:", error);
    } finally {
      setLikePending(false);
    }
  };

  /*
   * BOOKMARK
   */
 

const handleBookmark = async (event) => {
  event?.preventDefault();
  event?.stopPropagation();

  if (bookmarkPending) return;

  if (!currentProfile?.id) {
    showPrompt({
      message: "Join Plumbum to save this story.",
      agreeText: "Yes!",
      agree: () => router.push(Paths.onboard),
      disagreeText: "Later",
    });
    return;
  }

  if (!page?.id) return;

  const home = getHomeCollection(currentProfile);
  const collectionId = home?.collectionId || home?.collection?.id;

  if (!collectionId) {
    showAlert({
      message: "Your Home collection isn't available.",
      type: AlertType.error,
    });
    return;
  }

  setBookmarkPending(true);

  try {
    if (bookmarked) {
      // The delete endpoint requires the StoryToCollection ID.
      const stId = bookmarked.stId || bookmarked.id || bookmarked._id;

      if (!stId) {
        throw new Error(
          "The saved story relationship ID is missing. Refresh your profile and try again."
        );
      }

      const result = await dispatch(
        deleteStoryFromCollection({ stId })
      );

      checkResult(
        result,
        () => {
          setBookmarkOverride({
            key: bookmarkKey,
            value: null,
          });

          showAlert({
            message: "Removed from Home.",
            type: AlertType.success,
          });
        },
        (error) => {
          showAlert({
            message: error?.message || "Couldn't remove this story.",
            type: AlertType.error,
          });
        }
      );

      return;
    }

    // This matches addStoryListToCollection's actual signature.
    const result = await dispatch(
      addStoryListToCollection({
        id: collectionId,
        list: [page],
        profile: currentProfile,
      })
    );

    checkResult(
      result,
      (payload) => {
        // Preserve the relationship ID if the API returns it.
        const addedLink = payload?.collection?.storyIdList?.find(
          (item) => String(item?.storyId) === String(page.id)
        );

        setBookmarkOverride({
          key: bookmarkKey,
          value: {
            ...(addedLink || {}),
            storyId: page.id,
            stId: addedLink?.id || addedLink?._id,
            collectionId,
          },
        });

        showAlert({
          message: "Added to Home.",
          type: AlertType.success,
        });
      },
      (error) => {
        showAlert({
          message: error?.message || "Couldn't save this story.",
          type: AlertType.error,
        });
      }
    );
  } catch (error) {
    showAlert({
      message:
        error?.message || "Something went wrong. Please try again.",
      type: AlertType.error,
    });
  } finally {
    setBookmarkPending(false);
  }
};



  /*
   * SHARE
   */
  const onClickShare = (event) => {
  event?.preventDefault();
  event?.stopPropagation();

  openDialog({
    isOpen: true,
    title: null,
    scrollY: false,


    text: (
      <ShareList
        page={page}
        profile={currentProfile}
        authorProfile={page.author}
      />
    ),


 
  });
};
  const handleShare = (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    openDialog({
 

      text: (
        <ShareList
          page={page}
          profile={currentProfile}
          authorProfile={page.author}

      
        />
      ),

   
    });
  };


const handleRequestPermission = async (event) => {
  event?.preventDefault();
  event?.stopPropagation();

  if (accessPending || accessStatus === "pending") {
    return;
  }

  if (!currentProfile?.id) {
    showPrompt({
      message: "Join Plumbum to request access to this story.",
      agreeText: "Join Plumbum",
      agree: () => router.push(Paths.onboard),
      disagreeText: "Later",
    });

    return;
  }

  if (!page?.id) return;

  setAccessPending(true);

  try {
    const result = await dispatch(
      requestStoryAccess({ id: page.id })
    ).unwrap();

    setAccessStatus(result.status || "pending");

    showAlert({
      message:
        result.status === "approved"
          ? "You already have access to this story."
          : "Your permission request has been sent.",
      type: AlertType.success,
    });
  } catch (error) {
    console.error("Story permission request failed:", error);

    // Handle a duplicate request gracefully.
    if (error?.status === 409 || error?.response?.status === 409) {
      try {
        const result = await dispatch(
          getStoryAccessStatus({ id: page.id })
        ).unwrap();

        setAccessStatus(result.status || "pending");
        return;
      } catch (e){
        showAlert({message:e.message,type:AlertType.error})
        // Fall through to the error message.
      }
    }

    showAlert({
      message:
        error?.error ||
        error?.message ||
        "Unable to request permission. Please try again.",
      type: AlertType.error,
    });
  } finally {
    setAccessPending(false);
  }
};

if (page.isPrivate && !canSee && accessStatus !== "approved") {
  return null;
}
  /*
   * CARD
   */
  return (
    <article
      className={`group ${theme.card}`}
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* AUTHOR */}
      <header className={theme.header}>
        <div className="flex flex-row min-w-0">
          <div className="mx-2 my-auto shrink-0">
            <ProfileCircle
              includeUsername={false}
              profile={
                page.author || {
                  id: authorId,
                  username: authorName,
                }
              }
            />
          </div>

          <button
            type="button"
            disabled={!authorId}
            onClick={handleOpenProfile}
            className={`
              -translate-y-1
              min-w-0
              truncate
              text-left
              my-auto
              ${theme.authorName}
            `}
            aria-label={`View ${authorName}'s profile`}
          >
            <span className="block truncate">
              {authorName}
            </span>

            <span className={`block ${theme.metadata}`}>
              {page.isPrivate
                ? "Private Story"
                : page.status || "Story"}
            </span>
          </button>
        </div>

        {/* BOOKMARK */}
  <button
    type="button"
    onClick={handleBookmark}
    className={`
      flex
      h-9
      w-9
      shrink-0
      items-center
      justify-center
      rounded-full
      text-plumb-muted
      transition-colors
      duration-150
      bg-transparent
      hover:bg-plumb-mint/10
      hover:text-plumb-mintHover
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-plumb-focus
      dark:text-plumb-darkMuted
      dark:hover:bg-plumb-mint/15
      dark:hover:text-plumb-mintLight
      active:scale-95
      motion-reduce:transform-none
      motion-reduce:transition-none
    `}
    aria-label={
      bookmarked
        ? "Remove story from saved items"
        : "Save story"
    }
    aria-pressed={Boolean(bookmarked)}
  >
    
    {bookmarked? BOOKMARK_FILL:BOOKMARK}

  </button>




      </header>

      {/* TITLE AND STORY PREVIEW */}
      <div className={theme.content}>
        <button
          type="button"
          onClick={handleOpenStory}
          className={theme.titleButton}
        >
          <h6 className={styles.text.subheading}>
            {page.title || "Untitled"}
          </h6>
        </button>

        {page.description && (
          <p
            className={`${styles.text.muted} mt-2 text-sm px-4 leading-relaxed`}
          >
            {page.description}
          </p>
        )}

        {/* PRIVATE STORIES NEVER RENDER THEIR BODY */}
   {page.isPrivate && !canSee && accessStatus !== "approved" ? (
     <div className="mx-auto px-4 py-5 text-center">
  <h3 className="text-center font-medium">
    This Story is private.
  </h3>

  <p className="mx-auto mt-2 text-center text-sm text-plumb-muted dark:text-plumb-darkMuted">
    Ask {authorName} for permission to read it.
  </p>

  {showPermissionRequest && (
    <button
      type="button"
      onClick={handleRequestPermission}
      disabled={
        accessPending ||
        accessStatus === "pending" ||
        accessStatus === "checking"
      }
      className={`
        ${theme.permissionButton}
        mx-auto
        mt-4
        text-center
        disabled:cursor-not-allowed
        disabled:opacity-60
      `}
    >
      {accessPending
        ? "Sending request..."
        : accessStatus === "checking"
        ? "Checking access..."
        : accessStatus === "pending"
        ? "Request pending"
        : "Request permission"}
    </button>
  )}
</div>
        ) : (
          <>
            <div className={theme.excerpt}>
              <div className="mt-4 mx-2">
                {page.type === PageType.text ? (
                  <StoryPreview
                    page={page}
                    shortenTo={previewLength}
                  />
                ) : (
                  <PageDataElement
                  truncateNumber={40}
                  compact={null}
                   isGrid={false}
                   page={page}/>
                  
                )}
              </div>
            </div>

            {hasMoreContent && (
              <button
                type="button"
                onClick={handleOpenStory}
                className={theme.continue}
                aria-label={`Continue reading ${page.title || "this story"}`}
              >
                Continue reading
                <span aria-hidden="true">→</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* PARTICIPATION ACTIONS */}
      <footer className={""}>
  {(canSee || accessStatus === "approved") && (
          <>
            <button
              type="button"
              onClick={handleApprovalClick}
              disabled={likePending}
              className={`
                ${theme.action}
                ${likeFound ? theme.actionActive : ""}
                disabled:opacity-50
              `}
              aria-label={
                likeFound
                  ? "Remove yea"
                  : "Give this Story a yea"
              }
              aria-pressed={Boolean(likeFound)}
            >
              {likePending
                ? "..."
                : likeFound
                ? "Yea'd"
                : "Yea"}
            </button>

            <button
              type="button"
              onClick={handleOpenStory}
              className={theme.action}
            >
              Comment
            </button>
          </>
        )}

        <button
          type="button"
          onClick={handleShare}
          className={theme.action}
        >
          Share
        </button>
      </footer>
    </article>
  );
}

export default React.memo(DashboardItem);
