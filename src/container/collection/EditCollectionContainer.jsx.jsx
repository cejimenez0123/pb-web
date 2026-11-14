
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  IonContent,
  useIonRouter,
} from "@ionic/react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useParams } from "react-router";

import {
  fetchCollectionProtected,
  deleteCollection,
  deleteCollectionFromCollection,
  deleteStoryFromCollection,
  patchCollectionContent,
  patchCollectionDetails,
} from "../../actions/CollectionActions";

import {
  removeFromPaginatedKey,
  updatePaginatedItem,
} from "../../actions/PageActions";

import { RoleType } from "../../core/constants";
import Paths from "../../core/paths";
import checkResult from "../../core/checkResult";
import computePermissions from "../../core/compusePermissions";

import CollectionToCollection from "../../domain/models/CollectionToCollection";
import StoryToCollection from "../../domain/models/storyToColleciton";

import HashtagForm from "../../components/hashtag/HashtagForm";
import RoleForm from "../../components/role/RoleForm";
import SortableList from "../../components/SortableList";

import ErrorBoundary from "../../ErrorBoundary";
import { useAlert } from "../../core/useAlert.jsx";
import AlertType from "../../core/AlertType.js";
import { useDialog } from "../../domain/usecases/useDialog";

import styles from "../../styles/style.js";
import SectionHeader from "../../components/pieces/SectionHeader.jsx";

const TAG_ICON = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);
// =========================================================
// STYLES
// =========================================================

const PAGE ="flex-col flex gap-4"
//   "w-full max-w-[52rem] mx-auto px-4 sm:px-6 lg:px-8";

const CARD =
  " bg-plumb-surface dark:bg-base-bg dark:text-plumb-darkText";

const SECONDARY_BUTTON =
  `${styles.button.secondary} px-6 py-3 ${styles.button.base}`;

const PRIMARY_BUTTON =
  `${styles.button.primary} px-6  py-3 ${styles.button.base}`;



export default function EditCollectionContainer() {
  const { id } = useParams();

  const router = useIonRouter();
  const dispatch = useDispatch();
  const { showAlert } = useAlert();

  const {
    openDialog,
    closeDialog,
    resetDialog,
  } = useDialog();

  // =======================================================
  // REDUX
  // =======================================================

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const colInView = useSelector(
    (state) => state.books.collectionInView
  );

  // =======================================================
  // LOCAL STATE
  // =======================================================

  const [loading, setLoading] = useState(true);

  const [savingContent, setSavingContent] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);

  const saving = savingContent || savingDetails;

  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");

  const [isPrivate, setIsPrivate] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [followersAre, setFollowersAre] = useState(
    RoleType.commenter
  );

  const [content, setContent] = useState([]);
  const [removedItems, setRemovedItems] = useState([]);

  const [search, setSearch] = useState("");
  const [openHashtag, setOpenHashtag] = useState(false);

  // =======================================================
  // COLLECTION MATCH
  // =======================================================

  const collectionMatchesRoute =
    Boolean(colInView?.id) &&
    String(colInView.id) === String(id);

  // =======================================================
  // PERMISSIONS
  // =======================================================

  const {
    canSee,
    canEdit,
  } = computePermissions(
    collectionMatchesRoute ? colInView : null,
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
  // LOAD COLLECTION
  // =======================================================

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadCollection = async () => {
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
              showAlert({
                message: "Unable to find this room.",
                type: AlertType.error,
              });
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
    };

    loadCollection();

    return () => {
      cancelled = true;
    };
  }, [id, dispatch]);

  // =======================================================
  // HYDRATE EDITING STATE
  // =======================================================

  useEffect(() => {
    if (!collectionMatchesRoute) return;

    setTitle(colInView.title ?? "");
    setPurpose(colInView.purpose ?? "");

    setIsPrivate(colInView.isPrivate ?? true);
    setIsOpen(colInView.isOpenCollaboration ?? false);

    setFollowersAre(
      colInView.followersAre ?? RoleType.commenter
    );

    const pages = (colInView.storyIdList ?? [])
      .map((relationship, index) => {
        if (!relationship?.story) return null;

        return new StoryToCollection(
          relationship.id,
          relationship.index ?? index,
          relationship.collectionId || colInView.id,
          relationship.story,
          currentProfile
        );
      })
      .filter(Boolean)
      .map((item) => ({
        ...item,
        kind: "page",
      }));

    const childCollections = (
      colInView.childCollections ?? []
    )
      .map((relationship, index) => {
        if (!relationship?.childCollection) return null;

        return new CollectionToCollection(
          relationship.id,
          relationship.index ?? index,
          relationship.childCollection,
          colInView,
          currentProfile
        );
      })
      .filter(Boolean)
      .map((item) => ({
        ...item,
        kind: "room",
      }));

    const combinedContent = [
      ...pages,
      ...childCollections,
    ].sort(
      (a, b) =>
        (a.index ?? Number.MAX_SAFE_INTEGER) -
        (b.index ?? Number.MAX_SAFE_INTEGER)
    );

    setContent(combinedContent);
    setRemovedItems([]);
  }, [
    collectionMatchesRoute,
    colInView?.id,
    currentProfile?.id,
  ]);

  // =======================================================
  // REMOVE CONTENT
  // =======================================================

  const handleRemoveContent = (item) => {
    const existingItem = content.find(
      (entry) => entry.id === item.id
    );

    if (!existingItem) return;

    const originalIndex = content.indexOf(existingItem);

    setRemovedItems((current) => [
      ...current.filter(
        (entry) => entry.id !== item.id
      ),
      {
        ...existingItem,
        index: originalIndex,
      },
    ]);

    setContent((current) =>
      current.filter(
        (entry) => entry.id !== item.id
      )
    );
  };

  // =======================================================
  // UNDO ONE REMOVAL
  // =======================================================

  const handleUndoRemove = (item) => {
    setContent((current) => {
      if (
        current.some(
          (entry) => entry.id === item.id
        )
      ) {
        return current;
      }

      return [...current, item].sort(
        (a, b) =>
          (a.index ?? Number.MAX_SAFE_INTEGER) -
          (b.index ?? Number.MAX_SAFE_INTEGER)
      );
    });

    setRemovedItems((current) =>
      current.filter(
        (entry) => entry.id !== item.id
      )
    );
  };

  // =======================================================
  // UNDO ALL REMOVALS
  // =======================================================

  const handleUndoAll = () => {
    const itemsToRestore = [...removedItems];

    setContent((current) => {
      const restored = [...current];

      itemsToRestore.forEach((item) => {
        if (
          !restored.some(
            (entry) => entry.id === item.id
          )
        ) {
          restored.push(item);
        }
      });

      return restored.sort(
        (a, b) =>
          (a.index ?? Number.MAX_SAFE_INTEGER) -
          (b.index ?? Number.MAX_SAFE_INTEGER)
      );
    });

    setRemovedItems([]);
  };

  // =======================================================
  // FILTER CONTENT
  // =======================================================

  const filteredContent = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return content;

    return content.filter((item) => {
      const itemTitle =
        item.kind === "room"
          ? item?.childCollection?.title
          : item?.story?.title;

      return itemTitle
        ?.toLowerCase()
        .includes(query);
    });
  }, [content, search]);

  // =======================================================
  // SAVE ROOM DETAILS
  // =======================================================

  const handleSaveDetails = async () => {
    if (
      !collectionMatchesRoute ||
      !currentProfile ||
      saving
    ) {
      return;
    }

    setSavingDetails(true);

    try {
      const result = await dispatch(
        patchCollectionDetails({
          id,
          title: title.trim(),
          purpose: purpose.trim(),
          isPrivate,
          isOpenCollaboration: isOpen,
          followersAre,
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
            message: "Room details updated.",
            type: AlertType.success,
          });
        },
        (error) => {
          showAlert({
            message:
              error?.message ||
              "Unable to update room details.",
            type: AlertType.error,
          });
        }
      );
    } catch (error) {
      showAlert({
        message:
          error?.message ||
          "Unable to update room details.",
        type: AlertType.error,
      });
    } finally {
      setSavingDetails(false);
    }
  };

  // =======================================================
  // SAVE ROOM CONTENT
  // =======================================================

  const handleSaveContent = async () => {
    if (
      !collectionMatchesRoute ||
      !currentProfile ||
      saving
    ) {
      return;
    }

    setSavingContent(true);

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
          storyToCol,
          colToCol,
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

          setRemovedItems([]);

          showAlert({
            message: "Room contents updated.",
            type: AlertType.success,
          });
        },
        (error) => {
          showAlert({
            message:
              error?.message ||
              "Unable to update room contents.",
            type: AlertType.error,
          });
        }
      );
    } catch (error) {
      showAlert({
        message:
          error?.message ||
          "Unable to update room contents.",
        type: AlertType.error,
      });
    } finally {
      setSavingContent(false);
    }
  };

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
  // DELETE ROOM
  // =======================================================

  const handleDelete = () => {
    if (!collectionMatchesRoute) return;

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
              router.push(Paths.myProfile);
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

  // Your existing JSX return starts here:
  return (
          <IonContent
        fullscreen={true}
        scrollY={true}
   
      >
    <ErrorBoundary>

                 

            <main
            className={styles.pageShell.base+" pb-8 flex flex-col gap-8 "}
           
            >

         
                <div    onClick={() =>
                  router.push(
                    Paths.collection.createRoute(
                      colInView.id
                    )
                  )
                } className="flex flex-row gap-2 mx-2 my-4 text-sm text-plumb-ink dark:text-plumb-darkText">
                <span aria-hidden="true">
                  ←
                </span>

                <span>
                  Back to room
                </span>
          
</div>
<span className={styles.pageShell.body}>
          <div className="flex flex-row gap-2">
                <div className="flex flex-row" >

   
                  <p
                    className="
                      text-xs
                      uppercase
                      my-auto
                     
                      text-text-secondary
                  mx-4
                    "
                  >
                    Edit room
                  </p>
              </div>
  

                    {colInView.type && (
                      <span
                      className={styles.pill.base+" border border-1 border-plumb-mint/50"}
            text-text-secondary
                        // "
                      >
                        {formatRoomType(
                          colInView.type
                        )}
                      </span>
                    )}

                    {colInView.isPrivate && (
                      <span
                       className={styles.pill.base+" border border-1 border-plumb-mint/50"}
              
                      >
                        Private
                      </span>
                    )}

                      {colInView.isWorkshop && (
                        <span className="inline-flex rounded-full bg-softBlue px-3 py-1 text-xs text-text-primary">
                          Workshop
                        </span>
                      )}
</div>
       </span>        

            

           
                 <section
  className={[
    "mx-auto",
    styles.pageShell.header,
    styles.pageShell.body,
  ].filter(Boolean).join(" ")}
>
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

 
         <section className="flex flex-wrap my-4 items-center gap-2">      

                  <div
                    onClick={openRoleForm}
                    className={SECONDARY_BUTTON}
                  >
                    Manage access
                  </div>


                  <div
                    onClick={() =>
                      router.push(
                        Paths.collection.createRoute(
                          colInView.id
                        )
                      )
                    }
                    className={[styles.button.base,styles.button.secondary].join(" ")}
                
                  >
                    View room
                  </div>
  <div
    type="button"
    onClick={handleSaveDetails}
    disabled={savingDetails}
    className={PRIMARY_BUTTON}
  >
      {savingDetails ? "Saving details..." : "Save room details"}
  </div>
          
</section>
     </section>

  
    
<section className={styles.pageShell.body}>

              <span className="md:w-2xl text-left w-[100%] ">
                 
                  <p className="text-xs uppercase tracking-[0.16em] text-text-secondary mb-2">
                    Room identity
                  </p>

                  <h2 className="font-serif text-2xl text-text-primary dark:text-cream">
                    What is this room?
                  </h2>
                  </span>
                   <div onClick={() =>
                   router.push(
                      Paths.addToCollection.createRoute(
                        colInView.id
                      )
                    )
                  }
                  className={PRIMARY_BUTTON}
                >
                  Add to Room
                </div>
</section>
                  

                  <section className={styles.pageShell.body}>
<div>
                    <label className="block flex flex-col gap-2 my-2">
                      <span className="block text-sm mb-2 font-medium text-text-primary dark:text-cream mb-2">
                        Title
                      </span>

                      <input
                        value={title}
                        onChange={(event) =>
                          setTitle(event.target.value)
                        }
                        placeholder="Room title"
                        className={`${styles.input.base} ${styles.input.primary}  ${styles.input.text}`}
                      />
                      
                    </label>
</div>
                    <label className="block my-2 flex flex-col gap-2">
                      <span className="block text-sm mb-2 font-medium text-text-primary dark:text-cream mb-2">
                        Description
                      </span>

                      <textarea
                        value={purpose}
                        onChange={(event) =>
                          setPurpose(event.target.value)
                        }
                        placeholder="What is this room for?"
                        rows={5}
                        className={styles.input.base +" "+styles.input.textarea}
                      
                        
                      />
                    </label>

                </section>
           

<section className={styles.pageShell.body}>
  <div>
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
                        <div
                          type="button"
                          onClick={() =>
                            setIsPrivate((value) => !value)
                          }
                          className={
                            isPrivate
                              ? PRIMARY_BUTTON
                              : SECONDARY_BUTTON
                          }
                        >
                          {isPrivate ? "Private" : "Public"}
                        </div>
                      }
                    />

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
                        <div
                          type="button"
                          onClick={() =>
                            setIsOpen((value) => !value)
                          }
                          className={
                            isOpen
                              ? PRIMARY_BUTTON
                              : SECONDARY_BUTTON
                          }
                        >
                          {isOpen ? "Open" : "Closed"}
                        </div>
                      }
                    />

                                     <SettingRow
                      title="Follower role"
                      description="The role given when someone follows this room."
                      action={
                        <select
                          value={followersAre}
                          onChange={(event) =>
                            setFollowersAre(event.target.value)
                          }
                          className="
                            py-2
                            px-6
                            rounded-full
                            border
                            border-plumb-mint
                            border-1
                            bg-plumb-canvas
                            text-plumb-ink
                         
                            font-open-sans
                            text-sm
                        
                            outline-none
                            focus:border-button-primary-bg
                           
                            dark:border-white/10
                            dark:text-cream
                          "
                        >
                          <option value={RoleType.commenter}>
                            Commenter
                          </option>

                          <option value={RoleType.reader}>
                            Reader
                          </option>

                          <option value={RoleType.writer}>
                            Writer
                          </option>
                        </select>
                      }
                    />

               </div>
          </section>
   <section className={styles.pageShell.body}>
            <div
              type="button"
              onClick={() => setOpenHashtag((previous) => !previous)}
              aria-expanded={openHashtag}
              aria-controls="editor-hashtag-panel"
              className={styles.button.base+" "+styles.button.primary}
          
            >
              {TAG_ICON}
              <h5 className="-translate-y-1">{openHashtag ? "Close tags" : "Tags"}</h5>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`transition-transform duration-200 ${openHashtag ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

                  {openHashtag && (
                    <div className="px-5 sm:px-6 pb-6">
                      <HashtagForm
                            effectiveId={colInView.id}
                        item={colInView}
                        type="collection"
                      />
                    </div>
                  )}

           
              </section>
<section className={styles.pageShell.body}>
               
<SectionHeader
title={" What lives here?"}
eyebrow={"Add, remove, and reorder pages and rooms inside this room."}
onAction={handleSaveContent}
  actionLabel={
    savingContent ? "Saving Items..." : "Save Items"
  }
buttonClass={"bg-transparent border-plumb-mint/70 text-plumb-mint/70"}
/>
          

                  <div className="px-5 mt-8 sm:px-6 pb-4">

   <div className={styles.input.search.searchWrap}>
                  <span
                    aria-hidden="true"
                    className={styles.input.search.searchLabel}
                  >
                    Search
                  </span>

                  <input
                
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                   placeholder="Search pages and rooms..."
                className={styles.input.search.input}
                  />
                </div>
     
                  </div> 

<section className={styles.pageShell.section}>
                  <div className="px-5 sm:px-6 border-b border-card-border dark:border-white/10" />

                 

                  <div className="p-5 sm:p-6">
<SortableList
  items={filteredContent}
  removedItems={removedItems}
  isFiltered={search.trim().length > 0}
  onOrderChange={setContent}
  onDelete={handleRemoveContent}
  onUndoAll={handleUndoAll}
  onUndoRemove={handleUndoRemove}
/>

                  </div>
   </section>
   
     </section>            
<section className={styles.pageShell.body+" flex flex-row justify-between"}>
                  <div
                    type="button"
                    onClick={handleDelete}
                    className={[styles.button.base," rounded-full  ",styles.button.danger]}
                  >
                   <h6 className="my-auto mx-auto">Delete room</h6> 
                  </div>

                  

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
</section>
        
          
        </main>
                
</ErrorBoundary>

          </IonContent>)
  

    {/* <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className={PRIMARY_BUTTON}
                  >
                    {savingDetails||savingContent
                      ? "Saving..."
                      : "Save changes"}
                  </button> */}


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
        my-2
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
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-text-primary dark:text-cream">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            {description}
          </p>
        </div>

        <div className="flex w-full shrink-0 justify-start sm:w-[120px] sm:justify-end">
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
    <main
      className="
        min-h-full
        bg-plumb-surface
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
            type="button"
            onClick={() => router.goBack()}
            className={`${SECONDARY_BUTTON} mt-7`}
          >
            Go back
          </button>

        </div>
      </div>
    </main>
  );
}


// =========================================================
// SKELETON
// =========================================================

function EditCollectionSkeleton() {
  return (
    <main
      className="
        min-h-full
        bg-transparent
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
  );
}

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
}