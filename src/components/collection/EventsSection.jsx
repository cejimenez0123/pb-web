import EmptyState from "../EmptyState";
import PaginatedList from "../page/PaginatedList";
import Paths from "../../core/paths";

import { getMyStories } from "../../actions/StoryActions";
import shortName from "../../core/shortName";

const PAGE_SIZE = 8;

export default function EventsSection({
  profile,
  router,
}) {
  return (
    <section>
  

      <div className="mt-6">
        <PaginatedList
  cacheKey="profile:events"
  params={{
    type: "events",
  }}
  fetcher={getMyStories}
  pageSize={8}
  pagination="infinite"
  enabled={!!profile?.id}
  emptyState={
    <EmptyState text="No events yet." />
  }
  renderItem={(item) => (
    <EventListItem
      key={item.collection?.id}
      item={item}
      router={router}
    />
  )}
/>
        {/* <PaginatedList
          cacheKey="profile:events"
          params={{
            type: "events",
          }}
          fetcher={getMyStories}
          pageSize={PAGE_SIZE}
          enabled={!!profile?.id}
          emptyState={
            <EmptyState text="No events yet." />
          }
          renderItem={(item) => (
            <EventListItem
              key={item.collection?.id}
              item={item}
              router={router}
            />
          )}
        /> */}
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
      {/* COLLECTION / EVENT */}
      <button
        type="button"
        onClick={() =>
          router.push(
            Paths.collection.createRoute(collection.id)
          )
        }
        className="
          group
          flex
          w-[100%]
          items-center
          justify-between
          gap-4
          text-left
        "
      >
        <div className="min-w-0">
          <h3
            className="
              font-serif
              text-xl
              leading-snug
              text-gray-900
              transition-colors
              group-hover:text-emerald-800
            "
          >
            {collection.title}
          </h3>

          {collection.purpose && (
            <p
              className="
                mt-1
                text-sm
                leading-relaxed
                text-gray-500
              "
            >

           Events and the work connected to them.
            </p>
          )}
        </div>

        <span
          aria-hidden="true"
          className="
            shrink-0
            text-lg
            text-gray-300
            transition-all
            group-hover:translate-x-1
            group-hover:text-emerald-700
          "
        >
          →
        </span>
      </button>

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
                      text-gray-900
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