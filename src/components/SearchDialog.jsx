
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import {
  IonList,
  IonRow,
  useIonRouter,
  IonSearchbar,
  IonContent,
} from '@ionic/react';
import { useSelector, useDispatch } from 'react-redux';
import { searchMultipleIndexes } from '../actions/UserActions';
import checkResult from '../core/checkResult';
import Context from '../context';
import getBackground from '../core/getbackground';
import Enviroment from '../core/Enviroment';
import { ErrorBoundary } from '@sentry/react';

// ── Tokens ───────────────────────────────
const T = {
  wrap:        "max-w-2xl sm:max-w-[100%] mx-auto px-4 bg-cream dark:bg-base-bgDark ",
  surface:     " page-content",
  card:        "bg-cream dark:bg-base-bgDark shadow-sm",
  header:      "flex items-center gap-3 px-4 pt-12 pb-2",
  searchWrap:  "flex-1 bg-base-bg dark:bg-base-surfaceDark rounded-full px-2",
  logo:        "text-text-brand dark:text-cream text-xl font-semibold pr-1",
  filterRow:   "flex flex-wrap gap-2 px-4 py-3",
  filterBase:  "px-3 py-1.5 rounded-full text-xs border transition-all duration-150 cursor-pointer",
  filterOn:    "bg-soft text-white border-soft border-2 dark:bg-base-surfaceDark dark:text-cream",
  filterOff:   "bg-base-bg dark:bg-base-surfaceDark text-text-secondary dark:text-cream border border-soft",
  list:        "divide-y divide-border-soft ",
  listItem:    "py-3 px-4 flex items-center justify-between rounded-lg transition hover:bg-base-bg dark:hover:bg-base-surfaceDark cursor-pointer",
  itemTitle:   "text-sm text-text-primary dark:text-cream",
  empty:       "py-16 text-center text-xs text-text-secondary dark:text-cream/50",
};

const SearchDialog = ({ presentingElement }) => {
  const dispatch = useDispatch();
  const router = useIonRouter();

  const currentProfile = useSelector(state => state.users.currentProfile);
  const collectionsFromStore = useSelector(state => state.books.collections ?? []);
  const storiesFromStore = useSelector(state => state.pages.pagesInView ?? []);

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchContent, setSearchContent] = useState([]);

  const personalCols = useMemo(() =>
    collectionsFromStore.filter(Boolean).map(col => ({
      item: { ...col }, objectID: col.id, type: 'collection',
    })),
    [collectionsFromStore]
  );

  const personalStories = useMemo(() =>
    storiesFromStore.map(story => ({
      item: { ...story }, objectID: story.id, type: 'story',
    })),
    [storiesFromStore]
  );

  const filters = useMemo(() => {
    const base = ['collection', 'story', 'profile', 'hashtag'];
    return currentProfile ? ['personal', ...base] : base;
  }, [currentProfile]);

  const searchList = useCallback((q, list) => {
    const lower = q.toLowerCase();
    return list.filter(({ item = {} }) =>
      item.title?.toLowerCase().includes(lower) ||
      item.username?.toLowerCase().includes(lower) ||
      item.name?.toLowerCase().includes(lower)
    );
  }, []);

  const searchAction = useCallback(() => {
    if (selectedFilters.includes('personal')) return;
    dispatch(searchMultipleIndexes({
      query: searchText.trim(),
      filters: selectedFilters,
      profileId: currentProfile?.id ?? null,
    })).then(result => {
      checkResult(result, returned => {
        setSearchContent(
          (returned.results ?? []).map(item => ({
            item,
            objectID: item.objectID ?? item.id,
            type: item.type,
          }))
        );
      });
    });
  }, [searchText, selectedFilters, currentProfile]);

  useEffect(() => {
    if (!searchText.trim()) return;
    searchAction();
  }, [searchText, searchAction]);

  useEffect(() => {
    searchAction();
  }, [selectedFilters]);

  const filteredContent = useMemo(() => {
    const isPersonal = selectedFilters.includes('personal');
    const inCol   = selectedFilters.includes('collection');
    const inStory = selectedFilters.includes('story');

    if (isPersonal) {
      const pool =
        inCol && !inStory ? personalCols :
        inStory && !inCol ? personalStories :
        [...personalStories, ...personalCols];
      return searchList(searchText, pool);
    }

    const remote = searchContent.filter(content =>
      !!content.item &&
      (selectedFilters.length === 0 || selectedFilters.includes(content.type))
    );
    return searchText.trim() ? searchList(searchText, remote) : remote;
  }, [selectedFilters, searchText, personalCols, personalStories, searchContent, searchList]);

  const toggleFilter = (genre) =>
    setSelectedFilters(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );

  const handleOnClick = (item) =>
    router.push(`/${item.type}/${item.objectID}/view`);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <IonContent fullscreen  className={T.surface}>
      <ErrorBoundary>
<div className='bg-cream dark:bg-base-bgDark overglow-y-auto minm-h-[100vh]  '>
      {/* Header + Search */}
      <div className={`${T.header} bg-cream dark:bg-base-bgDark ${T.surface}`}>
        <div className={T.searchWrap}>
          <IonSearchbar
            value={searchText}
            debounce={250}
            className="rounded-full"
            style={{
              "color":prefersDark?Enviroment.palette.cream:Enviroment.palette.soft,
              "--background": "transparent", "--box-shadow": "none" }}
            onIonInput={e => setSearchText(e.target.value?.toLowerCase() ?? "")}
            placeholder="Search"
          />
        </div>
        <span className={T.logo}>Pb</span>
      </div>

      {/* Filters */}
      <div className={`${T.filterRow}  ${T.surface}`}>
        {filters.map((genre, i) => (
          <div
            key={genre ?? i}
            onClick={() => toggleFilter(genre)}
            className={`${T.filterBase} ${selectedFilters.includes(genre) ? T.filterOn : T.filterOff}`}
          >
            {genre}
          </div>
        ))}
      </div>

      {/* Results */}
      <div className='max-w-2xl  pb-36 dark:bg-base-bgDark bg-cream mx-auto'>
      <div className={`${T.wrap} min-h-[100%] ${T.surface}`}>
        <IonList className={T.card}>
          <div className={T.list}>
            {filteredContent.length ? (
              filteredContent.map((content, i) => (
                <div
                  key={content.objectID ?? i}
                  className={T.listItem}
                  onClick={() => handleOnClick(content)}
                >
                  <span className={T.itemTitle}>
                    {content.item?.title || content.item?.username || content.item?.name || "Untitled"}
                  </span>
                </div>
              ))
            ) : (
              <div className={T.empty}>
                <p>No results</p>
              </div>
            )}
          </div>
        </IonList>
        </div>
      </div>
</div>
</ErrorBoundary>
    </IonContent>
  );
};

export default SearchDialog;