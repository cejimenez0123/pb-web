


import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import RoomPreview from "../room/RoomPreview";
import PaginationControls from "../PaginationControls";
import styles from "../../styles/style.js";

const PAGE =
  "mx-auto w-[100%] max-w-[52rem] px-4 sm:px-6 lg:max-w-[76rem] lg:px-8 2xl:max-w-[96rem]";

const SECTION = "py-8 sm:py-10";

const GRID =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 lg:gap-5";

const CARD_SURFACE =
  "rounded-2xl border border-plumb-border bg-plumb-surface dark:border-plumb-darkBorder dark:bg-plumb-dark-surface";

const SKELETON_LINE =
  "rounded bg-plumb-border/60 dark:bg-plumb-darkBorder";

const SkeletonCard = () => (
  <div
    aria-hidden="true"
    className={`
      ${CARD_SURFACE}
      h-full min-w-0
      p-5 sm:p-6
      animate-pulse motion-reduce:animate-none
    `}
  >
    <div className={`h-3 w-20 ${SKELETON_LINE}`} />

    <div className={`mt-4 h-6 w-3/4 ${SKELETON_LINE}`} />

    <div className="mt-3 space-y-2">
      <div className={`h-3 w-full ${SKELETON_LINE}`} />
      <div className={`h-3 w-5/6 ${SKELETON_LINE}`} />
    </div>

    <div className={`mt-6 h-3 w-24 ${SKELETON_LINE}`} />
  </div>
);

export default function ExploreList({
  label = "Explore",
  items,
  page,
  totalPages,
  setPage,
  totalCount,
}) {
  const history = useHistory();

  const [animatedItems, setAnimatedItems] = useState([]);
  const prevItemsRef = useRef(null);

  const isLoading = !items;
  const isEmpty = items?.length === 0;

  /*
   * Stagger cards when the recommendation set changes.
   * Clean up pending timers when items change or the component unmounts.
   */
  useEffect(() => {
    if (!items || items.length === 0) {
      setAnimatedItems([]);
      return;
    }

    const previousIds = prevItemsRef.current
      ?.map((item) => item?.id)
      .join(",");

    const nextIds = items
      .map((item) => item?.id)
      .join(",");

    if (previousIds === nextIds) {
      return;
    }

    prevItemsRef.current = items;
    setAnimatedItems([]);

    const timers = items.map((_, index) =>
      setTimeout(() => {
        setAnimatedItems((previous) => [
          ...previous,
          index,
        ]);
      }, index * 60)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [items]);

  return (
    <section className="border-t border-plumb-border dark:border-plumb-darkBorder">
      <div className={`${PAGE} ${SECTION}`}>
        {/* Section heading */}
        <div className="max-w-2xl">
          <p
            className={`
              mb-2 text-xs uppercase tracking-[0.18em]
              ${styles.text.metadata}
            `}
          >
            Keep exploring
          </p>

          <div className="flex items-end justify-between gap-4">
            <h2
              className={`
                font-serif text-2xl sm:text-3xl
                ${styles.text.title}
              `}
            >
              {label}
            </h2>

            {totalCount > 0 && (
              <span
                className={`
                  hidden shrink-0 pb-1 text-xs sm:block
                  ${styles.text.metadata}
                `}
              >
                {totalCount}{" "}
                {totalCount === 1 ? "room" : "rooms"}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          {isLoading ? (
            <div
              className={GRID}
              role="status"
              aria-label={`Loading ${label.toLowerCase()}`}
              aria-busy="true"
            >
              {[...Array(6)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}

              <span className="sr-only">
                Loading {label.toLowerCase()}...
              </span>
            </div>
          ) : isEmpty ? (
            <div
              className={`
                ${CARD_SURFACE}
                border-dashed
                bg-plumb-canvas
                px-6 py-12 text-center sm:py-16
                dark:bg-plumb-dark-paper
              `}
            >
              <p
                className={`
                  font-serif text-xl
                  ${styles.text.heading}
                `}
              >
                Nothing to explore yet.
              </p>

              <p
                className={`
                  mt-2 text-sm leading-relaxed
                  ${styles.text.body}
                `}
              >
                New rooms will appear here as they gather.
              </p>
            </div>
          ) : (
            <div className={GRID}>
              {items.map((item, index) => {
                const visible = animatedItems.includes(index);

                return (
                  <div
                    key={`${item?.id}-${index}`}
                    className={`
                      h-full min-w-0
                      [&>*]:h-full
                      transition-all duration-300 ease-out
                      motion-reduce:!transform-none
                      motion-reduce:!opacity-100
                      motion-reduce:!transition-none
                    `}
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible
                        ? "translateY(0px)"
                        : "translateY(12px)",
                    }}
                  >
                    <RoomPreview
                      room={item}
                      history={history}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !isEmpty && totalPages > 1 && (
          <div className="mt-8">
            <PaginationControls
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              className="bg-transparent dark:bg-transparent"
            />
          </div>
        )}
      </div>
    </section>
  );
}
