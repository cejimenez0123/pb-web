

import { useEffect, useState } from "react";
import { useDialog } from "../../domain/usecases/useDialog";
import ShareList from "./ShareList";
import { useDispatch } from "react-redux";
import { addStoryListToCollection, deleteStoryFromCollection } from "../../actions/CollectionActions";
import checkResult from "../../core/checkResult";
import { useAlert } from "../../core/useAlert";
import styles from "../../styles/style";

export default function PageViewButtonRow({
  page,
  authorProfile,
  profile,
  setCommenting,
}) {

const [bookmarked, setBookmarked] = useState(false);
const [savingBookmark, setSavingBookmark] = useState(false);
const [archiveCol, setArchiveCol] = useState(null);
useEffect(() => {
  const isSaved = archiveCol?.storyIdList?.some(
    (item) => item.storyId === page?.id
  );

  setBookmarked(Boolean(isSaved));
}, [archiveCol?.storyIdList, page?.id]);
  const dispatch = useDispatch();
  const { openDialog } = useDialog();
  const { showAlert } = useAlert();

  useEffect(() => {
    const archive = profile?.profileToCollections?.find(
      (item) => item.type === "archive"
    )?.collection;

    setArchiveCol(archive || null);
  }, [profile]);
const handleBookmark = async () => {
  if (savingBookmark || !page?.id) return;

  if (!archiveCol?.id) {
    showAlert({
      message: "Your archive isn't available yet. Please try again.",
      type: "error",
    });
    return;
  }

  setSavingBookmark(true);

  try {
    const bookmarkRelation = archiveCol.storyIdList?.find(
  (item) => item.storyId === page.id
);

if (bookmarkRelation) {
  console.log(bookmarkRelation)
  const result = await dispatch(
    deleteStoryFromCollection({
      stId: bookmarkRelation.id,
    })
  );

   


      checkResult(
        result,
        () => {
          setArchiveCol((prev) => ({
            ...prev,
            storyIdList: prev.storyIdList.filter(
              (item) => item.id !== bookmarkRelation.id
            ),
          }));

          setBookmarked(false);

          showAlert({
            message: "Removed from your archive.",
            type: "success",
          });
        },
        (error) => {
          console.error(error);

          showAlert({
            message: "Couldn't remove this story from your archive.",
            type: "error",
          });
        }
      );
    } else {
      // ADD BOOKMARK
      const result = await dispatch(
        addStoryListToCollection({
          id: archiveCol.id,
          list: [page.id],
          profile,
        })
      );

      checkResult(
        result,
        () => {
          // Your add endpoint returns the updated collection.
          const updatedCollection = result.payload?.collection;

          if (updatedCollection) {
            setArchiveCol(updatedCollection);
          }

          setBookmarked(true);

          showAlert({
            message: "Saved to your archive.",
            type: "success",
          });
        },
        (error) => {
          console.error(error);

          showAlert({
            message: "Couldn't save this story. Please try again.",
            type: "error",
          });
        }
      );
    }
  } catch (error) {
    console.error("Bookmark error:", error);

    showAlert({
      message: error?.message || "Something went wrong. Please try again.",
      type: "error",
    });
  } finally {
    setSavingBookmark(false);
  }
};
//  const handleBookmark = async () => {
//   if (bookmarked || savingBookmark) return;

//   if (!archiveCol?.id) {
//     showAlert({
//       message: "Your archive isn't available yet. Please try again.",
//       type: "error",
//     });
//     return;
//   }

//   if (!page?.id) return;

//   setSavingBookmark(true);

//   try {
//     const result = await dispatch(
//       addStoryListToCollection({
//         id: archiveCol.id,
//         list: [page.id],
//         profile,
//       })
//     );

//     checkResult(
//       result,
//       () => {
//         setBookmarked(true);

//         showAlert({
//           message: "Saved to your archive.",
//           type: "success",
//         });
//       },
//       (err) => {
//         console.log(err)
//         showAlert({
//           message: "Couldn't save this story. Please try again.",
//           type: "error",
//         });
//       }
//     );
//   } catch (error) {
//     console.log("x")
//     console.log(error)
//     showAlert({
//       message: error?.message || "Couldn't save this story. Please try again.",
//       type: "error",
//     });
//   } finally {
//     setSavingBookmark(false);
//   }
// };

  const onClickShare = () => {
    openDialog({
      isOpen: true,
      title: null,
      height: 50,
      scrollY: false,
      text: (
        <ShareList
          page={page}
          authorProfile={authorProfile}
          profile={profile}
          archive={archiveCol}
          bookmark={bookmarked}
          setArchive={setArchiveCol}
          setBookmarked={setBookmarked}
        />
      ),
      agree: null,
      agreeText: null,
      breakpoint: 0.95,
    });
  };

  if (!page || !profile) return null;

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      {/* Primary action */}
      <div
        type="button"
        onClick={setCommenting}
       className={[styles.button.base,styles.button.primary].join(" ")}

     
      >
        Comment
      </div>

      {/* Secondary actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClickShare}
          aria-label="Share story"
          className={styles.button.iconUtility}
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
<button
  type="button"
  onClick={handleBookmark}
  disabled={savingBookmark}
  aria-label={
    savingBookmark
      ? "Updating archive"
      : bookmarked
        ? "Remove from archive"
        : "Save to archive"
  }
  aria-pressed={bookmarked}
  className={`${styles.button.iconUtility} ${
    bookmarked ? styles.button.utilityActive : ""
  } disabled:cursor-wait disabled:opacity-70`}
>
  {savingBookmark ? (
    <span className="loading loading-spinner loading-sm" />
  ) : bookmarked ? (
    // Filled bookmark
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5,21V5Q5,4.17 5.59,3.59T7,3h6q0,0.57 0,1q0,0.42 0,1H7V17.95l5-2.15l5,2.15V11q0.57 0 1,0t1,0V21l-7-3L5,21ZM7,5h6H12H7ZM17,9V7H15V5h2V3h2V5h2V7H19V9H17Z" />
    </svg>
  ) : (
    // Unfilled bookmark
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5,21V5Q5,4.17 5.59,3.59T7,3H17q0.82,0 1.41,0.59T19,5V21l-7-3L5,21Z" />
    </svg>
  )}
</button>
 {/* <button
  type="button"
  onClick={handleBookmark}
  disabled={bookmarked || savingBookmark}
  aria-label={
    savingBookmark
      ? "Saving to archive"
      : bookmarked
        ? "Saved to archive"
        : "Save to archive"
  }
  aria-pressed={bookmarked}
  className={`${styles.button.iconUtility} ${
    bookmarked ? styles.button.utilityActive : ""
  } disabled:cursor-default disabled:opacity-70`}
>
  {savingBookmark ? (
    <span className="loading loading-spinner loading-sm" />
  ) : bookmarked?(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height="28px"
      width="28px"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5,21V5Q5,4.17 5.59,3.59T7,3h6q0,0.57 0,1q0,0.42 0,1H7V17.95l5-2.15l5,2.15V11q0.57 0 1,0t1,0V21l-7-3L5,21ZM7,5h6H12H7ZM17,9V7H15V5h2V3h2V5h2V7H19V9H17Z" />
    </svg>
  ):<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M5,21V5Q5,4.17 5.59,3.59T7,3H17q0.82,0 1.41,0.59T19,5V21l-7-3L5,21Z"/></svg>}
</button> */}
      </div>
    </div>
  );
}
