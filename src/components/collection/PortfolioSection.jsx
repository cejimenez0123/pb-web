
import PaginatedList from "../page/PaginatedList";
import Paths from "../../core/paths";
import EmptyState from "../general/EmptyState";
import styles from "../../styles/style";
import ListPill from "../page/ListPill";

export default function PortfolioSection({
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
    <section
      aria-labelledby="portfolio-heading"
      className={styles.profile.portfolio.section}
    >
      <div className={styles.profile.mine.sectionHeader}>
        <div>
          <h2
            id="portfolio-heading"
            onClick={() =>
              router.push(Paths.collection.createRoute())
            }
            className={styles.profile.mine.sectionTitle}
          >
            Portfolio
          </h2>

          <p className={styles.profile.mine.sectionDescription}>
            What you want people to see
          </p>
        </div>

        <input
          id="portfolio-search"
          type="search"
          value={searchInput ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setSearchInput(value);
            setSearch(value);
          }}
          placeholder="Search portfolio"
          className={styles.profile.mine.search}
        />
      </div>

      <div className={styles.profile.portfolio.list}>
        <PaginatedList
          resource={resource}
          emptyState={
            <EmptyState
              text={
                search
                  ? "No matching stories."
                  : "No stories in your portfolio yet."
              }
            />
          }
          renderItem={(item) => {
            const collection = item?.collection;

            const stories =
              collection?.storyIdList
                ?.map((entry) => entry.story)
                .filter(Boolean) || [];

            if (!collection) return null;

            return (
              <article
                key={item.id}
                className={styles.profile.portfolio.article}
              >
                <h3 className="mb-3">
                  {collection.title}
                </h3>

                {stories.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {stories.map((story) => (
                      <ListPill
                        key={story.id}
                        item={{ story }}
                        profile={profile}
                        onClick={() =>
                          router.push(
                            Paths.page.createRoute(story.id)
                          )
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <p
                    className={
                      styles.profile.portfolio.emptyCollection
                    }
                  >
                    No work in this collection yet.
                  </p>
                )}
              </article>
            );
          }}
        />
      </div>
    </section>
  );
}
