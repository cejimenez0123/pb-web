import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../actions/UserActions";

export const useAlert = () => {
  const dispatch = useDispatch();
  const alert = useSelector((state) => state.users.alert);

  const showAlert = ({ message, type = "success" }) => {
    dispatch(setAlert({ isOpen: true, message, type }));
  };

  const showPrompt = ({ message, agree, agreeText = "Confirm", disagreeText = "Dismiss" }) => {
    dispatch(setAlert({ isOpen: true, message, type: "prompt", agree, agreeText, disagreeText }));
  };

  const closeAlert = () => {
    dispatch(setAlert({ isOpen: false, message: null, type: null, agree: null }));
  };

  return { alert, showAlert, showPrompt, closeAlert };
};