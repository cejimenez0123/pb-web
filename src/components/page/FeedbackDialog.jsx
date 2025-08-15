import { useMediaQuery } from "react-responsive"
import { useLayoutEffect, useState } from "react"
import { IonModal } from "@ionic/react"
export default function FeedbackDialog({open,page,isFeedback,handleClose,handleChange,handlePostPublic,handleFeedback}){
    const isPhone =  useMediaQuery({
        query: '(max-width: 768px)'
      })
    const isHeightPhone = useMediaQuery({query:'(max-height: 366px)'})
 
    useLayoutEffect(()=>{
      if(page && page.description){

      handleChange(page.description)
    }},[])
    const [feedback,setFeedback]=useState(!page || isFeedback?"":page.description)
   if(page){
    return(  <IonModal
    isOpen={open} 
    title={page.title}
    onDidDismiss={handleClose}
    cssClass="modal-fullscreen pt-4 ion-padding"
    presentingElement={presentingElement}
    style={{backgroundColor:"white",height:"100vh",overflowY:"scroll"}}
    swipeToClose={true}
  >
    <IonHeader>
  <IonToolbar color="success">
    <IonButtons slot="start">
      <IonBackButton  onClick={handleClose} />
    </IonButtons>
    <IonTitle className="ion-text-emerald-900">
      {page.title}
    </IonTitle>
  </IonToolbar>
</IonHeader>
  </IonModal>)
   }
  }