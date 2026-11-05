

// import EmptyState from "../EmptyState";
import PaginatedList from "../page/PaginatedList";
import Paths from "../../core/paths";

import { getMyStories } from "../../actions/StoryActions";
import shortName from "../../core/shortName";
import SectionHeader from "../pieces/SectionHeader";
import EmptyState from "../general/EmptyState";
import styles from "../../styles/style";

const PAGE_SIZE = 8;

export default function EventsSection({
  profile,
  router,
  search,
  setSearch,
  searchInput,
  setSearchInput,
  debouncedSearch,
}) {
  const id = profile.profileToCollections.find(ptc=>ptc.type=="events").collection.id
  return (
    <section>
      <div
        // className="
        //   flex
        //   flex-col
        //   gap-5
        //   border-b
        //   border-card-border
        //   pb-5
        //   sm:flex-row
        //   sm:items-end
        //   sm:justify-between
        // "
      >
        <div>
 
      
        

<div className={styles.profile.mine.sectionHeader}>
        <div>
          <h2
            id="archive-heading"
            className={styles.profile.mine.sectionTitle}
          >
            Events
          </h2>

          <p className={styles.profile.mine.sectionDescription}>
           Where you meet the world"
          </p>
        </div>

        <label className="w-full sm:max-w-[18rem]">
          <span className="sr-only">
            Search
          </span>


        <input
          value={searchInput}
          onChange={(e) => {
            const value = e.target.value;
            setSearchInput(value);
            setSearch(value);
          }}
          placeholder="Search"
          className={styles.profile.mine.search}
        />
        </label>
      </div>


        </div>

      </div>

      <div className="mt-8">
        <PaginatedList
          cacheKey="profile:events"
          params={{
            type: "events",
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
                  ? "No matching events."
                  : "No events yet."
              }
            />
          }
          renderItem={(item) => (
            <EventListItem
              key={item.collection?.id}
              item={item}
              router={router}
            />
          )}
        />
      </div>
    </section>
  );
}

function EventListItem({ item, router }) {
  const collection = item?.collection;
  const stories = item?.stories || [];

  if (!collection) {
    return null;
  }

  return (
    <article
      className="
        w-[100%]
        border-b
        border-soft
        py-6
        first:pt-0
      "
    >


      {/* STORIES INSIDE EVENT */}
      {stories.length > 0 && (
        
          <div className="space-y-4">
            {stories.map((story) => (
              <button
                key={story.id}
                type="button"
                onClick={() =>
                  router.push(
                    Paths.page.createRoute(story.id)
                  )
                }
                className="
                  group
                  flex
                  w-[100%]
                  items-start
                  justify-between
                 
                  border-b
                  border-soft
                  py-3
                  text-left
                  last:border-b-0
                "
              >
                <div className="min-w-0 ">
                  <p
                    className="
                      font-serif
                      text-base
                      leading-snug
                      text-plumb-ink
                      dark:text-plumb-darkText/90
                      transition-colors
                      group-hover:text-emerald-800
                    "
                  >
                  {story.title}
                  </p>

                  {story.description && (
                    <p
                      className="
                        mt-1
                        text-sm
                        leading-relaxed
                        text-gray-500
                      "
                    >
                      {shortName(story.description, 80)}
                    </p>
                  )}
                </div>

                <span
                  aria-hidden="true"
                  className="
                    shrink-0
                    pt-0.5
                    text-base
                    text-gray-300
                    transition-all
                    group-hover:translate-x-1
                    group-hover:text-emerald-700
                  "
                >
                  →
                </span>
              </button>
            ))}
          </div>
  
      )}

      {/* EMPTY COLLECTION */}
      {stories.length === 0 && (
        <p className="mt-4 ml-4 text-sm italic text-gray-400 sm:ml-5">
          No stories in this event yet.
        </p>
      )}
    </article>
  );
}
