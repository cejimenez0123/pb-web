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
import { createStory, getStory } from "../../actions/StoryActions.jsx";
import Paths from "../../core/paths.js";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import uploadFile from "../../core/uploadFile.jsx";
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


  const setPage =(page)=>{
    setPending(true)
     switch (page.type) {
        case PageType.link:
          dispatch(setHtmlContent({html:page.data}));
          setLocalContent(page.data);
          setImage(null);
          setPending(false)
          break;
        case PageType.picture:
          if (isValidUrl(page.data)) {
            setImage(page.data);
            setLocalContent(page.data);
          } else {
            setImage(Enviroment.imageProxy(page.data))
          }
              setPending(false)
          break;
        default:
          break;
      }
  }
  useEffect(()=>{
    dispatch(getStory()).then(res=>{
      checkResult(res,payload=>{
          const {story}=payload
         setPage(story)
         setEditingPage({page:story})
      },err=>{

      })
    })
  },[navigate])
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
    e.preventDefault();
  if(!Capacitor.isNativePlatform()){

  const file = e.target.files?.[0];
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


    const newUrl = URL.createObjectURL(file);
    setImage(newUrl);
    handleChange("file",file)
    setError('');
  

  }else{

  const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: true,
      resultType: CameraResultType.Uri, // This works best with Uploader's 'filePath'
      source: CameraSource.Prompt,
    });
    try {
      handleChange("file",image)
      setImage(image.webPath)
    }catch(err){

    }}}
const createBrowser=()=>{
  window.alert(JSON.stringify(parameters))
dispatch(createStory({...parameters,type:type})).then(res=>checkResult(res,payload=>{
          const {story}=payload
          dispatch(setEditingPage({page:story}))
          setPage(story)
          navigate(Paths.editPage.createRoute(story.id),{replace:true})
        
        },err=>{
window.alert(err.message)
        }))
}
const createNative= async ()=>{
  setPending(true)
        const fileName =  await uploadFile(parameters.file)
        dispatch(createStory({...parameters,data:fileName,type:PageType.picture})).then(res=>checkResult(res,payload=>{
          const {story}=payload
           navigate(Paths.editPage.createRoute(story.id),{replace:true})
          // dispatch(setEditingPage({page:story}))

        
        },err=>{
            setError(err.message)
        }))}

const create=()=>{
//  type==PageType.picture&&
 if(type==PageType.picture){
    !Capacitor.isNativePlatform()?createBrowser():createNative()
 }else{
 
createBrowser()
 }

}
  const uploadBtn = () => {
    if (type==PageType.picture) {
      return Capacitor.isNativePlatform()?<IonButton onClick={handleFileInput}>Upload</IonButton>:(
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
      {!ePage? <div className="max-w-xl mx-auto w-full mb-4">
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
        {<IonText>Press Enter</IonText>}
        <IonText onClick={()=>{
          setLocalContent("");
          setImage(null);
          handleChange("profile",currentProfile)
          handleChange("data","")
          dispatch(setHtmlContent({html:""}));
        }}>Clear</IonText>
        </div>
      </div>:null}
{!ePage? <IonButton onClick={create}>Save</IonButton>:null}
      
      <div className=" mx-auto w-full">{pending?<IonImg src={loadingGif}/>:!ePage&&image?<IonImg src={image} />:checkContentTypeDiv(ePage?ePage.type:type)}</div>

    </div>
  );
}

export default PicturePageForm;
