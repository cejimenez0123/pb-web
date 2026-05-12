import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "../core/useAlert";

function Alert() {
  const { alert, closeAlert } = useAlert();

  useEffect(() => {
    if (!alert?.isOpen) return;
    if (alert.type === "prompt") return; // don't auto-dismiss prompts
    const timer = setTimeout(closeAlert, 4000);
    return () => clearTimeout(timer);
  }, [alert?.isOpen]);

  return (
    <AnimatePresence>
      {alert?.isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="fixed top-8 left-0 right-0 w-[96vw] mx-auto sm:w-page z-50 pointer-events-none"
        >
          <div
            role="alert"
            onClick={alert.type !== "prompt" ? closeAlert : undefined}
            className={`alert w-[96vw] md:w-page mx-auto pointer-events-auto
              h-auto py-4
              ${alert.type === "success" ? "alert-success" : "alert-warning"}
              ${alert.type !== "prompt" ? "cursor-pointer" : ""}`}
          >
            <div className="flex flex-col w-full">
              <div className="flex-row flex my-auto w-full">
                {alert.type === "success" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="max-h-6 max-w-6 shrink-0 my-auto stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <span className="my-auto mx-4 whitespace-pre-wrap break-words">
                  {alert.message}
                </span>
              </div>

              {alert.type === "prompt" && (
                <div className="flex gap-3 mt-3 justify-end w-full px-4">
                  <div
                    onClick={closeAlert}
                    className="px-4 h-[2.5rem] flex items-center rounded-full border border-soft text-soft active:scale-95 transition cursor-pointer"
                  >
                    {alert.disagreeText ?? "Dismiss"}
                  </div>
                  <div
                    onClick={() => { alert.agree?.(); closeAlert(); }}
                    className="px-4 h-[2.5rem] flex items-center rounded-full bg-button-secondary-bg text-white active:scale-95 transition cursor-pointer"
                  >
                    {alert.agreeText ? alert.agreeText : "Confirm"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Alert;