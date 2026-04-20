

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { initKey, setPageData, setPaginationLoading } from "../../actions/PageActions";
import PaginationControls from "../PaginationControls";


export default function PaginatedList({
  cacheKey,
  fetcher,
  pageSize = 20,
  renderItem,
  params = {},
  search = "",
  emptyState = null,
  className = "",
  enabled = true,
}) {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);

  const cache = useSelector(
    (state) => state.pagination.byKey?.[cacheKey]?.pages || {}
  );

  const totalCount = useSelector(
    (state) => state.pagination.byKey?.[cacheKey]?.totalCount || 0
  );

  const items = cache[page] || [];

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // ✅ RESET ONLY WHEN SEARCH CHANGES (NOT EVERY RENDER)
  useEffect(() => {
    dispatch(initKey({ key: cacheKey }));
    setPage(1);
  }, [search, cacheKey]);
const fetchPage = async (p) => {
  if (!enabled) return;
  if (cache[p]) return; 

  dispatch(setPaginationLoading({ key: cacheKey, loading: true }));
    if (!enabled) return;

    dispatch(setPaginationLoading({ key: cacheKey, loading: true }));

    try {
      const res = await dispatch(
        fetcher({
          skip: (p - 1) * pageSize,
          take: pageSize,
          ...params,
          search, // important
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
    } finally {
      dispatch(setPaginationLoading({ key: cacheKey, loading: false }));
    }
  };

  useEffect(() => {
    fetchPage(page);
  }, [page, search]); 
 
  return (
    <div className={`space-y-2 ${className}`}>
      {!items.length && !cache[page]?emptyState || <div className="p-4 text-gray-400">Loading...</div>:(cache[page] || items).map((item, index) => (
        <div key={item.id ?? index}>{renderItem(item, index)}</div>
      ))}
      <PaginationControls 
        page={page}
  totalPages={totalPages}
  setPage={setPage}
  className = ""
      
      />
    </div>
  );
}