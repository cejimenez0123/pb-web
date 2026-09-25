import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { IonContent, useIonRouter } from "@ionic/react";

import ErrorBoundary from "../../ErrorBoundary";
import Paths from "../../core/paths";
import checkResult from "../../core/checkResult";
import { getStory } from "../../actions/StoryActions";
import {
  fetchCollectionProtected,
  getMyCollections,
  setCollections,
} from "../../actions/CollectionActions";

import CreateCollectionForm from "../../components/collection/CreateCollectionForm";
import AddToItem from "../../components/collection/AddToItem";
import PaginatedList from "../../components/page/PaginatedList";
import Pill from "../../components/Pill";

import shortName from "../../core/shortName";
import truncate from "html-truncate";
import { useDialog } from "../../domain/usecases/useDialog";

const WRAP = "mx-auto w-full max-w-[50em] px-4 sm:px-6";
const CARD =
  "rounded-2xl border border-gray-200 bg-white/60 shadow-sm dark:border-gray-700 dark:bg-base-surfaceDark/60";

const filterTypes = {
  filter: "Filter",
  recent: "Recent",
  oldest: "Oldest",
  feedback: "Feedback",
  AZ: "A-Z",
  ZA: "Z-A",
};

function ItemPreview({ item, type }) {
  const isStory = type === "story";

  const title =
    shortName(item?.title, 60) ||
    "Untitled";

  const description = item?.description
    ? truncate(item.description, 140)
    : null;

  return (
    <section className={`${CARD} p-5`}>
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-soft">
            {isStory ? "Story" : "Collection"}
          </p>

          <h2 className="mt-2 truncate font-serif text-2xl font-medium tracking-tight text-gray-900 dark:text-cream">
            {title}
          </h2>

          {description ? (
            <div
              className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400"
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          ) : null}

          {isStory && item?.status ? (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {item.status}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() =>
            isStory
              ? null
              : null
          }
          className="shrink-0 rounded-full border border-gray-300 bg-base-bg px-3 py-1.5 text-xs text-gray-600 dark:border-gray-700 dark:bg-base-surfaceDark dark:text-gray-300"
        >
          {isStory ? "Writing" : "Room"}
        </button>
      </div>
    </section>
  );
}

function CollectionHeader() {
  return (
    <div className="mb-3">
  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-soft">
  Your Rooms
</p>

<h2 className="mt-1 font-serif text-2xl font-medium text-gray-900 dark:text-cream">
  Where should this go?
</h2>

     <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400">
  Add it to one or more Rooms.
</p>
    </div>
  );
}

function LoadingState() {
  return (
    <main className="min-h-[100dvh] bg-base-surface dark:bg-base-bgDark">
      <div className={`${WRAP} py-12`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 rounded-xl bg-gray-200 dark:bg-base-surfaceDark" />
          <div className="h-32 rounded-2xl bg-gray-200 dark:bg-base-surfaceDark" />
          <div className="h-20 rounded-2xl bg-gray-200 dark:bg-base-surfaceDark" />
          <div className="h-20 rounded-2xl bg-gray-200 dark:bg-base-surfaceDark" />
        </div>
      </div>
    </main>
  );
}

function EmptyCollections() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-base-bg px-6 py-10 text-center dark:border-gray-700 dark:bg-base-surfaceDark">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        You don't have any Rooms to add this to yet.
      </p>
    </div>
  );
}

function NotFoundState({ type }) {
  const router = useIonRouter();

  return (
    <main className="min-h-[100dvh] bg-base-surface dark:bg-base-bgDark">
      <div
        className={`${WRAP} flex min-h-[70dvh] flex-col items-center justify-center text-center`}
      >
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-soft">
          {type === "story" ? "Story" : "Item"}
        </p>

        <h1 className="mt-2 font-serif text-2xl font-medium text-gray-900 dark:text-cream">
          We couldn't find this item
        </h1>

        <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
          It may have been removed, or you may no longer
          have access to it.
        </p>

        <div className="mt-6">
          <Pill
            label="Go Back"
            onClick={() => router.goBack()}
            baseClass="border border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-base-surfaceDark dark:text-cream"
          />
        </div>
      </div>
    </main>
  );
}

function NoPermissionUI() {
  const router = useIonRouter();

  return (
    <main className="min-h-[100dvh] bg-base-surface dark:bg-base-bgDark">
      <div
        className={`${WRAP} flex min-h-[70dvh] flex-col items-center justify-center text-center`}
      >
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-base-surfaceDark">
          <span className="text-xl">↗</span>
        </div>

        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-soft">
          Rooms
        </p>

        <h2 className="mt-2 font-serif text-2xl font-medium text-gray-900 dark:text-cream">
          You can't add this item
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
          You don't currently have access to add this
          item to your Rooms.
        </p>

        <div className="mt-6">
          <Pill
            label="Go Back"
            onClick={() => router.goBack()}
            baseClass="border border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-base-surfaceDark dark:text-cream"
          />
        </div>
      </div>
    </main>
  );
}

export default function AddStoryToCollection() {
  const router = useIonRouter();
  const dispatch = useDispatch();

  const { id, type } = useParams();
  const isStory = type === "story";
  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

 const pageInView = useSelector((state) => state.pages.pageInView);


  const [item, setItem] = useState(
    type === "collection"
      ? collectionInView
      : pageInView
  );

  const [loading, setLoading] = useState(!item);
  const [error, setError] = useState(null);

  const [filterType, setFilterType] =
    useState(filterTypes.filter);
 const itemType = type || "story";
  const [search, setSearch] = useState("");
const {
  openDialog,
  closeDialog,
  resetDialog,
} = useDialog();



useEffect(() => {
  if (!id) {
    setError("Missing item id.");
    setLoading(false);
    return;
  }

  let cancelled = false;

  const loadItem = async () => {
    setLoading(true);
    setError(null);

    try {
      const result =
        itemType === "story"
          ? await dispatch(getStory({ id }))
          : itemType === "collection"
            ? await dispatch(fetchCollectionProtected({ id }))
            : null;

      if (!result) {
        throw new Error(`Unsupported item type: ${itemType}`);
      }

      checkResult(
        result,
        (payload) => {
          if (cancelled) return;

          const loadedItem =
            itemType === "story"
              ? payload?.story
              : payload?.collection || payload;

          if (!loadedItem) {
            setItem(null);
            setError(
              `${isStory ? "Story" : "Collection"} not found.`
            );
            return;
          }

          setItem(loadedItem);
        },
        (requestError) => {
          if (cancelled) return;

          setItem(null);
          setError(requestError);
        }
      );
    } catch (requestError) {
      if (cancelled) return;

      setItem(null);
      setError(requestError);
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  loadItem();

  return () => {
    cancelled = true;
  };
}, [dispatch, id, itemType, isStory]);
  /*
   * Keep the profile's collections in Redux if the
   * existing AddToItem / collection flow expects them.
   *
   * This is deliberately isolated from item loading.
   */


const openCreateCollection = useCallback(() => {
  openDialog({
    disagree: null,
    scrollY: false,
    text: (
      <CreateCollectionForm
        initPages={isStory ? [item] : []}
        onClose={resetDialog}
      />
    ),
    disagreeText: "Close",
    onClose: closeDialog,
    breakpoint: 1,
  });
}, [
  openDialog,
  closeDialog,
  resetDialog,
  isStory,
  item,
]);
  const normalizedSearch = search
    .trim()
    .toLowerCase();
const renderCollection = useCallback(
  (collection) => {
    if (!collection?.id) {
      return null;
    }

    if (
      itemType === "collection" &&
      collection.id === item?.id
    ) {
      return null;
    }

    return (
<AddToItem
  key={collection.id}
  col={collection}
  item={item}
  itemType={itemType}
/>
    );
  },
  [item, itemType]
);

  if (loading) {
    return (
      <IonContent className="bg-base-surface dark:bg-base-bgDark">
        <LoadingState />
      </IonContent>
    );
  }

  if (!item || error) {
    return (
      <IonContent className="bg-base-surface dark:bg-base-bgDark">
        <NotFoundState type={itemType} />
      </IonContent>
    );
  }

  /*
   * The old implementation did not have a permission
   * check on the ITEM itself. AddToItem remains the place
   * where collection-level permission/mutation rules live.
   *
   * This avoids incorrectly assuming that permission to
   * view an item means permission to add it everywhere.
   */

  return (
    <IonContent className="bg-base-surface dark:bg-base-bgDark">
      <main className="min-h-[100dvh] bg-base-surface dark:bg-base-bgDark">
        <ErrorBoundary>
          <div className={`${WRAP} pb-24 pt-8`}>
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-soft">
                    Add to Rooms
                  </p>

                  <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-gray-900 dark:text-cream sm:text-4xl">
                    Choose where this belongs
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Add this {isStory ? "story" : "item"} to
                    as many Rooms as you want.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.goBack()
                  }
                  className="shrink-0 rounded-full border border-gray-300 bg-base-bg px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blueSea hover:text-blueSea dark:border-gray-700 dark:bg-base-surfaceDark dark:text-cream"
                >
                  Back
                </button>
              </div>
            </header>

            {/* Item */}
            <div className="mb-8">
              <ItemPreview
                item={item}
                type={itemType}
              />
            </div>

            {/* Create Room */}
            <section className="mb-8">
              <div
                className={`${CARD} flex items-center justify-between gap-4 p-4`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-cream">
                    Need somewhere new?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    Create a Room for this and other work.
                  </p>
                </div>

                <Pill
                  label="New Room"
                  onClick={openCreateCollection}
                  variant="primary"
                  baseClass="shrink-0 border border-blueSea bg-blueSea text-white"
                />
              </div>
            </section>

            {/* Collection controls */}
            <section>
              <CollectionHeader />

              <div className="mb-5 flex flex-col gap-3 sm:flex-row">
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
                    placeholder="Room title..."
                    className="min-w-0 flex-1 bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-cream"
                  />
                </label>
              </div>

              <div className={`${CARD} p-3 sm:p-5`}>
                <PaginatedList
                  cacheKey={`add-item-${itemType}-${item.id}-collections`}
                  fetcher={getMyCollections}
                  pageSize={8}
                  className="space-y-2"
                  renderItem={renderCollection}
                  emptyState={
                    <EmptyCollections />
                  }
                />
              </div>
            </section>
          </div>

    
        </ErrorBoundary>
      </main>
    </IonContent>
  );
}