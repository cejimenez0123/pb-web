import { useDispatch, useSelector } from "react-redux";
import {
  initKey,
  setPageData,
  setPaginationLoading,
  setCurrentPage,
  resetKey,
} from "../actions/PageActions";

import {
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

const EMPTY_PAGES = {};

function usePaginatedResource({
  cacheKey,
  fetcher,
  pageSize = 20,
  enabled = true,
  params = {},
  select,
  infinite = false,
}) {
  const dispatch = useDispatch();

  const stableParams = useMemo(
    () => params,
    [JSON.stringify(params)]
  );

  const key = `${cacheKey}`;

  const page = useSelector(
    (s) =>
      s.pagination.byKey?.[key]?.currentPage ?? 1
  );

  const cache = useSelector(
    (s) =>
      s.pagination.byKey?.[key]?.pages ??
      EMPTY_PAGES
  );

  const totalCount = useSelector(
    (s) =>
      s.pagination.byKey?.[key]?.totalCount ?? 0
  );

  const isLoading = useSelector(
    (s) =>
      s.pagination.byKey?.[key]?.loading ?? false
  );

  /*
   * Track pages currently being fetched.
   *
   * This prevents:
   *
   * page 2
   * page 2
   * page 2
   *
   * from producing three requests.
   */
  const inFlight = useRef(new Set());

  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      dispatch(initKey({ key }));
      isFirstMount.current = false;
    } else {
      inFlight.current.clear();

      dispatch(resetKey({ key }));
    }
  }, [key, dispatch]);

  /*
   * Fetch a specific page.
   */
  const fetchPage = useCallback(
    async (p) => {
      if (!enabled) return;

      if (inFlight.current.has(p)) {
        return;
      }

      inFlight.current.add(p);

      dispatch(
        setPaginationLoading({
          key,
          loading: true,
        })
      );

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
          : {
              items:
                res.pageList ||
                res.items ||
                res.collections ||
                res.groups ||
                [],

              totalCount:
                res.totalCount ?? 0,
            };

        dispatch(
          setPageData({
            key,
            page: p,
            items: parsed.items,
            totalCount: parsed.totalCount,
          })
        );
      } finally {
        inFlight.current.delete(p);

        dispatch(
          setPaginationLoading({
            key,
            loading: false,
          })
        );
      }
    },
    [
      key,
      stableParams,
      enabled,
      pageSize,
      fetcher,
      select,
      dispatch,
    ]
  );

  /*
   * Fetch the current page when it isn't cached.
   */
  useEffect(() => {
    if (!enabled) return;

    if (cache[page] !== undefined) {
      return;
    }

    fetchPage(page);
  }, [
    enabled,
    cache,
    page,
    fetchPage,
  ]);

  /*
   * Calculate total pages.
   */
  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / pageSize)
  );

  /*
   * Determine whether another page exists.
   *
   * totalCount is preferred, but if the backend does not
   * provide it, a short page tells us we've reached the end.
   */
  const currentPageItems = cache[page] || [];

  const hasMore =
    page < totalPages &&
    currentPageItems.length >= pageSize;

  /*
   * NORMAL PAGINATION
   *
   * Only display the current page.
   *
   * Page 1:
   * [1 ... 8]
   *
   * Page 2:
   * [9 ... 16]
   */
  const paginatedItems = cache[page] || [];

  /*
   * INFINITE PAGINATION
   *
   * Combine every loaded page.
   *
   * Page 1:
   * [1 ... 8]
   *
   * Page 2:
   * [1 ... 16]
   *
   * Page 3:
   * [1 ... 24]
   */
  const infiniteItems = useMemo(() => {
    if (!infinite) {
      return paginatedItems;
    }

    const allItems = [];

    for (let p = 1; p <= page; p++) {
      if (cache[p]) {
        allItems.push(...cache[p]);
      }
    }

    return allItems;
  }, [
    infinite,
    cache,
    page,
    paginatedItems,
  ]);

  /*
   * Change page.
   *
   * In normal pagination this changes what is displayed.
   *
   * In infinite mode this advances the loaded range.
   */
  const setPage = useCallback(
    (p) => {
      if (p < 1) return;

      if (infinite) {
        if (p > totalPages) return;

        dispatch(
          setCurrentPage({
            key,
            page: p,
          })
        );

        return;
      }

      if (p > totalPages) return;

      dispatch(
        setCurrentPage({
          key,
          page: p,
        })
      );
    },
    [
      dispatch,
      key,
      infinite,
      totalPages,
    ]
  );

  return {
    page,

    setPage,

    /*
     * This is now the important part:
     *
     * infinite === false
     *   → current page only
     *
     * infinite === true
     *   → all loaded pages
     */
    items: infinite
      ? infiniteItems
      : paginatedItems,

    totalCount,
    totalPages,

    /*
     * Both names are available so existing code
     * using isLoading doesn't break while the new
     * PaginatedList can use loading.
     */
    isLoading,
    loading: isLoading,

    hasMore,

    cache,
  };
}

export default usePaginatedResource;
