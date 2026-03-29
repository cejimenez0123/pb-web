


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
import PicturePageForm from "../../components/page/PicturePageForm.jsx";
import EditorDiv from "../../components/page/EditorDiv.jsx";
export default function EditorContainer({ presentingElement }) {
  const { id, type } = useParams();
  const dispatch = useDispatch();
  const router = useIonRouter();
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const editPage = useSelector((state) => state.pages.editingPage);
  const htmlContent = useSelector((state) => state.pages.editorHtmlContent);
  const { setError, setSuccess, setIsSaved } = useContext(Context);

  const isNative = Capacitor.isNativePlatform();
  const hasInitialized = useRef(false);
  const [pending, setPending] = useState(false);
  const [openHashtag, setOpenHashtag] = useState(false);
  const { openDialog, closeDialog, dialog, resetDialog } = useDialog();
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
    dispatch(setHtmlContent({ html: story.data }));
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
const createPageAction = () => {
  if (!currentProfile?.id) return;
const payload = {
  title: parameters.title,
  data: parameters.data,
  description: parameters.description,
  needsFeedback: parameters.needsFeedback,
  isPrivate: parameters.isPrivate,
  commentable: parameters.commentable,
  type: type || parameters.type, // ✅ explicitly keep original type
  profileId: currentProfile.id,
};

  dispatch(createStory(payload)).then((res) =>
    checkResult(res, ({ story }) => {
      dispatch(setEditingPage({ page: story }));
      setStory(story);
      handleChange("isSaved",true)
      router.push(Paths.editPage.createRoute(story.id));
    }, (err) => setError(err.message))
  );
};


  const handleChange = (key, value) => setParameters((prev) => ({ ...prev, [key]: value }));

  // ------------------ Top Bar ------------------
  const topBar = () => (
    <div className="rounded-lg w-full sm:max-w-[50em] mx-auto p-2 bg-emerald-50 border border-emerald-200">
      <div className="flex flex-row  gap-2 items-start sm:items-center">
        {/* Title Input */}
        <input
          type="text"
          className="p-2 w-full sm:w-[100%] text-emerald-800 text-[1rem] bg-white rounded-md border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
          value={parameters.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Untitled"
        />


        {/* Menu Dropdown */}
        <div className="dropdown dropdown-bottom dropdown-end">
  <div tabIndex={0} role="button" className=" rounded-md ">
    <img
      className="w-[100%] h-[2.8rem] rounded-lg  mx-auto"
      src={menu}
   style={{backgroundColor:"#40906f",}}
    />
  </div>
  <ul
    tabIndex={0}
    className="dropdown-content menu bg-white rounded-box shadow-lg z-[10] p-2"
    style={{ minWidth: "12rem" }} // optional: make dropdown wider like old
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
        
      </div>

      {openHashtag && <HashtagForm item={parameters.page} type="story" />}
    </div>
  );


  const openFeedback = (isFeedback) => {
    openDialog({
      ...dialog,
      disagree: null,
      agree: () => resetDialog(),
      disagreeText: null,
      scrollY: false,
      text: (
        <FeedbackDialog
          page={editPage}
          isFeedback={isFeedback}
          handleChange={(e) => handleChange("description", e)}
          handleFeedback={(feedbackDesc) => {
            resetDialog();
            console.log("Feedback item:", item);
            // const params = { ...item, description: parameters.description, type:item.type, page: item, id: item.id, needsFeedback: true };
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
      router.push(Paths.myProfile, "root");
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

  // ------------------ Render ------------------
  return (
    <EditorContext.Provider value={{ page: editPage, parameters, setParameters }}>
      <IonContent
        fullscreen
        scrollY
        style={{ "--background": "#f4f4e0", "--padding-bottom": "30em", "--padding-top": isNative ? "0.3rem" : "6em" }}
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