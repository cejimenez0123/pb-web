import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HashtagForm from "../hashtag/HashtagForm";
import styles from "../../styles/style";

const DELETE_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="21"
    height="21"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M7 21q-.82 0-1.41-.59T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .82-.59 1.41T17 21H7ZM7 6v13h10V6H7Zm2 11h2V8H9v9Zm4 0h2V8h-2v9Z" />
  </svg>
);

const TAG_ICON = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);

function EditorFooter({ pageInView, effectiveId, openConfirmDeleteDialog }) {
  const [openHashtag, setOpenHashtag] = useState(false);
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isEditorRoute = pathname.split("/").pop() !== "edit";
  const isExistingStory = Boolean(
    effectiveId && isEditorRoute && effectiveId !== "new"
  );
console.log(effectiveId+" x")
  return (
    <AnimatePresence>
      {isExistingStory && (
        <motion.div
          className="flex flex-col px-1"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <div className="my-4 flex items-center justify-between gap-3">
            <div
              type="button"
              onClick={() => setOpenHashtag((previous) => !previous)}
              aria-expanded={openHashtag}
              aria-controls="editor-hashtag-panel"
              className={styles.button.base+"inline-flex min-h-11  items-center gap-2 border bg-plumb-blueSea dark:bg-transparent dark:text-plumb-blueSea text-plumb-darkText dark:border-plumb-blueSea text-plumb-blueSea  border-2 px-4 text-sm  font-semibold  transition-all duration-200 hover:border-plumb-mint active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plumb-mint  dark:hover:border-plumb-mintLight dark:hover:bg-plumb-dark-elevated"
              }
            >
              {TAG_ICON}
              <h5 className="-translate-y-1">{openHashtag ? "Close tags" : "Tags"}</h5>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`transition-transform duration-200 ${openHashtag ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            <div
              type="button"
              onClick={openConfirmDeleteDialog}
              aria-label="Delete story"
              className={styles.button.base+" group inline-flex min-h-11 items-center  gap-2 rounded-2xl border border-red-600/90 dark:bg-transparent dark:text-red-600/90 border-2  px-4 py-3 text-sm font-semibold transition-all bg-red-600/90 text-plumb-darkText px-6 duration-200 hover:border-red-300 hover:bg-red-100 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 dark:border-red-900/70   dark:hover:border-red-700  dark:hover:bg-red-950/50"
              }>
              {DELETE_ICON}
              <span>Delete</span>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {openHashtag && (
              <motion.div
                id="editor-hashtag-panel"
                key="hashtag-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border  border-plumb-border  p-4 dark:border-plumb-darkBorder ">
                  {pageInView?.hashtags?.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {pageInView.hashtags.map((tag, index) => (
                        <span
                          key={tag?.id || tag?.name || `${tag}-${index}`}
                          className="rounded-full border border-plumb-border px-3 py-2 text-xs font-medium dark:border-plumb-darkBorder  "
                        >
                          #{tag?.name ?? tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <HashtagForm 
               effectiveId={ effectiveId}
                  item={pageInView} type="story" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EditorFooter;
