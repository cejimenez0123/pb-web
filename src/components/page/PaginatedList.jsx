
import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PaginationControls from "../PaginationControls";
import { initKey, setPageData, setPaginationLoading } from "../../actions/PageActions";
// "stories"
// "stories:drafts"
// "stories:type=library"
// "collections:user=123"
function PaginatedList({
  cacheKey,
  fetcher,
  pageSize = 20,
  renderItem,
  params = {},
  emptyState = null,
  className = "",
  enabled = true,
}) {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState("next");

  const cache = useSelector(
    (state) => state.pagination.byKey[cacheKey]?.pages || {}
  );

  const totalCount = useSelector(
    (state) => state.pagination.byKey[cacheKey]?.totalCount || 0
  );

  const items = cache[page] || [];

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / pageSize)),
    [totalCount, pageSize]
  );

  const fetchPage = async (p) => {
    if (!enabled) return;

    dispatch(initKey({ key: cacheKey }));
    dispatch(setPaginationLoading({ key: cacheKey, loading: true }));

    try {
      const res = await dispatch(
        fetcher({
          skip: (p - 1) * pageSize,
          take: pageSize,
          ...params,
        })
      ).unwrap();

      dispatch(
        setPageData({
          key: cacheKey,
          page: p,
          items: res.pageList || res.items || res.collections || [],
          totalCount: res.totalCount,
        })
      );
    } catch (err) {
      console.error("pagination error:", err);
    } finally {
      dispatch(setPaginationLoading({ key: cacheKey, loading: false }));
    }
  };

  useEffect(() => {
    fetchPage(page);

    // optional prefetch
    fetchPage(page + 1);
  }, [page, JSON.stringify(params)]);

  const goToPage = (nextPage) => {
    setDirection(nextPage > page ? "next" : "prev");
    setPage(nextPage);
  };

  if (!items.length && !cache[page]) {
    return emptyState || <div className="p-4 text-gray-400">Loading...</div>;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative overflow-hidden">
        <div
          key={page}
          className={`space-y-2 transition-all duration-300 ease-out`}
        >
          {(cache[page] || items).map((item, index) => (
            <div key={item.id ?? index}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        setPage={goToPage}
      />
    </div>
  );
}

export default PaginatedList;