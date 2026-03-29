
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

export default function PicturePageForm({ handleChange ,createPageAction}) {
  const { type } = useParams();
  const dispatch = useDispatch();
  const { setError } = useContext(Context);
   const currentProfile = useSelector((state) => state.users.currentProfile);

  const page = useSelector((state) => state.pages.editingPage);
  const htmlContent = useSelector((state) => state.pages.editorHtmlContent);
const { parameters } = useContext(EditorContext);
   const ePage = useSelector((state) => state.pages.editingPage);

  // ✅ sync with redux ONCE
  useEffect(() => {
    if (page?.data) {
      dispatch(setHtmlContent({ html: page.data }));
      handleChange("data", page.data);
    }
 
  }, [page]);

  const normalizeUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const handleInput = (e) => {
    const value = e.detail?.value ?? e.target.value;

    const finalValue =
      type === PageType.link ? normalizeUrl(value) : value;

    handleChange("data", finalValue);
    dispatch(setHtmlContent({ html: finalValue }));
  };

  // =====================
  // PREVIEW
  // =====================
  const renderPreview = () => {
    console.log("Rendering preview with htmlContent:", htmlContent);
    if (!htmlContent?.html) return null;

    let eType = ePage.type ?? type
    if ( eType=== PageType.link) {

      return <LinkPreview url={htmlContent?.html} />;
    }

    if (eType === PageType.picture) {
      if (!isValidUrl(htmlContent?.html)) return null;

      return (
        <div className="mt-4 flex justify-center">
          <IonImg
            src={htmlContent?.html}
            className="rounded-xl max-h-[300px]"
          />
        </div>
      );
    }

    return null;
  };


  return (
    <div className="flex flex-col w-full max-w-xl mx-auto">

      {/* INPUT */}
      {(type === PageType.link || type === PageType.picture) && (
        <>
          <IonLabel className="text-emerald-700 mb-1">
            {type === PageType.link ? "URL" : "Image URL"}
          </IonLabel>

          <IonInput
            value={htmlContent?.html}
            onIonChange={handleInput}
            placeholder={
              type === PageType.link
                ? "https://example.com"
                : "Paste image URL"
            }
            className="border border-emerald-300 rounded-md px-2"
          />

          {htmlContent?.html && type === PageType.link && !isValidUrl(htmlContent?.html) && (
            <IonText className="text-red-500 text-sm mt-1">
              Invalid URL
            </IonText>
          )}
        </>
      )}
<div className="w-full mt-4">

  <div className="w-full mt-4">
        {!page ? (
          <button
            onClick={createPageAction} // ✅ use the parent createPageAction
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
</div>
      {/* PREVIEW */}
      <div className="mt-4">{renderPreview()}</div>
    </div>
  );
}