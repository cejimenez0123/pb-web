
import Paths from "../../core/paths";
import PaginatedList from "../page/PaginatedList";
import { useSelector } from "react-redux";
import EmptyState from "../general/EmptyState";
import styles from "../../styles/style";
import truncate from "html-truncate";

const CommunitiesPanel = ({ fetch, id, router }) => {
  const profile = useSelector((state) => state.users.currentProfile);

  const communityStyles = styles.communities

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
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              router.push(Paths.collection.createRoute(c.id));
            }
          }}
          className={communityStyles.item+" h-[6rem] "}
        >
          <p className={communityStyles.title}>
            {c.title?.length > 0 ? c.title : "Untitled"}
          </p>

          {c.purpose && (
            <p className={communityStyles.purpose}>
              {truncate(c.purpose,94)}
            </p>
          )}
        </div>
      )}
    />
  );
};

export default CommunitiesPanel;