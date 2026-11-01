
// import { useEffect, useState } from "react";
// import { useDialog } from "../../domain/usecases/useDialog";
// import ShareList from "./ShareList";
// import { useDispatch } from "react-redux";
// import { addStoryListToCollection } from "../../actions/CollectionActions";
// import checkResult from "../../core/checkResult";
// import { useAlert } from "../../core/useAlert";
// import styles from "../../styles/style";
// export default function PageViewButtonRow({ page, authorProfile ,profile, setCommenting }) {
//   const [likeFound, setLikeFound] = useState(false);
//   const [bookmarked, setBookmarked] = useState(false);
//   const dispatch = useDispatch()
//   const handleApprovalClick = () => setLikeFound(!likeFound);
//   const handleClickComment = () => setCommenting(true);
//   const {openDialog}=useDialog()
//   const {showAlert}=useAlert()
//   const handleBookmark = () => {
    
//     setBookmarked(!bookmarked)
//     dispatch(addStoryListToCollection({id:archiveCol.id, list: [page.id],profile})).then(res=>{
//       checkResult(res,pay=>{
// showAlert("Saved to archive",AlertType.SUCCESS)
//       },err=>{
//         showAlert({message:"Failed to save to archive",type:AlertType.ERROR})
//       })
//     })
   
//   }
//     ;
//     const [homeCol,setHomeCol]=useState(null)
//   const [archiveCol,setArchiveCol]=useState(null)
//   useEffect(()=>{
//     if(profile?.profileToCollections){
//       let ptc =profile?.profileToCollections.find(ptc => ptc.type === "home");
//       ptc && ptc.collection && setHomeCol(ptc.collection)
//     }
//         if(profile?.profileToCollections){
//       let ptc =profile?.profileToCollections.find(ptc => ptc.type === "archive");
//       ptc && ptc.collection && setArchiveCol(ptc.collection)
//     }
//   },[profile])
//   const onClickShare = () => {
//   openDialog({
//       isOpen: true,
//       title: null,
//       height:50,
//       scrollY:false,
//       text: (
//         <ShareList
//           page={page}
//           authorProfile={authorProfile}
//           profile={profile}
//           archive={archiveCol}
//           bookmark={bookmarked}
//           setArchive={setArchiveCol}
//           setBookmarked={setBookmarked}
//         />
//       ),
//       agree: null,
//       agreeText: null,
     
//       breakpoint: .95
//     })
//   };

// if(!page || !profile) return null;
// return (
//   <div className="flex items-center justify-between px-4 py-3">
//     <div className="flex items-center gap-1">
//       <button
//         type="button"
//         onClick={handleApprovalClick}
//         aria-pressed={likeFound}
//         className={`${styles.button.utility} ${
//           likeFound ? styles.button.utilityActive : ""
//         }`}
//       >
//         Yea
//       </button>

//       <button
//         type="button"
//         onClick={handleClickComment}
//         className={styles.button.utility}
//       >
//         Comment
//       </button>

//       <button
//         type="button"
//         onClick={onClickShare}
//         aria-label="Share story"
//         className={styles.button.iconUtility}
//       >
//         <svg
//           viewBox="0 0 24 24"
//           className="h-[26px] w-[26px]"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.7"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           aria-hidden="true"
//         >
//           <path d="M12 16V3" />
//           <path d="m7 8 5-5 5 5" />
//           <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
//         </svg>
//       </button>
//     </div>
//     <button
//   type="button"
//   onClick={handleBookmark}
//   aria-label={bookmarked ? "Remove bookmark" : "Save to archive"}
//   aria-pressed={bookmarked}
//   className={`${styles.button.iconUtility} ${
//     bookmarked ? styles.button.utilityActive : ""
//   }`}
// >
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="26px" width="26px" fill="currentColor"><path d="M5,21V5Q5,4.17 5.59,3.59T7,3h6q0,0.57 0,1q0,0.42 0,1H7V17.95l5-2.15l5,2.15V11q0.57,0 1,0t1,0V21l-7-3L5,21ZM7,5h6H12H7ZM17,9V7H15V5h2V3h2V5h2V7H19V9H17Z"/></svg>

//   {/* <svg
//     viewBox="0 0 24 24"
//     className="h-5 w-5"
//     fill="currentColor"
//     stroke="currentColor"
//     strokeWidth="1.7"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     aria-hidden="true"
//   >
//     {bookmarked ? (
//       <path
//         d="M6 3.75h12v17l-6-3.75-6 3.75v-17Z"
//         fill="currentColor"
//           stroke="currentColor"
//       />
//     ) : (
//       <>
//         <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3h9A1.5 1.5 0 0 1 17 4.5V20l-5.5-3.5L6 20V4.5Z"   fill="currentColor"
//           stroke="currentColor" />
//         <path d="M19 3v6M16 6h6"   fill="currentColor"
//           stroke="currentColor" />
//       </>
//     )}
//   </svg> */}
// </button>


//   </div>
// );

// }

import { useEffect, useState } from "react";
import { useDialog } from "../../domain/usecases/useDialog";
import ShareList from "./ShareList";
import { useDispatch } from "react-redux";
import { addStoryListToCollection } from "../../actions/CollectionActions";
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
  const [archiveCol, setArchiveCol] = useState(null);

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
    if (bookmarked) return;

    if (!archiveCol?.id) {
      showAlert("Your archive isn't available yet. Please try again.");
      return;
    }

    try {
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
          setBookmarked(true);
          showAlert("Saved to archive");
        },
        () => {
          showAlert("Failed to save to archive");
        }
      );
    } catch (error) {
      showAlert("Failed to save to archive");
    }
  };

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
      <button
        type="button"
        onClick={setCommenting}
        className={`${styles.button.primary} min-h-10 px-5`}
      >
        Comment
      </button>

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
          {/* <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
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
          </svg> */}
        </button>

        <button
          type="button"
          onClick={handleBookmark}
          disabled={bookmarked}
          aria-label={bookmarked ? "Saved to archive" : "Save to archive"}
          aria-pressed={bookmarked}
          className={`${styles.button.iconUtility} ${
            bookmarked ? styles.button.utilityActive : ""
          } disabled:cursor-default disabled:opacity-70`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="26px" width="26px" fill="currentColor"><path d="M5,21V5Q5,4.17 5.59,3.59T7,3h6q0,0.57 0,1q0,0.42 0,1H7V17.95l5-2.15l5,2.15V11q0.57,0 1,0t1,0V21l-7-3L5,21ZM7,5h6H12H7ZM17,9V7H15V5h2V3h2V5h2V7H19V9H17Z"/></svg>

          {/* <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {bookmarked ? (
              <path
                d="M6 3.75h12v17l-6-3.75-6 3.75v-17Z"
                fill="currentColor"
              />
            ) : (
              <>
                <path d="M6 3.75h12v17l-6-3.75-6 3.75v-17Z" />
                <path d="M12 8v6M9 11h6" />
              </>
            )}
          </svg> */}
        </button>
      </div>
    </div>
  );
}
