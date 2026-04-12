import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useLayoutEffect, useContext } from "react";
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

export default function Comment({ page, comment, level = 0 }) {
  const dispatch = useDispatch();
  const { setError } = useContext(Context);
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const comments = useSelector((state) => state.comments.comments);
  const hashtags = useSelector((state) => state.hashtags.profileHashtagComments);
  
  const isSelf = currentProfile && comment ? currentProfile?.id == comment?.profileId : false;
  // const [replyInput, setReplyInput] = useState(false);
  const [updateCommentState, setUpdateCommentState] = useState(null);
  const [branches, setBranches] = useState([]);
  const [isHelpful, setIsHelpful] = useState(null);
  const {dialog,openDialog,closeDialog}=useDialog()
  // UI deletion state
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const hs = hashtags.find(
      (hash) => hash.commentId === comment.id && hash.hashtag.name === "helpful"
    );
    setIsHelpful(hs || null);
  }, [hashtags]);

  useLayoutEffect(() => {reportError
    const children = comments.filter((c) => c.parentId === comment.id);
    setBranches(children);
  }, [comments]);

  if (!comment) return null;

  // Handlers
  // const toggleReply = () => {
  //   setReplyInput(!replyInput);
  //   setUpdateCommentState(null);
  // };

  const handleEdit = () => {
    setUpdateCommentState(comment);
   handleOpenCommentInput()
  };

  const handleDelete = () => {
    // Trigger slide/fade out
    setIsDeleted(true);

    // Call actual delete after animation
    setTimeout(() => {
      dispatch(deleteComment({ comment }));
      console.log("Dispatch delete for comment:", comment.id);
    }, 300); 
  };
const handleOpenCommentInput = () => {
  openDialog({
    title: "", // optional, you can hide it if you want
    height: 50, // 👈 replaces your old "maxHeight: 35%"
    text: (
      <CommentInput page={page} parentComment={comment} defaultComment={updateCommentState} handleClose={closeDialog} />
       
    ),
    disagreeText: null,
    disagree: null
  });
};
  const handleMarkHelpful = () => {
    if (!currentProfile) return;
 
    dispatch(createHashtagComment({ name: "helpful", profileId: currentProfile.id, commentId: comment.id }))
      .then((res) =>
        checkResult(
          res,
          (payload) => setIsHelpful(payload.hashtag),
          (err) => setError(err.message)
        )
      );
  };

  const handleUnmarkHelpful = () => {
    if (!isHelpful || !isHelpful.id) return;
    dispatch(deleteHashtagComment({ hashtagCommentId: isHelpful.id }))
      .then((res) =>
        checkResult(
          res,
          () => setIsHelpful(null),
          () => {}
        )
      );
  };


  const CommentDropdown = () => (
    <div className="relative dropdown dropdown-left">
      <div tabIndex={0} role="button">
        <IonImg src={horiz} className="max-w-5 max-h-5 cursor-pointer" />
      </div>
      <ul tabIndex={0} className="dropdown-content bg-base-bg  menu text-emerald-800 rounded-box z-[1] w-52 p-2 shadow">
        <li className="p-2 bg-base-bg  hover:bg-sky-100 rounded" onClick={handleEdit}>
          Edit
        </li>
        <li className="p-2 bg-base-bg  hover:bg-sky-100 rounded" onClick={handleDelete}>
          Delete
        </li>
      </ul>
    </div>
  );

  return (
   <div
  className={`transition-all duration-300 ease-in-out overflow-hidden
    ${isDeleted ? "opacity-0 max-h-0 p-0 my-0" : "opacity-100 max-h-[1000px]"}`}
  style={{
    marginLeft: `${level * 1}px`, // golden ratio indentation
    borderLeft: `4px solid ${level === 0 ? "#10B981" : `hsl(${150 + level * 10}, 70%, 50%)`}`,
    borderRadius: "1rem",
  }}
>
      {/* Comment card */}
   <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-4 relative border border-gray-100">
    {/* Header: profile + dropdown */}
    <div className="flex justify-between items-center">
        {/* <div className="flex flex-row justify-between"> */}
          <ProfileCircle profile={comment.profile} color="emerald-700" />
          <CommentDropdown />
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <p className="text-emerald-800 text-sm text-left sm:text-base break-words">
              {comment.content}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-left gap-4 mt-2 text-sm">
                {isHelpful ? (
        <button       onClick={handleUnmarkHelpful} className="px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold hover:bg-emerald-200 transition">
          👍 Glad it helped!
        </button>
      ) : (
        <button       onClick={handleMarkHelpful} className="px-4 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold hover:bg-emerald-100 transition">
          Was this helpful?
        </button>
      )}
          
          <button className="text-emerald-800 rounded-full font-medium hover:underline" onClick={handleOpenCommentInput}>
             Reply
          </button>
        </div>
      </div>


      <CommentThread page={page} comments={branches} level={level + 1} />
    </div>
  );
}
