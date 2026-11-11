
import { Fragment } from "react";
import PaginationControls from "../PaginationControls";

export default function PaginatedList({
  resource,
 
  renderItem,
  emptyState = null,
  className = "",
  pagination = "controls",
}) {
  
  const {
    items = [],
    page = 1,
    setPage,
    totalPages = 1,
    loading = false,
    hasMore = false,
  } = resource ?? {};

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

      {items.length > 0 && (
        <div className="flex w-[100%] flex-col gap-2">
          {items.map((item, index) => (
            <Fragment key={item?.id ?? index}>
              {renderItem(item, index)}
            </Fragment>
          ))}
        </div>
      )}

      {items.length > 0 && pagination === "controls" && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          className="bg-cream dark:bg-base-bgDark"
        />
      )}

      {items.length > 0 &&
        pagination === "infinite" &&
        hasMore && (
          <div className="flex justify-center py-8">
            <button
              type="button"
              onClick={loadMore}
              disabled={loading}
              className="pb-1 text-sm text-gray-600 transition-colors disabled:opacity-40"
            >
              {loading ? "Loading…" : "Load more"}
            </button>
          </div>
        )}
    </div>
  );
}
