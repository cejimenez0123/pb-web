

// const ACCEPTED_IMAGE_TYPES = [
//   "image/jpeg",
//   "image/png",
// ];



// //  const pickImage = async () => {
// //     try {
// //    const { results } = await Camera.chooseFromGallery({
// //       mediaType: MediaTypeSelection.Photo, // photos, videos, or both
// //       allowMultipleSelection: true,
// //       limit: 1,
// //       includeMetadata: true,
// //     });
// //     console.log(results)
// //     const image = results[0]
// //     console.log(image)
// //       // const image = await Camera.getPhoto({
// //       //   quality: 80,
// //       //   resultType: CameraResultType.Uri,
// //       //   source: CameraSource.Photos,
// //       // });

// //       let mimeType = image.format;
// //       if (mimeType) mimeType = mimeType.toLowerCase();

// //       const isValid = mimeType === "jpeg" || mimeType === "jpg" || mimeType === "png";
// //       if (!isValid) {
// //         setError("Only JPG and PNG images are allowed");
// //         return;
// //       }

// //       dispatch(setHtmlContent(image.webPath));

// //       if (isNative) {
// //         setFile({ path: image.path, format: mimeType });
// //       } else {
// //         const response = await fetch(image.webPath);
// //         const blob = await response.blob();
// //         if (!["image/jpeg", "image/png"].includes(blob.type)) {
// //           setError("Only JPG and PNG images are allowed");
// //           return;
// //         }
// //         const file = new File([blob], "image.jpg", { type: blob.type });
// //         setFile(file);
// //       }
// //     } catch (err) {
// //       console.error("Image pick error:", err);
// //     }
// //   };

// //     try {
// //       let finalValue = value.trim();

// //       if (isPicture && file) {
// //         finalValue = await uploadSelectedImage();

// //         if (!finalValue) return;
// //       }

// //       if (!finalValue || !isValidUrl(finalValue)) {
// //          showAlert({message:      isPicture
// //             ? "Please upload an image or enter a valid image URL."
// //             : "Please enter a valid URL.",type:AlertType.error});
     
// //         if (isExistingPage) {
// //   if (!file) {
// //     updateValue(finalValue);
// //   }

// //   return;
// // }

//   const previewSource = filePreview || value;

//   return (
//     <div className="mx-auto flex w-full max-w-xl flex-col gap-4">

//       {/* URL input */}
//       <div>
//         <IonLabel className="mb-2 block text-sm font-semibold text-plumb-ink dark:text-plumb-darkText">
//           {isPicture ? "Image URL" : "Link URL"}
//         </IonLabel>

//         <IonInput
//           value={value}
//           onIonChange={handleInput}
//           placeholder={
//             isPicture
//               ? "Paste a direct image URL..."
//               : "https://example.com"
//           }
//           type="url"
//           disabled={uploading}
//           className="rounded-xl border border-plumb-mint/40 px-3 dark:text-plumb-darkText"
//         />





import { useEffect, useState } from "react";
import { IonInput, IonLabel, IonText,} from "@ionic/react";
import { Capacitor } from "@capacitor/core";
import { Camera, MediaTypeSelection } from "@capacitor/camera";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { PageType } from "../../core/constants";
import isValidUrl from "../../core/isValidUrl";
import LinkPreview from "../LinkPreview";


import styles from "../../styles/style.js";
import { useAlert } from "../../core/useAlert.jsx";
import AlertType from "../../core/AlertType.js";
import { uploadPhoto,getPhoto, associatePhotoWithStory } from "../../domain/usecases/useUploadPicture.jsx";
import grabId from "../../core/grabId.jsx";
// import { useDispatch } from "react-redux";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
];




// const getStoredPhotoId = (imageUrl) => {
//   if (!imageUrl || typeof imageUrl !== "string") return null;

//   try {
//     const photoBase = new URL(PhotoRepo.url);
//     const candidate = new URL(imageUrl, photoBase.origin);

//     // Only recognize URLs belonging to our own photo API.
//     if (candidate.origin !== photoBase.origin) return null;

//     const basePath = photoBase.pathname.replace(/\/+$/, "");

//     if (!candidate.pathname.startsWith(`${basePath}/`)) {
//       return null;
//     }

//     const id = candidate.pathname
//       .slice(basePath.length + 1)
//       .split("/")[0];

//     return id ? decodeURIComponent(id) : null;
//   } catch {
//     return null;
//   }
// };

export default function PicturePageForm({
  handleChange,
  type,
  setIsSaved,
  parameters,
  createPageAction,
}) {
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  const { currentProfile } = useSelector((state) => state.users);
const storyId = grabId(location.pathname)
const [file, setFile] = useState(null);
const [filePreview, setFilePreview] = useState(null);
const [storedImagePreview, setStoredImagePreview] = useState(null);
const [uploading, setUploading] = useState(false);

// Retain a successfully uploaded Photo if Story creation or
// association fails. This prevents unnecessary duplicate uploads.
const [pendingUpload, setPendingUpload] = useState(null);


  const isNative = Capacitor.isNativePlatform();

  const isPicture = type === PageType.picture;
  const isLink = type === PageType.link;

  const [draftValue, setDraftValue] = useState(
    parameters?.data || ""
  );


const getStoredPhotoId = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") return null;

  try {
    const url = new URL(imageUrl, window.location.origin);
    const match = url.pathname.match(/\/photos\/([^/]+)\/?$/);

    return match?.[1] ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
};
  useEffect(() => {
    setDraftValue(parameters?.data || "");
  }, [parameters?.data]);



    //
const value = draftValue;

const isExistingPage = Boolean(
  parameters?.id && parameters.id !== "new"
);

const storedPhotoId = isPicture
  ? getStoredPhotoId(value)
  : null;

const validUrl = isValidUrl(value);

// A Plumbum Photo URL is valid even though it is relative
// and may not pass the existing absolute-URL validator.
const validImageValue = Boolean(storedPhotoId) || validUrl;

const hasContent = isPicture
  ? validImageValue || Boolean(file)
  : isLink && validUrl;
///
useEffect(() => {
  let cancelled = false;
  let objectUrl = null;

  setStoredImagePreview(null);

  if (!storedPhotoId) {
    return undefined;
  }

  const loadPhoto = async () => {
    try {
      const result = await dispatch(
        getPhoto({ id: storedPhotoId })
      ).unwrap();

      if (cancelled) return;

      objectUrl = URL.createObjectURL(result.blob);
      setStoredImagePreview(objectUrl);
    } catch (error) {
      if (!cancelled) {
        console.error(
          "Unable to load stored photo:",
          error
        );

        showAlert({
          message:
            error?.message ||
            "Unable to load this image. You may not have access to it.",
          type: AlertType.error,
        });
      }
    }
  };

  loadPhoto();

  return () => {
    cancelled = true;

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  };
}, [dispatch, storedPhotoId]);

 useEffect(() => {
  return () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
  };
}, [filePreview]);
///XXX


const updateValue = (nextValue) => {
  setDraftValue(nextValue);
  handleChange("data", nextValue);

  setIsSaved?.(false);
};

const handleInput = (event) => {
  const nextValue = event.target.value ?? "";

  setFile(null);
  setPendingUpload(null);
  setFilePreview(null);
  setDraftValue(nextValue);
};

const prepareFile = (selectedFile) => {
  if (!selectedFile) return;

  if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type)) {
    showAlert({
      message: "Only JPG, PNG and SVG images are allowed.",
      type: AlertType.error,
    });
    return;
  }

  setFile(selectedFile);
  setPendingUpload(null);
  setFilePreview(URL.createObjectURL(selectedFile));
};


/////XXXXX



  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    prepareFile(selectedFile);

    // Allow selecting the same file again.
    event.target.value = "";
  };

  const pickImage = async () => {
    try {
      const { results = [] } = await Camera.chooseFromGallery({
        mediaType: MediaTypeSelection.Photo,
        allowMultipleSelection: false,
        limit: 1,
        includeMetadata: true,
      });

      const image = results.find(
        (item) => item.type === MediaTypeSelection.Photo
      );

      if (!image?.webPath) {
        throw new Error("The selected image could not be accessed.");
      }

      const format = image.metadata?.format?.toLowerCase();

      if (format && !["jpeg", "jpg", "png"].includes(format)) {
        throw new Error("Only JPG and PNG images are allowed.");
      }

      const response = await fetch(image.webPath);

      if (!response.ok) {
        throw new Error("Unable to read the selected image.");
      }

      const blob = await response.blob();

      const mimeType =
        blob.type ||
        (format === "png" ? "image/png" : "image/jpeg");

      if (!ACCEPTED_IMAGE_TYPES.includes(mimeType)) {
        throw new Error("Only JPG and PNG images are allowed.");
      }

      const extension =
        mimeType === "image/png" ? "png" : "jpg";

      const selectedFile = new File(
        [blob],
        `image-${Date.now()}.${extension}`,
        { type: mimeType }
      );

      prepareFile(selectedFile);
    } catch (err) {
      console.error("Image pick error:", err);

      showAlert({
        message: err?.message || "Unable to select this image.",
        type: AlertType.error,
      });
    }
  };
const uploadSelectedImage = async () => {
  if (!file) return null;

  // Reuse the upload if the same file has already been uploaded.
  if (pendingUpload?.file === file) {
    return pendingUpload;
  }

  try {
  const result = await dispatch(
  uploadPhoto({
    file,
    purpose: "story",
  })
).unwrap();

   console.log("[PicturePageForm] Upload result:", result);

const photo = result?.photo ?? result;

const uploadedUrl = photo?.url;
const photoId = photo?.photoId || photo?.id;

    if (!uploadedUrl || !photoId) {
      throw new Error(
        "The image upload did not return a valid Photo URL and ID."
      );
    }

    const uploaded = {
      file,
      url: uploadedUrl,
      photoId,
    };

    setPendingUpload(uploaded);

    return uploaded;
  } catch (error) {
    console.error("Image upload failed:", error);

    showAlert({
      message:
        error?.message || "Unable to upload this image.",
      type: AlertType.error,
    });

    return null;
  }
};


const handleSave = async () => {
  if (uploading) return;
  if (!isPicture && !isLink) return;

  setUploading(true);

  try {
    let finalValue = value.trim();
    let uploadedPhoto = null;

    // Upload a newly selected image.
    if (isPicture && file) {
      uploadedPhoto = await uploadSelectedImage();

      if (!uploadedPhoto) return;

      finalValue = uploadedPhoto.url;
    }

    const isValidContent = isPicture
      ? Boolean(getStoredPhotoId(finalValue)) ||
        isValidUrl(finalValue)
      : isValidUrl(finalValue);

    if (!finalValue || !isValidContent) {
      showAlert({
        message: isPicture
          ? "Please upload an image or enter a valid image URL."
          : "Please enter a valid URL.",
        type: AlertType.error,
      });

      return;
    }

    // --------------------------------------------------
    // NEW STORY
    // --------------------------------------------------
    if (!isExistingPage) {
      // Keep the editor's state synchronized before creation.
      // The parent save pipeline ignores updates without a Story ID.
      updateValue(finalValue);

      const result = await createPageAction(finalValue);

      if (!result) {
        // Keep the file and pending upload so the user can retry.
        return;
      }

      setDraftValue(finalValue);
      setFile(null);
      setFilePreview(null);
      setPendingUpload(null);

      setIsSaved?.(true);

      return;
    }

    // --------------------------------------------------
    // EXISTING STORY
    // --------------------------------------------------
    if (uploadedPhoto) {
      const storyId = parameters?.id;

      if (!storyId || storyId === "new") {
        throw new Error(
          "The existing Story ID could not be identified."
        );
      }

      // The backend authorizes the user, associates the Photo,
      // and updates Story.data in one request.
      await dispatch(
        associatePhotoWithStory({
          photoId: uploadedPhoto.photoId,
          storyId,
        })
      ).unwrap();

      // Synchronize the editor's local and parent state.
      // The regular autosave may issue a duplicate data update,
      // but it will contain the same URL.
      updateValue(finalValue);

      setFile(null);
      setFilePreview(null);
      setPendingUpload(null);

      return;
    }

    // Existing Story with a manually entered URL.
    // Preserve the existing autosave behavior.
    updateValue(finalValue);
  } catch (error) {
    console.error("Unable to save media page:", error);

    showAlert({
      message:
        error?.message || "Unable to save this page.",
      type: AlertType.error,
    });
  } finally {
    setUploading(false);
  }
};

  // Local file previews take priority.
  // MongoDB photos must be fetched with authentication.
  // External image URLs can still be used directly.
 const previewSource =
  filePreview ||
  (storedPhotoId
    ? storedImagePreview
    : value);
// const previewSource =  value ||;
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
                accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
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
      {(previewSource || (isPicture && storedPhotoId)) && (
        <div className="mt-2 flex flex-col gap-3">
          <p className="text-sm font-semibold text-plumb-ink dark:text-plumb-darkText">
            Preview
          </p>

{isPicture && previewSource && (
  <div className="overflow-hidden rounded-2xl border border-base-content/10">
    <img
      src={previewSource}
      alt="Image preview"
      className="max-h-[350px] w-full object-contain"
    />
  </div>
)}
        {isPicture &&
  storedPhotoId &&
  !storedImagePreview &&
  !filePreview && (
    <p className="text-xs text-plumb-muted">
      Loading image...
    </p>
  )}

          {isLink && validUrl && (
            <LinkPreview url={value} />
          )}

          {/* External image URLs remain directly accessible.
              MongoDB URLs require authenticated loading. */}
          {isPicture && !file && validUrl && !storedPhotoId && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-plumb-mint underline underline-offset-2"
            >
              {value}
            </a>
          )}

          {isPicture && storedPhotoId && (
            <p className="break-all text-sm text-plumb-mint">
              {value}
            </p>
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
  className={[
    styles.button.base,
    styles.button.primary,
    uploading || !hasContent
      ? "cursor-not-allowed opacity-50"
      : "",
  ].join(" ")}
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
    (!file &&
      draftValue.trim() ===
        (parameters?.data || "").trim())
  }
  className={[
    styles.button.base,
    styles.button.primary,
    uploading ||
    (!file &&
      draftValue.trim() ===
        (parameters?.data || "").trim())
      ? "cursor-not-allowed opacity-50"
      : "",
  ].join(" ")}
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
