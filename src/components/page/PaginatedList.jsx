import { useMemo, useState, useEffect } from "react";
import usePaginatedResource from "../../core/usePaginatedResource";
import PaginationControls from "../PaginationControls";

function PaginatedList({
  fetcher,
  pageSize = 20,
  renderItem,
  params = {},
  emptyState = null,
  className = "",
  enabled = true,
}) {
  const resource = usePaginatedResource({
    fetcher,
    pageSize,
    params,
    enabled,
    select: (res) => ({
      items: res.items || res.collections || res.pageList,
      totalCount: res.totalCount,
    }),
  });

  const { items, page, setPage, totalCount, cache } = resource;

  const [direction, setDirection] = useState("next");

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / pageSize)),
    [totalCount, pageSize]
  );

  const goToPage = (nextPage) => {
    setDirection(nextPage > page ? "next" : "prev");
    setPage(nextPage);
  };

  if (!items?.length && !cache[page]) {
    return emptyState || <div className="p-4 text-gray-400">Loading...</div>;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative overflow-hidden">

        <div
          key={page}
          className={`space-y-2 transform transition-all duration-300 ease-out
            ${direction === "next"
              ? "animate-in fade-in slide-in-from-right-3"
              : "animate-in fade-in slide-in-from-left-3"
            }
          `}
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