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
      dispatch(setHtmlContent({html:value}));
    } else {
      setImage(null);
      dispatch(setHtmlContent({html:value}));
    }

    setParameters(params);
  };

  useEffect(() => {
    if (ePage) {
      switch (ePage.type) {
        case PageType.link:
          dispatch(setHtmlContent({html:ePage.data}));
          setLocalContent(ePage.data);
          setImage(null);
          break;
        case PageType.picture:
          if (isValidUrl(ePage.data)) {
            setImage(ePage.data);
            setLocalContent(ePage.data);
          } else {
            const src = `${Enviroment.proyUrl}/image?path=${encodeURIComponent(
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
            dispatch(setHtmlContent({html:fileName}));
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
