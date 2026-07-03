// src/components/settings/BlockedUsersDialog.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Enviroment from "../../core/Enviroment";
import { useDialog } from "../../domain/usecases/useDialog";
import { fetchBlockedProfiles } from "../../actions/ModerationAcitons";

export default function BlockedUsersDialog({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { openDialog, closeDialog } = useDialog();

  const { blockedProfiles = [], loading, error } = useSelector(
    (state) => state.moderation
  );

  // Track which "view" we've already shown for this open session
  const [shownStep, setShownStep] = useState(null); // null | "loading" | "error" | "list"

  // Fetch when dialog is opened
  useEffect(() => {
    if (!isOpen) {
      setShownStep(null);
      return;
    }
    setShownStep(null);
    dispatch(fetchBlockedProfiles());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Decide what to show based on current data + what we've already shown
  useEffect(() => {
    if (!isOpen) return;

    // If still loading and we haven't shown loading yet
    if (loading && shownStep !== "loading") {
      setShownStep("loading");
      openDialog({
        title: "Blocked Users",
        text: () => (
          <div className="p-4 text-center text-soft">Loading…</div>
        ),
        disagreeText: "Close",
        disagree: () => {
          closeDialog();
          onClose?.();
        },
      });
      return;
    }

    // If error and we haven't shown error yet
    if (error && shownStep !== "error") {
      setShownStep("error");
      openDialog({
        title: "Blocked Users",
        text: () => (
          <div className="p-4 text-center text-red-600">{error}</div>
        ),
        agreeText: "OK",
        agree: () => {
          closeDialog();
          onClose?.();
        },
      });
      return;
    }

    // If loaded (not loading, no error) and we haven't shown list yet
    if (!loading && !error && shownStep !== "list") {
      setShownStep("list");

      openDialog({
        title: "Blocked Users",
        height: 60,
        text: () => (
          <div className="p-4 max-h-64 overflow-auto">
            {!Array.isArray(blockedProfiles) || blockedProfiles.length === 0 ? (
              <div className="text-center text-soft">You haven't blocked anyone.</div>
            ) : (
              <ul className="space-y-3">
                {blockedProfiles.map((p) => {
                  const pic = p.profilePic || "";
                  const src = pic?.includes("http")
                    ? pic
                    : pic
                    ? Enviroment.imageProxy(pic)
                    : "https://placehold.co/40";

                  return (
                    <li
                      key={p.id}
                      className="flex items-center gap-3 p-2 rounded-lg border border-soft"
                    >
                      <img
                        src={src}
                        alt={p.username || "User"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 text-soft">
                        <div className="font-medium">{p.username || "Unknown"}</div>
                        <div className="text-xs opacity-60">Blocked</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ),
        disagreeText: "Close",
        disagree: () => {
          closeDialog();
          onClose?.();
        },
      });
      return;
    }

    // If none of the above conditions match, do nothing (prevent re-open)
  }, [isOpen, loading, error, blockedProfiles, shownStep]);

  return null;
}