
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

// export default function PicturePageForm({ handleChange ,createPageAction}) {
//   const { type } = useParams();
//   const dispatch = useDispatch();
//   const { setError } = useContext(Context);
//    const currentProfile = useSelector((state) => state.users.currentProfile);

//   const page = useSelector((state) => state.pages.editingPage);
//   const htmlContent = useSelector((state) => state.pages.editorHtmlContent);
// const { parameters } = useContext(EditorContext);
//    const ePage = useSelector((state) => state.pages.editingPage);

//   // ✅ sync with redux ONCE
//   useEffect(() => {
//     if (page?.data) {
//       dispatch(setHtmlContent({ html: page.data }));
//       handleChange("data", page.data);
//     }
 
//   }, [page]);

//   const normalizeUrl = (url) => {
//     if (!url) return "";
//     return url.startsWith("http") ? url : `https://${url}`;
//   };

//   const handleInput = (e) => {
//     const value = e.detail?.value ?? e.target.value;

//     const finalValue =
//       type === PageType.link ? normalizeUrl(value) : value;

//     handleChange("data", finalValue);
//     dispatch(setHtmlContent({ html: finalValue }));
//   };

//   // =====================
//   // PREVIEW
//   // =====================
//   const renderPreview = () => {
//     console.log("Rendering preview with htmlContent:", htmlContent);
//     if (!htmlContent?.html) return null;

//     let eType = ePage.type ?? type
//     if ( eType=== PageType.link) {

//       return <LinkPreview url={htmlContent?.html} />;
//     }

//     if (eType === PageType.picture) {
//       if (!isValidUrl(htmlContent?.html)) return null;

//       return (
//         <div className="mt-4 flex justify-center">
//           <IonImg
//             src={htmlContent?.html}
//             className="rounded-xl max-h-[300px]"
//           />
//         </div>
//       );
//     }

//     return null;
//   };


//   return (
//     <div className="flex flex-col w-full max-w-xl mx-auto">

//       {/* INPUT */}
//       {(type === PageType.link || type === PageType.picture) && (
//         <>
//           <IonLabel className="text-emerald-700 mb-1">
//             {type === PageType.link ? "URL" : "Image URL"}
//           </IonLabel>

//           <IonInput
//             value={htmlContent?.html}
//             onIonChange={handleInput}
//             placeholder={
//               type === PageType.link
//                 ? "https://example.com"
//                 : "Paste image URL"
//             }
//             className="border border-emerald-300 rounded-md px-2"
//           />

//           {htmlContent?.html && type === PageType.link && !isValidUrl(htmlContent?.html) && (
//             <IonText className="text-red-500 text-sm mt-1">
//               Invalid URL
//             </IonText>
//           )}
//         </>
//       )}
// <div className="w-full mt-4">

//   <div className="w-full mt-4">
//         {!page ? (
//           <button
//             onClick={createPageAction} // ✅ use the parent createPageAction
//             className="w-full h-[3.5em] rounded-xl bg-emerald-600 text-white font-semibold active:scale-[0.98]"
//           >
//             Create
//           </button>
//         ) : (
//           <div className="w-full h-[3.5em] rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center text-sm">
//             {parameters.isSaved ? "Saved ✓" : "Saving..."}
//           </div>
//         )}
//       </div>
// </div>
//       {/* PREVIEW */}
//       <div className="mt-4">{renderPreview()}</div>
//     </div>
//   );
// // }
// export default function PicturePageForm({ handleChange, createPageAction }) {
//   const page = useSelector((state) => state.pages.editingPage);
//   const htmlContent = useSelector((state) => state.pages.editorHtmlContent);
//   const { parameters } = useContext(EditorContext);
//   const dispatch = useDispatch();

//   // Reset htmlContent when type or page changes
//   useEffect(() => {
//     const newData = page?.data ?? "";
//     dispatch(setHtmlContent({ html: newData }));
//     handleChange("data", newData);
//   }, [page, parameters.type]); // ✅ controlled by type

//   const normalizeUrl = (url) => (url?.startsWith("http") ? url : `https://${url}`);

//   const handleInput = (e) => {
//     const value = e.detail?.value ?? e.target.value;
//     const finalValue = parameters.type === PageType.link ? normalizeUrl(value) : value;
//     handleChange("data", finalValue);
//     dispatch(setHtmlContent({ html: finalValue }));
//   };

//   const renderPreview = () => {
//     if (!parameters.data) return null;

//     if (parameters.type === PageType.link) {
//       return <LinkPreview url={parameters.data} />;
//     }

//     if (parameters.type === PageType.picture) {
//       if (!isValidUrl(parameters.data)) return null;
//       return (
//         <div className="mt-4 flex justify-center">
//           <IonImg src={parameters.data} className="rounded-xl max-h-[300px]" />
//         </div>
//       );
//     }

//     return null;
//   };

//   return (
//     <div className="flex flex-col w-full max-w-xl mx-auto">
//       {/* Input */}
//       {(parameters.type === PageType.link || parameters.type === PageType.picture) && (
//         <>
//           <IonLabel className="text-emerald-700 mb-1">
//             {parameters.type === PageType.link ? "URL" : "Image URL"}
//           </IonLabel>
//           <IonInput
//             value={parameters.data}
//             onIonChange={handleInput}
//             placeholder={parameters.type === PageType.link ? "https://example.com" : "Paste image URL"}
//             className="border border-emerald-300 rounded-md px-2"
//           />
//           {parameters.type === PageType.link && parameters.data && !isValidUrl(parameters.data) && (
//             <IonText className="text-red-500 text-sm mt-1">Invalid URL</IonText>
//           )}
//         </>
//       )}

//       {/* Button */}
//       <div className="w-full mt-4">
//         {!page ? (
//           <button
//             onClick={createPageAction}
//             className="w-full h-[3.5em] rounded-xl bg-emerald-600 text-white font-semibold active:scale-[0.98]"
//           >
//             Create
//           </button>
//         ) : (
//           <div className="w-full h-[3.5em] rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center text-sm">
//             {parameters.isSaved ? "Saved ✓" : "Saving..."}
//           </div>
//         )}
//       </div>

//       {/* Preview */}
//       <div className="mt-4">{renderPreview()}</div>
//     </div>
//   );
// }


export default function PicturePageForm({ handleChange, createPageAction }) {
  const page = useSelector((state) => state.pages.editingPage);
  const { parameters } = useContext(EditorContext);
  const dispatch = useDispatch();

  const [localPreview, setLocalPreview] = useState(""); // file preview
  const [uploading, setUploading] = useState(false);

  // Reset htmlContent when type or page changes
  useEffect(() => {
    const newData = page?.data ?? "";
    dispatch(setHtmlContent({ html: newData }));
    handleChange("data", newData);
    setLocalPreview(""); // clear any previous file preview
  }, [page, parameters.type]);

  const normalizeUrl = (url) => (url?.startsWith("http") ? url : `https://${url}`);

  const handleInput = (e) => {
    const value = e.detail?.value ?? e.target.value;
    const finalValue = parameters.type === PageType.link ? normalizeUrl(value) : value;
    handleChange("data", finalValue);
    dispatch(setHtmlContent({ html: finalValue }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = () => setLocalPreview(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);

    try {
      const { url } = await dispatch(uploadPicture({ file })).unwrap();

      // Once uploaded, replace preview with uploaded URL
      handleChange("data", url);
      dispatch(setHtmlContent({ html: url }));
      setLocalPreview(""); // remove local preview
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

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
              className="mb-2"
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
            onClick={createPageAction}
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