import React, { useContext } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonFooter,
  IonButtons,
  IonText,
  IonIcon,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import Context from '../context';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setDialog } from '../actions/UserActions';

const Dialog = ({
  dialog,
  presentingElement,
}) => {
  const dispatch = useDispatch()
  const onClose=()=>{
    dispatch(setDialog({isOpen:false}))
  }
  if(dialog){
  return (
    <IonModal
  isOpen={((dialog && dialog.isOpen)??false)} 
  title={dialog.title}
  onDidDismiss={()=>onClose()}
  cssClass="modal-fullscreen ion-padding"
  presentingElement={presentingElement}
  style={{backgroundColor:"white",height:"100vh",overflowY:"scroll"}}
  swipeToClose={true}
><IonHeader>
        <IonToolbar color="success">
          <IonTitle className="ion-text-emerald-900">{dialog.title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={dialog.onClose} aria-label="Close dialog">
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
{/* 
      {/* <IonContent className="ion-padding">
        <IonText className="ion-text-emerald-900" style={{ fontWeight: 'bold' }}>
          {title}
        </IonText>
        <p style={{ marginTop: '1rem', color: '#065f46' }}>{text}</p>
      </IonContent> */} 
{dialog.text}
      <IonFooter className="ion-padding-horizontal ion-padding-vertical" style={{ display: 'flex', justifyContent: dialog.agree ? 'space-between' : 'flex-end' }}>
        {dialog.agree && (
          <IonButton
            fill="outline"
            color="success"
            className="rounded-full"
            onClick={dialog.agree}
          >
            {dialog.agreeText}
          </IonButton>
        )}
        <IonButton
          color="success"
          className="rounded-full"
          onClick={dialog.onClose}
        >
          {dialog.reeText}
        </IonButton>
      </IonFooter>
    </IonModal>
  )
};
return null
};

export default Dialog;

// const Dialog = ({ text,title, isOpen, onClose,agree,agreeText="Agree",disagreeText="Disagree"}) => {
//     if (!isOpen) return null;
  
//     return (
//       <div className="fixed inset-0 flex max-w-[100vw] md:max-w-[30em] mx-3 mx-auto items-center justify-center z-50">
//         <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
//         <div className="bg-white rounded-lg shadow-lg p-6 z-10">
//           <h2 className="text-lg text-emerald-800 font-bold">{title}</h2>
//           <p className="mt-2 text-gray-800">{text}</p>
//           <div className="mt-4">
//             {agree?<button className="btn rounded-full mx-3 bg-gray-300 text-green-900 border-none   " onClick={agree}>{agreeText}</button>:null}
//             {onClose?<button className="btn rounded-full bg-emerald-600 text-white border-emerald-500" onClick={onClose}>{disagreeText}</button>:null}
//           </div>
//         </div>
//       </div>
//     );
//   };

// export default Dialog
