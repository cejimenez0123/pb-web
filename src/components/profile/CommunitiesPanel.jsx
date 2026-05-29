import Paths from "../../core/paths";
import EmptyState from "../EmptyState";
import PaginatedList from "../page/PaginatedList";
import { getMyCollections } from "../../actions/CollectionActions";
import { useSelector } from "react-redux";

const CommunitiesPanel = ({fetch,id, router }) => {
  const profile = useSelector((state) => state.users.currentProfile);

  return (
    <PaginatedList
  cacheKey={`libraries${id ? `:${id}` : ""}`}
      params={{ type: "library" }}
      fetcher={fetch}
      pageSize={6}
      enabled={!!profile?.id}
      emptyState={<EmptyState text="No Communities" />}
      renderItem={(c) => (
        <div
          key={c.id}
          onClick={() => router.push(Paths.collection.createRoute(c.id))}
          className="p-4 rounded-xl bg-base-bg active:scale-[0.98] transition"
        >
          <p className="text-sm font-medium text-gray-900">
            {c.title?.length > 0 ? c.title : "Untitled"}
          </p>
          {c.purpose && (
            <p className="text-sm text-gray-500 mt-1">{c.purpose}</p>
          )}
        </div>
      )}
    />
  );
};

export default CommunitiesPanel;