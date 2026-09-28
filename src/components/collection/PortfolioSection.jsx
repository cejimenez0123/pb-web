import EmptyState from "../EmptyState";
import PaginatedList from "../page/PaginatedList";
import Paths from "../../core/paths";

import { getMyStories } from "../../actions/StoryActions";
import shortName from "../../core/shortName";
import SectionHeader from "../SectionHeader";

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
  const id = profile.profileToCollections.find(ptc=>ptc.type=="portfolio").collection.id
  return (
    <section>
      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-card-border
          pb-5
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <SectionHeader
            eyebrow="Your Work"
            title="Portfolio"
            actionLabel="What I've chosen to share"
            onAction={() => {
              router.push(Paths.collection.createRoute(id));
            }}
          />
        </div>

        <input
          value={searchInput}
          onChange={(e) => {
            const value = e.target.value;
            setSearchInput(value);
            setSearch(value);
          }}
          placeholder="Search"
          className="
            w-full
            rounded-full
            border
            border-card-border
            bg-base-surface
            px-4
            py-2
            text-sm
            text-text-primary
            placeholder:text-text-secondary
            outline-none
            transition-colors
            focus:border-button-primary-bg
            sm:max-w-[18rem]
            dark:bg-base-bgDark
          "
        />
      </div>

      <div className="mt-8">
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
            <PortfolioListItem
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

function PortfolioListItem({ item, router }) {
  const collection = item?.collection;
  const stories = item?.stories || [];

  if (!collection) {
    return null;
  }

  return (
    <article
      className="
   
        border-b
        border-card-border
        py-6
        first:pt-0
        dark:border-white/10
      "
    >
  
      {/* STORIES INSIDE PORTFOLIO COLLECTION */}
      {stories.length > 0 && (
        <div className="mt-3 space-y-4">
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
                gap-4
              
                border-b
                border-card-border
                py-3
                text-left
                last:border-b-0
                dark:border-white/10
              "
            >
              <div className="min-w-0">
                <p
                  className="
                    font-serif
                    text-base
                    leading-snug
                    text-text-primary
                    transition-colors
                    group-hover:text-text-brand
                    dark:text-cream
                  "
                >
                  {story.title?.trim() || "Untitled"}
                </p>

                {story.description && (
                  <p
                    className="
                      mt-1
                      text-sm
                      leading-relaxed
                      text-text-secondary
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
                  text-text-secondary
                  transition-all
                  group-hover:translate-x-1
                  group-hover:text-text-brand
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
        <p
          className="
            mt-4
            ml-4
            text-sm
            italic
            text-text-secondary
            sm:ml-5
          "
        >
          No work in this collection yet.
        </p>
      )}
    </article>
  );
}



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
