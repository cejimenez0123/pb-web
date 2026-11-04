
// import { useSelector, useDispatch } from "react-redux";
// import { useState } from "react";
// import { createComment, updateComment } from "../../actions/PageActions.jsx";
// import { useDialog } from "../../domain/usecases/useDialog.jsx";

// export default function CommentInput({ parentComment, page, defaultComment, anchorText, handleClose }) {
//   const dispatch = useDispatch();
//   const currentProfile = useSelector((state) => state.users.currentProfile);
//   const [commentInput, setComment] = useState(defaultComment ? defaultComment.content : "");
//   const { resetDialog } = useDialog();

//   const saveComment = (e) => {
//     e.preventDefault();
//     if (!currentProfile) return;
//     dispatch(createComment({
//       profile:         currentProfile,
//       text:            commentInput,
//       storyId:         page.id,
//       parentCommentId: parentComment?.id || null,
//       anchorText:      anchorText || "",   // ← non-nullable in schema
//     })).then(() => {
//       setComment("");
//       resetDialog();
//     });
//   };                                       // ← was missing, breaking everything below

//   const clickUpdateComment = () => {
//     dispatch(updateComment({ newText: commentInput, comment: defaultComment }));
//     resetDialog();
//   };

//   return (
//     <div className="p-4 w-full h-full flex flex-col gap-3">
//       {anchorText && (
//         <blockquote className="border-l-2 border-emerald-400 pl-3 text-sm text-slate-500 dark:text-slate-400 italic">
//           "{anchorText}"
//         </blockquote>
//       )}
//       <label className="text-emerald-800 dark:text-emerald-300 font-medium text-sm block">
//         {parentComment ? "Your Reply:" : "Your Note:"}
//       </label>
//       <textarea
//         placeholder={parentComment ? "Write your reply here…" : "Write your comment here…"}
//         className={[
//           "w-full p-3 min-h-[8rem] rounded-xl resize-none",
//           "bg-slate-50 dark:bg-slate-800",
//           "text-emerald-800 dark:text-emerald-200",
//           "border border-emerald-100 dark:border-emerald-700",
//           "focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-600",
//           "placeholder:text-slate-400 dark:placeholder:text-slate-500",
//           "transition",
//         ].join(" ")}
//         value={commentInput}
//         onChange={(e) => setComment(e.target.value)}
//       />
//       <div className="flex justify-end mt-1 gap-2">
//         {handleClose && (
//           <button
//             onClick={handleClose}
//             className="px-4 py-2 rounded-full text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
//           >
//             Cancel
//           </button>
//         )}
//         {currentProfile && (
//           defaultComment ? (
//             <button
//               onClick={clickUpdateComment}
//               disabled={!commentInput.trim()}
//               className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm px-4 py-2 rounded-full transition"
//             >
//               Update
//             </button>
//           ) : (
//             <button
//               onClick={saveComment}
//               disabled={!commentInput.trim()}
//               className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm px-4 py-2 rounded-full transition"
//             >
//               {parentComment ? "Reply" : "Save"}
//             </button>
//           )
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  createComment,
  updateComment,
} from "../../actions/PageActions.jsx";

import { useDialog } from "../../domain/usecases/useDialog.jsx";

export default function CommentInput({
  parentComment,
  page,
  defaultComment,
  anchorText,
  handleClose,
}) {
  const dispatch = useDispatch();
  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const { resetDialog } = useDialog();

  const [commentInput, setCommentInput] = useState(
    defaultComment?.content || ""
  );
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(defaultComment);
  const isReply = Boolean(parentComment);
  const hasContent = Boolean(commentInput.trim());

  useEffect(() => {
    setCommentInput(defaultComment?.content || "");
  }, [defaultComment?.id, defaultComment?.content]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentProfile || !hasContent || saving) return;

    setSaving(true);

    try {
      const action = isEditing
        ? updateComment({
            newText: commentInput.trim(),
            comment: defaultComment,
          })
        : createComment({
            profile: currentProfile,
            text: commentInput.trim(),
            storyId: page.id,
            parentCommentId: parentComment?.id || null,
            anchorText: anchorText || "",
          });

      const result = await dispatch(action);

      // Redux Toolkit async thunks return rejected actions
      // rather than throwing unless unwrap() is used.
      if (result?.error) {
        return;
      }

      if (!isEditing) {
        setCommentInput("");
      }

      resetDialog();
    } catch (error) {
      console.error("Unable to save comment:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full w-full flex-col gap-4 p-4"
    >
      {anchorText && (
        <blockquote className="
          rounded-r-lg
          border-l-2 border-plumb-mint
          bg-plumb-mint/5
          px-3 py-2
          text-sm leading-relaxed
          italic text-plumb-muted
          dark:bg-plumb-mint/10
          dark:text-darkMuted
        ">
          {anchorText}
        </blockquote>
      )}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="comment-input"
          className="
            text-sm font-medium
            text-plumb-ink
            dark:text-darkText
          "
        >
          {isEditing
            ? "Edit your comment"
            : isReply
              ? "Your reply"
              : "Your note"}
        </label>

        <textarea
          id="comment-input"
          autoFocus
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder={
            isReply
              ? "Write your reply..."
              : "Write your comment..."
          }
          rows={5}
          className="
          dark:text-plumb-darkText
            min-h-32 w-full resize-y
            rounded-xl border
            border-plumb-mint/25
            bg-plumb-surface
            p-3
            text-sm leading-relaxed
            text-plumb-ink
            placeholder:text-plumb-muted/70
            transition-colors
            focus:border-plumb-mint
            focus:outline-none
            focus:ring-2 focus:ring-plumb-mint/20
            dark:border-plumb-mint/30
            dark:bg-plumb-dark-surface
            dark:text-darkText
            dark:placeholder:text-plumb-darkText/50
            dark:focus:border-plumb-mint
            dark:focus:ring-plumb-mint/20
          "
        />
      </div>

      <div className="mt-auto flex items-center justify-end gap-2 pt-1">
        {handleClose && (
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="
              rounded-full px-4 py-2
              text-sm font-medium
              text-plumb-muted
              transition-colors
              hover:bg-plumb-mint/10
              hover:text-plumb-ink
              disabled:opacity-40
              dark:text-darkMuted
              dark:hover:text-darkText
            "
          >
            Cancel
          </button>
        )}

        {currentProfile && (
          <button
            type="submit"
            disabled={!hasContent || saving}
            className="
              inline-flex min-h-10
              items-center justify-center
              rounded-full
              border border-plumb-mint
              bg-plumb-mint px-5 py-2
              text-sm font-medium text-white
              transition-colors
              hover:bg-mintHover
              disabled:cursor-not-allowed
              disabled:opacity-40
              dark:border-current
            "
          >
            {saving
              ? "Saving..."
              : isEditing
                ? "Update"
                : isReply
                  ? "Reply"
                  : "Save"}
          </button>
        )}
      </div>
    </form>
  );
}
