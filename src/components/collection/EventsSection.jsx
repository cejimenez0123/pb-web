
import PaginatedList from "../page/PaginatedList";
import Paths from "../../core/paths";
import shortName from "../../core/shortName";
import EmptyState from "../general/EmptyState";
import styles from "../../styles/style";

export default function EventsSection({
  profile,
  router,
  search,
  setSearch,
  searchInput,
  setSearchInput,
  resource,
  debouncedSearch,
}) {
  const eventsCollection = profile?.profileToCollections?.find(
    (item) => item.type === "events"
  )?.collection;

  const collectionId = eventsCollection?.id;

  return (
    <section aria-labelledby="events-heading">
      <div className={styles.profile.mine.sectionHeader}>
        <div>
          <h2
            id="events-heading"
            onClick={() => {
              if (collectionId) {
                router.push(
                  Paths.collection.createRoute(collectionId)
                );
              }
            }}
            className={[
              styles.profile.mine.sectionTitle,
              collectionId ? "cursor-pointer" : "",
            ].join(" ")}
          >
            Events
          </h2>

          <p className={styles.profile.mine.sectionDescription}>
            Where you meet the world
          </p>
        </div>

        <label className="w-full sm:max-w-[18rem]">
          <span className="sr-only">
            Search events
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
            aria-label="Search events"
            className={styles.profile.mine.search}
          />
        </label>
      </div>

      <div className="mt-8">
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
          renderItem={(item) => (
            <EventListItem
              key={item.id}
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

  const stories = collection?.storyIdList ?? [];

  if (!collection) return null;

  return (
    <article className="w-[100%] border-b border-soft py-6 first:pt-0">
      {stories.length > 0 ? (
        <div className="space-y-4">
          {stories.map((entry) => {
            const story = entry?.story;

            if (!story?.id) return null;

            const title =
              story.title?.trim() || "Untitled";

            return (
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
                <div className="min-w-0">
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
                    {title}
                  </p>

                  {story.description && (
                    <p className="
                      mt-1
                      text-sm
                      leading-relaxed
                      text-gray-500
                    ">
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
            );
          })}
        </div>
      ) : (
        <p className="mt-4 ml-4 text-sm italic text-gray-400 sm:ml-5">
          No stories in this event yet.
        </p>
      )}
    </article>
  );
}
