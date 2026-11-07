
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "../core/useAlert";

function Alert() {
  const { alert, closeAlert } = useAlert();

  useEffect(() => {
    if (!alert?.isOpen) return;
    if (alert.type === "prompt") return;

    const timer = setTimeout(closeAlert, 4000);

    return () => clearTimeout(timer);
  }, [alert?.isOpen, alert?.type, closeAlert]);

  const isPrompt = alert?.type === "prompt";
  const isSuccess = alert?.type === "success";

  return (
    <AnimatePresence>
      {alert?.isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="
  pointer-events-none
  fixed
  inset-x-0
  z-[100000]
  mx-auto
  w-[calc(100%-1rem)]
  max-w-3xl
  px-0

top-[calc(env(safe-area-inset-top,0px)+2.5rem)]

  sm:top-[calc(env(safe-area-inset-top,0px)+1.75rem)]

  motion-reduce:transition-none
"
          // className="
          //   pointer-events-none
          //   fixed
          //   inset-x-0
          //   top-4
          //   z-[100000]
          //   mx-auto
          //   w-[calc(100%-1rem)]
          //   max-w-[42rem]
          //   px-0
          //   sm:top-6
          //   sm:w-[calc(100%-2rem)]
          //   md:top-8
          //   motion-reduce:transition-none
          // "
          aria-live={isPrompt ? "assertive" : "polite"}
          aria-atomic="true"
        >
          <div
            role={isPrompt ? "dialog" : "alert"}
            aria-modal={isPrompt ? "true" : undefined}
            onClick={
              !isPrompt
                ? closeAlert
                : undefined
            }
            className={`
              pointer-events-auto
              overflow-hidden
              rounded-2xl
              border
              shadow-lg
              backdrop-blur-md

              ${
                isPrompt
                  ? `
                    border-plumb-borderStrong
                    bg-plumb-surface
                    text-plumb-ink
                    dark:border-plumb-darkBorderStrong
                    dark:bg-plumb-dark-surface
                    dark:text-plumb-darkText
                  `
                  : isSuccess
                  ? `
                    border-plumb-mint
                    bg-plumb-surface
                    text-plumb-ink
                    dark:border-plumb-mintLight
                    dark:bg-plumb-dark-surface
                    dark:text-plumb-darkText
                  `
                  : `
                    border-plumb-borderStrong
                    bg-plumb-surface
                    text-plumb-ink
                    dark:border-plumb-darkBorderStrong
                    dark:bg-plumb-dark-surface
                    dark:text-plumb-darkText
                  `
              }

              ${
                !isPrompt
                  ? "cursor-pointer active:scale-[0.995]"
                  : ""
              }

              transition-transform
              duration-150
              motion-reduce:transition-none
            `}
          >
            <div
              className="
                flex
                w-[100%]
                items-start
                gap-3
                px-4
                py-4
                sm:px-5
              "
            >
              {/* STATUS ICON */}
              {!isPrompt && (
                <span
                  className={`
                    mt-0.5
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    rounded-full

                    ${
                      isSuccess
                        ? `
                          bg-plumb-mint/10
                          text-plumb-mintHover
                          dark:bg-plumb-mintLight/10
                          dark:text-plumb-mintLight
                        `
                        : `
                          bg-plumb-border
                          text-plumb-ink
                          dark:bg-plumb-darkBorder
                          dark:text-plumb-darkText
                        `
                    }
                  `}
                  aria-hidden="true"
                >
                  {isSuccess ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                      <path d="M10.3 3.6 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
                    </svg>
                  )}
                </span>
              )}

              {/* MESSAGE */}
              <div className="min-w-0 flex-1">
                <p
                  className={`
                    whitespace-pre-wrap
                    break-words
                    font-medium
                    leading-6
                    ${
                      isPrompt
                        ? "text-base sm:text-[1.05rem]"
                        : "text-sm sm:text-base"
                    }
                    text-plumb-ink
                    dark:text-plumb-darkText
                  `}
                >
                  {alert.message}
                </p>
              </div>

              {/* DISMISS */}
              {!isPrompt && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    closeAlert();
                  }}
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-plumb-muted
                    hover:bg-plumb-border
                    hover:text-plumb-ink
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-plumb-focus
                    dark:text-plumb-darkMuted
                    dark:hover:bg-plumb-darkBorder
                    dark:hover:text-plumb-darkText
                  "
                  aria-label="Dismiss notification"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6 6 18" />
                  </svg>
                </button>
              )}
            </div>

            {/* PROMPT ACTIONS */}
            {isPrompt && (
  <div
    className="
      flex
      items-center
      justify-end
      gap-3
      border-t
      border-plumb-border
      bg-plumb-surface
      px-4
      py-3
      dark:border-plumb-darkBorder
      dark:bg-plumb-dark-surface
      sm:px-5
    "
  >
    <button
      type="button"
      onClick={closeAlert}
      className="
        flex
        min-h-10
        items-center
        justify-center
        rounded-full
        border
        border-plumb-borderStrong
        bg-transparent
        px-5
        text-sm
        font-medium
        text-plumb-ink
        transition-colors
        hover:bg-plumb-border
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-plumb-focus
        dark:border-plumb-darkBorderStrong
        dark:bg-transparent
        dark:text-plumb-darkText
        dark:hover:bg-plumb-darkBorder
      "
    >
      {alert.disagreeText ?? "Dismiss"}
    </button>

    <button
      type="button"
      onClick={() => {
        const onAgree = alert.agree;
        closeAlert();
        onAgree?.();
      }}
      className="
        flex
        min-h-10
        items-center
        justify-center
        rounded-full
        bg-plumb-mint
        px-5
        text-sm
        font-semibold
        text-white
        transition-colors
        hover:bg-plumb-mintHover
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-plumb-focus
        focus-visible:ring-offset-2
        focus-visible:ring-offset-plumb-surface
        dark:focus-visible:ring-offset-plumb-dark-surface
      "
    >
      {alert.agreeText || "Confirm"}
    </button>
  </div>
)}
            {/* {isPrompt && (
           <div
  className="
    flex
    flex-wrap
    items-center
    justify-end
    gap-2
    border-t
    border-plumb-border
    bg-plumb-surface
    px-4
    py-3
    dark:border-plumb-darkBorder
    dark:bg-plumb-dark-surface
    sm:px-5
  "


              >
                <button
                  type="button"
                  onClick={closeAlert}
                  className="
                    min-h-10
                    rounded-full
                    border
                    border-plumb-borderStrong
                    px-4
                    text-sm
                    font-medium
                    text-plumb-ink
                    transition-colors
                    hover:bg-plumb-border
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-plumb-focus
                  
                  "
                >
                  {alert.disagreeText ?? "Dismiss"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    alert.agree?.();
                    closeAlert();
                  }}
                  className="
                    min-h-10
                    rounded-full
                    bg-plumb-mint
                    px-4
                    text-sm
                    font-semibold
                    text-white
                    transition-colors
                    hover:bg-plumb-mintHover
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-plumb-focus
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-plumb-surface
                    dark:focus-visible:ring-offset-plumb-dark-surface
                  "
                >
                  {alert.agreeText || "Confirm"}
                </button>
              </div>
            )} */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Alert;