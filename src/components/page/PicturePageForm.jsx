
// import {
//   IonLabel,
//   IonInput,
//   IonText,
//   IonImg,

// } from "@ionic/react";
// import React, { memo } from "react";
// import { useState, useContext, useEffect } from "react";
// import { useParams } from "react-router";
// import { useSelector, useDispatch } from "react-redux";

// import { PageType } from "../../core/constants";
// import { setHtmlContent } from "../../actions/PageActions.jsx";
// import isValidUrl from "../../core/isValidUrl";
// import LinkPreview from "../LinkPreview";
// import Context from "../../context";
// import { uploadPicture } from "../../actions/ProfileActions.jsx";
// import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
// import { Capacitor } from "@capacitor/core";
// import { set } from "lodash";




// export default function PicturePageForm({ handleChange,type,isSaved, setIsSaved,parameters,createPageAction }) {
//   const page = useSelector((state) => state.pages.editingPage);
//   // const { parameters } = useContext(EditorContext);
//   const { type: typeOrNull } = useParams();

//   const pageType = typeOrNull || type
//   const {setError}=useContext(Context)
//   const dispatch = useDispatch();
//   const [file,setFile]=useState(null)
//    const [url,setUrl]=useState(null)
//    const htmlContent = useSelector(state=>state.pages.editorHtmlContent)
 
 
//     const [uploading, setUploading] = useState(false);
//     const [isUploaded, setIsUploaded] = useState(false); // Track if already uploaded (for pictures)
// const isNative = Capacitor.isNativePlatform()
// const [hasContent, setHasContent] = useState(() => {
//   return(type === PageType.link
//     ? isValidUrl(parameters.data) 
//     : type === PageType.picture
//     ? !!(file || parameters.data)
//     : !!htmlContent?.trim() && htmlContent.trim().length > 0) || false;})

// const pickImage = async () => {
//   try {
//     const image = await Camera.getPhoto({
//       quality: 80,
//       resultType: CameraResultType.Uri,
//       source: CameraSource.Photos,
//     });

//     // ✅ Get mime type (best effort)
//     let mimeType = image.format; // 'jpeg', 'png', etc.

//     if (mimeType) {
//       mimeType = mimeType.toLowerCase();
//     }

//     // ✅ Validate type
//     const isValid =
//       mimeType === "jpeg" ||
//       mimeType === "jpg" ||
//       mimeType === "png";

//     if (!isValid) {
//       setError("Only JPG and PNG images are allowed");
//       return;
//     }

//     dispatch(setHtmlContent(image.webPath));

//     if (isNative) {
//       // ✅ Native → pass path
//       setFile({
//         path: image.path,
//         format: mimeType,
//       });
//     } else {
//       // ✅ Web → convert to File
//       const response = await fetch(image.webPath);
//       const blob = await response.blob();

//       // Extra safety check using blob type
//       if (!["image/jpeg", "image/png"].includes(blob.type)) {
//         setError("Only JPG and PNG images are allowed");
//         return;
//       }

//       const file = new File([blob], "image.jpg", { type: blob.type });
//       setFile(file);
//     }
//   } catch (err) {
//     console.error("Image pick error:", err);
//   }
// };
//  // Instead of dispatching on every keystroke:
// const handleInput = (e) => {
//   const value = e.detail?.value ?? e.target.value;
//   // const finalValue = value;
//   setUrl(value)
// handleChange("data",value)
// dispatch(setHtmlContent(value))
  

// };
// useEffect(() => {
//   if (type === PageType.link || type === PageType.picture) {
//     handleChange("data", htmlContent);
//   }
// }, [htmlContent]);

// useEffect(() => {
//   if (type === PageType.picture && parameters.data) setHasContent(true);
//   if (type === PageType.link && isValidUrl(parameters.data)) setHasContent(true);
// }, [parameters.data]);
// // Remove setUploading from uploadPictureFile entirely, let handleCreate own it
// const uploadPictureFile = async () => {
//   if (!file) { setError("No File"); return null; }
//   try {
//     const { url } = await dispatch(uploadPicture({ file })).unwrap();
//     handleChange("data", url);
//     dispatch(setHtmlContent(url));
//     return url;
//   } catch (err) {
//     console.error("Upload failed", err);
//     return null;
//   }
// };

// const handleCreate = async () => {
//   setUploading(true);
//   setIsSaved(false);
//   try {
//     if (type === PageType.picture) {
//       let finalUrl = parameters.data;
//       if (!finalUrl && file) {
//         finalUrl = await uploadPictureFile();
//       }
//       if (!finalUrl) { setError("No image uploaded"); return; }
//       await createPageAction(finalUrl);
//     } else {
//       await createPageAction(url);
//     }
//     setHasContent(true);
//     setIsUploaded(true);
//   } finally {
//     setUploading(false);
//   }
// };
// // const uploadPictureFile = async () => {
// //   if (!file) { setError("No File"); return null; }
// //   setUploading(true);
// //   try {
// //     const { url } = await dispatch(uploadPicture({ file })).unwrap();
// //     handleChange("data", url);
// //     dispatch(setHtmlContent(url));
// //     return url;
// //   } catch (err) {
// //     console.error("Upload failed", err);
// //     return null;
// //   } finally {
// //     setUploading(false);
// //   }
// // };

// // const handleCreate = async () => {
// //   setUploading(true);
// //   setIsSaved(false);
// //   try {
// //     if (type === PageType.picture) {
// //       let finalUrl = parameters.data;
// //       if (!finalUrl && file) {
// //         finalUrl = await uploadPictureFile();
// //       }
// //       if (!finalUrl) { setError("No image uploaded"); return; }
// //       await createPageAction(finalUrl);
// //     } else {
// //       await createPageAction(url);
// //     }
// //     setHasContent(true);
// //     setIsUploaded(true);
// //   } finally {
// //     setUploading(false);
// //   }
// // };
// // const handleCreate = async () => {
// //   setUploading(true)
// //   setIsSaved(false)
// //   if (type === PageType.picture) {
    
// //     if (file && !parameters.data) {
// //       await uploadPictureFile();
   
// //       return; // wait for next click OR auto-trigger (see below)
// //     }

// //     if (!parameters.data) {
// //       setError("No image uploaded");
// //       return;
// //     }

// //    await createPageAction(parameters.data);
// //    setHasContent(true)
// //    setIsUploaded(true)
  
// //   } else {
// //     setIsUploaded(false)
  
// //    await createPageAction(url);
// //     setIsUploaded(true)
// //     setHasContent(true)
// //   }
// //   setUploading(false)
// // };
// // const uploadPictureFile = async () => {
// //   if (!file && type === PageType.picture) {
// //     setError("No File");
// //     return;
// //   }
// //     setIsUploaded(false)
// //   setUploading(true);
// //   try {
// //     const { url } = await dispatch(uploadPicture({ file })).unwrap();

// //     handleChange("data", url);
// //     dispatch(setHtmlContent(url));
// //     createPageAction(url);
// //     setIsUploaded(true);

// //   } catch (err) {
// //     console.error("Upload failed", err);
// //   } finally {
// //     setUploading(false);
// //   }
// // };

   
// const handleFileChange = (e) => {
//   const file = e.target.files?.[0];
//   if (!file) return;

//   const isValidType = ["image/jpeg", "image/png"].includes(file.type);

//   if (!isValidType) {
//     setError("Only JPG and PNG images are allowed");
//     return;
//   }

//   setFile(file);

//   const reader = new FileReader();
//   reader.onload = () => {
//     dispatch(setHtmlContent(reader.result))
    
  
//   }
//   reader.readAsDataURL(file);
// };

// const isCreated = parameters?.id
//   return (
//     <div className="flex flex-col w-full max-w-xl mx-auto">
//       {/* Input */}
//        {
//        (((!isUploaded)&&(typeOrNull==PageType.link || typeOrNull==PageType.picture))) 
//        && (
//         <>
//           <IonLabel className="text-emerald-700 mb-1">
//             {type === PageType.link ? "URL" : "Image URL / Upload"}
//           </IonLabel>

//          { <IonInput
//             value={htmlContent}
//             onIonChange={handleInput}
//             placeholder={
//               type === PageType.link ? "https://example.com" : "Paste image URL"
//             }
//             className="border border-emerald-300 dark:text-cream text-soft rounded-md px-2 mb-2"
//             disabled={uploading}
//           />} </>
//        )}
//         <>


// {(!isUploaded) && pageType === PageType.picture?(isNative ? (
//   <button
//     onClick={pickImage}
//     className="btn bg-emerald-600 text-white mt-2"
//   >
//     Choose Image
//   </button>
// ) : (
//   <input
//     type="file"
//     accept="image/png, image/jpeg"
//     onChange={handleFileChange}
//     className="mb-2 file-input"
//   />
// )):null}
//           {pageType== PageType.link &&
//             parameters.data &&
//             !isValidUrl(parameters.data) && (
//               <IonText className="text-red-500 text-sm mt-1">Invalid URL</IonText>
//             )}
//         </>
    

 
//       <div className="w-full mt-4">

//   {(!isUploaded&&!hasContent) && (
//     <div className="w-full h-[3.5em] rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center text-sm">
//       Add {type === PageType.link ? "a valid URL" : "an image"} to continue
//     </div>
//   )}

//   {/* 🚀 Ready to create */}
//   {/* { true && ( */}
//   {/* !hasContent&&(typeOrNull==PageType.link || typeOrNull==PageType.picture)  */}
//     {(!hasContent) && (typeOrNull == PageType.picture ||  typeOrNull == PageType.link) && <button
//       onClick={handleCreate}
//       disabled={uploading}
//       className="w-full h-[3.5em] rounded-xl bg-emerald-600 text-white font-semibold active:scale-[0.98] disabled:opacity-50 transition"
//     >
//       {uploading ? "Uploading..." : "Create"}
//     </button>
//   }


// </div>


//       {/* Preview */}
//       <div className="mt-4"><RenderPreview type={type}src={htmlContent || parameters.data} /></div>
//     </div>
//   );
// }


// const RenderPreview = memo(({ src, type }) => {


//   if (!src) return null;

//   if (type === PageType.link) {
//     return <LinkPreview url={src} />;
//   }

//   if (type === PageType.picture) {
//     return (
//       <div className="mt-4 flex justify-center">
//         <IonImg src={src} className="rounded-xl max-h-[300px]" />
//       </div>
//     );
//   }

//   return null;
// });
import {
  IonLabel,
  IonInput,
  IonText,
  IonImg,
  useIonRouter,
} from "@ionic/react";
import React, { memo } from "react";
import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { PageType } from "../../core/constants";
import { setHtmlContent } from "../../actions/PageActions.jsx";
import isValidUrl from "../../core/isValidUrl";
import LinkPreview from "../LinkPreview";
import Context from "../../context";
import { uploadPicture } from "../../actions/ProfileActions.jsx";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";

export default function PicturePageForm({ handleChange, type, isSaved, setIsSaved, parameters, createPageAction }) {
  const page = useSelector((state) => state.pages.editingPage);
  const { type: typeOrNull } = useParams();
  let path = location.pathname.split("/")
  const id = path[path.length-1] !== "edit"
  console.log("Updated",id)
  const pageType = typeOrNull || type;
  const { setError } = useContext(Context);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null);
  const htmlContent = useSelector(state => state.pages.editorHtmlContent);
  const [uploading, setUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const isNative = Capacitor.isNativePlatform();
const hasContent = !(pageType==PageType.picture && !!(htmlContent?.trim())) || (pageType==PageType.link && !!htmlContent.trim())
  const pickImage = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      let mimeType = image.format;
      if (mimeType) mimeType = mimeType.toLowerCase();

      const isValid = mimeType === "jpeg" || mimeType === "jpg" || mimeType === "png";
      if (!isValid) {
        setError("Only JPG and PNG images are allowed");
        return;
      }

      dispatch(setHtmlContent(image.webPath));

      if (isNative) {
        setFile({ path: image.path, format: mimeType });
      } else {
        const response = await fetch(image.webPath);
        const blob = await response.blob();
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

  const handleInput = (e) => {
    const value = e.detail?.value ?? e.target.value;
    setUrl(value);
    handleChange("data", value);
    dispatch(setHtmlContent(value));
  };

  useEffect(() => {
    if (type === PageType.link || type === PageType.picture) {
      handleChange("data", htmlContent);
    }
  }, [htmlContent]);

  const uploadPictureFile = async () => {
    if (!file) { setError("No File"); return null; }
    try {
      const { url } = await dispatch(uploadPicture({ file })).unwrap();
      handleChange("data", url);
      dispatch(setHtmlContent(url));
      return url;
    } catch (err) {
      console.error("Upload failed", err);
      return null;
    }
  };
const handleCreate = async () => {
  setUploading(true);
  setIsSaved(false);
  try {
    if (type === PageType.picture) {
      let finalUrl = null;

      // only use parameters.data if it's already a real remote URL
      if (parameters.data?.startsWith("http")) {
        finalUrl = parameters.data;
      } else if (file) {
        finalUrl = await uploadPictureFile();
      }

      if (!finalUrl) { setError("No image uploaded"); return; }
      await createPageAction(finalUrl);
    } else {
      await createPageAction(url);
    }
    setIsUploaded(true);
  } finally {
    setUploading(false);
  }
};
  // const handleCreate = async () => {
  //   setUploading(true);
  //   setIsSaved(false);
  //   try {
  //     if (type === PageType.picture) {
  //       let finalUrl = parameters.data;
  //       if (!finalUrl && file) {
  //         finalUrl = await uploadPictureFile();
  //       }
  //       if (!finalUrl) { setError("No image uploaded"); return; }
  //       await createPageAction(finalUrl);
  //     } else {
  //       await createPageAction(url);
  //     }
  //     setHasContent(true);
  //     setIsUploaded(true);
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Only JPG and PNG images are allowed");
      return;
    }
    setFile(file);
    const reader = new FileReader();
    reader.onload = () => dispatch(setHtmlContent(reader.result));
    reader.readAsDataURL(file);
  };
console.log("updated",id)
  return (
    <div className="flex flex-col w-full max-w-xl mx-auto">

      {(!isUploaded) && (type === PageType.link || type === PageType.picture) && (
        <>
          <IonLabel className="text-emerald-700 mb-1">
            {type === PageType.link ? "URL" : "Image URL / Upload"}
          </IonLabel>
          <IonInput
            value={htmlContent}
            onIonChange={handleInput}
            placeholder={type === PageType.link ? "https://example.com" : "Paste image URL"}
            className="border border-emerald-300 dark:text-cream text-soft rounded-md px-2 mb-2"
            disabled={uploading}
          />
        </>
      )}

      {(!isUploaded) && type === PageType.picture ? (
        isNative ? (
          <button onClick={pickImage} className="btn bg-emerald-600 text-white mt-2">
            Choose Image
          </button>
        ) : (
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="mb-2 file-input"
          />
        )
      ) : null}

      {type === PageType.link && parameters.data && !isValidUrl(parameters.data) && (
        <IonText className="text-red-500 text-sm mt-1">Invalid URL</IonText>
      )}

      <div className="w-full mt-4">
        {!isUploaded && !hasContent && (
          <div className="w-full h-[3.5em] rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center text-sm">
            Add {type === PageType.link ? "a valid URL" : "an image"} to continue
          </div>
        )}

{!id && (type === PageType.link || type === PageType.picture) && (
  (type === PageType.link && hasContent) ||
  (type === PageType.picture && !hasContent)
) && (
  <button
    onClick={handleCreate}
    disabled={uploading}
    className="w-full h-[3.5em] mt-4 rounded-xl bg-emerald-600 text-white font-semibold active:scale-[0.98] disabled:opacity-50 transition"
  >
    {uploading ? "Uploading..." : "Create"}
  </button>
)}
      </div>

      <div className="mt-4">
        <RenderPreview type={type} src={htmlContent || parameters.data} />
      </div>
    </div>
  );
}

const RenderPreview = memo(({ src, type }) => {
  if (!src) return null;

  if (type === PageType.link) {
    return <LinkPreview url={src} />;
  }

  if (type === PageType.picture) {
    return (
      <div className="mt-4 flex justify-center">
        <IonImg src={src} className="rounded-xl max-h-[300px]" />
      </div>
    );
  }

  return null;
});