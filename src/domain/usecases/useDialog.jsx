import { useDispatch, useSelector } from 'react-redux';
import { setDialog } from '../../actions/UserActions.jsx'

export const useDialog = () => {
  const dispatch = useDispatch();
  const dialog = useSelector(state=>state.users.dialog)

  // Open a modal with any content
  const openDialog = (data) => {
    dispatch(setDialog({
      isOpen: true,
      title: data.title ?? null,
      text: data.text ?? null,
      agree: data.agree ?? null,
      agreeText: data.agreeText ?? null,
      disagreeText: data.disagreeText ?? "Close",
      onClose: data.onClose ?? null,
      breakpoint: data.breakpoint ?? 0.25,
    }));
  };

  // Close the modal (keeps content for a moment if needed)
  const closeDialog = () => {
    if (dialog?.isOpen) {
      dispatch(setDialog({ ...dialog, isOpen: false }));
    }
  };

  // Fully reset modal after dismiss
  const resetDialog = () => {
    dispatch(setDialog({
      isOpen: false,
      title: null,
      text: null,
      agree: null,
      agreeText: null,
      disagreeText: null,
      onClose: null,
      breakpoint: 0.25,
    }));
  };

  return { dialog, openDialog, closeDialog, resetDialog };
};
