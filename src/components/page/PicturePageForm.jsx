
// import {
//   IonLabel,
//   IonInput,
//   IonText,
//   IonImg,
//   useIonRouter,
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

// export default function PicturePageForm({ handleChange, type, isSaved, setIsSaved, parameters, createPageAction }) {
//   const page = useSelector((state) => state.pages.editingPage);
//   const { type: typeOrNull } = useParams();
//   let path = location.pathname.split("/")
//   const id = path[path.length-1] !== "edit"

//   const pageType = typeOrNull || type;
//   const { setError } = useContext(Context);
//   const dispatch = useDispatch();
//   const [file, setFile] = useState(null);
//   const [url, setUrl] = useState(null);
//   const htmlContent = useSelector(state => state.pages.editorHtmlContent);
//   const [uploading, setUploading] = useState(false);
//   const [isUploaded, setIsUploaded] = useState(false);
//   const isNative = Capacitor.isNativePlatform();
// const hasContent = !(pageType==PageType.picture && !!(htmlContent?.trim())) || (pageType==PageType.link && !!htmlContent.trim())
//   const pickImage = async () => {
//     try {
//       const image = await Camera.getPhoto({
//         quality: 80,
//         resultType: CameraResultType.Uri,
//         source: CameraSource.Photos,
//       });

//       let mimeType = image.format;
//       if (mimeType) mimeType = mimeType.toLowerCase();

//       const isValid = mimeType === "jpeg" || mimeType === "jpg" || mimeType === "png";
//       if (!isValid) {
//         setError("Only JPG and PNG images are allowed");
//         return;
//       }

//       dispatch(setHtmlContent(image.webPath));

//       if (isNative) {
//         setFile({ path: image.path, format: mimeType });
//       } else {
//         const response = await fetch(image.webPath);
//         const blob = await response.blob();
//         if (!["image/jpeg", "image/png"].includes(blob.type)) {
//           setError("Only JPG and PNG images are allowed");
//           return;
//         }
//         const file = new File([blob], "image.jpg", { type: blob.type });
//         setFile(file);
//       }
//     } catch (err) {
//       console.error("Image pick error:", err);
//     }
//   };

//   const handleInput = (e) => {
//     const value = e.detail?.value ?? e.target.value;
//     setUrl(value);
//     handleChange("data", value);
//     dispatch(setHtmlContent(value));
//   };

//   useEffect(() => {
//     if (type === PageType.link || type === PageType.picture) {
//       handleChange("data", htmlContent);
//     }
//   }, [htmlContent]);

//   const uploadPictureFile = async () => {
//     if (!file) { setError("No File"); return null; }
//     try {
//       const { url } = await dispatch(uploadPicture({ file })).unwrap();
//       handleChange("data", url);
//       dispatch(setHtmlContent(url));
//       return url;
//     } catch (err) {
//       console.error("Upload failed", err);
//       return null;
//     }
//   };
// const handleCreate = async () => {
//   setUploading(true);
//   setIsSaved(false);
//   try {
//     if (type === PageType.picture) {
//       let finalUrl = null;

//       // only use parameters.data if it's already a real remote URL
//       if (parameters.data?.startsWith("http")) {
//         finalUrl = parameters.data;
//       } else if (file) {
//         finalUrl = await uploadPictureFile();
//       }

//       if (!finalUrl) { setError("No image uploaded"); return; }
//       await createPageAction(finalUrl);
//     } else {
//       await createPageAction(url);
//     }
//     setIsUploaded(true);
//   } finally {
//     setUploading(false);
//   }
// };
//   // const handleCreate = async () => {
//   //   setUploading(true);
//   //   setIsSaved(false);
//   //   try {
//   //     if (type === PageType.picture) {
//   //       let finalUrl = parameters.data;
//   //       if (!finalUrl && file) {
//   //         finalUrl = await uploadPictureFile();
//   //       }
//   //       if (!finalUrl) { setError("No image uploaded"); return; }
//   //       await createPageAction(finalUrl);
//   //     } else {
//   //       await createPageAction(url);
//   //     }
//   //     setHasContent(true);
//   //     setIsUploaded(true);
//   //   } finally {
//   //     setUploading(false);
//   //   }
//   // };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (!["image/jpeg", "image/png"].includes(file.type)) {
//       setError("Only JPG and PNG images are allowed");
//       return;
//     }
//     setFile(file);
//     const reader = new FileReader();
//     reader.onload = () => dispatch(setHtmlContent(reader.result));
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="flex flex-col w-full max-w-xl mx-auto">

//       {(!isUploaded) && (type === PageType.link || type === PageType.picture) && (
//         <>
//           <IonLabel className="text-emerald-700 mb-1">
//             {type === PageType.link ? "URL" : "Image URL / Upload"}
//           </IonLabel>
//           <IonInput
//             value={htmlContent}
//             onIonChange={handleInput}
//             placeholder={type === PageType.link ? "https://example.com" : "Paste image URL"}
//             className="border border-emerald-300 dark:text-cream text-soft rounded-md px-2 mb-2"
//             disabled={uploading}
//           />
//         </>
//       )}

//       {(!isUploaded) && type === PageType.picture ? (
//         isNative ? (
//           <button onClick={pickImage} className="btn bg-emerald-600 text-white mt-2">
//             Choose Image
//           </button>
//         ) : (
//           <input
//             type="file"
//             accept="image/png, image/jpeg"
//             onChange={handleFileChange}
//             className="mb-2 file-input"
//           />
//         )
//       ) : null}

//       {type === PageType.link && parameters.data && !isValidUrl(parameters.data) && (
//         <IonText className="text-red-500 text-sm mt-1">Invalid URL</IonText>
//       )}

//       <div className="w-full mt-4">
//         {!isUploaded && !hasContent && (
//           <div className="w-full h-[3.5em] rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center text-sm">
//             Add {type === PageType.link ? "a valid URL" : "an image"} to continue
//           </div>
//         )}

// {!id && (type === PageType.link || type === PageType.picture) && (
//   (type === PageType.link && hasContent) ||
//   (type === PageType.picture && !hasContent)
// ) && (
//   <button
//     onClick={handleCreate}
//     disabled={uploading}
//     className="w-full h-[3.5em] mt-4 rounded-xl bg-emerald-600 text-white font-semibold active:scale-[0.98] disabled:opacity-50 transition"
//   >
//     {uploading ? "Uploading..." : "Create"}
//   </button>
// )}
//       </div>

//       <div className="mt-4">
//         <RenderPreview type={type} src={htmlContent || parameters.data} />
//       </div>
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


import React, { useContext, useEffect, useState } from "react";
import { IonInput, IonLabel, IonText, IonImg } from "@ionic/react";
import { useDispatch } from "react-redux";

import { PageType } from "../../core/constants";
import { uploadPicture } from "../../actions/ProfileActions.jsx";
import isValidUrl from "../../core/isValidUrl";
import LinkPreview from "../LinkPreview";
import Context from "../../context";

import {
  Camera,
  CameraResultType,
  CameraSource,
} from "@capacitor/camera";

import { Capacitor } from "@capacitor/core";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
];

export default function PicturePageForm({
  handleChange,
  type,
  isSaved,
  setIsSaved,
  parameters,
  createPageAction,
}) {
  const dispatch = useDispatch();
  const { setError } = useContext(Context);

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const isNative = Capacitor.isNativePlatform();

  const isPicture = type === PageType.picture;
  const isLink = type === PageType.link;
const [draftValue, setDraftValue] = useState(
  parameters?.data || ""
);

useEffect(() => {
  setDraftValue(parameters?.data || "");
}, [parameters?.data]);
const value = draftValue;
  const isExistingPage = Boolean(
    parameters?.id && parameters.id !== "new"
  );

  const validUrl = isValidUrl(value);

  const hasContent = isPicture
    ? Boolean(value.trim() && validUrl) || Boolean(file)
    : isLink && Boolean(value.trim() && validUrl);

  // Release temporary browser preview URLs.
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const updateValue = (nextValue) => {
    handleChange("data", nextValue);

    if (setIsSaved) {
      setIsSaved(false);
    }
  };

const handleInput = (event) => {
  const nextValue =
    event.detail?.value ?? event.target.value ?? "";

  setFile(null);
  setFilePreview(null);
  setDraftValue(nextValue);
};

  const prepareFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type)) {
      setError("Only JPG and PNG images are allowed.");
      return;
    }

    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    prepareFile(selectedFile);

    // Allow selecting the same file again.
    event.target.value = "";
  };

  const pickImage = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 85,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      if (!image.webPath) {
        setError("Unable to read the selected image.");
        return;
      }

      const response = await fetch(image.webPath);
      const blob = await response.blob();

      if (!ACCEPTED_IMAGE_TYPES.includes(blob.type)) {
        setError("Only JPG and PNG images are allowed.");
        return;
      }

      const extension =
        blob.type === "image/png" ? "png" : "jpg";

      const selectedFile = new File(
        [blob],
        `image-${Date.now()}.${extension}`,
        { type: blob.type }
      );

      prepareFile(selectedFile);
    } catch (error) {
      if (error?.message?.toLowerCase().includes("cancel")) {
        return;
      }

      console.error("Image selection failed:", error);
      setError("Unable to select this image.");
    }
  };

  const uploadSelectedImage = async () => {
    if (!file) {
      return value;
    }

    try {
      const result = await dispatch(
        uploadPicture({ file })
      ).unwrap();

      const uploadedUrl = result?.url;

      if (!uploadedUrl || !isValidUrl(uploadedUrl)) {
        throw new Error("The image upload did not return a valid URL.");
      }

      // Only the remote URL enters the story's saved content.
      setFile(null);
      setFilePreview(null);
      setDraftValue(uploadedUrl);
updateValue(uploadedUrl);

      return uploadedUrl;
    } catch (error) {
      console.error("Image upload failed:", error);

      setError(
        error?.message || "Unable to upload this image."
      );

      return null;
    }
  };

  const handleSave = async () => {
    if (uploading) return;

    if (!isPicture && !isLink) return;

    setUploading(true);

    try {
      let finalValue = value.trim();

      if (isPicture && file) {
        finalValue = await uploadSelectedImage();

        if (!finalValue) return;
      }

      if (!finalValue || !isValidUrl(finalValue)) {
        setError(
          isPicture
            ? "Please upload an image or enter a valid image URL."
            : "Please enter a valid URL."
        );
        if (isExistingPage) {
  if (!file) {
    updateValue(finalValue);
  }

  return;
}

const result = await createPageAction(finalValue);

if (!result) return;

setIsSaved?.(true);

        return;
      }

      // New stories must be created explicitly.
      if (!isExistingPage) {
        const result = await createPageAction(finalValue);

        if (!result) return;

        setIsSaved?.(true);
      }

      // Existing stories use EditorContainer's normal autosave.
      // For uploaded files, updateValue() has already supplied
      // the remote URL to that autosave pipeline.
    } catch (error) {
      console.error("Unable to save media page:", error);
      setError(error?.message || "Unable to save this page.");
    } finally {
      setUploading(false);
    }
  };

  const previewSource = filePreview || value;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">

      {/* URL input */}
      <div>
        <IonLabel className="mb-2 block text-sm font-semibold text-plumb-ink dark:text-plumb-darkText">
          {isPicture ? "Image URL" : "Link URL"}
        </IonLabel>

        <IonInput
          value={value}
          onIonChange={handleInput}
          placeholder={
            isPicture
              ? "Paste a direct image URL..."
              : "https://example.com"
          }
          type="url"
          disabled={uploading}
          className="rounded-xl border border-plumb-mint/40 px-3 dark:text-plumb-darkText"
        />

        <p className="mt-1 text-xs text-plumb-muted">
          {isPicture
            ? "Paste an image address or choose an image from your device."
            : "Paste a webpage address to create a link page."}
        </p>
      </div>

      {/* Image upload */}
      {isPicture && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-base-content/10" />
            <span className="text-xs text-base-content/50">
              OR
            </span>
            <div className="h-px flex-1 bg-base-content/10" />
          </div>

          {isNative ? (
            <button
              type="button"
              onClick={pickImage}
              disabled={uploading}
              className="w-full rounded-xl border border-plumb-mint/40 px-4 py-3 font-medium transition hover:bg-plumb-mint/10 disabled:opacity-50"
            >
              Choose an image
            </button>
          ) : (
            <label className="flex cursor-pointer items-center justify-center rounded-xl border border-plumb-mint/40 px-4 py-3 font-medium transition hover:bg-plumb-mint/10">
              Choose an image

              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                disabled={uploading}
                className="sr-only"
              />
            </label>
          )}
        </div>
      )}

      {/* URL validation */}
      {value.trim() && !validUrl && (
        <IonText color="danger">
          <p className="text-sm">
            Please enter a valid URL.
          </p>
        </IonText>
      )}

      {/* Preview */}
      {previewSource && (
        <div className="mt-2 flex flex-col gap-3">
          <p className="text-sm font-semibold text-plumb-ink dark:text-plumb-darkText">
            Preview
          </p>

          {isPicture && (
            <div className="overflow-hidden rounded-2xl border border-base-content/10">
              <IonImg
                src={previewSource}
                alt="Image preview"
                className="max-h-[350px] w-full object-contain"
              />
            </div>
          )}

          {isLink && validUrl && (
            <LinkPreview url={value} />
          )}

          {/* Show the actual image address as a usable link. */}
          {isPicture && !file && validUrl && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-plumb-mint underline underline-offset-2"
            >
              {value}
            </a>
          )}

          {file && (
            <p className="text-xs text-plumb-muted">
              {file.name} · Ready to upload
            </p>
          )}
        </div>
      )}

      {/* Save/create */}
      {!isExistingPage && (
        <button
          type="button"
          onClick={handleSave}
          disabled={uploading || !hasContent}
          className="mt-2 h-12 w-full rounded-xl bg-plumb-mint font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading
            ? file
              ? "Uploading image..."
              : "Creating page..."
            : "Create page"}
        </button>
      )}

{isExistingPage && (
  <button
    type="button"
    onClick={handleSave}
    disabled={
      uploading ||
      (!file && draftValue.trim() === (parameters?.data || "").trim())
    }
    className="h-12 w-full rounded-xl bg-plumb-mint font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
  >
    {uploading
      ? "Saving..."
      : file
        ? "Upload and save image"
        : isPicture
          ? "Save image URL"
          : "Save link"}
  </button>
)}
      
    </div>
  );
}
