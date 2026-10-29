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
import styles from "../styles/style";
import clear from "../images/icons/clear.svg"
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
    closeDialog,
    openDialog
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
    // if (resetTimerRef.current) {
    //   clearTimeout(
    //     resetTimerRef.current
    //   );
    // }

    // setVisible(false);
closeDialog()
    // resetTimerRef.current =
    //   setTimeout(() => {
    //     resetDialog();
    //     resetTimerRef.current = null;
    //   }, 250);
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
  fixed inset-0 z-40
  bg-plumb-ink/40
  backdrop-blur-sm
  dark:bg-black/60
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
  const height = dialog.height ?? 90;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      {...(typeof dialog.description === "string"
        ? { "aria-describedby": descriptionId }
        : {})}
      tabIndex={-1}
      style={
        isModal
          ? undefined
          : { height: `${height}vh` }
      }
      className={`
        flex flex-col overflow-hidden
        text-plumb-ink dark:text-plumb-darkText
        ${
          isModal
            ? `
              max-h-[min(90dvh,48rem)]
              w-full max-w-2xl
              rounded-3xl border
              border-plumb-border
              bg-plumb-elevated
              shadow-2xl
              dark:border-plumb-darkBorder
              dark:bg-plumb-dark-surface
            `
            : `
              max-h-[95dvh]
              rounded-t-3xl
              border-t border-plumb-border
              bg-plumb-paper
              px-4 pb-8 pt-3
              shadow-xl
              dark:border-plumb-darkBorder
              dark:bg-plumb-dark-paper
            `
        }
      `}
    >
      {/* Sheet grabber */}
      {!isModal && (
        <div
          aria-hidden="true"
          className="
            mx-auto mb-3 h-1.5 w-10 shrink-0
            rounded-full bg-plumb-muted/40
            dark:bg-plumb-darkMuted/40
          "
        />
      )}

      {/* Header */}
      <header
        className="
          flex shrink-0 items-start gap-4
          border-b border-plumb-border
          px-4 pb-4 dark:border-plumb-darkBorder
          sm:px-6
        "
      >
        <div className="min-w-0 flex-1">
          <SectionHeader
            title={dialog.title}
            right={
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className={`
                  ${styles.button.base}
                  ${styles.button.ghost}
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-full p-2
                `}
              >
                <img
                  src={clear}
                  alt=""
                  aria-hidden="true"
                  className="
                    h-5 w-5
                    opacity-70
                    dark:invert
                  "
                />
              </button>
            }
          />

          {typeof dialog.description === "string" && (
            <p
              id={descriptionId}
              className={`
                ${styles.text.muted}
                mx-auto mt-2 text-sm leading-6
              `}
            >
              {dialog.description}
            </p>
          )}
        </div>
      </header>

      {/* Content */}
      <div
        className="
          min-h-0 flex-1 overflow-y-auto
          px-4 py-5 sm:px-6
        "
      >
        {typeof dialog.text === "function"
          ? dialog.text()
          : dialog.text}
      </div>

      {/* Actions */}
      {(dialog.disagree || dialog.agree) && (
        <footer
          className="
            flex shrink-0 flex-wrap justify-end gap-3
            border-t border-plumb-border
            px-4 py-4 dark:border-plumb-darkBorder
            sm:px-6
          "
        >
          {dialog.disagree && (
            <button
              type="button"
              onClick={dialog.disagree}
              className={`
                ${styles.button.base}
                ${styles.button.secondary}
                ${styles.button.large}
              `}
            >
              {dialog.disagreeText || "Cancel"}
            </button>
          )}

          {dialog.agree && (
            <button
              type="button"
              onClick={dialog.agree}
              className={`
                ${styles.button.base}
                ${styles.button.primary}
                ${styles.button.large}
              `}
            >
              {dialog.agreeText || "Continue"}
            </button>
          )}
        </footer>
      )}
    </div>
  );
}


export default Dialog;