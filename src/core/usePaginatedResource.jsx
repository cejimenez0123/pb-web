
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage, setPageData } from "../actions/PageActions"
import { useEffect } from "react";

function usePaginatedResource({
  key,
  fetcher,
  pageSize,
  type,
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
        type
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