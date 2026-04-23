
import { useDispatch, useSelector } from "react-redux";
import { setDialog } from "../../actions/UserActions.jsx";

export const useDialog = () => {
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.users.dialog);

  // Open modal
  const openDialog = (data) => {
    dispatch(
      setDialog({
        isOpen: true,
        scrollY: false,
        title: data.title ?? null,

        // ✅ NEW: support live render function
        render: data.render ?? null,

        // fallback for old usage
        text: typeof data.text === 'function' ? data.text : () => data.text,

        height: data.height ?? "80",
        agree: data.agree ?? null,
        agreeText: data.agreeText ?? null,

        disagree: data.disagree ?? closeDialog,
        disagreeText: data.disagreeText ?? "Close",

        onClose: data.onClose ?? null,
        breakpoint: data.breakpoint ?? 0.25,
      })
    );
  };

  // Close modal (soft close)
const closeDialog = () => {
  dispatch(setDialog({ isOpen: false }));
};

  // Reset modal (hard reset)
  const resetDialog = () => {
    dispatch(
      setDialog({
        isOpen: false,
        title: null,
        render: null, // ✅ NEW
        text: null,
        agree: null,
        agreeText: null,
        disagree: null,
        disagreeText: null,
        onClose: null,
        breakpoint: 0.25,
      })
    );
  };

  return { dialog, openDialog, closeDialog, resetDialog };
};