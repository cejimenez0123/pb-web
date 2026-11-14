
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIonRouter } from "@ionic/react";
import { Preferences } from "@capacitor/preferences";

import {
  deleteStoryFromCollection,
  addStoryListToCollection,
} from "../../actions/CollectionActions";

import checkResult from "../../core/checkResult";
import Enviroment from "../../core/Enviroment";
import Paths from "../../core/paths";
import { useDialog } from "../../domain/usecases/useDialog";
import computePermissions from "../../core/compusePermissions";
import { useAlert } from "../../core/useAlert.jsx";
import AlertType from "../../core/AlertType.js";

import ReportContentDialog from "../auth/ReportProfileDialog.jsx";

const EMPTY_ARRAY = [];

const MENU_ITEM =
  "block w-[100%] min-w-0 border-b border-base-content/10 bg-cream py-3 text-left dark:bg-base-bgDark";

const MENU_TEXT =
  "px-4 text-base text-soft dark:text-cream";

function getProfileCollections(profile) {
  const collections = profile?.profileToCollections;

  return Array.isArray(collections)
    ? collections.flat(Infinity).filter(Boolean)
    : [];
}

function getArchiveCollection(profile) {
  const archive = getProfileCollections(profile).find(
    (item) =>
      item?.type === "archive" &&
      (item.collectionId || item.collection?.id)
  );

  if (!archive) return null;

  return {
    id: archive.collectionId || archive.collection?.id,
    collection: archive.collection || null,
  };
}

function findArchiveBookmark(profile, storyId) {
  if (!storyId) return null;

  const archive = getArchiveCollection(profile);

  const storyLink = archive?.collection?.storyIdList?.find(
    (item) => String(item?.storyId) === String(storyId)
  );

  if (!storyLink) return null;

  return {
    ...storyLink,
    stId: storyLink.id || storyLink._id,
    collectionId: archive.id,
  };
}

/*
 * Find the StoryToCollection relationship in the add response,
 * without assuming a particular response nesting structure.
 */
function findStoryLinkInResponse(value, storyId, seen = new Set()) {
  if (!value || typeof value !== "object" || seen.has(value)) {
    return null;
  }

  seen.add(value);

  if (
    !Array.isArray(value) &&
    String(value.storyId) === String(storyId) &&
    (value.id || value._id || value.stId)
  ) {
    return {
      ...value,
      stId: value.stId || value.id || value._id,
    };
  }

  const values = Array.isArray(value)
    ? value
    : Object.values(value);

  for (const item of values) {
    const found = findStoryLinkInResponse(item, storyId, seen);

    if (found) return found;
  }

  return null;
}

export default function ShareList({
  page,
  profile,
  authorProfile,
}) {
  const dispatch = useDispatch();
  const router = useIonRouter();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const { closeDialog } = useDialog();
  const { showAlert } = useAlert();

  const [bookmarkPending, setBookmarkPending] =
    useState(false);

  const [savedOverride, setSavedOverride] =
    useState(null);

  const [isReportDialogOpen, setReportDialogOpen] =
    useState(false);

  const [isBlockDialogOpen, setBlockDialogOpen] =
    useState(false);

  /*
   * Reset local feedback when the displayed story
   * or logged-in profile changes.
   */

useEffect(() => {
  setSavedOverride(null);
  setBookmarkPending(false);
}, [page?.id, currentProfile?.id]);

const archiveBookmark = findArchiveBookmark(
  currentProfile,
  page?.id
);

const activeBookmark =
  savedOverride !== null
    ? savedOverride
    : archiveBookmark;

const isSaved = Boolean(activeBookmark);
  /*
   * Permissions.
   */
  const { canEdit } = computePermissions(
    page,
    currentProfile,
    {
      getAccessList: (story) =>
        story.betaReaders ?? [],

      getAccessRole: (entry) =>
        entry.permission,

      isPrivate: (story) =>
        story.isPrivate,

      isOpen: () => false,

      canWriteRoles: ["commenter", "editor"],
      canEditRoles: ["editor"],
    }
  );

  /*
   * Close menu before navigation.
   */
  const closeAndNavigate = (path) => {
    closeDialog();
    router.push(path, "forward");
  };

  /*
   * Save / remove from Home.
   */

const handleBookmark = async () => {
  if (bookmarkPending || !page?.id) return;

  if (!currentProfile?.id) {
    showAlert({
      message: "Please sign in to save stories.",
      type: AlertType.success,
    });
    return;
  }

  setBookmarkPending(true);

  const previousBookmark = activeBookmark;

  try {
    if (previousBookmark) {
      const stId =
        previousBookmark.stId ||
        previousBookmark.id ||
        previousBookmark._id;

      if (!stId) {
        throw new Error(
          "The Archive bookmark relationship could not be found. Please refresh and try again."
        );
      }

      const result = await dispatch(
        deleteStoryFromCollection({ stId })
      );

      checkResult(
        result,
        () => {
          setSavedOverride(false);

          showAlert({
            message: "Removed from Archive.",
            type: AlertType.success,
          });
        },
        (error) => {
          setSavedOverride(previousBookmark);

          showAlert({
            message:
              error?.message || "Couldn't remove this story.",
            type: AlertType.error,
          });
        }
      );
    } else {
      const archive = getArchiveCollection(currentProfile);

      if (!archive?.id) {
        throw new Error("Your Archive collection isn't available.");
      }

      const result = await dispatch(
        addStoryListToCollection({
          id: archive.id,
          list: [page],
          profile: currentProfile,
        })
      );

      checkResult(
        result,
        (payload) => {
          const addedLink = findStoryLinkInResponse(
            payload,
            page.id
          );

          setSavedOverride({
            ...(addedLink || {}),
            storyId: page.id,
            collectionId: archive.id,
          });

          showAlert({
            message: "Saved to Archive.",
            type: AlertType.success,
          });
        },
        (error) => {
          setSavedOverride(previousBookmark);

          showAlert({
            message:
              error?.message || "Couldn't save this story.",
            type: AlertType.error,
          });
        }
      );
    }
  } catch (error) {
    setSavedOverride(previousBookmark);

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
   * Copy share link.
   */
  const copyShareLink = async () => {
    if (!page?.id) return;

    const url =
      Enviroment.domain +
      Paths.page.createRoute(page.id);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        throw new Error("Clipboard unavailable.");
      }

      closeDialog();

      showAlert({
        message: "Link copied.",
        type: AlertType.success,
      });
    } catch (error) {
      showAlert({
        message: "Couldn't copy the link.",
        type: AlertType.error,
      });
    }
  };

  /*
   * Add story to another collection.
   */
  const handleAddToCollection = async () => {
    if (!currentProfile?.id) {
      showAlert({
        message: "Please sign in.",
        type: AlertType.success,
      });

      return;
    }

    try {
      const token = await Preferences.get({
        key: "token",
      });

      if (!token.value) {
        showAlert({
          message: "Please sign in.",
          type: AlertType.success,
        });

        return;
      }

      closeAndNavigate(
        Paths.addStoryToCollection.story(page.id)
      );
    } catch (error) {
      showAlert({
        message: "Unable to verify your session.",
        type: AlertType.error,
      });
    }
  };

  const getShareSource = () => {
    const pathname =
      router.routeInfo?.pathname || "";

    if (pathname.startsWith("/profile")) {
      return "profile_page";
    }

    if (pathname.startsWith("/dashboard")) {
      return "dashboard";
    }

    if (pathname.startsWith("/collection")) {
      return "collection";
    }

    if (pathname.startsWith("/discovery")) {
      return "discovery";
    }

    return "unknown";
  };

  return (
    <>
    <div className="flex w-[100%] min-w-[240px] flex-col overflow-hidden bg-cream dark:bg-base-bgDark">
      {/* <div className="flex flex-col overflow-hidden bg-cream dark:bg-base-bgDark"> */}

        {/* Add to Collection */}
        <button
          type="button"
          className={MENU_ITEM}
          onClick={handleAddToCollection}
        >
          <h5 className={MENU_TEXT}>
            Add to Collection
          </h5>
        </button>

        {/* Edit */}
        {canEdit && (
          <button
            type="button"
            className={MENU_ITEM}
            onClick={() =>
              closeAndNavigate(
                Paths.editPage.createRoute(
                  page.id,
                  page.type
                )
              )
            }
          >
            <h5 className={MENU_TEXT}>
              Edit
            </h5>
          </button>
        )}

        {/* Copy Link */}
        <button
          type="button"
          className={MENU_ITEM}
          onClick={copyShareLink}
        >
          <h5 className={MENU_TEXT}>
            Copy Share Link
          </h5>
        </button>

        {/* Save to Home */}
      {/* Save to Archive */}
{currentProfile?.id && (
  <button
    type="button"
    disabled={bookmarkPending}
    onClick={handleBookmark}
    className={`${MENU_ITEM} disabled:opacity-50`}
  >
    <div className="flex w-[100%] items-center justify-between px-4">
      <h5 className="text-base text-soft dark:text-cream">
        {bookmarkPending
          ? "Saving..."
          : isSaved
            ? "Remove from Archive"
            : "Save to Archive"}
      </h5>

      <span
        className="text-soft my-auto dark:text-cream"
        aria-hidden="true"
      >
        {isSaved ? "✓" : "+"}
      </span>
    </div>
  </button>
)}
        {/* Report and Block */}
        {!canEdit && (
          <>
            <button
              type="button"
              className={MENU_ITEM}
              onClick={() => {
                if (!currentProfile?.id) {
                  showAlert({
                    message: "Please sign in.",
                    type: AlertType.success,
                  });

                  return;
                }

                setReportDialogOpen(true);
              }}
            >
              <h5 className={MENU_TEXT}>
                Report
              </h5>
            </button>

            <button
              type="button"
              className={MENU_ITEM}
              onClick={() => {
                if (!currentProfile?.id) {
                  showAlert({
                    message: "Please sign in.",
                    type: AlertType.success,
                  });

                  return;
                }

                setBlockDialogOpen(true);
              }}
            >
              <h5 className={`${MENU_TEXT} text-red-600`}>
                Block user
              </h5>
            </button>
          </>
        )}
      </div>

      {/* Report */}
      {authorProfile && (
        <ReportContentDialog
          contentType="profile"
          contentId={profile?.id}
          reportedProfileId={authorProfile.id}
          mode="report"
          isOpen={isReportDialogOpen}
          onClose={() => setReportDialogOpen(false)}
          onSuccess={() => {
            setReportDialogOpen(false);

            showAlert({
              message: "Report submitted.",
              type: AlertType.success,
            });
          }}
        />
      )}

      {/* Block */}
      {authorProfile && (
        <ReportContentDialog
          contentType="profile"
          contentId={profile?.id}
          reportedProfileId={authorProfile.id}
          mode="block"
          isOpen={isBlockDialogOpen}
          onClose={() => setBlockDialogOpen(false)}
          onSuccess={() => {
            setBlockDialogOpen(false);

            showAlert({
              message: "User blocked.",
              type: AlertType.success,
            });
          }}
        />
      )}
    </>
  );
}
