
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
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";




export default function PicturePageForm({ handleChange,type, parameters,createPageAction }) {
  const page = useSelector((state) => state.pages.editingPage);
  // const { parameters } = useContext(EditorContext);
  const { type: typeOrNull } = useParams();
  console.log("FORM TYPE null",typeOrNull)
  console.log("FORM TYPE",type)
  const pageType = typeOrNull || type
  const {setError}=useContext(Context)
  const dispatch = useDispatch();
  const [file,setFile]=useState(null)
   const [url,setUrl]=useState(null)
   const htmlContent = useSelector(state=>state.pages.editorHtmlContent)
  const [localPreview, setLocalPreview] = useState(parameters.data); // file preview
  const [uploading, setUploading] = useState(false);

const isNative = Capacitor.isNativePlatform()


const pickImage = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });

    // ✅ Get mime type (best effort)
    let mimeType = image.format; // 'jpeg', 'png', etc.

    if (mimeType) {
      mimeType = mimeType.toLowerCase();
    }

    // ✅ Validate type
    const isValid =
      mimeType === "jpeg" ||
      mimeType === "jpg" ||
      mimeType === "png";

    if (!isValid) {
      setError("Only JPG and PNG images are allowed");
      return;
    }

    setLocalPreview(image.webPath);

    if (isNative) {
      // ✅ Native → pass path
      setFile({
        path: image.path,
        format: mimeType,
      });
    } else {
      // ✅ Web → convert to File
      const response = await fetch(image.webPath);
      const blob = await response.blob();

      // Extra safety check using blob type
      if (!["image/jpeg", "image/png"].includes(blob.type)) {
        setError("Only JPG and PNG images are allowed");
        return;
      }

      const file = new File([blob], "image.jpg", { type: blob.type });
      setFile(file);
    }
  } catch (err) {
    console.error("Image pick error:", err);
  }
};
 // Instead of dispatching on every keystroke:
const handleInput = (e) => {
  const value = e.detail?.value ?? e.target.value;
  // const finalValue = value;
  setUrl(value)
handleChange("data",value)
dispatch(setHtmlContent(value))
  

};


const handleCreate = async () => {
  setUploading(true)
  if (type === PageType.picture) {
  
    if (file && !parameters.data) {
      await uploadPictureFile();
      return; // wait for next click OR auto-trigger (see below)
    }

    if (!parameters.data) {
      setError("No image uploaded");
      return;
    }

    createPageAction(parameters.data);
  } else {
    createPageAction(url);
  }
  setUploading(false)
};
const uploadPictureFile = async () => {
  if (!file && type === PageType.picture) {
    setError("No File");
    return;
  }

  setUploading(true);
  try {
    const { url } = await dispatch(uploadPicture({ file })).unwrap();

    handleChange("data", url);
    dispatch(setHtmlContent(url));
    createPageAction(url)
   

  } catch (err) {
    console.error("Upload failed", err);
  } finally {
    setUploading(false);
  }
};
//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
// setFile(file);
//     // Show preview immediately
//     const reader = new FileReader();
//     reader.onload = () => setLocalPreview(reader.result);
//     reader.readAsDataURL(file);

//     setUploading(false);
// }
   
const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const isValidType = ["image/jpeg", "image/png"].includes(file.type);

  if (!isValidType) {
    setError("Only JPG and PNG images are allowed");
    return;
  }

  setFile(file);

  const reader = new FileReader();
  reader.onload = () => setLocalPreview(reader.result);
  reader.readAsDataURL(file);
};
  const renderPreview = () => {
 const previewSrc = localPreview || parameters.data;
    if (!previewSrc) return null;

    if (type === PageType.link) {
      return <LinkPreview url={parameters.data} />;
    }

    if (type === PageType.picture) {
      if (!isValidUrl(previewSrc) && !localPreview) return null;

      return (
        <div className="mt-4 flex justify-center">
          <IonImg src={previewSrc} className="rounded-xl max-h-[300px]" />
        </div>
      );
    }

    return null;
  };
console.log("HTML type",type==PageType.picture)
  return (
    <div className="flex flex-col w-full max-w-xl mx-auto">
      {/* Input */}
      {(type === PageType.link || type === PageType.picture) && (
        <>
          <IonLabel className="text-emerald-700 mb-1">
            {type === PageType.link ? "URL" : "Image URL / Upload"}
          </IonLabel>

          <IonInput
            value={htmlContent}
            onIonChange={handleInput}
            placeholder={
              type === PageType.link ? "https://example.com" : "Paste image URL"
            }
            className="border border-emerald-300 rounded-md px-2 mb-2"
            disabled={uploading}
          />


{pageType === PageType.picture?(isNative ? (
  <button
    onClick={pickImage}
    className="btn bg-emerald-600 text-white mt-2"
  >
    Choose Image
  </button>
) : (
  <input
    type="file"
    accept="image/png, image/jpeg"
    onChange={handleFileChange}
    className="mb-2 file-input"
  />
)):null}
          {pageType== PageType.link &&
            parameters.data &&
            !isValidUrl(parameters.data) && (
              <IonText className="text-red-500 text-sm mt-1">Invalid URL</IonText>
            )}
        </>
      )}

      {/* Button */}
      <div className="w-full mt-4">
        {!parameters?.id? (
          <button
  onClick={handleCreate}
  disabled={uploading}
  className="w-full h-[3.5em] rounded-xl bg-emerald-600 text-white font-semibold active:scale-[0.98] disabled:opacity-50"
>
  {uploading ? "Uploading..." : "Create"}
</button>
        ) : (
          <div className="w-full h-[3.5em] rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center text-sm">
            {!parameters.isSaved? "Saved ✓" : "Saving..."}
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="mt-4">{renderPreview()}</div>
    </div>
  );
}