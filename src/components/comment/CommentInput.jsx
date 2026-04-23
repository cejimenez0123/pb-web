
// import { useSelector, useDispatch } from "react-redux";
// import { useState } from "react";
// import { createComment, updateComment } from "../../actions/PageActions.jsx";
// import { useDialog } from "../../domain/usecases/useDialog.jsx";

// export default function CommentInput({ parentComment, page, defaultComment, handleClose }) {
//   const dispatch = useDispatch();
//   const currentProfile = useSelector((state) => state.users.currentProfile);
//   const [commentInput, setComment] = useState(defaultComment ? defaultComment.content : "");
// const {resetDialog}=useDialog()
//   const saveComment = (e) => {
//     e.preventDefault();
//     if (!currentProfile) return;
//     const params = {
//       profile: currentProfile,
//       text: commentInput,
//       storyId: page.id,
//       parentCommentId: parentComment?.id || null,
//     };
//     dispatch(createComment(params)).then(() => {
//       setComment("");
//       resetDialog()
//     });
//   };

//   const clickUpdateComment = () => {
//     dispatch(updateComment({ newText: commentInput, comment: defaultComment }));
//     resetDialog()
//   };

//   return (
//     <div className="p-2 w-[100%] h-[100%]">
//       <label className="text-emerald-800 font-medium mb-1 block">Your Note:</label>
//       <textarea
//         placeholder="Write your comment here..."
//         className="w-full p-3 w-[100%] min-h-[8rem] rounded-xl bg-slate-50 text-emerald-800 border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300"
//         value={commentInput}
//         onChange={(e) => setComment(e.target.value)}
//       />
//       <div className="flex justify-end mt-2 gap-2">
//         {currentProfile && (
//           defaultComment ? (
//             <button
//               onClick={clickUpdateComment}
//               className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition"
//             >
//               Update
//             </button>
//           ) : (
//             <button
//               onClick={saveComment}
//               className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition"
//             >
//               {parentComment ? "Reply" : "Save"}
//             </button>
//           )
//         )}
//       </div>
//     </div>
//   );
// }
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { createComment, updateComment } from "../../actions/PageActions.jsx";
import { useDialog } from "../../domain/usecases/useDialog.jsx";

export default function CommentInput({ parentComment, page, defaultComment, anchorText, handleClose }) {
  const dispatch = useDispatch();
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const [commentInput, setComment] = useState(defaultComment ? defaultComment.content : "");
  const { resetDialog } = useDialog();

  const saveComment = (e) => {
    e.preventDefault();
    if (!currentProfile) return;
    dispatch(createComment({
      profile:         currentProfile,
      text:            commentInput,
      storyId:         page.id,
      parentCommentId: parentComment?.id || null,
      anchorText:      anchorText || "",   // ← non-nullable in schema
    })).then(() => {
      setComment("");
      resetDialog();
    });
  };                                       // ← was missing, breaking everything below

  const clickUpdateComment = () => {
    dispatch(updateComment({ newText: commentInput, comment: defaultComment }));
    resetDialog();
  };

  return (
    <div className="p-4 w-full h-full flex flex-col gap-3">
      {anchorText && (
        <blockquote className="border-l-2 border-emerald-400 pl-3 text-sm text-slate-500 dark:text-slate-400 italic">
          "{anchorText}"
        </blockquote>
      )}
      <label className="text-emerald-800 dark:text-emerald-300 font-medium text-sm block">
        {parentComment ? "Your Reply:" : "Your Note:"}
      </label>
      <textarea
        placeholder={parentComment ? "Write your reply here…" : "Write your comment here…"}
        className={[
          "w-full p-3 min-h-[8rem] rounded-xl resize-none",
          "bg-slate-50 dark:bg-slate-800",
          "text-emerald-800 dark:text-emerald-200",
          "border border-emerald-100 dark:border-emerald-700",
          "focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-600",
          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
          "transition",
        ].join(" ")}
        value={commentInput}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="flex justify-end mt-1 gap-2">
        {handleClose && (
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-full text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
          >
            Cancel
          </button>
        )}
        {currentProfile && (
          defaultComment ? (
            <button
              onClick={clickUpdateComment}
              disabled={!commentInput.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm px-4 py-2 rounded-full transition"
            >
              Update
            </button>
          ) : (
            <button
              onClick={saveComment}
              disabled={!commentInput.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm px-4 py-2 rounded-full transition"
            >
              {parentComment ? "Reply" : "Save"}
            </button>
          )
        )}
      </div>
    </div>
  );
}