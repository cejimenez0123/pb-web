
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { useDialog } from "../../domain/usecases/useDialog";
import ShareList from "./ShareList";

import {
  addStoryListToCollection,
  deleteStoryFromCollection,
} from "../../actions/CollectionActions";

import checkResult from "../../core/checkResult";
import { useAlert } from "../../core/useAlert";
import styles from "../../styles/style";

const fullBookmark = (
  <svg
    viewBox="0 0 24 24"
    width="28"
    height="28"
    className="text-plumb-mint dark:text-plumb-mintLight"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M5,21V5Q5,4.17 5.59,3.59T7,3h6q0,0.57 0,1q0,0.42 0,1H7V17.95l5-2.15l5,2.15V11q0.57 0 1,0t1,0V21l-7-3L5,21ZM7,5h6H12H7ZM17,9V7H15V5h2V3h2V5h2V7H19V9H17Z" />
  </svg>
);

const unfillBookmark = (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    className="text-plumb-mint dark:text-plumb-mintLight"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M5,21V5Q5,4.17 5.59,3.59T7,3H17q0.82,0 1.41,0.59T19,5V21l-7-3L5,21Z" />
  </svg>
);

export default function PageViewButtonRow({
  page,
  authorProfile,
  profile,
  setCommenting,
}) {
  const dispatch = useDispatch();
  const { openDialog } = useDialog();
  const { showAlert } = useAlert();

  const bookmarkLock = useRef(false);

  const [homeCol, setHomeCol] = useState(null);
  const [archiveCol, setArchiveCol] = useState(null);

  const [archiveBookmarked, setArchiveBookmarked] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);

  // Resolve Home and Archive collections from the loaded profile.
  useEffect(() => {
    const collections = profile?.profileToCollections ?? [];

    setHomeCol(
      collections.find(({ type }) => type === "home")?.collection ?? null
    );

    setArchiveCol(
      collections.find(({ type }) => type === "archive")?.collection ?? null
    );
  }, [profile]);

  // Archive state is owned by ShareList, not the Home bookmark button.
  useEffect(() => {
    const isSaved = archiveCol?.storyIdList?.some(
      ({ storyId }) => storyId === page?.id
    );

    setArchiveBookmarked(Boolean(isSaved));
  }, [archiveCol, page?.id]);

  // The button-row bookmark always reflects Home.
  const homeBookmarked = Boolean(
    homeCol?.storyIdList?.some(({ storyId }) => storyId === page?.id)
  );

  const handleBookmark = async () => {
    if (bookmarkLock.current || !page?.id || !profile) return;

    if (!homeCol?.id) {
      showAlert({
        message: "Your Home collection isn't available yet. Please try again.",
        type: "error",
      });
      return;
    }

    bookmarkLock.current = true;
    setSavingBookmark(true);

    const existingRelation = homeCol.storyIdList?.find(
      ({ storyId }) => storyId === page.id
    );

    try {
      const result = existingRelation
        ? await dispatch(
            deleteStoryFromCollection({
              stId: existingRelation.id,
            })
          )
        : await dispatch(
            addStoryListToCollection({
              id: homeCol.id,
              list: [page.id],
              profile,
            })
          );

      checkResult(
        result,
        () => {
          if (existingRelation) {
            setHomeCol((current) => ({
              ...current,
              storyIdList: (current?.storyIdList ?? []).filter(
                ({ id }) => id !== existingRelation.id
              ),
            }));
          } else {
            // Use the updated collection returned by the add action.
            const updatedCollection =
              result.payload?.collection ?? result.payload;

            if (updatedCollection?.storyIdList) {
              setHomeCol(updatedCollection);
            }
          }

          showAlert({
            message: existingRelation
              ? "Removed from Home."
              : "Saved to Home.",
            type: "success",
          });
        },
        (error) => {
          console.error("Home bookmark error:", error);

          showAlert({
            message: existingRelation
              ? "Couldn't remove this story from Home."
              : "Couldn't save this story. Please try again.",
            type: "error",
          });
        }
      );
    } catch (error) {
      console.error("Home bookmark error:", error);

      showAlert({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      bookmarkLock.current = false;
      setSavingBookmark(false);
    }
  };

  const onClickShare = () => {
    openDialog({
      title: "Doing more",
      text: (
        <ShareList
          page={page}
          authorProfile={authorProfile}
          profile={profile}
          archive={archiveCol}
          bookmark={archiveBookmarked}
          setArchive={setArchiveCol}
          setBookmarked={setArchiveBookmarked}
        />
      ),
    });
  };

  if (!page || !profile) return null;

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <button
        type="button"
        onClick={setCommenting}
        className={`${styles.button.base} ${styles.button.primary}`}
      >
        Comment
      </button>

      <div className="flex items-center gap-2">
        {/* Share / Archive actions */}
        <button
          type="button"
          onClick={onClickShare}
          aria-label="More sharing options"
          className="text-plumb-mint dark:text-plumb-mintLight"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[26px] w-[26px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 16V3" />
            <path d="m7 8 5-5 5 5" />
            <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
          </svg>
        </button>

        {/* Home bookmark */}
        <button
          type="button"
          onClick={handleBookmark}
          disabled={savingBookmark}
          aria-label={
            savingBookmark
              ? "Updating Home"
              : homeBookmarked
                ? "Remove from Home"
                : "Save to Home"
          }
          aria-pressed={homeBookmarked}
          className={`${styles.button.iconUtility} ${
            homeBookmarked ? styles.button.utilityActive : ""
          } disabled:cursor-wait disabled:opacity-70`}
        >
          {savingBookmark ? (
            <span className="loading loading-spinner loading-sm" />
          ) : !homeBookmarked ? (
            fullBookmark
          ) : (
            unfillBookmark
          )}
        </button>
      </div>
    </div>
  );
}

// import { useEffect, useRef, useState } from "react";
// import { useDispatch } from "react-redux";

// import { useDialog } from "../../domain/usecases/useDialog";
// import ShareList from "./ShareList";

// import {
//   addStoryListToCollection,
//   deleteStoryFromCollection,
// } from "../../actions/CollectionActions";

// import checkResult from "../../core/checkResult";
// import { useAlert } from "../../core/useAlert";
// import styles from "../../styles/style";
// const fullBookmark =    (<svg
//       viewBox="0 0 24 24"
//       width="28"
//       height="28"
//    className="dark:text-plumb-mintLight text-plumb-mint "
//       fill="currentColor"
//       aria-hidden="true"
//     >
//       <path d="M5,21V5Q5,4.17 5.59,3.59T7,3h6q0,0.57 0,1q0,0.42 0,1H7V17.95l5-2.15l5,2.15V11q0.57 0 1,0t1,0V21l-7-3L5,21ZM7,5h6H12H7ZM17,9V7H15V5h2V3h2V5h2V7H19V9H17Z" />
//     </svg>
//   ) 


// const unfillBookmark = (   <svg
//       viewBox="0 0 24 24"
//       width="24"
//       height="24"
//         className="dark:text-plumb-mintLight text-plumb-mint "
//       fill="currentColor"
//       aria-hidden="true"
//     >
//       <path d="M5,21V5Q5,4.17 5.59,3.59T7,3H17q0.82,0 1.41,0.59T19,5V21l-7-3L5,21Z" />
//     </svg>)
// export default function PageViewButtonRow({
//   page,
//   authorProfile,
//   profile,
//   setCommenting,
// }) {
//   const dispatch = useDispatch();
//   const { openDialog } = useDialog();
//   const { showAlert } = useAlert();

//   // Prevent duplicate requests before React has time to rerender.
//   const bookmarkLock = useRef(false);

//   // Collections
//   const [homeCol, setHomeCol] = useState(null);
//   const [archiveCol, setArchiveCol] = useState(null);

//   // Archive state belongs to ShareList.
//   const [archiveBookmarked, setArchiveBookmarked] = useState(false);

//   const [savingBookmark, setSavingBookmark] = useState(false);

//   // Resolve collections from the already-loaded profile.
//   useEffect(() => {
//     const collections = profile?.profileToCollections || [];

//     setHomeCol(
//       collections.find((item) => item.type === "home")?.collection || null
//     );

//     setArchiveCol(
//       collections.find((item) => item.type === "archive")?.collection || null
//     );
//   }, [profile]);

//   // Archive bookmark state is independent of Home.
//   useEffect(() => {
//     const isSaved = archiveCol?.storyIdList?.some(
//       (item) => item.storyId === page?.id
//     );

//     setArchiveBookmarked(Boolean(isSaved));
//   }, [archiveCol?.storyIdList, page?.id]);

//   // Home determines the button-row bookmark state.
//   const homeBookmarked = Boolean(
//     homeCol?.storyIdList?.some(
//       (item) => item.storyId === page?.id
//     )
//   );

//   const handleBookmark = async () => {
//     if (bookmarkLock.current || !page?.id || !profile) return;

//     if (!homeCol?.id) {
//       showAlert({
//         message: "Your home collection isn't available yet. Please try again.",
//         type: "error",
//       });
//       return;
//     }

//     bookmarkLock.current = true;
//     setSavingBookmark(true);

//     try {
//       const existingRelation = homeCol.storyIdList?.find(
//         (item) => item.storyId === page.id
//       );

//       const result = existingRelation
//         ? await dispatch(
//             deleteStoryFromCollection({
//               stId: existingRelation.id,
//             })
//           )
//         : await dispatch(
//             addStoryListToCollection({
//               id: homeCol.id,
//               list: [page.id],
//               profile,
//             })
//           );

//       checkResult(
//         result,
//         () => {
//           if (existingRelation) {
//             setHomeCol((prev) => ({
//               ...prev,
//               storyIdList: (prev.storyIdList || []).filter(
//                 (item) => item.id !== existingRelation.id
//               ),
//             }));
//           } else {
//             // The add endpoint returns the updated collection.
//             const updatedCollection = result.payload?.collection;

//             if (updatedCollection) {
//               setHomeCol(updatedCollection);
//             }
//           }

//           showAlert({
//             message: existingRelation
//               ? "Removed from Home."
//               : "Saved to Home.",
//             type: "success",
//           });
//         },
//         (error) => {
//           console.error("Home bookmark error:", error);

//           showAlert({
//             message: existingRelation
//               ? "Couldn't remove this story from Home."
//               : "Couldn't save this story. Please try again.",
//             type: "error",
//           });
//         }
//       );
//     } catch (error) {
//       console.error("Home bookmark error:", error);

//       showAlert({
//         message: "Something went wrong. Please try again.",
//         type: "error",
//       });
//     } finally {
//       bookmarkLock.current = false;
//       setSavingBookmark(false);
//     }
//   };

//   const onClickShare = () => {
//     openDialog({
//       title:"Doing more",

//       text: (
//         <ShareList
//           page={page}
//           authorProfile={authorProfile}
//           profile={profile}
//           archive={archiveCol}
//           bookmark={archiveBookmarked}
//           setArchive={setArchiveCol}
//           setBookmarked={setArchiveBookmarked}
//         />
//       ),
 
//     });
//   };

//   if (!page || !profile) return null;

//   return (
//     <div className="flex items-center justify-between gap-3 px-4 py-3">
//       {/* Primary action */}
//       <div
//         type="button"
//         onClick={setCommenting}
//         className={styles.button.base + " " + styles.button.primary}
//       >
//         Comment
//       </div>

//       {/* Secondary actions */}
//       <div className="flex items-center gap-2">
//         {/* Share */}
//         <button
//           type="button"
//           onClick={onClickShare}
//           aria-label="Share story"
//           className="text-plumb-mint dark:text-plumb-mintLight"
//           // className={styles.button.iconUtility}
//         >
//           <svg
//             viewBox="0 0 24 24"
//             className="h-[26px] w-[26px]"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="1.7"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             aria-hidden="true"
//           >
//             <path d="M12 16V3" />
//             <path d="m7 8 5-5 5 5" />
//             <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
//           </svg>
//         </button>

//         {/* Save to Home */}
//         <button
//           type="button"
//           onClick={handleBookmark}
//           disabled={savingBookmark}
//           aria-label={
//             savingBookmark
//               ? "Updating Home"
//               : homeBookmarked
//                 ? "Remove from Home"
//                 : "Save to Home"
//           }
//           aria-pressed={homeBookmarked}
//           className={`${styles.button.iconUtility} ${
//             homeBookmarked ? styles.button.utilityActive : ""
//           } disabled:cursor-wait disabled:opacity-70`}
//         >
//           {savingBookmark ? (
//             <span className="loading loading-spinner loading-sm" />
//           ) : homeBookmarked? fullBookmark:unfillBookmark

//           }
//         </button>
//       </div>
//     </div>
//   );
// }

