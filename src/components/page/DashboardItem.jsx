

import React, {
  useContext,
  useEffect,
  useMemo,
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

import bookmarkfill from "../../images/bookmarkfill.svg";
import bookmarkoutline from "../../images/bookmarkadd.svg";

import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";

import ProfileCircle from "../profile/ProfileCircle";
import Context from "../../context";

import { sendGAEvent } from "../../core/ga4";
import ShareList from "./ShareList";

import { useIonRouter } from "@ionic/react";
import { useDialog } from "../../domain/usecases/useDialog";
import computePermissions from "../../core/compusePermissions";
import DataElement from "./DataElement";
import { useAlert } from "../../core/useAlert";
import AlertType from "../../core/AlertType";

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

  /*
   * Future permission-request UI state.
   *
   * This is deliberately local for now because the actual
   * permission-request endpoint has not been implemented.
   */
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
   *
   * Story ownership is explicitly determined from the author as well as
   * the possible profileId / authorId fields.
   *
   * This is important because a Story's author is the person who should
   * always be able to see their own Story.
   */
  const { canSee } = computePermissions(page, currentProfile, {
    /*
     * Story owner.
     *
     * author.id is the strongest semantic signal here.
     * profileId / authorId are retained for compatibility with different
     * Story payloads.
     */
    isOwner: (story, profile) => {
      if (!story || !profile) return false;

      return (
        story.author?.id === profile.id ||
        story.profileId === profile.id ||
        story.authorId === profile.id
      );
    },

    /*
     * Story-specific access list.
     */
    getAccessList: (story) =>
      story.betaReaders ?? [],

    getAccessRole: (entry) =>
      entry.permission,

    isPrivate: (story) =>
      story.isPrivate,

    /*
     * Stories in this dashboard do not automatically become open
     * collaboration resources.
     */
    isOpen: () => false,

    canWriteRoles: [
      "commenter",
      "editor",
    ],

    canEditRoles: [
      "editor",
    ],
  });

  /*
   * -------------------------------------------------------------------------
   * STORY SOURCE
   * -------------------------------------------------------------------------
   */
  const storySource = useMemo(() => {
    const pathname =
      router.routeInfo?.pathname || "";

    if (pathname.startsWith("/profile")) {
      return "profile_page";
    }

    if (pathname.startsWith("/dashboard")) {
      return "dashboard";
    }

    if (pathname.startsWith("/discovery")) {
      return "discovery";
    }

    if (pathname.startsWith("/collection")) {
      return "collection";
    }

    if (pathname.startsWith("/library")) {
      return "library";
    }

    return "unknown";
  }, [router.routeInfo?.pathname]);

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

    setArchive(
      archivePtc?.collection || null
    );
  };

  /*
   * -------------------------------------------------------------------------
   * LIKE / BOOKMARK STATE
   * -------------------------------------------------------------------------
   */
  useEffect(() => {
    if (!currentProfile?.id || !page) {
      return;
    }

    /*
     * Like
     */
    if (currentProfile.likedStories) {
      const found =
        currentProfile.likedStories.find(
          (like) =>
            like?.storyId === page.id
        );

      setLikeFound(found ?? null);
    }

    /*
     * Bookmarks
     */
    const bookmarkCollections =
      currentProfile.profileToCollections || [];

    const archivePtc =
      bookmarkCollections.find(
        (ptc) => ptc?.type === "archive"
      );

    const archiveStc =
      archivePtc?.collection?.storyIdList?.find(
        (story) =>
          story.storyId === page.id
      );

    const homePtc =
      bookmarkCollections.find(
        (ptc) => ptc?.type === "home"
      );

    const homeStc =
      homePtc?.collection?.storyIdList?.find(
        (story) =>
          story.storyId === page.id
      );

    setBookmarked(
      archiveStc
        ? {
            ...archiveStc,
            collectionId:
              archivePtc.collectionId,
          }
        : homeStc
        ? {
            ...homeStc,
            collectionId:
              homePtc.collectionId,
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
      setLikeFound(null);

      dispatch(
        deletePageApproval({
          id: likeFound.id,
        })
      ).then((res) =>
        checkResult(
          res,
          () =>
            sendGAEvent(
              "story_unlike",
              {
                story_id: page.id,
                source: storySource,
              }
            ),
          (err) =>
            console.error(err)
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
          sendGAEvent(
            "story_like",
            {
              story_id: page.id,
              source: storySource,
            }
          );

          const found =
            payload.profile?.likedStories?.find(
              (like) =>
                like?.storyId === page.id
            );

          setLikeFound(
            found ?? true
          );
        },
        (err) =>
          console.error(err)
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

    /*
     * Remove bookmark.
     */
    if (bookmarked) {
      dispatch(
        deleteStoryFromCollection({
          storyId:
            bookmarked.storyId ||
            page.id,
          collectionId:
            bookmarked.collectionId,
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
              "Error removing bookmark: " +
                err.message
            )
        )
      );

      return;
    }

    /*
     * Preserve existing behavior:
     * Archive first, then Home.
     */
    const targetPtc =
      archivePtc || homePtc;

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
              (story) =>
                story.storyId === page.id
            );

          setBookmarked(
            stc
              ? {
                  ...stc,
                  collectionId:
                    targetPtc.collectionId,
                }
              : null
          );

          setSuccess(
            "Added Successfully"
          );

          sendGAEvent(
            "story_bookmark",
            {
              story_id: page.id,
              source: storySource,
            }
          );
        },
        () =>
          setError(
            "Error Bookmarking"
          )
      )
    );
  };

  /*
   * -------------------------------------------------------------------------
   * OPEN STORY / COMMENT
   * -------------------------------------------------------------------------
   */
  const handleClickComment = () => {
    if (!page) {
      return;
    }

    sendGAEvent(
      "story_review_open",
      {
        story_id: page.id,
        source: storySource,
      }
    );

    router.push(
      Paths.page.createRoute(page.id)
    );
  };

  /*
   * -------------------------------------------------------------------------
   * SHARE
   * -------------------------------------------------------------------------
   */
  const onClickShare = () => {
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
   * FUTURE PERMISSION REQUEST
   * -------------------------------------------------------------------------
   *
   * This is only the UI seam for now.
   */
  const handleRequestPermission = () => {
    if (!currentProfile) {
      return showAlert({
        message:
          "Please Sign Up to Request Access",
        type: AlertType.success,
      });
    }

    setPermissionRequestState(
      "pending"
    );

    sendGAEvent(
      "story_permission_request_start",
      {
        story_id: page.id,
        source: storySource,
      }
    );

    /*
     * Temporary UI-only state.
     *
     * Replace this with the actual permission request
     * dispatch once the backend exists.
     */
    setTimeout(() => {
      setPermissionRequestState(
        "requested"
      );

      sendGAEvent(
        "story_permission_request_ui",
        {
          story_id: page.id,
          source: storySource,
        }
      );
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
        className="mx-auto w-full max-w-2xl animate-pulse py-10"
        aria-hidden="true"
      >
        <div className="h-3 w-24 rounded bg-base-soft/20" />

        <div className="mt-5 h-8 w-3/4 rounded bg-base-soft/20" />

        <div className="mt-3 h-4 w-full rounded bg-base-soft/10" />

        <div className="mt-8 h-48 rounded bg-base-soft/10" />
      </div>
    );
  }

  /*
   * -------------------------------------------------------------------------
   * PARTIALLY OBSCURED STORY
   * -------------------------------------------------------------------------
   *
   * IMPORTANT:
   *
   * The author/header is completely outside the obscured area.
   *
   * We don't use page.author content inside the blurred area.
   * The protected content is represented only by neutral placeholder
   * lines.
   */
  if (!canSee) {
    const authorName =
      page.author?.username ||
      page.author?.name ||
      "Writer";

    const authorId =
      page.author?.id ||
      page.authorId ||
      page.profileId;

    return (
      <article className="w-full border-b border-border-default py-10 sm:py-12">
        <div className="mx-auto max-w-2xl">
          {/* ------------------------------------------------------------- */}
          {/* AUTHOR — ALWAYS VISIBLE                                      */}
          {/* ------------------------------------------------------------- */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!authorId}
              onClick={() => {
                if (!authorId) {
                  return;
                }

                router.push(
                  Paths.profile.createRoute(
                    authorId
                  )
                );
              }}
              className="shrink-0 disabled:cursor-default"
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
            </button>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-primary">
                {authorName}
              </p>

              <p className="mt-0.5 text-xs text-text-secondary">
                Private Story
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* STORY TITLE — VISIBLE                                         */}
          {/* ------------------------------------------------------------- */}
          <div className="mt-7">
            <h2 className="font-serif  font-medium  text-[1.2rem] sm:text-[1rem] leading-tight text-text-primary ">
              {page.title || "Untitled"}
            </h2>

            {page.description && (
              <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
                {page.description}
              </p>
            )}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* PROTECTED CONTENT PREVIEW                                     */}
          {/* ------------------------------------------------------------- */}
          <div
            className="relative mt-9 overflow-hidden rounded-xl border border-border-default bg-base-bg"
            aria-label="Protected Story content"
          >
            {/* Fake content only. No Story text is rendered here. */}
            <div
              aria-hidden="true"
              className="pointer-events-none select-none p-6 sm:p-8"
            >
              <div className="space-y-3 opacity-35">
                <div className="h-4 w-[92%] rounded bg-text-secondary/30" />

                <div className="h-4 w-[86%] rounded bg-text-secondary/30" />

                <div className="h-4 w-[96%] rounded bg-text-secondary/30" />

                <div className="h-4 w-[72%] rounded bg-text-secondary/30" />

                <div className="h-5" />

                <div className="h-4 w-[88%] rounded bg-text-secondary/30" />

                <div className="h-4 w-[94%] rounded bg-text-secondary/30" />

                <div className="h-4 w-[79%] rounded bg-text-secondary/30" />

                <div className="h-5" />

                <div className="h-4 w-[95%] rounded bg-text-secondary/30" />

                <div className="h-4 w-[83%] rounded bg-text-secondary/30" />

                <div className="h-4 w-[68%] rounded bg-text-secondary/30" />
              </div>
            </div>

            {/* Obscuring veil */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-base-bg/60 backdrop-blur-[2px]"
            />

            {/* ----------------------------------------------------------- */}
            {/* ACCESS MESSAGE                                               */}
            {/* ----------------------------------------------------------- */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="max-w-sm text-center">
                <p className="font-serif text-xl text-text-primary">
                  This Story is private.
                </p>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Ask {authorName} for permission to
                  read it.
                </p>

                {showPermissionRequest && (
                  <button
                    type="button"
                    onClick={
                      handleRequestPermission
                    }
                    disabled={
                      permissionRequestState ===
                        "pending" ||
                      permissionRequestState ===
                        "requested"
                    }
                    className="mt-5 inline-flex items-center justify-center rounded-lg bg-button-primary-bg px-4 py-2.5 text-sm font-medium text-button-primary-text transition hover:bg-button-primary-hover disabled:cursor-default disabled:opacity-70"
                  >
                    {permissionRequestState ===
                    "pending"
                      ? "Requesting…"
                      : permissionRequestState ===
                        "requested"
                      ? "Request sent"
                      : "Request permission"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* QUIET FOOTER                                                  */}
          {/* ------------------------------------------------------------- */}
          <div className="mt-5 flex items-center justify-between text-xs text-text-secondary">
            <span>Private Story</span>

            <button
              type="button"
              onClick={onClickShare}
              className="transition hover:text-text-primary"
            >
              Share
            </button>
          </div>
        </div>
      </article>
    );
  }

  /*
   * -------------------------------------------------------------------------
   * FULL STORY
   * -------------------------------------------------------------------------
   */
  return (
    <article className="w-full border-b border-border-default py-10 sm:py-12">
      <div className="mx-auto max-w-2xl">
        {/* --------------------------------------------------------------- */}
        {/* AUTHOR                                                          */}
        {/* --------------------------------------------------------------- */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (!page.author?.id) {
                return;
              }

              router.push(
                Paths.profile.createRoute(
                  page.author.id
                )
              );
            }}
            className="shrink-0"
            aria-label={`View ${
              page.author?.username ||
              "author"
            }'s profile`}
          >
            <ProfileCircle
              includeUsername={false}
              profile={page.author}
            />
          </button>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-primary">
              {page.author?.username}
            </p>

            <p className="mt-0.5 text-xs text-text-secondary">
              {page.status || "Story"}
            </p>
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* STORY IDENTITY                                                  */}
        {/* --------------------------------------------------------------- */}
        {/* <button
          type="button"
          onClick={handleClickComment}
          className="mt-7 block w-full text-left"
        > */}
        <button
  type="button"
  onClick={handleClickComment}
  className="mt-8 block w-full text-left"
>
  <h2 className="font-serif  font-medium text-[1.2rem] sm:text-[1rem] leading-[1.15] tracking-[-0.015em] text-text-primary transition hover:text-text-brand ">
  {page.title || "Untitled"}
</h2>

{page.description && (
  <p className="mt-3.5 max-w-2xl text-[0.95rem] leading-7 text-text-secondary">
    {page.description}
  </p>
)}
   
        </button>

        {/* --------------------------------------------------------------- */}
        {/* ACTUAL WORK                                                     */}
        {/* --------------------------------------------------------------- */}
        <div className="mt-9">
          <DataElement
            isGrid={isGrid}
            shortenTo={shortenTo}
            page={page}
          />
        </div>

        {/* --------------------------------------------------------------- */}
        {/* PARTICIPATION                                                   */}
        {/* --------------------------------------------------------------- */}
        <div className="mt-8 flex items-center justify-between border-t border-border-default pt-4">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={handleApprovalClick}
              className={`text-sm transition ${
                likeFound
                  ? "font-medium text-text-brand"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              aria-label={
                likeFound
                  ? "Remove yea"
                  : "Give this Story a yea"
              }
            >
              {likeFound
                ? "Yea'd"
                : "Yea"}
            </button>

            <button
              type="button"
              onClick={handleClickComment}
              className="text-sm font-medium text-text-primary transition hover:text-text-brand"
            >
              Comment
            </button>

            <button
              type="button"
              onClick={onClickShare}
              className="text-sm text-text-secondary transition hover:text-text-primary"
            >
              Share
            </button>
          </div>

          <button
            type="button"
            onClick={handleBookmark}
            className="inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-text-primary"
            aria-label={
              bookmarked
                ? "Remove Story from saved items"
                : "Save Story"
            }
          >
            <img
              src={
                bookmarked
                  ? bookmarkfill
                  : bookmarkoutline
              }
              alt=""
              aria-hidden="true"
              className="h-4 w-4"
            />

            <span className="hidden sm:inline">
              {bookmarked
                ? "Saved"
                : "Save"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default React.memo(DashboardItem);