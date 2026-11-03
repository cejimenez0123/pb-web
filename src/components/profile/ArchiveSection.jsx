import { getMyStories } from "../../actions/StoryActions";
import Paths from "../../core/paths";
import styles from "../../styles/style";
import EmptyState from "../general/EmptyState";
import ListPill from "../page/ListPill";
import PaginatedList from "../page/PaginatedList";
const PAGE_SIZE = 8
function ArchiveSection({
  profile,
  router,
  search,
  setSearch,
  searchInput,
  setSearchInput,
  debouncedSearch,
  storiesParams,
}) {
  return (
    <section aria-labelledby="archive-heading">
      <div className={styles.profile.mine.sectionHeader}>
        <div>
          <h2
            id="archive-heading"
            className={styles.profile.mine.sectionTitle}
          >
            Archive
          </h2>

          <p className={styles.profile.mine.sectionDescription}>
            For later
          </p>
        </div>

        <label className="w-full sm:max-w-[18rem]">
          <span className="sr-only">
            Search archived stories
          </span>

          <input
            type="search"
            value={searchInput}
            onChange={(e) => {
              const value = e.target.value;
              setSearchInput(value);
              setSearch(value);
            }}
            placeholder="Search"
            aria-label="Search archived stories"
            className={styles.profile.mine.search}
          />
        </label>
      </div>

      <div className="mt-6">
        <PaginatedList
          cacheKey="stories"
          params={storiesParams}
          fetcher={getMyStories}
          pageSize={PAGE_SIZE}
          enabled={!!profile?.id}
          search={debouncedSearch}
          emptyState={
            <EmptyState
              text={
                search
                  ? "No matching stories."
                  : "No stories yet."
              }
            />
          }
          renderItem={(item) => (
            <ListPill
            router={router}
              key={item.id}
              item={{story:item}}
              profile={profile}
              onClick={() =>
                router.push(
                  Paths.page.createRoute(item.id)
                )
              }
            />
          )}
        />
      </div>
    </section>
  );
}
export default ArchiveSection