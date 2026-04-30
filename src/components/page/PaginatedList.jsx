import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
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

  const activeSearch = enableInternalSearch ? debouncedQuery : externalSearch;

  const cache = useSelector((s) => s.pagination.byKey?.[cacheKey]?.pages || {});
  const totalCount = useSelector((s) => s.pagination.byKey?.[cacheKey]?.totalCount || 0);

  const items = cache[page] || [];
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setInternalQuery(val);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedQuery(val), 350);
  }, []);

  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  // Reset on search or key change
  useEffect(() => {
    dispatch(initKey({ key: cacheKey }));
    setPage(1);
  }, [activeSearch, cacheKey]);

  const fetchPage = async (p) => {
    if (!enabled) return;
    dispatch(setPaginationLoading({ key: cacheKey, loading: true }));
    try {
      const res = await dispatch(
        fetcher({
          skip: (p - 1) * pageSize,
          take: pageSize,
          ...params,
          search: activeSearch,
        })
      ).unwrap();
      dispatch(setPageData({
        key: cacheKey,
        page: p,
        items: res.pageList || res.items || res.collections || [],
        totalCount: res.totalCount,
      }));
    } finally {
      dispatch(setPaginationLoading({ key: cacheKey, loading: false }));
    }
  };

  useEffect(() => {
    fetchPage(page);
  }, [page, activeSearch, JSON.stringify(params)]);

  return (
    <div className={`space-y-2 bg-cream dark:bg-base-bgDark ${className}`}>
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

      {!items.length && !cache[page]
        ? emptyState || <div className="p-4 text-gray-400 dark:text-cream animate-pulse">Loading...</div>
        : (cache[page] || items).map((item, index) => (
            <div key={item.id ?? index}>{renderItem(item, index)}</div>
          ))
      }

      {!items.length && cache[page] && (
        <div className="p-4 text-gray-400 dark:text-cream">
          {enableInternalSearch && debouncedQuery
            ? `No results for "${debouncedQuery}"`
            : "Nothing here yet"}
        </div>
      )}

      <PaginationControls
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        className="bg-cream dark:bg-base-bgDark"
      />
    </div>
  );
}