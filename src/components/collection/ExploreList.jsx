
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import RoomPreview from "../room/RoomPreview";
import PaginationControls from "../PaginationControls";

const PAGE =
  "w-full max-w-[52rem] mx-auto px-4 sm:px-6 lg:px-8";

const SECTION =
  "py-8 sm:py-10";

const SkeletonCard = () => (
  <div
    className="
      rounded-2xl
      border
      border-card-border
      bg-card-background
      p-5
      sm:p-6
      dark:bg-plumb-surface Dark
      dark:border-white/10
      animate-pulse
    "
  >
    <div className="h-3 w-20 rounded bg-base-soft dark:bg-white/10" />

    <div className="mt-4 h-6 w-3/4 rounded bg-base-soft dark:bg-white/10" />

    <div className="mt-3 space-y-2">
      <div className="h-3 w-full rounded bg-base-soft dark:bg-white/10" />
      <div className="h-3 w-5/6 rounded bg-base-soft dark:bg-white/10" />
    </div>

    <div className="mt-6 h-3 w-24 rounded bg-base-soft dark:bg-white/10" />
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
   * This preserves the old interaction without making the
   * page feel like a feed.
   */
  useEffect(() => {
    if (!items || items.length === 0) {
      setAnimatedItems([]);
      return;
    }

    const previousIds =
      prevItemsRef.current
        ?.map((item) => item?.id)
        .join(",");

    const nextIds =
      items
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
    <section
      className="
        border-t
        border-card-border
        dark:border-white/10
      "
    >
      <div className={`${PAGE} ${SECTION}`}>
        {/* Section heading */}
        <div className="max-w-2xl">
          <p
            className="
              text-xs
              uppercase
              tracking-[0.18em]
              text-text-secondary
              mb-2
            "
          >
            Keep exploring
          </p>

          <div className="flex items-end justify-between gap-4">
            <h2
              className="
                font-serif
                text-2xl
                sm:text-3xl
                text-text-primary
                dark:text-cream
              "
            >
              {label}
            </h2>

            {totalCount > 0 && (
              <span
                className="
                  hidden
                  sm:block
                  text-xs
                  text-text-secondary
                  pb-1
                "
              >
                {totalCount}{" "}
                {totalCount === 1
                  ? "room"
                  : "rooms"}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          {isLoading ? (
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
                lg:gap-5
              "
            >
              {[...Array(3)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : isEmpty ? (
            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-card-border
                dark:border-white/10
                px-6
                py-12
                sm:py-16
                text-center
              "
            >
              <p
                className="
                  font-serif
                  text-xl
                  text-text-primary
                  dark:text-cream
                "
              >
                Nothing to explore yet.
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  leading-relaxed
                  text-text-secondary
                "
              >
                New rooms will appear here as they gather.
              </p>
            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
                lg:gap-5
              "
            >
              {items.map((item, index) => {
                const visible =
                  animatedItems.includes(index);

                return (
                  <div
                    key={`${item?.id}-${index}`}
                    className="
                      transition-all
                      duration-300
                      ease-out
                    "
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
        {!isLoading &&
          !isEmpty &&
          totalPages > 1 && (
            <div className="mt-8">
              <PaginationControls
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                className="
                  bg-transparent
                  dark:bg-transparent
                "
              />
            </div>
          )}
      </div>
    </section>
  );
}