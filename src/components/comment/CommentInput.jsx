
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { createComment, updateComment } from "../../actions/PageActions.jsx";
import { useDialog } from "../../domain/usecases/useDialog.jsx";

export default function CommentInput({ parentComment, page, defaultComment, handleClose }) {
  const dispatch = useDispatch();
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const [commentInput, setComment] = useState(defaultComment ? defaultComment.content : "");
const {resetDialog}=useDialog()
  const saveComment = (e) => {
    e.preventDefault();
    if (!currentProfile) return;
    const params = {
      profile: currentProfile,
      text: commentInput,
      storyId: page.id,
      parentCommentId: parentComment?.id || null,
    };
    dispatch(createComment(params)).then(() => {
      setComment("");
      resetDialog()
    });
  };

  const clickUpdateComment = () => {
    dispatch(updateComment({ newText: commentInput, comment: defaultComment }));
    resetDialog()
  };

  return (
    <div className="p-2 w-[100%] h-[100%]">
      <label className="text-emerald-800 font-medium mb-1 block">Your Note:</label>
      <textarea
        placeholder="Write your comment here..."
        className="w-full p-3 w-[100%] min-h-[8rem] rounded-xl bg-slate-50 text-emerald-800 border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        value={commentInput}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="flex justify-end mt-2 gap-2">
        {currentProfile && (
          defaultComment ? (
            <button
              onClick={clickUpdateComment}
              className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition"
            >
              Update
            </button>
          ) : (
            <button
              onClick={saveComment}
              className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition"
            >
              {parentComment ? "Reply" : "Save"}
            </button>
          )
        )}
      </div>
    </div>
  );
}