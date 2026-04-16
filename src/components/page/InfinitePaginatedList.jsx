import { useEffect, useMemo, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initKey,
  setPageData,
  setLoading,
  setError,
} from "../../store/paginationSlice";

function InfinitePaginatedList({
  cacheKey,
  fetcher,
  pageSize = 20,
  renderItem,
  params = {},
  enabled = true,
  className = "",
  threshold = 300, // px before bottom trigger
}) {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  const pagination = useSelector(
    (state) => state.pagination.byKey?.[cacheKey] || {}
  );

  const pages = pagination.pages || {};
  const totalCount = pagination.totalCount || 0;
  const loading = pagination.loading;

  const pageCount = Object.keys(pages).length || 0;
  const nextPage = pageCount + 1;

  const items = useMemo(() => {
    return Object.values(pages).flat();
  }, [pages]);

  const totalLoaded = items.length;

  const hasMore =
    totalCount === 0 ? true : totalLoaded < totalCount;

  // init
  useEffect(() => {
    dispatch(initKey({ key: cacheKey }));
  }, [cacheKey]);

  const fetchPage = useCallback(
    async (page) => {
      if (!enabled || loading) return;
      if (!hasMore) return;
      if (pages[page]) return;

      try {
        dispatch(setLoading({ key: cacheKey, loading: true }));

        const res = await dispatch(
          fetcher({
            skip: (page - 1) * pageSize,
            take: pageSize,
            ...params,
          })
        ).unwrap();

        dispatch(
          setPageData({
            key: cacheKey,
            page,
            items: res.pageList || res.items || res.collections,
            totalCount: res.totalCount,
          })
        );
      } catch (err) {
        dispatch(
          setError({
            key: cacheKey,
            error: err?.message || "error",
          })
        );
      } finally {
        dispatch(setLoading({ key: cacheKey, loading: false }));
      }
    },
    [cacheKey, pages, loading, hasMore, enabled, params]
  );

  // initial load
  useEffect(() => {
    if (pageCount === 0) {
      fetchPage(1);
    }
  }, [pageCount]);

  // intersection observer (infinite scroll trigger)
  useEffect(() => {
    if (!containerRef.current) return;

    const target = containerRef.current;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          fetchPage(nextPage);
        }
      },
      {
        root: null,
        rootMargin: `0px 0px ${threshold}px 0px`,
        threshold: 0,
      }
    );

    observerRef.current.observe(target);

    return () => observerRef.current?.disconnect();
  }, [fetchPage, loading, hasMore, nextPage]);

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={item.id ?? index}>{renderItem(item, index)}</div>
      ))}

      {/* 👇 sentinel element */}
      <div ref={containerRef} className="h-10 flex items-center justify-center">
        {loading && (
          <div className="text-sm text-gray-400">Loading...</div>
        )}
        {!hasMore && (
          <div className="text-sm text-gray-400">End of list</div>
        )}
      </div>
    </div>
  );
}

export default InfinitePaginatedList;

{/* <InfinitePaginatedList
  cacheKey="stories"
  fetcher={getMyStories}
  pageSize={8}
  renderItem={(story) => (
    <div
      onClick={() => {
        router.push(Paths.page.createRoute(story.id));
        resetDialog();
      }}
      className="p-4 border border-soft rounded-xl"
    >
      {story.title || "Untitled"}
    </div>
  )}
/> */}