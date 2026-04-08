


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
import { setEditingPage, setHtmlContent, setPageInView } from "../../actions/PageActions.jsx";
import checkResult from "../../core/checkResult";
import debounce from "../../core/debounce.js";
import Context from "../../context";
import EditorContext from "./EditorContext";
import ErrorBoundary from "../../ErrorBoundary";


import HashtagForm from "../../components/hashtag/HashtagForm";
import RoleForm from "../../components/role/RoleForm";
import FeedbackDialog from "../../components/page/FeedbackDialog";
import { useDialog } from "../../domain/usecases/useDialog.jsx";
import menu from "../../images/icons/menu.svg";

import EditorDiv from "../../components/page/EditorDiv.jsx";
import { motion, AnimatePresence } from "framer-motion";
import Enviroment from "../../core/Enviroment.js";
import { SocialLogin } from "@capgo/capacitor-social-login";
import { Preferences } from "@capacitor/preferences";
import axios from "axios";
import TopBarDropdown from "../../components/page/TopBarDropdown.jsx";
     const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
  const IOS_CLIENT_ID = import.meta.env.VITE_IOS_CLIENT_ID;
export default function EditorContainer({ presentingElement }) {
  const { id, type } = useParams();

  const dispatch = useDispatch();
  const router = useIonRouter();
 
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const editPage = useSelector((state) => state.pages.editingPage);
   
  const { setError, setSuccess,  } = useContext(Context);
  const [files,setFiles]=useState([])
  const isNative = Capacitor.isNativePlatform();
  const hasInitialized = useRef(false);
    

  const [openHashtag, setOpenHashtag] = useState(false);
  const { openDialog, closeDialog, dialog, resetDialog } = useDialog();
    const { isPhone } = useContext(Context);
  const htmlContent = useSelector(state=>state.pages.editorHtmlContent)

  const [parameters, setParameters] = useState({
    isPrivate: true,
    data: editPage?.data || htmlContent,
    title: "",
    isSaved:false,
    needsFeedback: false,
    status:"draft",
    description: "",
    commentable: true,
    profile: currentProfile,
    profileId: currentProfile ? currentProfile.id : "",
    type: type|| PageType.text,
  });
  const pageType = type??parameters.type??PageType.text
    const [pending, setPending] = useState(!(pageType==PageType.link||pageType==PageType.picture));
  const notText = pageType !== PageType.link && pageType !== PageType.picture;

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
  }, [type, id]);

const lastSavedRef = useRef(null);

const debouncedSave = useRef(
  debounce((payload) => {
    dispatch(updateStory(payload)).then(res =>
      checkResult(res, () => {
        handleChange("isSaved", payload.data?.length > 0);
      })
    );
  }, 300)
).current;
console.log("HTMLCONTENT",htmlContent)

  const setStory = (story) => {
    dispatch(setHtmlContent(story?.data ));
    dispatch(setEditingPage({ page: story }));
    
    setParameters((prev) => ({
      ...prev,
      data:story.data,
      commentable: story.commentable,
      page: story,
      isPrivate: story.isPrivate,
      data: story.data,
      title: story.title,
      type: story.type,
    }));
    setPending(false);
  }

useEffect(() => {
  if (!editPage?.id || !currentProfile?.id || !notText) return;

  const payload = {
    id: editPage.id,
    type: editPage.type,
    profileId: currentProfile.id,
    data: parameters.data,
    title: parameters.title,
    isPrivate: parameters.isPrivate,
    commentable: parameters.commentable,
    description: parameters.description,
    needsFeedback: parameters.needsFeedback,
  };

  // 🔥 Prevent duplicate calls
  const isSame =JSON.stringify(payload) === JSON.stringify(lastSavedRef.current);

  if (isSame) return;

  lastSavedRef.current = payload;

  debouncedSave(payload);
}, [
  parameters.data,
  parameters.title,
  parameters.isPrivate,
  parameters.commentable,
  parameters.description,
  parameters.needsFeedback,
]);
  const fetchStory = () => {
   
    if (!id) return;
  
    dispatch(getStory({ id })).then((res) =>
      checkResult(
        res,
        (payload) => {
  
          setStory(payload.story);
                  // handleChange("isSaved",true)
          setPending(false);
        },
        (err) => {
          setError(err.message);
          setPending(false);
        }
      )
    );
  };
  const createPageAction = (dataOverride) => {
  const dataToUse = dataOverride || htmlContent  // <- always take the latest local value
  if (!currentProfile?.id) return;

  const payload = {
    title: parameters.title,
    data: dataToUse, 
    description: parameters.description,
    needsFeedback: parameters.needsFeedback,
    isPrivate: parameters.isPrivate,
    status:"draft",
    commentable: parameters.commentable,
    type: type,
    profileId: currentProfile.id,
  };

  dispatch(createStory(payload)).then((res) =>
    checkResult(res, ({ story }) => {
      dispatch(setEditingPage({ page: story }));
      handleChange("isSaved", true);
      router.push(Paths.editPage.createRoute(story.id));
    }, (err) => setError(err.message))
  );
};


  const handleChange = (key, value) =>{ 
    setParameters((prev) => ({ ...prev, [key]: value }))

};

 const driveTokenKey = "googledrivetoken";
   const TOKEN_EXPIRY_KEY = "googledrivetoken_expiry"; // 
const [accessToken,setAccessToken]=useState(null)
  async function checkAccessToken() {
    const token = (await Preferences.get({ key: driveTokenKey })).value;
    const tokenExpiry = (await Preferences.get({ key: TOKEN_EXPIRY_KEY })).value;
    const tokenValid = token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10);
console.log("accesstokenTOKENE",token)
    if(tokenValid){
      setAccessToken(token);
    }
  }
  useEffect(() => {
    
    fetchFiles()
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
    prev.type === pageType ? prev : { ...prev, type: pageType }
  );
}, [pageType]);
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
const topBar = () => (
  <div className="rounded-lg w-full sm:max-w-[50em] mx-auto p-2 bg-emerald-50 border border-emerald-200 flex flex-col gap-1">
    {/* Top row: input + dropdown */}
    <div className="flex flex-row gap-2 items-center w-full">
      {/* Title Input */}
      <input
        type="text"
        className="p-2 flex-grow text-emerald-800 text-[1rem] bg-white rounded-md border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
        value={parameters.title}
        onChange={(e) => handleChange("title", e.target.value)}
        placeholder="Untitled"
      />

      {/* Dropdown */}
      <TopBarDropdown
      router={router}
        id={id}
        editPage={editPage}
        handleChange={handleChange}
        openFeedback={openFeedback}
        parameters={parameters}
        openGoogleDrive={openGoogleDrive}
        setOpenHashtag={setOpenHashtag}
        openHashtag={openHashtag}
        openRoleFormDialog={openRoleFormDialog}
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
          <HashtagForm item={parameters.page} type="story" />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
const openRoleFormDialog = (page) => {
  openDialog({

    disagree: null,

    disagreeText: null,
    height: 90,
    scrollY: false,
    text: <RoleForm item={page} handleClose={() => resetDialog()} />,
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
            resetDialog();
          dispatch(updateStory({ ...parameters,description:feedbackDesc,status:"workshop", needsFeedback:true, type: editPage.type || parameters.type }))
         
          }}
          handlePostPublic={(desc) => {
            handleChange("isPrivate", false);
            handleChange("status","finished")
            dispatch(updateStory({ ...parameters,description:desc, needsFeedback:true, type: editPage.type || parameters.type }))
         
            router.push(Paths.page.createRoute(editPage.id), "forward");
                 resetDialog();
          }}
          handleClose={() => closeDialog()}
        />
      ),
    });
  };
  const handleDelete = debounce(() => {
    dispatch(deleteStory(parameters)).then(() => {
     router.push(Paths.myProfile, "root", "replace");
      resetDialog()
    });
  }, 10);
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
  if (!id) { // only for new page creation
    dispatch(setEditingPage({ page: null })); // clear old editPage
    dispatch(setHtmlContent( "" )); // clear editor content
    handleChange("data", "");
    handleChange("isSaved", false);
  }
  
}, [type]);
console.log("DOMAN",Enviroment.domain)

  // ------------------ Render ------------------
  return<EditorContext.Provider value={{ page: editPage, parameters, setParameters }}>
  <IonContent
    fullscreen
    scrollY
    style={{ "--background": Enviroment.palette.cream, "--padding-bottom": "30em", "--padding-top": isNative ? "0.3rem" : "6em" }}
    className="ion-padding"
  >
    {/* Top Bar with fade/slide */}
<AnimatePresence mode="wait">
  {!pending && (
    <motion.div
      key="topbar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      // className="rounded-lg w-full sm:max-w-[50em] mx-auto p-2 bg-emerald-50 border border-emerald-200 flex flex-col gap-1"
    >
      {topBar()}
    </motion.div>
  )}
</AnimatePresence>

{/* Editor / Skeleton with fade */}
<div className="mx-2 md:w-page mb-12 mx-auto bg-white rounded-lg p-4 shadow-sm">
  <ErrorBoundary>
    <AnimatePresence mode="wait">
      {/* <div className="mx-2 md:w-page mb-12 mx-auto bg-white rounded-lg p-4 shadow-sm relative"> */}
  <ErrorBoundary>
    {/* EditorDiv always present */}
    <motion.div
      key="editor"
      initial={{ opacity: 0 }}
      animate={{ opacity: pending ? 0 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <EditorDiv handleChange={handleChange} parameters={parameters} type={pageType} createPageAction={createPageAction} />
    </motion.div>

    {/* Skeleton overlays EditorDiv while pending */}
    {pending && (
      <motion.div
        key="skeleton"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 skeleton bg-slate-100 rounded-lg animate-pulse"
      />
    )}
  </ErrorBoundary>
{/* </div> */}
    </AnimatePresence>
  </ErrorBoundary>
</div>

  </IonContent>
</EditorContext.Provider>

}