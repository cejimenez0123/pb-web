

// import { IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/react";
// import DashboardItem from "./DashboardItem";
// import BookDashboardItem from "../collection/BookDashboardItem";
// import { motion } from "framer-motion";
// import Paths from "../../core/paths";
// import { useIonRouter } from "@ionic/react";
// import styles from "../../styles/style";

// const containerVariants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.08 },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 20, scale: 0.98 },
//   show: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { duration: 0.3, ease: "easeOut" },
//   },
// };

// const PageList = ({
//   items = [],
//   forFeedback,
//   shortenTo,
//   getMore = () => {},
//   hasMore = true,
//   isGrid,
//   styleVariant = "default",
// }) => {
//   const router = useIonRouter();

//   return (
//     <div
//     className={styles.page.list}
//     //  className="bg-plumb-surface  max-w-2xl mx-auto dark:bg-base-bgDark"
//      >
//       <motion.div variants={containerVariants} initial="hidden" animate="show">
//         {items.map((item, i) => {
//           const isCollection = !!item?.storyIdList;

//           if (styleVariant === "pill") {
//             return (
//               <motion.div key={item.id} variants={itemVariants}>
//                 <div
//                   onClick={() =>
//                     isCollection
//                       ? router.push(Paths.collection.createRoute(item.id), "forward")
//                       : router.push(Paths.page.createRoute(item.id), "forward")
//                   }
//                   className={`
//                     border rounded-full px-4 py-3 my-2
//                     bg-base-bg dark:bg-base-bgDark
//                     shadow-sm active:scale-[0.98] transition cursor-pointer
//                     ${isCollection ? "border-purple" : "border-blue"}
//                   `}
//                 >
//                   <div className="flex flex-row gap-3 items-center">
//                     <h6 className={`text-[0.75rem] ${isCollection ? "text-purple" : "text-blue"}`}>
//                       {isCollection ? "collection" : "page"} ·
//                     </h6>
//                     <h5 className="text-[0.95rem] text-soft dark:text-cream font-medium truncate">
//                       {item.title || "Untitled"}
//                     </h5>
//                   </div>
//                 </div>
//               </motion.div>
//             );
//           }

//           return (
//             <motion.div key={item.id} variants={itemVariants}>
//               <div className="my-2">
//                 {item.authorId ? (
//                   <DashboardItem
//                     key={i}
//                     item={item}
//                     index={i}
//                     shortenTo={shortenTo}
//                     forFeedback={forFeedback}
//                     isGrid={isGrid}
//                     page={item}
//                   />
//                 ) : (
//                   <BookDashboardItem book={item} />
//                 )}
//               </div>
//             </motion.div>
//           );
//         })}
//       </motion.div>

//       <IonInfiniteScroll
//         threshold="200px"
//         disabled={!hasMore}
//         onIonInfinite={async (e) => {
//           await getMore();
//           e.target.complete();
//         }}
//       >
//         <IonInfiniteScrollContent
//           loadingSpinner="bubbles"
//           loadingText="Loading more..."
//         />
//       </IonInfiniteScroll>
//     </div>
//   );
// };

// export default PageList;

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
