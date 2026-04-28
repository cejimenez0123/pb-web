

import { useState } from "react";
import {
  IonLabel,
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
import checkResult from "../../core/checkResult";
import { useDialog } from "../../domain/usecases/useDialog";

export default function CreateCollectionForm({ initPages, onClose }) {
  const dispatch = useDispatch();
  const router = useIonRouter();
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const { openDialog, dialog,closeDialog,resetDialog} = useDialog();

  const [formData, setFormData] = useState({
    name: "",
    purpose: "",
    isPrivate: true,
    isOpenCollaboration: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // --- handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --- toggle boolean fields
  const toggleField = (key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // --- handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (submitting) return;

    const { name, purpose, isPrivate, isOpenCollaboration } = formData;

    if (!name.trim()) {
      setError("Collection name is required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const params = {
        title: name.trim() || "Untitled Collection",
        purpose: purpose.trim() || "",
        isPrivate,
        profileId: currentProfile?.id,
        isOpenCollaboration,
      };

      console.log("FORM DATA", formData);

      const res = await dispatch(createCollection(params));

      if (res?.payload?.collection) {
        const collection = res.payload.collection;
        dispatch(clearPagesInView());

        if (initPages && initPages.length > 0) {
          await dispatch(
            addStoryListToCollection({
              id: collection.id,
              list: initPages,
              profile: currentProfile,
            })
          ).then((res) =>
            checkResult(
              res,
              ({ collection, stories }) => {
                dispatch(setCollectionInView({ collection }));
                dispatch(setPagesInView({ pages: stories }));
              },
              (err) => console.error("Error adding stories:", err)
            )
          );
        } else {
          dispatch(setCollectionInView({ collection }));
        }

        router.push(Paths.collection.createRoute(collection.id));
        if (onClose) onClose();

        // close dialog
        openDialog({ ...dialog, isOpen: false });

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
    } catch (err) {
      console.error("Error creating collection:", err);
      setError(err.message || "Failed to create collection.");
    } finally {
      setSubmitting(false);
    }
    resetDialog()
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {/* Collection Name */}
      <div className="flex flex-col space-y-1">
        <IonLabel className="text-blueSea font-medium">Collection Name</IonLabel>
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Enter collection name"
          onChange={handleChange}
          required
          className="rounded-lg border-blueSea bg-cream border-2 shadow-sm border-opacity-30 sm:w-full w-full p-3 text-blueSea"
        />
      </div>

      {/* Purpose */}
      <div className="flex flex-col space-y-1">
        <IonLabel className="text-blueSea font-medium">Purpose</IonLabel>
        <textarea
          name="purpose"
          value={formData.purpose}
          placeholder="What is this collection for?"
          onChange={handleChange}
          className="rounded-lg border-blueSea border-2 bg-cream shadow-sm border-opacity-30 sm:w-full w-full min-h-[6em] text-blueSea p-3"
        />
      </div>

      {/* Private / Open Collaboration */}
      <div className="flex flex-col space-y-3">
        {/* Private */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <InfoTooltip text="Collection will only be visible to you and those with roles" />
            <span className="text-soft dark:text-cream font-medium">Private</span>
          </div>
          <p
            onClick={() => toggleField("isPrivate")}
            className="bg-blueSea bg-opacity-50 px-4 py-1 rounded-full text-white font-medium cursor-pointer text-center min-w-[3rem]"
          >
            {formData.isPrivate ? "Yes" : "No"}
          </p>
        </div>

        {/* Open Collaboration */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <InfoTooltip text="Anyone who finds this collection can add to it if it's open" />
            <span className="text-soft dark:text-cream font-medium">Open Collaboration</span>
          </div>
          <p
            onClick={() => toggleField("isOpenCollaboration")}
            className="bg-blueSea bg-opacity-50 px-4 py-1 rounded-full text-white font-medium cursor-pointer text-center min-w-[3rem]"
          >
            {formData.isOpenCollaboration ? "Yes" : "No"}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <IonNote color="danger" className="text-sm font-medium">
          {error}
        </IonNote>
      )}

      {/* Submit */}
      <div
        type="submit"
        onClick={handleSubmit}
        className="rounded-full flex justify-center items-center shadow-sm px-6 py-2 border-2 border-blueSea bg-blueSea bg-opacity-90 text-white font-bold text-[1rem] w-fit mx-auto"
      >
        {submitting ? "Creating..." : "Create"}
      </div>
    </form>
  );
}
