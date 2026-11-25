
import { useRef } from "react";
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/react";

import usePaginatedResource from "../../core/usePaginatedResource";

import DashboardItem from "../page/DashboardItem";
import BookDashboardItem from "./BookDashboardItem";

// Keep the selector stable between renders.
const selectFeedResponse = (response) => ({
  items: response?.items ?? [],
  totalCount: response?.totalCount ?? 0,
});

// ─── Feed item ───────────────────────────────────────────────────────────────

function FeedItem({
  item,
  index,
  forFeedback,
  shortenTo,
  isGrid,
}) {
  const kind = String(item?.kind ?? "").toLowerCase();
  const content = item?.content;

  if (!content?.id) return null;

  // Pages / stories are the primary feed content.
  if (kind === "page" || kind === "story") {
    return (
      <DashboardItem
        key={content.id}
        item={content}
        page={content}
        index={index}
        shortenTo={shortenTo}
        forFeedback={forFeedback}
        isGrid={isGrid}
      />
    );
  }

  // Books, rooms, and collections.
  if (["book", "room","library","feedback", "collection"].includes(kind)) {
    return (
      <BookDashboardItem
        book={content}
      />
    );
  }

  return null;
}

// ─── Collection Feed ────────────────────────────────────────────────────────

/**
 * CollectionFeed
 *
 * Displays the chronological contents of a Home collection.
 *
 * Props:
 *   collection       - Home collection object
 *   fetcher          - Unified paginated feed thunk
 *   emptyState       - Existing EmptyState component
 *   forFeedback      - Passed to DashboardItem
 *   shortenTo        - Passed to DashboardItem
 *   isGrid            - Passed to DashboardItem
 *   pageSize          - Items per page (default 12)
 */

function CollectionFeed({
  collection,
  fetcher,
  emptyState,
  forFeedback,
  shortenTo,
  isGrid = false,
  pageSize = 12,
}) {
  const loadingMoreRef = useRef(false);

  const collectionId = collection?.id;

  const {
    page,
    setPage,
    items,
    isLoading,
    hasMore,
    retry,
    error,
  } = usePaginatedResource({
    cacheKey: `home-feed:${collectionId}`,
    fetcher,
    params: {
      id: collectionId,
    },
    pageSize,
    enabled: Boolean(collectionId && fetcher),
    infinite: true,
    select: selectFeedResponse,
  });

  // ─── Loading ──────────────────────────────────────────────────────────────

  if (isLoading && items.length === 0) {
    return (
      <div className="flex justify-center py-12 text-sm text-plumb-muted dark:text-plumb-dark-muted">
        Loading your Home...
      </div>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────

  if (error && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <p className="text-sm text-plumb-muted dark:text-plumb-dark-muted">
          Couldn't load your Home.
        </p>

        <button
          type="button"
          onClick={retry}
          className="text-sm font-medium text-plumb-mint hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  // ─── Empty State ──────────────────────────────────────────────────────────

  if (!items.length) {
    return emptyState ?? null;
  }

  // ─── Infinite Scroll ─────────────────────────────────────────────────────

  const handleLoadMore = async (event) => {
    if (loadingMoreRef.current || !hasMore || isLoading) {
      event.target.complete();
      return;
    }

    loadingMoreRef.current = true;

    try {
      setPage(page + 1);
    } finally {
      loadingMoreRef.current = false;
      event.target.complete();
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="w-[100%] max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <FeedItem
            key={`${item.kind}-${item.content?.id}`}
            item={item}
            index={index}
            forFeedback={forFeedback}
            shortenTo={shortenTo}
            isGrid={isGrid}
          />
        ))}
      </div>

      {error && items.length > 0 && (
        <div className="flex justify-center py-4">
          <button
            type="button"
            onClick={retry}
            className="text-sm text-plumb-mint hover:underline"
          >
            Couldn't load more. Try again.
          </button>
        </div>
      )}

      <IonInfiniteScroll
        threshold="200px"
        disabled={!hasMore || isLoading || Boolean(error)}
        onIonInfinite={handleLoadMore}
      >
        <IonInfiniteScrollContent
          loadingSpinner="bubbles"
          loadingText="Loading more..."
        />
      </IonInfiniteScroll>
    </div>
  );
}

export default CollectionFeed;
