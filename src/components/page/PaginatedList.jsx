
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { initKey, setPageData, setPaginationLoading } from "../../actions/PageActions";
import PaginationControls from "../PaginationControls";

const EMPTY_PAGES = {};

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

  const activeSearch = enableInternalSearch ? debouncedQuery : externalSearch;
  const key = `${cacheKey}:${activeSearch?.trim()?.toLowerCase() || "all"}`;

  const stableParams = useMemo(() => params, [JSON.stringify(params)]);

  const cache = useSelector(
    (state) => state.pagination.byKey?.[key]?.pages ?? EMPTY_PAGES
  );
  const totalCount = useSelector(
    (state) => state.pagination.byKey?.[key]?.totalCount ?? 0
  );
  const isLoading = useSelector(
    (state) => state.pagination.byKey?.[key]?.loading ?? false
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

  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  useEffect(() => {
    dispatch(initKey({ key }));
    setPage(1);
  }, [key]);



const fetchPage = useCallback(async (p) => {
    if (!enabled) return;
    dispatch(setPaginationLoading({ key, loading: true }));
    try {
        const res = await dispatch(
            fetcher({
                skip: (p - 1) * pageSize,
                take: pageSize,
                ...stableParams,
                search: activeSearch,
            })
        ).unwrap();
        dispatch(setPageData({ key, page: p, items: res.pageList || res.items || res.collections || [], totalCount: res.totalCount }));
    } finally {
        dispatch(setPaginationLoading({ key, loading: false }));
    }
}, [key, stableParams, enabled, activeSearch]); // ← removed cache
// Prefetch next page
useEffect(() => {
    if (!enabled) return;
    const nextPage = page + 1;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    if (nextPage > totalPages) return;         // no next page
    if (cache[nextPage] !== undefined) return; // already cached
    fetchPage(nextPage);
}, [fetchPage, page, totalCount, cache]);
useEffect(() => {
    if (cache[page] !== undefined) return; // guard here, not inside callback
    fetchPage(page);
}, [fetchPage, page]); // cache intentionally omitted — checked inline


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
            className="w-full px-4 dark:text-cream py-2 input rounded-xl border border-soft bg-base-bg text-soft focus:outline-none focus:ring-1 focus:ring-purple"
          />
        </div>
      )}

      {isLoading && (
        emptyState || <div className="p-4 text-gray-400 dark:text-cream animate-pulse">Loading...</div>
      )}

      {!isLoading && showEmpty && (
        <div className="p-4 text-gray-400 dark:text-cream">
          {enableInternalSearch && debouncedQuery
            ? `No results for "${debouncedQuery}"`
            : "Nothing here yet"}
        </div>
      )}

      {!isLoading && items.length > 0 &&
        items.map((item, index) => (
          <div key={item.id ?? index}>{renderItem(item, index)}</div>
        ))
      }

      {totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          className=""
        />
      )}
    </div>
  );
}