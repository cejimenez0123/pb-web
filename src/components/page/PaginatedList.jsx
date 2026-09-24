

import PaginationControls from "../PaginationControls";
import usePaginatedResource from "../../core/usePaginatedResource";

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

  // "controls" | "infinite" | "none"
  pagination = "controls",
}) {
  const {
    page,
    setPage,
    items,
    totalPages,
    loading,
    hasMore,
  } = usePaginatedResource({
    cacheKey,
    fetcher,
    pageSize,
    params,
    search,
    enabled,
    infinite: pagination === "infinite",
  });

  const loadMore = () => {
    if (loading || !hasMore) return;

    setPage(page + 1);
  };

  return (
    <div
      className={`
        space-y-2
        bg-cream
        dark:bg-base-bgDark
        ${className}
      `}
    >
      {loading && !items.length && (
        <div className="p-4 text-gray-400">
          Loading...
        </div>
      )}

      {!loading && !items.length && (
        emptyState || (
          <div className="p-4 text-gray-400">
            Nothing here yet.
          </div>
        )
      )}

      {items.map((item, index) => (
        <div key={item.id ?? index}>
          {renderItem(item, index)}
        </div>
      ))}

      {items.length > 0 && pagination === "controls" && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          className="bg-cream dark:bg-base-bgDark"
        />
      )}

      {items.length > 0 && pagination === "infinite" && hasMore && (
        <div className="flex justify-center py-8">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="
              border-b
              border-gray-300
              pb-1
              text-sm
              text-gray-600
              transition-colors
              hover:border-emerald-700
              hover:text-emerald-800
              disabled:opacity-40
            "
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}