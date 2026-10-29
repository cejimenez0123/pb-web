import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  initKey,
  setPageData,
  setPaginationLoading,
  setCurrentPage,
} from "../actions/PageActions";

const EMPTY_PAGES = {};

/*
 * Requests are tracked globally so that:
 *
 * 1. React StrictMode cannot accidentally start the same request twice.
 * 2. Two components using the same resource cannot fetch the same
 *    key/page at the same time.
 *
 * The key includes the search/filter parameters, so different queries
 * remain independent.
 */
const inFlightRequests = new Set();

/*
 * Track how many requests are active for each key.
 *
 * This lets us avoid:
 *
 *   loading: true
 *   loading: false
 *   loading: true
 *   loading: false
 *
 * when multiple pages for the same resource are being fetched.
 *
 * Instead we do:
 *
 *   loading: true
 *   ...
 *   loading: false
 */
const activeRequestsByKey = new Map();

/*
 * We only need to initialize a particular pagination key once.
 */
const initializedKeys = new Set();

/*
 * Stable serialization for parameter objects.
 *
 * JSON.stringify({ a: 1, b: 2 })
 * and
 * JSON.stringify({ b: 2, a: 1 })
 *
 * should represent the same request.
 */
function stableSerialize(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${stableSerialize(value[key])}`
      )
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

export default function usePaginatedResource({
  cacheKey,
  fetcher,
  params = {},
  search = "",
  pageSize = 10,
  enabled = true,
  select,
  infinite = false,
}) {
  const dispatch = useDispatch();

  /*
   * Keep the selector stable even if the caller creates a new params
   * object on every render.
   */
  const paramsSignature = useMemo(
    () => stableSerialize(params ?? {}),
    [params]
  );

  const stableParams = useMemo(
    () => params ?? {},
    [paramsSignature]
  );

  const normalizedSearch = String(search ?? "").trim();

  /*
   * IMPORTANT:
   *
   * The cache key contains:
   *
   *   cacheKey
   *   search
   *   params
   *
   * This prevents something like:
   *
   *   workshops + radius 10
   *
   * from accidentally reusing:
   *
   *   workshops + radius 50
   */
  const key = useMemo(() => {
    const parts = [cacheKey];

    if (normalizedSearch) {
      parts.push(
        `search:${normalizedSearch.toLowerCase()}`
      );
    }

    if (paramsSignature !== "{}") {
      parts.push(`params:${paramsSignature}`);
    }

    return parts.join(":");
  }, [
    cacheKey,
    normalizedSearch,
    paramsSignature,
  ]);

  /*
   * Read only the pagination state for this specific key.
   */
  const paginationState = useSelector(
    (state) => state.pagination?.byKey?.[key]
  );

  const cache =
    paginationState?.pages ?? EMPTY_PAGES;

  const page =
    paginationState?.currentPage ?? 1;

  const totalCount =
    paginationState?.totalCount ?? 0;

  const isLoading =
    paginationState?.isLoading ?? false;

  const cachedPage = cache[page];

  /*
   * Initialize the key only once.
   *
   * We intentionally DO NOT reset the key here.
   *
   * Resetting on every key change creates unnecessary Redux work and
   * can also cause a request to be forgotten while it is still running.
   */
  useEffect(() => {
    if (initializedKeys.has(key)) {
      return;
    }

    initializedKeys.add(key);

    dispatch(
      initKey({
        key,
      })
    );
  }, [key, dispatch]);

  /*
   * Fetch a page.
   *
   * `force` is only used by retry().
   */
  const fetchPage = useCallback(
    async (requestedPage, force = false) => {
      if (!enabled) {
        return;
      }

      if (
        !Number.isFinite(requestedPage) ||
        requestedPage < 1
      ) {
        return;
      }

      /*
       * If the page already exists in the cache, do nothing.
       *
       * This is one of the most important protections against
       * unnecessary API calls.
       */
      if (
        !force &&
        cache[requestedPage] !== undefined
      ) {
        return;
      }

      /*
       * Track the exact key + page.
       *
       * This means:
       *
       * workshops:A:page:1
       *
       * and
       *
       * workshops:B:page:1
       *
       * can both load independently.
       */
      const requestId =
        `${key}::page:${requestedPage}`;

      /*
       * If this exact request is already running,
       * do absolutely nothing.
       */
      if (inFlightRequests.has(requestId)) {
        return;
      }

      inFlightRequests.add(requestId);

      /*
       * Track active requests for this resource.
       */
      const previousActiveCount =
        activeRequestsByKey.get(key) ?? 0;

      activeRequestsByKey.set(
        key,
        previousActiveCount + 1
      );

      /*
       * Only dispatch loading=true when the FIRST request
       * for this key starts.
       */
      if (previousActiveCount === 0) {
        dispatch(
          setPaginationLoading({
            key,
            loading: true,
          })
        );
      }

      try {
        const response = await dispatch(
          fetcher({
            skip:
              (requestedPage - 1) *
              pageSize,

            take: pageSize,

            ...stableParams,

            ...(normalizedSearch
              ? {
                  search: normalizedSearch,
                }
              : {}),
          })
        ).unwrap();

        /*
         * Normalize different API response shapes.
         */
        const parsed = select
          ? select(response)
          : {
              items:
                response?.pageList ??
                response?.items ??
                response?.collections ??
                response?.groups ??
                [],

              totalCount:
                response?.totalCount ?? 0,
            };

        /*
         * One page-data dispatch per successful request.
         */
        dispatch(
          setPageData({
            key,
            page: requestedPage,
            items: parsed?.items ?? [],
            totalCount:
              parsed?.totalCount ?? 0,
          })
        );
      } catch (error) {
        /*
         * Do NOT put failed pages into the cache.
         *
         * That means retry() can actually fetch them again.
         */
        console.error(
          `[usePaginatedResource] Failed to fetch ${key}, page ${requestedPage}`,
          error
        );
      } finally {
        /*
         * This request is no longer in flight.
         */
        inFlightRequests.delete(requestId);

        /*
         * Decrease the active request count.
         */
        const currentActiveCount =
          activeRequestsByKey.get(key) ?? 1;

        const remainingRequests = Math.max(
          0,
          currentActiveCount - 1
        );

        /*
         * Only dispatch loading=false when the LAST
         * active request for this key has completed.
         */
        if (remainingRequests === 0) {
          activeRequestsByKey.delete(key);

          dispatch(
            setPaginationLoading({
              key,
              loading: false,
            })
          );
        } else {
          activeRequestsByKey.set(
            key,
            remainingRequests
          );
        }
      }
    },
    [
      enabled,
      key,
      cache,
      pageSize,
      fetcher,
      stableParams,
      normalizedSearch,
      select,
      dispatch,
    ]
  );

  /*
   * Fetch the current page only when:
   *
   *   - fetching is enabled
   *   - the page is not already cached
   *
   * `fetchPage` itself also protects against duplicate requests.
   */
  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (cachedPage !== undefined) {
      return;
    }

    fetchPage(page);
  }, [
    enabled,
    page,
    cachedPage,
    fetchPage,
  ]);

  /*
   * Change pages.
   *
   * Do not dispatch if the requested page is already active.
   */
  const setPage = useCallback(
    (nextPage) => {
      if (
        !Number.isFinite(nextPage) ||
        nextPage < 1 ||
        nextPage === page
      ) {
        return;
      }

      dispatch(
        setCurrentPage({
          key,
          page: nextPage,
        })
      );
    },
    [
      dispatch,
      key,
      page,
    ]
  );

  /*
   * Calculate total pages.
   */
  const totalPages = Math.max(
    1,
    Math.ceil(
      totalCount / pageSize
    )
  );

  /*
   * Current page items.
   */
  const currentPageItems =
    Array.isArray(cachedPage)
      ? cachedPage
      : [];

  /*
   * Infinite mode combines all pages that have actually
   * been loaded.
   *
   * We do NOT fetch missing pages automatically here.
   * Fetching remains controlled by the current page.
   */
  const items = useMemo(() => {
    if (!infinite) {
      return currentPageItems;
    }

    return Object.keys(cache)
      .map(Number)
      .filter(
        (pageNumber) =>
          pageNumber <= page
      )
      .sort(
        (a, b) => a - b
      )
      .flatMap(
        (pageNumber) =>
          Array.isArray(
            cache[pageNumber]
          )
            ? cache[pageNumber]
            : []
      );
  }, [
    infinite,
    cache,
    page,
    currentPageItems,
  ]);

  /*
   * There is another page only when:
   *
   *   current page is below total pages
   *   AND
   *   current page returned a full page
   */
  const hasMore =
    page < totalPages &&
    currentPageItems.length >= pageSize;

  /*
   * Retry only affects the current page.
   *
   * We deliberately don't clear the entire pagination cache.
   */
  const retry = useCallback(() => {
    fetchPage(page, true);
  }, [
    fetchPage,
    page,
  ]);

  return {
    key,

    page,

    setPage,

    items,

    totalCount,

    totalPages,

    isLoading,

    loading: isLoading,

    hasMore,

    cache,

    retry,

    fetchPage,
  };
}
