// // export default function ListPill({
// //   item,
// //   onClick,
// //   profile,
// // }) {
// //   const lastSeen = profile?.lastNotified
// //     ? new Date(profile.lastNotified).getTime()
// //     : Date.now() - 24 * 60 * 60 * 1000;

import styles from "../../styles/style";

// //   let isNew =
// //     item?.updated &&
// //     new Date(item.updated).getTime() > lastSeen;

// //   if (item?.userHistory?.length > 0) {
// //     isNew = false;
// //   }

// //   const title = item?.title?.trim() || "Untitled";

// //   return (
// //     <button
// //       type="button"
// //       onClick={onClick}
// //       className="
// //         group
// //         flex
// //         w-[100%]
// //         items-center
// //         justify-between
// //         gap-3
// //         border-b
// //        dark:border-plumb-darkText
// //        rounded-full
// //         bg-transparent
// //         px-3
// //         py-4
// //         text-left
// //         transition
// //         duration-200
    
// //         active:scale-[0.995]
// //         sm:gap-4
// //         sm:px-4
// //       "
// //     >
// //       <div className="flex min-w-0 flex-1 items-start gap-3">
// //         {isNew && (
// //           <span
// //             aria-label="New"
// //             className="
// //               mt-2
// //               h-2
// //               w-2
// //               shrink-0
// //               rounded-full
// //               bg-emerald-700
// //             "
// //           />
// //         )}

// //         <span
// //           title={title}
// //           className="
// //             min-w-0
// //             flex-1
// //             dark:text-plumb-darkText
// //             overflow-hidden
// //             font-serif
// //             text-[1.05rem]
// //             leading-snug
// //             text-gray-900
// //             transition-colors
// //             duration-200
// //             group-hover:text-emerald-800
// //             line-clamp-2
// //             lg:line-clamp-1
// //           "
// //         >
// //           {title}
// //         </span>
// //       </div>

// //       <span
// //         aria-hidden="true"
// //         className="
// //           shrink-0
// //           pt-0.5
// //           text-lg
// //           leading-none
// //           text-gray-300
// //           transition-all
// //           duration-200
// //           group-hover:translate-x-1
// //           group-hover:text-emerald-700
// //         "
// //       >
// //         →
// //       </span>
// //     </button>
// //   );
// // }
// export default function ListPill({
//   item,
//   onClick,
//   profile,
// }) {
//   const lastSeen = profile?.lastNotified
//     ? new Date(profile.lastNotified).getTime()
//     : Date.now() - 24 * 60 * 60 * 1000;

//   let isNew =
//     item?.updated &&
//     new Date(item.updated).getTime() > lastSeen;

//   if (item?.userHistory?.length > 0) {
//     isNew = false;
//   }

//   const title = item?.title?.trim() || "Untitled";

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       aria-label={title}
//       className="
//         group
//         flex
//         w-[100%]
//         items-center
//         justify-between
//         gap-3
//         rounded-full
//         border-b
//         border-plumb-border
//         bg-transparent
//         px-3
//         py-4
//         text-left
//         transition-colors
//         duration-200
//         hover:bg-plumb-elevated
//         active:scale-[0.995]
//         focus:outline-none
//         focus-visible:ring-2
//         focus-visible:ring-plumb-focus
//         focus-visible:ring-offset-2
//         focus-visible:ring-offset-plumb-surface
//         sm:gap-4
//         sm:px-4
//         dark:border-plumb-darkBorder
//         dark:hover:bg-plumb-dark-surface
//         dark:focus-visible:ring-offset-plumb-dark-canvas
//       "
//     >
//       <div className="flex min-w-0 flex-1 items-start gap-3">
//         {isNew && (
//           <span
//             aria-label="New"
//             className="
//               mt-2
//               h-2
//               w-2
//               shrink-0
//               rounded-full
//               bg-plumb-mint
//             "
//           />
//         )}

//         <span
//           title={title}
//           className="
//             min-w-0
//             flex-1
//             overflow-hidden
//             font-serif
//             text-[1.05rem]
//             leading-snug
//             text-plumb-ink
//             transition-colors
//             duration-200
//             group-hover:text-plumb-mintHover
//             line-clamp-2
//             lg:line-clamp-1
//             dark:text-plumb-darkText
//             dark:group-hover:text-plumb-mintLight
//           "
//         >
//           {title}
//         </span>
//       </div>

//       <span
//         aria-hidden="true"
//         className="
//           shrink-0
//           pt-0.5
//           text-lg
//           leading-none
//           text-plumb-subtle
//           transition-all
//           duration-200
//           group-hover:translate-x-1
//           group-hover:text-plumb-mintHover
//           dark:text-plumb-darkSubtle
//           dark:group-hover:text-plumb-mintLight
//         "
//       >
//         →
//       </span>
//     </button>
//   );
// }

export default function ListPill({   item,
  onClick,
  profile}) {
    let usingItem = null
    let type = null
    if(!!item.collection){
      type = "collection"
      usingItem = item.collection
    }
    if(!!item.story){
      type="story"
      usingItem = item?.story
    }

 const title = item?.title?.trim() || "Untitled";
  return (
    <article className={styles.profile.portfolio.article}>
 
        <ul
         
          className={styles.profile.portfolio.storyList}
       >
              <li
                key={item.id}
                className={styles.profile.portfolio.storyRow+ "    "}
              >
                <div
                  type="button"
                  onClick={onClick
                  }
                  aria-label={`Read ${title}`}
             
                  className={
                    styles.profile.portfolio.storyButton+ styles.button.base+"  "
                  }
                >
                  <div
                    className={
                      styles.profile.portfolio.storyContent+"  border flex flex-row justify-between border-1 rounded-full py-4 border-plumb-accent-blue/40  hover:ring-1 hover:ring-offset-1 px-6 "
                    }
                  >
                    <p
                      className={
                        styles.profile.portfolio.storyTitle
                      }
                    >
                      {title}
                    </p>

       
                      <span
                    aria-hidden="true"
                 className="dark:text-plumb-darkText "
                  >
                    →
                  </span>
                  </div>

                
                </div>
              </li>
            {/* ); */}
          {/* })} */}
        </ul>
     
    </article>
  );
}