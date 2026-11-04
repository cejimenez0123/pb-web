import PaginatedList from "../page/PaginatedList";
import Paths from "../../core/paths";

import { getMyStories } from "../../actions/StoryActions";
import shortName from "../../core/shortName";
import SectionHeader from "../pieces/SectionHeader";
import EmptyState from "../general/EmptyState";

import styles from "../../styles/style";
import ListPill from "../page/ListPill";

const PAGE_SIZE = 8;

export default function PortfolioSection({
  profile,
  router,
  search,
  setSearch,
  searchInput,
  setSearchInput,
  debouncedSearch,
}) {
  const portfolioCollection =
    profile?.profileToCollections?.find(
      (ptc) => ptc.type === "portfolio"
    )?.collection;



  return (
    <section
      aria-labelledby="portfolio-heading"
      className={styles.profile.portfolio.section}
    >
          <div className={styles.profile.mine.sectionHeader}>
        <div>
          <h2
            id="archive-heading"
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
            className={styles.profile.portfolio.searchInput}
          />
        </div>
      <div className={styles.profile.portfolio.list}>
        <PaginatedList
          cacheKey="profile:portfolio"
          params={{
            type: "portfolio",
          }}
          fetcher={getMyStories}
          pageSize={PAGE_SIZE}
          pagination="infinite"
          enabled={!!profile?.id}
          search={debouncedSearch}
          emptyState={
            <EmptyState
              text={
                search
                  ? "No matching work."
                  : "No portfolio work yet."
              }
            />
          }
          renderItem={(item) => (
            <>
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
          </>
      
          )
        }
        />
      </div>
    </section>
  );
}

function PortfolioListItem({ item, router }) {
  const collection = item?.collection;
  const stories = item?.stories || [];

  if (!collection) {
    return null;
  }

  return (
    <article className={styles.profile.portfolio.article}>
      {stories.length > 0 ? (
        <ul
          aria-label={`${collection.title || "Portfolio"} work`}
          className={styles.profile.portfolio.storyList}
        >
          {stories.map((story) => {
            const title =
              story.title?.trim() || "Untitled";

            const descriptionId =
              `portfolio-story-${story.id}-description`;

            return (
              <li
                key={story.id}
                className={styles.profile.portfolio.storyRow+ "     "}
              >
                <div
                  type="button"
                  onClick={() =>
                    router.push(
                      Paths.page.createRoute(story.id)
                    )
                  }
                  aria-label={`Read ${title}`}
                  aria-describedby={
                    story.description
                      ? descriptionId
                      : undefined
                  }
                  className={
                    styles.profile.portfolio.storyButton+ styles.button.base
                  }
                >
                  <div
                    className={
                      styles.profile.portfolio.storyContent+"  border flex flex-row justify-between border-1 rounded-full py-4 border-plumb-accent-blue/40 hover:ring-1 hover:ring-offset-1 px-6 "
                    }
                  >
                    <p
                      className={
                        styles.profile.portfolio.storyTitle
                      }
                    >
                      {title}
                    </p>

                    {story.description && (
                      <p
                        id={descriptionId}
                        className={
                          styles.profile.portfolio
                            .storyDescription
                        }
                      >
                        {shortName(
                          story.description,
                          80
                        )}
                      </p>
                    )}
                      <span
                    aria-hidden="true"
                 
                  >
                    →
                  </span>
                  </div>

                
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p
          role="status"
          className={
            styles.profile.portfolio.emptyCollection
          }
        >
          No work in this collection yet.
        </p>
      )}
    </article>
  );
}
