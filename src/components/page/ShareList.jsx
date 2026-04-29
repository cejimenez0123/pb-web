// import { useEffect ,useState,useLayoutEffect, useContext} from "react";
// import { useDispatch } from "react-redux";
// import { IonText,IonImg, useIonRouter } from "@ionic/react";
// import { useSelector } from "react-redux";
// import loadingGif from "../../images/loading.gif"
// import bookmarkFill from "../../images/bookmarkfill.svg";
// import { RoleType } from "../../core/constants";
// import bookmarkadd from "../../images/bookmark_add.svg"
// import Context from "../../context";
// import { sendGAEvent } from "../../core/ga4";
// import { deleteStoryFromCollection,addStoryListToCollection } from "../../actions/CollectionActions";
// import checkResult from "../../core/checkResult";
// import Enviroment from "../../core/Enviroment";
// import Paths from "../../core/paths";
// import { Preferences } from "@capacitor/preferences";
// import { useDialog } from "../../domain/usecases/useDialog";
// import computePermissions from "../../core/compusePermissions";
// export default function ShareList({ page, profile, archive,setArchive, bookmark, setBookmarked }) {
//   // const [localBookmark, setLocalBookmark] = useState(bookmark);
//   const {setSuccess,setError}=useContext(Context)
// const [loadingBookmarkId, setLoadingBookmarkId] = useState(null);

//   const currentProfile = useSelector(state=>state.users.currentProfile)
//   const [canUserEdit,setCanUserEdit ]=useState(false)
//   const [loading,setLoading]=useState(false)
//   const router = useIonRouter()
//   const {openDialog,closeDialog,resetDialog,dialog}=useDialog()
//   const getShareSource = () => {
//   const pathname = router.routeInfo?.pathname || "";

//   if (pathname.startsWith("/profile")) return "profile_page";
//   if (pathname.startsWith("/dashboard")) return "dashboard";
//   if (pathname.startsWith("/collection")) return "collection";
//   if (pathname.startsWith("/discovery")) return "discovery";

//   return "unknown";
// };

// const {canSee,canAdd,canEdit,role}= computePermissions(page,currentProfile, {
//   getAccessList: (s) => s.betaReaders,
//   getAccessRole: (r) => r.permission,
//   isPrivate: (s) => s.isPrivate,
//   isOpen: () => false, // stories usually not open collab
//   canWriteRoles: ["commenter", "editor"],
//   canEditRoles: ["editor"],
// });
 
//     const onBookmarkPage = () => {
//     setLoading(true);
//     if (currentProfile && currentProfile.profileToCollections) {
//       let ptc = currentProfile.profileToCollections.find((ptc) => ptc.type === "archive");
//       if (ptc && ptc.collectionId && page && page.id) {
//         dispatch(addStoryListToCollection({ id: ptc.collectionId, list: [page], profile: currentProfile })).then(
//           (res) => {
//             checkResult(
//               res,
//               ({ collection }) => {
//                 let bookmark = collection.storyIdList.find((stc) => stc.storyId == page.id);
//                 setArchive(collection);
//                 // setLocalBookmark(bookmark)
//                 setLoading(false);

//                 setSuccess("Added Successfully");
//               },
//               () => {
//                 setError("Error");
//                 setLoading(false);
//               }
//             );
//           }
//         );
//       }
//     } else {
//       setLoading(false);
//     }
//   };
//   //   useLayoutEffect(() => {

//   //   soCanUserEdit();
//   // }, [page, currentProfile]);
//   const dispatch = useDispatch()
//     const copyShareLink = () => {
//     openDialog({...dialog,isOpen:false})
//       sendGAEvent("story_share_copy_link", {
//     story_id: page.id,
//     source: getShareSource(),
//   });
//     navigator.clipboard.writeText(Enviroment.domain + Paths.page.createRoute(page.id)).then(() => {
//       setSuccess("Ready to share");
//     });
//   };



//      const deleteStc = () => {
//  setLoading(true);
//       dispatch(deleteStoryFromCollection({ stId: localBookmark.id })).then((res) => {
//         checkResult(
//           res,
//           ({ collection }) => {
//             setArchive(collection[0]);
//             setBookmarked(null);
//             // setLocalBookmark(null)
//             setLoading(false)
//             isBookmarked();
     
//           },
//           () => {
//             // setBookmarked(null);
//             setBookmarked(null);
//             // setLocalBookmark(null)
//             setLoading(false)
//             isBookmarked();
//           }
//         );
//       });
    
//   };
//   useEffect(() => {
 
//         isBookmarked();

//   }, [archive,currentProfile]);
//   const isBookmarked = () => {
//     if (currentProfile&&archive) {
//         let bookmark = archive.storyIdList.find((stc) => stc.storyId == page.id);
//         setBookmarked(bookmark);
//         // setLocalBookmark(bookmark)
//         setLoading(false)
//     }else{
//        setLoading(false)
//       //  setLocalBookmark(false)
//     }
//   };
//     const getArchive = () => {
//     if (currentProfile && currentProfile.profileToCollections) {
      
//       let ptc = currentProfile.profileToCollections.find((ptc) => ptc.type === "archive");

//       setArchive(ptc.collection);
//     }
//   };

//   useEffect(() => {
//     getArchive();
//   }, [currentProfile]);
// const handleBookmarkClick = async () => {
//   if (loadingBookmarkId) return;

//   setLoadingBookmarkId(true);

//   try {
//     if (localBookmark) {
//       deleteStc(); // parent dispatch
//     } else {
//       onBookmarkPage(); // parent dispatch
//     }
//   } finally {
//     setLoadingBookmarkId(false);
//   }
// };


  

//   return (
//     <div className="flex flex-col  bg-base-surface dark:bg-base-bgDarkoverflow-hidden">
//       <li className=" bg-base-surface dark:bg-base-bgDark sborder-b">
//         <div
//         className="bg-base-surface dark:bg-transparent py-3"
//           onClick={async () => {
//             resetDialog()
//             if (profile && (await Preferences.get({ key: "token" })).value) {
//               sendGAEvent("story_add_to_collection_click", {
//   story_id: page.id,
//   source: getShareSource(),
// });

//             router.push  (Paths.addStoryToCollection.story(page.id));
//             } else {
//               setError("Please Sign Up");
//             }
      
//           }}
//         >
//           <IonText className="text-[1rem] dark:text-cream px-4">Add to Collection</IonText>
//         </div>
//       </li>

//       {canUserEdit && (
//         <li className="py-3 border-b bg-base-surface dark:bg-base-bgDark">
//           <div
//             onClick={() => {
//               sendGAEvent("story_edit_open", {
//   story_id: page.id,
//   source: getShareSource(),
// });
//               openDialog({ ...dialog, isOpen: false })
//               router.push(Paths.editPage.createRoute(page.id));
        
     
//             }}
       
//           >
//             <IonText className="text-[1rem] dark:text-cream px-4 ">Edit</IonText>
//           </div>
//         </li>
//       )}

//       <li className="py-3 border-b bg-cream">
//         <div onClick={copyShareLink}>
//           <IonText className="text-[1rem] dark:text-cream px-4">Copy Share Link</IonText>
//         </div>
//       </li>

//       <li  onClick={(e) => {
//             currentProfile ? handleBookmarkClick(e) : setError("Please Sign In");
//           }} className="py-3 border-b bg-cream">
//         <div
         
//         >


//         </div>
//       </li>
//     </div>
//   );
// }


import { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { IonText, useIonRouter } from "@ionic/react";
import { useSelector } from "react-redux";
import bookmarkFill from "../../images/bookmarkfill.svg";
import bookmarkadd from "../../images/bookmark_add.svg";
import Context from "../../context";
import { sendGAEvent } from "../../core/ga4";
import { deleteStoryFromCollection, addStoryListToCollection } from "../../actions/CollectionActions";
import checkResult from "../../core/checkResult";
import Enviroment from "../../core/Enviroment";
import Paths from "../../core/paths";
import { Preferences } from "@capacitor/preferences";
import { useDialog } from "../../domain/usecases/useDialog";
import computePermissions from "../../core/compusePermissions";

export default function ShareList({ page, profile, archive, setArchive, bookmark, setBookmarked }) {
  const { setSuccess, setError } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const currentProfile = useSelector(state => state.users.currentProfile);
  const router = useIonRouter();
  const dispatch = useDispatch();
  const { openDialog, closeDialog, resetDialog, dialog } = useDialog();

  const { canEdit } = computePermissions(page, currentProfile, {
    getAccessList: (s) => s.betaReaders,
    getAccessRole: (r) => r.permission,
    isPrivate: (s) => s.isPrivate,
    isOpen: () => false,
    canWriteRoles: ["commenter", "editor"],
    canEditRoles: ["editor"],
  });

  const getShareSource = () => {
    const pathname = router.routeInfo?.pathname || "";
    if (pathname.startsWith("/profile")) return "profile_page";
    if (pathname.startsWith("/dashboard")) return "dashboard";
    if (pathname.startsWith("/collection")) return "collection";
    if (pathname.startsWith("/discovery")) return "discovery";
    return "unknown";
  };

  const getArchive = () => {
    if (currentProfile?.profileToCollections) {
      let ptc = currentProfile.profileToCollections.find((ptc) => ptc.type === "archive");
      setArchive(ptc?.collection);
    }
  };

  const isBookmarked = () => {
    if (currentProfile && archive) {
      let found = archive.storyIdList.find((stc) => stc.storyId == page.id);
      setBookmarked(found);
    }
    setLoading(false);
  };

  useEffect(() => { getArchive(); }, [currentProfile]);
  useEffect(() => { isBookmarked(); }, [archive, currentProfile]);

  const onBookmarkPage = () => {
    setLoading(true);
    if (currentProfile?.profileToCollections) {
      let ptc = currentProfile.profileToCollections.find((ptc) => ptc.type === "archive");
      if (ptc?.collectionId && page?.id) {
        dispatch(addStoryListToCollection({ id: ptc.collectionId, list: [page], profile: currentProfile })).then((res) => {
          checkResult(res, ({ collection }) => {
            let found = collection.storyIdList.find((stc) => stc.storyId == page.id);
            setArchive(collection);
            setBookmarked(found);
            setLoading(false);
            setSuccess("Added Successfully");
          }, () => {
            setError("Error");
            setLoading(false);
          });
        });
      }
    } else {
      setLoading(false);
    }
  };

  const deleteStc = () => {
    setLoading(true);
    dispatch(deleteStoryFromCollection({ stId: bookmark.id })).then((res) => {
      checkResult(res, ({ collection }) => {
        setArchive(collection[0]);
        setBookmarked(null);
        setLoading(false);
        isBookmarked();
      }, () => {
        setBookmarked(null);
        setLoading(false);
        isBookmarked();
      });
    });
  };

  const handleBookmarkClick = async () => {
    if (loading) return;
    if (bookmark) {
      deleteStc();
    } else {
      onBookmarkPage();
    }
  };

  const copyShareLink = () => {
    openDialog({ ...dialog, isOpen: false });
    sendGAEvent("story_share_copy_link", { story_id: page.id, source: getShareSource() });
    navigator.clipboard.writeText(Enviroment.domain + Paths.page.createRoute(page.id)).then(() => {
      setSuccess("Ready to share");
    });
  };

  const LI = "py-3 border-b  bg-cream dark:bg-base-bgDark";
  const TEXT = "text-[1rem] text-soft  bg-cream dark:bg-base-bgDark dark:text-cream px-4";

  return (
    <div className="flex flex-col  bg-cream dark:bg-base-bgDark overflow-hidden">

      <li className={LI}>
        <div
          className="py-3 "
          onClick={async () => {
            resetDialog();
            if (profile && (await Preferences.get({ key: "token" })).value) {
              sendGAEvent("story_add_to_collection_click", { story_id: page.id, source: getShareSource() });
              router.push(Paths.addStoryToCollection.story(page.id));
            } else {
              setError("Please Sign Up");
            }
          }}
        >
          <h5 className={TEXT}>Add to Collection</h5>
        </div>
      </li>

      {canEdit && (
        <li className={LI}>
          <div
            className="py-3"
            onClick={() => {
              sendGAEvent("story_edit_open", { story_id: page.id, source: getShareSource() });
              openDialog({ ...dialog, isOpen: false });
              router.push(Paths.editPage.createRoute(page.id,page.type));
            }}
          >
            <h5 className={TEXT}>Edit</h5>
          </div>
        </li>
      )}

      <li className={LI}>
        <div className="py-3" onClick={copyShareLink}>
          <h5 className={TEXT}>Copy Share Link</h5>
        </div>
      </li>

      <li
        className={LI}
        onClick={() => currentProfile ? handleBookmarkClick() : setError("Please Sign In")}
      >
        <div className="py-3 flex items-center gap-2 px-4">
          <img src={bookmark ? bookmarkFill : bookmarkadd} className="w-5 h-5" alt="bookmark" />
          <IonText className={TEXT}>
            {loading ? "..." : bookmark ? "Remove Bookmark" : "Bookmark"}
          </IonText>
        </div>
      </li>

    </div>
  );
}