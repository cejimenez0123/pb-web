import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import "../../Dashboard.css";

import {
  deletePageApproval,
  createPageApproval,
} from "../../actions/PageActions";

import {
  addStoryListToCollection,
  deleteStoryFromCollection,
} from "../../actions/CollectionActions";

import { useDispatch, useSelector } from "react-redux";
import { IonImg } from "@ionic/react";

import bookmarkfill from "../../images/bookmarkfill.svg";
import bookmarkoutline from "../../images/bookmarkadd.svg";

import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";

import ProfileCircle from "../profile/ProfileCircle";
import Context from "../../context";
import ShareList from "./ShareList";

import { useIonRouter } from "@ionic/react";
import { useDialog } from "../../domain/usecases/useDialog";
import computePermissions from "../../core/compusePermissions";
import DataElement from "./DataElement";
import { useAlert } from "../../core/useAlert";
import AlertType from "../../core/AlertType";
import styles from "../../styles/style";
import StoryPreview from "./StoryPreview";
import { PageType } from "../../core/constants";

const DEFAULT_PREVIEW_LENGTH = 500;

const getPreviewLength = (value) => {
  const length = Number(value);

  return Number.isFinite(length) && length > 0
    ? Math.floor(length)
    : DEFAULT_PREVIEW_LENGTH;
};

const theme = styles.dashboardItem;

/**
 * Get the readable text length without counting HTML markup.
 * DataElement remains responsible for rendering the actual story content.
 */
const getStoryTextLength = (data) => {
  if (typeof data !== "string") {
    return 0;
  }

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
};

function DashboardItem({
  page,
  isGrid,
  shortenTo,
  showPermissionRequest = true,
}) {
  const { setSuccess, setError } = useContext(Context);

  const [archive, setArchive] = useState(null);
  const [likeFound, setLikeFound] = useState(null);
  const [bookmarked, setBookmarked] = useState(null);

  const [permissionRequestState, setPermissionRequestState] =
    useState("idle");

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const dispatch = useDispatch();
  const router = useIonRouter();

  const { openDialog, resetDialog } = useDialog();
  const { showAlert } = useAlert();

  /*
   * -------------------------------------------------------------------------
   * PRIVACY / PERMISSIONS
   * -------------------------------------------------------------------------
   */
  const { canSee } = computePermissions(page, currentProfile, {
    isOwner: (story, profile) => {
      if (!story || !profile) return false;

      return (
        story.author?.id === profile.id ||
        story.profileId === profile.id ||
        story.authorId === profile.id
      );
    },

    getAccessList: (story) => story.betaReaders ?? [],
    getAccessRole: (entry) => entry.permission,
    isPrivate: (story) => story.isPrivate,
    isOpen: () => false,

    canWriteRoles: ["commenter", "editor"],
    canEditRoles: ["editor"],
  });

  /*
   * -------------------------------------------------------------------------
   * ARCHIVE
   * -------------------------------------------------------------------------
   */
  const getArchive = () => {
    if (!currentProfile?.profileToCollections) {
      return;
    }

    const archivePtc =
      currentProfile.profileToCollections.find(
        (ptc) => ptc?.type === "archive"
      );

    setArchive(archivePtc?.collection || null);
  };

  /*
   * -------------------------------------------------------------------------
   * LIKE / BOOKMARK STATE
   * -------------------------------------------------------------------------
   */
  useEffect(() => {
    if (!currentProfile?.id || !page) {
      setLikeFound(null);
      setBookmarked(null);
      return;
    }

    const foundLike =
      currentProfile.likedStories?.find(
        (like) => like?.storyId === page.id
      );

    setLikeFound(foundLike ?? null);

    const bookmarkCollections =
      currentProfile.profileToCollections || [];

    const archivePtc =
      bookmarkCollections.find(
        (ptc) => ptc?.type === "archive"
      );

    const archiveStc =
      archivePtc?.collection?.storyIdList?.find(
        (story) => story.storyId === page.id
      );

    const homePtc =
      bookmarkCollections.find(
        (ptc) => ptc?.type === "home"
      );

    const homeStc =
      homePtc?.collection?.storyIdList?.find(
        (story) => story.storyId === page.id
      );

    setBookmarked(
      archiveStc
        ? {
            ...archiveStc,
            collectionId: archivePtc.collectionId,
          }
        : homeStc
        ? {
            ...homeStc,
            collectionId: homePtc.collectionId,
          }
        : null
    );
  }, [currentProfile, page]);

  /*
   * -------------------------------------------------------------------------
   * LIKE
   * -------------------------------------------------------------------------
   */
  const handleApprovalClick = () => {
    if (!currentProfile) {
      return showAlert({
        message: "Please Sign Up to Like",
        type: AlertType.success,
      });
    }

    if (likeFound) {
      const previousLike = likeFound;
      setLikeFound(null);

      dispatch(
        deletePageApproval({
          id: previousLike.id,
        })
      ).then((res) =>
        checkResult(
          res,
          () => {},
          (err) => {
            setLikeFound(previousLike);
            console.error(err);
          }
        )
      );

      return;
    }

    setLikeFound(true);

    dispatch(
      createPageApproval({
        story: page,
        profile: currentProfile,
      })
    ).then((res) =>
      checkResult(
        res,
        (payload) => {
          const found =
            payload.profile?.likedStories?.find(
              (like) => like?.storyId === page.id
            );

          setLikeFound(found ?? true);
        },
        (err) => {
          setLikeFound(null);
          console.error(err);
        }
      )
    );
  };

  /*
   * -------------------------------------------------------------------------
   * BOOKMARK
   * -------------------------------------------------------------------------
   */
  const handleBookmark = (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!currentProfile) {
      return setError("Please Sign Up");
    }

    const bookmarkCollections =
      currentProfile.profileToCollections || [];

    const archivePtc =
      bookmarkCollections.find(
        (ptc) => ptc?.type === "archive"
      );

    const homePtc =
      bookmarkCollections.find(
        (ptc) => ptc?.type === "home"
      );

    if (bookmarked) {
      dispatch(
        deleteStoryFromCollection({
          storyId: bookmarked.storyId || page.id,
          collectionId: bookmarked.collectionId,
        })
      ).then((res) =>
        checkResult(
          res,
          () => {
            resetDialog();
            setBookmarked(null);
          },
          (err) =>
            setError(
              "Error removing bookmark: " + err.message
            )
        )
      );

      return;
    }

    // Preserve the existing preference: Archive first, then Home.
    const targetPtc = archivePtc || homePtc;

    if (!targetPtc?.collectionId) {
      return;
    }

    dispatch(
      addStoryListToCollection({
        id: targetPtc.collectionId,
        list: [page],
        profile: currentProfile,
      })
    ).then((res) =>
      checkResult(
        res,
        (payload) => {
          const stc =
            payload.collection?.storyIdList?.find(
              (story) => story.storyId === page.id
            );

          setBookmarked(
            stc
              ? {
                  ...stc,
                  collectionId: targetPtc.collectionId,
                }
              : null
          );

          setSuccess("Added Successfully");
        },
        () => setError("Error Bookmarking")
      )
    );
  };

  /*
   * -------------------------------------------------------------------------
   * OPEN STORY
   * -------------------------------------------------------------------------
   */
  const handleClickComment = (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!page?.id) {
      return;
    }

    router.push(
      Paths.page.createRoute(page.id),
      "forward"
    );
  };

  /*
   * -------------------------------------------------------------------------
   * SHARE
   * -------------------------------------------------------------------------
   */
  const onClickShare = (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    getArchive();

    openDialog({
      isOpen: true,
      title: null,
      scrollY: false,
      height: 50,

      text: (
        <ShareList
          page={page}
          profile={currentProfile}
          authorProfile={page.author}
          archive={archive}
          setArchive={setArchive}
          bookmark={bookmarked}
          setBookmarked={setBookmarked}
        />
      ),

      agree: null,
      agreeText: null,
      breakpoint: 0.95,
    });
  };

  /*
   * -------------------------------------------------------------------------
   * PERMISSION REQUEST
   * -------------------------------------------------------------------------
   *
   * UI-only placeholder until the request endpoint exists.
   */
  const handleRequestPermission = () => {
    if (!currentProfile) {
      return showAlert({
        message: "Please Sign Up to Request Access",
        type: AlertType.success,
      });
    }

    setPermissionRequestState("pending");

    setTimeout(() => {
      setPermissionRequestState("requested");
    }, 300);
  };

  /*
   * -------------------------------------------------------------------------
   * LOADING
   * -------------------------------------------------------------------------
   */
  if (!page) {
    return (
      <div
        className={theme.skeleton}
        aria-hidden="true"
      />
    );
  }

  const authorName =
    page.author?.username ||
    page.author?.name ||
    "Writer";

  const authorId =
    page.author?.id ||
    page.authorId ||
    page.profileId;

  const isPrivateStory = !canSee;

  // const storyTextLength = getStoryTextLength(page.data);

const previewLength =
  Number.isFinite(Number(shortenTo)) && Number(shortenTo) > 0
    ? Math.floor(Number(shortenTo))
    : 300;

const storyTextLength = getStoryTextLength(page.data);

const hasMoreContent =
  !isPrivateStory &&
  page.type === PageType.text &&
  storyTextLength > previewLength;
  /*
   * -------------------------------------------------------------------------
   * CARD
   * -------------------------------------------------------------------------
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
        <button
          type="button"
          disabled={!authorId}
          onClick={() => {
            if (!authorId) return;

            router.push(
              Paths.profile.createRoute(authorId),
              "forward"
            );
          }}
          className={theme.authorButton}
          aria-label={`View ${authorName}'s profile`}
        >
          <ProfileCircle
            includeUsername={false}
            profile={
              page.author || {
                id: authorId,
                username: authorName,
              }
            }
          />

          <span className="min-w-0">
            <span className={`block ${theme.authorName}`}>
              {authorName}
            </span>

            <span className={`block ${theme.metadata}`}>
              {isPrivateStory
                ? "Private Story"
                : page.status || "Story"}
            </span>
          </span>
        </button>

        {!isPrivateStory && (
          <button
            type="button"
            onClick={handleBookmark}
            className={theme.bookmark}
            aria-label={
              bookmarked
                ? "Remove story from saved items"
                : "Save story"
            }
            aria-pressed={Boolean(bookmarked)}
          >
            <IonImg
              className="h-5 w-5"
              src={
                bookmarked
                  ? bookmarkfill
                  : bookmarkoutline
              }
              alt=""
            />
          </button>
        )}
      </header>

      {/* TITLE AND STORY PREVIEW */}
      <div className={theme.content}>
        <button
          type="button"
          onClick={handleClickComment}
          className={theme.titleButton}
        >
          <p className={styles.text.subheading}>
            {page.title  || "Untitled"}
          </p>
        </button>

        {page.description && (
          <p className={`${styles.text.muted} mt-2 text-sm leading-relaxed`}>
            {page.description}
          </p>
        )}

        {/* PRIVATE STORIES NEVER RENDER THEIR BODY */}
        {isPrivateStory ? (
          <div className={`${theme.privateCard} mt-4`}>
            <h3 className={theme.privateTitle}>
              This Story is private.
            </h3>

            <p className={theme.privateBody}>
              Ask {authorName} for permission to read it.
            </p>

            {showPermissionRequest && (
              <button
                type="button"
                onClick={handleRequestPermission}
                disabled={
                  permissionRequestState === "pending" ||
                  permissionRequestState === "requested"
                }
                className={theme.permissionButton}
              >
                {permissionRequestState === "pending"
                  ? "Requesting…"
                  : permissionRequestState === "requested"
                  ? "Request sent"
                  : "Request permission"}
              </button>
            )}
          </div>
        ) : (
          <>
          <div className={theme.excerpt}>
  {page.type === PageType.text ? (
    <StoryPreview
      page={page}
      shortenTo={previewLength}
    />
  ) : (
    <DataElement
      isGrid={isGrid}
      page={page}
    />
  )}
</div>
     

            {hasMoreContent && (
              <button
                type="button"
                onClick={handleClickComment}
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

      {/* QUIET PARTICIPATION ACTIONS */}
      <footer className={theme.actions}>
        {!isPrivateStory && (
          <>
            <button
              type="button"
              onClick={handleApprovalClick}
              className={`
                ${theme.action}
                ${likeFound ? theme.actionActive : ""}
              `}
              aria-label={
                likeFound
                  ? "Remove yea"
                  : "Give this Story a yea"
              }
              aria-pressed={Boolean(likeFound)}
            >
              {likeFound ? "Yea'd" : "Yea"}
            </button>

            <button
              type="button"
              onClick={handleClickComment}
              className={theme.action}
            >
              Comment
            </button>
          </>
        )}

        <button
          type="button"
          onClick={onClickShare}
          className={theme.action}
        >
          Share
        </button>
      </footer>
    </article>
  );
}

export default React.memo(DashboardItem);