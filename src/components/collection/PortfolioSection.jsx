// import PaginatedList from "../page/PaginatedList";
// import Paths from "../../core/paths";

// import { getMyStories } from "../../actions/StoryActions";
// import shortName from "../../core/shortName";
// import SectionHeader from "../SectionHeader";
// import EmptyState from "../general/EmptyState";
// import styles from "../../styles/style";

// const PAGE_SIZE = 8;

// export default function PortfolioSection({
//   profile,
//   router,
//   search,
//   setSearch,
//   searchInput,
//   setSearchInput,
//   debouncedSearch,
// }) {
//   const id = profile.profileToCollections.find(
//     (ptc) => ptc.type === "portfolio"
//   ).collection.id;

//   return (
//     <section className="bg-transparent text-plumb-ink dark:text-plumb-darkText">
//       <div
//         className="
//           flex
//           flex-col
//           gap-5
//           border-b
//           border-plumb-border
//           bg-transparent
//           pb-5
//           dark:border-plumb-darkBorder
//           sm:flex-row
//           sm:items-end
//           sm:justify-between
//         "
//       >
//         <div>
//           <SectionHeader
//             eyebrow="Your Work"
//             title="Portfolio"
//             actionLabel="What I've chosen to share"
//             onAction={() => {
//               router.push(Paths.collection.createRoute(id));
//             }}
//           />
//         </div>

//         <input
//           value={searchInput}
//           onChange={(e) => {
//             const value = e.target.value;
//             setSearchInput(value);
//             setSearch(value);
//           }}
//           placeholder="Search"
//           aria-label="Search portfolio"
//           className="
//             w-full
//             rounded-full
//             border
//             border-plumb-border
//             bg-transparent
//             px-4
//             py-2
//             text-sm
//             text-plumb-ink
//             placeholder:text-plumb-subtle
//             outline-none
//             transition-colors
//             focus:border-plumb-focus
//             focus:ring-2
//             focus:ring-plumb-focus/30
//             dark:border-plumb-darkBorder
//             dark:text-plumb-darkText
//             dark:placeholder:text-plumb-darkSubtle
//             dark:focus:border-plumb-focus
//             dark:focus:ring-plumb-focus/30
//             sm:max-w-[18rem]
//           "
//         />
//       </div>

//       <div className="mt-8">
//         <PaginatedList
//           cacheKey="profile:portfolio"
//           params={{
//             type: "portfolio",
//           }}
//           fetcher={getMyStories}
//           pageSize={PAGE_SIZE}
//           pagination="infinite"
//           enabled={!!profile?.id}
//           search={debouncedSearch}
//           emptyState={
//             <EmptyState
//               text={
//                 search
//                   ? "No matching work."
//                   : "No portfolio work yet."
//               }
//             />
//           }
//           renderItem={(item) => (
//             <PortfolioListItem
//               key={item.collection?.id}
//               item={item}
//               router={router}
//             />
//           )}
//         />
//       </div>
//     </section>
//   );
// }
// function PortfolioListItem({ item, router }) {
//   const collection = item?.collection;
//   const stories = item?.stories || [];

//   if (!collection) {
//     return null;
//   }

//   return (
//     <article className={styles.collection.card.replace(
//       "rounded-2xl",
//       "rounded-none"
//     )}>
//       {stories.length > 0 && (
//         <div className="mt-3 space-y-4">
//           {stories.map((story) => {
//             const title = story.title?.trim() || "Untitled";

//             return (
//               <button
//                 key={story.id}
//                 type="button"
//                 onClick={() =>
//                   router.push(
//                     Paths.page.createRoute(story.id)
//                   )
//                 }
//                 aria-label={`Read ${title}`}
//                 className={`
//                   group
//                   flex
//                   min-h-12
//                   w-[100%]
//                   items-start
//                   justify-between
//                   gap-4
//                   border-b
//                   border-plumb-border
//                   bg-transparent
//                   py-3
//                   text-left
//                   transition-colors
//                   duration-200
//                   last:border-b-0
//                   focus:outline-none
//                   focus-visible:ring-2
//                   focus-visible:ring-plumb-focus
//                   focus-visible:ring-offset-2
//                   focus-visible:ring-offset-transparent
//                   motion-reduce:transition-none
//                   dark:border-plumb-darkBorder
//                   dark:focus-visible:ring-plumb-focus
//                 `}
//               >
//                 <div className="min-w-0 flex-1">
//                   <p
//                     className={`
//                       ${styles.text.body}
//                       font-serif
//                       transition-colors
//                       duration-200
//                       group-hover:text-plumb-mintHover
//                       dark:group-hover:text-plumb-mintLight
//                       motion-reduce:transition-none
//                     `}
//                   >
//                     {title}
//                   </p>

//                   {story.description && (
//                     <p className={styles.text.muted}>
//                       {shortName(story.description, 80)}
//                     </p>
//                   )}
//                 </div>

//                 <span
//                   aria-hidden="true"
//                   className="
//                     shrink-0
//                     pt-0.5
//                     text-base
//                     font-medium
//                     text-plumb-subtle
//                     transition-transform
//                     duration-200
//                     group-hover:translate-x-1
//                     group-hover:text-plumb-mintHover
//                     dark:text-plumb-darkSubtle
//                     dark:group-hover:text-plumb-mintLight
//                     motion-reduce:transition-none
//                   "
//                 >
//                   →
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       )}

//       {stories.length === 0 && (
//         <p className={`
//           ${styles.text.muted}
//           mt-4
//           ml-4
//           italic
//           sm:ml-5
//         `}>
//           No work in this collection yet.
//         </p>
//       )}
//     </article>
//   );
// }
// // function PortfolioListItem({ item, router }) {
// //   const collection = item?.collection;
// //   const stories = item?.stories || [];

// //   if (!collection) {
// //     return null;
// //   }

// //   return (
// //     <article
// //       className="
// //         border-b
// //         border-plumb-border
// //         bg-transparent
// //         py-6
// //         first:pt-0
// //         dark:border-plumb-darkBorder
// //       "
// //     >
// //       {stories.length > 0 && (
// //         <div className="mt-3 space-y-4">
// //           {stories.map((story) => {
// //             const title = story.title?.trim() || "Untitled";

// //             return (
// //               <button
// //                 key={story.id}
// //                 type="button"
// //                 onClick={() =>
// //                   router.push(
// //                     Paths.page.createRoute(story.id)
// //                   )
// //                 }
// //                 aria-label={`Read ${title}`}
// //                 className="
// //                   group
// //                   flex
// //                   min-h-12
// //                   w-[100%]
// //                   items-start
// //                   justify-between
// //                   gap-4
// //                   border-b
// //                   border-plumb-border
// //                   bg-transparent
// //                   py-3
// //                   text-left
// //                   transition-colors
// //                   duration-200
// //                   last:border-b-0

// //                   hover:bg-plumb-elevated/40

// //                   focus:outline-none
// //                   focus-visible:rounded-
// //                   focus-visible:ring-2
// //                   focus-visible:ring-plumb-focus
// //                   focus-visible:ring-offset-2
// //                   focus-visible:ring-offset-transparent

// //                   motion-reduce:transition-none

// //                   dark:border-plumb-darkBorder
// //                   dark:hover:bg-plumb-dark-surface/40

// //                   dark:focus-visible:ring-plumb-focus
// //                 "
// //               >
// //                 <div className="min-w-0 flex-1">
// //                   <p
// //                     className="
// //                       font-serif
// //                       text-base
// //                       leading-snug
// //                       text-plumb-ink
// //                       transition-colors
// //                       duration-200
// //                       group-hover:text-plumb-mintHover
// //                       dark:text-plumb-darkText
// //                       dark:group-hover:text-plumb-mintLight
// //                       motion-reduce:transition-none
// //                     "
// //                   >
// //                     {title}
// //                   </p>

// //                   {story.description && (
// //                     <p
// //                       className="
// //                         mt-1
// //                         text-sm
// //                         leading-relaxed
// //                         text-plumb-muted
// //                         dark:text-plumb-darkMuted
// //                       "
// //                     >
// //                       {shortName(story.description, 80)}
// //                     </p>
// //                   )}
// //                 </div>

// //                 <span
// //                   aria-hidden="true"
// //                   className="
// //                     shrink-0
// //                     pt-0.5
// //                     text-base
// //                     font-medium
// //                     text-plumb-subtle
// //                     transition-transform
// //                     duration-200
// //                     group-hover:translate-x-1
// //                     group-hover:text-plumb-mintHover
// //                     dark:text-plumb-darkSubtle
// //                     dark:group-hover:text-plumb-mintLight
// //                     motion-reduce:transition-none
// //                   "
// //                 >
// //                   →
// //                 </span>
// //               </button>
// //             );
// //           })}
// //         </div>
// //       )}

// //       {stories.length === 0 && (
// //         <p
// //           className="
// //             mt-4
// //             ml-4
// //             text-sm
// //             italic
// //             text-plumb-muted
// //             dark:text-plumb-darkMuted
// //             sm:ml-5
// //           "
// //         >
// //           No work in this collection yet.
// //         </p>
// //       )}
// //     </article>
// //   );
// // }
// // function PortfolioListItem({ item, router }) {
// //   const collection = item?.collection;
// //   const stories = item?.stories || [];

// //   if (!collection) {
// //     return null;
// //   }

// //   return (
// //     <article
// //       className="
// //         border-b
// //         border-plumb-border
// //         bg-transparent
// //         py-6
// //         first:pt-0
// //         dark:border-plumb-darkBorder
// //       "
// //     >
// //       {stories.length > 0 && (
// //         <div className="mt-3 space-y-4">
// //           {stories.map((story) => (
// //             <button
// //               key={story.id}
// //               type="button"
// //               onClick={() =>
// //                 router.push(
// //                   Paths.page.createRoute(story.id)
// //                 )
// //               }
// //               className="
// //                 group
// //                 flex
// //                 w-[100%]
// //                 items-start
// //                 justify-between
// //                 gap-4
// //                 border-b
// //                 border-plumb-border
// //                 bg-transparent
// //                 py-3
// //                 text-left
// //                 transition-colors
// //                 last:border-b-0
// //                 focus:outline-none
// //                 focus-visible:ring-2
// //                 focus-visible:ring-plumb-focus
// //                 dark:border-plumb-darkBorder
// //               "
// //             >
// //               <div className="min-w-0">
// //                 <p
// //                   className="
// //                     font-serif
// //                     text-base
// //                     leading-snug
// //                     text-plumb-ink
// //                     transition-colors
// //                     duration-200
// //                     group-hover:text-plumb-mintHover
// //                     dark:text-plumb-darkText
// //                     dark:group-hover:text-plumb-mintLight
// //                   "
// //                 >
// //                   {story.title?.trim() || "Untitled"}
// //                 </p>

// //                 {story.description && (
// //                   <p
// //                     className="
// //                       mt-1
// //                       text-sm
// //                       leading-relaxed
// //                       text-plumb-muted
// //                       dark:text-plumb-darkMuted
// //                     "
// //                   >
// //                     {shortName(story.description, 80)}
// //                   </p>
// //                 )}
// //               </div>

// //               <span
// //                 aria-hidden="true"
// //                 className="
// //                   shrink-0
// //                   pt-0.5
// //                   text-base
// //                   text-plumb-subtle
// //                   transition-all
// //                   duration-200
// //                   group-hover:translate-x-1
// //                   group-hover:text-plumb-mintHover
// //                   dark:text-plumb-darkSubtle
// //                   dark:group-hover:text-plumb-mintLight
// //                 "
// //               >
// //                 →
// //               </span>
// //             </button>
// //           ))}
// //         </div>
// //       )}

// //       {stories.length === 0 && (
// //         <p
// //           className="
// //             mt-4
// //             ml-4
// //             text-sm
// //             italic
// //             text-plumb-muted
// //             dark:text-plumb-darkMuted
// //             sm:ml-5
// //           "
// //         >
// //           No work in this collection yet.
// //         </p>
// //       )}
// //     </article>
// //   );
// // }

// function PortfolioEmptyState({ router }) {
//   return (
//     <div
//       className="
//         flex
//         min-h-[16rem]
//         items-center
//         justify-center
//         bg-transparent
//         px-6
//         text-center
//       "
//     >
//       <div className="max-w-[28rem]">
//         <h2
//           className="
//             font-serif
//             text-xl
//             text-plumb-ink
//             dark:text-plumb-darkText
//           "
//         >
//           Your Portfolio is waiting.
//         </h2>

//         <p
//           className="
//             mt-3
//             text-sm
//             leading-relaxed
//             text-plumb-muted
//             dark:text-plumb-darkMuted
//           "
//         >
//           What would you like someone to read first?
//         </p>

//         <button
//           type="button"
//           onClick={() => router.push(Paths.write)}
//           className="
//             mt-6
//             rounded-full
//             bg-plumb-mint
//             px-6
//             py-3
//             text-sm
//             font-medium
//             text-white
//             transition-colors
//             hover:bg-plumb-mintHover
//             focus:outline-none
//             focus-visible:ring-2
//             focus-visible:ring-plumb-focus
//             focus-visible:ring-offset-2
//             focus-visible:ring-offset-transparent
//           "
//         >
//           Add work
//         </button>
//       </div>
//     </div>
//   );
// }
import PaginatedList from "../page/PaginatedList";
import Paths from "../../core/paths";

import { getMyStories } from "../../actions/StoryActions";
import shortName from "../../core/shortName";
import SectionHeader from "../SectionHeader";
import EmptyState from "../general/EmptyState";

import styles from "../../styles/style";

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
  const portfolioCollection = profile?.profileToCollections?.find(
    (ptc) => ptc.type === "portfolio"
  )?.collection;

  const portfolioId = portfolioCollection?.id;

  return (
    <section className={styles.profile.portfolio.section}>
      <div className={styles.profile.portfolio.header}>
        <div className="min-w-0">
          <SectionHeader
            eyebrow="Your Work"
            title="Portfolio"
            actionLabel={
              portfolioId
                ? "What I've chosen to share"
                : undefined
            }
            onAction={() => {
              if (portfolioId) {
                router.push(
                  Paths.collection.createRoute(portfolioId)
                );
              }
            }}
          />
        </div>

        <div className="w-full sm:w-auto">
          <label
            htmlFor="portfolio-search"
            className={styles.profile.portfolio.searchLabel}
          >
            Search portfolio
          </label>

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
    <article className={styles.profile.portfolio.article}>
      {stories.length > 0 ? (
        <ul className={styles.profile.portfolio.storyList}>
          {stories.map((story) => {
            const title = story.title?.trim() || "Untitled";
            const descriptionId = `portfolio-story-${story.id}-description`;

            return (
              <li
                key={story.id}
                className={styles.profile.portfolio.storyRow}
              >
                <button
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
                  className={styles.profile.portfolio.storyButton}
                >
                  <div className={styles.profile.portfolio.storyContent}>
                    <p className={styles.profile.portfolio.storyTitle}>
                      {title}
                    </p>

                    {story.description && (
                      <p
                        id={descriptionId}
                        className={styles.profile.portfolio.storyDescription}
                      >
                        {shortName(story.description, 80)}
                      </p>
                    )}
                  </div>

                  <span
                    aria-hidden="true"
                    className={styles.profile.portfolio.arrow}
                  >
                    →
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p
          role="status"
          className={styles.profile.portfolio.emptyCollection}
        >
          No work in this collection yet.
        </p>
      )}
    </article>
  );
}