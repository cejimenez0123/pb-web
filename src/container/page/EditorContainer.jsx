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
import { setEditingPage, setHtmlContent, setPageInView, removeFromPaginatedKey, setPageType } from "../../actions/PageActions.jsx";
import checkResult from "../../core/checkResult";
import debounce from "../../core/debounce.js";
import Context from "../../context";
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
  const { setError } = useContext(Context);
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
          () => setIsSaved(true),
          (err) => { console.log(err); setError(err.message); }
        )
      );
    }, 500)
  ).current;

  // Sync profile/type changes into parameters
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
    if (id) fetchStory();
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
    debouncedSave({ ...payload });
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
        (err) => setError(err.message)
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
      }, (err) => setError(err.message));
    }

    const res = await dispatch(updateStory({ ...payload, id: resolvedId }));
    return checkResult(res,
      () => setIsSaved(true),
      (err) => { setIsSaved(false); setError(err.message); }
    );
  };

  const driveTokenKey = "googledrivetoken";
  const TOKEN_EXPIRY_KEY = "googledrivetoken_expiry";
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    try { fetchFiles(); } catch (err) { console.log(err); }
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
    if (!accessToken) { setError("No Access Token"); return; }
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
      checkResult(res, () => { resetDialog(); router.push(Paths.page.createRoute(effectiveId), "forward"); }, (err) => setError(err.message))
    );
  };

  const handleFeedback = (feedbackDesc) => {
    const payload = { ...parameters, id: effectiveId, description: feedbackDesc, status: "workshop", needsFeedback: true };
    dispatch(updateStory(payload)).then(res => {
      resetDialog();
      checkResult(res, () => router.push(Paths.workshop.createRoute(effectiveId), "forward"), (err) => setError(err.message));
    });
  };

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
          handleFeedback={(feedbackDesc) => handleFeedback(feedbackDesc)}
          handlePostPublic={(desc) => handlePostPublic(desc)}
          handleClose={() => closeDialog()}
        />
      ),
    });
  };

  const handleDelete = () => {
    dispatch(deleteStory(parameters)).then(() => {
      dispatch(removeFromPaginatedKey({ key: "stories", id: parameters.id }));
      router.push(Paths.home, "root");
      closeDialog();
    });
  };

  const openConfirmDeleteDialog = () => {
    openDialog({
      title: "Are you sure you want to delete this page?",
      text: `${parameters?.title}`,
      onClose: () => closeDialog(),
      agreeText: "Delete",
      agree: () => handleDelete(),
      disagreeText: "Close",
      disagree: () => closeDialog(),
    });
  };

  const STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "fragment", label: "Fragment" },
    { value: "workshop", label: "Workshop" },
    { value: "finished", label: "Published" },
  ];

  return (
    <EditorContext.Provider value={{ page: editPage, parameters, setParameters }}>
      <IonContent fullscreen style={{ ...getBackground() }}>
        <div className="bg-cream flex flex-col min-h-[100dvh] overflow-y-auto dark:bg-base-bgDark">
          <AnimatePresence>
            <motion.div key="topbar" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.05 }}>
              <div className="rounded-lg my-1 w-full max-w-3xl dark:bg-base-bgDark bg-cream min-h-[100%] mx-auto p-2 bg-emerald-50 border border-emerald-200 flex flex-col gap-1">
                <div className="flex flex-row gap-2 items-center w-full">
                  <div className="flex flex-col w-[100%]">
                    <input
                      type="text"
                      className="p-2 flex-grow bg-base-bg dark:text-cream text-emerald-800 text-[1rem] rounded-md border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                      value={parameters.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Untitled"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      {isSaved ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">✅ Saved</span>
                      ) : (
                        <span className="text-yellow-600 font-semibold flex items-center gap-1">💾 Saving...</span>
                      )}
                      <VisibilityBadge isPrivate={parameters.isPrivate} toggle={() => handleChange("isPrivate", !parameters.isPrivate)} />
                      {effectiveId && effectiveId !== "new" && (
                        <button onClick={handleView} className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-xs font-medium bg-transparent border border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                          Preview
                        </button>
                      )}
                    </div>
                  </div>
                  <TopBarDropdown
                    router={router} id={id} handleView={handleView} editPage={pageInView}
                    handleChange={handleChange} openFeedback={openFeedback} parameters={parameters}
                    openGoogleDrive={openGoogleDrive} setOpenHashtag={setOpenHashtag}
                    openHashtag={openHashtag} openConfirmDeleteDialog={openConfirmDeleteDialog}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            <motion.div key="editor" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.05 }}>
              <div className={CONTAINER}>
                <div className="flex gap-1 bg-gray-100 justify-around dark:bg-base-surfaceDark p-1 rounded-full w-fit">
                  {STATUS_OPTIONS.map((option) => {
                    const isActive = parameters.status === option.value;
                    return (
                      <button key={option.value} onClick={() => handleChange("status", option.value)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-150 ${isActive ? "bg-soft text-white shadow-sm" : "text-soft dark:text-cream dark:bg-base-bgDark bg-base-bg"}`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                <EditorDiv page={editPage} isSaved={isSaved} setIsSaved={setIsSaved} handleChange={handleChange} parameters={parameters} type={type} createPageAction={createPageAction} />
              </div>
            </motion.div>
            <div className="pt-8 px-4 bg-cream dark:bg-base-bgDark">
              <EditorFooter pageInView={pageInView} effectiveId={effectiveId} openConfirmDeleteDialog={openConfirmDeleteDialog} />
            </div>
          </AnimatePresence>
        </div>
      </IonContent>
    </EditorContext.Provider>
  );
}

function VisibilityBadge({ isPrivate, toggle }) {
  const base = "flex items-center gap-1 px-2 py-[2px] rounded-full text-xs font-semibold transition";
  if (isPrivate) {
    return <span onClick={toggle} className={`${base} bg-gray-100 text-gray-600`}>🔒 Private</span>;
  }
  return <span onClick={toggle} className={`${base} bg-emerald-100 text-emerald-700`}>🌍 Public</span>;
}

