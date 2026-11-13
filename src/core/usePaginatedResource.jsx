
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  initKey,
  setPageData,
  setPaginationLoading,
  setCurrentPage,
} from "../actions/PageActions";

const EMPTY_PAGES = {};

const inFlightRequests = new Set();
const activeRequestsByKey = new Map();
const initializedKeys = new Set();

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

  const normalizedSearch = String(search ?? "").trim();

  const paramsSignature = stableSerialize(params ?? {});

  const stableParams = useMemo(
    () => params ?? {},
    [paramsSignature]
  );

  // A distinct key for each resource, filter, search and page size.
  const key = useMemo(
    () =>
      [
        cacheKey,
        `size:${pageSize}`,
        paramsSignature !== "{}"
          ? `params:${paramsSignature}`
          : null,
        normalizedSearch
          ? `search:${normalizedSearch}`
          : null,
      ]
        .filter(Boolean)
        .join(":"),
    [
      cacheKey,
      pageSize,
      paramsSignature,
      normalizedSearch,
    ]
  );

  // Detect a new search or filter immediately.
  const previousKeyRef = useRef(key);
  const keyChanged = previousKeyRef.current !== key;

  if (keyChanged) {
    previousKeyRef.current = key;
  }

  const paginationState = useSelector(
    (state) => state.pagination?.byKey?.[key]
  );

  const cache = paginationState?.pages ?? EMPTY_PAGES;

  // Keep the latest cache without recreating fetchPage on every update.
  const cacheRef = useRef(cache);
  cacheRef.current = cache;

  const storedPage = paginationState?.currentPage ?? 1;

  // New searches always start at page 1.
  const page = keyChanged ? 1 : storedPage;

  const totalCount = paginationState?.totalCount ?? 0;
  const isLoading = paginationState?.isLoading ?? false;

  const cachedPage = cache[page];

  // Initialize each cache key once.
  useEffect(() => {
    if (initializedKeys.has(key)) return;

    initializedKeys.add(key);
    dispatch(initKey({ key }));
  }, [key, dispatch]);

  // Reset an existing query's pagination when revisiting it.
  useEffect(() => {
    if (!keyChanged || storedPage === 1) return;

    dispatch(
      setCurrentPage({
        key,
        page: 1,
      })
    );
  }, [key, keyChanged, storedPage, dispatch]);

  const fetchPage = useCallback(
    async (requestedPage, force = false) => {
      if (
        !enabled ||
        typeof fetcher !== "function" ||
        !Number.isInteger(requestedPage) ||
        requestedPage < 1
      ) {
        return;
      }

      // Do not fetch cached pages unless explicitly retrying.
      if (
        !force &&
        cacheRef.current[requestedPage] !== undefined
      ) {
        return;
      }

      const requestId = `${key}:page:${requestedPage}`;

      // Prevent duplicate requests across components and StrictMode.
      if (inFlightRequests.has(requestId)) return;

      inFlightRequests.add(requestId);

      const activeCount = activeRequestsByKey.get(key) ?? 0;

      activeRequestsByKey.set(key, activeCount + 1);

      if (activeCount === 0) {
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
            skip: (requestedPage - 1) * pageSize,
            take: pageSize,
            ...stableParams,
            ...(normalizedSearch
              ? { search: normalizedSearch }
              : {}),
          })
        ).unwrap();

        const parsed = select
          ? select(response)
          : {
              items:
                response?.items ??
                response?.pageList ??
                response?.collections ??
                response?.groups ??
                [],
              totalCount: response?.totalCount ?? 0,
            };

        dispatch(
          setPageData({
            key,
            page: requestedPage,
            items: Array.isArray(parsed?.items)
              ? parsed.items
              : [],
            totalCount: Number(parsed?.totalCount) || 0,
          })
        );
      } catch (error) {
        console.error(
          `[usePaginatedResource] Failed: ${key}, page ${requestedPage}`,
          error
        );
      } finally {
        inFlightRequests.delete(requestId);

        const remaining =
          (activeRequestsByKey.get(key) ?? 1) - 1;

        if (remaining <= 0) {
          activeRequestsByKey.delete(key);

          dispatch(
            setPaginationLoading({
              key,
              loading: false,
            })
          );
        } else {
          activeRequestsByKey.set(key, remaining);
        }
      }
    },
    [
      enabled,
      fetcher,
      key,
      pageSize,
      stableParams,
      normalizedSearch,
      select,
      dispatch,
    ]
  );

  // Only fetch when the current page is missing.
  useEffect(() => {
    if (
      !enabled ||
      keyChanged ||
      cachedPage !== undefined
    ) {
      return;
    }

    fetchPage(page);
  }, [
    enabled,
    keyChanged,
    cachedPage,
    page,
    fetchPage,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / pageSize)
  );

  const setPage = useCallback(
    (nextPage) => {
      if (
        !Number.isInteger(nextPage) ||
        nextPage < 1 ||
        nextPage > totalPages ||
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
    [dispatch, key, page, totalPages]
  );

  const currentPageItems = Array.isArray(cachedPage)
    ? cachedPage
    : [];

  const items = useMemo(() => {
    if (!infinite) {
      return currentPageItems;
    }

    return Object.keys(cache)
      .map(Number)
      .filter(
        (pageNumber) =>
          pageNumber >= 1 && pageNumber <= page
      )
      .sort((a, b) => a - b)
      .flatMap((pageNumber) =>
        Array.isArray(cache[pageNumber])
          ? cache[pageNumber]
          : []
      );
  }, [infinite, cache, page, currentPageItems]);

  const hasMore = page < totalPages;

  const retry = useCallback(() => {
    fetchPage(page, true);
  }, [fetchPage, page]);

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
