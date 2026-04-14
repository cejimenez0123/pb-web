


import "../../styles/Editor.css";
import "../../App.css";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router";
import { IonContent, useIonRouter, IonImg } from "@ionic/react";
import { Capacitor } from "@capacitor/core";
import Paths from "../../core/paths";
import { PageType } from "../../core/constants";
import { createStory, deleteStory, getStory, updateStory } from "../../actions/StoryActions";
import { setEditingPage, setHtmlContent, setPageInView, setPageType } from "../../actions/PageActions.jsx";
import checkResult from "../../core/checkResult";
import debounce from "../../core/debounce.js";
import Context from "../../context";
import EditorContext from "./EditorContext";
import ErrorBoundary from "../../ErrorBoundary";


import HashtagForm from "../../components/hashtag/HashtagForm";
import FeedbackDialog from "../../components/page/FeedbackDialog";
import { useDialog } from "../../domain/usecases/useDialog.jsx";

import EditorDiv from "../../components/page/EditorDiv.jsx";
import { motion, AnimatePresence } from "framer-motion";
import Enviroment from "../../core/Enviroment.js";
import { Preferences } from "@capacitor/preferences";
import axios from "axios";
import TopBarDropdown from "../../components/page/TopBarDropdown.jsx";
import { getCurrentProfile } from "../../actions/UserActions.jsx";
import { set } from "lodash";

  const editorContainerBase = "mx-auto bg-white rounded-lg shadow-sm";
const editorContainerSpacing = "mx-2 mb-12 p-4";
const editorContainerResponsive = "md:w-page";
// Shared container for editor and top bar
const CONTAINER = "mx-auto w-full max-w-3xl p-4 md:p-6 bg-base-bg rounded-lg shadow-sm";
export default function EditorContainer({ presentingElement }) {
    const router = useIonRouter();
const { id, type: paramType } = useParams();
// const id =router.routeInfo.pathname.split("/")[2]
  const dispatch = useDispatch();

//  console.log()
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const { editPage ,pageInView,pageType:sliceType} = useSelector((state) => state.pages);
  console.log("sliceType from store:", sliceType, "paramType from URL:", paramType);
   const type = paramType || sliceType 
  const { setError, setSuccess,  } = useContext(Context);
  const [files,setFiles]=useState([])
  const isNative = Capacitor.isNativePlatform();
  const htmlContent = useSelector(state=>state.pages.editorHtmlContent)
  const hasInitialized = useRef(false);
  const initialData =
  editPage?.data ??
  htmlContent ??
  "";
     const [parameters, setParameters] = useState({
    isPrivate: true,
    data: initialData,
    title: "",
    id: id ||editPage?.id || null,
    needsFeedback: false,
    status:"draft",
    description: "",
    commentable: true,
    authorId:currentProfile?.id,
    profile: currentProfile,
    profileId: currentProfile ? currentProfile?.id : "",
    type: type,
  });
const effectiveId = parameters.id ||editPage?.id || id;
// console.log("Effective ID:", effectiveId, "Parameters ID:", parameters.id, "Edit Page ID:", editPage?.id, "URL ID:", id);
    const isValid = !!effectiveId && effectiveId !== "new"
 

  const [openHashtag, setOpenHashtag] = useState(false);
  const { openDialog, closeDialog, dialog, resetDialog } = useDialog();
    const { isPhone } = useContext(Context);
  
 

const [isSaved,setIsSaved]=useState(false)


 useEffect(() => {
  setParameters((prev) => ({
    ...prev,
    id: id ?? prev.id ?? editPage?.id,
    type,
    authorId: currentProfile?.id,
    profile: currentProfile,
    profileId: currentProfile?.id || "",
  }));
}, [type, id, currentProfile, editPage]);
    const [pending, setPending] = useState(!(type==PageType.link||type==PageType.picture));
  const notText = type !== PageType.link && type !== PageType.picture;

  // ------------------ Lifecycle ------------------
  useEffect(() => {
    closeDialog();
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }
  }, []);

  useEffect(() => {
    if (id) fetchStory();
  }, [id]);

const lastSavedRef = useRef(null);


const debouncedSave = useRef(
  debounce((payload) => {


    dispatch(updateStory(payload)).then(res =>
      checkResult(res,
        () =>  setIsSaved(true) ,
        (err) => {
          console.log(err);
      
          setError(err.message);
        }
      )
    );
  }, 500)
).current;



const createPageAction = async (data) => {
  setIsSaved(false)
  await saveStory({
    data: data,
  });
  setIsSaved(true)
  return
};
useEffect(() => {
  if (!currentProfile?.id) return;

  // 🚫 DO NOT create automatically
  if (!parameters.id) return;

  // ✅ only update existing stories
  if (!parameters.data?.trim()) return;
  setIsSaved(false)
  saveStory(parameters);
}, [
  parameters.data,
  parameters.title,
  parameters.status,
  parameters.isPrivate,
  parameters.commentable,
]);
  const setStory = (story) => {
    dispatch(setHtmlContent(story?.data ));
    dispatch(setPageInView({ page: story }));
    dispatch(setPageType({type:story?.type ?? type ?? PageType.text}));
    setParameters((prev) => ({

      ...prev,
      id:id,
      data:htmlContent,
      commentable: story?.commentable??false,
      page: story,
      isPrivate: story?.isPrivate??true,
  
      title: story?.title??"Untitled",
      type: story?.type??type??PageType.text,
    }));
    setPending(false);
  }
const hasLoaded = useRef(false);
useEffect(() => {
  if (!hasLoaded.current) {
    hasLoaded.current = true;
    return;
  }
if (!currentProfile?.id) return;

  const payload = {
    ...parameters,
    id: effectiveId,
    profileId: currentProfile?.id,
  };

  const isSame =
    JSON.stringify(payload) === JSON.stringify(lastSavedRef.current);

  if (isSame) return;

  lastSavedRef.current = payload;
setIsSaved(false);
  debouncedSave({...payload});
  setIsSaved(true)
}, [
  parameters.data,
  parameters.title,
  parameters.commentable,
  parameters.id,
  editPage?.id,
  currentProfile?.id,
]);

  const fetchStory = () => {
   
    if (!id) return;
  
    dispatch(getStory({ id })).then((res) =>
      checkResult(
        res,
        (payload) => {
          
          setStory(payload.story);
                  
          setPending(false);
        },
        (err) => {
          setError(err.message);
          setPending(false);
        }
      )
    );
  };



const saveStory =async (incoming) => {
    if (!currentProfile?.id) return;




    const payload = {
      ...parameters,
      ...incoming,
      profileId: currentProfile?.id,
      type: type ?? PageType.text,
    };

    // 🧠 CREATE
    if (!isValid) {
      const res = await dispatch(createStory(payload));

      return checkResult(
        res,
        (data) => {
          const story = data.story;

          setIsSaved(true);
          dispatch(setEditingPage({ page: story }));
          dispatch(setPageInView({ page: story }));
          dispatch(setHtmlContent(story.data));

          setParameters((prev) => ({
            ...prev,
            id: story.id,
          }));

       window.history.replaceState(null, "", Paths.editPage.createRoute(story.id));
        },
        (err) => {
          // setIsSaved(false);
          setError(err.message);
        }
      );
    }

    // 🧠 UPDATE
    const res = await dispatch(
      updateStory({
        ...payload,
        id: effectiveId,
      })
    );

    return checkResult(
      res,
      () => setIsSaved(true),
      (err) => {
        setIsSaved(false);
        setError(err.message);
      }
    );
}

 const driveTokenKey = "googledrivetoken";
   const TOKEN_EXPIRY_KEY = "googledrivetoken_expiry"; // 
const [accessToken,setAccessToken]=useState(null)
  async function checkAccessToken() {
    const token = (await Preferences.get({ key: driveTokenKey })).value;
    const tokenExpiry = (await Preferences.get({ key: TOKEN_EXPIRY_KEY })).value;
    const tokenValid = token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10);
    if(tokenValid){
      setAccessToken(token);
    }
  }
  useEffect(() => {
   try{ 
    fetchFiles()
   }catch(err){
    console.log(err)
   }
  }, [accessToken]);
  const fetchFiles = async () => {
    const token =(await Preferences.get({ key: driveTokenKey})).value

    try{
    if (!token) return;

    // setLoading(true);
    fetch('https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.document"&fields=files(id,name,mimeType,iconLink)', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then(res => {
        if (res.status === 401) throw new Error('Unauthorized — invalid or expired token');
        return res.json();
      })
      .then(data => {
        
        setFiles(data.files || []);
     
      })
      .catch(err => {
        console.error('Google Drive API error:', err);
        setAccessToken(null)
        // setLoading(false);
      });
    }catch(err){
        console.error("Error in fetchFiles:", err);
            setAccessToken(null)
        }
  };
 useEffect(() => {
  setParameters(prev =>
    prev.type === type ? prev : { ...prev, type: type }
  );
}, [type]);

    const onFilePicked = async (file) => {
    try {
      // const accessToken = (await Preferences.get({ key: "googledrivetoken" })).value;
      if (!file?.id || !accessToken) return;

      const url = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/html`;
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        responseType: 'text'
      });

      const htmlContent = response.data;
  debouncedSave( { ...parameters,data:htmlContent,status:"draft", id: editPage.id,needsFeedback:true, type: PageType.text}
 )

    } catch (error) {
      console.error("Error fetching Google Doc:", error);
      // setErrorLocal(error.message);
    }
    resetDialog()
  };
  

const openGoogleDrive = async()=>{
     const accessToken = (await Preferences.get({ key: driveTokenKey })).value;
  
   if(!accessToken){
    setError("No Access Token")
    return
   }

  openDialog({
    title: null,
    text:<div
  style={{ "--background": Enviroment.palette.base.surface }}
  className="bg-cream p-3 rounded-xl"
>
  <div
    className={`overflow-y-auto ${
      isPhone ? "grid grid-cols-2 gap-3" : "grid grid-cols-3 gap-4"
    }`}
    style={{ maxHeight: "70vh", padding: "0.5rem" }}
  >
    {files.map((file) => (
      <button
        key={file.id}
        onClick={() => onFilePicked(file)}
        className="flex flex-col justify-center items-center px-3 py-3 bg-white rounded-xl shadow-md border border-blueSea border-opacity-20 hover:border-blueSea hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-150"
      >
        <img
          src={file.iconLink}
          alt="file icon"
          className="w-10 h-10 mb-2 rounded"
        />
       <span className="text-center text-sm text-emerald-800 w-full break-words">
  {file.name}
</span>
      </button>
    ))}
  </div>
</div> 
 
  });
// };

}
const handleView =()=>{
 
    router.push(Paths.page.createRoute(effectiveId))

}
const handleChange = (key, value) => {
  setParameters((prev) => ({
    ...prev,
    [key]: value,
  }));
};
  useEffect(() => {
  // If profile already exists, do nothing
  if (currentProfile?.id) return;

  // Otherwise fetch it
  dispatch(getCurrentProfile()).then((res) =>
    checkResult(
      res,
      (payload) => {
       
        saveStory(parameters); 
      },
      (err) => {
        setError(err.message);
      }
    )
  );
}, [currentProfile?.id]);
const handlePostPublic=(desc)=>{
  const finalId = effectiveId;

  const payload = {
    ...parameters,
    id: finalId,
    description: desc,
    isPrivate: false,
    status: "finished",
    needsFeedback: true,
  };

  // setIsSaved(false);

  dispatch(updateStory(payload)).then(res => {
    checkResult(res,
      () => {
        // setIsSaved(true);
        resetDialog();

        router.push(
          Paths.page.createRoute(finalId),
          "forward"
        );
      },
      (err) => setError(err.message)
    );
  });
}
const handleFeedback = (feedbackDesc) => {
  const payload = {
    ...parameters,
    id: effectiveId,
    description: feedbackDesc,
    status: "workshop",
    needsFeedback: true,
  };



  dispatch(updateStory(payload)).then(res => {
    resetDialog();

    checkResult(res,
      () => {
        
        router.push(
          Paths.workshop.createRoute(effectiveId),
          "forward"
        );
      },
      (err) => setError(err.message)
    );
  });
}
  const openFeedback = (isFeedback) => {
    openDialog({
  
      disagree: null,
    
      disagreeText: null,
      scrollY: false,
      text: (
        <FeedbackDialog
          page={editPage}
          isFeedback={isFeedback}
          handleChange={(e) => handleChange("description", e)}
                handleFeedback={(feedbackDesc) => {
            handleFeedback(feedbackDesc);
          }}
          handlePostPublic={(desc) => {
            handlePostPublic(desc);
         
         
           
          }}
          handleClose={() => closeDialog()}
        />
      ),
    });
  };
  const handleDelete = () => {
    dispatch(deleteStory(parameters)).then(() => {
      router.push(Paths.home, "root");
    closeDialog()
    });
  }
  
  const openConfirmDeleteDialog = () => {
    let dia = {
      isOpen: true,
      title: "Are you sure you want to delete this page?",
      text: "",
      onClose: () => dispatch({ type: "SET_DIALOG", payload: { isOpen: false } }),
      agreeText: "Delete",
      agree: () => handleDelete(),
      disagreeText: "Close",
      disagree: () => dispatch({ type: "SET_DIALOG", payload: { isOpen: false } }),
    };
    openDialog(dia);
  };
useEffect(() => {
  if (!id) {
    dispatch(setPageInView({ page: null }));
    dispatch(setHtmlContent(""));
    
    // ❌ DO NOT autosave here
    setParameters(prev => ({
      ...prev,
      data: "",
      isSaved: false
    }));
  }
}, [type]);

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "fragment", label: "Fragment" },
  { value: "workshop", label: "Workshop" },
  { value: "finished", label: "Published" },
];

  // ------------------ Render ------------------
  return<EditorContext.Provider value={{ page: editPage, parameters, setParameters }}>
  <IonContent
    fullscreen
    scrollY
    style={{ "--background": Enviroment.palette.cream, "--padding-bottom": "30em", "--padding-top": isNative ? "0.3rem" : "6em" }}
    className="ion-padding"
  >
    {/* Top Bar with fade/slide */}
<AnimatePresence >
    
    <motion.div
      key="topbar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.05 }}
      // className="rounded-lg w-full sm:max-w-[50em] mx-auto p-2 bg-emerald-50 border border-emerald-200 flex flex-col gap-1"
    >
 {/* <div className={`mx-auto w-full max-w-3xl p-4 md:p-6 bg-emerald-50 rounded-lg border border-emerald-200 flex flex-col gap-2`}> */}
{/* <TopBar isSaved={isSaved} change={handleChange}/> */}
<div className="rounded-lg my-1 w-full max-w-3xl  mx-auto p-2 bg-emerald-50 border border-emerald-200 flex flex-col gap-1">
    {/* Top row: input + dropdown */}
    <div className="flex flex-row gap-2 items-center w-full">
      {/* Title Input */}
      <div className="flex flex-col w-[100%]"> 

      <input
        type="text"
        className="p-2 flex-grow bg-base-bg text-emerald-800 text-[1rem] rounded-md border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
        value={parameters.title}
        onChange={(e) => handleChange("title", e.target.value)}
        placeholder="Untitled"
      />
         

  
  <div className="flex items-center gap-2 mt-1">
  {isSaved ? (
    <span className="text-emerald-700 font-semibold flex items-center gap-1">
      ✅ Saved
    </span>
  ) : (
    <span className="text-yellow-600 font-semibold flex items-center gap-1">
      💾 Saving...
    </span>
  )}
  <VisibilityBadge isPrivate={parameters.isPrivate} toggle={() => handleChange("isPrivate", !parameters.isPrivate)} />
  {/* Status Badge */}

</div>

{/* </div> */}
</div>
      {/* Dropdown */}
      <TopBarDropdown
      router={router}
        id={id}
        handleView={handleView}
        editPage={pageInView}
        handleChange={handleChange}
        openFeedback={openFeedback}
        parameters={parameters}
        openGoogleDrive={openGoogleDrive}
        setOpenHashtag={setOpenHashtag}
        openHashtag={openHashtag}
    
        openConfirmDeleteDialog={openConfirmDeleteDialog}
      />


    </div>

    {/* Hashtag Form (slide down) */}
    <AnimatePresence>
      {openHashtag && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="overflow-hidden w-full"
        >
          <HashtagForm item={editPage} type="story" />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
{/* </div> */}
    </motion.div>
  
</AnimatePresence>

{/* Editor / Skeleton with fade */}


    <AnimatePresence >
     
      <motion.div
      key="editor"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.05 }}
    >
      <div className={CONTAINER}>
<div className="flex gap-1 bg-gray-100 p-1 rounded-full w-fit">
{STATUS_OPTIONS.map((option) => {
  const isActive = parameters.status === option.value;

  return (
    <button
      key={option.value}
      onClick={() =>handleChange("status", option.value) }
      className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-150
        ${
          isActive
            ? "bg-soft text-white shadow-sm"
            : "text-gray-500"
        }
      `}
    >
      {option.label}
    </button>
  );
})}
</div>
      <EditorDiv page={editPage} isSaved={isSaved} setIsSaved={setIsSaved} handleChange={handleChange} parameters={parameters} type={type} createPageAction={createPageAction} />
    </div>
    </motion.div>


  
{/* </div> */}
    </AnimatePresence>
 
{/* </div> */}

  </IonContent>
</EditorContext.Provider>

}
function VisibilityBadge({ isPrivate,toggle}) {
  const base =
    "flex items-center gap-1 px-2 py-[2px] rounded-full text-xs font-semibold transition";

  if (isPrivate) {
    return (
      <span onClick={toggle} className={`${base} bg-gray-100 text-gray-600`}>
        🔒 Private
      </span>
    );
  }

  return (
    <span  onClick={toggle} className={`${base} bg-emerald-100 text-emerald-700`}>
      🌍 Public
    </span>
  );
}