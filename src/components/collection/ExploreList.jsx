
import { BookListItem } from "./BookListItem";
import { useState, useEffect, useRef } from "react";
import SectionHeader from "../SectionHeader";
import PaginationControls from "../PaginationControls";

const SECTION_GAP = "pt-4";
const SECTION_HEADER_ROW = "flex items-center justify-between";
const WRAP = "w-[100%] bg-cream dark:bg-base-bgDark mx-auto";

export default function ExploreList({ 
  label = "Explore", 
  items,
  page,
  totalPages,
  setPage,
  totalCount,
  pageSize = 10,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [animatedItems, setAnimatedItems] = useState([]);
  const prevItemsRef = useRef(null);

  const hasMore = items?.length < totalCount;
  const isLoading = !items;

  // Trigger staggered entrance whenever items array changes to a new populated set
  useEffect(() => {
    if (!items || items.length === 0) {
      setAnimatedItems([]);
      return;
    }

    // Only re-animate if items actually changed (e.g. page turn or first load)
    const prevIds = prevItemsRef.current?.map(i => i.id).join(",");
    const nextIds = items.map(i => i.id).join(",");
    if (prevIds === nextIds) return;

    prevItemsRef.current = items;
    setAnimatedItems([]); // reset

    // Stagger items in one by one
    items.forEach((_, i) => {
      setTimeout(() => {
        setAnimatedItems(prev => [...prev, i]);
      }, i * 60); // 60ms between each card
    });
  }, [items]);

  const handleLoadMore = () => {
    setIsVisible(false);
    setTimeout(() => {
      setPage(page + 1);
      setIsVisible(true);
    }, 120);
  };

  return (
    <div className={`${WRAP} bg-cream dark:bg-base-bgDark ${SECTION_GAP}`}>
      <div>
        <div className={SECTION_HEADER_ROW}>
          <SectionHeader title={label} />
        </div>

        <div className="relative min-h-[14rem]">
          {/* Skeleton */}
          <div className={`transition-all duration-300 ease-out ${
            isLoading
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-6 pointer-events-none absolute inset-0"
          }`}>
            <div className="flex min-h-[14rem] flex-row overflow-x-auto space-x-4 no-scrollbar animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[12rem] h-[12rem] bg-base-soft rounded-xl flex flex-col justify-between p-3 flex-shrink-0">
                  <div className="h-4 w-3/4 bg-base-bg rounded" />
                  <div className="space-y-2 mt-4">
                    <div className="h-3 w-full bg-base-bg rounded" />
                    <div className="h-3 w-5/6 bg-base-bg rounded" />
                  </div>
                  <div className="h-3 w-1/2 bg-base-bg rounded mt-4" />
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className={`transition-all duration-300 ease-out ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
          }`}>
            {!isLoading && items?.length > 0 && (
              <div className="flex min-h-[14rem] pr-4 flex-row overflow-x-auto space-x-4 no-scrollbar">
                {items.map((item, i) => (
                  <div
                    key={`${item.id}-${i}`}
                    className="transition-all duration-300 ease-out flex-shrink-0"
                    style={{
                      opacity: animatedItems.includes(i) ? 1 : 0,
                      transform: animatedItems.includes(i)
                        ? "translateY(0px)"
                        : "translateY(16px)",
                    }}
                  >
                    <BookListItem book={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-xl mx-auto px-4 pt-4">
          <PaginationControls page={page} setPage={setPage} totalPages={totalPages}   className=" bg-cream dark:bg-base-bgDark " />
        </div>
      </div>
    </div>
  );
}