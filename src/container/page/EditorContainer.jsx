import "../../styles/Editor.css";
import "../../App.css";

import { useDispatch, useSelector } from "react-redux";
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router";
import { IonContent, useIonRouter } from "@ionic/react";
import { Preferences } from "@capacitor/preferences";
import axios from "axios";

import Paths from "../../core/paths";
import { PageType } from "../../core/constants";

import {
  createStory,
  deleteStory,
  getStory,
  updateStory,
} from "../../actions/StoryActions";

import {
  removeFromPaginatedKey,
  setEditingPage,
  setHtmlContent,
  setPageInView,
  setPageType,
} from "../../actions/PageActions.jsx";

import checkResult from "../../core/checkResult";
import debounce from "../../core/debounce.js";
import Context from "../../context";
import { useAlert } from "../../core/useAlert.jsx";
import AlertType from "../../core/AlertType.js";

import EditorContext from "./EditorContext";
import FeedbackDialog from "../../components/page/FeedbackDialog";
import { useDialog } from "../../domain/usecases/useDialog.jsx";
import EditorDiv from "../../components/page/EditorDiv.jsx";
import TopBarDropdown from "../../components/page/TopBarDropdown.jsx";
import EditorFooter from "../../components/page/EditorFooter.jsx";

import Enviroment from "../../core/Enviroment.js";

const CONTAINER =
  "mx-auto w-full max-w-3xl rounded-lg bg-base-bg p-4 shadow-sm md:p-6";

const DRIVE_TOKEN_KEY = "googledrivetoken";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "fragment", label: "Fragment" },
  { value: "workshop", label: "Workshop" },
  { value: "finished", label: "Published" },
];

function normalizeType(value) {
  if (value === "text") {
    return PageType.text;
  }

  return value || PageType.text;
}

function createEmptyParameters({
  routeId,
  type,
  currentProfile,
}) {
  return {
    id:
      routeId && routeId !== "new"
        ? routeId
        : null,
    data: "",
    title: "",
    description: "",
    status: "draft",
    isPrivate: true,
    commentable: true,
    needsFeedback: false,
    type,
    authorId: currentProfile?.id ?? null,
    profileId: currentProfile?.id ?? "",
    profile: currentProfile ?? null,
    page: null,
  };
}

export default function EditorContainer() {
  const dispatch = useDispatch();
  const router = useIonRouter();

  const {
    id: routeId,
    type: paramType,
  } = useParams();

  const { showAlert } = useAlert();
  const { isPhone } = useContext(Context);

  const {
    openDialog,
    closeDialog,
    resetDialog,
  } = useDialog();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const {
    editPage,
    pageInView,
    pageType: sliceType,
  } = useSelector((state) => state.pages);
  const story = editPage || pageInView || {};
   const storyData = editPage?.data || pageInView?.data || "";
const pageInViewId = pageInView?.id;
  const type = normalizeType(paramType || sliceType);

  const isNewStory =
    !routeId || routeId === "new";

  const isMediaType =
    type === PageType.picture ||
    type === PageType.link;

  const [parameters, setParameters] = useState(() =>
    createEmptyParameters({
      routeId,
      type,
      currentProfile,
    })
  );

  const [files, setFiles] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [isSaved, setIsSaved] = useState(true);
  const [openHashtag, setOpenHashtag] = useState(false);
const hasCreatedRef = useRef(false);
const hasLoadedRef = useRef(false);
const lastSavedRef = useRef(null);
const activeRequestIdRef = useRef(null);
const debouncedSaveRef = useRef(null);

const isDeletedRef = useRef(false);
//  const storyType = normalizeType(
//       story.type || type
//     );
   
// const loadedPayload = {
//   id: pageInViewId,
//   data: storyData,
//   title: story.title || "",
//   description: story.description || "",
//   status: story.status || "draft",
//   isPrivate: story.isPrivate ?? true,
//   commentable: story.commentable ?? true,
//   needsFeedback: story.needsFeedback ?? false,
//   type: storyType,
// };

// lastSavedRef.current = loadedPayload;

// setParameters((previous) => ({
//   ...previous,
//   ...loadedPayload,
//   profile: previous.profile,
//   page: story,
// }));

// setIsSaved(true);
//   const setStory = useCallback(
//   (story) => {
//     if (!story?.id) return;

//     /*
//      * Never re-apply the same story to the editor.
//      */
//     if (
//       hasLoadedRef.current &&
//       parametersRef.current.id === story.id
//     ) {
//       return;
//     }

   



//     /*
//      * Mark these BEFORE dispatching.
//      *
//      * Redux dispatches are synchronous, so this prevents
//      * another part of the lifecycle from seeing the editor
//      * as unloaded while these actions are being dispatched.
//      */
//     hasCreatedRef.current = true;
//     hasLoadedRef.current = true;
//     activeRequestIdRef.current = story.id;

//     /*
//      * Keep the Redux mirrors synchronized ONCE.
//      */
//     dispatch(
//       setEditingPage({
//         page: story,
//       })
//     );

//     dispatch(
//       setPageInView({
//         page: story,
//       })
//     );

//     dispatch(
//       setPageType({
//         type: storyType,
//       })
//     );

//     dispatch(
//       setHtmlContent(storyData)
//     );

//     /*
//      * Then populate the editor's local state.
//      */
//     setParameters((previous) => ({
//       ...previous,
//       id: story.id,
//       data: storyData,
//       title: story.title || "",
//       description: story.description || "",
//       status: story.status || "draft",
//       isPrivate:
//         story.isPrivate ?? true,
//       commentable:
//         story.commentable ?? true,
//       needsFeedback:
//         story.needsFeedback ?? false,
//       type: storyType,
//       page: story,
//     }));

//     setIsSaved(true);
//   },
//   [dispatch, type]
// );

// const isDeletedRef = useRef(false);

const setStory = useCallback(
  (story) => {
    if (!story?.id) return;

    if (
      hasLoadedRef.current &&
      parametersRef.current.id === story.id
    ) {
      return;
    }

    const storyType = normalizeType(story.type || type);
    const storyData = story.data || "";

    hasCreatedRef.current = true;
    hasLoadedRef.current = true;
    activeRequestIdRef.current = story.id;

    const loadedPayload = {
      id: story.id,
      data: storyData,
      title: story.title || "",
      description: story.description || "",
      status: story.status || "draft",
      isPrivate: story.isPrivate ?? true,
      commentable: story.commentable ?? true,
      needsFeedback: story.needsFeedback ?? false,
      type: storyType,
    };

    lastSavedRef.current = loadedPayload;

    dispatch(
      setEditingPage({
        page: story,
      })
    );

    dispatch(
      setPageInView({
        page: story,
      })
    );

    dispatch(
      setPageType({
        type: storyType,
      })
    );

    dispatch(setHtmlContent(storyData));

    setParameters((previous) => ({
      ...previous,
      ...loadedPayload,
      page: story,
    }));

    setIsSaved(true);
  },
  [dispatch, type]
);

const parametersRef = useRef(parameters);

useEffect(() => {
  parametersRef.current = parameters;
}, [parameters]);

  const effectiveId =
    parameters.id || routeId;

  const showError = useCallback(
    (error) => {
      showAlert({
        message:
          error?.message ||
          "Something went wrong.",
        type: AlertType.error,
      });
    },
    [showAlert]
  );

  const handleChange = useCallback(
    (key, value) => {
      setParameters((previous) => ({
        ...previous,
        [key]: value,
      }));
    },
    []
  );

  /*
   * One debounced update pipeline.
   *
   * This does not interact with editor DOM content. It only persists
   * a fully resolved story payload.
   */
  useEffect(() => {
  const debouncedSave = debounce(
    async (payload) => {
      if (isDeletedRef.current) return;
      if (!payload?.id || payload.id === "new") return;

      // isSavingRef.current = true;

      try {
        const result = await dispatch(
          updateStory(payload)
        );

        checkResult(
          result,
          () => {
            setIsSaved(true);
          },
          (error) => {
            setIsSaved(false);
            showError(error);
          }
        );
      } finally {
        // isSavingRef.current = false;
      }
    },
    750
  );

  debouncedSaveRef.current =
    debouncedSave;

  return () => {
    if (
      typeof debouncedSave.cancel ===
      "function"
    ) {
      debouncedSave.cancel();
    }
  };
}, [dispatch, showError]);
  /*
   * Close any open dialog once when the editor first mounts.
   */

  /*
   * Reset all state for a new story.
   *
   * This is intentionally based on route identity, not on animations,
   * component keys, or a Framer Motion lifecycle.
   */
  useEffect(() => {
    if (!isNewStory) return;

    hasCreatedRef.current = false;
    hasLoadedRef.current = false;
    lastSavedRef.current = null;
    activeRequestIdRef.current = null;

    dispatch(setEditingPage({ page: null }));
    dispatch(setPageInView({ page: null }));
    dispatch(setHtmlContent(""));
    dispatch(setPageType({ type }));

    setParameters(
      createEmptyParameters({
        routeId: null,
        type,
        currentProfile,
      })
    );

    setIsSaved(true);
  }, [
    currentProfile,
    dispatch,
    isNewStory,
    type,
  ]);


useEffect(() => {
  const profileId =
    currentProfile?.id ?? null;

  const profileChanged =
    parametersRef.current.authorId !==
      profileId ||
    parametersRef.current.profileId !==
      (profileId ?? "");

  const typeChanged =
    parametersRef.current.type !== type;

  if (!profileChanged && !typeChanged) {
    return;
  }

  setParameters((previous) => ({
    ...previous,
    type,
    authorId: profileId,
    profileId: profileId ?? "",
    profile: currentProfile ?? null,
  }));
}, [currentProfile, type]);
  /*
   * Applies loaded server data to application state.
   *
   * `parameters.data` is the content source EditorDiv should render.
   * Redux editorHtmlContent is updated only as a compatibility mirror for
   * other parts of your application that might still read it.
   */
 


  /*
   * Fetch a story only when a real story ID is in the route.
   *
   * The cancellation flag prevents a delayed response from a previous route
   * from injecting old data into the current editor.
   */
  useEffect(() => {
  if (isNewStory || !routeId) return;

  // Already loaded into this editor.
  if (
    hasLoadedRef.current &&
    parametersRef.current.id === routeId
  ) {
    return;
  }

  // Redux already has this story.
  if (pageInViewId === routeId && pageInView) {
    setStory(pageInView);
    return;
  }

  let cancelled = false;

  activeRequestIdRef.current = routeId;

  dispatch(
    getStory({
      id: routeId,
    })
  ).then((result) => {
    if (cancelled) return;

    if (
      activeRequestIdRef.current !== routeId
    ) {
      return;
    }

    checkResult(
      result,
      (payload) => {
        if (!cancelled && payload?.story) {
          setStory(payload.story);
        }
      },
      (error) => {
        if (!cancelled) {
          showError(error);
        }
      }
    );
  });

  return () => {
    cancelled = true;
  };
}, [
  dispatch,
  isNewStory,
  routeId,
  pageInViewId,
  pageInView,
  setStory,
  showError,
]);

  const saveStory = useCallback(
  async (incoming = {}) => {
    if (!currentProfile?.id) return null;
    if (isDeletedRef.current) return null;

    const currentParameters =
      parametersRef.current;

    const resolvedId =
      incoming.id ??
      currentParameters.id ??
      routeId ??
      null;

    const payload = {
      ...currentParameters,
      ...incoming,
      id: resolvedId,
      type:
        incoming.type ??
        currentParameters.type ??
        type,
      authorId: currentProfile.id,
      profileId: currentProfile.id,
      profile: currentProfile,
    };

    const shouldCreate =
      !resolvedId ||
      resolvedId === "new";

    if (shouldCreate) {
      const result = await dispatch(
        createStory({
          ...payload,
          id: null,
        })
      );

      return checkResult(
        result,
        (response) => {
          const story = response?.story;

          if (!story?.id) {
            hasCreatedRef.current = false;

            showError(
              new Error(
                "The story was created, but no story ID was returned."
              )
            );

            return null;
          }

          hasCreatedRef.current = true;

          setStory(story);

          window.history.replaceState(
            null,
            "",
            Paths.editPage.createRoute(
              story.id,
              story.type
            )
          );

          return story;
        },
        (error) => {
          hasCreatedRef.current = false;
          setIsSaved(false);
          showError(error);

          return null;
        }
      );
    }

    // isSavingRef.current = true;

    try {
      const result = await dispatch(
        updateStory({
          ...payload,
          id: resolvedId,
        })
      );

      return checkResult(
        result,
        (response) => {
          setIsSaved(true);

          return response?.story ?? response;
        },
        (error) => {
          setIsSaved(false);
          showError(error);

          return null;
        }
      );
    } finally {
      // isSavingRef.current = false;
    }
  },
  [
    currentProfile,
    dispatch,
    routeId,
    setStory,
    showError,
    type,
  ]
);
useEffect(() => {
  if (!currentProfile?.id) return;
  if (isDeletedRef.current) return;

  if (isMediaType && isNewStory) return;

  const hasMeaningfulContent =
    Boolean(parameters.data?.trim()) ||
    Boolean(parameters.title?.trim());

  if (!hasMeaningfulContent) return;

  const resolvedId =
    parameters.id || routeId;

  /*
   * ---------------------------------------------------------
   * CREATE
   * ---------------------------------------------------------
   */
  if (!resolvedId || resolvedId === "new") {
    if (hasCreatedRef.current) return;

    hasCreatedRef.current = true;
    setIsSaved(false);

    saveStory();

    return;
  }

  /*
   * Don't autosave the story until its server version
   * has actually been loaded.
   */
  if (!hasLoadedRef.current) return;

  /*
   * Build a fingerprint of the editable story state.
   *
   * Only these values should cause an autosave.
   */
  const payload = {
    id: resolvedId,
    data: parameters.data || "",
    title: parameters.title || "",
    description: parameters.description || "",
    status: parameters.status || "draft",
    isPrivate:
      parameters.isPrivate ?? true,
    commentable:
      parameters.commentable ?? true,
    needsFeedback:
      parameters.needsFeedback ?? false,
    type,
  };

  const currentPayload =
    JSON.stringify(payload);

  const previousPayload =
    JSON.stringify(lastSavedRef.current);

  /*
   * Nothing actually changed.
   */
  if (currentPayload === previousPayload) {
    return;
  }

  /*
   * Don't schedule another save while the exact same
   * payload is already waiting in the debounce.
   */
  lastSavedRef.current = payload;

  setIsSaved(false);

  debouncedSaveRef.current?.({
    ...parametersRef.current,
    ...payload,
    authorId: currentProfile.id,
    profileId: currentProfile.id,
    profile: currentProfile,
  });
}, [
  currentProfile?.id,
  isMediaType,
  isNewStory,
  parameters.data,
  parameters.title,
  parameters.description,
  parameters.status,
  parameters.isPrivate,
  parameters.commentable,
  parameters.needsFeedback,
  parameters.id,
  routeId,
  saveStory,
  type,
]);
  /*
   * This can be passed to EditorDiv when it creates a story itself.
   */
  const createPageAction = useCallback(
    async (data) => {
      if (hasCreatedRef.current) return;

      hasCreatedRef.current = true;
      setIsSaved(false);

      await saveStory({
        data,
      });
    },
    [saveStory]
  );

  const fetchFiles = useCallback(async () => {
    try {
      const { value: token } =
        await Preferences.get({
          key: DRIVE_TOKEN_KEY,
        });

      if (!token) {
        setFiles([]);
        setAccessToken(null);

        return;
      }

      const response = await fetch(
        'https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.document"&fields=files(id,name,mimeType,iconLink)',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.status === 401) {
        throw new Error(
          "Your Google Drive session has expired."
        );
      }

      if (!response.ok) {
        throw new Error(
          "Unable to load Google Drive documents."
        );
      }

      const data = await response.json();

      setFiles(data.files || []);
      setAccessToken(token);
    } catch (error) {
      console.error(
        "Google Drive API error:",
        error
      );

      setFiles([]);
      setAccessToken(null);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  /*
   * Critical behavior:
   * Imported content replaces parameters.data.
   *
   * It is intentionally NOT passed to `debouncedSave` directly, because
   * direct saving bypasses React state and can leave EditorDiv with stale or
   * independently appended content.
   */
  const onFilePicked = useCallback(
    async (file) => {
      try {
        if (!file?.id || !accessToken) return;

        const url =
          "https://www.googleapis.com/drive/v3/files/" +
          `${file.id}/export?mimeType=text/html`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: "text",
        });

        setParameters((previous) => ({
          ...previous,
          data: response.data || "",
          status: "draft",
          needsFeedback: true,
          type: PageType.text,
        }));

        resetDialog();
      } catch (error) {
        console.error(
          "Error importing Google document:",
          error
        );

        showError(error);
      }
    },
    [
      accessToken,
      resetDialog,
      showError,
    ]
  );

  const openGoogleDrive = useCallback(() => {
    if (!accessToken) {
      showAlert({
        message:
          "No Google Drive access token was found.",
        type: AlertType.error,
      });

      return;
    }

    openDialog({
      title: null,
      text: (
        <div
          style={{
            "--background":
              Enviroment.palette.base.surface,
          }}
          className="rounded-xl bg-cream p-3"
        >
          <div
            className={
              isPhone
                ? "grid grid-cols-2 gap-3 overflow-y-auto"
                : "grid grid-cols-3 gap-4 overflow-y-auto"
            }
            style={{
              maxHeight: "70vh",
              padding: "0.5rem",
            }}
          >
            {files.length === 0 ? (
              <p className="col-span-full p-4 text-center text-sm text-slate-500">
                No Google Docs were found.
              </p>
            ) : (
              files.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => onFilePicked(file)}
                  className="
                    flex flex-col items-center justify-center
                    rounded-xl border border-blueSea
                    border-opacity-20 bg-base-bg px-3 py-3
                    shadow-md transition-all duration-150
                    hover:border-blueSea hover:shadow-lg
                    focus:outline-none focus:ring-2
                    focus:ring-emerald-300
                  "
                >
                  <img
                    src={file.iconLink}
                    alt=""
                    className="mb-2 h-10 w-10 rounded"
                  />

                  <span className="w-full break-words text-center text-sm text-emerald-800">
                    {file.name}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      ),
    });
  }, [
    accessToken,
    files,
    isPhone,
    onFilePicked,
    openDialog,
    showAlert,
  ]);

  const handleView = useCallback(() => {
    if (!effectiveId || effectiveId === "new") {
      return;
    }

    router.push(
      Paths.page.createRoute(effectiveId),
      "forward"
    );
  }, [effectiveId, router]);

  const handlePostPublic = useCallback(
    (description) => {
      if (
        !effectiveId ||
        effectiveId === "new"
      ) {
        return;
      }

      const payload = {
        ...parameters,
        id: effectiveId,
        description,
        isPrivate: false,
        status: "finished",
        needsFeedback: true,
      };

      dispatch(updateStory(payload)).then(
        (result) =>
          checkResult(
            result,
            () => {
              setIsSaved(true);
              resetDialog();

              router.push(
                Paths.page.createRoute(effectiveId),
                "forward"
              );
            },
            (error) => {
              showError(error);
            }
          )
      );
    },
    [
      dispatch,
      effectiveId,
      parameters,
      resetDialog,
      router,
      showError,
    ]
  );

  const handleFeedback = useCallback(
    (description) => {
      if (
        !effectiveId ||
        effectiveId === "new"
      ) {
        return;
      }

      const payload = {
        ...parameters,
        id: effectiveId,
        description,
        status: "workshop",
        needsFeedback: true,
      };

      dispatch(updateStory(payload)).then(
        (result) =>
          checkResult(
            result,
            () => {
              setIsSaved(true);
              resetDialog();

              router.push(
                Paths.workshop.createRoute(
                  effectiveId
                ),
                "forward"
              );
            },
            (error) => {
              showError(error);
            }
          )
      );
    },
    [
      dispatch,
      effectiveId,
      parameters,
      resetDialog,
      router,
      showError,
    ]
  );

  const openFeedback = useCallback(
    (isFeedback) => {
      openDialog({
        disagree: closeDialog,
        disagreeText: "Close",
        scrollY: false,
        text: (
          <FeedbackDialog
            page={editPage}
            isFeedback={isFeedback}
            handleChange={(value) =>
              handleChange("description", value)
            }
            handleFeedback={handleFeedback}
            handlePostPublic={handlePostPublic}
            handleClose={closeDialog}
          />
        ),
      });
    },
    [
      closeDialog,
      editPage,
      handleChange,
      handleFeedback,
      handlePostPublic,
      openDialog,
    ]
  );
  const handleDelete = useCallback(() => {
  const storyId =
    parametersRef.current.id ||
    routeId;

  if (!storyId || storyId === "new") {
    return;
  }

  const storyToDelete = {
    ...parametersRef.current,
    id: storyId,
  };

  // Stop pending autosave.
  debouncedSaveRef.current?.cancel?.();

  // Prevent any future autosave.
  isDeletedRef.current = true;

  // Prevent creation/update logic.
  hasCreatedRef.current = true;

  dispatch(
    deleteStory(storyToDelete)
  ).then((result) => {
    checkResult(
      result,
      () => {
        dispatch(
          removeFromPaginatedKey({
            key: "stories",
            id: storyId,
          })
        );

        dispatch(
          removeFromPaginatedKey({
            key: "recommended",
            id: storyId,
          })
        );

        dispatch(
          setEditingPage({
            page: null,
          })
        );

        dispatch(
          setPageInView({
            page: null,
          })
        );

        dispatch(
          setHtmlContent("")
        );

        closeDialog();

        router.push(
          Paths.home,
          "root"
        );
      },
      (error) => {
        isDeletedRef.current = false;
        hasCreatedRef.current = false;

        showError(error);
      }
    );
  });
}, [
  closeDialog,
  dispatch,
  routeId,
  router,
  showError,
]);


const openConfirmDeleteDialog = useCallback(() => {
  openDialog({
    title: "Are you sure you want to delete this page?",
    text: parametersRef.current.title || "Untitled",

    disagreeText: "Close",
    disagree: closeDialog,

    agreeText: "Delete",
    agree: handleDelete,
  });
}, [
  closeDialog,
  handleDelete,
  openDialog,
]);
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
        <div
          className="
            flex min-h-[100dvh] flex-col
            bg-cream dark:bg-base-bgDark
          "
        >
          <header className="w-full px-2 pt-2 md:px-4 md:pt-4">
            <div
              className="
                mx-auto flex w-full max-w-3xl
                flex-col gap-1 rounded-lg
                border border-emerald-200
                bg-emerald-50 p-2
                dark:border-base-borderDark
                dark:bg-base-bgDark
              "
            >
              <div className="flex w-full items-center gap-2">
                <div className="flex    w-[100%] flex-col">
                  <input
                    type="text"
                    value={parameters.title}
                    onChange={(event) =>
                      handleChange(
                        "title",
                        event.target.value
                      )
                    }
                    placeholder="Untitled"
                    aria-label="Story title"
                    className="
                 
                      flex-grow rounded-md border
                      border-emerald-300 bg-base-bg
                      p-2 text-[1rem] font-bold
                      text-emerald-800 outline-none
                      focus:ring-2 focus:ring-emerald-500
                      dark:text-cream
                    "
                  />

                  <div className="mt-1 flex items-center gap-2">
                    {isSaved ? (
                      <span className="flex items-center gap-1 font-semibold text-emerald-700">
                        ✅ Saved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-semibold text-yellow-600">
                        💾 Saving...
                      </span>
                    )}

                    <VisibilityBadge
                      isPrivate={parameters.isPrivate}
                      toggle={() =>
                        handleChange(
                          "isPrivate",
                          !parameters.isPrivate
                        )
                      }
                    />

                    {effectiveId &&
                      effectiveId !== "new" && (
                        <button
                          type="button"
                          onClick={handleView}
                          className="
                            inline-flex items-center gap-1
                            rounded-full border
                            border-emerald-300 px-2 py-[3px]
                            text-xs font-medium text-emerald-700
                            transition-colors
                            hover:bg-emerald-50
                            dark:border-emerald-600
                            dark:text-emerald-300
                            dark:hover:bg-emerald-900/30
                          "
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle
                              cx="12"
                              cy="12"
                              r="3"
                            />
                          </svg>

                          Preview
                        </button>
                      )}
                  </div>
                </div>

                <div className="shrink-0">
                  <TopBarDropdown
                    router={router}
                    id={effectiveId}
                    handleView={handleView}
                    editPage={pageInView}
                    handleChange={handleChange}
                    openFeedback={openFeedback}
                    parameters={parameters}
                    openGoogleDrive={openGoogleDrive}
                    setOpenHashtag={setOpenHashtag}
                    openHashtag={openHashtag}
                    openConfirmDeleteDialog={
                      openConfirmDeleteDialog
                    }
                  />
                </div>
              </div>
            </div>
          </header>

          <main className="w-full px-2 pb-24 pt-2 md:px-4 md:pb-10 md:pt-4">
            <div className="mx-auto w-full max-w-3xl">
              <div className={CONTAINER}>
                <div
                  className="
                    mb-4 flex w-fit gap-1
                    rounded-full bg-gray-100 p-1
                    dark:bg-base-surfaceDark
                  "
                >
                  {STATUS_OPTIONS.map((option) => {
                    const isActive =
                      parameters.status ===
                      option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          handleChange(
                            "status",
                            option.value
                          )
                        }
                        className={`
                          rounded-full px-3 py-1
                          text-xs font-semibold
                          transition-all duration-150
                          ${
                            isActive
                              ? "bg-soft text-white shadow-sm"
                              : "bg-base-bg text-soft dark:bg-base-bgDark dark:text-cream"
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                <div className="editor-toolbar-wrapper">
                  <EditorDiv
                    page={editPage}
                    isSaved={isSaved}
                    setIsSaved={setIsSaved}
                    handleChange={handleChange}
                    parameters={parameters}
                    type={type}
                    createPageAction={
                      createPageAction
                    }
                  />
                </div>
              </div>

              <EditorFooter
                pageInView={pageInView}
                effectiveId={effectiveId}
                openConfirmDeleteDialog={
                  openConfirmDeleteDialog
                }
              />
            </div>
          </main>
        </div>
      </IonContent>
    </EditorContext.Provider>
  );
}

function VisibilityBadge({
  isPrivate,
  toggle,
}) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-xs font-semibold transition";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Change visibility"
      className={
        isPrivate
          ? `${base} bg-gray-100 text-gray-600 hover:bg-gray-200`
          : `${base} bg-emerald-100 text-emerald-700 hover:bg-emerald-200`
      }
    >
      <span aria-hidden="true">
        {isPrivate ? "🔒" : "🌍"}
      </span>

      {isPrivate ? "Private" : "Public"}
    </button>
  );
}