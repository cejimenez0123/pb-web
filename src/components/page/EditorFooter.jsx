import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HashtagForm from "../hashtag/HashtagForm";

function EditorFooter({ pageInView, effectiveId, openConfirmDeleteDialog }) {
  const [openHashtag, setOpenHashtag] = useState(false);

//   return (
//     <div className="max-w-3xl mx-auto w-full px-4 md:px-6">

//       {/* Hashtag tab */}
//       <div className="flex justify-center">
//         <button
//           onClick={() => setOpenHashtag(prev => !prev)}
//           className={`
//             flex items-center gap-2 px-5 py-4 text-sm font-semibold
//             border border-t-0 rounded-2xl transition-all duration-200
//             active:scale-95
//             ${openHashtag
//               ? "bg-button-secondary-bg border-button-secondary-bg text-white"
//               : "bg-base-bg border-soft text-soft hover:border-button-secondary-bg hover:text-button-secondary-bg"
//             }
//           `}
//           style={{ WebkitTapHighlightColor: "transparent" }}
//         >
//           <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <line x1="4" y1="9" x2="20" y2="9"/>
//             <line x1="4" y1="15" x2="20" y2="15"/>
//             <line x1="10" y1="3" x2="8" y2="21"/>
//             <line x1="16" y1="3" x2="14" y2="21"/>
//           </svg>
//           {openHashtag ? "Close tags" : "Tags"}
//           <svg
//             width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
//             strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
//             style={{ transition: "transform 0.25s ease", transform: openHashtag ? "rotate(180deg)" : "rotate(0deg)" }}
//           >
//             <polyline points="6 9 12 15 18 9"/>
//           </svg>
//         </button>
//       </div>

//       {/* Sliding panel */}
//       <AnimatePresence initial={false}>
//         {openHashtag && (
//           <motion.div
//             key="hashtag-panel"
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ type: "spring", stiffness: 280, damping: 28 }}
//             className="overflow-hidden"
//           >
//             <div className="border border-t-0 border-soft rounded-2xl bg-base-bg px-4 py-4">
//               {pageInView?.hashtags?.length > 0 && (
//                 <div className="flex flex-wrap gap-2 mb-3">
//                   {pageInView.hashtags.map((tag, i) => (
//                     <span
//                       key={tag?.id ?? i}
//                       className="px-3 py-4 rounded-full text-xs font-medium
//                         bg-base-soft border border-soft text-soft"
//                     >
//                       #{tag?.name ?? tag}
//                     </span>
//                   ))}
//                 </div>
//               )}
//               <HashtagForm item={pageInView} type="story" />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Trash */}
//       {effectiveId && effectiveId !== "new" && (
//         <div className="flex justify-center pt-12 pb-6">
//           <button
//             onClick={openConfirmDeleteDialog}
//             className="flex flex-col items-center gap-1.5 group"
//             style={{ WebkitTapHighlightColor: "transparent" }}
//           >
//             <div className="
//               w-10 h-10 rounded-full flex items-center justify-center
//               border border-soft bg-base-bg
//               group-hover:border-red-300 group-active:scale-95
//               transition-all duration-200
//             ">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
//                 className="text-soft group-hover:text-red-400 transition-colors">
//                 <polyline points="3 6 5 6 21 6"/>
//                 <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
//                 <path d="M10 11v6M14 11v6"/>
//                 <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
//               </svg>
//             </div>
//             <span className="text-[11px] text-soft group-hover:text-red-400 transition-colors">
//               Delete
//             </span>
//           </button>
//         </div>
//       )}

//     </div>
//   );
return(<div className="flex flex-col"><div className="flex my-4 items-center justify-between">
  <button
    onClick={() => setOpenHashtag(prev => !prev)}
    className={`
      flex items-center gap-2 px-5 py-4 text-sm font-semibold
      border rounded-2xl transition-all duration-200
      active:scale-95
      ${openHashtag
        ? "bg-button-secondary-bg border-button-secondary-bg text-white"
        : "bg-base-bg border-soft text-soft hover:border-button-secondary-bg hover:text-button-secondary-bg"
      }
    `}
    style={{ WebkitTapHighlightColor: "transparent" }}
  >
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9"/>
      <line x1="4" y1="15" x2="20" y2="15"/>
      <line x1="10" y1="3" x2="8" y2="21"/>
      <line x1="16" y1="3" x2="14" y2="21"/>
    </svg>
    {openHashtag ? "Close tags" : "Tags"}
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: "transform 0.25s ease", transform: openHashtag ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </button>

  {/* Trash inline */}
  {effectiveId && effectiveId !== "new" && (
    <button
      onClick={openConfirmDeleteDialog}
      className="flex flex-col items-center gap-1.5 group"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center border border-soft bg-base-bg group-hover:border-red-300 group-active:scale-95 transition-all duration-200">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          className="text-soft group-hover:text-red-400 transition-colors">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
        </svg>
      </div>
      <span className="text-[11px] text-soft group-hover:text-red-400 transition-colors">Delete</span>
    </button>
  )}

  </div>
  <div className="mt-2">
       <AnimatePresence initial={false}>
       {openHashtag && (
          <motion.div
            key="hashtag-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="overflow-hidden"
          >
            <div className="border border-soft rounded-2xl bg-base-bg px-4 ">
              {pageInView?.hashtags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {pageInView.hashtags.map((tag, i) => (
                    <span
                      key={tag?.id ?? i}
                      className="px-3 py-4 rounded-full text-xs font-medium
                        bg-base-soft border border-soft text-soft"
                    >
                      #{tag?.name ?? tag}
                    </span>
                  ))}
                </div>
              )}
              <HashtagForm item={pageInView} type="story" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
</div>)
}

export default EditorFooter;