// import { useSelector } from "react-redux"
// import { useState,useLayoutEffect, useEffect, useContext } from "react"
// import CommentInput from "./CommentInput"
// import CommentThread from "./CommentThread"

// import { useDispatch } from "react-redux"
// import { IonImg } from "@ionic/react"
// import { deleteHashtagComment, createHashtagComment } from "../../actions/HashtagActions"
// import checkResult from "../../core/checkResult"
// import horiz from "../../images/icons/more_vert.svg"
// import { deleteComment } from "../../actions/PageActions.jsx"
// import Context from "../../context.jsx"
// import ProfileCircle from "../profile/ProfileCircle.jsx"
// export default function Comment({page,comment,level}){
//     const comments = useSelector(state=>state.comments.comments)
//     const dispatch = useDispatch()
//     const {setErrorr} = useContext(Context)
//     const currentProfile = useSelector(state=>state.users.currentProfile)
//     const [branches,setBranches]=useState([])
//     const [replyInput,setReplyInput]=useState(false)
//     const hashtags = useSelector(state=>state.hashtags.profileHashtagComments)
//     const [isHelpful,setIsHelpful]= useState(null)
//     const [updateComment,setUpdateComment]=useState(null)
//     useEffect(()=>{
//         let hs = hashtags.find(hash=>{
//             if(hash.commentId == comment.id){
//                 return hash.hashtag.name=="helpful"
//             }else{
//                 return false
//             }})
        
//        setIsHelpful(hs)
//     },[hashtags])


//     const handleIfHelpful = ()=>{
//         if(currentProfile){
//      dispatch(createHashtagComment({name:"helpful",profileId:currentProfile,commentId:comment.id})).then(res=>checkResult(res,payload=>{
//         const {hashtag}=payload
//         setIsHelpful(hashtag)
     
//      },err=>{
//        setError(err.message)
//      }))}
//     }
//     const handleDeleteComment =()=>{
//         dispatch(deleteComment({comment}))
//     }
    
//     const handleDeleteHelpful = ()=>{
//         if(isHelpful){
//             if(isHelpful.id){
//                 dispatch(deleteHashtagComment({hashtagCommentId:isHelpful.id})).then(res=>{
//                     checkResult(res,payload=>{
//                         setIsHelpful(null)
//                     },err=>{
                        
//                     })
//                 })
//             }
//         }
//     }
//     const closeInput =()=>{
//         setUpdateComment(null)
//         setReplyInput(false)
//     }
//     useLayoutEffect(()=>{
//        let branches = comments.length?comments.filter(com=>{return com.parentId && com.parentId==comment.id}):[]
//        setBranches(branches)
//     },[comments])
//     if(!comment)return null
//     return(<div className="max-w-[45em] ">


//         <div class=" text-left    sm:min-w-[30em] max-w-[100%] py-1 sm:my-4 " id={`comment-${comment.id}`}>
//         <div className={"shadow-sm"+replyInput||updateComment?" rounded-t-lg rounded-b-lg":""}>

//            <div className="  shadow-sm bg-softBlue rounded-xl text-emerald-800   ">
//           <div className="flex w-[100%] flex-row py-2 pr-4 justify-between"> 
      
//           <span className="ml-2"><ProfileCircle profile={comment.profile} color={"emerald-700"}/></span>
//           {currentProfile && currentProfile.id == comment.profileId?     <div className="dropdown  dropdown-left">
// <div tabIndex={0} role="button" className="my-auto h-fit">
      
//     <IonImg src={horiz}/>
//     </div>
//   <ul tabIndex={0} className="dropdown-content  bg-cream  menu  text-emerald-800 rounded-box z-[1] w-52 p-2 shadow">
//     <li className="p-3 " onClick={()=>setUpdateComment(comment)}>Update</li>
//     <li className="p-3 " onClick={handleDeleteComment}>Delete</li>
//   </ul>
// </div>:null}
//           </div> <h6 className="text-[0.8rem] md:text-[rem]   py-3 px-2 sm:px-8  my-1">{comment.content}</h6>
//            <div class=" flex flex-row py-2 sm:pl-2 pr-6 items-end justify-between">
                    
//                     {isHelpful?<a onClick={handleDeleteHelpful} className="text-[0.8rem]  text-emerald-600 sm:text-sm   mt-2 mb-2 ml-6">Glad it helped!</a>:<a onClick={handleIfHelpful}className="text-[0.8rem] sm:text-sm mont-medium text-emerald-800 mt-4 ml-8"> Was comment helpful?</a>}
                  
//                     <h6 
//                    onClick={()=>setReplyInput(!replyInput) }
                
                  
//                     className="  place-self-end bottom-0  mt-8 sm:flex sm:flex-row text-[0.8rem] sm:text-[1rem] md:px-4   font-bold  mr-2 rounded-full  py-2  text-emerald-800 sm:mx-2 sm:text-center   sm:my-auto  no-underline  mont-medium ">
//                         {!replyInput?"Reply":"Close"}</h6>
      
//                 </div>
                   
//                 </div>
//                 </div> 
//                 {replyInput||updateComment?<CommentInput page={page} parentComment={comment} defaultComment={updateComment} handleClose={closeInput}/>:null}
//                 </div>
//                 <div>
//                     <CommentThread page={page} comments={branches} level={level+1}/>
//                     </div>
      
//             </div>  
// )
// }
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
    dispatch(deleteComment({ comment }));
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

  return (
    <div className={`max-w-[45em] ml-${level * 4} my-2`}>
      {/* Comment card */}
      <div className="bg-softBlue rounded-xl shadow-md p-4 flex flex-col gap-2 relative">
        {/* Header: profile + dropdown */}
           <ProfileCircle profile={comment.profile} color="emerald-700" />
        <div className="flex items-start justify-between">
            
          <div className="flex items-center gap-3">
         
            <p className="text-emerald-800 text-sm text-left sm:text-base break-words">{comment.content}</p>
          </div>

          {/* Dropdown for author */}
          {currentProfile?.id === comment.profileId && (
            <div className="relative dropdown dropdown-left">
              <div tabIndex={0} role="button">
                <IonImg src={horiz} className="w-5 h-5 cursor-pointer" />
              </div>
              <ul className="dropdown-content bg-cream menu text-emerald-800 rounded-lg shadow-lg w-40 p-2">
                <li className="p-2 hover:bg-emerald-50 rounded" onClick={handleEdit}>Edit</li>
                <li className="p-2 hover:bg-emerald-50 rounded" onClick={handleDelete}>Delete</li>
              </ul>
            </div>
          )}
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
        <CommentInput
          page={page}
          parentComment={comment}
          defaultComment={updateCommentState}
          handleClose={closeInput}
        />
      )}

      {/* Child comments */}
      {branches.length > 0 && (
        <CommentThread page={page} comments={branches} level={level + 1} />
      )}
    </div>
  );
}