import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  IonContent,
  useIonRouter,
} from "@ionic/react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import {
  fetchCollectionProtected,
  deleteCollection,
  deleteCollectionFromCollection,
  deleteStoryFromCollection,
  patchCollectionContent,
} from "../../actions/CollectionActions";

import {
  removeFromPaginatedKey,
  updatePaginatedItem,
} from "../../actions/PageActions";

import {
  RoleType,
} from "../../core/constants";

import Paths from "../../core/paths";
import checkResult from "../../core/checkResult";
import computePermissions from "../../core/compusePermissions";

import CollectionToCollection from "../../domain/models/CollectionToCollection";
import StoryToCollection from "../../domain/models/storyToColleciton";

import HashtagForm from "../../components/hashtag/HashtagForm";
import ProfileCircle from "../../components/profile/ProfileCircle.jsx";
import RoleForm from "../../components/role/RoleForm";
import SortableList from "../../components/SortableList";
import TabBar from "../../components/TabBar";
import ErrorBoundary from "../../ErrorBoundary";

import { useAlert } from "../../core/useAlert.jsx";
import AlertType from "../../core/AlertType.js";
import { useDialog } from "../../domain/usecases/useDialog";


// =========================================================
// STYLES
// =========================================================

const PAGE =
  "w-full max-w-[52rem] mx-auto px-4 sm:px-6 lg:px-8";

const CARD =
  "rounded-2xl border border-card-border bg-card-background " +
  "dark:bg-base-surfaceDark dark:border-white/10";

const PRIMARY_BUTTON =
  "inline-flex items-center justify-center h-11 px-5 rounded-full " +
  "bg-button-primary-bg text-white text-sm font-medium " +
  "transition-all duration-200 hover:bg-button-primary-hover " +
  "focus:outline-none focus:ring-2 focus:ring-button-primary-bg/30 " +
  "disabled:opacity-50 disabled:pointer-events-none";

const SECONDARY_BUTTON =
  "inline-flex items-center justify-center h-11 px-5 rounded-full " +
  "border border-card-border bg-card-background text-text-primary " +
  "text-sm font-medium transition-all duration-200 " +
  "hover:border-button-primary-bg hover:text-text-brand " +
  "focus:outline-none focus:ring-2 focus:ring-button-primary-bg/30 " +
  "dark:bg-base-surfaceDark dark:border-white/10 dark:text-cream";

const DANGER_BUTTON =
  "inline-flex items-center justify-center h-11 px-5 rounded-full " +
  "border border-red-200 bg-transparent text-red-600 text-sm font-medium " +
  "transition-all duration-200 hover:bg-red-50 " +
  "dark:border-red-400/20 dark:text-red-400 dark:hover:bg-red-400/10";


// =========================================================
// MAIN
// =========================================================

export default function EditCollectionContainer() {
  const { id } = useParams();
  const router = useIonRouter();
  const dispatch = useDispatch();

  const { showAlert } = useAlert();
  const { openDialog, closeDialog, resetDialog } = useDialog();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const colInView = useSelector(
    (state) => state.books.collectionInView
  );

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");

  const [isPrivate, setIsPrivate] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [followersAre, setFollowersAre] = useState(
    RoleType.commenter
  );

  // const [newPages, setNewPages] = useState([]);
  // const [newCollections, setNewCollections] = useState([]);
const [content, setContent] = useState([]);
  // const [activeTab, setActiveTab] = useState("pages");
  const [search, setSearch] = useState("");
  const [openHashtag, setOpenHashtag] = useState(false);
  const [saving, setSaving] = useState(false);


  // =======================================================
  // PERMISSIONS
  // =======================================================

  const {
    canSee,
    canEdit,
  } = computePermissions(
    colInView,
    currentProfile,
    {
      getAccessList: (collection) =>
        collection?.roles ?? [],

      getAccessRole: (role) =>
        role?.role,

      isPrivate: (collection) =>
        collection?.isPrivate,

      isOpen: (collection) =>
        collection?.isOpenCollaboration,

      canWriteRoles: [
        RoleType.writer,
        RoleType.editor,
      ],

      canEditRoles: [
        RoleType.editor,
      ],
    }
  );


  // =======================================================
  // LOAD
  //
  // IMPORTANT:
  // fetchCollectionProtected expects { id }.
  // This is the ONLY fetch in this component.
  // =======================================================

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function loadCollection() {
      setLoading(true);

      try {
        const result = await dispatch(
          fetchCollectionProtected({ id })
        );

        if (cancelled) return;

        checkResult(
          result,
          (payload) => {
            if (!payload?.collection) {
              setLoading(false);
              return;
            }

            setLoading(false);
          },
          (error) => {
            setLoading(false);

            showAlert({
              message:
                error?.message ||
                "Unable to load this room.",
              type: AlertType.error,
            });
          }
        );
      } catch (error) {
        if (cancelled) return;

        setLoading(false);

        showAlert({
          message:
            error?.message ||
            "Unable to load this room.",
          type: AlertType.error,
        });
      }
    }

    loadCollection();

    return () => {
      cancelled = true;
    };
  }, [id]);


  // =======================================================
  // HYDRATE EDITING STATE
  //
  // Only hydrate when the actual collection ID changes.
  // This avoids continuously copying Redux state into local
  // form state on unrelated renders.
  // =======================================================

  useEffect(() => {
    if (!colInView?.id) return;

    if (colInView.id !== id) return;

    setTitle(colInView.title ?? "");
    setPurpose(colInView.purpose ?? "");

    setIsPrivate(
      colInView.isPrivate ?? true
    );

    setIsOpen(
      colInView.isOpenCollaboration ?? false
    );

    setFollowersAre(
      colInView.followersAre ??
      RoleType.commenter
    );

    const pages =
      (colInView.storyIdList ?? [])
        .map((stc, index) => {
          if (!stc?.story) return null;

          return new StoryToCollection(
            stc.id,
            stc.index ?? index,
            stc.collectionId || colInView.id,
            stc.story,
            currentProfile
          );
        })
        .filter(Boolean)
        .sort(
          (a, b) =>
            (a.index ?? 0) -
            (b.index ?? 0)
        );

    const childCollections =
      (colInView.childCollections ?? [])
        .map((relationship, index) => {
          if (!relationship?.childCollection) {
            return null;
          }

          return new CollectionToCollection(
            relationship.id,
            relationship.index ?? index,
            relationship.childCollection,
            colInView,
            currentProfile
          );
        })
        .filter(Boolean)
        .sort(
          (a, b) =>
            (a.index ?? 0) -
            (b.index ?? 0)
        );

   setContent([
  ...pages.map((item) => ({
    ...item,
    kind: "page",
  })),
  ...childCollections.map((item) => ({
    ...item,
    kind: "room",
  })),
].sort(
  (a, b) =>
    (a.index ?? Number.MAX_SAFE_INTEGER) -
    (b.index ?? Number.MAX_SAFE_INTEGER)
));
  }, [
    id,
    colInView?.id,
    currentProfile?.id,
  ]);

  // =======================================================
  // FILTERING
  // =======================================================

  // const filteredPages = useMemo(() => {
  //   const query = search.trim().toLowerCase();

  //   if (!query) {
  //     return newPages;
  //   }

  //   return newPages.filter((item) =>
  //     item?.story?.title
  //       ?.toLowerCase()
  //       .includes(query)
  //   );
  // }, [newPages, search]);


  // const filteredCollections = useMemo(() => {
  //   const query = search.trim().toLowerCase();

  //   if (!query) {
  //     return newCollections;
  //   }

  //   return newCollections.filter((item) =>
  //     item?.childCollection?.title
  //       ?.toLowerCase()
  //       .includes(query)
  //   );
  // }, [newCollections, search]);
  // =======================================================
// FILTERING
// =======================================================

const filteredContent = useMemo(() => {
  const query = search.trim().toLowerCase();

  if (!query) {
    return content;
  }

  return content.filter((item) => {
    const title =
      item.kind === "room"
        ? item?.childCollection?.title
        : item?.story?.title;

    return title
      ?.toLowerCase()
      .includes(query);
  });
}, [content, search]);
// const filteredContent = useMemo(() => {
//   const query = search.trim().toLowerCase();

//   if (!query) {
//     return content;
//   }

//   return content.filter((item) => {
//     const title =
//       item.kind === "room"
//         ? item?.childCollection?.title
//         : item?.story?.title;

//     return title
//       ?.toLowerCase()
//       .includes(query);
//   });
// }, [content, search]);

  // =======================================================
  // SAVE
  // =======================================================
// =======================================================
// SAVE
// =======================================================

const handleSave = async () => {
  if (!colInView || !currentProfile) {
    return;
  }

  setSaving(true);

  try {
    const storyToCol = [];
    const colToCol = [];

    content.forEach((item, index) => {
      if (
        item.kind === "page" &&
        item.story
      ) {
        const {
          kind,
          ...relationship
        } = item;

        storyToCol.push({
          ...relationship,
          index,
        });
      }

      if (
        item.kind === "room" &&
        item.childCollection
      ) {
        const {
          kind,
          ...relationship
        } = item;

        colToCol.push({
          ...relationship,
          index,
        });
      }
    });

    const result = await dispatch(
      patchCollectionContent({
        id,
        isPrivate,
        isOpenCollaboration: isOpen,
        title: title.trim(),
        purpose: purpose.trim(),
        storyToCol,
        colToCol,
        col: colInView,
        profile: currentProfile,
      })
    );

    checkResult(
      result,
      (payload) => {
        if (payload?.collection) {
          dispatch(
            updatePaginatedItem({
              key: "collections",
              item: payload.collection,
            })
          );
        }

        showAlert({
          message: "Room updated.",
          type: AlertType.success,
        });
      },
      (error) => {
        showAlert({
          message:
            error?.message ||
            "Unable to save this room.",
          type: AlertType.error,
        });
      }
    );
  } catch (error) {
    showAlert({
      message:
        error?.message ||
        "Unable to save this room.",
      type: AlertType.error,
    });
  } finally {
    setSaving(false);
  }
};
  // const handleSave = async () => {
  //   if (!colInView || !currentProfile) {
  //     return;
  //   }

  //   setSaving(true);

  //   try {
  //     const result = await dispatch(
  //       patchCollectionContent({
  //         id,
  //         isPrivate,
  //         isOpenCollaboration: isOpen,
  //         title: title.trim(),
  //         purpose: purpose.trim(),
  //         storyToCol: newPages,
  //         colToCol: newCollections,
  //         col: colInView,
  //         profile: currentProfile,
  //       })
  //     );

  //     checkResult(
  //       result,
  //       (payload) => {
  //         if (payload?.collection) {
  //           dispatch(
  //             updatePaginatedItem({
  //               key: "collections",
  //               item: payload.collection,
  //             })
  //           );
  //         }

  //         showAlert({
  //           message: "Room updated.",
  //           type: AlertType.success,
  //         });
  //       },
  //       (error) => {
  //         showAlert({
  //           message:
  //             error?.message ||
  //             "Unable to save this room.",
  //           type: AlertType.error,
  //         });
  //       }
  //     );
  //   } catch (error) {
  //     showAlert({
  //       message:
  //         error?.message ||
  //         "Unable to save this room.",
  //       type: AlertType.error,
  //     });
  //   } finally {
  //     setSaving(false);
  //   }
  // };


  // =======================================================
  // MANAGE ACCESS
  // =======================================================

  const openRoleForm = () => {
    openDialog({
      text: (
        <RoleForm
          item={colInView}
        />
      ),
    });
  };


  // =======================================================
  // DELETE
  // =======================================================

  const handleDelete = () => {
    if (!colInView) return;

    openDialog({
      isOpen: true,

      text: (
        <div className="space-y-3">
          <p className="text-base text-text-primary dark:text-cream">
            Delete{" "}
            <strong>
              {colInView.title || "this room"}
            </strong>
            ?
          </p>

          <p className="text-sm leading-relaxed text-text-secondary">
            This removes the room and its relationship
            to the content inside it.
          </p>
        </div>
      ),

      agreeText: "Delete room",

      agree: async () => {
        try {
          const result = await dispatch(
            deleteCollection({ id })
          );

          checkResult(
            result,
            () => {
              dispatch(
                removeFromPaginatedKey({
                  key: "collections",
                  id,
                })
              );

              resetDialog();

              router.push(
                Paths.myProfile
              );
            },
            (error) => {
              showAlert({
                message:
                  error?.message ||
                  "Unable to delete this room.",
                type: AlertType.error,
              });
            }
          );
        } catch (error) {
          showAlert({
            message:
              error?.message ||
              "Unable to delete this room.",
            type: AlertType.error,
          });
        }
      },

      onClose: () => {
        closeDialog();
      },
    });
  };


  // =======================================================
  // ACCESS STATES
  // =======================================================

  if (loading || !colInView) {
    return <EditCollectionSkeleton />;
  }

  if (!canSee || !canEdit) {
    return (
      <CollectionEditNoAccess
        canSee={canSee}
        router={router}
      />
    );
  }


  // =======================================================
  // MAIN
  // =======================================================

  return (
    <ErrorBoundary>
      <IonContent
        fullscreen
        className="page-content"
      >
        <main
          className="
            min-h-full
            bg-base-surface
            text-text-primary
            dark:bg-base-bgDark
            dark:text-cream
          "
        >

          {/* =========================================== */}
          {/* HEADER */}
          {/* =========================================== */}

          <section className="border-b border-card-border dark:border-white/10">
            <div
              className={`${PAGE} pt-8 sm:pt-12 pb-8`}
            >

              <button
                onClick={() =>
                  router.push(
                    Paths.collection.createRoute(
                      colInView.id
                    )
                  )
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  text-text-secondary
                  hover:text-text-brand
                  transition-colors
                  mb-8
                "
              >
                <span aria-hidden="true">
                  ←
                </span>

                <span>
                  Back to room
                </span>
              </button>


              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <div className="min-w-0">

                  <p
                    className="
                      text-xs
                      uppercase
                      tracking-[0.18em]
                      text-text-secondary
                      mb-3
                    "
                  >
                    Edit room
                  </p>

                  <h1
                    className="
                      font-serif
                      text-4xl
                      sm:text-5xl
                      leading-[1.05]
                      tracking-tight
                      text-text-primary
                      dark:text-cream
                    "
                  >
                    {colInView.title ||
                      "Untitled Room"}
                  </h1>

                  <div className="mt-4 flex flex-wrap gap-2">

                    {colInView.type && (
                      <span
                        className="
                          inline-flex
                          rounded-full
                          border
                          border-card-border
                          px-3
                          py-1
                          text-xs
                          text-text-secondary
                        "
                      >
                        {formatRoomType(
                          colInView.type
                        )}
                      </span>
                    )}

                    {colInView.isPrivate && (
                      <span
                        className="
                          inline-flex
                          rounded-full
                          border
                          border-card-border
                          px-3
                          py-1
                          text-xs
                          text-text-secondary
                        "
                      >
                        Private
                      </span>
                    )}

                    {colInView.isWorkshop && (
                      <span
                        className="
                          inline-flex
                          rounded-full
                          bg-softBlue
                          px-3
                          py-1
                          text-xs
                          text-text-primary
                        "
                      >
                        Workshop
                      </span>
                    )}

                  </div>

                </div>


                <div className="flex flex-wrap gap-2">

                  <button
                    onClick={openRoleForm}
                    className={SECONDARY_BUTTON}
                  >
                    Manage access
                  </button>

                  <button
                    onClick={() =>
                      router.push(
                        Paths.collection.createRoute(
                          colInView.id
                        )
                      )
                    }
                    className={SECONDARY_BUTTON}
                  >
                    View room
                  </button>

                </div>

              </div>

            </div>
          </section>


          {/* =========================================== */}
          {/* EDITOR */}
          {/* =========================================== */}

          <section>
            <div
              className={`${PAGE} py-8 sm:py-10 space-y-6`}
            >

              {/* --------------------------------------- */}
              {/* BASIC INFORMATION */}
              {/* --------------------------------------- */}

              <section className={`${CARD} p-5 sm:p-6`}>

                <div className="mb-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-text-secondary mb-2">
                    Room identity
                  </p>

                  <h2 className="font-serif text-2xl text-text-primary dark:text-cream">
                    What is this room?
                  </h2>
                </div>


                <div className="space-y-6">

                  <label className="block">
                    <span className="block text-sm font-medium text-text-primary dark:text-cream mb-2">
                      Title
                    </span>

                    <input
                      value={title}
                      onChange={(event) =>
                        setTitle(event.target.value)
                      }
                      placeholder="Room title"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-card-border
                        bg-transparent
                        px-4
                        py-3
                        text-base
                        text-text-primary
                        outline-none
                        transition
                        focus:border-button-primary-bg
                        focus:ring-2
                        focus:ring-button-primary-bg/20
                        dark:border-white/10
                        dark:text-cream
                      "
                    />
                  </label>


                  <label className="block">
                    <span className="block text-sm font-medium text-text-primary dark:text-cream mb-2">
                      Description
                    </span>

                    <textarea
                      value={purpose}
                      onChange={(event) =>
                        setPurpose(event.target.value)
                      }
                      placeholder="What is this room for?"
                      rows={5}
                      className="
                        w-full
                        resize-y
                        rounded-xl
                        border
                        border-card-border
                        bg-transparent
                        px-4
                        py-3
                        text-base
                        leading-relaxed
                        text-text-primary
                        outline-none
                        transition
                        focus:border-button-primary-bg
                        focus:ring-2
                        focus:ring-button-primary-bg/20
                        dark:border-white/10
                        dark:text-cream
                      "
                    />
                  </label>

                </div>

              </section>


              {/* --------------------------------------- */}
              {/* ACCESS */}
              {/* --------------------------------------- */}

              <section className={`${CARD} p-5 sm:p-6`}>

                <div className="mb-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-text-secondary mb-2">
                    Access
                  </p>

                  <h2 className="font-serif text-2xl text-text-primary dark:text-cream">
                    Who can participate?
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
                    Set the room's visibility and decide
                    what followers can do.
                  </p>
                </div>


                <div className="space-y-4">

                  {/* Private */}

                  <SettingRow
                    title={
                      isPrivate
                        ? "Private room"
                        : "Public room"
                    }
                    description={
                      isPrivate
                        ? "Only people with access can enter."
                        : "Anyone can discover and enter this room."
                    }
                    action={
                      <button
                        type="button"
                        onClick={() =>
                          setIsPrivate(
                            (value) => !value
                          )
                        }
                        className={
                          isPrivate
                            ? PRIMARY_BUTTON
                            : SECONDARY_BUTTON
                        }
                      >
                        {isPrivate
                          ? "Private"
                          : "Public"}
                      </button>
                    }
                  />


                  {/* Collaboration */}

                  <SettingRow
                    title={
                      isOpen
                        ? "Open collaboration"
                        : "Closed collaboration"
                    }
                    description={
                      isOpen
                        ? "People can participate according to their assigned role."
                        : "Participation is limited to people you give access to."
                    }
                    action={
                      <button
                        type="button"
                        onClick={() =>
                          setIsOpen(
                            (value) => !value
                          )
                        }
                        className={
                          isOpen
                            ? PRIMARY_BUTTON
                            : SECONDARY_BUTTON
                        }
                      >
                        {isOpen
                          ? "Open"
                          : "Closed"}
                      </button>
                    }
                  />


                  {/* Followers */}

                  <SettingRow
                    title="Follower role"
                    description="The role given when someone follows this room."
                    action={
                      <select
                        value={followersAre}
                        onChange={(event) =>
                          setFollowersAre(
                            event.target.value
                          )
                        }
                        className="
                          h-11
                          rounded-full
                          border
                          border-card-border
                          bg-card-background
                          px-4
                          text-sm
                          text-text-primary
                          outline-none
                          focus:border-button-primary-bg
                          dark:bg-base-surfaceDark
                          dark:border-white/10
                          dark:text-cream
                        "
                      >
                        <option
                          value={RoleType.commenter}
                        >
                          Commenter
                        </option>

                        <option
                          value={RoleType.reader}
                        >
                          Reader
                        </option>

                        <option
                          value={RoleType.writer}
                        >
                          Writer
                        </option>
                      </select>
                    }
                  />

                </div>

              </section>


              {/* --------------------------------------- */}
              {/* HASHTAGS */}
              {/* --------------------------------------- */}

              <section className={`${CARD} overflow-hidden`}>

                <button
                  type="button"
                  onClick={() =>
                    setOpenHashtag(
                      (value) => !value
                    )
                  }
                  className="
                    w-full
                    px-5
                    sm:px-6
                    py-5
                    flex
                    items-center
                    justify-between
                    gap-4
                    text-left
                  "
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-text-secondary mb-1">
                      Discovery
                    </p>

                    <h2 className="font-serif text-xl text-text-primary dark:text-cream">
                      Hashtags
                    </h2>
                  </div>

                  <span
                    className="
                      text-sm
                      text-text-secondary
                    "
                    aria-hidden="true"
                  >
                    {openHashtag
                      ? "−"
                      : "+"}
                  </span>
                </button>


                {openHashtag && (
                  <div className="px-5 sm:px-6 pb-6">
                    <HashtagForm
                      item={colInView}
                      type="collection"
                    />
                  </div>
                )}

              </section>


              {/* --------------------------------------- */}
              {/* CONTENT */}
              {/* --------------------------------------- */}

              <section className={`${CARD} overflow-hidden`}>

                <div className="p-5 sm:p-6 pb-4">

                  <p className="text-xs uppercase tracking-[0.16em] text-text-secondary mb-2">
                    Content
                  </p>

                  <h2 className="font-serif text-2xl text-text-primary dark:text-cream">
                    What lives here?
                  </h2>

                  <p className="mt-2 text-sm text-text-secondary">
                    Add, remove, and reorder pages and
                    rooms inside this room.
                  </p>

                </div>


                {/* Search */}

                <div className="px-5 sm:px-6 pb-4">

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                 placeholder="Search pages and rooms..."
                    className="
                      w-full
                      rounded-xl
                      border
                      border-card-border
                      bg-transparent
                      px-4
                      py-3
                      text-sm
                      text-text-primary
                      outline-none
                      focus:border-button-primary-bg
                      focus:ring-2
                      focus:ring-button-primary-bg/20
                      dark:border-white/10
                      dark:text-cream
                    "
                  />

                </div>


                {/* Tabs */}

                <div className="px-5 sm:px-6 border-b border-card-border dark:border-white/10">

                  {/* <TabBar
                    tabs={[
                      {
                        key: "pages",
                        label: "Pages",
                      },
                      {
                        key: "collections",
                        label: "Rooms",
                      },
                    ]}
                    active={activeTab}
                    onChange={setActiveTab}
                  /> */}

                </div>


                {/* List */}
                {/* List */}

<div className="p-5 sm:p-6">
  <SortableList
  items={filteredContent}
  isFiltered={search.trim().length > 0}
  onOrderChange={setContent}
  // onDelete={async (item) => {
  //   try {
  //     let result;

  //     if (item.kind === "page") {
  //       result = await dispatch(
  //         deleteStoryFromCollection({
  //           storyId: item.story.id,
  //           collectionId: item.collectionId,
  //         })
  //       );
  //     }

  //     if (item.kind === "room") {
  //       result = await dispatch(
  //         deleteCollectionFromCollection({
  //           tcId: item.id,
  //         })
  //       );
  //     }

  //     checkResult(
  //       result,
  //       () => {
  //         setContent((current) =>
  //           current.filter(
  //             (entry) => entry.id !== item.id
  //           )
  //         );
  //       },
  //       (error) => {
  //         showAlert({
  //           message:
  //             error?.message ||
  //             "Unable to remove this item.",
  //           type: AlertType.error,
  //         });
  //       }
  //     );
  //   } catch (error) {
  //     showAlert({
  //       message:
  //         error?.message ||
  //         "Unable to remove this item.",
  //       type: AlertType.error,
  //     });
  //   }
  // }}
  onDelete={async (item) => {
  try {
    let result;

    if (item.kind === "page") {
      result = await dispatch(
        deleteStoryFromCollection({
          stId: item.id,
        })
      );
    }

    if (item.kind === "room") {
      result = await dispatch(
        deleteCollectionFromCollection({
          tcId: item.id,
        })
      );
    }

    checkResult(
      result,
      () => {
        setContent((current) =>
          current.filter(
            (entry) => entry.id !== item.id
          )
        );
      },
      (error) => {
        showAlert({
          message:
            error?.message ||
            "Unable to remove this item.",
          type: AlertType.error,
        });
      }
    );
  } catch (error) {
    showAlert({
      message:
        error?.message ||
        "Unable to remove this item.",
      type: AlertType.error,
    });
  }
}}
/>
</div>
             

              </section>


              {/* --------------------------------------- */}
              {/* ACTIONS */}
              {/* --------------------------------------- */}

              <section
                className="
                  flex
                  flex-col-reverse
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  gap-4
                  pt-2
                "
              >

                <button
                  type="button"
                  onClick={handleDelete}
                  className={DANGER_BUTTON}
                >
                  Delete room
                </button>


                <div className="flex flex-col sm:flex-row gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        Paths.collection.createRoute(
                          colInView.id
                        )
                      )
                    }
                    className={SECONDARY_BUTTON}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className={PRIMARY_BUTTON}
                  >
                    {saving
                      ? "Saving..."
                      : "Save changes"}
                  </button>

                </div>

              </section>

            </div>
          </section>

        </main>
      </IonContent>
    </ErrorBoundary>
  );
}


// =========================================================
// SETTING ROW
// =========================================================

function SettingRow({
  title,
  description,
  action,
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-card-border
        p-4
        dark:border-white/10
      "
    >
      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
        "
      >

        <div className="min-w-0">
          <h3 className="text-sm font-medium text-text-primary dark:text-cream">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            {description}
          </p>
        </div>

        <div className="shrink-0">
          {action}
        </div>

      </div>
    </div>
  );
}


// =========================================================
// NO ACCESS
// =========================================================

function CollectionEditNoAccess({
  canSee,
  router,
}) {
  return (
    <IonContent
      fullscreen
      className="page-content"
    >
      <main
        className="
          min-h-full
          bg-base-surface
          dark:bg-base-bgDark
        "
      >
        <div
          className={`${PAGE} min-h-[70vh] flex items-center justify-center py-16`}
        >

          <div className="max-w-md text-center">

            <p className="text-xs uppercase tracking-[0.18em] text-text-secondary mb-4">
              Room
            </p>

            <h1 className="font-serif text-3xl sm:text-4xl text-text-primary dark:text-cream">
              {canSee
                ? "You can't edit this room."
                : "This room is private."}
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              {canSee
                ? "You can view this room, but you don't have the permissions required to edit it."
                : "You don't have permission to view or edit this room."}
            </p>

            <button
              onClick={() =>
                router.goBack()
              }
              className={`${SECONDARY_BUTTON} mt-7`}
            >
              Go back
            </button>

          </div>

        </div>
      </main>
    </IonContent>
  );
}


// =========================================================
// SKELETON
// =========================================================

function EditCollectionSkeleton() {
  return (
    <IonContent
      fullscreen
      className="page-content"
    >
      <main
        className="
          min-h-full
          bg-base-surface
          dark:bg-base-bgDark
        "
      >

        <div className={`${PAGE} py-10 animate-pulse`}>

          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-white/10 mb-10" />

          <div className="h-3 w-20 rounded bg-gray-200 dark:bg-white/10 mb-4" />

          <div className="h-12 sm:h-16 w-3/4 max-w-2xl rounded bg-gray-200 dark:bg-white/10" />

          <div className="flex gap-2 mt-5">
            <div className="h-7 w-20 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="h-7 w-24 rounded-full bg-gray-200 dark:bg-white/10" />
          </div>

          <div className="border-t border-card-border dark:border-white/10 mt-10 pt-8 space-y-6">

            <div className="h-56 rounded-2xl bg-gray-200 dark:bg-white/10" />

            <div className="h-64 rounded-2xl bg-gray-200 dark:bg-white/10" />

            <div className="h-96 rounded-2xl bg-gray-200 dark:bg-white/10" />

          </div>

        </div>

      </main>
    </IonContent>
  );
}


// =========================================================
// HELPERS
// =========================================================

function formatRoomType(type) {
  if (!type) return "";

  const labels = {
    book: "Book",
    library: "Library",
    feedback: "Feedback",
    home: "Home",
    archive: "Archive",
  };

  return (
    labels[type] ||
    String(type)
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      )
  );
}

