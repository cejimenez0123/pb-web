// components/profile/ReportProfileDialog.jsx
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useDialog } from "../../domain/usecases/useDialog";

import checkResult from "../../core/checkResult";
import { reportContent } from "../../actions/ModerationAcitons";

export default function ReportProfileDialog({ profile, isOpen, onClose }) {
  const dispatch = useDispatch();
  const { openDialog, closeDialog } = useDialog();

  const [reportReason, setReportReason] = useState(null);
  const [reportReasonDetails, setReportReasonDetails] = useState("");
  const [step, setStep] = useState(null); // "reasons" | "confirm"

  // When opened from parent, start at "reasons"
  useEffect(() => {
    if (!isOpen || !profile) return;
    setReportReason(null);
    setReportReasonDetails("");
    setStep("reasons");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Open reason picker
  useEffect(() => {
    if (step !== "reasons" || !profile) return;

    const reasons = [
      "Spam",
      "Harassment or abuse",
      "Hate speech",
      "Impersonation",
      "Other",
    ];

    openDialog({
      title: "Report Profile",
    
      text: () => (
        <div className="flex flex-col gap-2 p-4">
          {reasons.map((reason) => (
            <button
              key={reason}
              className={`text-left p-3 rounded-xl border border-soft hover:bg-sky-50 ${
                reportReason === reason ? "bg-sky-50 border-sky-300" : ""
              }`}
              onClick={() => {
                setReportReason(reason);
                setStep("confirm");
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
        setStep(null);
        onClose?.();
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Open confirm dialog with details
  useEffect(() => {
    if (step !== "confirm" || !profile || !reportReason) return;

    openDialog({
      title: "Report Profile",
      height: 75,
      text: () => (
        <div className="p-4 text-sm text-slate-600">
          <div className="mb-3">
            You’re about to report @{profile.username} for:
            <div className="mt-1 font-semibold">{reportReason}</div>
          </div>

          <label className="block text-xs text-slate-500 mb-1">
            Additional details (optional{reportReason === "Other" ? ", required" : ""})
          </label>
          <textarea
            rows={4}
            className="rounded-lg w-[100%] border-2 border-blueSea bg-base-bg dark:bg-base-surfaceDark dark:bg-cream shadow-sm border-opacity-30 min-h-[6em] text-blueSea p-3"
            placeholder="Add any context that might help (e.g., specific posts, behavior, etc.)"
            value={reportReasonDetails}
            onChange={(e) => setReportReasonDetails(e.target.value)}
          />
        </div>
      ),
      agreeText: "Report",
      agree: () => {
        if (reportReason === "Other" && !reportReasonDetails.trim()) {
          alert("Please provide details for this report.");
          return;
        }

        dispatch(
          reportContent({
            contentType: "profile",
            contentId: profile.id,
            reportedProfileId: profile.id,
            reason: reportReason,
            reasonDetails: reportReasonDetails.trim() || null,
          })
        ).then((res) =>
          checkResult(
            res,
            () => {
              closeDialog();
              setStep(null);
              onClose?.();
            },
            (err) => alert(err.message)
          )
        );
      },
      disagreeText: "Cancel",
      disagree: () => {
        closeDialog();
        setStep(null);
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, reportReason, reportReasonDetails]);

  // No visible UI; this component just controls the dialog
  return null;
}