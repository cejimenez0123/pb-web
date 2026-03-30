import {
  IonModal,
  
  IonFooter,
  
  IonText,
  
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
      // swipeToClose
      canDismiss={true}
         style={{
            "--background-color": "#f4f4e0",
          
          }}
    
       onDidDismiss={() => {
    resetDialog();
  

  }}       // clears modal state after dismiss
      keepContentsMounted={false}       // allows proper re-render
      breakpoints={breakpoints}
      initialBreakpoint={initialBreakpoint}
   
      mode="ios"
    >


<div className='h-[100%] bg-cream p-4'>
  <div className='flex flex-row w-[100%]'>
  <h3 className='lora-bold mx-auto'>{dialog.title}</h3>
  </div>
        <h1 className="px-8 text-[2rem] bg-cream mt-4">{dialog.text}</h1>

     </div>
      {/* </IonContent> */}
                <div className='bg-cream'>
         <IonFooter
         slot='fixed'
          className=" ion-padding-bottom ion-padding-tio"
          style={{
            "--background-color": "#f4f4e0",
          
          }}
        >
<div className={`pb-14 px-4 bottom-0 flex flex-row ${dialog.agree ? "justify-between" : "flex-end"}`}>
          {dialog.agree && (
            <div      onClick={dialog.agree} className="rounded-full flex px-4 w-fit h-[3rem] text-[1rem] border-emerald-400 border-2">
              <IonText
                fill="outline"
                color="success"
                className="my-auto mx-auto text-emerald-800 text-[1rem]"
           
              >
                {dialog.agreeText}
              </IonText>
            </div>
          )}

         {dialog.disagree && (
<div onClick={()=>{
          dialog.disagree()
          resetDialog()
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
// import { useDialog } from "../domain/usecases/useDialog";
// import { Capacitor } from '@capacitor/core';
// import Enviroment from '../core/Enviroment';

// const Dialog = ({ presentingElement }) => {
//   const { dialog, closeDialog, resetDialog } = useDialog();

//   if (!dialog) return null;

//   // Detect if running on native mobile
//   const isNative = Capacitor.isNativePlatform();

//   // Adjust breakpoints for native vs web
// const breakpoints = isNative ? [0, 1] : [0, 1];
//   const initialBreakpoint = isNative ? 1 : 1;
//   const backdropBreakpoint = 0;

//   return (
//     <IonModal
//       isOpen={dialog.isOpen}
//       presentingElement={presentingElement}
     
//       // canDismiss
//          style={{
//             "--background-color": Enviroment.palette.cream,
          
//           }}
//       backdropDismiss={true}    
//       canDismiss={false}
//              // ensures tap-away dismissal
//        onDidDismiss={() => {
//     resetDialog();
  

//   }}       // clears modal state after dismiss
//       keepContentsMounted={false}       // allows proper re-render
//       breakpoints={breakpoints}
//       initialBreakpoint={initialBreakpoint}
//       backdropBreakpoint={backdropBreakpoint}
//       // cssClass="dialog-half"
//       mode="ios"
//     >

//    <h1>{dialog.title}</h1>

// <div className='h-[60em] bg-cream p-8'>
//         {dialog.text}

//      </div>
   
//                 <div className='bg-cream'>
//          <IonFooter
//          slot='fixed'
//           className=" ion-padding-bottom ion-padding-tio"
//           style={{
//             "--background-color": Enviroment.palette.cream,
          
//           }}
//         >
// <div className={`pb-14 px-4 bottom-0 flex flex-row ${dialog.agree ? "justify-between" : "flex-end"}`}>
//           {dialog.agree && (
//             <div      onClick={dialog.agree} className="rounded-full flex px-4 w-fit h-[3rem] text-[1rem] border-emerald-400 border-2">
//               <IonText
//                 fill="outline"
//                 color="success"
//                 className="my-auto mx-auto text-emerald-800 text-[1rem]"
           
//               >
//                 {dialog.agreeText}
//               </IonText>
//             </div>
//           )}

//          {dialog.disagree && (
// <div onClick={()=>{
  
//         dialog?.disagree()
//           closeDialog()
//       }}  className="rounded-full flex px-4 w-fit h-[3rem] text-[1rem] border-emerald-400 border-2">
//     <IonText
//       className="text-[1rem] text-emerald-600 my-auto mx-auto"
//       // <-- use disagree here
//     >
//       {dialog.disagreeText}
//     </IonText>
//   </div>
// )}</div>
//         </IonFooter>
//         </div>
//         {/* </div> */}
//     </IonModal>
//   );
// };

// export default Dialog;

