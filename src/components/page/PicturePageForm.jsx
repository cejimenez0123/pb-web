

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
import styles from "../../styles/style.js";
import { useAlert } from "../../core/useAlert.jsx";
import AlertType from "../../core/AlertType.js";

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
  const {showAlert}=useAlert()


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
      showAlert({message:"Only JPG and PNG images are allowed.",type:AlertType.error});
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
              showAlert({message:"Unable to read the selected image",type:AlertType.error});
    
        return;
      }

      const response = await fetch(image.webPath);
      const blob = await response.blob();

      if (!ACCEPTED_IMAGE_TYPES.includes(blob.type)) {
         showAlert({message:"Only JPG and PNG images are allowed.",type:AlertType.error});
 
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
        showAlert({message:"Unable to select this image.",type:AlertType.error});

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
 showAlert({message:     error?.message || "Unable to upload this image.",type:AlertType.error});
  
    

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
         showAlert({message:      isPicture
            ? "Please upload an image or enter a valid image URL."
            : "Please enter a valid URL.",type:AlertType.error});
     
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
      showAlert({message:error?.message || "Unable to save this page.",type:AlertType.error});
 
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
        <div
          type="button"
          onClick={handleSave}
          disabled={uploading || !hasContent}
          className={[styles.button.base,styles.button.primary].join(" ")}
          // className="mt-2 h-12 w-full rounded-xl bg-plumb-mint font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading
            ? file
              ? "Uploading image..."
              : "Creating page..."
            : "Create page"}
        </div>
      )}

{isExistingPage && (
  <div
    type="button"
    onClick={handleSave}
    disabled={
      uploading ||
      (!file && draftValue.trim() === (parameters?.data || "").trim())
    }
    className={[styles.button.base,styles.button.primary].join(" ")}
    >
    {uploading
      ? "Saving..."
      : file
        ? "Upload and save image"
        : isPicture
          ? "Save image URL"
          : "Save link"}
  </div>
)}
      
    </div>
  );
}
