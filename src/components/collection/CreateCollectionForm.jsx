// import { useState } from "react"
// import close from "../../images/icons/close_dark.svg"
// import { useDispatch, useSelector } from "react-redux"
// import { createCollection, setCollectionInView } from "../../actions/CollectionActions"
// import { useNavigate } from "react-router-dom"
// import Paths from "../../core/paths"
// import "../../App.css"
// import { clearPagesInView } from "../../actions/PageActions.jsx"
// import InfoTooltip from "../InfoTooltip"
// export default function CreateCollectionForm({onClose}){
//     const currentProfile = useSelector(state=>state.users.currentProfile)
//     const [name,setName]=useState("")
//     const [purpose,setPurpose]=useState("")
//     const [isPrivate,setIsPrivate]=useState(true)
//     const [writingIsOpen,setWritingIsOpen]=useState(false)
//     const navigate = useNavigate()
//     const dispatch = useDispatch()
//     const clickCreateCollection = (e)=>{
//         e.preventDefault()
//         let params = {
//             title:name,
//             purpose:purpose,
//             isPrivate:isPrivate,
//             profileId:currentProfile.id,
//             isOpenCollaboration:writingIsOpen
//         } 
    
//         dispatch(createCollection(params)).then(res=>{
//             dispatch(clearPagesInView())
//             dispatch(setCollectionInView({collection:res.payload.collection}))
//             navigate(Paths.collection.createRoute(res.payload.collection.id))
//             onClose()
//         })
//     }
//     return(<form className=" lg:w-[100%]   rounded-lg text-emerald-700 ">

//         <div className="mb-3 mx-4 pt-4" >

//         <div className="px-4 pb-8">
//         <div class="mb-4 flex flex-col">
//         </div>
//         <h2 className="mx-auto mont-medium  text-emerald-700 text-2xl font-bold mb-4">Create Collection</h2>
//         <label className="xs mont-medium text-emerald-700 text-xl mb-2">
//             Name of Collection
//         </label>
//         <input 
//         value={name}
//         className="bg-transparent rounded-lg w-[100%]  text-emerald-700 px-2 p-2 text-md lg:text-l border-emerald-800 border-2 "
//         onChange={(e)=>setName(e.target.value)}
//         />
//         <label className=" mt-6 text-xl">
//             Purpose
//         </label>
//         <textarea value={purpose}
//         className="bg-transparent rounded-lg  text-emerald-700  w-[100%] mt-2  p-2 text-md lg:text-l border-emerald-700 border-2 resize-y"
//                  onChange={(e)=>setPurpose(e.target.value)}/>
// <div className="flex  flex-row">
//      <div className="my-auto ">
//         <InfoTooltip text="Collection will only be visible to you and those with roles"/></div>
//         <div className="my-4 w-fit max-w-36">
   
//             {isPrivate?<h6 onClick={()=>setIsPrivate(false)} className={"bg-emerald-800   mont-medium py-3 text-[0.95rem] sm:text-[1rem] w-[14em]  text-white rounded-full px-4  text-center"}>is Private</h6>:<h6
//             className={"bg-emerald-700  mont-medium text-white rounded-full text-[0.95rem] text-[0.95rem] sm:text-[1rem] w-[14em]  py-3  border-3 border-emerald-400 sm:text-[1rem] text-center "}
//             onClick={()=>setIsPrivate(true)}>is Public</h6>}
            
//         </div>
// </div>

//   <div className=" flex-row flex ">
//     <InfoTooltip text="Anyone who finds this collection can add to it if it's open"/>

//             {writingIsOpen?<div className={"bg-transparent mont-medium flex border-emerald-800 border-4 text-center w-[14em] h-[4em] text-white text-[0.95rem] sm:text-[1rem] rounded-full  "} onClick={()=>setWritingIsOpen(false)}>
//                 <h6 className="mx-auto my-auto">Open Collaboration</h6></div>:<div
//             onClick={()=>setWritingIsOpen(true)}
//             className={"bg-transparent  mont-medium flex border-emerald-800  border-2 text-center w-[14em] text-white h-[4em] text-[0.95rem] sm:text-[1rem] rounded-full  "} 
// ><h6 className="mx-auto my-auto text-emerald-800">Close Collaboration</h6></div>}

// </div>    </div>
//     <div className="text-right">
// <button onClick={(e)=>clickCreateCollection(e)} className="bg-emerald-800 px-5  mont-medium rounded-full text-[1.2rem] text-white">
//    Create
// </button>
// </div>
// </div>
//   </form>)
// }
import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonTextarea,
  IonItem,
  IonLabel,
  IonButton,
  IonToggle,
  IonButtons,
  IonIcon,
  IonText,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
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


    //   <IonContent fullscreen={true} className="ion-padding">
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

          {/* <IonItem lines="none">
            <IonLabel position="stacked" className="text-emerald-700 font-medium">
              Name of Collection
            </IonLabel>
            <IonInput
              value={name}
              style={{maxWidth:"90vw",backgroundColor:"emerald"}}

              placeholder="Enter collection name"
              onIonChange={(e) => setName(e.detail.value)}
              className="bg-emerald-100  rounded-lg  py-2"
              required
            />
          </IonItem> */}
{/* <IonItem
  lines="none"
  className="rounded-lg border-2 border-emerald-800 my-2 bg-transparent"
> */}
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
          {/* <div className="text-right">
            <IonButton
              type="submit"
              expand="block"
              className="bg-emerald-800 text-white rounded-full"
            >
              Create
            </IonButton> */}
          {/* </div> */}
        </form>
    //   </IonContent>
   
  );
}
