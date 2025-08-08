import {
    IonInput,
    IonLabel,
    IonButton,
    IonImg,
    IonText,
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
      if (last === PageType.picture) {
        setLocalContent(value);
        if (isValidUrl(value)) {
          setImage(value);
          dispatch(setHtmlContent(value));
          let params = { ...parameters };
          params.profile = currentProfile;
          params.data = value;
          setParameters(params);
        }
      } else {
        setLocalContent(value);
        setImage(null);
        dispatch(setHtmlContent(value));
        let params = { ...parameters };
        params.data = value;
        params.profile = currentProfile;
        setParameters(params);
      }
    };
  
    useEffect(() => {
      if (ePage) {
        switch (ePage.type) {
          case PageType.link: {
            dispatch(setHtmlContent(ePage.data));
            setLocalContent(ePage.data);
            setImage(null);
            break;
          }
          case PageType.picture: {
            if (isValidUrl(ePage.data)) {
              setImage(ePage.data);
              setLocalContent(ePage.data);
            } else {
              getDownloadPicture(ePage.data).then((url) => {
                setImage(url);
                setLocalContent(url);
              });
            }
            break;
          }
          default:
            break;
        }
      }
    }, [ePage, dispatch]);
  
    const checkContentTypeDiv = (type) => {
      switch (type) {
        case PageType.link: {
          if (isValidUrl(localContent)) {
            return <LinkPreview url={localContent} />;
          } else if (localContent.length > 0) {
            return (
              <IonText className="text-emerald-800 p-4 block">
                <p>URL is not valid</p>
              </IonText>
            );
          } else {
            return null;
          }
        }
        case PageType.picture: {
          return (
            <div className="text-left">
              {image && (
                <IonImg
                  className="rounded-lg overflow-hidden my-4 mx-auto"
                  src={image}
                  alt={ePage ? ePage.title : ""}
                />
              )}
            </div>
          );
        }
        default:
          return null;
      }
    };
  
    const handleFileInput = (e) => {
      e.preventDefault();
      const fil = e.target.files[0];
  
      if (fil) {
        if (!fil.type.startsWith("image/")) {
          setErrorMessage("Please upload a valid image file.");
          setImage(null);
          return;
        }
        setFile(fil);
  
        let params = { ...parameters };
        params.file = fil;
        params.profile = currentProfile;
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
                params.profile = currentProfile;
                setParameters(params);
              },
              () => {
                // handle error if needed
              }
            )
          );
        }
      }
    };
  
    const uploadBtn = () => {
      if (last.toUpperCase() === "image".toUpperCase()) {
        return (
          <div>
            <input
              className="file-input my-8 mx-auto max-w-48"
              type="file"
              accept="image/*"
              onInput={handleFileInput}
              aria-label="Upload image file"
            />
            <div style={{ marginTop: "20px" }}></div>
          </div>
        );
      }
    };
  
    return (
      <div className="flex flex-col pb-8 rounded-b-lg">
        <div className="p-8 mx-auto">{uploadBtn()}</div>
  
        <IonLabel className=" border-emerald-600 border-2 max-w-[30em] mx-auto  flex rounded-full bg-transparent text-emerald-800">
          <div className="flex h-fit px-2 py-1 my-auto ">
          <IonText className=" my-auto">URL:</IonText>
          <input
            type="text"
            value={localContent}
            
            className="text-emerald-800 text-[1.5rem] w-[90%] bg-transparent"
            onIonChange={handleLocalContent}
            clearInput={false}
            aria-label="URL input"
          />
          </div>
        </IonLabel>
  
        <div className="md:w-page">{checkContentTypeDiv(ePage ? ePage.type : last)}</div>
  
        {errorMessage && (
          <IonText color="danger" className="text-center mt-2 block">
            {errorMessage}
          </IonText>
        )}
      </div>
    );
  }
  
  export default PicturePageForm;
  
// import {    useContext, useEffect, 
//             useState } from 'react';
// import { uploadPicture } from '../../actions/UserActions';
// import { useDispatch, useSelector } from 'react-redux';
// import checkResult from '../../core/checkResult';
// import isValidUrl from '../../core/isValidUrl';
// import "../../App.css"
// import LinkPreview from '../LinkPreview';
// import { setHtmlContent } from '../../actions/PageActions.jsx';
// import getDownloadPicture from '../../domain/usecases/getDownloadPicture';
// import { PageType } from '../../core/constants';
// import { useLocation } from 'react-router-dom';
// import EditorContext from '../../container/page/EditorContext';
// import { debounce } from 'lodash';
// import Context from '../../context.jsx';
// function PicturePageForm(props){
//     const dispatch = useDispatch()
//     const {currentProfile}=useContext(Context)
//     const {page,parameters,setParameters,} = useContext(EditorContext)
//     const [localContent,setLocalContent] = useState("")
//     const ePage = useSelector(state=>state.pages.editingPage)
//     const [file,setFile]=useState(null)
//     const location = useLocation()
//     let href =location.pathname.split("/")
//     const last = href[href.length-1]
//     const [errorMessage,setErrorMessage]=useState(null)
//     const [image,setImage]=useState(null)
//     const handleLocalContent=(e)=>{
//     if(last==PageType.picture){
//         setLocalContent(e.target.value)
//         if(isValidUrl(e.target.value)){
            
//             setImage(e.target.value)
//             dispatch(setHtmlContent(e.target.value))
//             let params = parameters
//             params.profile = currentProfile
//             params.data = e.target.value
//             setParameters(params)
//         }
//     }else{
//         setLocalContent(e.target.value)
//         setImage(null)
//         dispatch(setHtmlContent(e.target.value))
//         let params = parameters
//         params.data = e.target.value
//         params.profile = currentProfile
//         setParameters(params)
//     }}
//     useEffect(()=>{
//         if(ePage){
//             switch(ePage.type){
//                 case PageType.link:{
//                     dispatch(setHtmlContent(ePage.data))
//                     setLocalContent(ePage.data)
//                     setImage(null)
//                 }
//                 case PageType.picture:{
                
//                         if(isValidUrl(ePage.data)){
//                             setImage(ePage.data)    
//                             setLocalContent(ePage.data)
//                         }else{
//                             getDownloadPicture(ePage.data).then(url=>{
                                
//                                 setImage(url)
//                                 setLocalContent(url)
//                             })
//                         }
                    
//                 }
//             }}
    
//     },[ePage])
  

//     const contentDiv =()=>{
       
//         if(ePage){
//             return checkContentTypeDiv(ePage.type)
//          }else{
//              return checkContentTypeDiv(last)
//         }
    
//     }
   
 
//         const handleFileInput = (e) => {
//             e.preventDefault()
//             const fil = e.target.files[0];
            
//             if (fil) {
//               // Check file type
//               if (!fil.type.startsWith('image/')) {
//                 setErrorMessage('Please upload a valid image file.');
//                 setImage(null)
//                 return;
//               }
//               setFile(fil)
        
//               let params = parameters
//                  params.file = fil
//                  params.profile = currentProfile
//                  setParameters(params)
//                  if(localContent.length==0){

              
//               dispatch(uploadPicture(parameters)).then((result) => 
//                 checkResult(result,payload=>{
//                     const href = payload["url"]
//                     const fileName =payload.ref
//                     setLocalContent(href)
//                     setImage(href)
                   
//                     params.data = fileName
//                     dispatch(setHtmlContent(fileName))
//                     props.createPage(params)
//                 params.profile = currentProfile
//                     setParameters(params)
                    
//                 },err=>{}))
//             }
//         }
            
//           };
      
   

//     const checkContentTypeDiv = (type)=>{
//         switch(type){
//             case PageType.link:{  
//                 if(isValidUrl(localContent)){        
//                     return(
              
//                     <LinkPreview url={localContent} />
                
//                     )
//                  }else if(localContent.length>0){
//                     return (<div className={"text-emerald-800 p-4"}>
//                         <p>URL is not valid</p>
//                         </div>)
//                  }else{
//                     return null
//                  }
//                 }

       
//        case PageType.picture:{
     
//             return(
//                 <div className='text-left'>
//                         <img className="rounded-lg overflow-hidden my-4 mx-auto" src={image} alt={ePage?ePage.title:""} />
                
//                 </div>
//             )
           
//         }

// }}
//     const uploadBtn =()=>{
//         let href = window.location.href.split("/")
//         const last = href[href.length-1]
//         if(last.toUpperCase()=="image".toUpperCase()){
//             return( <div>  
//                  <input
//                 className="file-input my-8 mx-auto max-w-48"
//                     type="file"
//                     accept="image/*"
//                    onInput={handleFileInput}/>
                         
//                     <div style={{ marginTop: '20px' }}>
      
//                       </div>
//                     </div>)
//                     }}

                 
    
//     return(<div className='  flex flex-col pb-8 rounded-b-lg '>
      
//       <div className='p-8 mx-auto'>{uploadBtn()}</div>
//     <label className='my-2 border-emerald-600 border-2 max-w-[30em] mx-auto py-4 flex pl-2 pr-3 rounded-full  bg-transparent  text-emerald-800 '>
//             <h6 className='mont-medium my-auto'>URL</h6>
//             <input 
//             type='text'
//                     value={localContent}
//                     className=' text-emerald-800 text-[1.2rem] mx-1 w-[90%] my-auto bg-transparent'
                 
//                     onChange={(e)=>handleLocalContent(e)}
//                 />
//             </label>
//             <div className='md:w-page'>
//                         {contentDiv()}
         
//                         </div>
//         <p>{errorMessage}</p>
        
// </div>)
// }
// export default PicturePageForm

