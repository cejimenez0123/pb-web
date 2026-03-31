
import {
  IonLabel,
  IonInput,
  IonText,
  IonImg,

} from "@ionic/react";

import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { PageType } from "../../core/constants";
import { setHtmlContent } from "../../actions/PageActions.jsx";
import isValidUrl from "../../core/isValidUrl";
import LinkPreview from "../LinkPreview";
import Context from "../../context";
import EditorContext from "../../container/page/EditorContext.jsx";
import { uploadPicture } from "../../actions/ProfileActions.jsx";




export default function PicturePageForm({ handleChange, createPageAction }) {
  const page = useSelector((state) => state.pages.editingPage);
  const { parameters } = useContext(EditorContext);
  const dispatch = useDispatch();
  const [file,setFile]=useState(null)
  const [localPreview, setLocalPreview] = useState(""); // file preview
  const [uploading, setUploading] = useState(false);

  // Reset htmlContent when type or page changes
//   useEffect(() => {
//     const newData = page?.data ?? "";
//     console.log("Page or type changed, resetting content to:", newData);
//     dispatch(setHtmlContent(newData ));
//     handleChange("data", newData);
//  // clear any previous file preview
//   }, [page, parameters.type]);

  const normalizeUrl = (url) => (url?.startsWith("http") ? url : `https://${url}`);

 // Instead of dispatching on every keystroke:
const handleInput = (e) => {
  const value = e.detail?.value ?? e.target.value;
  const finalValue = parameters.type === PageType.link ? normalizeUrl(value) : value;
  
  // Update local parameters
  handleChange("data", finalValue);
  
  // Only update redux if needed for preview/editor
  // dispatch(setHtmlContent(finalValue));
};

// In upload:
const uploadPictureFile = async () => {
  if (!file) return;
  setUploading(true);
  try {
    const { url } = await dispatch(uploadPicture({ file })).unwrap();
    
    // Use local state
    handleChange("data", url);

    // Update Redux just once after upload
    dispatch(setHtmlContent(url));

    // Directly create page using the local data
    createPageAction(url);
  } catch (err) {
    console.error("Upload failed", err);
  } finally {
    setUploading(false);
  }
};
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
setFile(file);
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = () => setLocalPreview(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);

   
  };
// const uploadPictureFile = async () => {
//  try {
//       const { url } = await dispatch(uploadPicture({ file })).unwrap();

//       dispatch(setHtmlContent(url));
//       handleChange("data", url);
     
//       createPageAction()
//       // setLocalPreview(""); // remove local preview
//     } catch (err) {
//       console.error("Upload failed", err);
//     } finally {
//       setUploading(false);
//     }
// }
  const renderPreview = () => {
    const previewSrc = localPreview || parameters.data;
    if (!previewSrc) return null;

    if (parameters.type === PageType.link) {
      return <LinkPreview url={parameters.data} />;
    }

    if (parameters.type === PageType.picture) {
      if (!isValidUrl(previewSrc) && !localPreview) return null;

      return (
        <div className="mt-4 flex justify-center">
          <IonImg src={previewSrc} className="rounded-xl max-h-[300px]" />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto">
      {/* Input */}
      {(parameters.type === PageType.link || parameters.type === PageType.picture) && (
        <>
          <IonLabel className="text-emerald-700 mb-1">
            {parameters.type === PageType.link ? "URL" : "Image URL / Upload"}
          </IonLabel>

          <IonInput
            value={parameters.data}
            onIonChange={handleInput}
            placeholder={
              parameters.type === PageType.link ? "https://example.com" : "Paste image URL"
            }
            className="border border-emerald-300 rounded-md px-2 mb-2"
            disabled={uploading} // optional: disable while uploading
          />

          {parameters.type === PageType.picture && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-2 file-input"
            />
          )}

          {parameters.type === PageType.link &&
            parameters.data &&
            !isValidUrl(parameters.data) && (
              <IonText className="text-red-500 text-sm mt-1">Invalid URL</IonText>
            )}
        </>
      )}

      {/* Button */}
      <div className="w-full mt-4">
        {!page ? (
          <button
            onClick={uploadPictureFile}
            className="w-full h-[3.5em] rounded-xl bg-emerald-600 text-white font-semibold active:scale-[0.98]"
          >
            Create
          </button>
        ) : (
          <div className="w-full h-[3.5em] rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center text-sm">
            {parameters.isSaved ? "Saved ✓" : "Saving..."}
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="mt-4">{renderPreview()}</div>
    </div>
  );
}