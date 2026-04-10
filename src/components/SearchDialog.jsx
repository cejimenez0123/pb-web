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
import {
  searchMultipleIndexes,

} from '../actions/UserActions';
import checkResult from '../core/checkResult';
import Context from '../context';
import Enviroment from '../core/Enviroment';
// ── Layout ───────────────────────────────
const WRAP = "max-w-2xl mx-auto px-4";
const HEADER = "flex items-center gap-3";
const SECTION = "space-y-4 bg-base-surface";
// ── Layout ───────────────────────────────
// const WRAP = "max-w-2xl mx-auto px-4";
// const HEADER = "flex items-center gap-3";
// const SECTION = "space-y-4";
const STACK_SM = "space-y-2";
const STACK_MD = "space-y-4";
// ── Layout ───────────────────────────────
// const WRAP = "max-w-2xl mx-auto px-4";
const STACK = "space-y-5";
// const STACK_SM = "space-y-3";

// ── Surfaces (iOS feel) ──────────────────
const SURFACE_CARD =
  "bg-base-surface  shadow-sm px-4 py-3";

const SURFACE_SOFT =
  "bg-base-bg rounded-2xl";

// ── Header ───────────────────────────────
// const HEADER = "flex items-center gap-3";
const LOGO = "text-text-brand text-xl font-semibold";

// ── Search ───────────────────────────────
const SEARCH_WRAP =
  "flex-1 bg-base-surface rounded-full px-2";

// ── Filters ──────────────────────────────
const FILTER_ROW = "flex flex-wrap gap-2";

const FILTER_PILL =
  "px-3 py-1.5 rounded-full text-xs shadow-sm border transition-all duration-150";

// ── List ─────────────────────────────────
const LIST = "divide-y divide-border-soft h-[100%]";

const LIST_ITEM =
  "py-3 px-2 flex items-center justify-between rounded-lg transition";

// ── Text ─────────────────────────────────
const TITLE = "text-sm text-text-primary";
// const SUBTLE = "text-xs text-text-secondary";
// ── Search UI ───────────────────────────
// const SEARCH_WRAP = "flex-1";
// const LOGO = "text-emerald-700 text-2xl font-semibold";

// // ── Filters ─────────────────────────────
// const FILTER_ROW = "flex flex-wrap gap-2";
// const FILTER_PILL =
//   "cursor-pointer rounded-full border px-4 py-1 text-sm transition-colors duration-200";

// // ── Results ─────────────────────────────
// const LIST = "space-y-1";
// const LIST_ITEM =
//   "px-3 py-2 rounded-lg hover:bg-emerald-50 transition cursor-pointer";
const SUBTLE = "text-xs text-text-secondary";
// ── Surface ─────────────────────────────
const SURFACE = "bg-base-surface";
// ── Surface ─────────────────────────────
// const SURFACE = "bg-cream";
const SearchDialog = ({ presentingElement }) => {
  const dispatch = useDispatch();
  const router = useIonRouter();

  const currentProfile = useSelector(state => state.users.currentProfile);
  const collectionsFromStore = useSelector(
    state => state.books.collections ?? []
  );
  const storiesFromStore = useSelector(
    state => state.pages.pagesInView ?? []
  );
  const {isPhone}=useContext(Context)
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchContent, setSearchContent] = useState([]);

 
  const personalCols = useMemo(
    () =>
      collectionsFromStore
        .filter(col => !!col)
        .map(col => ({
          item: { ...col },
          objectID: col.id,
          type: 'collection'
        })),
    [collectionsFromStore]
  );

  const personalStories = useMemo(
    () =>
      storiesFromStore.map(story => ({
        item: { ...story },
        objectID: story.id,
        type: 'story' 
      })),
    [storiesFromStore]
  );

  // Filters list
  const filters = useMemo(() => {
    const includeTypes = {
      cols: 'collection',
      stories: 'story',
      profiles: 'profile',
      hashtags: 'hashtag',
    };
    const base = [
      includeTypes.profiles,
      includeTypes.hashtags,
      includeTypes.cols,
      includeTypes.stories,
    ];
    return currentProfile ? ['personal', ...base] : base;
  }, [currentProfile]);

  // Load initial collections/stories depending on auth
  

  // Helper: local text filter
  const searchList = useCallback((searchQ, list) => {
    const q = searchQ.toLowerCase();
    return list.filter(content => {
      const item = content.item || {};
      const titleMatch =
        item?.title && item?.title.toLowerCase().includes(q);
      const usernameMatch =
        item?.username && item?.username.toLowerCase().includes(q);
      const nameMatch =
        item?.name && item?.name.toLowerCase().includes(q);
      return !!(titleMatch || usernameMatch || nameMatch);
    });
  }, []);

const searchAction = useCallback(() => {
  const trimmed = searchText.trim();

  // personal search is LOCAL — don't return early
  if (selectedFilters.includes('personal')) return;

  
  dispatch(searchMultipleIndexes({
    query: trimmed,
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

  // Trigger remote search when search text or filters change
  useEffect(() => {
    searchAction();
  }, []);

  // Derived filtered content (memoized)
  const filteredContent = useMemo(() => {
    const isPersonal = selectedFilters.includes('personal');
    const inCol = selectedFilters.includes('collection');
    const inStory = selectedFilters.includes('story');

    // Personal: only use local data
    if (isPersonal) {
      if (inCol && !inStory) {
        return searchList(searchText, personalCols);
      }
      if (inStory && !inCol) {
        return searchList(searchText, personalStories);
      }
      // Both or none specified -> search across both
      return searchList(searchText, [...personalStories, ...personalCols]);
    }

    // Non-personal: start from remote results, filter by type
    const list =
      searchContent?.filter(content => {
        const hasItem = !!content.item;
        const passesTypeFilter =
          selectedFilters.length === 0 ||
          selectedFilters.includes(content.type);
        return hasItem && passesTypeFilter;
      }) ?? [];

    // If there is a search text, also apply local text filtering on that set
    if (searchText.trim()) {
      return searchList(searchText, list);
    }

    return list;
  }, [
    selectedFilters,
    searchText,
    personalCols,
    personalStories,
    searchContent,
    searchList,
  ]);

  const toggleFilters = (genre) => {
    setSelectedFilters(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleOnClick = (searchItem) => {
   
    router.push(`/${searchItem.type}/${searchItem.objectID}/view`);
  };
  useEffect(() => {
  if (!searchText.trim()) return;

  console.log("⌨️ typing triggered search:", searchText);
  searchAction();
}, [searchText, searchAction]);


  return (
    // <IonContent
    //   fullscreen
    //   scrollY={true}
    //   className="ion-padding"

    //   style={{'--padding-top':isPhone?"4em":"10em", '--background': Enviroment.palette.cream  }}
    // >
    <IonContent fullscreen scrollY className={SURFACE}>
  <div className={`${WRAP} ${SECTION}`}>
    {/* <div className={`${WRAP} ${SECTION}`}> */}
        <div className={STACK_SM}>
  <div className={HEADER}>
  <div className={SEARCH_WRAP}>
    <IonSearchbar
      value={searchText}
      debounce={250}
      className="rounded-full"
      style={{
        "--background": "transparent",
        "--box-shadow": "none",
      }}
      onIonInput={(e) => {
        const query = e.target.value?.toLowerCase() ?? "";
        setSearchText(query);
      }}
      placeholder="Search"
    />
  </div>

  <span className={LOGO}>Pb</span>
{/* </div> */}
</div>
</div>
</div>

      {/* <IonGrid style={{ '--background': Enviroment.palette.cream }}> */}
      <div className='px-4 bg-base-surface  '>
        <IonRow
          className="ion-justify-content-star gap-x-2 gap-y-2 ion-align-items-center ion-padding-vertical"
          // style={{ '--background': Enviroment.palette.cream }}
        >
          <div className={FILTER_ROW}>
  {filters.filter(Boolean).map((genre, i) => {
    const selected = selectedFilters.includes(genre);

    return (
      <div
        key={genre ?? i}
        onClick={() => toggleFilters(genre)}
        className={`${FILTER_PILL} ${
          selected
            ? "bg-soft text-white border-soft"
            : "bg-base-bg text-text-secondary border-border-soft"
        }`}
      >
        {genre}
      </div>
    );
  })}
</div>
  
        </IonRow>
        </div>
      {/* </IonGrid> */}
      
<div className={STACK_SM+" bg-base-surface pb-60"}>
      <IonList
        style={{
        
        }}
      >
        <div className={SURFACE_CARD}>
  <div className={LIST}>
    {filteredContent?.length ? (
      filteredContent.map((content, i) => (
        <div
          key={content.objectID ?? i}
          className={`${LIST_ITEM} hover:bg-base-bg`}
          onClick={() => handleOnClick(content)}
        >
          <span className={TITLE}>
            {content.item?.title ||
              content.item?.username ||
              content.item?.name ||
              "Untitled"}
          </span>
        </div>
      ))
    ) : (
      <div className="py-6 min-h-[50rem] text-center">
        <p className={SUBTLE}>No results</p>
      </div>
    )}
  </div>
</div>
     </IonList>
  
      </div>
    </IonContent>
  );
};

export default SearchDialog;
