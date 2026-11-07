
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
