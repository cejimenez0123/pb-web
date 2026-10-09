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
import { useSelector, useDispatch } from "react-redux";
import { searchMultipleIndexes } from "../actions/UserActions";
import checkResult from "../core/checkResult";
import Enviroment from "../core/Enviroment";
import { ErrorBoundary } from "@sentry/react";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "story", label: "Stories" },
  { key: "profile", label: "People" },
  { key: "collection", label: "Collections" },
  { key: "hashtag", label: "#Hashtags" },
];

const TYPE_LABELS = {
  story: "Story",
  profile: "Writer",
  collection: "Collection",
  hashtag: "Hashtag",
};

const T = {
  page:
    "min-h-full bg-cream dark:bg-base-bgDark text-text-primary dark:text-cream",

  inner:
    "w-full max-w-2xl mx-auto px-4 pb-32",

  header:
    "pt-8 pb-4",

  title:
    "text-2xl font-semibold text-text-primary dark:text-cream mb-4",

  searchWrap:
    "w-full bg-base-bg dark:bg-plumb-surface Dark rounded-full",

  searchbar:
    "rounded-full",

  filterRow:
    "flex flex-wrap gap-2 py-4",

  filter:
    "px-3 py-1.5 rounded-full text-sm border transition-all duration-150 cursor-pointer",

  filterActive:
    "bg-soft text-white border-soft dark:bg-plumb-surface Dark dark:text-cream",

  filterInactive:
    "bg-base-bg dark:bg-plumb-surface Dark text-text-secondary dark:text-cream border-soft",

  scopeRow:
    "flex items-center gap-3 pt-2 pb-6",

  scopeLabel:
    "text-xs uppercase tracking-wide text-text-secondary dark:text-cream/60",

  scopeButton:
    "text-sm font-medium underline underline-offset-4 cursor-pointer",

  section:
    "pt-4",

  sectionTitle:
    "text-xs uppercase tracking-wide text-text-secondary dark:text-cream/60 mb-3",

  results:
    "divide-y divide-border-soft",

  result:
    "py-4 cursor-pointer transition-colors hover:bg-base-bg dark:hover:bg-plumb-surface Dark px-2 -mx-2 rounded-lg",

  resultTitle:
    "text-base text-text-primary dark:text-cream font-medium",

  resultMeta:
    "text-xs text-text-secondary dark:text-cream/60 mt-1",

  resultDescription:
    "text-sm text-text-secondary dark:text-cream/70 mt-1 line-clamp-2",

  empty:
    "py-12 text-center",

  emptyTitle:
    "text-base text-text-primary dark:text-cream",

  emptyText:
    "text-sm text-text-secondary dark:text-cream/60 mt-2",

  exploreGrid:
    "divide-y divide-border-soft",

  exploreItem:
    "py-4 cursor-pointer",

  loading:
    "py-8 text-center text-sm text-text-secondary dark:text-cream/60",

  error:
    "py-8 text-center text-sm text-text-secondary dark:text-cream/60",
};

const SearchDialog = () => {
  const dispatch = useDispatch();
  const router = useIonRouter();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

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
   * ───────────────────────────────────────
   * Local "My Work" sources
   * ───────────────────────────────────────
   *
   * This currently uses the work already available
   * in Redux. Role-based participation can be added
   * later without changing the Search UI.
   */

  const personalCollections = useMemo(
    () =>
      collectionsFromStore
        .filter(Boolean)
        .map((collection) => ({
          item: { ...collection },
          objectID: collection.id,
          type: "collection",
        })),
    [collectionsFromStore]
  );

  const personalStories = useMemo(
    () =>
      storiesFromStore
        .filter(Boolean)
        .map((story) => ({
          item: { ...story },
          objectID: story.id,
          type: "story",
        })),
    [storiesFromStore]
  );

  const personalContent = useMemo(
    () => [...personalStories, ...personalCollections],
    [personalStories, personalCollections]
  );

  /*
   * ───────────────────────────────────────
   * Explore content
   * ───────────────────────────────────────
   *
   * Search should not feel empty when there is
   * no query. We use content already available
   * to the app rather than introducing a new
   * recommendation system here.
   */

  const exploreContent = useMemo(() => {
    const stories = storiesFromStore
      .filter(Boolean)
      .slice(0, 4)
      .map((story) => ({
        item: story,
        objectID: story.id,
        type: "story",
      }));

    const collections = collectionsFromStore
      .filter(Boolean)
      .slice(0, 4)
      .map((collection) => ({
        item: collection,
        objectID: collection.id,
        type: "collection",
      }));

    return [...stories, ...collections].slice(0, 6);
  }, [storiesFromStore, collectionsFromStore]);

  /*
   * ───────────────────────────────────────
   * Local My Work filtering
   * ───────────────────────────────────────
   */

  const searchLocalContent = (query, content) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return content;
    }

    return content.filter(({ item = {} }) => {
      const values = [
        item.title,
        item.name,
        item.username,
        item.description,
        item.excerpt,
      ];

      return values.some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(normalizedQuery)
      );
    });
  };

  const personalResults = useMemo(() => {
    let content = personalContent;

    if (selectedFilter !== "all") {
      content = content.filter(
        (result) => result.type === selectedFilter
      );
    }

    return searchLocalContent(searchText, content);
  }, [
    personalContent,
    selectedFilter,
    searchText,
  ]);

  /*
   * ───────────────────────────────────────
   * Remote search
   * ───────────────────────────────────────
   *
   * searchText only changes after IonSearchbar's
   * debounce period, so we don't request on
   * every keystroke.
   */

  useEffect(() => {
    const query = searchText.trim();

    if (searchScope === "mine") {
      setSearchContent([]);
      setIsSearching(false);
      setSearchError(false);
      return;
    }

    if (!query) {
      setSearchContent([]);
      setIsSearching(false);
      setSearchError(false);
      return;
    }

    let cancelled = false;

    setIsSearching(true);
    setSearchError(false);

    const filters =
      selectedFilter === "all"
        ? []
        : [selectedFilter];

    dispatch(
      searchMultipleIndexes({
        query,
        filters,
        profileId: currentProfile?.id ?? null,
      })
    ).then((result) => {
      if (cancelled) return;

      checkResult(result, (returned) => {
        if (cancelled) return;

        const results = (returned.results ?? [])
          .filter(Boolean)
          .map((item) => ({
            item,
            objectID: item.objectID ?? item.id,
            type: item.type,
          }));

        setSearchContent(results);
        setIsSearching(false);
      });

      /*
       * If the thunk rejects, checkResult may not
       * call the success callback. Clear loading here
       * on the next render path rather than leaving
       * the UI permanently searching.
       */
      if (result?.meta?.requestStatus === "rejected") {
        setSearchContent([]);
        setSearchError(true);
        setIsSearching(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [
    dispatch,
    searchText,
    selectedFilter,
    searchScope,
    currentProfile,
  ]);

  /*
   * ───────────────────────────────────────
   * Result navigation
   * ───────────────────────────────────────
   */

  const handleResultClick = (result) => {
    if (!result?.type || !result?.objectID) {
      return;
    }

    router.push(
      `/${result.type}/${result.objectID}/view`
    );
  };

  /*
   * ───────────────────────────────────────
   * Result helpers
   * ───────────────────────────────────────
   */

  const getTitle = (result) => {
    const item = result?.item ?? {};

    return (
      item.title ||
      item.username ||
      item.name ||
      "Untitled"
    );
  };

  const getDescription = (result) => {
    const item = result?.item ?? {};

    if (result.type === "story") {
      return (
        item.description ||
        item.excerpt ||
        item.summary ||
        null
      );
    }

    return null;
  };

  const getAuthor = (result) => {
    const item = result?.item ?? {};

    if (result.type !== "story") {
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
  };

  const renderResult = (result, index) => {
    const title = getTitle(result);
    const description = getDescription(result);
    const author = getAuthor(result);

    return (
      <div
        key={`${result.objectID ?? "result"}-${index}`}
        className={T.result}
        onClick={() => handleResultClick(result)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            handleResultClick(result);
          }
        }}
      >
        <div className={T.resultTitle}>
          {title}
        </div>

        <div className={T.resultMeta}>
          {TYPE_LABELS[result.type] || result.type}
          {author ? ` · ${author}` : ""}
        </div>

        {description && (
          <div className={T.resultDescription}>
            {description}
          </div>
        )}
      </div>
    );
  };

  /*
   * ───────────────────────────────────────
   * Main result set
   * ───────────────────────────────────────
   */

  const results =
    searchScope === "mine"
      ? personalResults
      : searchContent;

  const hasQuery = searchText.trim().length > 0;

  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  /*
   * ───────────────────────────────────────
   * Render
   * ───────────────────────────────────────
   */

  return (
    <IonContent fullscreen className={T.page}>
      <ErrorBoundary>
        <main className={T.inner}>

          {/* Header */}
          <header className={T.header}>
            <h1 className={T.title}>
              Search
            </h1>

            <div className={T.searchWrap}>
              <IonSearchbar
                value={searchText}
                debounce={500}
                className={T.searchbar}
                placeholder="Search stories, people, collections..."
                style={{
                  color: prefersDark
                    ? Enviroment.palette.cream
                    : Enviroment.palette.soft,
                  "--background": "transparent",
                  "--box-shadow": "none",
                }}
                onIonInput={(event) => {
                  setSearchText(
                    event.target.value ?? ""
                  );
                }}
              />
            </div>
          </header>

          {/* Search scope */}
          {currentProfile && (
            <div className={T.scopeRow}>
              <span className={T.scopeLabel}>
                Search
              </span>

              <button
                type="button"
                className={T.scopeButton}
                onClick={() =>
                  setSearchScope("all")
                }
                aria-pressed={searchScope === "all"}
              >
                Plumbum
              </button>

              <button
                type="button"
                className={T.scopeButton}
                onClick={() =>
                  setSearchScope("mine")
                }
                aria-pressed={searchScope === "mine"}
              >
                My Work
              </button>
            </div>
          )}

          {/* Filters */}
          <div
            className={T.filterRow}
            aria-label="Search filters"
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
                  className={`${T.filter} ${
                    active
                      ? T.filterActive
                      : T.filterInactive
                  }`}
                  aria-pressed={active}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* ─────────────────────────────
              Empty / Explore state
             ───────────────────────────── */}

          {!hasQuery && (
            <>
              <section className={T.empty}>
                <div className={T.emptyTitle}>
                  What are you looking for?
                </div>

                <div className={T.emptyText}>
                  Find a writer, a story, a collection,
                  or something you want to come back to.
                </div>
              </section>

              {searchScope === "all" &&
                exploreContent.length > 0 && (
                  <section className={T.section}>
                    <div className={T.sectionTitle}>
                      Explore
                    </div>

                    <div className={T.exploreGrid}>
                      {exploreContent.map(
                        renderResult
                      )}
                    </div>
                  </section>
                )}

              {searchScope === "mine" &&
                personalResults.length > 0 && (
                  <section className={T.section}>
                    <div className={T.sectionTitle}>
                      Your Work
                    </div>

                    <div className={T.results}>
                      {personalResults.map(
                        renderResult
                      )}
                    </div>
                  </section>
                )}

              {searchScope === "mine" &&
                personalResults.length === 0 && (
                  <section className={T.empty}>
                    <div className={T.emptyTitle}>
                      Your work will appear here.
                    </div>

                    <div className={T.emptyText}>
                      Search your stories and collections
                      when you need to find something.
                    </div>
                  </section>
                )}
            </>
          )}

          {/* ─────────────────────────────
              Loading
             ───────────────────────────── */}

          {hasQuery && isSearching && (
            <div className={T.loading}>
              Searching...
            </div>
          )}

          {/* ─────────────────────────────
              Error
             ───────────────────────────── */}

          {hasQuery &&
            !isSearching &&
            searchError && (
              <div className={T.error}>
                Something went wrong while searching.
                <br />
                Try again.
              </div>
            )}

          {/* ─────────────────────────────
              Results
             ───────────────────────────── */}

          {hasQuery &&
            !isSearching &&
            !searchError &&
            results.length > 0 && (
              <section className={T.section}>
                <div className={T.sectionTitle}>
                  {searchScope === "mine"
                    ? "Your Work"
                    : selectedFilter === "all"
                    ? "Results"
                    : FILTERS.find(
                        (filter) =>
                          filter.key ===
                          selectedFilter
                      )?.label}
                </div>

                <div className={T.results}>
                  {results.map(renderResult)}
                </div>
              </section>
            )}

          {/* ─────────────────────────────
              No results
             ───────────────────────────── */}

          {hasQuery &&
            !isSearching &&
            !searchError &&
            results.length === 0 && (
              <section className={T.empty}>
                <div className={T.emptyTitle}>
                  Nothing found for “{searchText.trim()}”.
                </div>

                <div className={T.emptyText}>
                  Try another word or search for
                  something related.
                </div>
              </section>
            )}

        </main>
      </ErrorBoundary>
    </IonContent>
  );
};

export default SearchDialog;