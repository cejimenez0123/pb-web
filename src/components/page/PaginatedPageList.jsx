import React, { useMemo, useState } from "react";
import PageProfileList from "./PageProfileList";
import PaginationControls from "../PaginationControls";

const PaginatedPageList = ({ items,router }) => {


  const [page, setPage] = useState(1);
  const limit = 10; // items per page

  const totalPages = Math.ceil(items.length / limit);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return items.slice(start, end);
  }, [items, page]);

  return (
    <div className="space-y-4">
      <PageProfileList items={paginatedItems} router={router} />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  );
};
export default React.memo(PaginatedPageList)