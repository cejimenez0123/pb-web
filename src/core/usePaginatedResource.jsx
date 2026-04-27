
import { useDispatch, useSelector } from "react-redux";
import { initKey, setPageData, setPaginationLoading, setCurrentPage, resetKey } from "../actions/PageActions";
import { useEffect, useCallback, useMemo, useRef } from "react";

const EMPTY_PAGES = {};

function usePaginatedResource({
    cacheKey,
    fetcher,
    pageSize = 20,
    enabled = true,
    params = {},
    select,
}) {
    const dispatch = useDispatch();

    // const key = cacheKey;

    // const stableParams = useMemo(() => params, [JSON.stringify(params)]);
  const stableParams = useMemo(() => params, [JSON.stringify(params)]);
    const key = `${cacheKey}:${JSON.stringify(stableParams)}`;
    const page = useSelector((s) => s.pagination.byKey?.[key]?.currentPage ?? 1);
    const cache = useSelector((s) => s.pagination.byKey?.[key]?.pages ?? EMPTY_PAGES);
    const totalCount = useSelector((s) => s.pagination.byKey?.[key]?.totalCount ?? 0);
    const isLoading = useSelector((s) => s.pagination.byKey?.[key]?.loading ?? false);

    const items = cache[page] || [];
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  

    // reset to page 1 when key changes
const isFirstMount = useRef(true);

useEffect(() => {
    if (isFirstMount.current) {
        dispatch(initKey({ key }));
        isFirstMount.current = false;
    } else {
        dispatch(resetKey({ key })); // params changed, wipe cache
    }
}, [key]);
  // Prefetch next page

    const fetchPage = useCallback(async (p) => {
        if (!enabled) return;
        dispatch(setPaginationLoading({ key, loading: true }));
        try {
            const res = await dispatch(
                fetcher({
                    skip: (p - 1) * pageSize,
                    take: pageSize,
                    ...stableParams,
                })
            ).unwrap();

            const parsed = select
                ? select(res)
                : { items: res.pageList || res.items || res.collections || res.groups || [], totalCount: res.totalCount };

            dispatch(setPageData({
                key,
                page: p,
                items: parsed.items,
                totalCount: parsed.totalCount,
            }));
        } finally {
            dispatch(setPaginationLoading({ key, loading: false }));
        }
    }, [key, stableParams, enabled]);
useEffect(() => {
    if (!enabled) return;
    const nextPage = page + 1;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    if (nextPage > totalPages) return;         // no next page
    if (cache[nextPage] !== undefined) return; // already cached
    fetchPage(nextPage);
}, [fetchPage, page, totalCount, cache]);
    useEffect(() => {
        if (cache[page] !== undefined) return;
        fetchPage(page);
    }, [fetchPage, page]);

  const setPage = (p) => {
    console.log("setting page", key, p);
    dispatch(setCurrentPage({ key, page: p }));
};
console.log("page:", page, "items:", items.length, "cache keys:", Object.keys(cache));
    return {
        page,
        setPage,
        items,
        totalCount,
        totalPages,
        isLoading,
        cache,
    };
}

export default usePaginatedResource;