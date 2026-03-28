
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useLayoutEffect, useContext } from "react";
import { IonImg } from "@ionic/react";
import Context from "../../context.jsx";
import ProfileCircle from "../profile/ProfileCircle.jsx";
import CommentInput from "./CommentInput";
import CommentThread from "./CommentThread";
import {
  deleteComment,
  createComment,
  updateComment,
} from "../../actions/PageActions.jsx";
import { createHashtagComment, deleteHashtagComment } from "../../actions/HashtagActions";
import checkResult from "../../core/checkResult";
import horiz from "../../images/icons/more_vert.svg";

export default function Comment({ page, comment, level = 0 }) {
  const dispatch = useDispatch();
  const { setError } = useContext(Context);
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const comments = useSelector((state) => state.comments.comments);
  const hashtags = useSelector((state) => state.hashtags.profileHashtagComments);
    const isSelf = currentProfile && comment ?currentProfile?.id == comment?.profileId:false
  const [replyInput, setReplyInput] = useState(false);
  const [updateCommentState, setUpdateCommentState] = useState(null);
  const [branches, setBranches] = useState([]);
  const [isHelpful, setIsHelpful] = useState(null);

  // Load helpful status
  useEffect(() => {
    const hs = hashtags.find(
      (hash) => hash.commentId === comment.id && hash.hashtag.name === "helpful"
    );
    setIsHelpful(hs || null);
  }, [hashtags]);

  // Load child comments
  useLayoutEffect(() => {
    const children = comments.filter((c) => c.parentId === comment.id);
    setBranches(children);
  }, [comments]);

  if (!comment) return null;

  // Handlers
  const toggleReply = () => {
    setReplyInput(!replyInput);
    setUpdateCommentState(null);
  };

  const handleEdit = () => {
    setUpdateCommentState(comment);
    setReplyInput(false);
  };

  const handleDelete = () => {
 
    dispatch(deleteComment({ comment }))
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

  const closeInput = () => {
    setReplyInput(false);
    setUpdateCommentState(null);
  };
const CommentDropdown=()=>            <div className="relative dropdown dropdown-left">
              <div tabIndex={0} role="button">
                <IonImg src={horiz} className="max-w-5 max-h-5 cursor-pointer" />
              </div>
            <ul tabIndex={0} className="dropdown-content  bg-cream  menu  text-emerald-800 rounded-box z-[1] w-52 p-2 shadow">
               <li
  className="p-2 hover:bg-emerald-50 rounded"
  onClick={() => handleEdit()}
>
  Edit
</li>
<li
  className="p-2 hover:bg-emerald-50 rounded"
  onClick={() => handleDelete()}
>
  Delete
</li>
              </ul>
            </div>
console.log("Dropdown check", {
  currentProfileId: currentProfile?.id,
  commentProfileId: comment.profileId,
  showDropdown: currentProfile?.id?.toString() === comment.profileId?.toString()
});
  return (
    <div className={`max-w-[45em] ml-${level * 4} my-2`}>
      {/* Comment card */}
      <div className="bg-softBlue rounded-xl shadow-md p-4 flex flex-col gap-2 relative">
        {/* Header: profile + dropdown */}
        <div className="flex flex-row justify-between">
           <ProfileCircle profile={comment.profile} color="emerald-700" />       
<CommentDropdown/>
</div>
        <div className="flex items-start justify-between">
            
          <div className="flex items-center gap-3">
         
            <p className="text-emerald-800 text-sm text-left sm:text-base break-words">{comment.content}</p>
          </div>

          {/* Dropdown for author */}

          
        </div>

        {/* Actions */}
        <div className="flex items-left gap-4 mt-2 text-sm">
          {isHelpful ? (
            <button
              className="text-emerald-600 font-medium hover:underline"
              onClick={handleUnmarkHelpful}
            >
              👍 Glad it helped!
            </button>
          ) : (
            <button
              className="text-emerald-800 font-medium hover:underline"
              onClick={handleMarkHelpful}
            >
              Was this helpful?
            </button>
          )}

          <button
            className="text-emerald-800 font-medium hover:underline"
            onClick={toggleReply}
          >
            {!replyInput && !updateCommentState ? "Reply" : "Close"}
          </button>
        </div>
      </div>
{/* Reply/Edit input */}
{(replyInput || updateCommentState) && (
    <div>
           <div
      className="fixed inset-0 z-40 bg-black bg-opacity-30"
      onClick={closeInput}  // clicking overlay closes input
    />
  <div
    className={`fixed left-0 right-0 z-50 transition-transform duration-300 bg-white shadow-lg border-t border-gray-200`}
    style={{
      bottom: "64px",        // adjust to your navbar height
      maxHeight: "50%",      // prevent covering too much
      overflowY: "auto",
    }}
  >
    <CommentInput
      page={page}
      parentComment={comment}
      defaultComment={updateCommentState}
      handleClose={closeInput}
    />
  </div>
  </div>
)}
      {/* Reply/Edit input */}
      {/* {(replyInput || updateCommentState) && (
        <CommentInput
          page={page}
          parentComment={comment}
          defaultComment={updateCommentState}
          handleClose={closeInput}
        />
      )} */}

      {/* Child comments */}
      {/* {branches.length > 0 && ( */}
        <CommentThread page={page} comments={branches} level={level + 1} />
      {/* )} */}
    </div>
  );
}