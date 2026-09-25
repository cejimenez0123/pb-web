
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDialog } from "../domain/usecases/useDialog";
import SectionHeader from "./SectionHeader";

const Dialog = () => {
  const { dialog, resetDialog } = useDialog();

  const [visible, setVisible] = useState(false);
  const resetTimerRef = useRef(null);

  /*
   * Redux controls whether the dialog should exist.
   * This effect only synchronizes the visual state.
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

      resetTimerRef.current = setTimeout(() => {
        resetDialog();
        resetTimerRef.current = null;
      }, 250);
    }

    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
  }, [dialog?.isOpen, resetDialog, visible]);

  /*
   * Clean up the timer if Dialog unmounts.
   */
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    setVisible(false);

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = setTimeout(() => {
      resetDialog();
      resetTimerRef.current = null;
    }, 250);
  };

  if (!dialog && !visible) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && dialog?.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="
              fixed inset-0 z-40
              bg-black/40
              backdrop-blur-sm
            "
          />

          {/* Sheet */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (
                info.offset.y > 120 ||
                info.velocity.y > 800
              ) {
                handleClose();
              }
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 32,
            }}
            className="
              fixed bottom-0 left-0 right-0 z-50
            "
          >
            <div
              style={{
                height: `${dialog.height ?? 90}vh`,
              }}
              className="
                flex flex-col
                rounded-t-3xl
                bg-cream
                px-4 pb-8 pt-3
                shadow-xl
                dark:bg-base-bgDark
              "
            >
              {/* Grabber */}
              <div
                className="
                  mx-auto mb-4
                  h-1.5 w-10
                  rounded-full
                  bg-soft
                  opacity-30
                "
              />

              {/* Title */}
              <SectionHeader title={dialog.title} />

              {/* Content */}
              <div
                className="
                  mt-4
                  flex-1
                  overflow-y-auto
                  px-2
                  pb-4
                "
              >
                <div
                  className="
                    text-[1.4rem]
                    leading-relaxed
                    text-soft
                  "
                >
                  {typeof dialog.text === "function"
                    ? dialog.text()
                    : dialog.text}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                {dialog.disagree && (
                  <button
                    type="button"
                    onClick={dialog.disagree}
                    className="
                      flex h-[3rem]
                      items-center justify-center
                      rounded-full
                      border border-soft
                      bg-soft
                      px-5
                      text-cream
                      transition
                      active:scale-95
                      dark:bg-base-bgDark
                    "
                  >
                    {dialog.disagreeText}
                  </button>
                )}
{dialog.agree && (
  <button
    type="button"
    onClick={dialog.agree}
    className="
      flex h-[3rem]
      items-center justify-center
      rounded-full
      bg-button-secondary-bg
      px-5
      text-white
      transition
      active:scale-95
    "
    style={{
      WebkitTapHighlightColor: "transparent",
    }}
  >
    <span>{dialog.agreeText}</span>
  </button>
)}
                {/* {dialog.agree && (
                  <button
                    type="button"
                  onClick={dialog.agree}
                    className="
                      flex h-[3rem]
                      items-center justify-center
                      rounded-full
                      bg-button-secondary-bg
                      px-5
                      text-white
                      transition
                      active:scale-95
                    "
                    style={{
                      WebkitTapHighlightColor:
                        "transparent",
                    }}
                  >
                    {dialog.agreeText}
                  </button>
                )} */}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Dialog;