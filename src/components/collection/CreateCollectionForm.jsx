
import React, { useState } from "react";
import {
 
  IonInput,
  IonTextarea,
  IonItem,
  IonLabel,

  IonToggle,
 
  IonText,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCollection, setCollectionInView } from "../../actions/CollectionActions";
import { clearPagesInView } from "../../actions/PageActions";
import Paths from "../../core/paths";
import InfoTooltip from "../InfoTooltip";
import "../../App.css";
import { setDialog } from "../../actions/UserActions";

export default function CreateCollectionForm({ onClose,create }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentProfile = useSelector((state) => state.users.currentProfile);
const dialog = useSelector(state=>state.users.dialog??{text:"",title:"",agree:()=>{},onClose:()=>{},isOpen:false,agreeText:"agree",disagreeText:"Close"})


  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [isOpenCollaboration, setIsOpenCollaboration] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = {
      title: name,
      purpose,
      isPrivate,
      profileId: currentProfile?.id,
      isOpenCollaboration,
    }
    const res = await dispatch(createCollection(params));
    if (res?.payload?.collection) {
      dispatch(clearPagesInView());
      dispatch(setCollectionInView({ collection: res.payload.collection }));
      navigate(Paths.collection.createRoute(res.payload.collection.id));
      onClose();
      let dia = {...dialog}
      dia.isOpen=false
      dispatch(setDialog(dia))
    }
  };

  return (


    
        <form  className="space-y-6 flex flex-col">
            <IonItem lines="none" className="ion-padding-vertical">
  <IonLabel position="stacked">Collection Name</IonLabel>
  <IonInput
    value={name}
    placeholder="Enter collection name"
     onIonChange={(e) => setName(e.detail.value)}
    className="ion-text-wrap"
    style={{
      width: "100%",
      fontSize: "1rem",
      border: "1px solid var(--ion-color-light)",
      borderRadius: "8px",
      padding: "0.5rem",
    }}
  />
</IonItem>

  <IonLabel
    position="stacked"
    className="text-emerald-700 font-medium text-lg mb-1"
  >
    Purpose
  </IonLabel>
  <IonTextarea
    value={purpose}
    autoGrow
    placeholder="What is this collection for?"
    onIonChange={(e) => setPurpose(e.detail.value)}
    className="ion-textarea-custom"
  />
{/* </IonItem> */}

 <IonItem lines="none" className="ion-align-items-center">
    <IonLabel className="flex items-center gap-1 text-emerald-700 font-medium">
      <span>Private</span>
      <InfoTooltip text="Collection will only be visible to you and those with roles" />
    </IonLabel>
    <IonToggle
      checked={isPrivate}
      onIonChange={(e) => setIsPrivate(e.detail.checked)}
      color="success"
    />
  </IonItem>

  <IonItem lines="none" className="ion-align-items-center">
    <IonLabel className="flex items-center gap-1 text-emerald-700 font-medium">
      <span>Open Collaboration</span>
      <InfoTooltip text="Anyone who finds this collection can add to it if it's open" />
    </IonLabel>
    <IonToggle
      checked={isOpenCollaboration}
      onIonChange={(e) => setIsOpenCollaboration(e.detail.checked)}
      color="success"
    />
  </IonItem>
          {/* <IonItem lines="none" className="flex items-center justify-between">
            <IonLabel className="text-emerald-700">
              Private
              <InfoTooltip text="Collection will only be visible to you and those with roles" />
            </IonLabel>
            <IonToggle
              checked={isPrivate}
              onIonChange={(e) => setIsPrivate(e.detail.checked)}
              color="success"
            />
          </IonItem>

          <IonItem lines="none" className="flex items-center justify-between">
            <IonLabel className="text-emerald-700">
              Open Collaboration
              <InfoTooltip text="Anyone who finds this collection can add to it if it's open" />
            </IonLabel>
            <IonToggle
              checked={isOpenCollaboration}
              onIonChange={(e) => setIsOpenCollaboration(e.detail.checked)}
              color="success"
            />
          </IonItem> */}
          <div type="submit"
              expand="block"
onClick={handleSubmit}
            //   className="bg-emerald-800 text-white rounded-full" 
              className='rounded-full flex  btn px-4   text-center w-fit h-[3rem] text-[1rem] border-emerald-600 border-2'
            >
          <IonText
            fill="outline"
            color="success"
            className=" my-auto mx-autotext-emerrald-800 text-[1rem]"
            
          >
            Create
          </IonText>
          </div>
    
        </form>

   
  );
}
