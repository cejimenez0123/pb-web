
import { useDispatch, useSelector } from "react-redux";
import { initKey, setPageData, setPaginationLoading, setCurrentPage, resetKey } from "../actions/PageActions";
import { useEffect, useCallback, useMemo, useRef } from "react";

const EMPTY_PAGES = {};

function usePaginatedResource({ cacheKey, fetcher, pageSize = 20, enabled = true, params = {}, select }) {
  const dispatch = useDispatch();
  const stableParams = useMemo(() => params, [JSON.stringify(params)]);
  const key = `${cacheKey}`

  const page        = useSelector((s) => s.pagination.byKey?.[key]?.currentPage ?? 1);
  const cache       = useSelector((s) => s.pagination.byKey?.[key]?.pages ?? EMPTY_PAGES);
  const totalCount  = useSelector((s) => s.pagination.byKey?.[key]?.totalCount ?? 0);
  const isLoading   = useSelector((s) => s.pagination.byKey?.[key]?.loading ?? false);

  const items      = cache[page] || [];
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Track in-flight fetches to prevent duplicate calls
  const inFlight = useRef(new Set());
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      dispatch(initKey({ key }));
      isFirstMount.current = false;
    } else {
      inFlight.current.clear(); // wipe in-flight on key change
      dispatch(resetKey({ key }));
    }
  }, [key]);

  const fetchPage = useCallback(async (p) => {
    if (!enabled) return;
    if (inFlight.current.has(p)) return;  // already fetching this page
    inFlight.current.add(p);

    dispatch(setPaginationLoading({ key, loading: true }));
    try {
      const res = await dispatch(
        fetcher({ skip: (p - 1) * pageSize, take: pageSize, ...stableParams })
      ).unwrap();

      const parsed = select
        ? select(res)
        : { items: res.pageList || res.items || res.collections || res.groups || [], totalCount: res.totalCount };

      dispatch(setPageData({ key, page: p, items: parsed.items, totalCount: parsed.totalCount }));
    } finally {
      inFlight.current.delete(p);
      dispatch(setPaginationLoading({ key, loading: false }));
    }
  }, [key, stableParams, enabled]);

  // Fetch current page if not cached
  useEffect(() => {
    if (!enabled) return;
    if (cache[page] !== undefined) return;
    fetchPage(page);
  }, [fetchPage, page, cache]);

  // Prefetch next page after current is loaded
  useEffect(() => {
    if (!enabled) return;
    if (cache[page] === undefined) return; // wait for current page first
    const nextPage = page + 1;
    if (nextPage > totalPages) return;
    if (cache[nextPage] !== undefined) return;
    fetchPage(nextPage);
  }, [fetchPage, page, totalPages, cache]);

  const setPage = (p) => dispatch(setCurrentPage({ key, page: p }));

  return { page, setPage, items, totalCount, totalPages, isLoading, cache };
}

export default usePaginatedResource;