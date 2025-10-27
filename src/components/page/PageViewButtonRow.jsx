import { useState, useLayoutEffect, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import bookmarkFill from "../../images/bookmark_fill_green.svg";
import bookmarkAdd from "../../images/bookmark_add.svg";
import { addStoryListToCollection, deleteStoryFromCollection } from "../../actions/CollectionActions";
import { setEditingPage, setHtmlContent } from "../../actions/PageActions.jsx";
import Paths from "../../core/paths";
import checkResult from "../../core/checkResult";
import loadingGif from "../../images/loading.gif";
import Context from "../../context";
import { debounce } from "lodash";
import { RoleType } from "../../core/constants";
import Enviroment from "../../core/Enviroment.js";
import { initGA, sendGAEvent } from "../../core/ga4.js";
import ErrorBoundary from "../../ErrorBoundary.jsx";
import { createPageApproval } from "../../actions/PageActions";
import { Preferences } from "@capacitor/preferences";
import { IonImg, IonPopover, IonList, IonItem, IonLabel, IonButton, IonContent, IonText } from "@ionic/react";
import { useSelector } from "react-redux";
import { setDialog } from "../../actions/UserActions.jsx";

export default function PageViewButtonRow({profile,archive, page, setCommenting }) {
  const { setSuccess, setError } = useContext(Context);
  const currentProfile = profile
//   const currentProfile = useSelector(state=>state.users.currentProfile)
  const dialog = useSelector(state=>state.users.dialog)
  const [likeFound, setLikeFound] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [canUserEdit, setCanUserEdit] = useState(false);
  const [canUserComment, setCanUserComment] = useState(false);
  const [archiveCol, setArchive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(null);
  const [comment, setComment] = useState(false);

  useLayoutEffect(() => {
    initGA();
  }, []);

  useLayoutEffect(() => {
    soCanUserComment();
    soCanUserEdit();
  }, [page, currentProfile]);

  useEffect(() => {
    setCommenting(comment);
  }, [comment]);

  useEffect(() => {
    if (currentProfile && page && currentProfile.likedStories) {
      let found = currentProfile.likedStories.find((like) => like.storyId == page.id);
      if (currentProfile.profileToCollections) {
        let marked = currentProfile.profileToCollections.find((ptc) => ptc && ptc.type === "archive");
        setArchive(marked.collection);
      }
      setLikeFound(found);
      setLoading(false);
    } else {
      setLikeFound(null);
      setBookmarked(null);
      setLoading(false);
    }
  }, [likeFound]);
  const onClickShare=()=>{
    let dia = {...dialog}
    dia.text = <ShareList page={page} setArchive={setArchive}profile={currentProfile} archive={archiveCol}
      bookmark={bookmarked}
    setBookmarked={setBookmarked}/>
    dia.title="Share"
    dia.isOpen=true
    dia.onClose=()=>{
        dispatch(setDialog({...dialog,isOpen:false}))
    }
    dia.disagreeText="Close"
    dispatch(setDialog(dia))
  }
  const onBookmarkPage = () => {
    setLoading(true);
    if (currentProfile && currentProfile.profileToCollections) {
      let ptc = currentProfile.profileToCollections.find((ptc) => ptc.type === "archive");
      if (ptc && ptc.collectionId && page && page.id) {
        dispatch(addStoryListToCollection({ id: ptc.collectionId, list: [page], profile: currentProfile })).then(
          (res) => {
            checkResult(
              res,
              ({ collection }) => {
                let bookmark = collection.storyIdList.find((stc) => stc.storyId == page.id);
                setArchive(collection);
                setBookmarked(bookmark);
                setLoading(false);
                setSuccess("Added Successfully");
              },
              () => {
                setError("Error");
                setLoading(false);
              }
            );
          }
        );
      }
    } else {
      setLoading(false);
    }
  };

  const getArchive = () => {
    if (currentProfile && currentProfile.profileToCollections) {
      let ptc = currentProfile.profileToCollections.find((ptc) => ptc.type === "archive");
      setArchive(ptc.collection);
    }
  };

  useEffect(() => {
    getArchive();
  }, []);

 

  const copyShareLink = () => {
    dispatch(setDialog({...dialog,isOpen:false}))
    sendGAEvent("Copy Share Link", `Share ${JSON.stringify({ id: page.id, title: page.title })}`, 0, false);
    navigator.clipboard.writeText(Enviroment.domain + Paths.page.createRoute(page.id)).then(() => {
      setSuccess("Ready to share");
    });
  };

  const soCanUserComment = () => {
    const roles = [RoleType.commenter, RoleType.editor, RoleType.writer];
    if (currentProfile && page) {
      if (currentProfile.id === page.authorId) {
        setCanUserComment(true);
        return;
      }
      if (page.commentable) {
        setCanUserComment(true);
        return;
      }
      if (page.betaReaders) {
        const found = page.betaReaders.find((rTc) => rTc.profileId === currentProfile.id && roles.includes(rTc.role));
        setCanUserComment(found);
      }
    }
  };

  function soCanUserEdit() {
    const roles = [RoleType.editor];
    if (currentProfile && page) {
      if (currentProfile.id === page.authorId) {
        setCanUserEdit(true);
        return;
      }
      if (page.betaReaders) {
        let found = page.betaReaders.find((rTc) => rTc.profileId === currentProfile.id && roles.includes(rTc.role));
        setCanUserEdit(found);
      }
    }
  }

  const handleApprovalClick = () => {
    if (currentProfile) {
      if (likeFound) {
        dispatch(deletePageApproval({ id: likeFound.id })).then((res) => {
          checkResult(
            res,
            () => {
              setLoading(false);
              setLikeFound(null);
            },
            () => {
              setLoading(false);
            }
          );
        });
      } else if (page) {
        const params = { story: page, profile: currentProfile };
        dispatch(createPageApproval(params));
      }
    } else {
      setError("Please Sign Up");
    }
  };



//   const isBookmarked = () => {
//     if (profile) {
//       if (archive) {
//         let bookmark = archive.storyIdList.find((stc) => stc.storyId == page.id);
//         setBookmarked(bookmark);
//       } else {
//         getArchive();
//       }
//     }
//   };
   

// function ShareList({page,profile,archive,bookmark,setBookmarked}){
// useEffect(() => {
//   isBookmarked();
// }, [page, archive]);
//     return(
//               <IonList className="flex flex-col">
//                 {/* <div className="flex flex-col"> */}
//                <li className="py-3 border-b"> <IonItem
                
//                   onClick={async () => {
                    
//                     if (currentProfile && (await Preferences.get({ key: "token" })).value) {
//                       navigate(Paths.addStoryToCollection.story(page.id));
//                     } else {
//                       setError("Please Sign Up");
//                     }
//                     dispatch(setDialog({...dialog,isOpen:false}))
//                   }}
//                 >
//                   <IonText className="text-[1rem]">Add to Collection</IonText>
//                 </IonItem>
// </li>
//                 {canUserEdit && (
//                      <li className="py-3 border-b">
//                   <IonItem
                    
//                     onClick={() => {
//                         dispatch(setDialog({...dialog,isOpen:false}))
//                       dispatch(setEditingPage({ page }));
//                       dispatch(setHtmlContent(page.data))
//                       navigate(Paths.editPage.createRoute(page.id));
//                     }}
//                   >
//                     <IonText className="text-[1rem]">Edit</IonText>
//                   </IonItem>
//                   </li>
//                 )}
//  <li className="py-3 border-b">
//                 <IonItem  onClick={copyShareLink}>
//                   <IonText className="text-[1rem]">Copy Share Link</IonText>
//                 </IonItem>
//                 </li>
//  <li className="py-3 border-b">
//                 <IonItem
           
//                   onClick={(e) => {
//                     profile ? handleBookmark(e) : setError("Please Sign In");
//                   }}
//                 >
//                     <div className="text-left w-full">
//                   {/* {!loading ? ( */}
//                     {bookmark ? (
//                       <IonImg src={bookmarkFill} className="mx-auto max-h-10 max-w-10" />
//                     ) : (
//                       <IonImg src={bookmarkAdd} className="mx-auto max-h-10 max-w-10" />
//                     )}
                
//                   {/* ://   )  (
//                     <IonImg src={loadingGif} className="max-h-6 mx-auto" />
//                   )} */}
//                   </div>
//                 </IonItem>
//                 </li>
//                 {/* </div> */}
//               </IonList>
//             )
// }
function ShareList({ page, profile, archive,setArchive, bookmark, setBookmarked }) {
  const [localBookmark, setLocalBookmark] = useState(bookmark);
        const handleBookmark = debounce((e) => {
    
    e.preventDefault();
    if (bookmarked) {
      deleteStc();
    } else {
      onBookmarkPage();
    }
  }, 10);
        useEffect(() => {
    isBookmarked();
  }, [page, archive]);

     const deleteStc = () => {
    setLoading(true);
    if (localBookmark) {
      dispatch(deleteStoryFromCollection({ stId: localBookmark.id })).then((res) => {
        checkResult(
          res,
          ({ collection }) => {
            setArchive(collection[0]);
            setBookmarked(null);
            isBookmarked();
     
          },
          () => {
            setBookmarked(null);
            // setLoading(false);
            isBookmarked();
          }
        );
      });
    }
  };
  useEffect(() => {
    // sync whenever parent bookmark or archive changes
    if (archive && page) {
      const found = archive.storyIdList.find((stc) => stc.storyId == page.id);
      setLocalBookmark(found || null);
    } else {
      setLocalBookmark(bookmark);
    }
  }, [archive, page, bookmark]);
  const isBookmarked = () => {
    if (profile) {
      if (archive) {
        let bookmark = archive.storyIdList.find((stc) => stc.storyId == page.id);
        setBookmarked(bookmark);
      } else {
        getArchive();
      }
    }
  };
  const handleLocalBookmark = async (e) => {
    e.preventDefault();
    if (localBookmark) {
      await deleteStc(); // uses closure from parent
      setLocalBookmark(null);
      setBookmarked(null);
    } else {
      await onBookmarkPage();
      setLocalBookmark(true);
      setBookmarked();
    }
  };

  return (
    <IonList className="flex flex-col">
      <li className="py-3 border-b">
        <IonItem
          onClick={async () => {
            if (profile && (await Preferences.get({ key: "token" })).value) {
              navigate(Paths.addStoryToCollection.story(page.id));
            } else {
              setError("Please Sign Up");
            }
            dispatch(setDialog({ ...dialog, isOpen: false }));
          }}
        >
          <IonText className="text-[1rem]">Add to Collection</IonText>
        </IonItem>
      </li>

      {canUserEdit && (
        <li className="py-3 border-b">
          <IonItem
            onClick={() => {
              dispatch(setDialog({ ...dialog, isOpen: false }));
              dispatch(setEditingPage({ page }));
              dispatch(setHtmlContent(page.data));
              navigate(Paths.editPage.createRoute(page.id));
            }}
          >
            <IonText className="text-[1rem]">Edit</IonText>
          </IonItem>
        </li>
      )}

      <li className="py-3 border-b">
        <IonItem onClick={copyShareLink}>
          <IonText className="text-[1rem]">Copy Share Link</IonText>
        </IonItem>
      </li>

      <li className="py-3 border-b">
        <IonItem
          onClick={(e) => {
            profile ? handleLocalBookmark(e) : setError("Please Sign In");
          }}
        >
          <div className="text-left w-full">
            {!loading ? (
              localBookmark ? (
                <IonImg src={bookmarkFill} className="mx-auto max-h-10 max-w-10" />
              ) : (
                <IonImg src={bookmarkAdd} className="mx-auto max-h-10 max-w-10" />
              )
            ) : (
              <IonImg src={loadingGif} className="max-h-6 mx-auto" />
            )}
          </div>
        </IonItem>
      </li>
    </IonList>
  );
}

  return (
    <ErrorBoundary>
      <div className="flex-row w-[90vw] rounded-b-lg overflow-clip sm:w-page mx-auto bg-emerald-200 flex text-white">
        {/* Approve / Yea */}
        <div
          onClick={handleApprovalClick}
          className={`${likeFound ? "bg-emerald-400" : "bg-emerald-200"} text-center grow flex-1/3`}
        >
          <div className="text-xl text-emerald-700 text-center mx-auto py-2 bg-transparent border-none">
            <h6 className="text-xl">Yea{likeFound ? "" : ""}</h6>
          </div>
        </div>

        {/* Discuss */}
        <div className="flex-1/3 grow bg-emerald-200 border-white border-l-2 border-r-2 text-center">
          <div
            className="text-emerald-700 py-2 border-none bg-transparent rounded-none"
            disabled={!canUserComment}
            onClick={() => {
              currentProfile ? setComment(!comment) : setError("Please Sign Up");
            }}
          >
            <h6 className="text-xl">Discuss</h6>
          </div>
        </div>

        {/* Share using Ionic Popover */}
        <div onClick={onClickShare} className="flex-1/3 grow bg-emerald-200 text-center flex justify-center items-center">
          {/* <IonButton  fill="clear" color="success"> */}
            <IonText className="text-xl text-emerald-700 m-0 p-0">Share</IonText>
          {/* </IonButton> */}

        
        </div>
      </div>
    </ErrorBoundary>
  );
}



//     }}
//     const copyShareLink=()=>{
      
//             sendGAEvent( "Copy Share Link",`Share ${JSON.stringify({id:page.id,title:page.title})}`,0,false)
 

//         navigator.clipboard.writeText(Enviroment.domain+Paths.page.createRoute(page.id))
//                                 .then(() => {
//                                     setSuccess("Ready to share")
                                   
//                                   })
//     }
//     const soCanUserComment=()=>{
//         const roles = [RoleType.commenter,RoleType.editor,RoleType.writer]
//         if(currentProfile&&page){
//             if(currentProfile.id==page.authorId){
//                 setCanUserComment(true)
//                 return null
//             }
//         if(page.commentable){
//             setCanUserComment(true)
//             return null
//         }
//         if(page.betaReaders){
//             const found = page.betaReaders.find(rTc=>rTc.profileId==currentProfile.id&&roles.includes(rTc.role))
//             setCanUserComment(found)
//             return null
//         }
//     }}
//     function soCanUserEdit(){
//       const roles = [RoleType.editor]
//         if(currentProfile&&page){
        
//             if(currentProfile.id==page.authorId){
//                 setCanUserEdit(true)
//                 return null
//             }
//             if(page.betaReaders){
//                 let found = page.betaReaders.find(rTc=>rTc.profileId==currentProfile.id&&roles.includes(rTc.role))
//                 setCanUserEdit(found)
//             return null
//         }
//     }
//     }
//     const handleApprovalClick = ()=>{
//         if(currentProfile){
//             if(likeFound ){
//              dispatch(deletePageApproval({id:likeFound.id})).then(res=>{
//                 checkResult(res,payload=>{
//                     setLoading(false)
//                     setLikeFound(null)
//                 },err=>{
//                     setLoading(false)
//                 })
//             })
//         }else{
//             if(page ){
    
            
//             const params = {story:page,
//                 profile:currentProfile,
//                             }
//             dispatch(createPageApproval(params))
//             }
//         }
//      }else{
//         setError("Please Sign Up")
//         }
//     }

//     const handleBookmark=debounce((e)=>{
//          console.log(bookmarked)
//             e.preventDefault()
//              if(bookmarked){
//                  deleteStc()
//              }else{
//                  onBookmarkPage()
         
//              }
    
//     },10)
  
//     return(<ErrorBoundary><div className='flex-row  w-[90vw] rounded-b-lg overflow-clip sm:w-page mx-auto bg-emerald-200 flex text-white'>
//     <div   onClick={handleApprovalClick} className={`${likeFound?"bg-emerald-400":"bg-emerald-200"} text-center  grow flex-1/3`}>
//      <div 
   
        
//       className={`
//       text-xl    text-emerald-700  text-center mx-auto py-2 bg-transparent  border-none  `}
    
//      >
//         <h6 className="text-xl"> Yea{likeFound?"":""}</h6>
//      </div>
//      </div>
//      <div className="flex-1/3 grow bg-emerald-200  border-white border-l-2 border-r-2 border-t-0 border-b-0  text-center ">
//     <div
//     className="  text-emerald-700 py-2 border-none bg-transparent rounded-none  "
//        disabled={!canUserComment} 
//         onClick={()=>{currentProfile?setComment(!comment):setError("Please Sign Up")}}>
//     <h6 className="text-xl">
//         Discuss</h6>
//     </div>
//     </div>
//     <div className="dropdown  flex-1/3 grow bg-emerald-200  text-center dropdown-top">
// <div tabIndex={0} role="button" className="  text-center mx-auto py-2 bg-transparent  flex border-none  "> <h6 className="text-xl   border-none bg-transparent text-emerald-700 mx-auto my-auto">Share</h6></div>
// <ul tabIndex={0} className="dropdown-content bg-white text-emerald-800 menu bg rounded-box z-[1] w-52  shadow">
// <li>
// <a disabled={!currentProfile} 
// className=' text-emerald-800 '

// onClick={async ()=>{
// if(currentProfile & (await Preferences.get({key:"token"})).value){
//     navigate(Paths.addStoryToCollection.story(page.id))
// }else{
//     setError("Please Sign Up")
// }

// }}> 
//                 Add to Collection

// </a></li>
//  {canUserEdit? <li> <a
//             className=' text-emerald-800 '
//            onClick={()=> {
//             dispatch(setEditingPage({page}))
//             navigate(Paths.editPage.createRoute(page.id))
//            }}
//         >
//              Edit
//             </a></li>:null}           
//            <li> <a
//             className=' text-emerald-800 '
//            onClick={()=>copyShareLink()}
//         >
//               Copy Share Link
//             </a></li>

// <li > <button
// onClick={(e)=>currentProfile?handleBookmark(e):setError("Please sign in")}
// className=" text-emerald-800 border-none flex bg-transparent"
// disabled={!currentProfile}> 
// {!loading?(bookmarked?
// <IonImg className="mx-auto" src={bookmarkFill}/>:<img className="mx-auto" src={bookmarkAdd}/> ):
// <IonImg className="max-h-6 mx-auto" src={loadingGif}/>}
// </button></li>
// </ul>
// </div>
// </div></ErrorBoundary>)
// }
