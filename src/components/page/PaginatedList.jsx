

// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { initKey, setPageData, setPaginationLoading } from "../../actions/PageActions";
// import PaginationControls from "../PaginationControls";


// export default function PaginatedList({
//   cacheKey,
//   fetcher,
//   pageSize = 20,
//   renderItem,
//   params = {},
//    enableInternalSearch,
//   search = "",
//   emptyState = null,
//   className = "",
//   enabled = true,
// }) {
//   const dispatch = useDispatch();

//   const [page, setPage] = useState(1);
// const key = `${cacheKey}:${search?.trim()?.toLowerCase() || "all"}`;

//   const cache = useSelector(
//     (state) => state.pagination.byKey?.[key]?.pages || {}
//   );

//   const totalCount = useSelector(
//     (state) => state.pagination.byKey?.[key]?.totalCount || 0
//   );

//   const items = cache[page] || [];

//   const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

//   // ✅ RESET ONLY WHEN SEARCH CHANGES (NOT EVERY RENDER)
// useEffect(() => {
//   dispatch(initKey({ key }));
//   setPage(1);
// }, [key]);
// const fetchPage = async (p) => {
//   if (!enabled) return;

//   const pageExists = cache[p]?.length;

//   // Only skip if SAME query AND page exists
//   if (pageExists) return;

//   dispatch(setPaginationLoading({ key, loading: true }));

//   try {
//     const res = await dispatch(
//       fetcher({
//         skip: (p - 1) * pageSize,
//         take: pageSize,
//         ...params,
//         search,
//       })
//     ).unwrap();

//     dispatch(
//       setPageData({
//         key,
//         page: p,
//         items: res.pageList || res.items || res.collections || [],
//         totalCount: res.totalCount,
//       })
//     );
//   } finally {
//     dispatch(setPaginationLoading({ key, loading: false }));
//   }
// };


// useEffect(() => {
//   fetchPage(page);
// }, [page, key]);
// console.log("LITEML",items)
//   return (
//     <div className={`space-y-2 ${className}`}>
//       {!items.length && !cache[page]?emptyState || <div className="p-4 text-gray-400">Loading...</div>:(cache[page] || items).map((item, index) => (
//         <div key={item.id ?? index}>{renderItem(item, index)}</div>
//       ))}
//       <PaginationControls 
//         page={page}
//   totalPages={totalPages}
//   setPage={setPage}
//   className = ""
      
//       />
//     </div>
//   );
// }
import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { initKey, setPageData, setPaginationLoading } from "../../actions/PageActions";
import PaginationControls from "../PaginationControls";

export default function PaginatedList({
  cacheKey,
  fetcher,
  pageSize = 20,
  renderItem,
  params = {},
  enableInternalSearch = false,
  search: externalSearch = "",
  emptyState = null,
  className = "",
  enabled = true,
}) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [internalQuery, setInternalQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceTimer = useRef(null);

  // If internal search is enabled, use it; otherwise fall back to the external prop
  const activeSearch = enableInternalSearch ? debouncedQuery : externalSearch;

  const key = `${cacheKey}:${activeSearch?.trim()?.toLowerCase() || "all"}`;

  const cache = useSelector(
    (state) => state.pagination.byKey?.[key]?.pages || {}
  );
  const totalCount = useSelector(
    (state) => state.pagination.byKey?.[key]?.totalCount || 0
  );
  const isLoading = useSelector(
    (state) => state.pagination.byKey?.[key]?.loading || false
  );

  const items = cache[page] || [];
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setInternalQuery(val);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(val);
    }, 350);
  }, []);

  // Clean up timer on unmount
  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  useEffect(() => {
    dispatch(initKey({ key }));
    setPage(1);
  }, [key]);

  const fetchPage = async (p) => {
    if (!enabled) return;
    if (cache[p]?.length) return;
    dispatch(setPaginationLoading({ key, loading: true }));
    try {
      const res = await dispatch(
        fetcher({
          skip: (p - 1) * pageSize,
          take: pageSize,
          ...params,
          search: activeSearch,
        })
      ).unwrap();
      dispatch(
        setPageData({
          key,
          page: p,
          items: res.pageList || res.items || res.collections || [],
          totalCount: res.totalCount,
        })
      );
    } finally {
      dispatch(setPaginationLoading({ key, loading: false }));
    }
  };

  useEffect(() => {
    fetchPage(page);
  }, [page, key]);

  const showEmpty = !isLoading && cache[page] && items.length === 0;

  return (
    <div className={`space-y-2 ${className}`}>
      {enableInternalSearch && (
        <div className="relative mb-2">
          <input
            type="text"
            value={internalQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-xl border border-soft bg-base-bg text-soft focus:outline-none focus:ring-1 focus:ring-purple"
          />

        </div>
      )}

      {isLoading && (
        <div className="p-4 text-gray-400 animate-pulse">Loading...</div>
      )}

      {!isLoading && showEmpty && (
        emptyState || (
          <div className="p-4 text-gray-400">
            {enableInternalSearch && debouncedQuery
              ? `No results for "${debouncedQuery}"`
              : "Nothing here yet"}
          </div>
        )
      )}

      {!isLoading && items.length > 0 &&
        items.map((item, index) => (
          <div key={item.id ?? index}>{renderItem(item, index)}</div>
        ))
      }

      <PaginationControls
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        className=""
      />
    </div>
  );
}