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
import { useDialog } from "../domain/usecases/useDialog";
import { Capacitor } from '@capacitor/core';

const Dialog = ({ presentingElement }) => {
  const { dialog, closeDialog, resetDialog } = useDialog();

  if (!dialog) return null;

  // Detect if running on native mobile
  const isNative = Capacitor.isNativePlatform();

  // Adjust breakpoints for native vs web
const breakpoints = isNative ? [0, 1] : [0, 1];
  const initialBreakpoint = isNative ? 1 : 1;
  const backdropBreakpoint = 0;

  return (
    <IonModal
      isOpen={dialog.isOpen}
      presentingElement={presentingElement}
      swipeToClose
      canDismiss
      backdropDismiss={true}    
             // ensures tap-away dismissal
       onDidDismiss={() => {
    resetDialog();
  

  }}       // clears modal state after dismiss
      keepContentsMounted={false}       // allows proper re-render
      breakpoints={breakpoints}
      initialBreakpoint={initialBreakpoint}
      backdropBreakpoint={backdropBreakpoint}
      cssClass="dialog-half"
      mode="ios"
    >
      {/* <div className='flex flex-col'> */}
      <IonContent
        className="ion-padding"
    
        scrollY={dialog.scrollY ?? true}
        style={{ "--background": "#f4f4e0" }}
      >
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
<div className='min-h-[10em]'>
        <h1 className="px-8 text-[2rem]">{dialog.text}</h1>

     </div>
      </IonContent>
                <div className='bg-cream'>
         <IonFooter
         slot='fixed'
          className=" ion-padding-bottom ion-padding-tio"
          style={{
            "--background-color": "#f4f4e0",
          
          }}
        >
<div className={`pb-14 px-4 flex flex-row ${dialog.agree ? "justify-between" : "flex-end"}`}>
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

         {dialog.disagree && (
<div onClick={()=>{
        if(dialog.disagree)dialog.disagree()
          closeDialog()
      }}  className="rounded-full flex px-4 w-fit h-[3rem] text-[1rem] border-emerald-400 border-2">
    <IonText
      className="text-[1rem] text-emerald-600 my-auto mx-auto"
      // <-- use disagree here
    >
      {dialog.disagreeText}
    </IonText>
  </div>
)}</div>
        </IonFooter>
        </div>
        {/* </div> */}
    </IonModal>
  );
};

export default Dialog;

