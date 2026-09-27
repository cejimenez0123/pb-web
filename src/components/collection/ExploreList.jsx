
// import { BookListItem } from "./BookListItem";
// import { useState, useEffect, useRef } from "react";
// import SectionHeader from "../SectionHeader";
// import PaginationControls from "../PaginationControls";

// const SECTION_GAP = "pt-4";
// const SECTION_HEADER_ROW = "flex items-center justify-between";
// const WRAP = "w-[100%] bg-cream dark:bg-base-bgDark mx-auto";

// export default function ExploreList({ 
//   label = "Explore", 
//   items,
//   page,
//   totalPages,
//   setPage,
//   totalCount,
//   pageSize = 10,
// }) {
//   const [isVisible, setIsVisible] = useState(true);
//   const [animatedItems, setAnimatedItems] = useState([]);
//   const prevItemsRef = useRef(null);
// const isLoading = !items; // keep as-is
// const isEmpty = items?.length === 0;

//   // Trigger staggered entrance whenever items array changes to a new populated set
//   useEffect(() => {
//     if (!items || items.length === 0) {
//       setAnimatedItems([]);
//       return;
//     }

//     // Only re-animate if items actually changed (e.g. page turn or first load)
//     const prevIds = prevItemsRef.current?.map(i => i.id).join(",");
//     const nextIds = items.map(i => i.id).join(",");
//     if (prevIds === nextIds) return;

//     prevItemsRef.current = items;
//     setAnimatedItems([]); // reset

//     // Stagger items in one by one
//     items.forEach((_, i) => {
//       setTimeout(() => {
//         setAnimatedItems(prev => [...prev, i]);
//       }, i * 60); // 60ms between each card
//     });
//   }, [items]);

// console.log("EXPLORE ITEMS", items)

//   return (
//     <div className={`${WRAP} bg-cream dark:bg-base-bgDark ${SECTION_GAP}`}>
//       <div>
//         <div className={SECTION_HEADER_ROW}>
//           <SectionHeader title={label} />
//         </div>

//         <div className="relative min-h-[14rem]">
//           {/* Skeleton */}
          
//           <div className={`transition-all duration-300 ease-out ${
//             isLoading
//               ? "opacity-100 translate-x-0"
//               : "opacity-0 -translate-x-6 pointer-events-none absolute inset-0"
//           }`}>
//             <div className="flex min-h-[14rem] flex-row overflow-x-auto space-x-4 no-scrollbar animate-pulse">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className="min-w-[12rem] h-[12rem] bg-base-soft rounded-xl flex flex-col justify-between p-3 flex-shrink-0">
//                   <div className="h-4 w-3/4 bg-base-bg rounded" />
//                   <div className="space-y-2 mt-4">
//                     <div className="h-3 w-full bg-base-bg rounded" />
//                     <div className="h-3 w-5/6 bg-base-bg rounded" />
//                   </div>
//                   <div className="h-3 w-1/2 bg-base-bg rounded mt-4" />
//                 </div>
//               ))}
//             </div>
//           </div>
// {!isLoading && isEmpty && (
//   <div className="flex items-center justify-center min-h-[14rem] text-soft dark:text-cream opacity-50">
//     <p>Nothing to explore yet.</p>
//   </div>
// )}
//           {/* Content */}
//           <div className={`transition-all duration-300 ease-out ${
//             isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
//           }`}>
//             {!isLoading && !isEmpty && (
//               <div className="flex min-h-[14rem] pr-4 flex-row overflow-x-auto space-x-4 no-scrollbar">
//                 {items.map((item, i) => (
//                   <div
//                     key={`${item.id}-${i}`}
//                     className="transition-all duration-300 ease-out flex-shrink-0"
//                     style={{
//                       opacity: animatedItems.includes(i) ? 1 : 0,
//                       transform: animatedItems.includes(i)
//                         ? "translateY(0px)"
//                         : "translateY(16px)",
//                     }}
//                   >
//                     <BookListItem book={item} />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="max-w-xl mx-auto px-4 pt-4">
//           <PaginationControls page={page} setPage={setPage} totalPages={totalPages}   className=" bg-cream dark:bg-base-bgDark " />
//         </div>
//       </div>
//     </div>
//   );
// }
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
      dark:bg-base-surfaceDark
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