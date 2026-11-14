
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

import {
  getStory,
} from "../../actions/StoryActions";

import {
  fetchCollectionProtected,
  getMyCollections,
} from "../../actions/CollectionActions";

import CreateCollectionForm from "../../components/collection/CreateCollectionForm";
import AddToItem from "../../components/collection/AddToItem";
import PaginatedList from "../../components/page/PaginatedList";
import Pill from "../../components/Pill";

import shortName from "../../core/shortName";
import { useDialog } from "../../domain/usecases/useDialog";
import styles from "../../styles/style";
import usePaginatedResource from "../../core/usePaginatedResource";
import EmptyState from "../../components/general/EmptyState";

// ── Helpers ──────────────────────────────────────────

function getPlainText(value) {
  if (!value) return "";

  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function isForbiddenError(error) {
  return (
    error?.status === 403 ||
    error?.statusCode === 403 ||
    error?.response?.status === 403
  );
}

// ── Item Preview ─────────────────────────────────────

function ItemPreview({ item, type }) {
  const isStory = type === "story";

  const title =
    shortName(item?.title, 60) || "Untitled";

  const description = getPlainText(item?.description);

  const shortDescription =
    description.length > 140
      ? `${description.slice(0, 140).trimEnd()}…`
      : description;

  return (
    <section
      aria-label="Selected item"
      className={`
        ${styles.addToCollection.card}
        ${styles.addToCollection.itemCard}
      `}
    >
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className={styles.addToCollection.itemType}>
            {isStory ? "Story" : "Collection"}
          </p>

          <h2 className={styles.addToCollection.itemTitle}>
            {title}
          </h2>

          {shortDescription && (
            <p className={styles.addToCollection.itemDescription}>
              {shortDescription}
            </p>
          )}

          {isStory && item?.status && (
            <p className={styles.addToCollection.itemStatus}>
              {item.status}
            </p>
          )}
        </div>

        <span className={styles.addToCollection.itemBadge}>
          {isStory ? "Writing" : "Room"}
        </span>
      </div>
    </section>
  );
}

// ── Collection Header ────────────────────────────────

function CollectionHeader() {
  return (
    <div className="mb-3">
      <p className={styles.addToCollection.eyebrow}>
        Your Rooms
      </p>

      <h2 className={styles.addToCollection.sectionTitle}>
        Where should this go?
      </h2>

      <p className={styles.addToCollection.body}>
        Add it to one or more Rooms.
      </p>
    </div>
  );
}

// ── Loading State ────────────────────────────────────

function LoadingState() {
  return (
    <main className={styles.addToCollection.content}>
      <div className={`${styles.addToCollection.wrap} py-12`}>
        <div
          role="status"
          aria-label="Loading item"
          aria-live="polite"
          className={styles.addToCollection.loading}
        >
          <div className={`${styles.addToCollection.skeleton} h-8 w-2/3`} />
          <div className={`${styles.addToCollection.skeleton} h-32`} />
          <div className={`${styles.addToCollection.skeleton} h-20`} />
          <div className={`${styles.addToCollection.skeleton} h-20`} />
        </div>
      </div>
    </main>
  );
}

// ── Empty Collections ─────────────────────────────────

function EmptyCollections() {
  return (
    <div
      role="status"
      className={styles.addToCollection.empty}
    >
      You don't have any Rooms to add this to yet.
    </div>
  );
}

// ── Not Found ─────────────────────────────────────────

function NotFoundState({ type }) {
  const router = useIonRouter();

  return (
    <main className={styles.addToCollection.content}>
      <div className={styles.addToCollection.state}>
        <p className={styles.addToCollection.eyebrow}>
          {type === "story" ? "Story" : "Item"}
        </p>

        <h1 className={styles.addToCollection.stateHeading}>
          We couldn't find this item
        </h1>

        <p className={styles.addToCollection.stateBody}>
          It may have been removed, or you may no longer
          have access to it.
        </p>

        <div className={styles.addToCollection.stateAction}>
          <Pill
            label="Go Back"
            onClick={() => router.goBack()}
          />
        </div>
      </div>
    </main>
  );
}

// ── No Permission ─────────────────────────────────────

function NoPermissionUI() {
  const router = useIonRouter();

  return (
    <main className={styles.addToCollection.content}>
      <div className={styles.addToCollection.state}>
        <div className={styles.addToCollection.stateIcon}>
          <span aria-hidden="true" className="text-xl">
            ↗
          </span>
        </div>

        <p className={styles.addToCollection.eyebrow}>
          Rooms
        </p>

        <h1 className={styles.addToCollection.stateHeading}>
          You can't add this item
        </h1>

        <p className={styles.addToCollection.stateBody}>
          You don't currently have access to add this
          item to your Rooms.
        </p>

        <div className={styles.addToCollection.stateAction}>
          <Pill
            label="Go Back"
            onClick={() => router.goBack()}
          />
        </div>
      </div>
    </main>
  );
}

// ── Main Component ───────────────────────────────────
const PAGE_SIZE=8
export default function AddStoryToCollection() {
  const router = useIonRouter();
  const dispatch = useDispatch();


  const { id, type } = useParams();

  const itemType = type || "story";
  const isStory = itemType === "story";

  const pageInView = useSelector(
    (state) => state.pages.pageInView
  );

  const initialItem =
    isStory && pageInView?.id === id
      ? pageInView
      : null;

  const [item, setItem] = useState(initialItem);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const {
    openDialog,
    closeDialog,
    resetDialog,
  } = useDialog();

   const resource = usePaginatedResource({
    cacheKey:`add-item-${itemType}-${id}-collections`,
    fetcher:getMyCollections,
    search:search,
    enabled:true, 
    infinite:true,
    pageSize:PAGE_SIZE
  })
  useEffect(() => {
    let cancelled = false;

    if (!id) {
      setItem(null);
      setError("Missing item id.");
      setLoading(false);
      return undefined;
    }

    if (!["story", "collection"].includes(itemType)) {
      setItem(null);
      setError(`Unsupported item type: ${itemType}`);
      setLoading(false);
      return undefined;
    }

    const loadItem = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = isStory
          ? await dispatch(getStory({ id }))
          : await dispatch(fetchCollectionProtected({ id }));

        if (!result) {
          throw new Error(`Unable to load ${itemType}.`);
        }

        checkResult(
          result,
          (payload) => {
            if (cancelled) return;

            const loadedItem = isStory
              ? payload?.story
              : payload?.collection || payload;

            if (!loadedItem) {
              setItem(null);
              setError(`${isStory ? "Story" : "Collection"} not found.`);
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

  // ── Create Room ────────────────────────────────────

  const openCreateCollection = useCallback(() => {
    if (!item) return;

    openDialog({
      disagree: null,
      scrollY: false,
      text: (
        <CreateCollectionForm
          initPages={isStory ? [item] : []}
          onClose={resetDialog}
        />
      ),
      
      // onClose: closeDialog,
      breakpoint: 1,
    });
  }, [
    openDialog,
    closeDialog,
    resetDialog,
    isStory,
    item,
  ]);

  // ── Render collections ─────────────────────────────

  const renderCollection = useCallback(
    (collection) => {
      if (!collection?.id) return null;

      if (
        itemType === "collection" &&
        collection.id === item?.id
      ) {
        return null;
      }

      return (
        <AddToItem
          col={collection}
          item={item}
          itemType={itemType}
        />
      );
    },
    [item, itemType]
  );

  // ── Loading ────────────────────────────────────────

  if (loading) {
    return (
      <IonContent className={styles.addToCollection.content}>
        <LoadingState />
      </IonContent>
    );
  }

  // ── Errors ─────────────────────────────────────────

  if (!item || error) {
    return (
      <IonContent className={styles.addToCollection.content}>
        {isForbiddenError(error) ? (
          <NoPermissionUI />
        ) : (
          <NotFoundState type={itemType} />
        )}
      </IonContent>
    );
  }

  // ── Main View ──────────────────────────────────────

  return (
    <IonContent fullscreen={true}
    scrollY={true}>
      <main className={styles.pageShell.base}>
        <ErrorBoundary>
          <div className={styles.pageShell.head}>
       
 <button
                  type="button"
                  onClick={() => router.goBack()}
                  className={styles.addToCollection.backButton+" mb-4"}
                >
                  Back
                </button>
            <header className={styles.pageShell.head}>
              <div className="flex items-start justify-between gap-4 px-2">
                <div className="min-w-0">
                  <p className={styles.addToCollection.eyebrow}>
                    Add to Rooms
                  </p>

                  <h1 className={styles.addToCollection.heading}>
                    Choose where this belongs
                  </h1>

                  <p className={styles.addToCollection.body+" mb-4 "}>
                    Add this {isStory ? "story" : "item"} to
                    as many Rooms as you want.
                  </p>
                </div>

               
              </div>
            </header>

            {/* Selected Item */}

            <div className={styles.addToCollection.section}>
              <ItemPreview
                item={item}
                type={itemType}
              />
            </div>

            {/* Create Room */}

            <section
              aria-labelledby="create-room-heading"
              className={styles.addToCollection.section}
            >
              <div
                className={`
                  ${styles.pageShell.elevated}
                  ${styles.addToCollection.createRow}
                `}
              >
                <div className="min-w-0">
                  <h2
                    id="create-room-heading"
                    className={styles.addToCollection.createTitle}
                  >
                    Need somewhere new?
                  </h2>

                  <p className={styles.addToCollection.createDescription}>
                    Create a Room for this and other work.
                  </p>
                </div>

                <Pill
                  label="New Room"
                  onClick={openCreateCollection}
                  baseClass=""
                  
                />
              </div>
            </section>

            {/* Existing Rooms */}

          </div>
          <div className={styles.pageShell.body}>
      
              <div id="existing-rooms-heading">
                <CollectionHeader />
              </div>
  <section aria-labelledby="existing-rooms-heading"
          className={styles.pageShell.body}>
     
                <label
                  htmlFor="room-search"
                  className="sr-only"
                >
                  Search Rooms
                </label>

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
                      setSearch(event.target.value)
                    }
                    placeholder="Room title..."
                className={styles.input.search.input}
                  />
                </div>
     

              <div className={styles.pageShell.base}>
                   <PaginatedList
                 renderItem={renderCollection}
                 emptyState={ <EmptyState
              text={
                search
                  ? "No matching stories."
                  : "No stories yet."
              }
            />}
            className=""
                resource={resource}
                />
             
              </div>
            </section>
          </div>
        </ErrorBoundary>
      </main>
    </IonContent>
  );
}
