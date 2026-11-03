
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  useIonRouter,
} from "@ionic/react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import DashboardItem from "./DashboardItem";
import BookDashboardItem from "../collection/BookDashboardItem";
import Paths from "../../core/paths";
import styles from "../../styles/style";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const PageList = ({
  items = [],
  forFeedback,
  shortenTo,
  getMore = () => {},
  hasMore = true,
  isGrid,
  styleVariant = "default",
}) => {
  const router = useIonRouter();
  const shouldReduceMotion = useReducedMotion();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const listVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 1 },
        show: { opacity: 1 },
      }
    : containerVariants;

  const childVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 1 },
        show: { opacity: 1 },
      }
    : itemVariants;

  const handleInfiniteScroll = async (event) => {
    if (!hasMore || isLoadingMore) {
      event.target.complete();
      return;
    }

    setIsLoadingMore(true);

    try {
      await getMore();
    } finally {
      setIsLoadingMore(false);
      event.target.complete();
    }
  };

  return (
    <div
      className={styles.page.list}
      aria-busy={isLoadingMore}
    >
      <motion.div
        variants={listVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
      >
        {items.map((item, index) => {
          if (!item) return null;

          const isCollection = !!item.storyIdList;
          const itemKey =
            item.id ?? item.collection?.id ?? index;

          if (styleVariant === "pill") {
            const title = item.title?.trim() || "Untitled";
            const route = isCollection
              ? Paths.collection.createRoute(item.id)
              : Paths.page.createRoute(item.id);

            return (
              <motion.div
                key={itemKey}
                variants={childVariants}
                className={styles.page.listItem}
              >
                <button
                  type="button"
                  disabled={!item.id}
                  onClick={() => router.push(route, "forward")}
                  aria-label={`Open ${isCollection ? "collection" : "page"}: ${title}`}
                  className={`
                    ${styles.page.pillButton}
                    ${
                      isCollection
                        ? styles.page.pillCollection
                        : styles.page.pillPage
                    }
                  `}
                >
                  <span
                    className={`
                      ${styles.page.pillType}
                      ${
                        isCollection
                          ? styles.page.pillCollectionType
                          : styles.page.pillPageType
                      }
                    `}
                  >
                    {isCollection ? "Collection" : "Page"} ·
                  </span>

                  <span className={styles.page.pillTitle}>
                    {title}
                  </span>
                </button>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={itemKey}
              variants={childVariants}
              className={styles.page.listItem}
            >
              {item.authorId ? (
                <DashboardItem
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
            </motion.div>
          );
        })}
      </motion.div>

      <IonInfiniteScroll
        threshold="200px"
        disabled={!hasMore || isLoadingMore}
        onIonInfinite={handleInfiniteScroll}
      >
        <IonInfiniteScrollContent
          loadingSpinner="bubbles"
          loadingText="Loading more items"
        />
      </IonInfiniteScroll>
    </div>
  );
};

export default PageList;
