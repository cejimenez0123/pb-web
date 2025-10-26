import {
  IonLabel,
  IonImg,
  IonInput,
  IonText,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadPicture } from "../../actions/UserActions";
import checkResult from "../../core/checkResult";
import isValidUrl from "../../core/isValidUrl";
import LinkPreview from "../LinkPreview";
import { setHtmlContent } from "../../actions/PageActions.jsx";
import getDownloadPicture from "../../domain/usecases/getDownloadPicture";
import { PageType } from "../../core/constants";
import { useLocation } from "react-router-dom";
import EditorContext from "../../container/page/EditorContext";
import Context from "../../context.jsx";
import { imageOutline } from "ionicons/icons";

function PicturePageForm(props) {
  const dispatch = useDispatch();
  const { currentProfile } = useContext(Context);
  const { page, parameters, setParameters } = useContext(EditorContext);
  const ePage = useSelector((state) => state.pages.editingPage);
  const location = useLocation();

  const href = location.pathname.split("/");
  const last = href[href.length - 1];

  const [localContent, setLocalContent] = useState("");
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [image, setImage] = useState(null);

  const handleLocalContent = (e) => {
    const value = e.detail?.value ?? e.target.value;
    setLocalContent(value);

    let params = { ...parameters, profile: currentProfile, data: value };

    if (last === PageType.picture && isValidUrl(value)) {
      setImage(value);
      dispatch(setHtmlContent(value));
    } else {
      setImage(null);
      dispatch(setHtmlContent(value));
    }

    setParameters(params);
  };

  useEffect(() => {
    if (ePage) {
      switch (ePage.type) {
        case PageType.link:
          dispatch(setHtmlContent(ePage.data));
          setLocalContent(ePage.data);
          setImage(null);
          break;
        case PageType.picture:
          if (isValidUrl(ePage.data)) {
            setImage(ePage.data);
            setLocalContent(ePage.data);
          } else {
            const src = `${Enviroment.url}/image?path=${encodeURIComponent(
              ePage.data
            )}`;
            setImage(src);
          }
          break;
        default:
          break;
      }
    }
  }, [ePage, dispatch]);

  const checkContentTypeDiv = (type) => {
    switch (type) {
      case PageType.link:
        if (isValidUrl(localContent)) return <LinkPreview url={localContent} />;
        if (localContent.length > 0)
          return (
            <IonText className="text-emerald-800 text-center block mt-4">
              Invalid URL — please check and try again.
            </IonText>
          );
        return null;

      case PageType.picture:
        return (
          image && (
            <div className="flex justify-center mt-6">
              <IonImg
                className="rounded-xl shadow-sm border border-emerald-200 max-h-[320px] object-cover"
                src={image}
                alt={ePage ? ePage.title : ""}
              />
            </div>
          )
        );

      default:
        return null;
    }
  };

  const handleFileInput = (e) => {
    e.preventDefault();
    const fil = e.target.files[0];
    if (!fil) return;

    if (!fil.type.startsWith("image/")) {
      setErrorMessage("Please upload a valid image file.");
      setImage(null);
      return;
    }

    setFile(fil);
    let params = { ...parameters, file: fil, profile: currentProfile };
    setParameters(params);

    if (localContent.length === 0) {
      dispatch(uploadPicture(params)).then((result) =>
        checkResult(
          result,
          (payload) => {
            const href = payload["url"];
            const fileName = payload.ref;
            setLocalContent(href);
            setImage(href);
            params.data = fileName;
            dispatch(setHtmlContent(fileName));
            props.createPage(params);
            setParameters(params);
          },
          () => {}
        )
      );
    }
  };

  const uploadBtn = () => {
    if (last.toUpperCase() === "IMAGE") {
      return (
        <div className="flex flex-col items-center mb-6">
          <IonButton
            fill="outline"
            color="success"
            className="rounded-full"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <IonIcon icon={imageOutline} slot="start" />
            Upload Image
          </IonButton>
          <input
            id="fileInput"
            className="hidden"
            type="file"
            accept="image/*"
            onInput={handleFileInput}
            aria-label="Upload image file"
          />
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col ">
      {/* Upload Button */}
      {uploadBtn()}

      {/* URL Input */}
      <div className="max-w-xl mx-auto w-full mb-4">
        <IonLabel
          position="stacked"
          className="text-emerald-700 text-lg font-medium mb-1 block"
        >
          URL
        </IonLabel>
    <IonInput
          type="text"
          value={localContent}
          className="text-emerald-800 text-base flex-1 bg-transparent"
          onIonChange={handleLocalContent}
          placeholder="Paste or enter URL"
          clearInput={false}
        />
      </div>

      {/* Preview Area */}
      <div className=" mx-auto w-full">{checkContentTypeDiv(ePage ? ePage.type : last)}</div>

      {/* Error */}
      {errorMessage && (
        <IonText color="danger" className="text-center mt-3 block">
          {errorMessage}
        </IonText>
      )}
    </div>
  );
}

export default PicturePageForm;

// import {
//     IonLabel,
//     IonHeader,
//     IonImg,
//     IonInput,
//     IonText,
//   } from "@ionic/react";
//   import { useContext, useEffect, useState } from "react";
//   import { useDispatch, useSelector } from "react-redux";
//   import { uploadPicture } from "../../actions/UserActions";
//   import checkResult from "../../core/checkResult";
//   import isValidUrl from "../../core/isValidUrl";
//   import LinkPreview from "../LinkPreview";
//   import { setHtmlContent } from "../../actions/PageActions.jsx";
//   import getDownloadPicture from "../../domain/usecases/getDownloadPicture";
//   import { PageType } from "../../core/constants";
//   import { useLocation } from "react-router-dom";
//   import EditorContext from "../../container/page/EditorContext";
//   import Context from "../../context.jsx";
  
//   function PicturePageForm(props) {
//     const dispatch = useDispatch();
//     const { currentProfile } = useContext(Context);
//     const { page, parameters, setParameters } = useContext(EditorContext);
//     const ePage = useSelector((state) => state.pages.editingPage);
//     const location = useLocation();
  
//     const href = location.pathname.split("/");
//     const last = href[href.length - 1];
  
//     const [localContent, setLocalContent] = useState("");
//     const [file, setFile] = useState(null);
//     const [errorMessage, setErrorMessage] = useState(null);
//     const [image, setImage] = useState(null);
  
//     const handleLocalContent = (e) => {
//       const value = e.detail?.value ?? e.target.value;
//       if (last === PageType.picture) {
//         setLocalContent(value);
//         if (isValidUrl(value)) {
//           setImage(value);
//           dispatch(setHtmlContent(value));
//           let params = { ...parameters };
//           params.profile = currentProfile;
//           params.data = value;
//           setParameters(params);
//         }
//       } else {
//         setLocalContent(value);
//         setImage(null);
//         dispatch(setHtmlContent(value));
//         let params = { ...parameters };
//         params.data = value;
//         params.profile = currentProfile;
//         setParameters(params);
//       }
//     };
  
//     useEffect(() => {
//       if (ePage) {
//         switch (ePage.type) {
//           case PageType.link: {
//             dispatch(setHtmlContent(ePage.data));
//             setLocalContent(ePage.data);
//             setImage(null);
//             break;
//           }
//           case PageType.picture: {
//             if (isValidUrl(ePage.data)) {
//               setImage(ePage.data);
//               setLocalContent(ePage.data);
//             } else {

//                const src = `${Enviroment.url}/image?path=${encodeURIComponent(ePage.data)}`;
//               setImage(url);
//               // getDownloadPicture(ePage.data).then((url) => {
//               //   setImage(url);
//               //   setLocalContent(url);
//               // });
//             }
//             break;
//           }
//           default:
//             break;
//         }
//       }
//     }, [ePage, dispatch]);
  
//     const checkContentTypeDiv = (type) => {
//       switch (type) {
//         case PageType.link: {
//           if (isValidUrl(localContent)) {
//             return <LinkPreview url={localContent} />;
//           } else if (localContent.length > 0) {
//             return (
//               <IonText className="text-emerald-800 p-4 block">
//                 <p>URL is not valid</p>
//               </IonText>
//             );
//           } else {
//             return null;
//           }
//         }
//         case PageType.picture: {
//           return (
//             <div className="text-left">
//               {image && (
//                 <IonImg
//                   className="rounded-lg overflow-hidden my-4 mx-auto"
//                   src={image}
//                   alt={ePage ? ePage.title : ""}
//                 />
//               )}
//             </div>
//           );
//         }
//         default:
//           return null;
//       }
//     };
  
//     const handleFileInput = (e) => {
//       e.preventDefault();
//       const fil = e.target.files[0];
  
//       if (fil) {
//         if (!fil.type.startsWith("image/")) {
//           setErrorMessage("Please upload a valid image file.");
//           setImage(null);
//           return;
//         }
//         setFile(fil);
  
//         let params = { ...parameters };
//         params.file = fil;
//         params.profile = currentProfile;
//         setParameters(params);
  
//         if (localContent.length === 0) {
//           dispatch(uploadPicture(params)).then((result) =>
//             checkResult(
//               result,
//               (payload) => {
//                 const href = payload["url"];
//                 const fileName = payload.ref;
//                 setLocalContent(href);
//                 setImage(href);
  
//                 params.data = fileName;
//                 dispatch(setHtmlContent(fileName));
//                 props.createPage(params);
//                 params.profile = currentProfile;
//                 setParameters(params);
//               },
//               () => {
//                 // handle error if needed
//               }
//             )
//           );
//         }
//       }
//     };
  
//     const uploadBtn = () => {
//       if (last.toUpperCase() === "image".toUpperCase()) {
//         return (
//           <div>
//             <input
//               className="file-input my-8 mx-auto max-w-48"
//               type="file"
//               accept="image/*"
//               onInput={handleFileInput}
//               aria-label="Upload image file"
//             />
//             <div style={{ marginTop: "20px" }}></div>
//           </div>
//         );
//       }
//     };
  
//     return (
//       <div className="flex flex-col pb-8 rounded-b-lg">
//         <div className="p-8 mx-auto">{uploadBtn()}</div>
  
//         <IonLabel className=" border-emerald-600 border-2 max-w-[30em] mx-auto  flex rounded-full bg-transparent text-emerald-800">
//           <div className="flex h-fit px-2 py-1 my-auto ">
//           <IonText className=" my-auto">URL:</IonText>
//           {/* <input
//             type="text"
//             value={localContent}
            
//             className="text-emerald-800 text-[1.5rem] w-[90%] bg-transparent"
//             onIonChange={handleLocalContent}
//             clearInput={false}
//             aria-label="URL input"
//           /> */}
//           <IonInput
//              type="text"
//             value={localContent}
            
//             className="text-emerald-800 text-[1.5rem] w-[90%] bg-transparent"
//             onIonChange={handleLocalContent}
//             clearInput={false}
//             aria-label="URL input"
//           />
          
//           </div>
//         </IonLabel>
  
//         <div className="md:w-page">{checkContentTypeDiv(ePage ? ePage.type : last)}</div>
  
//         {errorMessage && (
//           <IonText color="danger" className="text-center mt-2 block">
//             {errorMessage}
//           </IonText>
//         )}
//       </div>
//     );
//   }
  
//   export default PicturePageForm;
  
