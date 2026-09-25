import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { useDialog } from "../domain/usecases/useDialog";
import SectionHeader from "./SectionHeader";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable]",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const Dialog = () => {
  const {
    dialog,
    resetDialog,
  } = useDialog();

  const [visible, setVisible] =
    useState(false);

  const dialogRef = useRef(null);
  const previousFocusRef =
    useRef(null);

  const resetTimerRef =
    useRef(null);

  /*
   * Synchronize visual state with Redux/dialog state.
   *
   * Important difference from the old implementation:
   * the dialog remains mounted during the exit animation.
   */
  useEffect(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    if (dialog?.isOpen) {
      setVisible(true);
      return;
    }

    if (visible) {
      setVisible(false);

      resetTimerRef.current =
        setTimeout(() => {
          resetDialog();
          resetTimerRef.current = null;
        }, 250);
    }

    return () => {
      if (resetTimerRef.current) {
        clearTimeout(
          resetTimerRef.current
        );
        resetTimerRef.current = null;
      }
    };
  }, [
    dialog?.isOpen,
    resetDialog,
    visible,
  ]);

  /*
   * Remember what had focus before opening.
   */
  useEffect(() => {
    if (!dialog?.isOpen) {
      return;
    }

    previousFocusRef.current =
      document.activeElement;

    return () => {
      if (
        previousFocusRef.current &&
        typeof previousFocusRef.current
          .focus === "function"
      ) {
        previousFocusRef.current.focus();
      }
    };
  }, [dialog?.isOpen]);

  /*
   * Initial focus.
   *
   * Forms normally contain their own autofocus field.
   * If they don't, focus the dialog itself.
   */
  useEffect(() => {
    if (!dialog?.isOpen) {
      return;
    }

    const frame =
      requestAnimationFrame(() => {
        const root = dialogRef.current;

        if (!root) {
          return;
        }

        const autofocus =
          root.querySelector(
            "[autofocus]"
          );

        if (autofocus) {
          autofocus.focus();
          return;
        }

        const firstFocusable =
          root.querySelector(
            FOCUSABLE_SELECTOR
          );

        if (firstFocusable) {
          firstFocusable.focus();
          return;
        }

        root.focus();
      });

    return () =>
      cancelAnimationFrame(frame);
  }, [dialog?.isOpen]);

  /*
   * Keyboard behavior:
   *
   * Escape closes.
   * Tab stays inside the dialog.
   */
  useEffect(() => {
    if (!dialog?.isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const root = dialogRef.current;

      if (!root) {
        return;
      }

      const focusable = Array.from(
        root.querySelectorAll(
          FOCUSABLE_SELECTOR
        )
      );

      if (focusable.length === 0) {
        event.preventDefault();
        root.focus();
        return;
      }

      const first = focusable[0];
      const last =
        focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [dialog?.isOpen]);

  /*
   * Clean up on unmount.
   */
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(
          resetTimerRef.current
        );
      }
    };
  }, []);

  const handleClose = () => {
    if (resetTimerRef.current) {
      clearTimeout(
        resetTimerRef.current
      );
    }

    setVisible(false);

    resetTimerRef.current =
      setTimeout(() => {
        resetDialog();
        resetTimerRef.current = null;
      }, 250);
  };

  if (!dialog && !visible) {
    return null;
  }

  /*
   * Backwards compatible:
   *
   * Existing dialogs remain sheets.
   *
   * New dialogs can explicitly use:
   * presentation: "modal"
   */
  const presentation =
    dialog?.presentation ||
    "sheet";

  const isModal =
    presentation === "modal";

  const titleId =
    "plumbum-dialog-title";

  const descriptionId =
    "plumbum-dialog-description";

  return (
    <AnimatePresence>
      {visible && dialog ? (
        <>
          {/* Backdrop */}
          <motion.div
            aria-hidden="true"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
            }}
            className="
              fixed
              inset-0
              z-40
              bg-black/40
              backdrop-blur-sm
            "
          />

          {isModal ? (
            <motion.div
              className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                p-4
                sm:p-6
              "
              initial={{
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
            >
              <DialogPanel
                dialog={dialog}
                dialogRef={dialogRef}
                titleId={titleId}
                descriptionId={
                  descriptionId
                }
                isModal
                onClose={handleClose}
              />
            </motion.div>
          ) : (
            <motion.div
              drag="y"
              dragConstraints={{
                top: 0,
              }}
              dragElastic={0.2}
              onDragEnd={(
                event,
                info
              ) => {
                if (
                  info.offset.y > 120 ||
                  info.velocity.y > 800
                ) {
                  handleClose();
                }
              }}
              initial={{
                y: "100%",
              }}
              animate={{
                y: 0,
              }}
              exit={{
                y: "100%",
              }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
              }}
              className="
                fixed
                bottom-0
                left-0
                right-0
                z-50
              "
            >
              <DialogPanel
                dialog={dialog}
                dialogRef={dialogRef}
                titleId={titleId}
                descriptionId={
                  descriptionId
                }
                isModal={false}
                onClose={handleClose}
              />
            </motion.div>
          )}
        </>
      ) : null}
    </AnimatePresence>
  );
};

function DialogPanel({
  dialog,
  dialogRef,
  titleId,
  descriptionId,
  isModal,
  onClose,
}) {
  const height =
    dialog.height ?? 90;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      {...(typeof dialog.description ===
      "string"
        ? {
            "aria-describedby":
              descriptionId,
          }
        : {})}
      tabIndex={-1}
      style={
        isModal
          ? undefined
          : {
              height: `${height}vh`,
            }
      }
      className={
        isModal
          ? `
            flex
            max-h-[min(90dvh,48rem)]
            w-full
            max-w-2xl
            flex-col
            overflow-hidden
            rounded-3xl
            border
            border-gray-200
            bg-cream
            shadow-2xl
            dark:border-gray-700
            dark:bg-base-bgDark
          `
          : `
            flex
            max-h-[95dvh]
            flex-col
            overflow-hidden
            rounded-t-3xl
            bg-cream
            px-4
            pb-8
            pt-3
            shadow-xl
            dark:bg-base-bgDark
          `
      }
    >
      {/* Sheet grabber */}
      {!isModal ? (
        <div
          aria-hidden="true"
          className="
            mx-auto
            mb-3
            h-1.5
            w-10
            shrink-0
            rounded-full
            bg-soft
            opacity-30
          "
        />
      ) : null}

      {/* Header */}
      <header
        className="
          flex
          shrink-0
          items-start
          gap-4
          border-b
          border-gray-200
          px-4
          pb-4
          dark:border-gray-700
          sm:px-6
        "
      >
        <div className="min-w-0 flex-1">
          <SectionHeader
            title={dialog.title}
          />

          {typeof dialog.description ===
          "string" ? (
            <p
              id={descriptionId}
              className="
                mt-2
                text-sm
                leading-5
                text-gray-500
                dark:text-gray-400
              "
            >
              {dialog.description}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-gray-300
            bg-base-bg
            text-xl
            leading-none
            text-gray-600
            transition
            hover:border-blueSea
            hover:text-blueSea
            focus-visible:outline
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-blueSea
            dark:border-gray-700
            dark:bg-base-surfaceDark
            dark:text-cream
          "
        >
          <span aria-hidden="true">
            ×
          </span>
        </button>
      </header>

      {/* Content */}
      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          px-4
          py-5
          sm:px-6
        "
      >
        {typeof dialog.text ===
        "function"
          ? dialog.text()
          : dialog.text}
      </div>

      {/* Actions */}
      {dialog.disagree ||
      dialog.agree ? (
        <footer
          className="
            flex
            shrink-0
            justify-end
            gap-3
            border-t
            border-gray-200
            px-4
            py-4
            dark:border-gray-700
            sm:px-6
          "
        >
          {dialog.disagree ? (
            <button
              type="button"
              onClick={
                dialog.disagree
              }
              className="
                flex
                min-h-[3rem]
                items-center
                justify-center
                rounded-full
                border
                border-gray-300
                bg-base-bg
                px-5
                text-sm
                font-medium
                text-gray-700
                transition
                hover:border-blueSea
                hover:text-blueSea
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-blueSea
                dark:border-gray-700
                dark:bg-base-surfaceDark
                dark:text-cream
              "
            >
              {dialog.disagreeText ||
                "Cancel"}
            </button>
          ) : null}

          {dialog.agree ? (
            <button
              type="button"
              onClick={
                dialog.agree
              }
              className="
                flex
                min-h-[3rem]
                items-center
                justify-center
                rounded-full
                bg-button-secondary-bg
                px-5
                text-sm
                font-semibold
                text-white
                transition
                hover:brightness-95
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-blueSea
                active:scale-[0.99]
              "
            >
              {dialog.agreeText ||
                "Continue"}
            </button>
          ) : null}
        </footer>
      ) : null}
    </div>
  );
}

export default Dialog;
// import { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useDialog } from "../domain/usecases/useDialog";
// import SectionHeader from "./SectionHeader";

// const Dialog = () => {
//   const { dialog, resetDialog } = useDialog();

//   const [visible, setVisible] = useState(false);
//   const resetTimerRef = useRef(null);

//   /*
//    * Redux controls whether the dialog should exist.
//    * This effect only synchronizes the visual state.
//    */
//   useEffect(() => {
//     if (resetTimerRef.current) {
//       clearTimeout(resetTimerRef.current);
//       resetTimerRef.current = null;
//     }

//     if (dialog?.isOpen) {
//       setVisible(true);
//       return;
//     }

//     if (visible) {
//       setVisible(false);

//       resetTimerRef.current = setTimeout(() => {
//         resetDialog();
//         resetTimerRef.current = null;
//       }, 250);
//     }

//     return () => {
//       if (resetTimerRef.current) {
//         clearTimeout(resetTimerRef.current);
//         resetTimerRef.current = null;
//       }
//     };
//   }, [dialog?.isOpen, resetDialog, visible]);

//   /*
//    * Clean up the timer if Dialog unmounts.
//    */
//   useEffect(() => {
//     return () => {
//       if (resetTimerRef.current) {
//         clearTimeout(resetTimerRef.current);
//       }
//     };
//   }, []);

//   const handleClose = () => {
//     setVisible(false);

//     if (resetTimerRef.current) {
//       clearTimeout(resetTimerRef.current);
//     }

//     resetTimerRef.current = setTimeout(() => {
//       resetDialog();
//       resetTimerRef.current = null;
//     }, 250);
//   };

//   if (!dialog && !visible) {
//     return null;
//   }

//   return (
//     <AnimatePresence>
//       {visible && dialog?.isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             onClick={handleClose}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="
//               fixed inset-0 z-40
//               bg-black/40
//               backdrop-blur-sm
//             "
//           />

//           {/* Sheet */}
//           <motion.div
//             drag="y"
//             dragConstraints={{ top: 0 }}
//             dragElastic={0.2}
//             onDragEnd={(e, info) => {
//               if (
//                 info.offset.y > 120 ||
//                 info.velocity.y > 800
//               ) {
//                 handleClose();
//               }
//             }}
//             initial={{ y: "100%" }}
//             animate={{ y: 0 }}
//             exit={{ y: "100%" }}
//             transition={{
//               type: "spring",
//               stiffness: 320,
//               damping: 32,
//             }}
//             className="
//               fixed bottom-0 left-0 right-0 z-50
//             "
//           >
//             <div
//               style={{
//                 height: `${dialog.height ?? 90}vh`,
//               }}
//               className="
//                 flex flex-col
//                 rounded-t-3xl
//                 bg-cream
//                 px-4 pb-8 pt-3
//                 shadow-xl
//                 dark:bg-base-bgDark
//               "
//             >
//               {/* Grabber */}
//               <div
//                 className="
//                   mx-auto mb-4
//                   h-1.5 w-10
//                   rounded-full
//                   bg-soft
//                   opacity-30
//                 "
//               />

//               {/* Title */}
//               <SectionHeader title={dialog.title} />

//               {/* Content */}
//               <div
//                 className="
//                   mt-4
//                   flex-1
//                   overflow-y-auto
//                   px-2
//                   pb-4
//                 "
//               >
//                 <div
//                   className="
//                     text-[1.4rem]
//                     leading-relaxed
//                     text-soft
//                   "
//                 >
//                   {typeof dialog.text === "function"
//                     ? dialog.text()
//                     : dialog.text}
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="mt-6 flex justify-end gap-3">
//                 {dialog.disagree && (
//                   <button
//                     type="button"
//                     onClick={dialog.disagree}
//                     className="
//                       flex h-[3rem]
//                       items-center justify-center
//                       rounded-full
//                       border border-soft
//                       bg-soft
//                       px-5
//                       text-cream
//                       transition
//                       active:scale-95
//                       dark:bg-base-bgDark
//                     "
//                   >
//                     {dialog.disagreeText}
//                   </button>
//                 )}
// {dialog.agree && (
//   <button
//     type="button"
//     onClick={dialog.agree}
//     className="
//       flex h-[3rem]
//       items-center justify-center
//       rounded-full
//       bg-button-secondary-bg
//       px-5
//       text-white
//       transition
//       active:scale-95
//     "
//     style={{
//       WebkitTapHighlightColor: "transparent",
//     }}
//   >
//     <span>{dialog.agreeText}</span>
//   </button>
// )}
//                 {/* {dialog.agree && (
//                   <button
//                     type="button"
//                   onClick={dialog.agree}
//                     className="
//                       flex h-[3rem]
//                       items-center justify-center
//                       rounded-full
//                       bg-button-secondary-bg
//                       px-5
//                       text-white
//                       transition
//                       active:scale-95
//                     "
//                     style={{
//                       WebkitTapHighlightColor:
//                         "transparent",
//                     }}
//                   >
//                     {dialog.agreeText}
//                   </button>
//                 )} */}
//               </div>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// export default Dialog;