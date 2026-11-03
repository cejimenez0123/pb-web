
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  IonContent,
  IonSearchbar,
  useIonRouter,
} from "@ionic/react";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import { searchMultipleIndexes } from "../actions/UserActions";
import checkResult from "../core/checkResult";
import { ErrorBoundary } from "@sentry/react";
import styles from "../styles/style";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "story", label: "Stories" },
  { key: "profile", label: "People" },
  { key: "collection", label: "Rooms" },
  { key: "hashtag", label: "#Hashtags" },
];

const TYPE_LABELS = {
  story: "Story",
  profile: "Writer",
  collection: "Room",
  hashtag: "Hashtag",
};

const normalize = (value) =>
  typeof value === "string"
    ? value.trim().toLowerCase()
    : "";

function getItemTitle(item = {}) {
  return (
    item.title ||
    item.username ||
    item.name ||
    "Untitled"
  );
}

function getItemDescription(item = {}, type) {
  if (type === "story") {
    return (
      item.description ||
      item.excerpt ||
      item.summary ||
      null
    );
  }

  if (type === "collection") {
    return item.purpose || item.description || null;
  }

  return null;
}

function getItemAuthor(item = {}, type) {
  if (type !== "story") {
    return null;
  }

  return (
    item.authorName ||
    item.authorUsername ||
    item.username ||
    item.author?.username ||
    item.author?.name ||
    null
  );
}

function getSearchableValues(item = {}) {
  return [
    item.title,
    item.name,
    item.username,
    item.description,
    item.excerpt,
    item.summary,
    item.purpose,
    item.authorName,
    item.authorUsername,
    item.author?.username,
    item.author?.name,
  ];
}

function filterLocalContent(content, query, filter) {
  const normalizedQuery = normalize(query);

  return content.filter(({ item, type }) => {
    if (filter !== "all" && type !== filter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return getSearchableValues(item).some(
      (value) =>
        normalize(value).includes(normalizedQuery)
    );
  });
}

function SearchDialog() {
  const dispatch = useDispatch();
  const router = useIonRouter();
const [searchAttempt, setSearchAttempt] = useState(0);
  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const currentProfileId = currentProfile?.id ?? null;

  const collectionsFromStore = useSelector(
    (state) => state.books.collections ?? []
  );

  const storiesFromStore = useSelector(
    (state) => state.pages.pagesInView ?? []
  );

  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchScope, setSearchScope] = useState("all");

  const [searchContent, setSearchContent] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);

  /*
   * Cached content available to the current account.
   *
   * Rooms and stories are included when they are already
   * present in Redux. This avoids introducing extra
   * requests just to populate the My Work view.
   */

  const personalContent = useMemo(() => {
    const stories = storiesFromStore
      .filter((story) => story?.id)
      .map((story) => ({
        item: story,
        objectID: story.id,
        type: "story",
      }));

    const rooms = collectionsFromStore
      .filter((room) => room?.id)
      .map((room) => ({
        item: room,
        objectID: room.id,
        type: "collection",
      }));

    const unique = new Map();

    [...stories, ...rooms].forEach((result) => {
      unique.set(
        `${result.type}:${result.objectID}`,
        result
      );
    });

    return [...unique.values()];
  }, [storiesFromStore, collectionsFromStore]);

  const personalResults = useMemo(
    () =>
      filterLocalContent(
        personalContent,
        searchText,
        selectedFilter
      ),
    [personalContent, searchText, selectedFilter]
  );

  /*
   * Remote search.
   *
   * No request is made for empty queries or when the
   * user is searching their locally available work.
   *
   * The effect only depends on the profile ID, rather
   * than the entire profile object, to prevent redundant
   * requests when unrelated profile fields change.
   */
useEffect(() => {
  const query = searchText.trim();

  if (searchScope !== "all" || !query) {
    setSearchContent([]);
    setIsSearching(false);
    setSearchError(false);
    return undefined;
  }

  let cancelled = false;

  const runSearch = async () => {
    setIsSearching(true);
    setSearchError(false);

    const filters =
      selectedFilter === "all"
        ? []
        : [selectedFilter];

    try {
      const result = await dispatch(searchMultipleIndexes({
          query,
          filters,
          // profileId: currentProfileId,
        })
      );

      if (cancelled) return;

      if (
        result.meta?.requestStatus !== "fulfilled"
      ) {
        console.error(
          "Search request rejected:",
          result.payload || result.error
        );

        setSearchContent([]);
        setSearchError(true);
        setIsSearching(false);
        return;
      }

      const normalizedResults = (
        result.payload?.results ?? []
      )
        .filter(
          (item) =>
            item &&
            (item.objectID || item.id) &&
            item.type
        )
        .map((item) => ({
          item,
          objectID: item.objectID ?? item.id,
          type: item.type,
        }));

      setSearchContent(normalizedResults);
      setSearchError(false);
      setIsSearching(false);
    } catch (error) {
      if (cancelled) return;

      console.error("Search failed:", error);

      setSearchContent([]);
      setSearchError(true);
      setIsSearching(false);
    }
  };

  runSearch();

  return () => {
    cancelled = true;
  };
}, [
  dispatch,
  searchText,
  selectedFilter,
  searchScope,
  currentProfileId,
  searchAttempt,
]);
  // useEffect(() => {
  //   const query = searchText.trim();

  //   if (searchScope !== "all" || !query) {
  //     setSearchContent([]);
  //     setIsSearching(false);
  //     setSearchError(false);
  //     return undefined;
  //   }

  //   let cancelled = false;

  //   setIsSearching(true);
  //   setSearchError(false);

  //   const filters =
  //     selectedFilter === "all"
  //       ? []
  //       : [selectedFilter];

  //   const runSearch = async () => {
  //     try {
  //       const result = await dispatch(
  //         searchMultipleIndexes({
  //           query,
  //           filters,
  //           profileId: currentProfileId,
  //         })
  //       );

  //       if (cancelled) return;

  //       if (result?.meta?.requestStatus === "rejected") {
  //         setSearchContent([]);
  //         setSearchError(true);
  //         setIsSearching(false);
  //         return;
  //       }

  //       let receivedResults = false;

  //       checkResult(result, (returned) => {
  //         if (cancelled) return;

  //         receivedResults = true;

  //         const normalizedResults = (
  //           returned?.results ?? []
  //         )
  //           .filter(
  //             (item) =>
  //               item &&
  //               (item.objectID || item.id) &&
  //               item.type
  //           )
  //           .map((item) => ({
  //             item,
  //             objectID: item.objectID ?? item.id,
  //             type: item.type,
  //           }));

  //         setSearchContent(normalizedResults);
  //         setIsSearching(false);
  //         setSearchError(false);
  //       });

  //       /*
  //        * Do not leave the UI in a loading state if
  //        * checkResult does not invoke its callback.
  //        */
  //       if (!receivedResults) {
  //         setSearchContent([]);
  //         setIsSearching(false);
  //       }
  //     } catch (error) {
  //       if (cancelled) return;

  //       console.error("Search failed:", error);

  //       setSearchContent([]);
  //       setSearchError(true);
  //       setIsSearching(false);
  //     }
  //   };

  //   runSearch();

  //   return () => {
  //     cancelled = true;
  //   };
  // }, [
  //   dispatch,
  //   searchText,
  //   selectedFilter,
  //   searchScope,
  //   currentProfileId,
  // ]);

  /*
   * Navigation
   *
   * Keep the existing route contract. "collection"
   * remains the internal route type even though the
   * interface calls these spaces Rooms.
   */

  const handleResultClick = (result) => {
    if (!result?.type || !result?.objectID) {
      return;
    }

    router.push(
      `/${result.type}/${result.objectID}/view`
    );
  };

  const results =
    searchScope === "mine"
      ? personalResults
      : searchContent;

  const hasQuery = searchText.trim().length > 0;

  const activeFilterLabel =
    FILTERS.find(
      (filter) => filter.key === selectedFilter
    )?.label ?? "Results";

  /*
   * Result renderer
   *
   * Native buttons provide keyboard interaction,
   * focus handling, and accessible activation without
   * manually recreating button behavior.
   */

  const renderResult = (result, index) => {
    const item = result?.item ?? {};

    const title = getItemTitle(item);
    const description = getItemDescription(
      item,
      result.type
    );

    const author = getItemAuthor(
      item,
      result.type
    );

    const typeLabel =
      TYPE_LABELS[result.type] || result.type;

    return (
      <div
        key={`${result.objectID}-${index}`}
        // type="button"
        // className="w-[100%] rounded-full py-4 mx-4 "
        className={styles.search.result}
        onClick={() => handleResultClick(result)}
        aria-label={`Open ${typeLabel}: ${title}`}
      >
        <div
         className={styles.search.resultTitle}
        >
          {title}
        </div>

        <div 
        className={styles.search.resultMeta}
        >
          {typeLabel}
          {author ? ` · ${author}` : ""}
        </div>

        {description && (
          <p className={styles.search.resultDescription}>
            {description}
          </p>
        )}
      </div>
    );
  };

  return (
    <IonContent
      fullscreen
      className={styles.search.page}
      style={{
        "--background": "transparent",
      }}
    >
      <ErrorBoundary>
        <main className={styles.search.inner}>
          {/* Search heading and input */}

          <header className={styles.search.header}>
            <h1 className={styles.search.title}>
              Search
            </h1>

            <div className={styles.search.searchWrap}>

             
       <IonSearchbar
  value={searchText}
  debounce={350}
  className={`${styles.search.searchbar} plumb-searchbar`}
  placeholder="Stories, writers, rooms..."
  aria-label="Search Plumbum"
  showClearButton="focus"
  onIonInput={(event) => {
    const value =
      event.detail?.value ??
      event.target?.value ??
      "";

    console.log("[Search] Input event:", value);
    setSearchText(value);
  }}
/>
     </div>
          </header>

          {/* Search scope */}

          {currentProfile && (
            <div
              className={styles.search.scopeRow}
              role="group"
              aria-label="Search location"
            >
              <span className={styles.search.scopeLabel}>
                Search
              </span>

              <button
                type="button"
                className={[
                  styles.search.scopeButton,
                  searchScope === "all"
                    ? styles.search.scopeActive
                    : styles.search.scopeInactive,
                ].join(" ")}
                onClick={() => setSearchScope("all")}
                aria-pressed={searchScope === "all"}
              >
                Plumbum
              </button>

              <button
                type="button"
                className={[
                  styles.search.scopeButton,
                  searchScope === "mine"
                    ? styles.search.scopeActive
                    : styles.search.scopeInactive,
                ].join(" ")}
                onClick={() => setSearchScope("mine")}
                aria-pressed={searchScope === "mine"}
              >
                My Work
              </button>
            </div>
          )}

          {/* Filters */}

          <div
            className={styles.search.filterRow}
            role="group"
            aria-label="Filter search results"
          >
            {FILTERS.map((filter) => {
              const active =
                selectedFilter === filter.key;

              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() =>
                    setSelectedFilter(filter.key)
                  }
                  className={[
                    styles.search.filter,
                    active
                      ? styles.search.filterActive
                      : styles.search.filterInactive,
                  ].join(" ")}
                  aria-pressed={active}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Empty query */}

          {!hasQuery && (
            <>
              {searchScope === "all" && (
                <section className={styles.search.empty}>
                  <h2 className={styles.search.emptyTitle}>
                    What are you looking for?
                  </h2>

                  <p className={styles.search.emptyText}>
                    Find a writer, discover a story,
                    or find a room to return to.
                  </p>
                </section>
              )}

              {searchScope === "mine" && (
                <section className={styles.search.section}>
                  <h2 className={styles.search.sectionTitle}>
                    Available to you
                  </h2>

                  {personalResults.length > 0 ? (
               personalResults.map(renderResult)
                    // <div className={styles.search.results}>
                      // {personalResults.map(renderResult)}
                    // </div>
                  ) : (
                    <div className={styles.search.empty}>
                      <h2 className={styles.search.emptyTitle}>
                        Your work will appear here.
                      </h2>

                      <p className={styles.search.emptyText}>
                        Search stories and rooms already
                        available to your account.
                      </p>
                    </div>
                  )}
                </section>
              )}
            </>
          )}

          {/* Loading */}

          {hasQuery && isSearching && (
            <div
              className={styles.search.loading}
              role="status"
              aria-live="polite"
            >
              Searching...
            </div>
          )}

          {/* Error */}

          {hasQuery && !isSearching && searchError && (
            <div className={styles.search.error}>
              <p role="alert">
                Something went wrong while searching.
              </p>
<button
  type="button"
  className={styles.search.retry}
  onClick={() =>
    setSearchAttempt((attempt) => attempt + 1)
  }
>
  Try again
</button>
    
            </div>
          )}

          {/* Results */}

          {hasQuery &&
            !isSearching &&
            !searchError &&
            results.length > 0 && (
              <section
                className={styles.search.section}
                aria-label="Search results"
              >
                <h2 className={styles.search.sectionTitle}>
                  {searchScope === "mine"
                    ? "Your Work"
                    : selectedFilter === "all"
                    ? "Results"
                    : activeFilterLabel}
                  <span className="sr-only">
                    {` for ${searchText.trim()}`}
                  </span>
                </h2>

                <div className={styles.search.results}>
                  {results.map(renderResult)}
                </div>
              </section>
            )}

          {/* No results */}

          {hasQuery &&
            !isSearching &&
            !searchError &&
            results.length === 0 && (
              <section className={styles.search.empty}>
                <h2 className={styles.search.emptyTitle}>
                  Nothing found for “{searchText.trim()}”.
                </h2>

                <p className={styles.search.emptyText}>
                  Try another word, writer, or related idea.
                </p>
              </section>
            )}
        </main>
      </ErrorBoundary>
    </IonContent>
  );
}

export default SearchDialog;
