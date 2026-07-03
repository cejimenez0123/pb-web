
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useDialog } from "../../domain/usecases/useDialog";
import checkResult from "../../core/checkResult";
import { reportContent } from "../../actions/ModerationAcitons";

const REPORT_REASONS = [
  "Spam",
  "Harassment or abuse",
  "Hate speech",
  "Inappropriate content",
  "Other",
];

export default function ReportContentDialog({
  contentType,
  contentId,
  reportedProfileId,
  isOpen,
  onClose,
  onSuccess,
}) {
  const dispatch = useDispatch();
  const { openDialog, closeDialog } = useDialog();

  const detailsRef = useRef("");

  const openReasonDialog = () => {
    detailsRef.current = "";

    openDialog({
      title: "Report – Choose Reason",
      height: 50,
      text: () => (
        <div className="flex flex-col gap-2 p-4">
          {REPORT_REASONS.map((reason) => (
            <button
              key={reason}
              className="text-left p-3 rounded-xl border border-soft hover:bg-sky-50"
              onClick={() => {
                closeDialog();
                openConfirmDialog(reason);
              }}
            >
              {reason}
            </button>
          ))}
        </div>
      ),
      disagreeText: "Cancel",
      disagree: () => {
        closeDialog();
        onClose?.();
      },
    });
  };

  const openConfirmDialog = (reason) => {
    openDialog({
      title: "Report – Add Details",
      height: 75,
      text: () => (
        <div className="p-4 text-sm text-slate-600 flex flex-col gap-3">
          <div>
            You’re about to report this content for:
            <div className="mt-1 font-semibold">{reason}</div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Additional details (optional{reason === "Other" ? ", required" : ""})
            </label>
            <textarea
              rows={4}
              className="rounded-lg w-[100%] border-2 border-blueSea bg-base-bg dark:bg-base-surfaceDark dark:bg-cream shadow-sm border-opacity-30 min-h-[6em] text-blueSea p-3"
              placeholder="Add any context that might help"
              defaultValue={detailsRef.current}
              onChange={(e) => {
                detailsRef.current = e.target.value;
              }}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
                 className={`text-left p-3 rounded-full  border border-soft 
                
              `}  onClick={() => {
                closeDialog();
                openReasonDialog();
              }}
            >
              Back
            </button>

            <button
                 className={`text-left p-3 rounded-full  border border-soft bg-sky-50
                
              `}
              onClick={() => {
                if (reason === "Other" && !detailsRef.current.trim()) {
                  alert("Please provide details for this report.");
                  return;
                }

                dispatch(
                  reportContent({
                    contentType: String(contentType).toLowerCase(),
                    contentId,
                    reportedProfileId,
                    reason,
                    reasonDetails: detailsRef.current.trim() || null,
                  })
                ).then((res) =>
                  checkResult(
                    res,
                    () => {
                      closeDialog();
                      onSuccess?.();
                      onClose?.();
                    },
                    (err) => alert(err.message || "Error submitting report")
                  )
                );
              }}
            >
              Report
            </button>
          </div>
        </div>
      ),
      disagreeText: "Cancel",
      disagree: () => {
        closeDialog();
        onClose?.();
      },
    });
  };

  useEffect(() => {
    if (isOpen) {
      openReasonDialog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return null;
}