import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonFooter,
  IonButtons,
  IonText,
  IonBackButton,
  IonContent,
} from '@ionic/react';
import { useDialog } from "../domain/usecases/useDialog"
import { useState } from 'react';
const Dialog = ({ presentingElement}) => {
  const { dialog, closeDialog, resetDialog } = useDialog();

  if (!dialog) return null;

  return (
    <IonModal
      isOpen={dialog.isOpen}
      presentingElement={presentingElement}
      swipeToClose
      canDismiss
      onDidDismiss={resetDialog}        // clears modal state after dismiss
      keepContentsMounted={false}       // allows proper re-render
      breakpoints={[0,0.5, 1]}
      initialBreakpoint={1}
      backdropBreakpoint={0}            // allow click-away dismissal
      cssClass="dialog-half"
      mode="ios"
    >
      <IonContent className="ion-padding" scrollY={dialog.scrollY??true} style={{ "--background": "#f4f4e0" }}>
        {dialog.title && (
          <IonHeader>
            <IonToolbar color="success">
              <IonButtons slot="start">
                <IonBackButton onClick={closeDialog} />
              </IonButtons>
              <IonTitle className="ion-text-emerald-900">{dialog.title}</IonTitle>
            </IonToolbar>
          </IonHeader>
        )}

        <div className="ion-padding">{dialog.text}</div>
              <IonFooter
        className="ion-padding-horizontal ion-padding-vertical"
        style={{
          display: "flex",
         "--background": "#f4f4e0",
          justifyContent: dialog.agree ? "space-between" : "flex-end",
          // "--background": "#f4f4e0",
        }}
      >
        {dialog.agree && (
          <div className="rounded-full flex px-4 w-fit h-[3rem] text-[1rem] border-emerald-400 border-2">
            <IonText
              fill="outline"
              color="success"
              className="my-auto mx-auto text-emerald-800 text-[1rem]"
              onClick={dialog.agree}
            >
              {dialog.agreeText}
            </IonText>
          </div>
        )}

        <div className="rounded-full w-[6rem]  h-[3rem] bg-soft flex border-emerald-600 border-2">
          <IonText
            className="text-[1rem] text-white my-auto mx-auto"
            onClick={dialog.onClose ?? closeDialog}
          >
            {dialog.disagreeText}
          </IonText>
        </div>
      </IonFooter>
      </IonContent>


    </IonModal>
  );
};

export default Dialog;
