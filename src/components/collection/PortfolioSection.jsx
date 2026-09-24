import EmptyState from "../EmptyState";
import PaginatedList from "../page/PaginatedList";
import ListPill from "../page/ListPill";

import Paths from "../../core/paths";
import { getMyStories } from "../../actions/StoryActions";

const PAGE_SIZE = 8;

function PortfolioSection({
  profile,
  router,
}) {
  return (
    <section>
      <div
        className="
          flex
          items-end
          justify-between
          gap-6
          border-b
          border-soft
          pb-4
        "
      >
        {/* <div>
          <h2
            className="
              font-serif
              text-2xl
              text-gray-900
            "
          >
            Selected work
          </h2>

        
        </div> */}

        <button
          type="button"
          className="
            hidden
            text-sm
            text-emerald-800
            sm:block
          "
        >
          Arrange
        </button>
      </div>

      <div className="mt-6">
        {/* <PaginatedList
          cacheKey="profile:portfolio"
          params={{
            type: "portfolio",
          }}
          fetcher={getMyStories}
          pageSize={PAGE_SIZE}
          pagination="infinite"
          enabled={!!profile?.id}
          emptyState={
            <PortfolioEmptyState
              router={router}
            />
          }
          renderItem={(item) => (
            <PortfolioListItem
              item={item}
              profile={profile}
              router={router}
            />
          )} */}
          <PaginatedList
  cacheKey="profile:portfolio"
  params={{ type: "portfolio" }}
  fetcher={getMyStories}
  pageSize={PAGE_SIZE}
  pagination="infinite"
  enabled={!!profile?.id}
  emptyState={
    <PortfolioEmptyState router={router} />
  }
  renderItem={(item) => (
    <PortfolioListItem
      item={item}
      profile={profile}
      router={router}
    />
  )}
/>
        {/* /> */}
      </div>
    </section>
  );
}
function PortfolioListItem({
  item,
  profile,
  router,
}) {
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
      {/* COLLECTION */}
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
  <p className="mt-1 text-sm text-gray-500">
            What I want other people to read first.
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

      {/* STORIES INSIDE PORTFOLIO COLLECTION */}
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
              <div className="min-w-0">
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
                    {story.description}
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
          No work in this collection yet.
        </p>
      )}
    </article>
  );
}
// function PortfolioListItem({
//   item,
//   profile,
//   router,
// }) {
//   const collection = item?.collection;

//   if (!collection) {
//     return null;
//   }

//   return (
//     <ListPill
//       item={collection}
//       profile={profile}
//       onClick={() =>
//         router.push(
//           Paths.collection.createRoute(
//             collection.id
//           )
//         )
//       }
//     />
//   );
// }

function PortfolioEmptyState({ router }) {
  return (
    <div
      className="
        flex
        min-h-[16rem]
        items-center
        justify-center
        border
        border-dashed
        border-soft
        bg-cream
        px-6
        text-center
      "
    >
      <div className="max-w-[28rem]">
        <h2 className="font-serif text-xl text-gray-900">
          Your Portfolio is waiting.
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          What would you like someone to read first?
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(Paths.write)
          }
          className="
            mt-6
            rounded-full
            bg-emerald-800
            px-6
            py-3
            text-sm
            text-white
            transition
            hover:bg-emerald-900
          "
        >
          Add work
        </button>
      </div>
    </div>
  );
}

export default PortfolioSection;