// import { useState, useLayoutEffect, useEffect, useContext } from "react";
// import { useDispatch } from "react-redux";
// import { deletePageApproval } from "../../actions/PageActions.jsx";
// import checkResult from "../../core/checkResult";
// import Context from "../../context";
// import ShareList from "./ShareList.jsx";
// import { RoleType } from "../../core/constants";
// import { initGA } from "../../core/ga4.js";
// import ErrorBoundary from "../../ErrorBoundary.jsx";
// import { createPageApproval } from "../../actions/PageActions";
// import { IonText } from "@ionic/react";
// import { useSelector } from "react-redux";
// import {useDialog} from "../../domain/usecases/useDialog.jsx"
// export default function PageViewButtonRow({profile,archive, page, setCommenting }) {
//   const { setSuccess, setError } = useContext(Context);
//   const currentProfile = profile

//   const dialog = useSelector(state=>state.users.dialog)
//   const [likeFound, setLikeFound] = useState(null);
//   const dispatch = useDispatch();
//   const [canUserEdit, setCanUserEdit] = useState(false);
//   const [canUserComment, setCanUserComment] = useState(false);
//   const [archiveCol, setArchive] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [bookmarked, setBookmarked] = useState(null);
//   const [comment, setComment] = useState(false);
//   const {openDialog,closeDialog} = useDialog()
//   useLayoutEffect(() => {
//     initGA();
//   }, []);



//   useEffect(() => {
//     setCommenting(comment);
//   }, [comment]);

//   useEffect(() => {
// checkLike(currentProfile)
//   }, []);
//   const checkLike=(profile)=>{
//         if (profile && page && profile.likedStories) {
//       let found = profile.likedStories.find((like) => like.storyId == page.id);
//       if (profile.profileToCollections) {
//         let marked = profile.profileToCollections.find((ptc) => ptc && ptc.type === "archive");
//         setArchive(marked.collection);
//       }
//       setLikeFound(found);
//       setLoading(false);
//     } else {
//       setLikeFound(null);
//       setBookmarked(null);
//       setLoading(false);
//     }
//   }
//   const onClickShare=()=>{
//     openDialog({
//     title: null,
//     scrollY:false,
//     text: (
//       <ShareList page={page} setArchive={setArchive}profile={currentProfile} archive={archiveCol}
//       bookmark={bookmarked}
//     setBookmarked={setBookmarked}/>
//     ),
//     breakpoint:1,
    
   
//   });

  
//   }


//   const getArchive = () => {
//     if (currentProfile && currentProfile.profileToCollections) {
//       let ptc = currentProfile.profileToCollections.find((ptc) => ptc.type === "archive");
//       setArchive(ptc.collection);
//     }
//   };

//   useEffect(() => {
//     getArchive();
//   }, []);

 



//   const soCanUserComment = () => {
//     const roles = [RoleType.commenter, RoleType.editor, RoleType.writer];
//     if (currentProfile && page) {
//       if (currentProfile.id === page.authorId) {
//         setCanUserComment(true);
//         return;
//       }
//       if (page.commentable) {
//         setCanUserComment(true);
//         return;
//       }
//       if (page.betaReaders) {
//         const found = page?.betaReaders?.find((rTc) => rTc.profileId === currentProfile.id && roles.includes(rTc.role));
//         setCanUserComment(found);
//       }
//     }
//   };
//   useLayoutEffect(() => {
//     soCanUserComment();
//     soCanUserEdit();
//   }, [page, currentProfile]);
//   function soCanUserEdit() {
//     const roles = [RoleType.editor];
//     if (currentProfile && page) {
//       if (currentProfile.id === page.authorId) {
//         setCanUserEdit(true);
//         return;
//       }
//       if (page?.betaReaders && page.betaReaders.length) {
//         let found = page?.betaReaders.find((rTc) => rTc.profileId === currentProfile.id && roles.includes(rTc.role));
//         setCanUserEdit(found);
//       }
//     }
//   }

//   const handleApprovalClick = () => {
//     if (currentProfile) {
//       if (likeFound) {
//         dispatch(deletePageApproval({ id: likeFound.id })).then((res) => {
//           checkResult(
//             res,
//             ({profile}) => {
//               checkLike(profile)
//               setLoading(false);
//               setLikeFound(null);
//             },
//             () => {
//               setLoading(false);
//             }
//           );
//         });
//       } else if (page) {
//         const params = { story: page, profile: currentProfile };
//         dispatch(createPageApproval(params)).then((res) => {checkResult(res,({profile})=>{
//           checkLike(profile)
//         },err=>{

//         })})}
//     } else {
//       setError("Please Sign Up");
//     }
//   };




//   return (
//     <ErrorBoundary>
//       <div className="flex-row overflow-clip sm:w-page mx-auto  flex text-white">
//         {/* Approve / Yea */}
//         <div
//           onClick={handleApprovalClick}
//           className={`${likeFound ? "bg-emerald-600" : "bg-sky-200"} text-center grow mx-2 rounded-lg flex-1/3`}
//         >
//           <div className={`text-xl  ${likeFound ? "text-white" : "text-emerald-700"}  text-center mx-auto py-2 bg-transparent border-none`}>
//             <h6 className="text-xl">Yea{likeFound ? "" : ""}</h6>
//           </div>
//         </div>

//         {/* Discuss */}
//         <div className="flex-1/3 grow bg-sky-200 rounded-lg mx-2 text-center">
//           <div
//             className="text-emerald-700 py-2 border-none bg-transparent rounded-none"
//             disabled={!canUserComment}
//             onClick={() => {
//               currentProfile ? setComment(!comment) : setError("Please Sign Up");
//             }}
//           >
//             <h6 className="text-xl">Discuss</h6>
//           </div>
//         </div>

//         {/* Share using Ionic Popover */}
//         <div onClick={onClickShare} className="flex-1/3 mx-2  rounded-lg grow bg-sky-200 text-center flex justify-center items-center">
//             <IonText className="text-xl text-emerald-700 m-0 p-0">Share</IonText>
   

        
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// }


import { IonImg } from "@ionic/react";
import { useState } from "react";
import bookmarkfill from "../../images/bookmarkfill.svg"
import bookmarkoutline from "../../images/bookmarkadd.svg"
export default function PageViewButtonRow({ page, profile, setCommenting }) {
  const [likeFound, setLikeFound] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleApprovalClick = () => setLikeFound(!likeFound);
  const handleClickComment = () => setCommenting(true);
  const onClickShare = () => alert("Shared!");
  const handleBookmark = () => setBookmarked(!bookmarked);

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex gap-4">
        <button
          onClick={handleApprovalClick}
          className={`rounded-full px-4 py-2 transition active:scale-95 ${
            likeFound ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-800"
          }`}
        >
          Yea
        </button>
        <button
          onClick={handleClickComment}
          className="rounded-full px-3 py-2 bg-sky-50 text-sky-700 transition active:scale-95"
        >
          💬
        </button>
        <button
          onClick={onClickShare}
          className="rounded-full px-3 py-2 bg-sky-50 text-sky-700 transition active:scale-95"
        >
          ⤴
        </button>
      </div>
      {page.authorId === profile?.id && (
  <button
    onClick={() => router.push(Paths.editor.createRoute(page.id))}
    className="rounded-full px-3 py-2 bg-emerald-200 text-emerald-800 hover:bg-emerald-300 transition"
  >
    ✏️ Edit
  </button>
)}
      <button
        onClick={handleBookmark}
        className="p-2 rounded-full bg-emerald-100 hover:bg-emerald-200 transition"
      >
        <IonImg className="w-5 h-5" src={bookmarked ? bookmarkfill: bookmarkoutline} />
      </button>
    </div>
  );
}