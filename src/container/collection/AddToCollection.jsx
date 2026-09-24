

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

import StoryCollectionTabs from "../../components/page/StoryCollectionTabs.jsx";
import PaginatedList from "../../components/page/PaginatedList.jsx";
import Pill from "../../components/Pill.jsx";

import computePermissions from "../../core/compusePermissions.jsx";
import { RoleType } from "../../core/constants.js";
import shortName from "../../core/shortName.jsx";

const filterTypes = {
  filter: "Filter",
  recent: "Recent",
  oldest: "Oldest",
  feedback: "Feedback",
  AZ: "A-Z",
  ZA: "Z-A",
};





/**
 * Reusable selectable row.
 *
 * Available item:
 *     Add
 *
 * Selected item:
 *     Undo
 */
function SelectableItem({
  title,
  subtitle,
  actionLabel,
  onAction,
  onOpen,
  accent = "blue",
}) {
  const borderClass =
    accent === "purple"
      ? "border-purple/30"
      : "border-blueSea/30";

  return (
    <div
      className={[
        "flex items-center gap-3 rounded-2xl border",
        "bg-base-bg px-4 py-3 shadow-sm",
        "transition hover:shadow-md",
        "dark:bg-base-surfaceDark",
        borderClass,
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 text-left"
      >
        <p className="truncate text-sm font-medium text-gray-900 dark:text-cream">
          {title || "Untitled"}
        </p>

        {subtitle ? (
          <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        ) : null}
      </button>

      <Pill
        label={actionLabel}
        onClick={onAction}
        variant="primary"
        baseClass={
          actionLabel === "Undo"
            ? "shrink-0 border border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-600 dark:bg-base-surfaceDark dark:text-cream"
            : "shrink-0 border border-blueSea bg-blueSea text-white"
        }
      />
    </div>
  );
}

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
function SelectedItems({
  items,
  type,
  onUndo,
  onOpen,
}) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="mb-6 rounded-2xl border border-blueSea/20 bg-softBlue/20 p-3 dark:bg-base-surfaceDark">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blueSea">
          Added
        </p>

        <span className="text-xs text-gray-500 dark:text-gray-400">
          {items.length}
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <SelectableItem
            key={item.id}
            title={
              shortName(item.title, 60) ||
              "Untitled"
            }
            subtitle={
              type === "story"
                ? item.status
                : item.purpose || item.type || "Room"
            }
            actionLabel="Undo"
            onAction={() => onUndo(item)}
            onOpen={() => onOpen(item)}
            accent={type === "story" ? "blue" : "purple"}
          />
        ))}
      </div>
    </div>
  );
}

function EmptySelection({ children }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-base-bg px-6 py-10 text-center dark:border-gray-700 dark:bg-base-surfaceDark">
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
  const [tab, setTab] = useState("page");

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

  /*
   * Fetch the target Room.
   */
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
  // const save = async () => {
  //   if (!colInView || saving) {
  //     return;
  //   }

  //   const storyIdList = newStories
  //     .filter(Boolean)
  //     .map((story) => story.id);

  //   const collectionIdList =
  //     newCollections
  //       .filter(Boolean)
  //       .map((collection) => collection.id);

  //   /*
  //    * Nothing selected:
  //    * simply return to the Room.
  //    */
  //   if (
  //     storyIdList.length === 0 &&
  //     collectionIdList.length === 0
  //   ) {
  //     router.push(
  //       Paths.collection.createRoute(
  //         colInView.id
  //       )
  //     );

  //     return;
  //   }

  //   setSaving(true);

  //   try {
  //     const operations = [];

  //     if (collectionIdList.length > 0) {
  //       operations.push(
  //         dispatch(
  //           addCollectionListToCollection({
  //             id: colInView.id,
  //             list: collectionIdList,
  //             profile: currentProfile,
  //           })
  //         )
  //       );
  //     }

  //     if (storyIdList.length > 0) {
  //       operations.push(
  //         dispatch(
  //           addStoryListToCollection({
  //             id: colInView.id,
  //             list: storyIdList,
  //             profile: currentProfile,
  //           })
  //         )
  //       );
  //     }

  //     await Promise.all(operations);

  //     router.push(
  //       Paths.collection.createRoute(
  //         colInView.id
  //       )
  //     );
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  if (!canSee || !canAdd) {
    return <NoPermissionUI />;
  }

  if (!colInView) {
    return (
      <IonContent className="bg-base-surface dark:bg-base-bgDark">
      <main className="min-h-[100dvh] bg-base-surface dark:bg-base-bgDark">
        <div className="mx-auto max-w-[50em] px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 rounded-xl bg-gray-200 dark:bg-base-surfaceDark" />
            <div className="h-32 rounded-2xl bg-gray-200 dark:bg-base-surfaceDark" />
            <div className="h-32 rounded-2xl bg-gray-200 dark:bg-base-surfaceDark" />
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
          <IonContent className="bg-base-surface dark:bg-base-bgDark">
    <main className="min-h-[100%] overflow-y-auto bg-base-surface dark:bg-base-bgDark">
      <ErrorBoundary>
        <div className="mx-auto w-full max-w-[50em] px-4 pb-24 pt-8 sm:px-6">

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-soft">
                  Add to Room
                </p>

                <h1 className="mt-2 truncate font-serif text-3xl font-medium tracking-tight text-gray-900 dark:text-cream sm:text-4xl">
                  {colInView.title ||
                    "Untitled"}
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Select stories or Rooms to
                  include.
                </p>
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
                className="shrink-0 rounded-full border border-gray-300 bg-base-bg px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blueSea hover:text-blueSea dark:border-gray-700 dark:bg-base-surfaceDark dark:text-cream"
              >
                View Room
              </button>
            </div>

            {/* Save */}
            <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white/60 px-4 py-3 dark:border-gray-700 dark:bg-base-surfaceDark/60">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-cream">
                  {selectedCount === 0
                    ? "Nothing selected"
                    : `${selectedCount} selected`}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add them when you're ready.
                </p>
              </div>

              <Pill
                label={
                  saving
                    ? "Saving..."
                    : `Save${
                        selectedCount
                          ? ` (${selectedCount})`
                          : ""
                      }`
                }
                onClick={save}
                variant="primary"
                baseClass="border border-blueSea bg-blueSea text-white"
              />
            </div>
          </header>

          {/* Search / filter */}
          <section className="mb-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={filterType}
                onChange={(event) =>
                  setFilterType(
                    event.target.value
                  )
                }
                className="select w-full rounded-full border border-emerald-300 bg-base-bg text-sm text-emerald-800 shadow-sm focus:border-soft focus:outline-none focus:ring-1 focus:ring-soft dark:bg-base-surfaceDark dark:text-cream sm:w-40"
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

              <label className="flex min-w-0 flex-1 items-center rounded-full border border-emerald-300 bg-base-bg px-4 shadow-sm focus-within:border-soft focus-within:ring-1 focus-within:ring-soft dark:bg-base-surfaceDark">
                <span className="mr-2 shrink-0 text-xs font-semibold uppercase tracking-wide text-soft">
                  Search
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="title..."
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-cream"
                />
              </label>
            </div>
          </section>

          {/* Main selector */}
          <section className="rounded-3xl border border-gray-200 bg-white/50 p-3 shadow-sm dark:border-gray-700 dark:bg-base-surfaceDark/40 sm:p-5">

         <StoryCollectionTabs
  tab={tab}
  setTab={setTab}

  storyList={() => (
    <div>
      <SelectionHeader
        eyebrow="Writing"
        title="Stories"
        count={newStories.length}
      />

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
  )}

  colList={() => (
    <div>
      <SelectionHeader
        eyebrow="Rooms"
        title="Collections & Rooms"
        count={newCollections.length}
      />

      {/* Selected collections */}
      <SelectedItems
        items={newCollections}
        type="collection"
        onUndo={undoCollection}
        onOpen={(collection) =>
          router.push(
            Paths.collection.createRoute(
              collection.id
            )
          )
        }
      />

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
  )}
/>
          </section>
        </div>
      </ErrorBoundary>
    </main>
    </IonContent>
  );
}

function NoPermissionUI() {
  const router = useIonRouter();

  return (
    <main className="min-h-[100dvh] bg-base-surface dark:bg-base-bgDark">
      <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-base-surfaceDark">
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
            baseClass="border border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-base-surfaceDark dark:text-cream"
          />

          <Pill
            label="Refresh"
            onClick={() =>
              window.location.reload()
            }
            baseClass="border border-blueSea bg-blueSea text-white"
          />
        </div>
      </div>
    </main>
  );
}