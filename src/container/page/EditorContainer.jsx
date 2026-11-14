

import "../../styles/Editor.css";
import "../../App.css";

import { useDispatch, useSelector } from "react-redux";
import {
  useCallback,
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

import { useAlert } from "../../core/useAlert.jsx";
import AlertType from "../../core/AlertType.js";

import EditorContext from "./EditorContext";
import FeedbackDialog from "../../components/page/FeedbackDialog";
import { useDialog } from "../../domain/usecases/useDialog.jsx";
import EditorDiv from "../../components/page/EditorDiv.jsx";
import TopBarDropdown from "../../components/page/TopBarDropdown.jsx";
import EditorFooter from "../../components/page/EditorFooter.jsx";

import Enviroment from "../../core/Enviroment.js";
import { useMediaQuery } from "react-responsive";
import styles from "../../styles/style.js";
import PageTypeSelector from "../../components/PageTypeSelector.jsx";
import ErrorBoundary from "../../ErrorBoundary.jsx";

const CONTAINER =
  "mx-auto w-full max-w-3xl rounded-lg bg-base-bg p-4 shadow-sm md:p-6";

const DRIVE_TOKEN_KEY = "googledrivetoken";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "fragment", label: "Fragment" },
  { value: "workshop", label: "Workshop" },
  { value: "finished", label: "Published" },
];

/*
 * ---------------------------------------------------------
 * HELPERS
 * ---------------------------------------------------------
 */

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
    type: normalizeType(type),
    authorId: currentProfile?.id ?? null,
    profileId: currentProfile?.id ?? "",
    profile: currentProfile ?? null,
    page: null,
  };
}

/*
 * Only fields that are persisted as editable story content
 * participate in save comparisons.
 */
function getEditableSnapshot(parameters = {}) {
  return {
    data: parameters.data ?? "",
    title: parameters.title ?? "",
    description: parameters.description ?? "",
    status: parameters.status || "draft",
    isPrivate: parameters.isPrivate ?? true,
    commentable: parameters.commentable ?? true,
    needsFeedback: parameters.needsFeedback ?? false,
    type: normalizeType(parameters.type),
  };
}

function snapshotsMatch(first, second) {
  if (!first || !second) return false;

  return (
    JSON.stringify(first) ===
    JSON.stringify(second)
  );
}

/*
 * ---------------------------------------------------------
 * COMPONENT
 * ---------------------------------------------------------
 */

export default function EditorContainer() {
  const dispatch = useDispatch();
  const router = useIonRouter();

  const {
    id: routeId,
    type: paramType,
  } = useParams();

  const { showAlert } = useAlert();

  const isPhone = useMediaQuery({
    query: "(max-width: 750px)",
  });

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

  const isNewStory =
    !routeId || routeId === "new";

  const initialType = normalizeType(
    paramType || sliceType
  );

  /*
   * ---------------------------------------------------------
   * STATE
   * ---------------------------------------------------------
   */

  const [parameters, setParameters] = useState(() =>
    createEmptyParameters({
      routeId,
      type: initialType,
      currentProfile,
    })
  );

  const [files, setFiles] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [isSaved, setIsSaved] = useState(true);
  const [saveError, setSaveError] = useState(false);
  const [openHashtag, setOpenHashtag] = useState(false);

  const type = normalizeType(
    parameters.type || initialType
  );

  const isMediaType =
    type === PageType.picture ||
    type === PageType.link;

  const effectiveId =
    parameters.id || routeId;

  /*
   * ---------------------------------------------------------
   * REFS
   * ---------------------------------------------------------
   */

  const parametersRef = useRef(parameters);

  const hasLoadedRef = useRef(false);
  const hasCreatedRef = useRef(false);

  const isSavingRef = useRef(false);
  const isDeletedRef = useRef(false);

  const saveRequestedRef = useRef(false);

  const activeRequestIdRef = useRef(null);

  const lastSavedRef = useRef(null);

  const saveTimerRef = useRef(null);
  const persistLatestRef = useRef(null);

  const routeIdentityRef = useRef(
    `${routeId || "new"}:${paramType || ""}`
  );

  /*
   * ---------------------------------------------------------
   * ERROR HANDLING
   * ---------------------------------------------------------
   */

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

  /*
   * ---------------------------------------------------------
   * PARAMETER UPDATES
   * ---------------------------------------------------------
   *
   * All changes update the ref immediately and then React
   * state. This keeps asynchronous save operations reading
   * the latest editor values.
   */

  const updateParameters = useCallback(
    (updater) => {
      const previous = parametersRef.current;

      const next =
        typeof updater === "function"
          ? updater(previous)
          : {
              ...previous,
              ...updater,
            };

      parametersRef.current = next;
      setParameters(next);

      return next;
    },
    []
  );

  const handleChange = useCallback(
    (key, value) => {
      updateParameters((previous) => ({
        ...previous,
        [key]: value,
      }));
    },
    [updateParameters]
  );

  /*
   * ---------------------------------------------------------
   * SAVE TIMER
   * ---------------------------------------------------------
   */

  const clearSaveTimer = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
  }, []);

  const scheduleSave = useCallback(
    (delay = 750) => {
      if (isDeletedRef.current) return;

      clearSaveTimer();

      saveTimerRef.current = setTimeout(() => {
        saveTimerRef.current = null;

        if (isDeletedRef.current) return;

        /*
         * If a request is already running, record that
         * another save is needed when it finishes.
         */
        if (isSavingRef.current) {
          saveRequestedRef.current = true;
          return;
        }

        persistLatestRef.current?.();
      }, delay);
    },
    [clearSaveTimer]
  );

  /*
   * ---------------------------------------------------------
   * PERSIST LATEST STORY
   * ---------------------------------------------------------
   *
   * This is the only function that creates or updates a
   * story during normal editor operation.
   */

  const persistLatest = useCallback(async () => {
    if (!currentProfile?.id) return null;
    if (isDeletedRef.current) return null;

    if (isSavingRef.current) {
      saveRequestedRef.current = true;
      return null;
    }

    const current = parametersRef.current;

    const hasMeaningfulContent =
      Boolean(current.data?.trim()) ||
      Boolean(current.title?.trim());

    if (!hasMeaningfulContent) return null;

    const snapshot = getEditableSnapshot(current);

    /*
     * Nothing has changed since the last confirmed save.
     */
    if (
      snapshotsMatch(
        snapshot,
        lastSavedRef.current
      )
    ) {
      setIsSaved(true);
      setSaveError(false);
      return current.page ?? null;
    }

    isSavingRef.current = true;
    saveRequestedRef.current = false;

    setIsSaved(false);
    setSaveError(false);

    try {
      const resolvedId =
        current.id || routeId || null;

      const isCreating =
        !resolvedId || resolvedId === "new";

      const payload = {
        ...current,
        ...snapshot,
        id: isCreating ? null : resolvedId,
        authorId: currentProfile.id,
        profileId: currentProfile.id,
        profile: currentProfile,
      };

      const response = isCreating
        ? await dispatch(
            createStory(payload)
          ).unwrap()
        : await dispatch(
            updateStory(payload)
          ).unwrap();

      if (isDeletedRef.current) return null;

      const savedStory = response?.story;

      /*
       * A new story must return an ID before the editor
       * can transition to update mode.
       */
      if (isCreating && !savedStory?.id) {
        throw new Error(
          "The story was created, but no story ID was returned."
        );
      }

      /*
       * The exact snapshot sent to the server is now
       * confirmed as saved.
       */
      lastSavedRef.current = snapshot;

      /*
       * Creation establishes the permanent ID.
       * Do not replace the latest editor parameters with
       * the server response: the user may have continued
       * typing while creation was in progress.
       */
      if (isCreating) {
        const latest = parametersRef.current;

        const createdParameters = {
          ...latest,
          id: savedStory.id,
          page: savedStory,
        };

        parametersRef.current = createdParameters;
        setParameters(createdParameters);

        activeRequestIdRef.current = savedStory.id;
        hasCreatedRef.current = true;
        hasLoadedRef.current = true;

        dispatch(
          setEditingPage({
            page: savedStory,
          })
        );

        dispatch(
          setPageInView({
            page: savedStory,
          })
        );

        dispatch(
          setPageType({
            type: normalizeType(
              savedStory.type || snapshot.type
            ),
          })
        );

        window.history.replaceState(
          null,
          "",
          Paths.editPage.createRoute(
            savedStory.id,
            savedStory.type || snapshot.type
          )
        );
      }

      /*
       * Compare the latest editor values with the
       * version that the server just confirmed.
       */
      const latestSnapshot =
        getEditableSnapshot(
          parametersRef.current
        );

      const latestIsSaved =
        snapshotsMatch(
          latestSnapshot,
          lastSavedRef.current
        );

      setIsSaved(latestIsSaved);
      setSaveError(false);

      /*
       * If edits occurred during the request, save
       * the newer version immediately afterward.
       */
      if (
        !latestIsSaved ||
        saveRequestedRef.current
      ) {
        scheduleSave(0);
      }

      return savedStory ?? response;
    } catch (error) {
      setIsSaved(false);
      setSaveError(true);

      showError(error);

      return null;
    } finally {
      isSavingRef.current = false;

      /*
       * Do not lose a save request that was made while
       * the previous request was still in flight.
       */
      if (
        saveRequestedRef.current &&
        !isDeletedRef.current
      ) {
        saveRequestedRef.current = false;
        scheduleSave(0);
      }
    }
  }, [
    currentProfile,
    dispatch,
    routeId,
    scheduleSave,
    showError,
  ]);

  persistLatestRef.current = persistLatest;

  /*
   * ---------------------------------------------------------
   * SAVE IMMEDIATELY
   * ---------------------------------------------------------
   *
   * Used by explicit actions such as publishing,
   * requesting feedback, and editor-driven creation.
   */

  const saveChangesNow = useCallback(
    async (changes = {}) => {
      if (isDeletedRef.current) return null;

      updateParameters((previous) => ({
        ...previous,
        ...changes,
      }));

      clearSaveTimer();

      return persistLatestRef.current?.() ?? null;
    },
    [clearSaveTimer, updateParameters]
  );

  /*
   * ---------------------------------------------------------
   * INITIALIZE LOADED STORY
   * ---------------------------------------------------------
   */

  const setStory = useCallback(
    (story) => {
      if (!story?.id) return;

      /*
       * Ignore duplicate initialization of the same story.
       */
      if (
        hasLoadedRef.current &&
        parametersRef.current.id === story.id
      ) {
        return;
      }

      const storyType = normalizeType(
        story.type || type
      );

      const loadedParameters = {
        ...parametersRef.current,
        id: story.id,
        data: story.data ?? "",
        title: story.title ?? "",
        description: story.description ?? "",
        status: story.status || "draft",
        isPrivate: story.isPrivate ?? true,
        commentable: story.commentable ?? true,
        needsFeedback: story.needsFeedback ?? false,
        type: storyType,
        authorId:
          story.authorId ??
          currentProfile?.id ??
          null,
        profileId:
          story.profileId ??
          currentProfile?.id ??
          "",
        profile: currentProfile ?? null,
        page: story,
      };

      activeRequestIdRef.current = story.id;

      hasCreatedRef.current = true;
      hasLoadedRef.current = true;

      /*
       * The loaded server version is the saved baseline.
       */
      lastSavedRef.current =
        getEditableSnapshot(loadedParameters);

      parametersRef.current = loadedParameters;
      setParameters(loadedParameters);

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

      dispatch(
        setHtmlContent(loadedParameters.data)
      );

      setIsSaved(true);
      setSaveError(false);
    },
    [currentProfile, dispatch, type]
  );

  /*
   * ---------------------------------------------------------
   * ROUTE CHANGES
   * ---------------------------------------------------------
   *
   * Reset editor state when moving to another story.
   */

  useEffect(() => {
    const nextIdentity =
      `${routeId || "new"}:${paramType || ""}`;

    if (
      routeIdentityRef.current === nextIdentity
    ) {
      return;
    }

    routeIdentityRef.current = nextIdentity;

    clearSaveTimer();

    activeRequestIdRef.current =
      routeId || null;

    hasCreatedRef.current = false;
    hasLoadedRef.current = false;
    isDeletedRef.current = false;

    saveRequestedRef.current = false;
    lastSavedRef.current = null;

    const nextParameters =
      createEmptyParameters({
        routeId,
        type: normalizeType(
          paramType || sliceType
        ),
        currentProfile,
      });

    parametersRef.current = nextParameters;
    setParameters(nextParameters);

    setIsSaved(true);
    setSaveError(false);

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

    dispatch(setHtmlContent(""));

    dispatch(
      setPageType({
        type: normalizeType(
          paramType || sliceType
        ),
      })
    );
  }, [
    clearSaveTimer,
    currentProfile,
    dispatch,
    paramType,
    routeId,
    sliceType,
  ]);

  /*
   * ---------------------------------------------------------
   * LOAD EXISTING STORY
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (isNewStory || !routeId) return;

    if (
      hasLoadedRef.current &&
      parametersRef.current.id === routeId
    ) {
      return;
    }

    let cancelled = false;

    activeRequestIdRef.current = routeId;

    const loadStory = async () => {
      try {
        /*
         * Reuse Redux data if the requested story is
         * already available.
         */
        if (pageInView?.id === routeId) {
          if (
            !cancelled &&
            activeRequestIdRef.current === routeId
          ) {
            setStory(pageInView);
          }

          return;
        }

        const response = await dispatch(
          getStory({
            id: routeId,
          })
        ).unwrap();

        if (cancelled) return;

        if (
          activeRequestIdRef.current !== routeId
        ) {
          return;
        }

        if (!response?.story) {
          throw new Error(
            "The requested story could not be loaded."
          );
        }

        setStory(response.story);
      } catch (error) {
        if (!cancelled) {
          showError(error);
        }
      }
    };

    loadStory();

    return () => {
      cancelled = true;
    };
  }, [
    dispatch,
    isNewStory,
    pageInView,
    routeId,
    setStory,
    showError,
  ]);

  /*
   * ---------------------------------------------------------
   * AUTOSAVE
   * ---------------------------------------------------------
   *
   * This is the only autosave effect.
   */

  useEffect(() => {
    if (!currentProfile?.id) return;
    if (isDeletedRef.current) return;

    /*
     * New image/link stories should wait for their
     * actual content before being created.
     */
    if (isMediaType && isNewStory) return;

    const hasMeaningfulContent =
      Boolean(parameters.data?.trim()) ||
      Boolean(parameters.title?.trim());

    if (!hasMeaningfulContent) return;

    /*
     * Do not update an existing story before its
     * server version has loaded.
     */
    if (
      !isNewStory &&
      !hasLoadedRef.current
    ) {
      return;
    }

    setIsSaved(false);
    setSaveError(false);

    scheduleSave();
  }, [
    currentProfile?.id,
    isMediaType,
    isNewStory,
    parameters,
    scheduleSave,
  ]);

  /*
   * ---------------------------------------------------------
   * PROFILE METADATA
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!currentProfile?.id) return;

    const current =
      parametersRef.current;

    if (
      current.authorId === currentProfile.id &&
      current.profileId === currentProfile.id &&
      current.profile === currentProfile
    ) {
      return;
    }

    updateParameters((previous) => ({
      ...previous,
      authorId: currentProfile.id,
      profileId: currentProfile.id,
      profile: currentProfile,
    }));
  }, [
    currentProfile,
    updateParameters,
  ]);

  /*
   * ---------------------------------------------------------
   * CLEANUP
   * ---------------------------------------------------------
   */

  useEffect(() => {
    return () => {
      clearSaveTimer();
    };
  }, [clearSaveTimer]);

  /*
   * ---------------------------------------------------------
   * EDITOR-DRIVEN CREATION
   * ---------------------------------------------------------
   */

  const createPageAction = useCallback(
    async (data) => {
      if (isDeletedRef.current) return null;

      if (data !== undefined) {
        updateParameters((previous) => ({
          ...previous,
          data,
        }));
      }

      clearSaveTimer();

      return persistLatestRef.current?.() ?? null;
    },
    [clearSaveTimer, updateParameters]
  );

  /*
   * ---------------------------------------------------------
   * GOOGLE DRIVE
   * ---------------------------------------------------------
   */

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

        updateParameters((previous) => ({
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
      updateParameters,
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

                  <span className="w-full break-words text-center text-sm dark:text-plumb-darkText text-plumb-ink">
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

  /*
   * ---------------------------------------------------------
   * NAVIGATION
   * ---------------------------------------------------------
   */

  const handleView = useCallback(() => {
    if (!effectiveId || effectiveId === "new") {
      return;
    }

    router.push(
      Paths.page.createRoute(effectiveId),
      "forward"
    );
  }, [effectiveId, router]);

  /*
   * ---------------------------------------------------------
   * PUBLISH
   * ---------------------------------------------------------
   */

  const handlePostPublic = useCallback(
    async (description) => {
      if (
        !effectiveId ||
        effectiveId === "new"
      ) {
        return;
      }

      const story = await saveChangesNow({
        description,
        isPrivate: false,
        status: "finished",
        needsFeedback: true,
      });

      if (!story) return;

      resetDialog();

      router.push(
        Paths.page.createRoute(effectiveId),
        "forward"
      );
    },
    [
      effectiveId,
      resetDialog,
      router,
      saveChangesNow,
    ]
  );

  /*
   * ---------------------------------------------------------
   * FEEDBACK / WORKSHOP
   * ---------------------------------------------------------
   */

  const handleFeedback = useCallback(
    async (description) => {
      if (
        !effectiveId ||
        effectiveId === "new"
      ) {
        return;
      }

      const story = await saveChangesNow({
        description,
        status: "workshop",
        needsFeedback: true,
      });

      if (!story) return;

      resetDialog();

      router.push(
        Paths.workshop.createRoute(effectiveId),
        "forward"
      );
    },
    [
      effectiveId,
      resetDialog,
      router,
      saveChangesNow,
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

  /*
   * ---------------------------------------------------------
   * DELETE
   * ---------------------------------------------------------
   */

  const handleDelete = useCallback(async () => {
    const storyId =
      parametersRef.current.id || routeId;

    if (!storyId || storyId === "new") {
      return;
    }

    clearSaveTimer();

    isDeletedRef.current = true;
    saveRequestedRef.current = false;

    try {
      await dispatch(
        deleteStory({
          page: {
            ...parametersRef.current,
            id: storyId,
          },
        })
      ).unwrap();

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

      dispatch(setHtmlContent(""));

      closeDialog();

      router.push(
        Paths.home,
        "root"
      );
    } catch (error) {
      isDeletedRef.current = false;
      showError(error);
    }
  }, [
    clearSaveTimer,
    closeDialog,
    dispatch,
    routeId,
    router,
    showError,
  ]);

  const openConfirmDeleteDialog = useCallback(() => {
    openDialog({
      title:
        "Are you sure you want to delete this page?",
      text:
        parametersRef.current.title || "Untitled",
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

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <EditorContext.Provider
      value={{
        page: editPage,
        parameters,
        setParameters: updateParameters,
      }}
    >
      <IonContent
        fullscreen
        className="page-content"
      >
        <ErrorBoundary>
          <main
            className={[
              styles.pageShell.base,
            ].join(" ")}
          >
            <header
              className={styles.pageShell.head}
            >
              <span>
                <div
                  className="
                    mx-auto flex flex-col gap-1
                    rounded-lg border-2
                    border-plumb-blueSea/50
                    p-2 dark:border-base-borderDark
                  "
                >
                  <div className="flex flex-row gap-2">
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
                        bg-plumb-canvas
                        text-[1rem] font-bold
                        text-plumb-ink
                        outline-none
                        px-4
                        focus:ring-2
                        focus:ring-emerald-500
                        dark:text-plumb-darkText
                      "
                    />

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

                  <div className="flex flex-row gap-2 py-1">
                    {isSaved ? (
                      <h6 className="my-auto flex translate-y-[0.5pt] items-center gap-1 text-sm font-semibold">
                        ✅ Saved
                      </h6>
                    ) : saveError ? (
                      <h6 className="my-auto flex items-center gap-1 text-sm font-semibold text-red-600">
                        ⚠️ Not saved
                      </h6>
                    ) : (
                      <h6 className="my-auto flex items-center gap-1 text-sm font-semibold">
                        💾 Saving...
                      </h6>
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
                            border-plumb-blueSea/50
                            px-6 py-[3px] text-xs
                            font-medium transition-colors
                            hover:bg-emerald-50
                            dark:border-plumb-mintLight
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
              </span>
            </header>

            <section>
              <div className="mx-auto w-full max-w-3xl">
                <div className={CONTAINER}>
                  <PageTypeSelector
                    value={type}
                    onChange={(nextType) => {
                      handleChange(
                        "type",
                        nextType
                      );

                      dispatch(
                        setPageType({
                          type: nextType,
                        })
                      );
                    }}
                  />

                  <div
                    className="
                      mx-auto mb-4 mt-4
                      flex w-fit flex-row
                      items-center justify-center gap-1
                      rounded-full
                    "
                  >
                    {STATUS_OPTIONS.map((option) => {
                      const isActive =
                        parameters.status ===
                        option.value;

                      return (
                        <div
                          key={option.value}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() =>
                            handleChange(
                              "status",
                              option.value
                            )
                          }
                          className={`
                            ${styles.button.base}
                            ${styles.button.small}
                            text-plumb-ink
                            border-plumb-blueSea/70 min-w-20
                         bg-plumb-blueSea/5
                            ${
                              isActive
                                ? "ring-2 ring-plumb-mint/40"
                                : "opacity-75"
                            }
                          `}
                        >
                          {option.label}
                        </div>
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

                <div
                  className={styles.pageShell.padded}
                >
                  <EditorFooter
                    pageInView={pageInView}
                    effectiveId={effectiveId}
                    openConfirmDeleteDialog={
                      openConfirmDeleteDialog
                    }
                  />
                </div>
              </div>
            </section>
          </main>
        </ErrorBoundary>
      </IonContent>
    </EditorContext.Provider>
  );
}

/*
 * ---------------------------------------------------------
 * VISIBILITY BADGE
 * ---------------------------------------------------------
 */

function VisibilityBadge({
  isPrivate,
  toggle,
}) {
  const base =
    "max-w-min flex flex-row gap-2 rounded-full px-6 py-1 text-sm";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Change visibility"
      aria-pressed={!isPrivate}
      className={
        isPrivate
          ? `${base} border border-plumb-blueSea hover:bg-gray-200 dark:text-plumb-blueSea`
          : `${base} border border-plumb-mintLight hover:bg-emerald-200 dark:text-plumb-mintLight`
      }
    >
      <span aria-hidden="true">
        {isPrivate ? "🔒" : "🌍"}
      </span>

      {isPrivate ? "Private" : "Public"}
    </button>
  );
}
