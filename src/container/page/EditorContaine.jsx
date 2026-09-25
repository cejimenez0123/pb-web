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
import { setEditingPage, setHtmlContent, setPageInView, removeFromPaginatedKey, setPageType, } from "../../actions/PageActions.jsx";
import checkResult from "../../core/checkResult";
import debounce from "../../core/debounce.js";
import Context from "../../context";
import { useAlert } from "../../core/useAlert.jsx";
import AlertType from "../../core/AlertType.js";
import EditorContext from "./EditorContext";
import HashtagForm from "../../components/hashtag/HashtagForm";
import FeedbackDialog from "../../components/page/FeedbackDialog";
import { useDialog } from "../../domain/usecases/useDialog.jsx";
import EditorDiv from "../../components/page/EditorDiv.jsx";
import { motion, AnimatePresence } from "framer-motion";
import Enviroment from "../../core/Enviroment.js";
import { Preferences } from "@capacitor/preferences";
import axios from "axios";
import TopBarDropdown from "../../components/page/TopBarDropdown.jsx";
import EditorFooter from "../../components/page/EditorFooter.jsx";
import getBackground from "../../core/getbackground.jsx";

const CONTAINER = "mx-auto w-full max-w-3xl p-4 md:p-6 bg-base-bg rounded-lg shadow-sm";

export default function EditorContainer({ presentingElement }) {
  const router = useIonRouter();
  const { id, type: paramType } = useParams();
  const dispatch = useDispatch();

  const currentProfile = useSelector((state) => state.users.currentProfile);
  const { editPage, pageInView, pageType: sliceType } = useSelector((state) => state.pages);
  // let type =
  let type=   paramType || sliceType;
    if(type=="text"){
      type = PageType.text
    }
  const { showAlert } = useAlert();
  const [files, setFiles] = useState([]);
  const isNative = Capacitor.isNativePlatform();
  const htmlContent = useSelector(state => state.pages.editorHtmlContent);
  const hasInitialized = useRef(false);
  const isMediaType = type === PageType.picture || type === PageType.link;

  const [parameters, setParameters] = useState({
    isPrivate: true,
    data: "",
    title: "",
    id: id || null,
    needsFeedback: false,
    status: "draft",
    description: "",
    commentable: true,
    authorId: currentProfile?.id,
    profile: currentProfile,
    profileId: currentProfile?.id ?? "",
    type: type,
  });

  const effectiveId = parameters.id || id;
  const [openHashtag, setOpenHashtag] = useState(false);
  const { openDialog, closeDialog, resetDialog } = useDialog();
  const { isPhone } = useContext(Context);
  const [isSaved, setIsSaved] = useState(false);
  const lastSavedRef = useRef(null);
  const hasLoaded = useRef(false);
  const hasCreated = useRef(false); // ← tracks if text story has been created this session

  const debouncedSave = useRef(
    debounce((payload) => {
      dispatch(updateStory(payload)).then(res =>
        checkResult(res,
          (data) =>{
         

         setIsSaved(true)
     

         
          },
          (err) => { showAlert({ message: err.message, type: AlertType.error }); }
        )
      );
    }, 500)
  ).current;

  useEffect(() => {
    setParameters((prev) => ({
      ...prev,
      id: id ?? prev.id ?? null,
      type,
      authorId: currentProfile?.id,
      profile: currentProfile,
      profileId: currentProfile?.id || "",
    }));
  }, [type, id, currentProfile]);

  // Clear state on new story
  useEffect(() => {
    if (!id || id === "new") {
      dispatch(setEditingPage({ page: null }));
      dispatch(setPageInView({ page: null }));
      dispatch(setHtmlContent(""));
      setParameters(prev => ({ ...prev, id: null, data: "" }));
      hasCreated.current = false;
    }
  }, []);

  // Clear data when navigating to a new type without an id
  useEffect(() => {
    if (!id && type) {
      dispatch(setPageInView({ page: null }));
      dispatch(setHtmlContent(""));
      setParameters(prev => ({ ...prev, data: "", type }));
      hasCreated.current = false;
    }
  }, [type]);

  // Sync type into parameters
  useEffect(() => {
    setParameters(prev => prev.type === type ? prev : { ...prev, type });
  }, [type]);

  useEffect(() => {
    closeDialog();
    if (!hasInitialized.current) {
      hasInitialized.current = true;
    }
  }, []);

useEffect(() => {
  if (!id || id === "new") return;
  if (pageInView?.id === id) {
    // already in slice — no fetch needed
    setStory(pageInView);
    return;
  }
  fetchStory();
}, [id]);

  // ── Text autosave: create on first content, then debounce updates ──
  useEffect(() => {
    if (isMediaType && !id) return;
    if (!currentProfile?.id) return;
    if (!parameters.data?.trim() && !parameters.title?.trim()) return;

    const resolvedId = parameters.id || id;

    if (!resolvedId || resolvedId === "new") {
      // First content entered — create the story
      if (hasCreated.current) return;
      hasCreated.current = true;
      saveStory(parameters);
      return;
    }

    // Already exists — debounce update
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      return;
    }

    const payload = {
      ...parameters,
      id: resolvedId,
      profileId: currentProfile?.id,
    };

    const isSame = JSON.stringify(payload) === JSON.stringify(lastSavedRef.current);
    if (isSame) return;
    lastSavedRef.current = payload;
    setIsSaved(false);
    debouncedSave({ ...payload })


  }, [parameters.data, parameters.title, parameters.status, parameters.isPrivate, parameters.commentable, parameters.id]);

  const createPageAction = async (data) => {
    setIsSaved(false);
    await saveStory({ data });
    setIsSaved(true);
  };

  const setStory = (story) => {
    dispatch(setHtmlContent(story?.data));
    dispatch(setPageInView({ page: story }));
    dispatch(setPageType({ type: story?.type ?? type ?? PageType.text }));
    setParameters((prev) => ({
      ...prev,
      id: id,
      data: story.data,
      commentable: story?.commentable ?? false,
      page: story,
      isPrivate: story?.isPrivate ?? true,
      title: story?.title ?? "Untitled",
      type: story?.type ?? type ?? PageType.text,
    }));
    hasCreated.current = true;
  };

  const fetchStory = () => {
    if (!id) return;
    dispatch(getStory({ id })).then((res) =>
      checkResult(res,
        (payload) => { setStory(payload.story); },
        (err) => showAlert({ message: err.message, type: AlertType.error })
      )
    );
  };

  const saveStory = async (incoming) => {
    if (!currentProfile?.id) return;
  
    const payload = {
      ...parameters,
      ...incoming,
      profileId: currentProfile?.id,
      type: type
    };

    const resolvedId = payload.id || id;
    const shouldCreate = !resolvedId || resolvedId === "new";

    if (shouldCreate) {
      const res = await dispatch(createStory(payload));
      return checkResult(res, (data) => {
        const story = data.story;
        setIsSaved(true);
        dispatch(setEditingPage({ page: story }));
        dispatch(setPageInView({ page: story }));
        dispatch(setHtmlContent(story.data));
        setParameters((prev) => ({ ...prev, id: story.id }));
        window.history.replaceState(null, "", Paths.editPage.createRoute(story.id, story.type));
      }, (err) => showAlert({ message: err.message, type: AlertType.error }));
    }

    const res = await dispatch(updateStory({ ...payload, id: resolvedId }));
    return checkResult(res,
      (data) => {
  
        setIsSaved(true)},
      (err) => { setIsSaved(false); showAlert({ message: err.message, type: AlertType.error }); }
    );
  };

  const driveTokenKey = "googledrivetoken";
  const TOKEN_EXPIRY_KEY = "googledrivetoken_expiry";
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    try { fetchFiles(); } catch (err) { 

      
    }
  }, [accessToken]);

  const fetchFiles = async () => {
    const token = (await Preferences.get({ key: driveTokenKey })).value;
    try {
      if (!token) return;
      fetch('https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.document"&fields=files(id,name,mimeType,iconLink)', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      })
        .then(res => {
          if (res.status === 401) throw new Error('Unauthorized');
          return res.json();
        })
        .then(data => setFiles(data.files || []))
        .catch(err => { console.error('Google Drive API error:', err); setAccessToken(null); });
    } catch (err) {
      console.error("Error in fetchFiles:", err);
      setAccessToken(null);
    }
  };

  const onFilePicked = async (file) => {
    try {
      if (!file?.id || !accessToken) return;
      const url = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/html`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'text'
      });
      debouncedSave({ ...parameters, data: response.data, status: "draft", id: effectiveId, needsFeedback: true, type: PageType.text });
    } catch (error) {
      console.error("Error fetching Google Doc:", error);
    }
    resetDialog();
  };

  const openGoogleDrive = async () => {
    const accessToken = (await Preferences.get({ key: driveTokenKey })).value;
    if (!accessToken) { showAlert({ message: "No Access Token", type: AlertType.error }); return; }
    openDialog({
      title: null,
      text: (
        <div style={{ "--background": Enviroment.palette.base.surface }} className="bg-cream p-3 rounded-xl">
          <div className={`overflow-y-auto ${isPhone ? "grid grid-cols-2 gap-3" : "grid grid-cols-3 gap-4"}`} style={{ maxHeight: "70vh", padding: "0.5rem" }}>
            {files.map((file) => (
              <button key={file.id} onClick={() => onFilePicked(file)}
                className="flex flex-col justify-center items-center px-3 py-3 bg-base-bg rounded-xl shadow-md border border-blueSea border-opacity-20 hover:border-blueSea hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-150"
              >
                <img src={file.iconLink} alt="file icon" className="w-10 h-10 mb-2 rounded" />
                <span className="text-center text-sm text-emerald-800 w-full break-words">{file.name}</span>
              </button>
            ))}
          </div>
        </div>
      ),
    });
  };

  const handleView = () => router.push(Paths.page.createRoute(effectiveId));

  const handleChange = (key, value) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePostPublic = (desc) => {
    const payload = { ...parameters, id: effectiveId, description: desc, isPrivate: false, status: "finished", needsFeedback: true };
    dispatch(updateStory(payload)).then(res =>
      
      checkResult(res, (data) => { 
         setIsSaved(true)       
  
        resetDialog(); 
        router.push(Paths.page.createRoute(effectiveId), "forward"); }, (err) => showAlert({ message: err.message, type: AlertType.error }))
    );
  };

  const handleFeedback = (feedbackDesc) => {
    const payload = { ...parameters, id: effectiveId, description: feedbackDesc, status: "workshop", needsFeedback: true };
    dispatch(updateStory(payload)).then(res => {
      resetDialog();
      checkResult(res, (data) => {
        setIsSaved(true)
        router.push(Paths.workshop.createRoute(effectiveId), "forward")}, (err) => showAlert({ message: err.message, type: AlertType.error }));
    });
  };

  const openFeedback = (isFeedback) => {
    openDialog({
      disagree:closeDialog,
      disagreeText: "Close",
      scrollY: false,
      text: (
        <FeedbackDialog
          page={editPage}
          isFeedback={isFeedback}
          handleChange={(e) => handleChange("description", e)}
          handleFeedback={(feedbackDesc) => handleFeedback(feedbackDesc)}
          handlePostPublic={(desc) => handlePostPublic(desc)}
          handleClose={() => closeDialog()}
        />
      ),
    });
  };




  return (
    <EditorContext.Provider
      value={{
        page: editPage,
        parameters,
        setParameters,
      }}
    >
<IonContent
        fullscreen
        className="page-content"
      >

                <EditorDiv
                    page={editPage}
                    isSaved={isSaved}
                    setIsSaved={setIsSaved}
                    handleChange={handleChange}
                    parameters={parameters}
                    type={type}
                    createPageAction={createPageAction}
                  />
        </IonContent>

    </EditorContext.Provider>
  );
}