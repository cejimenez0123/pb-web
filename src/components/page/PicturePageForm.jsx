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
import { PageType } from "../../core/constants";
import { useLocation } from "react-router-dom";
import EditorContext from "../../container/page/EditorContext";
import Context from "../../context.jsx";
import { imageOutline } from "ionicons/icons";
import Enviroment from "../../core/Enviroment.js";
import { Capacitor } from "@capacitor/core";
function PicturePageForm({createPageAction}) {
  const dispatch = useDispatch();
  const { currentProfile,setError } = useContext(Context);
  const { parameters, setParameters } = useContext(EditorContext);
  const ePage = useSelector((state) => state.pages.editingPage);
  const location = useLocation();

  const href = location.pathname.split("/");
  const last = href[href.length - 1];

  const [localContent, setLocalContent] = useState("");
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [image, setImage] = useState(null);

  const handleLocalContent = (e) => {
    console.log(localContent)
    const value = e.detail?.value ?? e.target.value;
    setLocalContent(value);
    let params = { ...parameters, profile: currentProfile, data: value };
 setParameters(params);
    if (last === PageType.picture&&isValidUrl(value)) {
      setImage(value);
      dispatch(setHtmlContent({html:value}));
    } else {
      dispatch(setHtmlContent({html:value}));
    }
if(last==PageType.link){
  dispatch(setHtmlContent({html:value}));
  createPageAction(parameters)
}
   
  };

  useEffect(() => {
    if (ePage && ePage.data.length>4) {
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
              setImage(Enviroment.imageProxy(ePage.data))
          }
          break;
        default:
          break;
      }
    }
  }, [ePage]);

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
    e.preventDefault()
  const file = e.target.files[0];
  if(Capacitor.isNativePlatform()){
  if (!file) return;

  if (!file.type.startsWith('image/')) {

    setError('Please upload a valid image file.');
    return;
  }

  
  if (image.startsWith('blob:')) {
    URL.revokeObjectURL(image);
  }

  const newUrl = URL.createObjectURL(file) + `#${Date.now()}`;
  console.log('Preview URL:', newUrl);
  console.log(file)
  console.log(image)
  setFile(file);
  setImage(newUrl);
  setError('');
}else{
  const reader = new FileReader();
reader.onloadend = () => {
  setImage(reader.result);
  setFile(file)
  console.log(reader.result)
};

reader.readAsDataURL(file);
}

};
const create=()=>{
  let params = {file:file,profile:currentProfile}
  if(file){
 dispatch(uploadPicture(params)).then((result) =>
        checkResult(
          result,
          (payload) => {
            const fileName = payload.ref;
          
            params.type = PageType.picture
            params.data = fileName;
            dispatch(setHtmlContent({html:fileName}));
            
            setParameters({...params,...parameters,data:fileName});
       
            createPageAction(parameters)
          },
          () => {}
        )
      );}
}
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
        {last==PageType.link && <IonText>Press Enter</IonText>}
      </div>
{last==PageType.picture && <IonButton onClick={create}>Save</IonButton>}
      {/* Preview Area */}
      <div className=" mx-auto w-full">{checkContentTypeDiv(ePage?ePage.type:last)}</div>

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
