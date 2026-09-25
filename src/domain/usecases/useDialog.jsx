
import {

  useDispatch,
  useSelector,
} from "react-redux";

import { setDialog } from "../../actions/UserActions.jsx";
import { useCallback } from "react";

export const useDialog = () => {
  const dispatch = useDispatch();

  const dialog = useSelector(
    (state) => state.users.dialog
  );

  const openDialog = useCallback(
    (data = {}) => {
      dispatch(
        setDialog({
          isOpen: true,
          scrollY: data.scrollY ?? false,
          title: data.title ?? null,

          render: data.render ?? null,

          text:
            typeof data.text === "function"
              ? data.text
              : () => data.text,

          height: data.height ?? "80",

          agree: data.agree ?? null,
          agreeText: data.agreeText ?? null,

          disagree: data.disagree ?? null,
          disagreeText:
            data.disagreeText ?? "Close",

          onClose: data.onClose ?? null,

          breakpoint:
            data.breakpoint ?? 0.25,
        })
      );
    },
    [dispatch]
  );

  const closeDialog = useCallback(() => {
    dispatch(
      setDialog({
        isOpen: false,
      })
    );
  }, [dispatch]);

  const resetDialog = useCallback(() => {
    dispatch(
      setDialog({
        isOpen: false,
        title: null,
        render: null,
        text: null,
        agree: null,
        agreeText: null,
        disagree: null,
        disagreeText: null,
        onClose: null,
        breakpoint: 0.25,
      })
    );
  }, [dispatch]);

  return {
    dialog,
    openDialog,
    closeDialog,
    resetDialog,
  };
};