import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useLayoutEffect, useContext, useMemo } from "react";
import { getPublicStories } from "../actions/PageActions.jsx";
import { getPublicCollections } from "../actions/CollectionActions.js";
import { getPublicLibraries } from "../actions/LibraryActions.jsx";
import checkResult from "../core/checkResult.js";
import { BookListItem } from "../components/collection/BookListItem.jsx";
import { initGA } from "../core/ga4.js";
import ScrollDownButton from "../components/ScrollDownButton.jsx";
import Context from "../context.jsx";
import Paths from "../core/paths.js";
import useScrollTracking from "../core/useScrollTracking.jsx";
import sortItems from "../core/sortItems.js";
import { IonContent, useIonRouter } from "@ionic/react";
import PageList from "../components/page/PageList.jsx";

const PAGE_WRAP =
  "mx-auto min-h-screen bg-base-surface pb-28 pt-10 text-base-content dark:bg-base-bgDark";

const CONTENT_WRAP =
  "mx-auto w-[100%] max-w-6xl px-5 sm:px-8 lg:px-10";

const SEARCH_INPUT =
  "w-[100%] rounded-full border border-base-content/15 bg-base-surface px-5 py-4 text-base-content outline-none transition placeholder:text-base-content/45 focus:border-soft focus:ring-2 focus:ring-soft/20 dark:border-white/15 dark:bg-base-bgDark";

const PILL =
  "rounded-full border border-base-content/15 px-4 py-2 text-sm transition dark:border-white/15";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

function shuffle(items = []) {
  return [...items].sort(() => Math.random() - 0.5);
}

function getItemTitle(item) {
  return (
    item?.title ||
    item?.story?.title ||
    item?.collection?.title ||
    ""
  );
}

function getItemDescription(item) {
  return (
    item?.description ||
    item?.story?.description ||
    item?.collection?.purpose ||
    ""
  );
}

function DiscoveryContainer() {
  const { setSeo } = useContext(Context);

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const router = useIonRouter();
  const dispatch = useDispatch();

  const {
    collections: cols,
    books,
    libraries,
    pagesInView,
  } = useSelector((state) => ({
    collections: state.books.collections || [],
    books: state.books.books || [],
    libraries: state.books.libraries || [],
    pagesInView: state.pages.pagesInView || [],
  }));

  const [search, setSearch] = useState("");
  const [shelfKey, setShelfKey] = useState(0);

  useScrollTracking({
    name: "discovery",
  });

  useLayoutEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    fetchContentItems();
    fetchLibraries();
  }, []);

  const fetchContentItems = () => {
    dispatch(getPublicStories());
    dispatch(getPublicCollections());
  };

  const fetchLibraries = () => {
    dispatch(getPublicLibraries())
      .then((result) =>
        checkResult(
          result,
          () => {},
          () => {}
        )
      )
      .catch(() => {});
  };

  /*
   * Collections that actually contain stories.
   *
   * These are the existing collection objects used by
   * sortItems/PageList and the existing collection UI.
   */
  const availableCollections = useMemo(() => {
    return cols.filter(
      (item) =>
        item &&
        item.storyIdList &&
        item.storyIdList.length > 0
    );
  }, [cols]);

  /*
   * Keep the existing sorting behavior from the old
   * Discovery page.
   */
  const sortedItems = useMemo(() => {
    return sortItems(
      pagesInView,
      availableCollections
    );
  }, [pagesInView, availableCollections]);

  /*
   * Search is intentionally lightweight for now.
   *
   * Discovery currently has a relatively small public
   * content pool, so we can search the content already
   * loaded into Redux without creating a second search
   * architecture.
   *
   * Later this can move to a server-side search endpoint
   * without changing the presentation model.
   */
  const searchedItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return sortedItems;
    }

    return sortedItems.filter((item) => {
      const title = getItemTitle(item).toLowerCase();
      const description = getItemDescription(item).toLowerCase();

      return (
        title.includes(query) ||
        description.includes(query)
      );
    });
  }, [search, sortedItems]);

  /*
   * The default shelf is intentionally finite.
   *
   * Discovery is not an infinite engagement feed.
   * A new shelf is created when the user chooses
   * "Look again."
   */
  const shelfItems = useMemo(() => {
    return shuffle(
      search.trim()
        ? searchedItems
        : sortedItems
    ).slice(0, 8);
  }, [
    shelfKey,
    search,
    searchedItems,
    sortedItems,
  ]);

  const shelfCollections = useMemo(() => {
    return shuffle(books).slice(0, 6);
  }, [shelfKey, books]);

  const shelfLibraries = useMemo(() => {
    return shuffle(libraries).slice(0, 4);
  }, [shelfKey, libraries]);

  const handleLookAgain = () => {
    setShelfKey((current) => current + 1);
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  const handleJoin = () => {
    router.push(Paths.onboard);
  };

  return (
    <IonContent className="page-content">
      <main className={PAGE_WRAP}>
        <div className={CONTENT_WRAP}>

          {/* Intro */}
          <header className="pt-8 sm:pt-12 lg:pt-16">
            <p className="text-sm uppercase tracking-[0.14em] text-base-content/55">
              Discover
            </p>

            <h1 className="mt-4 max-w-3xl font-serif text-[2.9rem] font-bold leading-[1] tracking-tight sm:text-[4.5rem] lg:text-[5rem]">
              Find something
              <br />
              to fall into.
            </h1>

            <p className="mt-7 max-w-2xl font-serif text-lg leading-relaxed text-base-content/65 sm:text-xl">
              Wander through writing, collections, and Rooms.
              Start with a story. See where it takes you.
            </p>
          </header>

          {/* Search */}
          <section className="mt-10 max-w-3xl sm:mt-12">
            <div className="relative">
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search stories or collections..."
                aria-label="Search stories or collections"
                className={SEARCH_INPUT}
              />

              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-sm text-base-content/55 transition hover:bg-base-content/5 hover:text-base-content"
                >
                  Clear
                </button>
              )}
            </div>
          </section>

          {/* Search results */}
          {search.trim() ? (
            <section className="mt-14">
              <div className="flex items-end justify-between gap-4 border-b border-base-content/10 pb-4 dark:border-white/10">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-base-content/50">
                    Search
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
                    {searchedItems.length > 0
                      ? "Things you can enter"
                      : "Nothing matches yet."}
                  </h2>
                </div>

                {searchedItems.length > 0 && (
                  <span className="hidden text-sm text-base-content/50 sm:block">
                    {searchedItems.length} result
                    {searchedItems.length === 1
                      ? ""
                      : "s"}
                  </span>
                )}
              </div>

              {searchedItems.length > 0 ? (
                <div className="mt-8">
                  <PageList
                    items={searchedItems.slice(0, 12)}
                    shortenTo={200}
                  />
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-base-content/20 px-6 py-16 text-center dark:border-white/20">
                  <p className="font-serif text-xl">
                    Nothing matches yet.
                  </p>

                  <p className="mt-2 text-sm text-base-content/55">
                    Try a shorter word, a title, or a subject.
                  </p>
                </div>
              )}
            </section>
          ) : (
            <>
              {/* Open shelf */}
              <section className="mt-16 sm:mt-20">
                <div className="flex flex-col gap-5 border-b border-base-content/10 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-base-content/50">
                      Open shelf
                    </p>

                    <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
                      Start somewhere.
                    </h2>

                    <p className="mt-2 max-w-xl font-serif text-base text-base-content/60">
                      A few pieces people have intentionally
                      left open.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLookAgain}
                    className={`${PILL} self-start hover:border-soft hover:bg-soft/10 sm:self-auto`}
                  >
                    Look again ↗
                  </button>
                </div>

                {shelfItems.length > 0 ? (
                  <div className="mt-7">
                    <PageList
                      key={shelfKey}
                      items={shelfItems}
                      shortenTo={200}
                    />
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-dashed border-base-content/20 px-6 py-16 text-center dark:border-white/20">
                    <p className="font-serif text-xl">
                      The shelf is still being built.
                    </p>

                    <p className="mt-2 text-sm text-base-content/55">
                      Check back soon.
                    </p>
                  </div>
                )}
              </section>

              {/* Collections */}
              {shelfCollections.length > 0 && (
                <section className="mt-20 sm:mt-28">
                  <div className="flex items-end justify-between gap-4 border-b border-base-content/10 pb-5 dark:border-white/10">
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-base-content/50">
                        Go deeper
                      </p>

                      <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
                        Enter a collection.
                      </h2>

                      <p className="mt-2 max-w-xl font-serif text-base text-base-content/60">
                        One story can lead somewhere bigger.
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 overflow-hidden">
                    <div className="flex gap-5 overflow-x-auto pb-4">
                      {shelfCollections.map((book) => (
                        <div
                          key={book.id}
                          className="min-w-[17rem] max-w-[20rem] shrink-0"
                        >
                          <BookListItem book={book} />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Rooms */}
              {shelfLibraries.length > 0 && (
                <section className="mt-20 sm:mt-28">
                  <div className="flex flex-col gap-5 border-b border-base-content/10 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-base-content/50">
                        Places to linger
                      </p>

                      <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
                        Find a Room.
                      </h2>

                      <p className="mt-2 max-w-xl font-serif text-base text-base-content/60">
                        Writing lives somewhere. Rooms are
                        where people keep coming back.
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 overflow-hidden">
                    <div className="flex gap-5 overflow-x-auto pb-4">
                      {shelfLibraries.map((library) => (
                        <div
                          key={library.id}
                          className="min-w-[17rem] max-w-[20rem] shrink-0"
                        >
                          <BookListItem book={library} />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Light invitation */}
              {!currentProfile && (
                <section className="mt-20 sm:mt-28">
                  <div className="rounded-3xl bg-soft/15 px-6 py-12 text-center sm:px-10 sm:py-16">
                    <p className="font-serif text-2xl font-bold sm:text-3xl">
                      Found somewhere you want to stay?
                    </p>

                    <p className="mx-auto mt-3 max-w-xl font-serif text-base leading-relaxed text-base-content/65">
                      Join Plumbum to write, find your Rooms,
                      and become part of the places you keep
                      returning to.
                    </p>

                    <div className="mt-7">
                      <ScrollDownButton
                        text="Join the community"
                        onClick={handleJoin}
                      />
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </IonContent>
  );
}

export default DiscoveryContainer;

// import { useSelector, useDispatch } from 'react-redux';
// import { useState, useEffect, useLayoutEffect, useContext } from 'react';
// import { getPublicStories } from '../actions/PageActions.jsx';
// import { getPublicCollections } from '../actions/CollectionActions.js';
// import { getPublicLibraries } from '../actions/LibraryActions.jsx';
// import checkResult from '../core/checkResult.js';
// import { useMediaQuery } from 'react-responsive';
// import { BookListItem } from '../components/collection/BookListItem.jsx';
// import { initGA } from '../core/ga4.js';
// import ScrollDownButton from '../components/ScrollDownButton.jsx';
// import Context from '../context.jsx';
// import Paths from '../core/paths.js';
// import useScrollTracking from '../core/useScrollTracking.jsx';
// import sortItems from '../core/sortItems.js';
// import { IonContent, useIonRouter } from '@ionic/react';
// import Enviroment from '../core/Enviroment.js';
// import SectionHeader from '../components/SectionHeader.jsx';
// import HorizontalScroll from '../components/HorizontalScroll.jsx';
// import { motion } from "framer-motion";
// import PageList from '../components/page/PageList.jsx';

// const PAGE_WRAP = "mx-auto pt-12 pb-24 bg-base-surface dark:bg-base-bgDark min-h-screen";
// const SECTION = "space-y-4 px-2";
// const SECTION_HEADER_ROW = "flex items-center justify-between px-4 max-w-[50em] mx-auto";
// const H_SCROLL_WRAP = "pl-4 -mx-4 sm:mx-0";
// const H_SCROLL_ROW = "flex flex-row gap-4";

// const containerVariants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.08 },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 20, scale: 0.98 },
//   show: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { duration: 0.3, ease: "easeOut" },
//   },
// };

// function DiscoveryContainer() {
//   const { setSeo } = useContext(Context);
//   const currentProfile = useSelector(state => state.users.currentProfile);
//   const router = useIonRouter();
//   const dispatch = useDispatch();

//   const { collections: cols, books, libraries, pagesInView } = useSelector(state => ({
//     collections: state.books.collections,
//     books: state.books.books,
//     libraries: state.books.libraries,
//     pagesInView: state.pages.pagesInView,
//   }));

//   const [viewItems, setViewItems] = useState([]);

//   useScrollTracking({ name: 'discovery' });

//   useLayoutEffect(() => { initGA(); }, []);

//  useEffect(() => {
//   fetchContentItems();
//   fetchLibraries();
// }, []); 
//   useEffect(() => {
//     let finalList = sortItems(
//       pagesInView,
//       cols.filter(item => item && item.storyIdList && item.storyIdList.length > 0)
//     );
//     setViewItems(finalList);
//   }, [pagesInView, cols]);

//   const fetchContentItems = () => {
//     dispatch(getPublicStories());
//     dispatch(getPublicCollections());
//   };

//   const fetchLibraries = () => {
//     dispatch(getPublicLibraries())
//       .then(result => checkResult(result, () => {}, () => {}))
//       .catch(() => {});
//   };

//   return (
//     <IonContent className='page-content'>
//       <div className={PAGE_WRAP}>

//         {/* Communities */}
//         <div className={SECTION}>
//           <div className={SECTION_HEADER_ROW}>
//             <SectionHeader title="Communities" />
//           </div>
//           <div className={H_SCROLL_WRAP}>
//             <HorizontalScroll>
//               <motion.div
//                 className={H_SCROLL_ROW}
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="show"
//               >
//                 {libraries?.map((library) => (
//                   <motion.div key={library.id} variants={itemVariants}>
//                     <BookListItem book={library} />
//                   </motion.div>
//                 ))}
//               </motion.div>
//             </HorizontalScroll>
//           </div>
//         </div>

//         {/* Collections */}
//         <div className={SECTION}>
//           <div className={SECTION_HEADER_ROW}>
//             <SectionHeader title="Collections" />
//           </div>
//           <div className={H_SCROLL_WRAP}>
//             <HorizontalScroll>
//               <motion.div
//                 className={H_SCROLL_ROW}
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="show"
//               >
//                 {books?.map((book) => (
//                   <motion.div key={book.id} variants={itemVariants}>
//                     <BookListItem book={book} />
//                   </motion.div>
//                 ))}
//               </motion.div>
//             </HorizontalScroll>
//           </div>
//         </div>

//         {/* Pages */}
//         <div className={SECTION}>
//           <div className={SECTION_HEADER_ROW}>
//             <SectionHeader title="Pages" />
//           </div>

//              <PageList items={viewItems} shortenTo={200}/>

       

//           {!currentProfile && (
//             <div className="px-4 max-w-[50em] mx-auto">
//               <ScrollDownButton
//                 text="Join the community"
//                 onClick={() => router.push(Paths.onboard)}
//               />
//             </div>
//           )}
//         </div>

//       </div>
//     </IonContent>
//   );
// }

// export default DiscoveryContainer;