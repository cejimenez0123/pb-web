


import "../../styles/Editor.css";
import "../../App.css";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router";
import { IonContent, useIonRouter, IonImg } from "@ionic/react";
import { Capacitor } from "@capacitor/core";
// import EditorDiv from "../../components/page/EditorDiv.jsx"
import Paths from "../../core/paths";
import { PageType } from "../../core/constants";
import { createStory, deleteStory, getStory, updateStory } from "../../actions/StoryActions";
import { setEditingPage, setHtmlContent, setPageInView } from "../../actions/PageActions.jsx";
import checkResult from "../../core/checkResult";
import debounce from "../../core/debounce.js";
import RichEditor from "../../components/page/RichEditor.jsx"
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
     const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
  const IOS_CLIENT_ID = import.meta.env.VITE_IOS_CLIENT_ID;
export default function EditorContainer({ presentingElement }) {
  const { id, type } = useParams();
  const dispatch = useDispatch();
  const router = useIonRouter();
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const editPage = useSelector((state) => state.pages.editingPage);
  const htmlContent = useSelector((state) => state.pages.editorHtmlContent);
  const { setError, setSuccess, setIsSaved } = useContext(Context);
  const [files,setFiles]=useState([])
  const isNative = Capacitor.isNativePlatform();
  const hasInitialized = useRef(false);
  const [pending, setPending] = useState(false);
  const [openHashtag, setOpenHashtag] = useState(false);
  const { openDialog, closeDialog, dialog, resetDialog } = useDialog();
    const { isPhone } = useContext(Context);
  const [parameters, setParameters] = useState({
    isPrivate: true,
    data: "",
    title: "",
    isSaved:false,
    needsFeedback: false,
    description: "",
    commentable: true,
    profile: currentProfile,
    profileId: currentProfile ? currentProfile.id : "",
    type: type || PageType.text,
  });

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
  }, [currentProfile, id]);


  useEffect(() => {
  if (!editPage?.id) return;
  
  if (currentProfile?.id && notText) {

    setIsSaved(false);
     handleChange("isSaved",false)
    debounce(() => {
      dispatch(updateStory({ ...parameters,type:editPage.type, profileId: currentProfile.id, id: editPage.id }))
        .then((res) =>
          checkResult(res, () => {setIsSaved(true)
            handleChange("isSaved",true)
          }, (err) => setError(err.message))
        );
    }, 100)();
  }
}, [parameters.data, parameters.title, parameters.isPrivate, parameters.commentable, parameters.description, parameters.needsFeedback]);

  const setStory = (story) => {
    dispatch(setHtmlContent({ html: story?.data }));
    dispatch(setEditingPage({ page: story }));
    dispatch(setPageInView({ page: story }));
    setParameters((prev) => ({
      ...prev,
      commentable: story.commentable,
      page: story,
      isPrivate: story.isPrivate,
      data: story.data,
      title: story.title,
      type: story.type,
    }));
    setPending(false);
  };

  const fetchStory = () => {
    setPending(true);
    if (!id) return;
    handleChange("isSaved",false)
    dispatch(getStory({ id })).then((res) =>
      checkResult(
        res,
        (payload) => {
          handleChange("isSaved",true)
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
  const createPageAction = (dataOverride) => {
  const dataToUse = dataOverride || parameters.data; // <- always take the latest local value
  if (!currentProfile?.id) return;

  const payload = {
    title: parameters.title,
    data: dataToUse, // use local state
    description: parameters.description,
    needsFeedback: parameters.needsFeedback,
    isPrivate: parameters.isPrivate,
    commentable: parameters.commentable,
    type: type || parameters.type,
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


  const handleChange = (key, value) => setParameters((prev) => ({ ...prev, [key]: value }));

function TopBarDropdown({
  id,
  editPage,
  openFeedback,
  parameters,
  setOpenHashtag,
  openHashtag,
  openGoogleDrive,
  openRoleFormDialog,
  openConfirmDeleteDialog,
}) {
  const router = useIonRouter();

  return (
    <div className="dropdown dropdown-bottom dropdown-end flex-shrink-0">
      <div tabIndex={0} role="button" className="rounded-md">
        <img
          className="w-[2.8rem] h-[2.8rem] rounded-lg"
          src={menu}
          style={{ backgroundColor: "#40906f" }}
        />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-white rounded-box shadow-lg z-[10] p-2"
        style={{ minWidth: "12rem" }}
      >
        <li
          className="text-emerald-600 pt-3 pb-2 cursor-pointer"
          onClick={() => router.push(Paths.addStoryToCollection.story(id))}
        >
          Add to Collection
        </li>

        <li
          className="text-emerald-600 pt-3 pb-2 cursor-pointer"
          onClick={() => openFeedback(true)}
        >
          Get Feedback
        </li>
  <li
          className="text-emerald-600 pt-3 pb-2 cursor-pointer"
          onClick={() => openGoogleDrive()}
        >
          Google Doc Import
        </li>
        {editPage && (
          <li
            className="text-emerald-600 pt-3 pb-2 cursor-pointer"
            onClick={() => router.push(Paths.page.createRoute(editPage.id))}
          >
            View
          </li>
        )}

        {editPage && editPage.id ? (
          parameters.isPrivate ? (
            <li
              className="text-emerald-600 pt-3 pb-2 cursor-pointer"
              onClick={() => openFeedback(false)}
            >
              Share Now
            </li>
          ) : (
            <li
              className="text-emerald-600 pt-3 pb-2 cursor-pointer"
              onClick={() => handleChange("isPrivate", true)}
            >
              Make Private
            </li>
          )
        ) : null}

        <li
          className="text-emerald-600 pt-3 pb-2 cursor-pointer"
          onClick={() => setOpenHashtag(!openHashtag)}
        >
          {openHashtag ? "Close Hashtag" : "Add Hashtag"}
        </li>

        {editPage && (
          <li
            className="text-emerald-600 pt-3 pb-2 cursor-pointer"
            onClick={() => openRoleFormDialog(parameters.page)}
          >
            Manage Access
          </li>
        )}

        <li
          className="text-emerald-600 pt-3 pb-2 cursor-pointer"
          onClick={openConfirmDeleteDialog}
        >
          Delete
        </li>
      </ul>
    </div>
  );
}
 const driveTokenKey = "googledrivetoken";
   const TOKEN_EXPIRY_KEY = "googledrivetoken_expiry"; // 
const [accessToken,setAccessToken]=useState(null)
  async function checkAccessToken() {
    const token = (await Preferences.get({ key: driveTokenKey })).value;
    const tokenExpiry = (await Preferences.get({ key: TOKEN_EXPIRY_KEY })).value;
    const tokenValid = token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10);
console.log("ACCESS TOKEN",accessToken)
    if(tokenValid){
      setAccessToken(token);
    }else{
      setAccessToken(null)
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
  
      dispatch(updateStory(
        { ...parameters,data:htmlContent,description:feedbackDesc,status:"draft", id: editPage.id,needsFeedback:true, type: PageType.text}
      )).then(res => checkResult(res, ({ story }) => {
    setStory(story)
      
                      handleChange("isSaved",true)
              
  
      }, err => setErrorLocal(err.message)));
    } catch (error) {
      console.error("Error fetching Google Doc:", error);
      setErrorLocal(error.message);
    }
  };
  const nativeGoogleSignIn = async () => {
    try {
     
      const user = await SocialLogin.login({
        provider:"google",
        options:{
          scopes:["email","profile", "https://www.googleapis.com/auth/drive.readonly"]
        }
    
        
        
      }).catch((err) => console.error("SocialLogin error:", err));
     
      if (!user?.result) throw new Error("No user data returned.")
      const { accessToken } = user.result;
      const expiry = Date.now() + 3600 * 1000;

      setAccessToken(accessToken.token);
     await Preferences.set({key:driveTokenKey,value:accessToken.token})
  await Preferences.set({key:TOKEN_EXPIRY_KEY,value:expiry})
  fetchFiles()
    } catch (err) {
      console.log(err)
      console.error("Native sign-in error", err);
   
    } 
  };

const openGoogleDrive = async()=>{
   if(!accessToken){
    nativeGoogleSignIn()
    return
   }

  openDialog({
    title: null,
    text: (
      <div
        style={{ "--background": Enviroment.palette.base.surface}}
        className="bg-cream"
      >
       
        <div
          className={`overflow-y-auto ${isPhone ? "grid grid-cols-2 gap-2" : "grid gap-2"}`}
          style={{ maxHeight: "70vh" }} // limits height so content scrolls
        >
          {files.map(file => (
            <div
              key={file.id}
              className="px-2 py-2 flex border w-[100%] rounded-box shadow-sm border-blueSea border-opacity-20 hover:border-blueSea "
              onClick={() => onFilePicked(file)}
            >
              {/* <div className="te  p-2 "> */}
                <h5 className="mx-auto p-2 my-auto text-center bg-cream text-sm">
                  {file.name}
                </h5>
          
            </div>
          ))}
        </div>
      </div>
    ),
    // breakpoint: 1,
    // disagreeText: "Close",
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
        id={id}
        editPage={editPage}
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
      // ...dialog, 
      disagree: null,
      // agree: () => resetDialog(),
      disagreeText: null,
      scrollY: false,
      text: (
        <FeedbackDialog
          page={editPage}
          isFeedback={isFeedback}
          handleChange={(e) => handleChange("description", e)}
          handleFeedback={(feedbackDesc) => {
            resetDialog();
            dispatch(updateStory({ ...parameters,description:feedbackDesc,status:"workshop", id: editPage.id,needsFeedback:true, type: editPage.type || parameters.type })).then((res) =>
              checkResult(res, (payload) => {
                      handleChange("isSaved",true)
                if (payload.story) router.push(Paths.workshop.createRoute(payload.story.id, "foward"));
              })
            );
          }}
          handlePostPublic={() => {
            handleChange("isPrivate", false);
       
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
    dispatch(setHtmlContent({ html: "" })); // clear editor content
    handleChange("data", "");
    handleChange("isSaved", false);
  }
  
}, [type]);
useEffect(()=>{ 
  // useLayoutEffect(() => {

      SocialLogin.initialize({
        google: {
          webClientId: CLIENT_ID,
            iOSClientId: IOS_CLIENT_ID,
            iOSServerClientId: CLIENT_ID,
          mode: 'online',
        },
      }).catch(err => console.error('SocialLogin init error:', err));
    
  checkAccessToken()},[])
  // ------------------ Render ------------------
  return (
    <EditorContext.Provider value={{ page: editPage, parameters, setParameters }}>
      <IonContent
        fullscreen
        scrollY
        style={{ "--background": Enviroment.palette.cream, "--padding-bottom": "30em", "--padding-top": isNative ? "0.3rem" : "6em" }}
        className="ion-padding"
      >
        <div className="mx-auto md:p-8">
          {pending ? (
            <div className="skeleton rounded-lg w-full h-fit sm:max-w-[50em] mx-auto" />
          ) : (
            topBar()
          )}

          <div className="mx-2 md:w-page mb-12 mx-auto bg-white rounded-lg p-4 shadow-sm">
            <ErrorBoundary>
              {pending ? <div className="skeleton mx-auto bg-slate-100 max-w-[96vw] h-page" /> : <EditorDiv handleChange={handleChange} createPageAction={createPageAction}/>}
            </ErrorBoundary>
          </div>
        </div>
      </IonContent>
    </EditorContext.Provider>
  );
}