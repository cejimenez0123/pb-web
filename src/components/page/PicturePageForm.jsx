
import { useEffect, useRef, useState } from "react";
import { IonInput, IonLabel, IonText } from "@ionic/react";
import { Capacitor } from "@capacitor/core";
import { Camera, MediaTypeSelection } from "@capacitor/camera";
import { useDispatch } from "react-redux";

import { PageType } from "../../core/constants";
import isValidUrl from "../../core/isValidUrl";
import LinkPreview from "../LinkPreview";

import styles from "../../styles/style.js";
import { useAlert } from "../../core/useAlert.jsx";
import AlertType from "../../core/AlertType.js";
import {
  uploadPhoto,
  getPhoto,
  associatePhotoWithStory,
} from "../../actions/PhotoActions.jsx";
import Enviroment from "../../core/Enviroment.js";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/svg+xml",
];

export default function PicturePageForm({
  handleChange,
  type,
  setIsSaved,
  parameters,
  createPageAction,
}) {
  const dispatch = useDispatch();
  const { showAlert } = useAlert();

  const isNative = Capacitor.isNativePlatform();
  const isPicture = type === PageType.picture;
  const isLink = type === PageType.link;

  const [draftValue, setDraftValue] = useState(
    parameters?.data || ""
  );

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [storedImagePreview, setStoredImagePreview] = useState(null);
  const [pendingUpload, setPendingUpload] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Keep requests and the alert callback stable across renders.
  const photoRequestsRef = useRef(new Map());
  const showAlertRef = useRef(showAlert);

  showAlertRef.current = showAlert;

  const value = draftValue;

  const isExistingPage = Boolean(
    parameters?.id && parameters.id !== "new"
  );

  const getStoredPhotoId = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== "string") {
      return null;
    }

    try {
      const url = new URL(
        imageUrl,
        window.location.origin
      );

      const match = url.pathname.match(
        /\/photos\/([^/]+)\/?$/
      );

      return match?.[1]
        ? decodeURIComponent(match[1])
        : null;
    } catch {
      return null;
    }
  };

  const storedPhotoId = isPicture
    ? getStoredPhotoId(value)
    : null;

  // Preserve the existing Link Page URL behavior.
  const resolvedUrl = Enviroment.url + value;
  const validUrl = isLink
    ? isValidUrl(resolvedUrl)
    : false;

  // Picture Pages require an uploaded file.
  // An existing Photo is displayed but does not need saving again.
  const hasContent = isPicture
    ? Boolean(file) || (
        isExistingPage && Boolean(storedPhotoId)
      )
    : isLink && validUrl;

  // Sync when the parent loads or changes the page.
  useEffect(() => {
    setDraftValue(parameters?.data || "");
  }, [parameters?.data]);

  // Revoke local file preview URLs when they are replaced or removed.
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  // Load existing Photos through the authenticated endpoint.
  // Skip the request while a local file preview is available.
  useEffect(() => {
    let cancelled = false;
    let objectUrl = null;

    setStoredImagePreview(null);

    if (!storedPhotoId || filePreview) {
      return undefined;
    }

    const loadPhoto = async () => {
      try {
        let request = photoRequestsRef.current.get(
          storedPhotoId
        );

        if (!request) {
          request = dispatch(
            getPhoto({ id: storedPhotoId })
          ).unwrap();

          photoRequestsRef.current.set(
            storedPhotoId,
            request
          );
        }

        const result = await request;

        if (cancelled) return;

        if (!result?.blob) {
          throw new Error(
            "The Photo response did not contain an image."
          );
        }

        objectUrl = URL.createObjectURL(result.blob);
        setStoredImagePreview(objectUrl);
      } catch (error) {
        photoRequestsRef.current.delete(storedPhotoId);

        if (!cancelled) {
          console.error(
            "Unable to load stored Photo:",
            error
          );

          showAlertRef.current({
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
  }, [dispatch, storedPhotoId, filePreview]);

  const updateValue = (nextValue) => {
    setDraftValue(nextValue);
    handleChange("data", nextValue);
    setIsSaved?.(false);
  };

  // Link Page input.
  const handleInput = (event) => {
    const nextValue =
      event.detail?.value ??
      event.target?.value ??
      "";

    setDraftValue(String(nextValue));
  };

  const prepareFile = (selectedFile) => {
    if (!selectedFile) return;

    if (
      !ACCEPTED_IMAGE_TYPES.includes(selectedFile.type)
    ) {
      showAlert({
        message: "Only JPG, PNG and SVG images are allowed.",
        type: AlertType.error,
      });

      return;
    }

    setFile(selectedFile);
    setPendingUpload(null);
    setFilePreview(
      URL.createObjectURL(selectedFile)
    );
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    prepareFile(selectedFile);

    // Allow the same file to be selected again.
    event.target.value = "";
  };

  const pickImage = async () => {
    try {
      const { results = [] } =
        await Camera.chooseFromGallery({
          mediaType: MediaTypeSelection.Photo,
          allowMultipleSelection: false,
          limit: 1,
          includeMetadata: true,
        });

      const image = results.find(
        (item) =>
          item.type === MediaTypeSelection.Photo
      );

      if (!image?.webPath) {
        throw new Error(
          "The selected image could not be accessed."
        );
      }

      const format =
        image.metadata?.format?.toLowerCase();

      if (
        format &&
        !["jpeg", "jpg", "png"].includes(format)
      ) {
        throw new Error(
          "Only JPG and PNG images are allowed."
        );
      }

      const response = await fetch(image.webPath);

      if (!response.ok) {
        throw new Error(
          "Unable to read the selected image."
        );
      }

      const blob = await response.blob();

      const mimeType =
        blob.type ||
        (format === "png"
          ? "image/png"
          : "image/jpeg");

      if (!ACCEPTED_IMAGE_TYPES.includes(mimeType)) {
        throw new Error(
          "Only JPG and PNG images are allowed."
        );
      }

      const extension =
        mimeType === "image/png" ? "png" : "jpg";

      const selectedFile = new File(
        [blob],
        `image-${Date.now()}.${extension}`,
        { type: mimeType }
      );

      prepareFile(selectedFile);
    } catch (error) {
      console.error("Image pick error:", error);

      showAlert({
        message:
          error?.message ||
          "Unable to select this image.",
        type: AlertType.error,
      });
    }
  };

  // Upload once and retain the result for association retries.
  const uploadSelectedImage = async () => {
    if (!file) return pendingUpload;

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
          error?.message ||
          "Unable to upload this image.",
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

      // -----------------------------------------------
      // PICTURE PAGE
      // -----------------------------------------------
      if (isPicture) {
        if (file || pendingUpload) {
          uploadedPhoto = await uploadSelectedImage();

          if (!uploadedPhoto) return;

          finalValue = uploadedPhoto.url;
        } else {
          showAlert({
            message: "Please choose an image to upload.",
            type: AlertType.error,
          });

          return;
        }
      }

      // -----------------------------------------------
      // LINK PAGE
      // -----------------------------------------------
      if (isLink) {
        if (!finalValue || !isValidUrl(Enviroment.url + finalValue)) {
          showAlert({
            message: "Please enter a valid URL.",
            type: AlertType.error,
          });

          return;
        }
      }

      // -----------------------------------------------
      // NEW STORY
      // -----------------------------------------------
      if (!isExistingPage) {
        // Update the editor state before creating the Story.
        updateValue(finalValue);

        const result = await createPageAction(finalValue);

        if (!result) {
          // Keep the file and pending upload for retry.
          return;
        }

        if (uploadedPhoto) {
          const storyId =
            result?.id ?? result?.story?.id;

          if (!storyId) {
            throw new Error(
              "The Story was created, but its ID could not be identified."
            );
          }

          await dispatch(
            associatePhotoWithStory({
              photoId: uploadedPhoto.photoId,
              storyId,
            })
          ).unwrap();
        }

        setDraftValue(finalValue);
        setFile(null);
        setFilePreview(null);
        setPendingUpload(null);
        setIsSaved?.(true);

        return;
      }

      // -----------------------------------------------
      // EXISTING STORY
      // -----------------------------------------------
      if (isPicture && uploadedPhoto) {
        const storyId = parameters?.id;

        if (!storyId || storyId === "new") {
          throw new Error(
            "The existing Story ID could not be identified."
          );
        }

        // The backend associates the Photo and updates Story.data.
        await dispatch(
          associatePhotoWithStory({
            photoId: uploadedPhoto.photoId,
            storyId,
          })
        ).unwrap();

        // Synchronize the editor's local state.
        // The parent may also persist the same URL through autosave.
        updateValue(finalValue);

        setFile(null);
        setFilePreview(null);
        setPendingUpload(null);

        return;
      }

      // Existing Link Page.
      if (isLink) {
        updateValue(finalValue);
      }
    } catch (error) {
      console.error(
        "Unable to save media page:",
        error
      );

      showAlert({
        message:
          error?.message ||
          "Unable to save this page.",
        type: AlertType.error,
      });
    } finally {
      setUploading(false);
    }
  };

  const previewSource =
    filePreview || storedImagePreview;

  const canSaveExisting = isPicture
    ? Boolean(file || pendingUpload)
    : isLink &&
      validUrl &&
      value.trim() !== (parameters?.data || "").trim();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">

      {/* Link Page input */}
      {isLink && (
        <div>
          <IonLabel className="mb-2 block text-sm font-semibold text-plumb-ink dark:text-plumb-darkText">
            Link URL
          </IonLabel>

          <IonInput
            value={value}
            onIonChange={handleInput}
            placeholder="https://example.com"
            type="url"
            disabled={uploading}
            className="rounded-xl border border-plumb-mint/40 px-3 dark:text-plumb-darkText"
          />

          <p className="mt-1 text-xs text-plumb-muted">
            Paste a webpage address to create a link page.
          </p>
        </div>
      )}

      {/* Picture Page upload */}
      {isPicture && (
        <div className="flex flex-col gap-3">
          <IonLabel className="block text-sm font-semibold text-plumb-ink dark:text-plumb-darkText">
            {storedPhotoId
              ? "Your image"
              : "Choose an image"}
          </IonLabel>

          <p className="text-xs text-plumb-muted">
            Upload a JPG, PNG or SVG image from your device.
          </p>

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
            <label
              className={[
                "flex cursor-pointer items-center justify-center rounded-xl border border-plumb-mint/40 px-4 py-3 font-medium transition hover:bg-plumb-mint/10",
                uploading ? "pointer-events-none opacity-50" : "",
              ].join(" ")}
            >
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

      {/* Link validation */}
      {isLink && value.trim() && !validUrl && (
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
            <LinkPreview url={resolvedUrl} />
          )}

          {file && (
            <p className="text-xs text-plumb-muted">
              {file.name} · Ready to upload
            </p>
          )}
        </div>
      )}

      {/* Create new page */}
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
            ? isPicture
              ? "Uploading image..."
              : "Creating page..."
            : "Create page"}
        </button>
      )}

      {/* Save existing page */}
      {isExistingPage && (
        <button
          type="button"
          onClick={handleSave}
          disabled={uploading || !canSaveExisting}
          className={[
            styles.button.base,
            styles.button.primary,
            uploading || !canSaveExisting
              ? "cursor-not-allowed opacity-50"
              : "",
          ].join(" ")}
        >
          {uploading
            ? "Saving..."
            : isPicture
              ? "Upload and save image"
              : "Save link"}
        </button>
      )}
    </div>
  );
}



