
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
import ErrorBoundary from "../ErrorBoundary";
import styles from "../styles/style";
import ResultItem from "./ResultItem";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "story", label: "Stories" },
  { key: "profile", label: "People" },
  { key: "collection", label: "Rooms" },
  { key: "hashtag", label: "#Hashtags" },
];


const INITIAL_SEARCH_QUERY = " ";
const normalize = (value) =>
  typeof value === "string"
    ? value.trim().toLowerCase()
    : "";



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
const [searchQuery, setSearchQuery] = useState(INITIAL_SEARCH_QUERY);;
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchScope, setSearchScope] = useState("all");
const shouldShowRemoteResults = searchScope === "all";
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
  const query = searchQuery.trim();

if (searchScope !== "all") {
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
      const result = await dispatch(
        searchMultipleIndexes({
          query,
          filters,
        })
      );

      if (cancelled) return;

      if (result.meta?.requestStatus !== "fulfilled") {
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
    } catch (error) {
      if (cancelled) return;

      console.error("Search failed:", error);
      setSearchContent([]);
      setSearchError(true);
    } finally {
      if (!cancelled) {
        setIsSearching(false);
      }
    }
  };

  runSearch();

  return () => {
    cancelled = true;
  };
}, [
  dispatch,
  searchQuery,
  selectedFilter,
  searchScope,
  currentProfileId,
  searchAttempt,
]);
  /*
   * Navigation
   *
   * Keep the existing route contract. "collection"
   * remains the internal route type even though the
   * interface calls these spaces Rooms.
   */


  const results =
    searchScope === "mine"
      ? personalResults
      : searchContent;

  const hasQuery = searchText.trim().length > 0;

  const activeFilterLabel =
    FILTERS.find(
      (filter) => filter.key === selectedFilter
    )?.label ?? "Results";

  


  return (
    <IonContent
      fullscreen
    
 
    >
      <ErrorBoundary>
         <main className={[styles.pageShell.base,styles.pageShell.padded].join(" ")}>
       

          <header className={styles.pageShell.head+" mt-4 pt-8"}>
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

    setSearchText(value);
    setSearchQuery(value);
  }}
/>
       {/* <IonSearchbar
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
/> */}
     </div>
          </header>
     <span className={" max-w-[100%] "+" "}>   
          {/* Search scope */}

          {currentProfile && (
            <div
              className={[styles.search.scopeRow, " mx-auto max-w-3xl"].join(" ")}
              role="group"
              aria-label="Search location"
            >
            

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
          className={"  max-w-3xl mx-auto"}
          
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
                    <div className={[styles.pageShell.body].join(" ")}>
              { personalResults.map((result)=><ResultItem result={result} index={result.id}/>)}
                   </div>
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
</span>
<span>
          {/* Loading */}
{shouldShowRemoteResults && isSearching && (
  <div
    className={styles.search.loading}
    role="status"
    aria-live="polite"
  >
    {hasQuery ? "Searching..." : "Discovering..."}
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
</span>
<span>
        {shouldShowRemoteResults &&
  !isSearching &&
  !searchError &&
  results.length > 0 && (
    <section
      className={[ "mb-4",styles.pageShell.body].join(" ")}
      aria-label="Search results"
    >
      <h2 className={styles.search.sectionTitle}>
        {hasQuery
          ? selectedFilter === "all"
            ? "Results"
            : activeFilterLabel
          : "Discover"}
        {hasQuery && (
          <span className="sr-only">
            {` for ${searchText.trim()}`}
          </span>
        )}
      </h2>

      <div className={"max-w-3xl mx-auto flex gap-2 flex-col"}>
        {results.map((result) => (
          <ResultItem
            key={`${result.type}:${result.objectID}`}
            result={result}
            index={result.objectID}
          />
        ))}
      </div>
    </section>
  )} 
         
</span>
          {/* No results */}

{shouldShowRemoteResults &&
  !isSearching &&
  !searchError &&
  results.length === 0 && (
    <section className={styles.search.empty}>
      <h2 className={styles.search.emptyTitle}>
        {hasQuery
          ? `Nothing found for “${searchText.trim()}”.`
          : "Nothing to discover just yet."}
      </h2>

      <p className={styles.search.emptyText}>
        {hasQuery
          ? "Try another word, writer, or related idea."
          : "Check back as more stories, writers, and rooms are shared."}
      </p>
    </section>
  )}
        </main>
      </ErrorBoundary>
    </IonContent>
  );
}

export default SearchDialog;
