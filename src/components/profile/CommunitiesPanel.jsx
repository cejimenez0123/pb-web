import { useMemo, useState } from "react";
import Paths from "../../core/paths";
import PaginationControls from "../PaginationControls";

const CommunitiesPanel = ({communities ,router}) => {
//   const router = useIonRouter();

  // const communities = profile?.communities ?? [];

  const [page, setPage] = useState(1);
  const limit = 6; // adjust based on feel

  const totalPages = Math.ceil(communities.length / limit);

  const paginatedCommunities = useMemo(() => {
    const start = (page - 1) * limit;
    return communities.slice(start, start + limit);
  }, [communities, page]);

  if (!communities.length) {
    return (
      <div className="text-center py-12 text-sm text-gray-400">
        No communities yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* List */}
      {paginatedCommunities.map((c) => (
        <div
          key={c.id}
          onClick={() => router.push(Paths.collection.createRoute(c.id))}
          className="p-4 rounded-xl bg-gray-50 active:scale-[0.98] transition"
        >
          <p className="text-sm font-medium text-gray-900">
            {c.title.length>0?c.title:"Untitled"}
          </p>

          {c.purpose && (
            <p className="text-sm text-gray-500 mt-1">
              {c.purpose}
            </p>
          )}
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      )}
    </div>
  );
};
export default CommunitiesPanel