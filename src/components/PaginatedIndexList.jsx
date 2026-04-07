import React,{ useMemo, useState } from "react";
import PaginationControls from "./PaginationControls";
import Paths from "../core/paths";

const IndexList = ({ items, router }) => (
  <div className="space-y-2">
    {items.map((i) => (
      <div
        key={i.id}
        onClick={() => router.push(Paths.collection.createRoute(i.id))}
        className="p-3 rounded-full border border-purple border-1 bg-base-bg backdrop-blur-sm shadow-sm active:scale-[0.98] transition"
      >
        <span className="text-[0.95rem] font-medium text-gray-800">
          {i.title ?? i.name ?? "Untitled"}
        </span>
      </div>
    ))}
  </div>
)

const PaginatedIndexList = ({ items,router }) => {


  const [page, setPage] = useState(1);
  const limit = 8;

  const totalPages = Math.ceil(items.length / limit);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * limit;
    return items.slice(start, start + limit);
  }, [items, page]);

  return (
    <div className="space-y-4">
      <IndexList items={paginatedItems} router={router} />

      <PaginationControls
        page={page}
      
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  );
};
export default React.memo(PaginatedIndexList)