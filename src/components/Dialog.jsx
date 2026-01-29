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
const Dialog = ({ presentingElement }) => {
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
      initialBreakpoint={dialog.breakpoint??1}
      backdropBreakpoint={0}            // allow click-away dismissal
      cssClass="dialog-half"
      mode="ios"
    >
      <IonContent className="ion-padding" style={{ "--background": "#f4f4e0" }}>
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

// import {
//   IonModal,
//   IonHeader,
//   IonToolbar,
//   IonTitle,

//   IonFooter,
//   IonButtons,
//   IonText,

//   IonBackButton,
//   IonContent,
// } from '@ionic/react';
// import { useDispatch } from 'react-redux';
// import { setDialog } from '../actions/UserActions';
// import { Capacitor } from '@capacitor/core';

// const Dialog = ({
//   dialog,
//   presentingElement,
// }) => {
//   const dispatch = useDispatch()

// const closeDialog = () => {
//   dispatch(setDialog({ ...dialog, isOpen: false }));
// };
// const resetDialog = () => {
//   dispatch(setDialog({
//     isOpen: false,
//     text: null,
//     title: null,
//     agree: null,
//     agreeText: null,
//     disagreeText: null,
//   }));
// };
//   return (
//     <IonModal
//     presentingElement={presentingElement} swipeToClose={true} mode="ios"
//   // isOpen={((dialog && dialog.isOpen)??false)} 
//   title={dialog?.title}
//   // isOpen={dialog?.isOpen ?? false}
//   isOpen={dialog?.isOpen ?? false}
//   onDidDismiss={resetDialog}
//   canDismiss={true} 
//   keepContentsMounted={false}
//   onBlur={resetDialog}
//   // breakpoints={[0, 1]} // This enables the drag-to-close behavior effectively
//   // initialBreakpoint={1}
//   cssClass="modal-fullscreen pt-4 ion-padding"
//   // presentingElement={presentingElement}
//  breakpoints={[0,.25, 0.5, 1]}
//   initialBreakpoint={dialog.breakpoint??1}
//   backdropBreakpoint={0}
//   // swipeToClose={true}
// >
// <IonContent className='ion-padding' style={{"--background":"#f4f4e0"}}>
//   {dialog?.title!==null &&<IonHeader>
//   <IonToolbar color="success">
//     <IonButtons slot="start">
//      <IonBackButton  onClick={closeDialog} />
//     </IonButtons>
//     <IonTitle className="ion-text-emerald-900">
//       {dialog?.title}
//     </IonTitle>
//   </IonToolbar>
// </IonHeader>}
// <div className='ion-padding'>
// {dialog?.text}
// </div>
//    </IonContent>
// =
//       <IonFooter className="ion-padding-horizontal ion-padding-vertical" style={{ display: 'flex', "--background":"#f4f4e0",justifyContent: dialog?.agree ? 'space-between' : 'flex-end' }}>
//         {dialog?.agree?(
//           <div className='rounded-full flex  px-4   w-fit h-[3rem] text-[1rem] border-emerald-400 border-2'>
//           <IonText
//             fill="outline"
//             color="success"
//             className=" my-auto mx-autotext-emerrald-800 text-[1rem]"
//             onClick={dialog.agree}
//           >
//             {dialog?.agreeText}
//           </IonText>
//           </div>
//         ):null}
//           <div className='rounded-full w-[6rem] h-[3rem] bg-soft flex  border-emerald-600 border-2'>
//         <IonText   className='text-[1rem] text-white my-auto mx-auto' onClick={!!dialog?.onClose?dialog.onClose:closeDialog} >
//           {dialog?.disagreeText}
//           </IonText>
//           </div>
//       </IonFooter>
   
//     </IonModal>
//   )

// };

// export default Dialog;
