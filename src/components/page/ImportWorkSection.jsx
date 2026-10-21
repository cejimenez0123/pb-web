
import React, { useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import styles from "../../styles/style";
import GoogleDrivePicker from "../GoogleDrivePicker";

const ACCEPTED_FILE_TYPES = ".pdf,.txt,.doc,.docx";

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ACCEPTED_EXTENSIONS = [".pdf", ".txt", ".doc", ".docx"];

function isSupportedFile(file) {
  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;

  return (
    ACCEPTED_MIME_TYPES.includes(file.type) ||
    ACCEPTED_EXTENSIONS.includes(extension)
  );
}

async function nativeFileToFile(pickedFile) {
  let blob;

  if (pickedFile.path) {
    const response = await fetch(
      Capacitor.convertFileSrc(pickedFile.path)
    );

    if (!response.ok) {
      throw new Error("Unable to read selected file.");
    }

    blob = await response.blob();
  } else if (pickedFile.blob) {
    blob = pickedFile.blob;
  } else {
    throw new Error("The selected file could not be read.");
  }

  return new File([blob], pickedFile.name, {
    type: pickedFile.mimeType || blob.type || "application/octet-stream",
  });
}

function isPickerCancellation(error) {
  const message = error?.message?.toLowerCase() || "";

  return (
    message.includes("cancel") ||
    message.includes("dismiss") ||
    message.includes("canceled")
  );
}

export default function ImportWorkSection({
  onFileSelected,
  onGoogleFilePicked,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [isPicking, setIsPicking] = useState(false);

  const handleFiles = (fileList) => {
    const file = fileList?.[0];
    if (!file) return;

    if (!isSupportedFile(file)) {
      setError("Choose a PDF, TXT, DOC, or DOCX file.");
      return;
    }

    setError("");
    onFileSelected(file);
  };

  const handleChooseFile = async () => {
    setError("");

    if (!Capacitor.isNativePlatform()) {
      inputRef.current?.click();
      return;
    }

    if (isPicking) return;

    setIsPicking(true);

    try {
      const result = await FilePicker.pickFiles({
        types: ACCEPTED_MIME_TYPES,
        limit: 1,
      });

      const pickedFile = result.files?.[0];
      if (!pickedFile) return;

      const file = await nativeFileToFile(pickedFile);
      handleFiles([file]);
    } catch (err) {
      if (isPickerCancellation(err)) return;

      console.error("Unable to import selected file:", err);
      setError("We couldn't open that file. Please try another one.");
    } finally {
      setIsPicking(false);
    }
  };

  const handleInputChange = (event) => {
    handleFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const cardClassName = [
    styles.importWork.card,
    dragging ? styles.importWork.cardDragging : "",
    isPicking ? "cursor-wait opacity-70" : "",
  ].join(" ");

  return (
    <section className={styles.importWork.section}>
      <div className={styles.importWork.intro}>
        <p className={styles.importWork.label}>
          Bring something in
        </p>

        <p className={styles.importWork.description}>
          Have something you've already written? Bring it with you.
        </p>
      </div>

      <div className={styles.importWork.grid}>
        <button
          type="button"
          onClick={handleChooseFile}
          disabled={isPicking}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cardClassName}
          aria-describedby={error ? "import-file-error" : undefined}
        >
          <div className="flex h-full flex-col justify-between gap-8">
            <div>
              <p className={styles.importWork.cardTitle}>
                {dragging
                  ? "Drop it here"
                  : isPicking
                    ? "Opening files…"
                    : "From your device"}
              </p>

              <p className={styles.importWork.cardDescription}>
                PDF, TXT, or Word document.
              </p>
            </div>

            <span className={styles.importWork.cardAction}>
              {isPicking ? "Please wait…" : "Choose a file →"}
            </span>
          </div>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES}
          onChange={handleInputChange}
          className="sr-only"
          aria-label="Choose a document to import"
        />

        <GoogleDrivePicker onFilePicked={onGoogleFilePicked} />
      </div>

      {error && (
        <p
          id="import-file-error"
          role="alert"
          className={styles.importWork.error}
        >
          {error}
        </p>
      )}
    </section>
  );
}
