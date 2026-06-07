
// import React,{ useContext, useEffect, useLayoutEffect, useState } from 'react';
// import { IonCard, IonCardHeader, IonCardContent, IonText,IonImg, useIonRouter } from '@ionic/react';
// import "../../Dashboard.css";
// import {
//   deletePageApproval,
//   setPageInView,
//   setPagesInView,
//   createPageApproval,
 
// } from '../../actions/PageActions';
// import { addStoryListToCollection, deleteStoryFromCollection } from '../../actions/CollectionActions'
// import { useDispatch, useSelector } from 'react-redux';

// import addCircle from "../../images/icons/add_circle.svg";
// import bookmarkfill from "../../images/bookmarkfill.svg";
// import checkResult from '../../core/checkResult';
// import Paths from '../../core/paths';
// import bookmarkoutline from "../../images/bookmarkadd.svg";
// import PageDataElement from './PageDataElement';
// import ProfileCircle from '../profile/ProfileCircle';
// import Context from '../../context';
// import Enviroment from '../../core/Enviroment';
// import ErrorBoundary from '../../ErrorBoundary';
// import { debounce, set, truncate } from 'lodash';
// import { sendGAEvent } from '../../core/ga4';
// import ShareList from './ShareList';
// import { useParams } from 'react-router';
// import { useDialog } from '../../domain/usecases/useDialog';
// import computePermissions from '../../core/compusePermissions';
// import DataElement from './DataElement';
// // THEME HELPERS (light + dark ready)
// const theme = {
//   card: `
//     bg-base-bg 
//     dark:bg-base-surface
//     border border-border-default 
//     dark:border-border-soft
//     shadow-sm
//   `,

//   headerText: `
//     text-text-primary 
//     dark:text-text-inverse
//   `,

//   subText: `
//     text-text-secondary 
//     dark:text-text-secondary
//   `,

//   contentText: `
//     text-text-primary/80 
//     dark:text-text-inverse/80
//   `,

//   softBg: `
//     bg-softBlue/40 
//     dark:bg-base-soft/20
//   `,

//   softBgHover: `
//     bg-softBlue/60 
//     dark:bg-base-soft/30
//   `,

//   primaryBtn: (active) => `
//     px-3 py-1.5 rounded-full text-sm font-medium
//     transition active:scale-95
//     ${
//       active
//         ? "bg-button-secondary-bg text-button-secondary-text"
//         : "bg-softBlue/40 text-text-primary dark:text-text-inverse"
//     }
//   `,

//   iconBtn: `
//     px-3 py-1.5 rounded-full text-sm
//     bg-softBlue/30 
//     dark:bg-base-soft/20
//     text-text-primary 
//     dark:text-text-inverse
//     transition active:scale-95
//   `,

//   bookmarkBtn: `
//     p-2 rounded-full 
//     bg-softBlue/30 
//     dark:bg-base-soft/20
//     active:bg-softBlue/60 
//     dark:active:bg-base-soft/30
//     transition
//   `,
// };
// function DashboardItem({ page, book,shortenTo, isGrid }) {
//   const { isPhone, isHorizPhone, setSuccess, setError} = useContext(Context);
//   const currentProfile = useSelector(state=>state.users.currentProfile)
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   const dialog = useSelector(state=>state.users.dialog)
//     const router = useIonRouter()
//   const pathParams = useParams()
// const {canSee,canAdd,canEdit,role}= computePermissions(page,currentProfile, {
//   getAccessList: (s) => s.betaReaders??[],
//   getAccessRole: (r) => r.permission,
//   isPrivate: (s) => s.isPrivate,
//   isOpen: () => false, // stories usually not open collab
//   canWriteRoles: ["commenter", "editor"],
//   canEditRoles: ["editor"],
// });
  
//   const pagesInView = useSelector((state) => state.pages.pagesInView);
//   const colInView = useSelector((state) => state.books.collectionInView);
//   const [likeFound, setLikeFound] = useState(false);
//   const [bookmarked, setBookmarked] = useState();
//   const [archiveCol,setArchiveCol]=useState(null)
//   const [homeCol,setHomeCol]=useState(null)
// const {openDialog,closeDialog}=useDialog()

//   // const widthSize = adjustScreenSize(isGrid, true, "", " pt-1 pb-2 ", "", "", "", "");
//  const getStorySource = () => {
//   const pathname = router.routeInfo?.pathname || "";

//   if (pathname.startsWith("/profile")) return "profile_page";
//   if (pathname.startsWith("/dashboard")) return "dashboard";
//   if (pathname.startsWith("/discovery")) return "discovery";
//   if (pathname.startsWith("/collection")) return "collection";
//   if (pathname.startsWith("/library")) return "library";

//   return "unknown";
// };

//   const addStoryToCollection = () => {
//     if (page) {
//       const list = [page];
//       if (
//       router.routeInfo.pathname.includes("collection") &&
//         pathParams.id &&
//         colInView.id === pathParams.id
//       )
//         dispatch(addStoryListToCollection({ id: colInView.id, list: list, profile: currentProfile }))
//           .then(res => {
//             checkResult(
//               res,
//               payload => {
//                 let pages = pagesInView;
//                 let index = pages.findIndex(page => page === Enviroment.blankPage);
//                 let stories = payload.collection.storyIdList.map(sTc => sTc.story);
//                 let back = pages.slice(index, pages.length).filter(page => {
//                   return !stories.find(story => story && page && story.id && page.id && story.id === page.id);
//                 });
//                 dispatch(setPagesInView({ pages: [...stories, ...back] }));
//                 setSuccess("Added");
//               },
//               err => {
//                 if (err.message) {
//                   setError("Error Adding Story to Collection " + err.message);
//                 }
//               }
//             );
//           });
//     }
//   };



//   const checkLike = (profile) => {
//     if ( profile &&profile.id && page) {
//       if (profile.likedStories) {
//         let found = profile.likedStories.find(like => like && like.storyId === page.id);
//         setLikeFound(found);
//       }
//       if (profile.profileToCollections) {
//         let marked = profile.profileToCollections.find(
//           ptc => 
//             ptc && ptc.type === "home" && ptc.collection && ptc.collection.storyIdList && ptc.collection.storyIdList.find(stc => stc.storyId === page.id)
//         );
//         setBookmarked(marked);
//       }
//     }
//   };

//   const deleteStc = () => {
//     if (bookmarked && bookmarked.id) {

//       dispatch(deleteStoryFromCollection({ stId: bookmarked.id })).then(res => {
//         checkResult(
//           res,
//           payload => {
//             setBookmarked(null);
//             setLoading(false);
//           },
//           err => {
//             if (err.message) {
//               setError("Error deleting bookmark " + err.message);
//             }
//           }
//         );
//       });
//     }
//   };

//   const handleClickComment = () => {
//     if (page) {
// sendGAEvent("story_review_open", {
//   story_id: page.id,
//   source: getStorySource(),
// });

//       router.push(Paths.page.createRoute(page.id));
//     }
//   };

//   const header = () => {
//     return (
//       <span
//         className={`flex-row flex justify-between  px-2  rounded-t-lg pt-2 pb-2`}>
//         <div onClick={()=>router.push(Paths.profile.createRoute(page.author.id))}><ProfileCircle isGrid={isGrid} color={"emerald-700"} profile={page.author} /></div>
//         {!isGrid ?
//           <h6
//             className={
//               `text-emerald-800 mx-2 no-underline pt-2 text-ellipsis text-emerald-700 whitespace-nowrap overflow-hidden ${isGrid ? "text-[0.7rem] " : "text-[0.9rem]"}`
//             }
//             onClick={() => {
//               dispatch(setPageInView({ page }));
//               router.push(Paths.page.createRoute(page.id));
//             }}>
//             {` ` + (page.title?.length > 0 ? page.title : "")}
//           </h6>
//           : null}
//       </span>
//     );
//   };
//   const handleApprovalClick = () => {
//     if(!currentProfile){
//       return alert("Please Sign Up to Like")
//     }
//   if (likeFound) {
//     setLikeFound(false); // update immediately
//     dispatch(deletePageApproval({ id: likeFound.id }))
//       .then(res => checkResult(res, () => {
//         setLikeFound(null);
//         sendGAEvent("story_unlike" ,{
//   story_id: page.id,
//   source: getStorySource(),
// });

//       }, err => console.error(err)));
//   } else {
//     setLikeFound(true); // update immediately
//     const params = { story: page, profile: currentProfile };
//     dispatch(createPageApproval(params))
//       .then(res => checkResult(res, (payload) => {
// sendGAEvent( "story_like", {
//   story_id: page.id,
//   source: getStorySource(),
// });

//         const {profile} = payload;
//         checkLike(profile);
//       }, err => console.error(err)));
//   }
// };
// useEffect(() => {
//     checkLike(currentProfile);
// }, []); 


//   const onClickShare = () => {
// openDialog({
//     isOpen: true,
//     title: null,
//     scrollY:false,
//     height:50,
//     text: (
//       <ShareList
//         page={page}
//         profile={currentProfile}
//         archive={archiveCol}
//         bookmark={bookmarked}
//         setArchive={setArchiveCol}
//         setBookmarked={setBookmarked}
//       />
//     ),
//     agree: null,
//     agreeText: null,
   
//     breakpoint: .95
//   })
// };




//   const onBookmarkPage = () => {
//     if (currentProfile) {
//       setLoading(true);
//       let ptc = currentProfile.profileToCollections.find(ptc => ptc.type === "home");
    
//       if (ptc && ptc.collectionId && page && page.id) {
//         dispatch(addStoryListToCollection({
//           id: ptc.collectionId,
//           list: [page],
//           profile: currentProfile
//         })).then(res => {
//           checkResult(res, payload => {
//             const { collection } = payload;
//             let stc = collection.storyIdList.find(stc => stc.storyId === page.id);
//             setBookmarked(stc);
//             setSuccess("Added Successfully");
//             setLoading(false);
//             sendGAEvent("story_bookmark", {
//   story_id: page.id,
//   source: getStorySource(),
// });

//           }, err => {
//             setBookmarked(null);
//             setError("Error Bookmarking");
//             setLoading(false);
            
//           });
//         });
//       }
//     }
//   };

  

//   let bookTitleDiv = null;
//   if (book) {
//     let title = book?.title.length > 30 ? book?.title.slice(0, 30) + "..." : book?.title;
//     bookTitleDiv = (
//       <a onClick={() => { router.push(Paths.collection.createRoute(book.id)); }}>
//         <p>{title} {">"}</p>
//       </a>
//     );
//   }

//   const bookmarkBtn = () => {
//     return isGrid ? (
//       <div className={`bg-emerald-100 flex flex-row justify-between  text-emerald-700`}>
//         {isPhone ? null : <ProfileCircle isGrid={isGrid} includeUsername={false} profile={page.author} color='emerald-700' />}
//         <span >
//           <h6 className={`text-emerald-700 ${isGrid ? isPhone ? "" : " text-right " : isHorizPhone ? "" : ""}${isPhone ? " text-[0.6rem] " : "text-[0.9rem]  w-[10rem] ml-1 pr-2"}   whitespace-nowrap  no-underline text-ellipsis  overflow-hidden  my-auto `}
//             onClick={() => {
//               sendGAEvent("story_open", {
//   story_id: page.id,
//   source: getStorySource(),
//   author_id: page.authorId,
// });
              
//               router.push(Paths.page.createRoute(page.id));
//             }}>
//             {` ` + (page.title?.length > 0 ? page.title : "")}
//           </h6>
//           <IonImg onClick={handleBookmark} className='text-white' src={bookmarked ? bookmarkfill : bookmarkoutline} />
//         </span>
//       </div>
//     ) : null;
//   };

//   const handleBookmark = debounce((e) => {
//     if (currentProfile) {
//       e.preventDefault();
//       if (bookmarked) {
        
//         deleteStc();
//       } else {
//         onBookmarkPage();
//       }
//     } else {
//       setError("Please Sign Up");
//     }
//   }, 10);


  
//   if (!page) {
//     return (
//       <span className={ " skeleton w-[100%] h-[20em]"} />
//     );
//   }


// return (
// <div className={`mt-3 mx-auto rounded-2xl ${theme.card}`}>

//     {/* Header */}
//     <IonCardHeader className="pb-2">
//       <div className="flex items-center gap-3">
//         <div onClick={() => router.push(Paths.profile.createRoute(page.author.id))}>
//           <ProfileCircle includeUsername={false} profile={page.author} />
//         </div>

//         <div className="flex flex-col">
//           <IonText className={`text-sm font-semibold ${theme.headerText}`}>
//             {page.author?.username}
//           </IonText>
//           <IonText className={`text-xs ${theme.subText}`}>
//             {page.title}
//           </IonText>
//         </div>
//       </div>
//     </IonCardHeader>

//     {/* Content */}
//     <IonCardContent className="pt-0">
//       {page.description && (
//      <IonText className={`text-sm ${theme.contentText} leading-relaxed line-clamp-3`}>
//           {page.description}
//         </IonText>
//       )}
// <div className={`mt-3 rounded-2xl overflow-hidden border ${theme.softBg}`}>
//   <DataElement isGrid={isGrid} shortenTo={shortenTo} page={page} />
//         {/* <PageDataElement truncateNumber={200}isGrid={isGrid} page={page} /> */}
//       </div>
//     </IonCardContent>
// <div className="flex items-center justify-between px-4 pb-3">

//   {/* Left actions */}
//   <div className="flex items-center gap-3">

//     {/* Like */}
//     <button
//       onClick={handleApprovalClick}
//     className={theme.primaryBtn(likeFound)}
  
//     >
//       Yea
//     </button>

//     {/* Comment */}
//     <button
//       onClick={handleClickComment}
//    className={theme.iconBtn}
//     >
//      Comment
//     </button>

//     {/* Share */}
//     <button
//       onClick={onClickShare}
//     className={theme.iconBtn}
//     >
//       ⤴
//     </button>
//   </div>

//   {/* Bookmark */}
//   <button
//     onClick={handleBookmark}
//   className={theme.bookmarkBtn}
//   >
//     <IonImg
//       className="w-5 h-5"
//       src={bookmarked ? bookmarkfill : bookmarkoutline}
//     />
//   </button>

// </div>
    
//   </div>
// );
// }






// export default React.memo(DashboardItem);

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { IonCardHeader, IonCardContent, IonText, IonImg, useIonRouter } from '@ionic/react';
import "../../Dashboard.css";
import {
  deletePageApproval,
  setPageInView,
  createPageApproval,
} from '../../actions/PageActions';
import { addStoryListToCollection, deleteStoryFromCollection } from '../../actions/CollectionActions';
import { useDispatch, useSelector } from 'react-redux';
import bookmarkfill from "../../images/bookmarkfill.svg";
import bookmarkoutline from "../../images/bookmarkadd.svg";
import checkResult from '../../core/checkResult';
import Paths from '../../core/paths';
import ProfileCircle from '../profile/ProfileCircle';
import Context from '../../context';
import ErrorBoundary from '../../ErrorBoundary';
import { sendGAEvent } from '../../core/ga4';
import ShareList from './ShareList';
import { useParams } from 'react-router';
import { useDialog } from '../../domain/usecases/useDialog';
import computePermissions from '../../core/compusePermissions';
import DataElement from './DataElement';

const theme = {
  card: `
    bg-base-bg 
    dark:bg-base-surface
    border border-border-default 
    dark:border-border-soft
    shadow-sm
  `,
  headerText: `
    text-text-primary 
    dark:text-text-inverse
  `,
  subText: `
    text-text-secondary 
    dark:text-text-secondary
  `,
  contentText: `
    text-text-primary/80 
    dark:text-text-inverse/80
  `,
  softBg: `
    bg-softBlue/40 
    dark:bg-base-soft/20
  `,
  primaryBtn: (active) => `
    px-3 py-1.5 rounded-full text-sm font-medium
    transition active:scale-95
    ${
      active
        ? "bg-button-secondary-bg text-button-secondary-text"
        : "bg-softBlue/40 text-text-primary dark:text-text-inverse"
    }
  `,
  iconBtn: `
    px-3 py-1.5 rounded-full text-sm
    bg-softBlue/30 
    dark:bg-base-soft/20
    text-text-primary 
    dark:text-text-inverse
    transition active:scale-95
  `,
  bookmarkBtn: `
    p-2 rounded-full 
    bg-softBlue/30 
    dark:bg-base-soft/20
    active:bg-softBlue/60 
    dark:active:bg-base-soft/30
    transition
  `,
};

function DashboardItem({ page, isGrid, shortenTo }) {
  const { setSuccess, setError } = useContext(Context);
  const currentProfile = useSelector((state) => state.users.currentProfile);
  
  const colInView = useSelector((state) => state.books.collectionInView);
  const dispatch = useDispatch();
  const router = useIonRouter();
  const pathParams = useParams();
  const { openDialog } = useDialog();

  const [likeFound, setLikeFound] = useState(null);
  const [bookmarked, setBookmarked] = useState(null);

  const { canSee } = computePermissions(page, currentProfile, {
    getAccessList: (s) => s.betaReaders ?? [],
    getAccessRole: (r) => r.permission,
    isPrivate: (s) => s.isPrivate,
    isOpen: () => false,
    canWriteRoles: ["commenter", "editor"],
    canEditRoles: ["editor"],
  });

  const storySource = useMemo(() => {
    const pathname = router.routeInfo?.pathname || "";
    if (pathname.startsWith("/profile")) return "profile_page";
    if (pathname.startsWith("/dashboard")) return "dashboard";
    if (pathname.startsWith("/discovery")) return "discovery";
    if (pathname.startsWith("/collection")) return "collection";
    if (pathname.startsWith("/library")) return "library";
    return "unknown";
  }, [router.routeInfo?.pathname]);

  // Sync like + bookmark state whenever currentProfile loads or changes
  useEffect(() => {
    if (!currentProfile?.id || !page) return;

    if (currentProfile.likedStories) {
      const found = currentProfile.likedStories.find(
        (like) => like?.storyId === page.id
      );
      setLikeFound(found ?? null);
    }

    if (currentProfile.profileToCollections) {
      // bookmarked = the storyIdList entry (stc) so deleteStc can use stc.id
      const homePtc = currentProfile.profileToCollections.find(
        (ptc) => ptc?.type === "home"
      );
      const stc = homePtc?.collection?.storyIdList?.find(
        (s) => s.storyId === page.id
      );
      setBookmarked(stc ?? null);
    }
  }, [currentProfile, page]);

  // ── Like ──────────────────────────────────────────────────────────────────
  const handleApprovalClick = () => {
    if (!currentProfile) return alert("Please Sign Up to Like");

    if (likeFound) {
      setLikeFound(null);
      dispatch(deletePageApproval({ id: likeFound.id })).then((res) =>
        checkResult(
          res,
          () => sendGAEvent("story_unlike", { story_id: page.id, source: storySource }),
          (err) => console.error(err)
        )
      );
    } else {
      setLikeFound(true);
      dispatch(createPageApproval({ story: page, profile: currentProfile })).then((res) =>
        checkResult(
          res,
          (payload) => {
            sendGAEvent("story_like", { story_id: page.id, source: storySource });
            // Re-sync from the returned profile so likeFound has a real id
            const found = payload.profile?.likedStories?.find(
              (l) => l?.storyId === page.id
            );
            setLikeFound(found ?? true);
          },
          (err) => console.error(err)
        )
      );
    }
  };

  // ── Bookmark ──────────────────────────────────────────────────────────────
  const handleBookmark = (e) => {
    console.log("Bookmark clicked", { bookmarked, currentProfile });
    e.preventDefault();
    if (!currentProfile) return setError("Please Sign Up");

    if (bookmarked) {
      // bookmarked is an stc entry — use stc.id
      dispatch(deleteStoryFromCollection({ stId: bookmarked.id })).then((res) =>
        checkResult(
          res,
          () => setBookmarked(null),
          (err) => setError("Error removing bookmark: " + err.message)
        )
      );
    } else {
      const homePtc = currentProfile.profileToCollections?.find(
        (ptc) => ptc?.type === "home"
      );
      

      if (!homePtc?.collectionId) return;

      dispatch(
        addStoryListToCollection({
          id: homePtc.collectionId,
          list: [page],
          profile: currentProfile,
        })
      ).then((res) =>
        checkResult(
          res,
          (payload) => {
            const stc = payload.collection?.storyIdList?.find(
              (s) => s.storyId === page.id
            );
            setBookmarked(stc ?? null);
            setSuccess("Added Successfully");
            sendGAEvent("story_bookmark", { story_id: page.id, source: storySource });
          },
          () => setError("Error Bookmarking")
        )
      );
    }
  };

  // ── Comment / open story ──────────────────────────────────────────────────
  const handleClickComment = () => {
    if (!page) return;
    sendGAEvent("story_review_open", { story_id: page.id, source: storySource });
    router.push(Paths.page.createRoute(page.id));
  };

  // ── Share ─────────────────────────────────────────────────────────────────
  const onClickShare = () => {
    openDialog({
      isOpen: true,
      title: null,
      scrollY: false,
      height: 50,
      text: (
        <ShareList
          page={page}
          profile={currentProfile}
          bookmark={bookmarked}
          setBookmarked={setBookmarked}
        />
      ),
      agree: null,
      agreeText: null,
      breakpoint: 0.95,
    });
  };

  // ── Guards ────────────────────────────────────────────────────────────────
  if (!page) {
    return <span className="skeleton w-[100%] h-[20em]" />;
  }

  if (!canSee) return null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={`mt-3 mx-auto rounded-2xl ${theme.card}`}>
      {/* Header */}
      <IonCardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div onClick={() => router.push(Paths.profile.createRoute(page.author.id))}>
            <ProfileCircle includeUsername={false} profile={page.author} />
          </div>
          <div className="flex flex-col">
            <IonText className={`text-sm font-semibold ${theme.headerText}`}>
              {page.author?.username}
            </IonText>
            <IonText className={`text-xs ${theme.subText}`}>{page.title}</IonText>
          </div>
        </div>
      </IonCardHeader>

      {/* Content */}
      <IonCardContent className="pt-0">
        {page.description && (
          <IonText
            className={`text-sm ${theme.contentText} leading-relaxed line-clamp-3`}
          >
            {page.description}
          </IonText>
        )}
        <div
          className={`mt-3 rounded-2xl overflow-hidden border ${theme.softBg}`}
        >
          <DataElement isGrid={isGrid} shortenTo={shortenTo} page={page} />
        </div>
      </IonCardContent>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={handleApprovalClick} className={theme.primaryBtn(!!likeFound)}>
            Yea
          </button>
          <button onClick={handleClickComment} className={theme.iconBtn}>
            Comment
          </button>
          <button onClick={onClickShare} className={theme.iconBtn}>
            ⤴
          </button>
        </div>

        <button onClick={handleBookmark} className={theme.bookmarkBtn}>
          <IonImg
            className="w-5 h-5"
            src={bookmarked ? bookmarkfill : bookmarkoutline}
          />
        </button>
      </div>
    </div>
  );
}

export default React.memo(DashboardItem);