
import { useEffect, useState } from "react";
import AlertType from "../../core/AlertType";
import { useAlert } from "../../core/useAlert";
import styles from "../../styles/style";
import { IonInput, IonLabel, IonText } from "@ionic/react";
import LinkPreview from "../LinkPreview";
import { normalizeUrl } from "../../core/normalizeUrl";

export default function LinkPageForm({
  handleChange,
  setIsSaved,
  parameters,
  createPageAction,
}) {
  const { showAlert } = useAlert();

  const [draftValue, setDraftValue] = useState(
    parameters?.data || ""
  );
  const [saving, setSaving] = useState(false);

  const value = draftValue;

  const isExistingPage = Boolean(
    parameters?.id && parameters.id !== "new"
  );

  // Normalize and validate the external URL directly.
  const normalizedUrl = normalizeUrl(value);
  const validUrl = Boolean(normalizedUrl);

  // Sync when the parent loads or changes the page.
  useEffect(() => {
    setDraftValue(parameters?.data || "");
  }, [parameters?.data]);

  const updateValue = (nextValue) => {
    setDraftValue(nextValue);
    handleChange("data", nextValue);
    setIsSaved?.(false);
  };

  const handleInput = (event) => {
    const nextValue =
      event.detail?.value ??
      event.target?.value ??
      "";

    setDraftValue(String(nextValue));
  };

  const handleSave = async () => {
    if (saving) return;

    if (!normalizedUrl) {
      showAlert({
        message: "Please enter a valid URL.",
        type: AlertType.error,
      });
      return;
    }

    setSaving(true);

    try {
      // NEW LINK PAGE
      if (!isExistingPage) {
        const result = await createPageAction(normalizedUrl);

        if (!result) return;

        setDraftValue(normalizedUrl);
        setIsSaved?.(true);

        return;
      }

      // EXISTING LINK PAGE
      updateValue(normalizedUrl);

    } catch (error) {
      console.error("Unable to save Link Page:", error);

      showAlert({
        message:
          error?.message ||
          "Unable to save this Link Page.",
        type: AlertType.error,
      });
    } finally {
      setSaving(false);
    }
  };

  const existingNormalizedUrl = normalizeUrl(
    parameters?.data || ""
  );

  const canSaveExisting =
    validUrl &&
    normalizedUrl !== existingNormalizedUrl;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">

      {/* URL input */}
      <div>
        <IonLabel className="mb-2 block text-sm font-semibold text-plumb-ink dark:text-plumb-darkText">
          Link URL
        </IonLabel>

        <IonInput
          value={value}
          onIonChange={handleInput}
          placeholder="https://example.com"
          type="url"
          disabled={saving}
          className="rounded-xl border border-plumb-mint/40 px-3 dark:text-plumb-darkText"
        />

        <p className="mt-1 text-xs text-plumb-muted">
          Paste a webpage address to create a link page.
        </p>
      </div>

      {/* Validation */}
      {value.trim() && !validUrl && (
        <IonText color="danger">
          <p className="text-sm">
            Please enter a valid URL.
          </p>
        </IonText>
      )}

      {/* Link preview */}
      {validUrl && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-plumb-ink dark:text-plumb-darkText">
            Preview
          </p>

          <LinkPreview url={normalizedUrl} />
        </div>
      )}

      {/* Create new page */}
      {!isExistingPage && (
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !validUrl}
          className={[
            styles.button.base,
            styles.button.primary,
            saving || !validUrl
              ? "cursor-not-allowed opacity-50"
              : "",
          ].join(" ")}
        >
          {saving ? "Creating page..." : "Create page"}
        </button>
      )}

      {/* Save existing page */}
      {isExistingPage && (
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !canSaveExisting}
          className={[
            styles.button.base,
            styles.button.primary,
            saving || !canSaveExisting
              ? "cursor-not-allowed opacity-50"
              : "",
          ].join(" ")}
        >
          {saving ? "Saving..." : "Save link"}
        </button>
      )}
    </div>
  );
}
