
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDialog } from "../domain/usecases/useDialog";
import SectionHeader from "./SectionHeader";

const Dialog = () => {
  const { dialog, resetDialog } = useDialog();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (dialog?.isOpen) {
      setVisible(true);
    } else {
      handleClose();
    }
  }, [dialog]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => resetDialog(), 250);
  };

  if (!dialog) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.y > 120 || info.velocity.y > 800) {
                handleClose();
              }
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div
              style={{ height: `${dialog.height ?? 90}vh` }}
              className="bg-base-bg dark:bg-base-bgDark rounded-t-3xl shadow-xl px-4 pt-3 pb-8 flex flex-col"
            >
              {/* Grabber */}
              <div className="w-10 h-1.5 bg-soft opacity-30 rounded-full mx-auto mb-4" />

              {/* Title */}
              <SectionHeader title={dialog.title} />

              {/* Content */}
              <div className="mt-4 px-2 flex-1 overflow-y-auto pb-4">
                <div className="text-[1.4rem] leading-relaxed text-soft">
                {typeof dialog.text === 'function' ? dialog.text() : dialog.text}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3 justify-end">
                {dialog.disagree && (
                  <div
                    onClick={() => { dialog.disagree() }}
                    className="px-5 h-[3rem] rounded-full btn border border-soft border-1 bg-soft text-cream dark:bg-base-bgDark active:scale-95 transition"
                  

                  >
                    {dialog.disagreeText}
                  </div>
                )}
                {dialog.agree && (
                  <div
                    onClick={() => { dialog.agree(); handleClose(); }}
                    className="px-5 h-[3rem] rounded-full bg-button-secondary-bg text-white active:scale-95 transition"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    {dialog.agreeText}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Dialog;