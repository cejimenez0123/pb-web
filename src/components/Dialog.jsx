import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,

  IonFooter,
  IonButtons,
  IonText,

  IonBackButton,
} from '@ionic/react';
import { useDispatch } from 'react-redux';
import { setDialog } from '../actions/UserActions';
import { Capacitor } from '@capacitor/core';

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
  cssClass="modal-fullscreen pt-4 ion-padding"
  presentingElement={presentingElement}
  style={{backgroundColor:"white",height:"100vh",overflowY:"scroll"}}
  swipeToClose={true}
><IonHeader>
  <IonToolbar color="success">
    <IonButtons slot="start">
     <IonBackButton  onClick={onClose} />
    </IonButtons>
    <IonTitle className="ion-text-emerald-900">
      {dialog.title}
    </IonTitle>
  </IonToolbar>
</IonHeader>

<div className='ion-padding'>
{dialog.text}
</div>
      <IonFooter className="ion-padding-horizontal ion-padding-vertical" style={{ display: 'flex', justifyContent: dialog.agree ? 'space-between' : 'flex-end' }}>
        {dialog.agree?(
          <div className='rounded-full flex  px-4   w-fit h-[3rem] text-[1rem] border-emerald-400 border-2'>
          <IonText
            fill="outline"
            color="success"
            className=" my-auto mx-autotext-emerrald-800 text-[1rem]"
            onClick={dialog.agree}
          >
            {dialog.agreeText}
          </IonText>
          </div>
        ):null}
          <div className='rounded-full w-[6rem] h-[3rem] flex  border-emerald-600 border-2'>
        <IonText   className='text-[1rem] my-auto mx-auto' onClick={dialog.onClose} >
          {dialog.disagreeText}
          </IonText>
          </div>
      </IonFooter>
    </IonModal>
  )
};
return null
};

export default Dialog;
