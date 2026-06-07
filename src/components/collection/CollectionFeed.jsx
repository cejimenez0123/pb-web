import { useEffect, useState, useCallback, useRef } from "react";
import { IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/react";
import { motion } from "framer-motion";
import { useIonRouter } from "@ionic/react";
;
import BookDashboardItem from "../collection/BookDashboardItem";
import Paths from "../../core/paths";
import DashboardItem from "../page/DashboardItem";

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: "easeOut" } },
};

// ─── Scoring ──────────────────────────────────────────────────────────────────
// 75 % recency, 25 % engagement (roles count as proxy for approval)

const RECENCY_WEIGHT = 0.75;
const ENGAGEMENT_WEIGHT = 0.25;

function scoreItem(item, oldestMs, newestMs, maxEngagement) {
  const updated = item.updated ? new Date(item.updated).getTime() : 0;
  const range = newestMs - oldestMs || 1;
  const recencyScore = (updated - oldestMs) / range; // 0–1

  const engagementScore =
    maxEngagement > 0
      ? (item.roles?.length ?? item._rolesCount ?? 0) / maxEngagement
      : 0;

  return RECENCY_WEIGHT * recencyScore + ENGAGEMENT_WEIGHT * engagementScore;
}


function buildSortedFeed(stories, subCollections) {
  const allItems = [
    ...(Array.isArray(stories) ? stories.map((s) => ({ ...s, _feedType: "story" })) : []),
    ...(Array.isArray(subCollections) ? subCollections.map((c) => ({ ...c, _feedType: "collection" })) : []),
  ];



  if (!allItems.length) return [];

  const timestamps = allItems.map((i) =>
    i.updated ? new Date(i.updated).getTime() : 0
  );
  const oldestMs = Math.min(...timestamps);
  const newestMs = Math.max(...timestamps);

  const engagements = allItems.map((i) => i.roles?.length ?? i._rolesCount ?? 0);
  const maxEngagement = Math.max(...engagements, 1);

  return allItems
    .map((item) => ({
      ...item,
      _score: scoreItem(item, oldestMs, newestMs, maxEngagement),
    }))
    .sort((a, b) => b._score - a._score);
}

// ─── Feed item label chip ─────────────────────────────────────────────────────

function TypeChip({ type }) {
  const isCollection = type === "collection";
  return (
    <span
      className={`text-[0.65rem] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full
        ${isCollection
          ? "bg-purple/10 text-purple border border-purple/30"
          : "bg-blue/10 text-blue border border-blue/30"
        }`}
    >
      {isCollection ? "sub-collection" : "page"}
    </span>
  );
}

// ─── Single feed row ──────────────────────────────────────────────────────────

function FeedRow({ item, index, forFeedback, shortenTo, isGrid }) {
  const router = useIonRouter();
  const isCollection = item._feedType === "collection";

  if (isCollection) {
    return (
      <div
        onClick={() => router.push(Paths.collection.createRoute(item.id), "forward")}
        className="cursor-pointer my-2"
      >
        <div
          className="
            border border-purple/40 rounded-2xl px-4 py-3
            bg-base-bg dark:bg-base-bgDark shadow-sm
            active:scale-[0.98] transition-transform
          "
        >
          <div className="flex items-center gap-2 mb-1">
            <TypeChip type="collection" />
            {item.type && (
              <span className="text-[0.65rem] text-soft/60 dark:text-cream/40 uppercase tracking-wider">
                {item.type}
              </span>
            )}
          </div>
          <h5 className="text-[0.95rem] font-medium text-soft dark:text-cream truncate">
            {item.title || "Untitled"}
          </h5>
          {item.purpose ? (
            <p className="text-[0.75rem] text-soft/60 dark:text-cream/50 mt-0.5 line-clamp-2">
              {item.purpose}
            </p>
          ) : null}
          <div className="flex gap-3 mt-2 text-[0.7rem] text-soft/50 dark:text-cream/40">
            {item.storyIdList?.length != null && (
              <span>{item.storyIdList.length} pages</span>
            )}
            {item._rolesCount != null && (
              <span>{item._rolesCount} engaged</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // story / page
  return (
    <div className="my-2">
      <div className="flex items-center gap-2 px-1 mb-1">
        <TypeChip type="story" />
      </div>
      {item.authorId ? (
        <DashboardItem
          key={index}
          item={item}
          index={index}
          shortenTo={shortenTo}
          forFeedback={forFeedback}
          isGrid={isGrid}
          page={item}
        />
      ) : (
        <BookDashboardItem book={item} />
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * CollectionFeed
 *
 * Props:
 *   collection       – the root Collection object (with storyIdList + childCollections already resolved, or left empty for async fetch)
 *   fetchStories     – async (page, pageSize) => Story[]          — called for paginated story pages
 *   fetchSubCollections – async () => Collection[]               — called once on mount
 *   forFeedback      – passed through to DashboardItem
 *   shortenTo        – passed through
 *   isGrid           – passed through
 *   pageSize         – items per page (default 12)
 */
const CollectionFeed = ({
  collection,
  fetchStories,
  fetchSubCollections,
  forFeedback,
  shortenTo,
  isGrid,
  pageSize = 12,
}) => {
  const [stories, setStories] = useState([]);
  const [subCollections, setSubCollections] = useState([]);
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const loadedSubCollections = useRef(false);

  // ── Load sub-collections once ──────────────────────────────────────────────
  useEffect(() => {
    if (loadedSubCollections.current || !fetchSubCollections) return;
    loadedSubCollections.current = true;
    fetchSubCollections().then((cols) => {
      setSubCollections(cols ?? []);
    });
  }, [fetchSubCollections]);

  // ── Initial story page ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!fetchStories) { setLoadingInitial(false); return; }
    setLoadingInitial(true);
    fetchStories(0, pageSize).then((newStories) => {
      setStories(newStories ?? []);
      if (!newStories || newStories.length < pageSize) setHasMore(false);
      setPage(1);
      setLoadingInitial(false);
    });
  }, [fetchStories, pageSize]);

  // ── Rebuild sorted feed whenever either list changes ───────────────────────
  useEffect(() => {

    setFeed(buildSortedFeed([...stories, ...subCollections] || [], []));
  }, [stories, subCollections]);

  // ── Infinite scroll handler ────────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (!fetchStories || !hasMore) return;
    const newStories = await fetchStories(page, pageSize);
    if (!newStories || newStories.length < pageSize) setHasMore(false);
    setStories((prev) => [...prev, ...(newStories ?? [])]);
    setPage((p) => p + 1);
  }, [fetchStories, hasMore, page, pageSize]);

  // ─── Render ────────────────────────────────────────────────────────────────
  if (loadingInitial) {
    return (
      <div className="flex justify-center py-12 text-soft/40 dark:text-cream/30 text-sm">
        Loading…
      </div>
    );
  }

  if (!feed.length) {
    return (
      <div className="flex justify-center py-12 text-soft/40 dark:text-cream/30 text-sm">
        Nothing here yet.
      </div>
    );
  }

  return (
    <div className="bg-base-surface max-w-2xl mx-auto dark:bg-base-bgDark">
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        {feed.map((item, i) => (
          <motion.div key={`${item._feedType}-${item.id}`} variants={itemVariants}>
            <FeedRow
              item={item}
              index={i}
              forFeedback={forFeedback}
              shortenTo={shortenTo}
              isGrid={isGrid}
            />
          </motion.div>
        ))}
      </motion.div>

      <IonInfiniteScroll
        threshold="200px"
        disabled={!hasMore}
        onIonInfinite={async (e) => {
          await loadMore();
          e.target.complete();
        }}
      >
        <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more…" />
      </IonInfiniteScroll>
    </div>
  );
};

export default CollectionFeed;