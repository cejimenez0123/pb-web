// import { useContext,useEffect,useLayoutEffect, useRef, useState } from 'react'
// import "../../Dashboard.css"
// import {useDispatch} from 'react-redux'
// import bookmarkfill from "../../images/bookmarkfill.svg"
// import bookmarkoutline from "../../images/bookmarkadd.svg"
// import checkResult from '../../core/checkResult'
// // import Paths from '../../core/paths'

// import { IonImg, useIonRouter } from "@ionic/react";
// import Paths from "../../core/paths";
// import ProfileCircle from "../profile/ProfileCircle";
// import Context from '../../context'
// import { useSelector } from 'react-redux'
// import debounce from '../../core/debounce'
// import Carousel from './Carousel'



// function BookDashboardItem({ book, isGrid }) {
//   const dispatch = useDispatch();
//   const {currentProfile}=useSelector(state=>state.users)
//   const { setError } = useContext(Context);
//   const router = useIonRouter();

//   const [bookmarked, setBookmarked] = useState();

//   useLayoutEffect(() => {
//     if (currentProfile?.profileToCollections) {
//       let archive = currentProfile.profileToCollections.find(
//         (col) => col.type === "archive"
//       );

//       if (book?.parentCollections) {
//         let found = book.parentCollections.find(
//           (ptc) => ptc.parentCollectionId == archive?.collection?.id
//         );
//         setBookmarked(found);
//       }
//     }
//   }, [book, currentProfile]);

//   const handleBookmark = debounce((e) => {
//     e.stopPropagation();

//     if (!currentProfile) return setError("Please Login");

//     if (bookmarked) {
//       dispatch(deleteCollectionFromCollection({ tcId: bookmarked.id }))
//         .then(() => setBookmarked(null));
//     } else {
//       let archive = currentProfile.profileToCollections.find(
//         (col) => col.type === "archive"
//       )?.collection;

//       if (!archive) return setError("Missing archive");

//       dispatch(
//         addCollectionListToCollection({
//           id: archive.id,
//           list: [book.id],
//           profile: currentProfile,
//         })
//       ).then((res) =>
//         checkResult(res, (payload) => {
//           const marked = payload.collection.parentCollections.find(
//             (col) => col.parentCollectionId == archive.id
//           );
//           setBookmarked(marked);
//         })
//       );
//     }
//   }, 10);

//   if (!book) {
//     return (
//       <div className="min-w-[16rem] h-[14rem] rounded-2xl bg-gray-100 animate-pulse" />
//     );
//   }

//   return (
//     <div
//       onClick={() => router.push(Paths.collection.createRoute(book.id))}
//       className="
//         min-w-[16rem]
//         rounded-2xl
//         bg-base-bg
//         border border-blue
//         shadow-sm
//         overflow-hidden
//         active:scale-[0.97]
//         transition-all duration-200
//       "
//     >
//       {/* 🔹 Carousel (Hero) */}
//     <div className="relative w-full  h-fit overflow-hidden">
//   <Carousel book={book} compact={true} />

//         {/* Bookmark floating (iOS style) */}
//         <button
//           onClick={handleBookmark}
//           className="
//             absolute top-3 right-3
//             p-2 rounded-full
//             bg-base-bg/80 backdrop-blur
//             shadow-sm
//             active:scale-90
//             transition
//           "
//         >
//           <IonImg
//             className="w-4 h-4"
//             src={bookmarked ? bookmarkfill : bookmarkoutline}
//           />
//         </button>
//       </div>

//       {/* 🔹 Content */}
//       <div className="p-3 space-y-2">
//         {/* Title */}
//         <h4 className="text-sm font-semibold text-[#003b44] truncate">
//           {book.title || "Untitled"}
//         </h4>

//         {/* Purpose (description) */}
//         {book.description && (
//           <p className="text-xs text-[#003b44]/70 line-clamp-2 leading-relaxed">
//             {book.description}
//           </p>
//         )}

//         {/* Footer */}
//         <div className="flex items-center justify-between pt-2">
//           <ProfileCircle profile={book.profile} includeUsername={false} />

//           <span className="text-[0.7rem] text-[#003b44]/60">
//             {book.storyIdList?.length || 0} items
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default BookDashboardItem
import { useContext, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonText, IonImg, useIonRouter } from "@ionic/react";
import bookmarkfill from "../../images/bookmarkfill.svg";
import bookmarkoutline from "../../images/bookmarkadd.svg";
import checkResult from '../../core/checkResult';
import Paths from "../../core/paths";
import ProfileCircle from "../profile/ProfileCircle";
import Context from '../../context';
import { debounce } from 'lodash';
import Carousel from './Carousel';
import { deleteCollectionFromCollection, addCollectionListToCollection } from '../../actions/CollectionActions';
import ErrorBoundary from '../../ErrorBoundary';

const theme = {
  card: `
    bg-base-bg dark:bg-base-surface
    border border-border-default dark:border-border-soft
    shadow-sm
  `,
  headerText: `text-text-primary dark:text-text-inverse`,
  subText: `text-text-secondary dark:text-text-secondary`,
  softBg: `bg-softBlue/40 dark:bg-base-soft/20`,
  bookmarkBtn: `
    p-2 rounded-full
    bg-softBlue/30 dark:bg-base-soft/20
    active:bg-softBlue/60 dark:active:bg-base-soft/30
    transition active:scale-90
  `,
};

function BookDashboardItem({ book }) {
  const dispatch = useDispatch();
  const { currentProfile } = useSelector(state => state.users);
  const { setError } = useContext(Context);
  const router = useIonRouter();
  const [bookmarked, setBookmarked] = useState(null);

  useLayoutEffect(() => {
    if (!currentProfile?.profileToCollections || !book?.parentCollections) return;
    const archive = currentProfile.profileToCollections.find(col => col.type === "archive");
    const found = book.parentCollections.find(
      ptc => ptc.parentCollectionId == archive?.collection?.id
    );
    setBookmarked(found || null);
  }, [book, currentProfile]);

  const handleBookmark = debounce((e) => {
    e.stopPropagation();
    if (!currentProfile) return setError("Please Login");
    if (bookmarked) {
      dispatch(deleteCollectionFromCollection({ tcId: bookmarked.id }))
        .then(() => setBookmarked(null));
    } else {
      const archive = currentProfile.profileToCollections.find(
        col => col.type === "archive"
      )?.collection;
      if (!archive) return setError("Missing archive");
      dispatch(addCollectionListToCollection({
        id: archive.id,
        list: [book.id],
        profile: currentProfile,
      })).then(res =>
        checkResult(res, (payload) => {
          const marked = payload.collection.parentCollections.find(
            col => col.parentCollectionId == archive.id
          );
          setBookmarked(marked);
        })
      );
    }
  }, 10);

  if (!book) {
    return (
      <div className="skeleton w-full h-[20em] rounded-2xl" />
    );
  }

  return (
    <ErrorBoundary>
      <div
        onClick={() => router.push(Paths.collection.createRoute(book.id))}
        className={`
          mt-3 mx-auto rounded-2xl overflow-hidden
          cursor-pointer select-none
          transition-all duration-200
          active:scale-[0.97] active:opacity-90
          md:hover:shadow-md
          w-full max-w-full
          sm:max-w-lg md:max-w-xl
          ${theme.card}
        `}
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div
            className="flex items-center gap-3 min-w-0"
            onClick={(e) => {
              e.stopPropagation();
              if (book.profile?.id) router.push(Paths.profile.createRoute(book.profile.id));
            }}
          >
            <ProfileCircle includeUsername={false} profile={book.profile} />
            <div className="flex flex-col min-w-0">
              <IonText className={`text-sm font-medium truncate ${theme.headerText}`}>
                {book.profile?.username}
              </IonText>
              <IonText className={`text-xs truncate ${theme.subText}`}>
                {book.title || "Untitled"}
              </IonText>
            </div>
          </div>

          <button
            onClick={handleBookmark}
            className={theme.bookmarkBtn}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <IonImg className="w-5 h-5" src={bookmarked ? bookmarkfill : bookmarkoutline} />
          </button>
        </div>

        {/* Description */}
        {book.description && (
          <div className="px-4 pb-3">
            <IonText className={`text-sm leading-relaxed line-clamp-2 ${theme.subText}`}>
              {book.description}
            </IonText>
          </div>
        )}

        {/* Carousel */}
        {/* <div className={`mx-4 mb-3 rounded-2xl overflow-hidden border ${theme.softBg}`}> */}
          {/* Carousel — only renders if book has content */}
{book.storyIdList?.some(stc => stc?.story?.data) && (
  <div className={`mx-4 mb-3 rounded-2xl overflow-hidden border ${theme.softBg}`}>
    <Carousel book={book} compact={true} />
  </div>
)}
          {/* <Carousel book={book} compact={true} /> */}
        {/* </div> */}

        {/* Footer */}
        <div className="flex items-center justify-between px-4 pb-4 pt-1">
          <IonText className={`text-xs ${theme.subText}`}>
            {book.storyIdList?.length || 0} {book.storyIdList?.length === 1 ? "item" : "items"}
          </IonText>
          <IonText className={`text-xs ${theme.subText}`}>
            {book.type === "library" ? "Community" : "Collection"}
          </IonText>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default BookDashboardItem;