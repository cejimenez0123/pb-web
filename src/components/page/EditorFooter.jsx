import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HashtagForm from "../hashtag/HashtagForm";
import deleteIcon from "../../images/icons/delete.svg"
function EditorFooter({ pageInView, effectiveId, openConfirmDeleteDialog }) {
  const [openHashtag, setOpenHashtag] = useState(false);


return(<AnimatePresence><motion.div
  className="flex flex-col"
  initial={{ opacity: 0 }}
  animate={{ opacity: effectiveId && effectiveId !== "new" ? 1 : 0 }}
  transition={{ duration: 0.3, ease: "easeIn" }}
><div className="flex my-4 items-center justify-between">
  {(effectiveId && effectiveId !== "new") && <button
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
  </button>}

  {/* Trash inline */}
  {effectiveId && effectiveId !== "new" && (
    <button
      onClick={openConfirmDeleteDialog}
      className="flex flex-col items-center rounded-full dark:bg-text-primary bg-golden gap-1.5 group"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
  
        <img src={deleteIcon} className="max-h-8 max-w-8"/>
      {/* </div> */}
      <span className="text-[11px] text-white group-hover:text-red-400 transition-colors">Delete</span>
    </button>
  )}

  </div>
  <div className="mt-2">
       <AnimatePresence initial={false}>
       {openHashtag && (
          <motion.div
            key="hashtag-panel"
            initial={{ opacity: 0 }}
  animate={{ opacity: effectiveId && effectiveId !== "new" ? 1 : 0 }}
  transition={{ duration: 0.3, ease: "easeIn" }}
            exit={{ height: 0, opacity: 0 }}
            // transition={{ type: "spring", stiffness: 280, damping: 28 }}
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

</motion.div>
</AnimatePresence>)
}

export default EditorFooter;