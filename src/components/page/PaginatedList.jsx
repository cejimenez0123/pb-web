
import { useEffect, useMemo, useState } from "react";
import PaginationControls from "../PaginationControls";

function PaginatedList({
  items = [],
  page = 1,
  setPage,
  pageSize = 20,
  totalCount = 0,
  renderItem,
  loading = false,
  emptyState = null,
  className = "",
}) {
  
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const paginatedItems = useMemo(() => {
    return items;
  }, [items]);

  if (!loading && items.length === 0) {
    return emptyState || <div className="text-gray-400 text-sm">No items found.</div>;
  }

  return (
    <div className={`space-y-4 ${className}`}>

   
      <div className="space-y-2 min-h-48 ">
        {paginatedItems.map((item, index) => (
          <div key={item.id ?? index}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>

   
      <PaginationControls
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  );
}

export default PaginatedList;


// import { useEffect, useRef } from "react";

// function PaginatedList({
//   items = [],
//   renderItem,
//   onLoadMore,
//   hasMore = false,
//   loading = false,
//   className = "",
//   threshold = 200,
//   loadOnScroll = true,
//   emptyState = null,
// }) {
//   const containerRef = useRef(null);

//   // 🔥 Scroll-based pagination
//   useEffect(() => {
//     if (!loadOnScroll) return;

//     const handleScroll = () => {
//       if (!hasMore || loading) return;

//       if (
//         window.innerHeight + window.scrollY >=
//         document.body.offsetHeight - threshold
//       ) {
//         onLoadMore?.();
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [onLoadMore, hasMore, loading, threshold, loadOnScroll]);

//   if (!items.length && emptyState) {
//     return emptyState;
//   }

//   return (
//     <div ref={containerRef} className={className}>
//       <div className="space-y-2">
//         {items.map((item, index) => (
//           <div key={item.id ?? index}>
//             {renderItem(item, index)}
//           </div>
//         ))}
//       </div>

//       {/* Loader / End state */}
//       <div className="py-4 text-center">
//         {loading && (
//           <p className="text-sm text-gray-400">Loading...</p>
//         )}

//         {!hasMore && items.length > 0 && (
//           <p className="text-xs text-gray-400">No more items</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PaginatedList;