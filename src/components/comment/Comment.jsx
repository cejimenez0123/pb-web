
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { IonImg, useIonRouter } from "@ionic/react";

import ProfileCircle from "../profile/ProfileCircle.jsx";
import CommentInput from "./CommentInput";
import CommentThread from "./CommentThread";

import horiz from "../../images/icons/more_vert.svg";

import {
  deleteComment,
  promoteCommentToStory,
} from "../../actions/PageActions.jsx";

import {
  createHashtagComment,
  deleteHashtagComment,
} from "../../actions/HashtagActions.js";

import {
  removeContentByProfileId,
} from "../../actions/ModerationAcitons.jsx";

import checkResult from "../../core/checkResult.js";
import { useDialog } from "../../domain/usecases/useDialog.jsx";
import { useAlert } from "../../core/useAlert.jsx";

import Paths from "../../core/paths.js";
import AlertType from "../../core/AlertType.js";

import ReportContentDialog from "../auth/ReportProfileDialog.jsx";

import styles from "../../styles/style";

const INLINE_REPLY_DEPTH = 3;

export default function Comment({
  page,
  comment,
  level = 0,
}) {
  const dispatch = useDispatch();
  const router = useIonRouter();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const hashtags = useSelector(
    (state) => state.hashtags.profileHashtagComments ?? []
  );

  const { showAlert } = useAlert();

  const {
    openDialog,
    closeDialog,
    resetDialog,
  } = useDialog();

  const [isReportDialogOpen, setReportDialogOpen] = useState(false);
  const [isBlockDialogOpen, setBlockDialogOpen] = useState(false);
  const [isHelpful, setIsHelpful] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const isSelf =
    Boolean(currentProfile?.id) &&
    currentProfile.id === comment?.profileId;

  // Gather replies from both nested and normalized comment data.
  const branches = useSelector((state) => {
    const storyComments =
      state.comments.byStory?.[page?.id] ?? [];

    const parent = storyComments.find(
      (item) => item.id === comment?.id
    );

    const fromChildren = parent?.children ?? comment?.children ?? [];

    const fromFlat = storyComments.filter(
      (item) => item.parentId === comment?.id
    );

    const seen = new Set();

    return [...fromChildren, ...fromFlat].filter((item) => {
      if (!item?.id || seen.has(item.id)) return false;

      seen.add(item.id);
      return true;
    });
  });

  useEffect(() => {
    if (!comment?.id) {
      setIsHelpful(null);
      return;
    }

    const helpful = hashtags.find(
      (item) =>
        item.commentId === comment.id &&
        item.hashtag?.name === "helpful"
    );

    setIsHelpful(helpful || null);
  }, [hashtags, comment?.id]);

  if (!comment) return null;

  const handleOpenReply = () => {
    openDialog({
      title: "Reply",
      height: 60,
      text: (
        <CommentInput
          page={page}
          parentComment={comment}
          handleClose={closeDialog}
        />
      ),
      disagreeText: "Close",
      disagree: closeDialog,
    });
  };

  const handleEdit = () => {
    openDialog({
      title: "Edit comment",
      height: 60,
      text: (
        <CommentInput
          page={page}
          defaultComment={comment}
          anchorText={comment.anchorText || null}
          handleClose={closeDialog}
        />
      ),
      disagreeText: "Close",
      disagree: closeDialog,
    });
  };

  const handleDelete = () => {
    setIsDeleted(true);

    setTimeout(() => {
      dispatch(deleteComment({ comment }));
    }, 300);
  };

  const handleMarkHelpful = () => {
    if (!currentProfile) return;

    dispatch(
      createHashtagComment({
        name: "helpful",
        profileId: currentProfile.id,
        commentId: comment.id,
      })
    ).then((result) =>
      checkResult(
        result,
        (payload) => setIsHelpful(payload.hashtag),
        (error) =>
          showAlert({
            message: error?.message || "Unable to mark as helpful.",
            type: AlertType.error,
          })
      )
    );
  };

  const handleUnmarkHelpful = () => {
    if (!isHelpful?.id) return;

    dispatch(
      deleteHashtagComment({
        hashtagCommentId: isHelpful.id,
      })
    ).then((result) =>
      checkResult(
        result,
        () => setIsHelpful(null),
        (error) =>
          showAlert({
            message: error?.message || "Unable to update this comment.",
            type: AlertType.error,
          })
      )
    );
  };

  // Open a deeper branch as its own conversation.
  // The selected comment remains visible as context.
  const handleSeeReplies = () => {
    openDialog({
      title: "Conversation",
      height: 85,
      text: (
        <div className="flex min-w-0 flex-col gap-4 overflow-y-auto px-3 py-3">
          <div className={styles.hash.conversationContext}>
            <span className={styles.hash.conversationLabel}>
              Conversation started here
            </span>

            <div className="flex items-center gap-2">
              <ProfileCircle
                profile={comment.profile}
                color="emerald-700 dark:text-cream"
              />
            </div>

            {comment.anchorText && (
              <blockquote className={styles.hash.anchor}>
                "{comment.anchorText}"
              </blockquote>
            )}

            <p className={styles.hash.body}>
              {comment.content}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className={styles.hash.conversationLabel}>
              {branches.length}{" "}
              {branches.length === 1 ? "reply" : "replies"}
            </span>

            <button
              type="button"
              onClick={handleOpenReply}
              className={styles.hash.action}
            >
              <icon name="reply" size="xs" />
              Reply
            </button>
          </div>

          <CommentThread
            page={page}
            comments={branches}
            level={0}
          />
        </div>
      ),
      disagreeText: "Close",
      disagree: closeDialog,
    });
  };

  const handlePromoteToStory = () => {
    const saveAs = (status) => {
      dispatch(
        promoteCommentToStory({
          id: comment.id,
          status,
        })
      ).then((result) =>
        checkResult(
          result,
          ({ story }) => {
            router.push(
              Paths.editPage.createRoute(story.id, story.type)
            );
            closeDialog();
          },
          (error) =>
            showAlert({
              message: error?.message || "Unable to save this comment.",
              type: AlertType.error,
            })
        )
      );
    };

    openDialog({
      title: "Save as story",
      height: 40,
      text: (
        <div className="flex flex-col gap-3 p-4">
          <p className="text-sm leading-relaxed text-plumb-muted dark:text-darkMuted">
            This comment will become a draft story in your profile.
            You can continue shaping it there.
          </p>

          <button
            type="button"
            className={styles.hash.helpful}
            onClick={() => saveAs("draft")}
          >
            Save as draft
          </button>

          <button
            type="button"
            className={styles.hash.action}
            onClick={() => saveAs("fragment")}
          >
            Save as fragment
          </button>
        </div>
      ),
      disagreeText: "Cancel",
      disagree: closeDialog,
    });
  };

  const handleReport = () => setReportDialogOpen(true);
  const handleBlockUser = () => setBlockDialogOpen(true);

  const CommentDropdown = () => (
    <div className="dropdown dropdown-left">
      <button
        type="button"
        tabIndex={0}
        aria-label="Comment options"
        className="
          flex h-9 w-9 items-center justify-center
          rounded-full
          text-plumb-muted
          transition-colors
          hover:bg-plumb-mint/10
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-plumb-mint
          dark:text-darkMuted
          dark:hover:bg-plumb-mint/15
        "
      >
        <IonImg
          src={horiz}
          className="max-h-5 max-w-5"
        />
      </button>

      <ul
        tabIndex={0}
        className={styles.hash.dropdown}
      >
        {isSelf ? (
          <>
            <li>
              <button
                type="button"
                className={styles.hash.dropdownItem}
                onClick={handlePromoteToStory}
              >
                Save as story
              </button>
            </li>

            <li>
              <button
                type="button"
                className={styles.hash.dropdownItem}
                onClick={handleEdit}
              >
                Edit
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`${styles.hash.dropdownItem} text-red-600 dark:text-red-400`}
                onClick={handleDelete}
              >
                Delete
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <button
                type="button"
                className={styles.hash.dropdownItem}
                onClick={handleReport}
              >
                Report
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`${styles.hash.dropdownItem} text-red-600 dark:text-red-400`}
                onClick={handleBlockUser}
              >
                Block user
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );

  return (
    <div
      className={`
        min-w-0 overflow-hidden
        transition-all duration-300 ease-in-out
        ${
          isDeleted
            ? styles.hash.deleted
            : styles.hash.visible
        }
      `}
    >
      <div className={styles.hash.card}>
        {/* Header */}
        <div className={styles.hash.header}>
          <ProfileCircle
            profile={comment.profile}
            color="emerald-700 dark:text-cream"
          />

          <CommentDropdown />
        </div>

        {/* Quoted passage */}
        {comment.anchorText && (
          <button
            type="button"
            className={styles.hash.anchor}
            onClick={() => {
              const mark = document.querySelector(
                `[data-comment-id="${comment.id}"]`
              );

              if (!mark) return;

              mark.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });

              mark.classList.add("annotation-mark--pulse");

              setTimeout(
                () => mark.classList.remove("annotation-mark--pulse"),
                1500
              );
            }}
          >
            ↗ "{comment.anchorText}"
          </button>
        )}

        {/* Comment body */}
        <p className={styles.hash.body}>
          {comment.content}
        </p>

        {/* Actions */}
        <div className={styles.hash.actions}>
          <button
            type="button"
            onClick={
              isHelpful
                ? handleUnmarkHelpful
                : handleMarkHelpful
            }
            disabled={!currentProfile}
            className={styles.hash.helpful}
          >
            {isHelpful
              ? "👍 Glad it helped!"
              : "Was this helpful?"}
          </button>

          <button
            type="button"
            className={styles.hash.action}
            onClick={handleOpenReply}
          >
            <icon name="reply" size="xs" />
            Reply
          </button>
        </div>
      </div>

      {/* Inline replies through level 4.
          Deeper replies become a separate conversation. */}
      {branches.length > 0 && (
        level < INLINE_REPLY_DEPTH ? (
          <div className={styles.hash.nestedReplies}>
            <CommentThread
              page={page}
              comments={branches}
              level={level}
            />
          </div>
        ) : (
          <div className="mt-2 pl-2">
            <button
              type="button"
              className={styles.hash.viewReplies}
              onClick={handleSeeReplies}
            >
              <icon name="messages-square" size="sm" />

              View conversation

              <span className="text-xs opacity-70">
                ({branches.length}{" "}
                {branches.length === 1 ? "reply" : "replies"})
              </span>

              <icon name="arrow-up-right" size="xs" />
            </button>
          </div>
        )
      )}

      {/* Moderation dialogs */}
      {comment.profile && (
        <ReportContentDialog
          contentType="comment"
          contentId={comment.id}
          mode="report"
          reportedProfileId={comment.profile.id}
          isOpen={isReportDialogOpen}
          onClose={() => setReportDialogOpen(false)}
          onSuccess={() => {
            dispatch(
              removeContentByProfileId({
                profileID: comment.profile.id,
              })
            );
          }}
        />
      )}

      {comment.profile && (
        <ReportContentDialog
          contentType="profile"
          mode="block"
          contentId={comment.profile.id}
          reportedProfileId={comment.profile.id}
          isOpen={isBlockDialogOpen}
          onClose={() => setBlockDialogOpen(false)}
          onSuccess={() => {
            dispatch(
              removeContentByProfileId({
                profileID: comment.profile.id,
              })
            );
          }}
        />
      )}
    </div>
  );
}

// import { useSelector, useDispatch } from "react-redux";
// import { useState, useEffect, useContext } from "react";
// import { IonImg, useIonRouter } from "@ionic/react";
// import Context from "../../context.jsx";
// import ProfileCircle from "../profile/ProfileCircle.jsx";
// import CommentInput from "./CommentInput";
// import CommentThread from "./CommentThread";
// import horiz from "../../images/icons/more_vert.svg";
// import { deleteComment, promoteCommentToStory } from "../../actions/PageActions.jsx";
// import { createHashtagComment, deleteHashtagComment } from "../../actions/HashtagActions.js";
// import checkResult from "../../core/checkResult.js";
// import { useDialog } from "../../domain/usecases/useDialog.jsx";
// import Paths from "../../core/paths.js";
// import {  removeContentByProfileId } from "../../actions/ModerationAcitons.jsx";
// import ReportContentDialog from "../auth/ReportProfileDialog.jsx";
// import { useAlert } from "../../core/useAlert.jsx";
// import AlertType from "../../core/AlertType.js";
// import styles from "../../styles/style.js";

// const DEEP_LEVEL = 3;

// export default function Comment({ page, comment, level = 0 }) {
//   const dispatch = useDispatch();
  
//   const {showAlert}=useAlert()
//   const currentProfile = useSelector((state) => state.users.currentProfile);
//   const [isReportDialogOpen, setReportDialogOpen] = useState(false);
// const [isBlockDialogOpen, setBlockDialogOpen] = useState(false);
//   const branches = useSelector((state) => {
//     const storyComments = state.comments.byStory?.[page?.id] ?? [];
//     const parent = storyComments.find((c) => c.id === comment.id);
//     const fromChildren = parent?.children ?? comment.children ?? [];
//     const fromFlat = storyComments.filter((c) => c.parentId === comment.id);

//     const seen = new Set();
//     return [...fromChildren, ...fromFlat].filter((c) => {
//       if (seen.has(c.id)) return false;
//       seen.add(c.id);
//       return true;
//     });
//   });


// const handleReport = () => {
//   setReportDialogOpen(true);
// };

// const handleBlockUser = () => {
//   setBlockDialogOpen(true);
// };

//   const hashtags = useSelector((state) => state.hashtags.profileHashtagComments);
//   const isSelf = currentProfile && comment ? currentProfile?.id === comment?.profileId : false;
// const router = useIonRouter()
//   const [isHelpful, setIsHelpful] = useState(null);
//   const [isDeleted, setIsDeleted] = useState(false);
//   const { openDialog, closeDialog ,resetDialog} = useDialog();

//   useEffect(() => {
//     const hs = hashtags.find(
//       (hash) => hash.commentId === comment.id && hash.hashtag.name === "helpful"
//     );
//     setIsHelpful(hs || null);
//   }, [hashtags]);

//   if (!comment) return null;

//   const handleOpenReply = () => {
//     openDialog({
//       title: "",
//       height: 60,
//       text: (
//         <CommentInput
//           page={page}
//           parentComment={comment}
//           handleClose={closeDialog}
//         />
//       ),
//       disagreeText: "Close",
//       disagree: closeDialog
//     });
//   };

//   const handleEdit = () => {
//     openDialog({
//       title: "",
//       height: 60,
//       text: (
//         <CommentInput
//           page={page}
//           defaultComment={comment}
//           anchorText={comment.anchorText || null}
//           handleClose={closeDialog}
//         />
//       ),
//       disagreeText: "Close",
//       disagree: closeDialog
//     });
//   };

//   const handleDelete = () => {
//     setIsDeleted(true);
//     setTimeout(() => {
//       dispatch(deleteComment({ comment }));
//     }, 300);
//   };

//   const handleMarkHelpful = () => {
//     if (!currentProfile) return;
//     dispatch(createHashtagComment({
//       name: "helpful",
//       profileId: currentProfile.id,
//       commentId: comment.id,
//     })).then((res) =>
//       checkResult(
//         res,
//         (payload) => setIsHelpful(payload.hashtag),
//         (err) =>showAlert({message:err.message,type:AlertType.error}) 
//       )
//     );
//   };

