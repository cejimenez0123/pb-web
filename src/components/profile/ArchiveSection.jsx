
import Paths from "../../core/paths";
import styles from "../../styles/style";
import EmptyState from "../general/EmptyState";
import ListPill from "../page/ListPill";
import PaginatedList from "../page/PaginatedList";

function ArchiveSection({
  profile,
  router,
  search,
  setSearch,
  searchInput,
  setSearchInput,
  debouncedSearch,
  resource,
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
          resource={resource}
          emptyState={
            <EmptyState
              text={
                debouncedSearch
                  ? "No matching stories."
                  : "No stories yet."
              }
            />
          }
          renderItem={(item) => {
            const collection = item?.collection;

            const stories = collection?.storyIdList ?? [];

            return (
              <div
                key={collection?.id ?? item.id}
                className="space-y-3"
              >
                {stories.map((entry) => {
                  const story = entry?.story;

                  if (!story?.id) return null;

                  return (
                    <ListPill
                      key={story.id}
                      router={router}
                      item={{ story }}
                      profile={profile}
                      onClick={() =>
                        router.push(
                          Paths.page.createRoute(story.id)
                        )
                      }
                    />
                  );
                })}
              </div>
            );
          }}
        />
      </div>
    </section>
  );
}

export default ArchiveSection;
