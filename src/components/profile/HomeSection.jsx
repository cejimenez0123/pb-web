
import PaginatedList from "../page/PaginatedList";
import Paths from "../../core/paths";
import shortName from "../../core/shortName";
import EmptyState from "../general/EmptyState";
import styles from "../../styles/style";

export default function HomeSection({ resource, router }) {
  return (
    <section
      aria-labelledby="home-heading"
      className="w-[100%] min-w-0"
    >
      <header className="mb-8">
        <h2
          id="home-heading"
          className={styles.profile.mine.sectionTitle}
        >
          A place to return to.
        </h2>

        <p
          className={
            styles.profile.mine.sectionDescription +
            " mt-2 max-w-xl"
          }
        >
          Things you've chosen to keep close.
          Writing, rooms, and ideas you want to
          encounter again.
        </p>
      </header>

      <div className="space-y-8">
        <div>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-xl text-plumb-ink dark:text-plumb-darkText">
                Kept close
              </h3>
              <p className="mt-1 text-sm text-plumb-muted dark:text-plumb-darkMuted">
                Your personal collection of things worth returning to.
              </p>
            </div>
          </div>

          <PaginatedList
            resource={resource}
            emptyState={
              <EmptyState
                text="Your Home is yours to arrange. Add a room, story, or collection you want to keep close."
              />
            }
            renderItem={(item) => (
              <HomeCollectionCard
                key={item.id}
                item={item}
                router={router}
              />
            )}
          />
        </div>
      </div>
    </section>
  );
}

function HomeCollectionCard({ item, router }) {
  const collection = item?.collection;

  if (!collection) {
    return null;
  }

  const stories = (collection.storyIdList || [])
    .map((entry) => entry?.story)
    .filter(Boolean);

  const childCollections = (
    collection.childCollections || []
  )
    .map((entry) => entry?.childCollection)
    .filter(Boolean);

  const description =
    collection.description ||
    collection.purpose ||
    "";

  const openCollection = () => {
    router.push(
      Paths.collection.createRoute(collection.id)
    );
  };

  return (
    <article
      className="
        w-[100%]
        min-w-0
        border-b
        border-soft
        py-6
        first:pt-0
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-plumb-muted dark:text-plumb-darkMuted">
            Room
          </p>

          <button
            type="button"
            onClick={openCollection}
            className="
              group
              text-left
              font-serif
              text-xl
              leading-snug
              text-plumb-ink
              transition-colors
              hover:text-plumb-mint
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-plumb-mint
              focus-visible:ring-offset-4
              dark:text-plumb-darkText
            "
          >
            {collection.title || "Untitled collection"}
          </button>

          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-plumb-muted dark:text-plumb-darkMuted">
              {shortName(description, 180)}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={openCollection}
          aria-label={`Open ${collection.title || "collection"}`}
          className="
            shrink-0
            rounded-full
            p-2
            text-plumb-muted
            transition-colors
            hover:bg-plumb-surface
            hover:text-plumb-mint
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-plumb-mint
            dark:text-plumb-darkMuted
            dark:hover:bg-plumb-dark-surface
          "
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17 17 7M7 7h10v10" />
          </svg>
        </button>
      </div>

      {stories.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-plumb-muted dark:text-plumb-darkMuted">
            Inside this room
          </p>

          <ul className="divide-y divide-soft">
            {stories.slice(0, 3).map((story) => (
              <li key={story.id}>
                <button
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
                    items-center
                    justify-between
                    gap-4
                    py-3
                    text-left
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-plumb-mint
                    focus-visible:ring-inset
                  "
                >
                  <span className="min-w-0">
                    <span className="block truncate font-serif text-base text-plumb-ink transition-colors group-hover:text-plumb-mint dark:text-plumb-darkText">
                      {story.title || "Untitled"}
                    </span>

                    {story.description && (
                      <span className="mt-1 block text-sm leading-relaxed text-plumb-muted dark:text-plumb-darkMuted">
                        {shortName(story.description, 100)}
                      </span>
                    )}
                  </span>

                  <span
                    aria-hidden="true"
                    className="shrink-0 text-plumb-muted transition-transform group-hover:translate-x-1 dark:text-plumb-darkMuted"
                  >
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {stories.length > 3 && (
            <button
              type="button"
              onClick={openCollection}
              className="
                mt-3
                text-sm
                font-medium
                text-plumb-mint
                hover:underline
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-plumb-mint
              "
            >
              See all {stories.length} stories →
            </button>
          )}
        </div>
      )}

      {childCollections.length > 0 && (
        <div className="mt-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-plumb-muted dark:text-plumb-darkMuted">
            Related rooms
          </p>

          <div className="flex flex-wrap gap-2">
            {childCollections.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() =>
                  router.push(
                    Paths.collection.createRoute(child.id)
                  )
                }
                className="
                  rounded-full
                  border
                  border-soft
                  px-4
                  py-2
                  text-sm
                  text-plumb-ink
                  transition-colors
                  hover:border-plumb-mint
                  hover:text-plumb-mint
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-plumb-mint
                  dark:text-plumb-darkText
                "
              >
                {child.title || "Untitled room"}
              </button>
            ))}
          </div>
        </div>
      )}

      {stories.length === 0 &&
        childCollections.length === 0 && (
          <p className="mt-5 text-sm italic text-plumb-muted dark:text-plumb-darkMuted">
            This room is waiting for something to find its way in.
          </p>
        )}
    </article>
  );
}
