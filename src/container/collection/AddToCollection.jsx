

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { IonContent, useIonRouter } from "@ionic/react";

import ErrorBoundary from "../../ErrorBoundary";
import Paths from "../../core/paths";
import {
  addCollectionListToCollection,
  addStoryListToCollection,
  fetchCollectionProtected,
  getMyCollections,
} from "../../actions/CollectionActions";
import { getMyStories } from "../../actions/StoryActions.jsx";

import PaginatedList from "../../components/page/PaginatedList.jsx";
import Pill from "../../components/Pill.jsx";

import computePermissions from "../../core/compusePermissions.jsx";
import { RoleType } from "../../core/constants.js";
import shortName from "../../core/shortName.jsx";
import styles from "../../styles/style.js";
import PlumbHead from "../head.jsx";
import TabBar from "../../components/TabBar.jsx";
import SelectedItems from "../../components/collection/SelectableItems.jsx";
import SelectableItem from "../../components/collection/SelectableItem.jsx";

const filterTypes = {
  filter: "Filter",
  recent: "Recent",
  oldest: "Oldest",
  feedback: "Feedback",
  AZ: "A-Z",
  ZA: "Z-A",
};

const TABS = {
  STORY: "STORY",
  ROOM: "ROOM",
  // ABOUT: "about"
 
};


 const tabs = [
      { key: TABS.STORY, label: "stories" },
      //  { key: TABS.MEMBERS, label: "members" },
   { key: TABS.ROOM, label: "room" }
   

 
   
  ];



/**
 * Reusable selectable row.
 *
 * Available item:
 *     Add
 *
 * Selected item:
 *     Undo
 */

/**
 * Small reusable section heading.
 */
function SelectionHeader({
  eyebrow,
  title,
  count,
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-soft">
          {eyebrow}
        </p>

        <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-cream">
          {title}
        </h3>
      </div>

      {count > 0 ? (
        <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
          {count} selected
        </span>
      ) : null}
    </div>
  );
}

/**
 * Selected items get their own compact undo area.
 *
 * This is deliberately separate from the available list so
 * selecting something removes it from the available choices.
 */


function EmptySelection({ children }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-base-bg px-6 py-10 text-center dark:border-gray-700 dark:bg-plumb-surface Dark">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {children}
      </p>
    </div>
  );
}

export default function AddToCollectionContainer() {
  const router = useIonRouter();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [filterType, setFilterType] = useState(
    filterTypes.filter
  );

  const [search, setSearch] = useState("");
  // const [tab, setTab] = useState("page");

  const [newStories, setNewStories] = useState([]);
  const [newCollections, setNewCollections] =
    useState([]);

  const [saving, setSaving] = useState(false);

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const { collectionInView: colInView } =
    useSelector((state) => state.books);

  const {
    canSee,
    canAdd,
  } = computePermissions(
    colInView,
    currentProfile,
    {
      getAccessList: (collection) =>
        collection?.roles ?? [],

      getAccessRole: (role) => role.role,

      isPrivate: (collection) =>
        collection.isPrivate,

      isOpen: (collection) =>
        collection.isOpenCollaboration,

      canWriteRoles: [
        RoleType.writer,
        RoleType.editor,
      ],

      canEditRoles: [
        RoleType.editor,
      ],
    }
  );

  /*
   * IDs already inside the target Room.
   *
   * These are not offered in the available lists.
   */
  const existingStoryIds = new Set(
    (colInView?.storyIdList ?? [])
      .map(
        (item) =>
          item?.storyId ||
          item?.story?.id
      )
      .filter(Boolean)
  );

  const existingCollectionIds = new Set(
    (colInView?.childCollections ?? [])
      .map(
        (item) =>
          item?.childCollectionId ||
          item?.childCollection?.id
      )
      .filter(Boolean)
  );
  const [tab,setTab]=useState(TABS.STORY)

  useEffect(() => {
    if (!id) return;

    dispatch(
      fetchCollectionProtected({
        id,
      })
    );
  }, [dispatch, id]);

  /*
   * IMPORTANT:
   *
   * Stories come from getMyStories, just as they did
   * in the original implementation.
   *
   * We don't depend on state.pages.myPages being loaded.
   */
  const storyFetcher = useCallback(
    (params = {}) => {
      return getMyStories(params);
    },
    []
  );


  const addStory = useCallback((story) => {
    setNewStories((previous) => {
      if (
        previous.some(
          (item) => item.id === story.id
        )
      ) {
        return previous;
      }

      return [...previous, story];
    });
  }, []);

  /*
   * Undo puts the story back into the available list.
   */
  const undoStory = useCallback((story) => {
    setNewStories((previous) =>
      previous.filter(
        (item) => item.id !== story.id
      )
    );
  }, []);

  const addCollection = useCallback(
    (collection) => {
      setNewCollections((previous) => {
        if (
          previous.some(
            (item) =>
              item.id === collection.id
          )
        ) {
          return previous;
        }

        return [...previous, collection];
      });
    },
    []
  );

  const undoCollection = useCallback(
    (collection) => {
      setNewCollections((previous) =>
        previous.filter(
          (item) =>
            item.id !== collection.id
        )
      );
    },
    []
  );
const save = async () => {
  if (!colInView || saving) {
    return;
  }

const storyList = newStories.filter(Boolean);

const collectionIdList = newCollections
  .filter(Boolean)
  .map((collection) => collection.id);

  if (
    storyList.length === 0 &&
    collectionIdList.length === 0
  ) {
    router.push(
      Paths.collection.createRoute(colInView.id)
    );

    return;
  }

  setSaving(true);

  try {
    const operations = [];

if (collectionIdList.length > 0) {
  operations.push(
    dispatch(
      addCollectionListToCollection({
        id: colInView.id,
        list: collectionIdList,
        profile: currentProfile,
      })
    )
  );
}

if (storyList.length > 0) {
  operations.push(
    dispatch(
      addStoryListToCollection({
        id: colInView.id,
        list: storyList,
        profile: currentProfile,
      })
    )
  );
}

    await Promise.all(operations);

    router.push(
      Paths.collection.createRoute(colInView.id)
    );
  } finally {
    setSaving(false);
  }
};




  if (!canSee || !canAdd) {
    return <NoPermissionUI />;
  }

  if (!colInView) {
    return (
      <IonContent className="bg-plumb-surface  dark:bg-base-bgDark">
      <main className="min-h-[100dvh] bg-plumb-surface  dark:bg-base-bgDark">
        <div className="mx-auto max-w-[50em] px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 rounded-xl bg-gray-200 dark:bg-plumb-surface Dark" />
            <div className="h-32 rounded-2xl bg-gray-200 dark:bg-plumb-surface Dark" />
            <div className="h-32 rounded-2xl bg-gray-200 dark:bg-plumb-surface Dark" />
          </div>
        </div>
      </main>
      </IonContent>
    );
  }

  const selectedCount =
    newStories.length +
    newCollections.length;

  return (
          <IonContent fullscreen={true} scrollY={true}>
                <ErrorBoundary>
    <main className={styles.pageShell.base+" "+styles.pageShell.scroll}>
  
    
     
<PlumbHead 
label={"Add to Room"}
title={colInView.title}
purpose=" Select stories or Rooms to
                  include."
                  buttons={[             <div
                    onClick={() =>
                      router.push(
                        Paths.collection.createRoute(
                          colInView.id
                        )
                      )
                    }
            
                className={[styles.button.base,styles.button.secondary+"  "].join(" ")}
                  >
                    View room
                  </div>,

                      <div
          type="button"
         onClick={save}
          className={`
            ${styles.button.base} 
            ${styles.button.primary} 
          
          `}
        >
          { saving
                    ? "Saving..."
                    : `Save${
                        selectedCount
                          ? ` (${selectedCount})`
                          : ""
                      }`}
                      </div>
                  ,     <div>
                    <span className="my-auto">
                <p  className={styles.text.muted+" text-center mx-8"}
                // className="text-sm font-medium  text-center mx-8 text-gray-800 ">
                >
                  {selectedCount === 0
                    ? "Nothing selected"
                    : `${selectedCount} selected`}
                </p>

                <p className="text-xs text-gray-500 text-center dark:text-gray-400">
                  Add them when you're ready.
                </p>
                </span>
              </div>]}/>

          <section className={styles.pageShell.body}>
            <div className="flex flex-row gap-2">
              <span className="">
              <select
                value={filterType}
                onChange={(event) =>
                  setFilterType(
                    event.target.value
                  )
                }
               className="
                           
                    border border-1 border-plumb-mint    dark:bg-transparent    bg-plumb-canvas
                            rounded-full
                            border
                        py-2
                      
                            text-plumb-mint px-2
                         
                            font-open-sans
                            text-sm
                        
                            outline-none
                            focus:border-button-primary-bg
                           
                      
                          "
     >
                {Object.entries(
                  filterTypes
                ).map(([key, value]) => (
                  <option
                    key={key}
                    value={value}
                  >
                    {value}
                  </option>
                ))}
         </select>
</span>
              <div className={styles.input.search.searchWrap}>
                  <span
                    aria-hidden="true"
                    className={styles.input.search.searchLabel}
                  >
                    Search
                  </span>

                  <input
                    id="room-search"
                    type="search"
                    value={search}
                   onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                    placeholder="Search..."
                className={styles.input.search.input}
                  />
                </div>
      
            </div>
   
            <div             className={styles.tabs.pill.container+" justify-around pb-4 "+styles.tabs.pill.wrapper}>
           
              <TabBar
           
                tabs={tabs}
                active={tab}
                onChange={setTab}
              />
      
 </div>  
 <span className="mt-4">
         {tab === TABS.STORY && (
            <>
      <div>
 
      {/* Selected stories */}
      <SelectedItems
        items={newStories}
        type="story"
        onUndo={undoStory}
        onOpen={(story) =>
          router.push(
            Paths.page.createRoute(story.id)
          )
        }
      />

      {/* Available stories */}
      <PaginatedList
        cacheKey={`add-stories-${colInView.id}`}
        fetcher={getMyStories}
        pageSize={8}
        className="space-y-2"
        renderItem={(story) => {
          if (!story) return null;

          // Already in target Room
          if (existingStoryIds.has(story.id)) {
            return null;
          }

          // Just selected — it belongs in Added, not here
          if (
            newStories.some(
              (item) => item.id === story.id
            )
          ) {
            return null;
          }

          // Search
          if (
            search.trim() &&
            !story.title
              ?.toLowerCase()
              .includes(
                search.trim().toLowerCase()
              )
          ) {
            return null;
          }

          // Feedback filter
          if (
            filterType === filterTypes.feedback
          ) {
            const status =
              story.status?.toLowerCase() || "";

            const title =
              story.title?.toLowerCase() || "";

            if (
              !status.includes("draft") &&
              !title.includes("workshop")
            ) {
              return null;
            }
          }

          return (
            <SelectableItem
              title={
                shortName(
                  story.title,
                  60
                ) || "Untitled"
              }
              subtitle={story.status}
              actionLabel="Add"
              accent="blue"
              onAction={() =>
                addStory(story)
              }
              onOpen={() =>
                router.push(
                  Paths.page.createRoute(
                    story.id
                  )
                )
              }
            />
          );
        }}
      />
    </div>
  

</>
              )}
               {tab === TABS.ROOM && 
(
  <div>




      {/* Available collections */}
      <PaginatedList
        cacheKey={`add-collections-${colInView.id}`}
        fetcher={getMyCollections}
        pageSize={8}
        className="space-y-2"
        renderItem={(collection) => {
          if (!collection) return null;

          // Never add this Room to itself
          if (
            collection.id === colInView.id
          ) {
            return null;
          }

          // Already inside target Room
          if (
            existingCollectionIds.has(
              collection.id
            )
          ) {
            return null;
          }

          // Just selected
          if (
            newCollections.some(
              (item) =>
                item.id === collection.id
            )
          ) {
            return null;
          }

          // Search
          if (
            search.trim() &&
            !collection.title
              ?.toLowerCase()
              .includes(
                search.trim().toLowerCase()
              )
          ) {
            return null;
          }

          // Feedback filter
          if (
            filterType ===
            filterTypes.feedback
          ) {
            const purpose =
              collection.purpose
                ?.toLowerCase() || "";

            if (
              collection.type !==
                "feedback" &&
              !purpose.includes(
                "feedback"
              )
            ) {
              return null;
            }
          }

          return (
            <SelectableItem
              title={
                shortName(
                  collection.title,
                  60
                ) || "Untitled"
              }
              subtitle={
                collection.purpose ||
                collection.type ||
                "Room"
              }
              actionLabel="Add"
              accent="purple"
              onAction={() =>
                addCollection(
                  collection
                )
              }
              onOpen={() =>
                router.push(
                  Paths.collection.createRoute(
                    collection.id
                  )
                )
              }
            />
          );
        }}
      />
    </div>
)
}
</span>

</section>
    </main>
    </ErrorBoundary>
    </IonContent>
  );
}

function NoPermissionUI() {
  const router = useIonRouter();

  return (
    <main className="min-h-[100dvh] bg-plumb-surface  dark:bg-base-bgDark">
      <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-plumb-surface Dark">
          <span className="text-xl">↗</span>
        </div>

        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-soft">
          Room
        </p>

        <h2 className="mt-2 font-serif text-2xl font-medium text-gray-900 dark:text-cream">
          You can't add to this Room
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          You don't currently have permission
          to add writing or Rooms here.
        </p>

        <div className="mt-6 flex gap-3">
          <Pill
            label="Go Back"
            onClick={() => router.goBack()}
         baseClass={styles.button.base+"  border border-1 border-plumb-accent-blue "+styles.button.accent}
             />

          <Pill
            label="Refresh"
            onClick={() =>
              window.location.reload()
            }
             baseClass={styles.button.base+"  border border-1 border-plumb-accent-blue "+styles.button.accent}
          
          />
        </div>
      </div>
    </main>
  );
}