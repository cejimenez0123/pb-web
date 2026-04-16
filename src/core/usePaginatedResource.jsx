
// import { useEffect, useRef, useState } from "react";
// import { useDispatch } from "react-redux";
// import { Preferences } from "@capacitor/preferences";
// function usePaginatedResource({
//   key,
//   fetcher,
//   pageSize = 20,
//   params = {},
//   enabled = true,
//   prefetch = true,
//   select = (res) => res,
// }) {
//   const dispatch = useDispatch();

//   const [page, setPage] = useState(1);
//   const [cache, setCache] = useState({});
//   const [totalCount, setTotalCount] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const cacheRef = useRef({});
//   const inFlight = useRef(new Set());

//   useEffect(() => {
//   persistCache(cache);
// }, [cache]);
// const persistCache = async (newCache) => {
//   await Preferences.set({
//     key: `cache_${key}`,
//     value: JSON.stringify(newCache),
//   });
// };
// useEffect(() => {
//   async function loadCache() {
//     const stored = await Preferences.get({ key: `cache_${key}` });
//     if (stored.value) {
//       const parsed = JSON.parse(stored.value);
//       setCache(parsed);
//       cacheRef.current = parsed;
//     }
//   }
//   loadCache();
// }, [key]);
//   const items = cache[page] || [];
//   const totalPages = Math.max(1, Math.ceil((totalCount || 0) / pageSize));

//   const fetchPage = async (p) => {
//     if (!enabled) return;

//     if (cacheRef.current[p] || inFlight.current.has(p)) return;

//     inFlight.current.add(p);

//     try {
//       setLoading(true);

//       const res = await dispatch(
//         fetcher({
//           skip: (p - 1) * pageSize,
//           take: pageSize,
//           ...params,
//         })
//       ).unwrap();

//       const parsed = select(res);

//       setCache((prev) => ({
//         ...prev,
// //         [p]: parsed.items,
// //       }));

// //       setTotalCount(parsed.totalCount ?? 0);
// //     } catch (err) {
// //       console.error(`${key} pagination error:`, err);
// //     }

// //     inFlight.current.delete(p);
// //     setLoading(false);
// //   };

// //   useEffect(() => {
// //     fetchPage(page);

// //     if (prefetch) {
// //       fetchPage(page + 1);
// //       fetchPage(page + 2);
// //     }
// //   }, [
// //     page,
// //     enabled,
// //     fetcher,
// //     pageSize,
// //     JSON.stringify(params),
// //     prefetch,
// //   ]);

// //   return {
// //     page,
// //     setPage,
// //     items,
// //     cache,
// //     loading,
// //     totalCount,
// //     totalPages,
// //   };
// // }

// // export default usePaginatedResource;
// import { useDispatch, useSelector } from "react-redux";

// function usePaginatedResource({
//   key,
//   fetcher,
//   pageSize = 20,
//   params = {},
//   enabled = true,
//   select = (res) => res,
// }) {
//   const dispatch = useDispatch();

//   const state = useSelector((s) => s.pagination.byKey?.[key] || {});

//   const page = state.currentPage || 1;
//   const pages = state.pages || {};
//   const totalCount = state.totalCount || 0;

//   const items = pages[page] || [];

//   const fetchPage = async (p) => {
//     if (!enabled) return;
//     if (pages[p]) return;

//     dispatch(setPageLoading({ key, page: p, loading: true }));

//     const res = await dispatch(
//       fetcher({
//         skip: (p - 1) * pageSize,
//         take: pageSize,
//         ...params,
//       })
//     ).unwrap();

//     const parsed = select(res);

//     dispatch(
//       setPageData({
//         key,
//         page: p,
//         items: parsed.items,
//         totalCount: parsed.totalCount,
//       })
//     );
//   };

//   useEffect(() => {
//     fetchPage(page);
//   }, [page, key, JSON.stringify(params)]);

//   return {
//     page,
//     setPage: (p) => dispatch(setCurrentPage({ key, page: p })),
//     items,
//     totalCount,
//     cache: pages,
//   };
// }
// export default usePaginatedResource
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage, setPageData } from "../actions/PageActions"
import { useEffect } from "react";

function usePaginatedResource({
  key,
  fetcher,
  pageSize,
  enabled,
  select,
}) {
  const dispatch = useDispatch();

  const state = useSelector((s) => s.pagination.byKey?.[key] || {});

  const page = state.currentPage || 1;
  const pages = state.pages || {};
  const totalCount = state.totalCount || 0;

  const items = pages[page] || [];

  const fetchPage = async (p) => {
    if (!enabled) return;
    if (pages[p]) return;

    const res = await dispatch(
      fetcher({
        skip: (p - 1) * pageSize,
        take: pageSize,
      })
    ).unwrap();

    const parsed = select(res);

    dispatch(setPageData({
      key,
      page: p,
      items: parsed.items,
      totalCount: parsed.totalCount,
    }));
  };

  useEffect(() => {
    fetchPage(page);
  }, [page, key, enabled]);

  const setPage = (p) => {
    dispatch(setCurrentPage({ key, page: p }));
  };

  return {
    page,
    setPage,
    items,
    totalCount,
    cache: pages,
  };
}
export default usePaginatedResource