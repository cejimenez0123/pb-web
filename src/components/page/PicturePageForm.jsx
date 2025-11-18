import {
  IonLabel,
  IonImg,
  IonInput,
  IonText,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { setEditingPage } from "../../actions/PageActions.jsx"
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadPicture } from "../../actions/ProfileActions.jsx";
import checkResult from "../../core/checkResult";
import isValidUrl from "../../core/isValidUrl";
import LinkPreview from "../LinkPreview";
import { setHtmlContent } from "../../actions/PageActions.jsx";
import { PageType } from "../../core/constants";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import EditorContext from "../../container/page/EditorContext";
import Context from "../../context.jsx";
import loadingGif from "../../images/loading.gif"
import { imageOutline } from "ionicons/icons";
import Enviroment from "../../core/Enviroment.js";
import { Capacitor } from "@capacitor/core";
import { createStory } from "../../actions/StoryActions.jsx";
import Paths from "../../core/paths.js";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
function PicturePageForm({handleChange}) {
  const dispatch = useDispatch();
  const { currentProfile,setError } = useContext(Context);
const {parameters}=useContext(EditorContext)
const navigate = useNavigate()
  const ePage = useSelector((state) => state.pages.editingPage);
    const htmlContent = useSelector((state) => state.pages.editorHtmlContent);
const {id,type}=useParams()

  const [pending,setPending]=useState(false)
  const [localContent, setLocalContent] = useState(htmlContent.html || "");
  // const [file, setFile] = useState(null);
  // const [errorMessage, setErrorMessage] = useState(null);
  const [image, setImage] = useState(null);
  const handleLocalContent = (e) => {

      const value = e.detail?.value ?? e.target.value;
      setLocalContent(value);
      handleChange("data",value)
      handleChange("profile",currentProfile)
      dispatch(setHtmlContent({html:value}));
    if (type === PageType.picture&&isValidUrl(value)) {
      setImage(value);
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

const handleFileInput = async(e) => {
  if(!Capacitor.isNativePlatform()){
  e.preventDefault();
  const file = e.target.files?.[0];
  console.log(file)
  if (!file) return;
    if(file.type == "image/heic"){
      setError("image type HEIC not supported")
      return
    }

  // Validate type
  if (!file.type.startsWith('image/')) {
    setError('Please upload a valid image file.');
    return;
  }

  // Clean up any old preview URL
  if (image && (image.startsWith('blob:') || image.startsWith('data:'))) {
    URL.revokeObjectURL(image);
  }

  // Web preview logic
  if (!Capacitor.isNativePlatform()) {
    const newUrl = URL.createObjectURL(file);
    setImage(newUrl);
    handleChange("file",file)

    setError('');
    console.log('Preview URL (web):', newUrl);
  } else {
    // Native logic — FileReader may not work; fallback to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      
      handleChange("file",file)
      setError('');
      console.log('Preview (native, base64):', reader.result?.slice(0, 50));
    };
    reader.readAsDataURL(file);
  }}else{
// try {
    
  const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: true,
      resultType: CameraResultType.Uri, // This works best with Uploader's 'filePath'
      source: CameraSource.Prompt,
    });
    try {
      handleChange("file",image)
    setPictureUrl(image.webPath)
    }catch(err){

    }}}
  
const create=()=>{
 !Capacitor.isNativePlatform()?dispatch(createStory({...parameters})).then(res=>checkResult(res,payload=>{
          const {story}=payload
          dispatch(setEditingPage({page:story}))
          navigate(Paths.editPage.createRoute(story.id))
        
        },err=>{

        })):dispatch(uploadPicture(parameters)).then((result) =>
        checkResult(
          result,
          (payload) => {
            // console.log("paff",payload)
            const fileName = payload.fileName;
          handleChange("type",PageType.picture)
          handleChange("data",fileName)
            dispatch(setHtmlContent({html:fileName}));
       
        dispatch(createStory({...parameters,data:fileName})).then(res=>checkResult(res,payload=>{
          const {story}=payload
          dispatch(setEditingPage({page:story}))
          navigate(Paths.editPage.createRoute(story.id))
        
        },err=>{

        }))}))}
 
    async function handlePictureNative() {
  try {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: true,
      resultType: CameraResultType.Uri, // This works best with Uploader's 'filePath'
      source: CameraSource.Prompt,
    });
    try {
    const fileName = await uploadFile(image);
    handleChange("data",fileName)
    setImage(image.webPath)
 
  } catch (e) {
    console.error('Upload failed:', e);
  }
 

    }catch(er){

    }  }  
  const uploadBtn = () => {
    if (type==PageType.picture) {
      return Capacitor.isNativePlatform()?<IonButton onClick={handlePictureNative}>Upload</IonButton>:(
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
  }

  return (
    <div className="flex flex-col h-full ">
      {uploadBtn()}
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
         <div className="flex flex-row space-x-4 mt-2 justify-between w-full">
        <IonText>Press Enter</IonText>
        <IonText onClick={()=>{
          setLocalContent("");
          setImage(null);
          handleChange("profile",currentProfile)
          handleChange("data","")
          dispatch(setHtmlContent({html:""}));
        }}>Clear</IonText>
        </div>
      </div>
{type==PageType.picture && <IonButton onClick={create}>Save</IonButton>}
      {/* Preview Area */}
      <div className=" mx-auto w-full">{pending?<IonImg src={loadingGif}/>:checkContentTypeDiv(ePage?ePage.type:type)}</div>

      {/* {errorMessage && (
        <IonText color="danger" className="text-center mt-3 block">
          {errorMessage}
        </IonText>
      )} */}
    </div>
  );
}

export default PicturePageForm;
