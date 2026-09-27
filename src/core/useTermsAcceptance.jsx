import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { acceptTerms, signOutAction } from "../actions/UserActions";


import EULATERMS from "../container/auth/Agreement";
import { useDialog } from "../domain/usecases/useDialog";

const CURRENT_TERMS_VERSION = "2026-09";

export default function useTermsAcceptance() {
  const dispatch = useDispatch();

  const {
    openDialog,
    closeDialog,
  } = useDialog();

  const promptTermsAcceptance = useCallback(
    (onAccepted) => {
      openDialog({
        title: "Updated Terms & Conditions",
        height: 90,
        breakpoint: 1,
        text: () => <EULATERMS />,

        agree: async () => {
          try {
            await dispatch(
              acceptTerms({
                version: CURRENT_TERMS_VERSION,
              })
            );

            closeDialog();

            if (typeof onAccepted === "function") {
              onAccepted();
            }
          } catch (error) {
            console.error(
              "Could not accept terms:",
              error
            );
          }
        },

        agreeText: "I Agree",

        disagree: async () => {
          closeDialog();

          try {
            await dispatch(signOutAction());
          } catch (error) {
            console.error(
              "Could not sign out after declining terms:",
              error
            );
          }
        },

        disagreeText: "Decline",
      });
    },
    [dispatch, openDialog, closeDialog]
  );

  return promptTermsAcceptance;
}