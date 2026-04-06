import React,{ useMemo, useState } from "react";

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