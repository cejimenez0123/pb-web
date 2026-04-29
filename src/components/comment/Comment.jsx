

// import { useSelector, useDispatch } from "react-redux";
// import { useState, useEffect, useLayoutEffect, useContext } from "react";
// import { IonImg } from "@ionic/react";
// import Context from "../../context.jsx";
// import ProfileCircle from "../profile/ProfileCircle.jsx";
// import CommentInput from "./CommentInput";
// import CommentThread from "./CommentThread";
// import horiz from "../../images/icons/more_vert.svg";
// import { deleteComment } from "../../actions/PageActions.jsx";
// import { createHashtagComment, deleteHashtagComment } from "../../actions/HashtagActions.js";
// import checkResult from "../../core/checkResult.js";
// import { useDialog } from "../../domain/usecases/useDialog.jsx";

// export default function Comment({ page, comment, level = 0 }) {
//   const dispatch = useDispatch();
//   const { setError } = useContext(Context);
//   const currentProfile = useSelector((state) => state.users.currentProfile);

//   // ── Use byStory instead of flat comments array ────────────────────────────
// const allComments = useSelector((state) =>
//   state.comments.byStory?.[page?.id] ?? []
// );


//   const hashtags = useSelector((state) => state.hashtags.profileHashtagComments);
//   const isSelf = currentProfile && comment ? currentProfile?.id === comment?.profileId : false;

//  const branches = useSelector((state) => {
//   const storyComments = state.comments.byStory?.[page?.id] ?? [];
//   const parent = storyComments.find((c) => c.id === comment.id);
//   const fromChildren = parent?.children ?? comment.children ?? [];
//   const fromFlat = storyComments.filter((c) => c.parentId === comment.id);

//   const seen = new Set();
//   return [...fromChildren, ...fromFlat].filter((c) => {
//     if (seen.has(c.id)) return false;
//     seen.add(c.id);
//     return true;
//   });
// });
//   const [isHelpful, setIsHelpful] = useState(null);
//   const [isDeleted, setIsDeleted] = useState(false);
//   const { openDialog, closeDialog } = useDialog();

//   useEffect(() => {
//     const hs = hashtags.find(
//       (hash) => hash.commentId === comment.id && hash.hashtag.name === "helpful"
//     );
//     setIsHelpful(hs || null);
//   }, [hashtags]);


//   if (!comment) return null;

//   // ── Open dialog for reply ─────────────────────────────────────────────────
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
//       disagreeText: null,
//       disagree: null,
//     });
//   };

//   // ── Open dialog for edit — pass comment as defaultComment ─────────────────
//   const handleEdit = () => {
//     openDialog({
//       title: "",
//       height: 60,
//       text: (
//         <CommentInput
//           page={page}
//           defaultComment={comment}   // ← pass directly, not via state
//           anchorText={comment.anchorText || null}
//           handleClose={closeDialog}
//         />
//       ),
//       disagreeText: null,
//       disagree: null,
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
//         (err) => setError(err.message)
//       )
//     );
//   };

//   const handleUnmarkHelpful = () => {
//     if (!isHelpful?.id) return;
//     dispatch(deleteHashtagComment({ hashtagCommentId: isHelpful.id })).then(
//       (res) => checkResult(res, () => setIsHelpful(null), () => {})
//     );
//   };

//   const CommentDropdown = () => (
//     <div className="relative dropdown dropdown-left">
//       <div tabIndex={0} role="button">
//         <IonImg src={horiz} className="max-w-5 max-h-5 cursor-pointer" />
//       </div>
//       <ul
//         tabIndex={0}
//         className="dropdown-content bg-base-bg menu text-emerald-800 rounded-box z-[1] w-52 p-2 shadow"
//       >
//         {isSelf && (
//           <>
//             <li
//               className="p-2 bg-base-bg hover:bg-sky-100 rounded cursor-pointer"
//               onClick={handleEdit}
//             >
//               Edit
//             </li>
//             <li
//               className="p-2 bg-base-bg hover:bg-sky-100 rounded cursor-pointer"
//               onClick={handleDelete}
//             >
//               Delete
//             </li>
//           </>
//         )}
//       </ul>
//     </div>
//   );

//   return (
//     <div
//       className={`transition-all duration-300 ease-in-out overflow-hidden
//         ${isDeleted ? "opacity-0 max-h-0 p-0 my-0" : "opacity-100 max-h-[1000px]"}`}
//       style={{
//         marginLeft: `${level * 1}px`,
//         borderLeft: `4px solid ${
//           level === 0 ? "#10B981" : `hsl(${150 + level * 10}, 70%, 50%)`
//         }`,
//         borderRadius: "1rem",
//       }}
//     >
//       <div className="bg-base-bg rounded-2xl shadow-lg p-5 flex flex-col gap-4 relative border border-gray-100">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <ProfileCircle profile={comment.profile} color="emerald-700 dark:text-cream" />
//           {isSelf && <CommentDropdown />}
//         </div>

//         {/* Anchor text — tap to scroll to highlight in text ───────────────── */}
//         {comment.anchorText && (
//           <blockquote
//             className="border-l-2 border-emerald-400 pl-2 text-xs text-slate-500 dark:text-slate-400 italic truncate cursor-pointer hover:text-emerald-600 transition-colors"
//             onClick={() => {
//               const mark = document.querySelector(
//                 `[data-comment-id="${comment.id}"]`
//               );
//               if (!mark) return;
//               mark.scrollIntoView({ behavior: "smooth", block: "center" });
//               mark.classList.add("annotation-mark--pulse");
//               setTimeout(() => mark.classList.remove("annotation-mark--pulse"), 1500);
//             }}
//           >
//             ↑ "{comment.anchorText}"
//           </blockquote>
//         )}

//         {/* Body */}
//         <div className="flex items-start justify-between">
//           <p className="text-emerald-800 dark:text-cream text-sm text-left sm:text-base break-words">
//             {comment.content}
//           </p>
//         </div>

//         {/* Actions */}
//         <div className="flex items-center gap-4 mt-2 text-sm">
//           {isHelpful ? (
//             <button
//               onClick={handleUnmarkHelpful}
//               className="px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold hover:bg-emerald-200 transition"
//             >
//               👍 Glad it helped!
//             </button>
//           ) : (
//             <button
//               onClick={handleMarkHelpful}
//               className="px-4 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold hover:bg-emerald-100 transition"
//             >
//               Was this helpful?
//             </button>
//           )}

//           <button
//             className="text-emerald-800 rounded-full font-medium hover:underline"
//             onClick={handleOpenReply}
//           >
//             Reply
//           </button>
//         </div>
//       </div>

//       {/* Nested replies */}
//       <CommentThread page={page} comments={branches} level={level + 1} />
//     </div>
//   );
// }
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useContext } from "react";
import { IonImg } from "@ionic/react";
import Context from "../../context.jsx";
import ProfileCircle from "../profile/ProfileCircle.jsx";
import CommentInput from "./CommentInput";
import CommentThread from "./CommentThread";
import horiz from "../../images/icons/more_vert.svg";
import { deleteComment } from "../../actions/PageActions.jsx";
import { createHashtagComment, deleteHashtagComment } from "../../actions/HashtagActions.js";
import checkResult from "../../core/checkResult.js";
import { useDialog } from "../../domain/usecases/useDialog.jsx";

const DEEP_LEVEL = 4;

export default function Comment({ page, comment, level = 0 }) {
  const dispatch = useDispatch();
  const { setError } = useContext(Context);
  const currentProfile = useSelector((state) => state.users.currentProfile);

  const branches = useSelector((state) => {
    const storyComments = state.comments.byStory?.[page?.id] ?? [];
    const parent = storyComments.find((c) => c.id === comment.id);
    const fromChildren = parent?.children ?? comment.children ?? [];
    const fromFlat = storyComments.filter((c) => c.parentId === comment.id);

    const seen = new Set();
    return [...fromChildren, ...fromFlat].filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  });

  const hashtags = useSelector((state) => state.hashtags.profileHashtagComments);
  const isSelf = currentProfile && comment ? currentProfile?.id === comment?.profileId : false;

  const [isHelpful, setIsHelpful] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const { openDialog, closeDialog } = useDialog();

  useEffect(() => {
    const hs = hashtags.find(
      (hash) => hash.commentId === comment.id && hash.hashtag.name === "helpful"
    );
    setIsHelpful(hs || null);
  }, [hashtags]);

  if (!comment) return null;

  const handleOpenReply = () => {
    openDialog({
      title: "",
      height: 60,
      text: (
        <CommentInput
          page={page}
          parentComment={comment}
          handleClose={closeDialog}
        />
      ),
      disagreeText: null,
      disagree: null,
    });
  };

  const handleEdit = () => {
    openDialog({
      title: "",
      height: 60,
      text: (
        <CommentInput
          page={page}
          defaultComment={comment}
          anchorText={comment.anchorText || null}
          handleClose={closeDialog}
        />
      ),
      disagreeText: null,
      disagree: null,
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
    dispatch(createHashtagComment({
      name: "helpful",
      profileId: currentProfile.id,
      commentId: comment.id,
    })).then((res) =>
      checkResult(
        res,
        (payload) => setIsHelpful(payload.hashtag),
        (err) => setError(err.message)
      )
    );
  };

  const handleUnmarkHelpful = () => {
    if (!isHelpful?.id) return;
    dispatch(deleteHashtagComment({ hashtagCommentId: isHelpful.id })).then(
      (res) => checkResult(res, () => setIsHelpful(null), () => {})
    );
  };

  const handleSeeReplies = () => {
    openDialog({
      title: "Replies",
      height: 80,
      text: (
        <div className="overflow-y-auto px-2 py-2 flex flex-col gap-3">
          {branches.map((reply) => (
            <Comment
              key={reply.id}
              page={page}
              comment={reply}
              level={0}
            />
          ))}
        </div>
      ),
      disagreeText:"Close" ,
      disagree: closeDialog,
    });
  };

  const CommentDropdown = () => (
    <div className="relative dropdown dropdown-left">
      <div tabIndex={0} role="button">
        <IonImg src={horiz} className="max-w-5 max-h-5 cursor-pointer" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content bg-base-bg menu text-emerald-800 rounded-box z-[1] w-52 p-2 shadow"
      >
        {isSelf && (
          <>
            <li
              className="p-2 bg-base-bg hover:bg-sky-100 rounded cursor-pointer"
              onClick={handleEdit}
            >
              Edit
            </li>
            <li
              className="p-2 bg-base-bg hover:bg-sky-100 rounded cursor-pointer"
              onClick={handleDelete}
            >
              Delete
            </li>
          </>
        )}
      </ul>
    </div>
  );

  return (
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden
        ${isDeleted ? "opacity-0 max-h-0 p-0 my-0" : "opacity-100 max-h-[1000px]"}`}
      style={{
        marginLeft: `${level * 1}px`,
        borderLeft: `4px solid ${
          level === 0 ? "#10B981" : `hsl(${150 + level * 10}, 70%, 50%)`
        }`,
        borderRadius: "1rem",
      }}
    >
      <div className="bg-base-bg rounded-2xl shadow-lg p-5 flex flex-col gap-4 relative border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center">
          <ProfileCircle profile={comment.profile} color="emerald-700 dark:text-cream" />
          {isSelf && <CommentDropdown />}
        </div>

        {/* Anchor text */}
        {comment.anchorText && (
          <blockquote
            className="border-l-2 border-emerald-400 pl-2 text-xs text-slate-500 dark:text-slate-400 italic truncate cursor-pointer hover:text-emerald-600 transition-colors"
            onClick={() => {
              const mark = document.querySelector(`[data-comment-id="${comment.id}"]`);
              if (!mark) return;
              mark.scrollIntoView({ behavior: "smooth", block: "center" });
              mark.classList.add("annotation-mark--pulse");
              setTimeout(() => mark.classList.remove("annotation-mark--pulse"), 1500);
            }}
          >
            ↑ "{comment.anchorText}"
          </blockquote>
        )}

        {/* Body */}
        <div className="flex items-start justify-between">
          <p className="text-emerald-800 dark:text-cream text-sm text-left sm:text-base break-words">
            {comment.content}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-2 text-sm">
          {isHelpful ? (
            <button
              onClick={handleUnmarkHelpful}
              className="px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold hover:bg-emerald-200 transition"
            >
              👍 Glad it helped!
            </button>
          ) : (
            <button
              onClick={handleMarkHelpful}
              className="px-4 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold hover:bg-emerald-100 transition"
            >
              Was this helpful?
            </button>
          )}

          <button
            className="text-emerald-800 rounded-full font-medium hover:underline"
            onClick={handleOpenReply}
          >
            Reply
          </button>
        </div>
      </div>

      {/* Nested replies — inline up to DEEP_LEVEL, dialog beyond */}
      {level < DEEP_LEVEL ? (
        <CommentThread page={page} comments={branches} level={level + 1} />
      ) : branches.length > 0 && (
        <button
          className="ml-4 mt-1 text-xs text-emerald-700 hover:underline font-medium"
          onClick={handleSeeReplies}
        >
          💬 See {branches.length} {branches.length === 1 ? "reply" : "replies"}
        </button>
      )}
    </div>
  );
}