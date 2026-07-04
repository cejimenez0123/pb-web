
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useDialog } from "../../domain/usecases/useDialog";
import checkResult from "../../core/checkResult";
import { reportContent, blockProfile, removeContentByProfileId } from "../../actions/ModerationAcitons";

const REPORT_REASONS = [
  "Spam",
  "Harassment or abuse",
  "Hate speech",
  "Inappropriate content",
  "Other",
];

const BLOCK_REASONS = [
  "Spam",
  "Harassment or abuse",
  "Hate speech",
  "Inappropriate content",
  "Other",
];

export default function ReportContentDialog({
  mode = "report", // "report" | "block"
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
  const reasons = mode === "block" ? BLOCK_REASONS : REPORT_REASONS;
  const actionLabel = mode === "block" ? "Block" : "Report";

  const openReasonDialog = () => {
    detailsRef.current = "";

    openDialog({
      title: `${actionLabel} – Choose Reason`,
      height: 50,
      text: () => (
        <div className="flex flex-col gap-2 p-4">
          {reasons.map((reason) => (
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
      title: `${actionLabel} – Add Details`,
      height: 75,
      text: () => (
        <div className="p-4 text-sm text-slate-600 flex flex-col gap-3">
          <div>
            {mode === "block"
              ? "You're about to block this user for:"
              : "You're about to report this content for:"}
            <div className="mt-1 font-semibold">{reason}</div>
          </div>

          {mode === "block" && (
            <div className="text-xs text-slate-500">
              You won't see their content anymore, and they won't be able to interact with yours.
            </div>
          )}

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
              className="text-left p-3 rounded-full border border-soft"
              onClick={() => {
                closeDialog();
                openReasonDialog();
              }}
            >
              Back
            </button>

            <button
              className="text-left p-3 rounded-full border border-soft bg-sky-50"
              onClick={() => {
                if (reason === "Other" && !detailsRef.current.trim()) {
                  alert(`Please provide details for this ${mode === "block" ? "block" : "report"}.`);
                  return;
                }

                const action =
                  mode === "block"
                    ? blockProfile({
                        blockedProfileId: reportedProfileId,
                        reason,
                        reasonDetails: detailsRef.current.trim() || null,
                      })
                    : reportContent({
                        contentType: String(contentType).toLowerCase(),
                        contentId,
                        reportedProfileId,
                        reason,
                        reasonDetails: detailsRef.current.trim() || null,
                      });

                dispatch(action).then((res) =>
                  checkResult(
                    res,
                    () => {
                       if (mode === "block") {
        dispatch(removeContentByProfileId({ profileId: reportedProfileId }));
      }
                      closeDialog();
                      onSuccess?.();
                      onClose?.();
                    },
                    (err) =>{
                      console.log(err)
                      alert(err.message || `Error submitting ${mode === "block" ? "block" : "report"}`)
                    }
                  )
                );
              }}
            >
              {actionLabel}
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