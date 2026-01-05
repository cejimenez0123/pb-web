
import { useState } from "react";
import {
  IonInput,

  IonLabel,

  IonText,

  IonNote,
  useIonRouter,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import {
  addStoryListToCollection,
  createCollection,
  setCollectionInView,
} from "../../actions/CollectionActions";
import { clearPagesInView, setPagesInView } from "../../actions/PageActions";
import Paths from "../../core/paths";
import InfoTooltip from "../InfoTooltip";
import "../../App.css";
import { setDialog } from "../../actions/UserActions";
import checkResult from "../../core/checkResult";

export default function CreateCollectionForm({ initPages,onClose, create }) {
  const dispatch = useDispatch();
  const router = useIonRouter()
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const dialog = useSelector((state) => state.users.dialog);

  // --- form state
  const [formData, setFormData] = useState({
    name: "",
    purpose: "",
    isPrivate: true,
    isOpenCollaboration: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // --- handle change
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // --- handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // prevent double clicks

    const { name, purpose, isPrivate, isOpenCollaboration } = formData;

    if (!name.trim()) {
      setError("Collection name is required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const params = {
      title: name.trim()??"Untitled Collection",
      purpose: purpose.trim()??"",
      isPrivate,
      profileId: currentProfile?.id,
      isOpenCollaboration,
    };

    const res = await dispatch(createCollection(params));
    setSubmitting(false);
    if (res?.payload?.collection) {
      const collection = res.payload.collection;
      dispatch(clearPagesInView());
      initPages && initPages.length>0?  dispatch(addStoryListToCollection({id:collection.id,list:initPages,profile:currentProfile})).then(res=>{
        checkResult(res,payload=>{
          const {collection,stories} = payload
          dispatch(setCollectionInView({collection}))
          dispatch(setPagesInView({pages:stories}))
          
          // successfully added stories to collection
        },err=>{
          // failed to add stories to collection
        })
      }): dispatch(setCollectionInView({ collection }));
      router.push(Paths.collection.createRoute(collection.id));
      if (onClose) onClose();

      const updatedDialog = { ...dialog, isOpen: false };
      dispatch(setDialog(updatedDialog));

      // reset form
      setFormData({
        name: "",
        purpose: "",
        isPrivate: true,
        isOpenCollaboration: false,
      });
    } else if (res?.payload?.error) {
      setError(res.payload.error.message || "Failed to create collection.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex  flex-col space-y-6">
      {/* <IonItem lines="none" className="ion-padding-vertical"> */}
        <IonLabel position="stacked text-blueSea">Collection Name</IonLabel>
        <input type="text"
          value={formData.name}
          placeholder="Enter collection name"
          onChange={(e) => handleChange("name", e.currentTarget.value ?? "")}
          
          required
          className="rounded-lg border-blueSea border-2 shadow-sm border-opacity-30 sm:w-full w-[100%] p-3 text-blueSea"
          // className="ion-text-wrap"
          // style={{
          //   width: "100%",
          //   fontSize: "1rem",
          //   border: "1px solid var(--ion-color-light)",
          //   borderRadius: "8px",
          //   padding: "0.5rem",
          // }}
        />
      {/* </IonItem> */}

      <IonLabel
        position="stacked"
        className="text-blueSea font-medium  mb-1"
      >
        Purpose
      </IonLabel>
      <textarea
        value={formData.purpose}
        autoGrow
        placeholder="What is this collection for?"
        onChange={(e) => handleChange("purpose", e.currentTarget.value ?? "")}
        className="rounded-lg border-blueSea border-2 shadow-sm border-opacity-30 sm:w-full w-[100%] min-h-[6em] text-blueSea p-3"
      />

  

          <div className="flex flex-row  text-left items-left ">
          <InfoTooltip text="Collection will only be visible to you and those with roles" />
          <span>Private</span>
          <p className="mx-4">{formData.isPrivate ? "Yes" : "No"}</p>
          </div>
          <div 
            onClick={() => handleChange("isPrivate", !formData.isPrivate)} 
            className={`min-h-6  mx-8 shadow-md rounded-full max-w-6 ${formData.isPrivate ? "bg-blueSea bg-opacity-30":"bg-emerald-500"}`}/>
      

    
 
        <div className="flex flex-row  items-left ">
                   <InfoTooltip text="Anyone who finds this collection can add to it if it's open" />
          <span>Open Collaboration</span>
          <p className="mx-4">{formData.isOpenCollaboration ? "Yes" : "No"}</p>
          </div>
  <div onClick={() => handleChange("isOpenCollaboration", !formData.isOpenCollaboration)} className={`min-h-6 shadow-md mx-8 rounded-full max-w-6 ${!formData.isOpenCollaboration ?   "bg-blueSea bg-opacity-30":"bg-emerald-500"}`}></div>

    

      {error && (
        <IonNote color="danger" className="text-sm font-medium">
          {error}
        </IonNote>
      )}

      
                <div type="submit"
                
              expand="block"
onClick={handleSubmit}
            //   className="bg-emerald-800 text-white rounded-full" 
              className='rounded-full flex btn  btn shadow-sm px-4  bg-blueSea bg-opacity-90  text-center w-fit h-[3rem] text-[1rem] border-2'
            >
          <IonText
            fill="outline"
            color="white"
            className=" my-auto mx-auto text-white text-[1rem]"
            
          >
           {submitting ? "Creating..." : "Create"}
          </IonText>
         
    
        </div>
  
      {/* </IonButton> */}
    </form>
  );
}
