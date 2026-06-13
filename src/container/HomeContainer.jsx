

import { useEffect, useState, useContext, useMemo, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createStory, } from '../actions/StoryActions';
import { setPageInView, } from '../actions/PageActions.jsx';
import { sendGAEvent } from '../core/ga4.js';
import Paths from '../core/paths';
import checkResult from '../core/checkResult';
import { PageType } from '../core/constants';
import Context from '../context';
import { IonText,  IonSpinner, IonLabel, IonToggle, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { debounce } from 'lodash';
import ErrorBoundary from '../ErrorBoundary.jsx';
import StoryItem from '../components/page/StoryItem.jsx';
import PageList from '../components/page/PageList.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import shortName from '../core/shortName.jsx';
import AlertType from '../core/AlertType.js';
import { useAlert } from '../core/useAlert.jsx';
import CreateCollectionForm from '../components/collection/CreateCollectionForm.jsx';
import { fetchCollectionFeedStories, fetchCollectionFeedSubCollections } from '../actions/CollectionActions.js';
import CollectionFeed from '../components/collection/CommunitiesPanel.jsx';

// ── Layout ──────────────────────────────────────
const WRAP = "max-w-[72rem] dark:bg-base-bgDark bg-cream mx-auto ";


// ── Sections ────────────────────────────────────
function ButtonWrapper({ onClick, children, className = "", style = {}, tabIndex = 0, role = "button" }) {
  return (
    <span
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`rounded-full flex btn items-center justify-center ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
//
// ── Layout ──────────────────────────────────────
const PAGE_Y = "pt-4 pb-12";
const STACK_LG = "space-y-10";
const STACK_MD = "space-y-6";

// ── Sections ────────────────────────────────────
const SECTION = "space-y-4";

// horizontal scroll that feels native
const SCROLL_ROW = "flex gap-4 px-4 overflow-x-auto pb-2 min-h-fit  mx-0 ";

// responsive grid
const GRID = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";

// ── Cards ───────────────────────────────────────
const CARD = "bg-cream border-purple border-1 border dark:bg-base-surfaceDark rounded-2xl shadow-sm w-full";
const CARD_PAD = "p-4 sm:p-5";

// ── Skeleton ────────────────────────────────────
const SKELETON_BLOCK = "bg-gray-200 rounded animate-pulse";
const WorkshopItem = ({ item, router }) => {
  if (!item) return <WorkshopItemSkeleton />;

  return (

  <div onClick={() => router.push(Paths.collection.createRoute(item.id))} className={`${CARD} ${CARD_PAD}  w-[100%]`}>
      <IonLabel>
        <h2 className="text-md font-semibold dark:text-cream text-soft truncate">
          {shortName(item.title,30)}
        </h2>

    

        <div className="flex justify-between text-xs dark:text-cream text-gray-500 mt-1">
          <span>{item?.location?.city || "Online / TBD"}</span>

          {item.participants ? (
            <span className="font-bold dark:text-cream text-soft">
              {item.participants} participants
            </span>
          ) : null}
        </div>
      </IonLabel>
      </div>
 
  );
};


function HomeEmbed({workshops,stories,prompts,isGlobal,setIsGlobal}) {

const { openDialog, closeDialog, resetDialog } = useContext(Context);
  const dispatch = useDispatch();
  const router = useIonRouter();
  const {  setSeo } = useContext(Context);

  const currentProfile = useSelector(state => state.users.currentProfile);
  const {recommendedStories} = useSelector(state=>state.pages)
 const homeCol = useMemo(() => 
  currentProfile?.profileToCollections?.find(c => c.type === "home")?.collection,
  [currentProfile?.profileToCollections]
);

const { showAlert } = useAlert()
  const [whatsHappeningList, setWhatsHappeningList] = useState([]);

  const sortedWorkshops = useMemo(() => [...workshops]?.sort((a,b) => a?.title.localeCompare(b?.title)).slice(0,4), [workshops]);
 const filteredPrompts = useMemo(() => 
  (prompts ?? []).filter(p => p?.data),
  [prompts]
);
  //  useMemo(() => prompts?.filter(p => p?.data) || [], [prompts]);

  useEffect(() => {
    if (stories?.length) {
      const sorted = [...stories].filter(s=>s.type==PageType.text).sort((a,b)=>new Date(b.updated)-new Date(a.updated));
      setWhatsHappeningList(sorted);
    }
  }, [stories]);

  useEffect(() => {
    if (!currentProfile) return;
    setSeo(prev => ({
      ...prev,
      title: `Plumbum (${currentProfile.username}) Home`,
      description: `Welcome to ${currentProfile.username}'s home on Plumbum.`,
      url: `https://plumbum.app/${currentProfile.username}`,
    }));
  }, [currentProfile, setSeo]);

  const handleGlobal = () => setIsGlobal(!isGlobal);
 const ClickCreateACollection = () => {
     try {
    sendGAEvent("create_collection_open", {
      area: "collections",
      modal_type: "create_collection",
      user_id: currentProfile?.id || null, // optional, if you want to track
    });
  } catch (e) {

  }

openDialog({
// ...dialog,
disagree:null,
scrollY: false,
  text: <CreateCollectionForm onClose={resetDialog} />,
  disagreeText: "Close", // optional button
  onClose: closeDialog,
  breakpoint: 1, // if you want a half-sheet style
});

  };

  const ClickWriteAStory = debounce(() => {
    if (!currentProfile?.id) return;
    sendGAEvent("Create", "Write a Story", "Click Write Story");
    dispatch(createStory({
      profileId: currentProfile.id,
      privacy: true,
      type: PageType.text,
      title: "Untitled",
      commentable: true
    })).then(res => checkResult(res, payload => {
      if (!payload.story) return showAlert({ message: "COULD NOT CREATE STORY", type: AlertType.error });

      dispatch(setPageInView({ page: payload?.story }));
      router.push(Paths.editPage.createRoute(payload?.story?.id,payload?.story?.type), 'forward', 'push');
    }));
  }, 5);
const fetchStories = useCallback(async (skip, take) => {
  if (!homeCol?.id) return [];
  try {
    const data = await dispatch(
      fetchCollectionFeedStories({ id: homeCol.id, skip, take })
    ).unwrap();
    return data.items ?? [];
  } catch (e) { return []; }
}, [homeCol?.id, dispatch]);
const { items, getMore, hasMore, isLoading } = useCollectionFeed({
  fetchStories: async (skip, take) => {
    try {
      const data = await dispatch(
        fetchCollectionFeedStories({ id: homeCol.id, skip, take })
      ).unwrap();
      return data.items ?? [];
    } catch { return []; }
  },
  fetchSubStories: async (skip, take) => {
    try {
      const data = await dispatch(
        fetchCollectionFeedSubCollections({ id: homeCol.id, skip, take })
      ).unwrap();
      return data.items ?? [];
    } catch { return []; }
  },
  enabled: !!homeCol?.id,
});



const fetchSubCollections = useCallback(async (skip, take) => {
  if (!homeCol?.id) return [];
  try {
    const data = await dispatch(
      fetchCollectionFeedSubCollections({ id: homeCol.id, skip, take })
    ).unwrap();
    return data.items ?? [];
  } catch (e) { return []; }
}, [homeCol?.id, dispatch]);
  if (!currentProfile) return <div className="flex justify-center mt-12"><IonSpinner /></div>;
 
  return (
    <ErrorBoundary>
  <div className="flex flex-col items-center gap-3  w-full dark:bg-base-bgDark bg-base-surface md:max-w-[40em] mx-auto px-4">

  {/* Primary: Write — full width, most prominent */}
  <ButtonWrapper
    onClick={ClickWriteAStory}
    className="hover:bg-button-secondary-hover  bg-blue  w-xl min-w-[24em] dark:bg-transparent dark:border-button-secondary-hover text-white rounded-2xl h-[3.2rem] w-full  sm:w-[21rem] font-bold"
    style={{ WebkitTapHighlightColor: "transparent" }}
  >
    <IonText className="text-sm text-cream 
    
    font-bold">Write Something</IonText>
  </ButtonWrapper>
<div className='flex flex-row gap-4'>
  {/* Secondary: Join a Workshop — full width, distinct color */}
  <ButtonWrapper
    onClick={() => router.push(Paths.workshop.reader(), "forward")}
    className="bg-button-primary-bg dark:bg-transparent max-w-[20em] dark:border-purple  hover:bg-opacity-70 text-button-primary-text rounded-full h-[3rem] flex-1 sm:w-[21rem] font-bold"
    style={{ WebkitTapHighlightColor: "transparent" }}
  >
    <IonText className="text-cream text-sm">Join a Workshop</IonText>
  </ButtonWrapper>

  {/* Tertiary: Create Collection — smaller, understated */}
  <ButtonWrapper
    onClick={ClickCreateACollection}
    className="bg-transparent border border-soft dark:border-purple  max-w-[20em]  text-soft rounded-full h-[3rem] flex-1 sm:w-[21rem]"
    style={{ WebkitTapHighlightColor: "transparent" }}
  >
    <IonText className="text-sm text-soft dark:text-cream">+ Collection</IonText>
  </ButtonWrapper>
</div>
</div>
{/* Stories className={`${WRAP} ${PAGE_Y} ${STACK_LG}`} */}
        
          <div className={SECTION}>
          {/* Stories */}
          <SectionHeader title="What's happening in your communities" />
      

<div className={SCROLL_ROW+" overflow-y-hidden"}>
  {whatsHappeningList.length
    ? whatsHappeningList.map(story => (

          <StoryItem key={story?.id} page={story} html={story?.data} isGrid />
 
      ))
    : [1,2,3].map(i => (
        <div
          key={i}
          className={`${SKELETON_BLOCK} min-w-[75%] sm:min-w-[16rem] lg:min-w-[18rem] h-[16rem]`}
        />
      ))
  }

</div>
          {/* Workshops */}
          <div className={`${WRAP} ${PAGE_Y} ${STACK_LG}`} >
           <div className={SECTION}>
          <SectionHeader
            title="Workshops near you"
            right={
              <div className="flex items-center  gap-2">
                <IonText className="text-sm dark:text-cream">{isGlobal ? "Global" : "Local"}</IonText>
                <IonToggle checked={isGlobal} onIonChange={handleGlobal} />
              </div>
            }
          />
        </div>
        <div className={`${WRAP} ${PAGE_Y} ${STACK_LG}`} >
           {/* Workshop grid */}
          <div className={SECTION}>
            <div className="grid gap-4 sm:grid-cols-2 px-4 lg:grid-cols-2">
              {sortedWorkshops?.length
                ? sortedWorkshops.map(workshop => (
                    <WorkshopItem key={workshop?.id} item={workshop} router={router} />
                  ))
                : [1, 2, 3].map(i => (
                    <WorkshopItem key={i} item={null} router={router} />
                  ))}
            </div>
          </div>
        </div> {/* ← closes "Workshops near you" SECTION */}
</div>
        {/* Prompts */}
        <div className={`${WRAP} ${PAGE_Y} ${STACK_LG}`} >
        <div className={SECTION}>
          <SectionHeader title="Writing Prompts for you" />
      <div className={`${GRID} px-4`}>
  {filteredPrompts.length
    ? filteredPrompts.map(story => (
        <StoryItem key={story?.id} page={story} html={story?.data} />
      ))
    : [1, 2, 3].map(i => (
        <div
          key={i}
          className={`${SKELETON_BLOCK} h-[10rem] w-full`}
        />
      ))
  }
</div>
        </div>
        </div>

        {/* What's new */}
        <div className={SECTION+"px-2"}>
          <SectionHeader title="What's new" />

{homeCol?.id && (
  <PageList
    items={items}
    getMore={getMore}
    hasMore={hasMore}
    shortenTo={400}
  />
)}
</div>
      </div> {/* ← closes WRAP */}
    </ErrorBoundary>
  );
}

export default HomeEmbed
const WorkshopItemSkeleton = () => {
  return (
    <div className={`${CARD} ${CARD_PAD} animate-pulse space-y-3`}>
      <div className="h-4 w-2/3 bg-gray-300 rounded" />

      <div className="space-y-1">
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 rounded" />
      </div>

      <div className="flex justify-between">
        <div className="h-3 w-1/4 bg-gray-200 rounded" />
        <div className="h-3 w-1/4 bg-gray-300 rounded" />
      </div>
    </div>
  );
};
const RECENCY_WEIGHT = 0.75;
const ENGAGEMENT_WEIGHT = 0.25;
 
function getEngagement(item) {
  return item._count?.roles ?? item.roles?.length ?? 0;
}
 
function buildSortedFeed(directStories, subStories) {
  const safeDirect = Array.isArray(directStories) ? directStories : [];
  const safeSub = Array.isArray(subStories) ? subStories : [];
 
  const seen = new Set();
  const allItems = [];
  for (const s of [...safeDirect, ...safeSub]) {
    if (!s?.id || seen.has(s.id)) continue;
    seen.add(s.id);
    allItems.push(s);
  }
 
  if (!allItems.length) return [];
 
  const timestamps = allItems.map((i) =>
    i.updated ? new Date(i.updated).getTime() : 0
  );
  const oldestMs = Math.min(...timestamps);
  const newestMs = Math.max(...timestamps);
  const range = newestMs - oldestMs || 1;
 
  const maxEngagement = Math.max(...allItems.map(getEngagement), 1);
 
  return allItems
    .map((item) => {
      const updated = item.updated ? new Date(item.updated).getTime() : 0;
      const recency = (updated - oldestMs) / range;
      const engagement = getEngagement(item) / maxEngagement;
      return {
        ...item,
        _score: RECENCY_WEIGHT * recency + ENGAGEMENT_WEIGHT * engagement,
      };
    })
    .sort((a, b) => b._score - a._score);
}

 function useCollectionFeed({
  fetchStories,
  fetchSubStories,
  pageSize = 12,
  enabled = true,
}) {
  const [directStories, setDirectStories] = useState([]);
  const [subStories, setSubStories] = useState([]);
  const [items, setItems] = useState([]);
  const [skip, setSkip] = useState(0);
  const [subSkip, setSubSkip] = useState(0);
  const [hasMoreDirect, setHasMoreDirect] = useState(true);
  const [hasMoreSub, setHasMoreSub] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const initialised = useRef(false);
 
  // ── Initial load: both streams in parallel ─────────────────────────────────
  useEffect(() => {
    if (initialised.current || !enabled) return;
    initialised.current = true;
 
    const loadDirect = fetchStories
      ? Promise.resolve(fetchStories(0, pageSize)).catch(() => [])
      : Promise.resolve([]);
    const loadSub = fetchSubStories
      ? Promise.resolve(fetchSubStories(0, pageSize)).catch(() => [])
      : Promise.resolve([]);
 
    Promise.all([loadDirect, loadSub])
      .then(([direct, sub]) => {
        const d = Array.isArray(direct) ? direct : [];
        const s = Array.isArray(sub) ? sub : [];
        setDirectStories(d);
        setSubStories(s);
        setSkip(pageSize);
        setSubSkip(pageSize);
        if (d.length < pageSize) setHasMoreDirect(false);
        if (s.length < pageSize) setHasMoreSub(false);
      })
      .finally(() => setIsLoading(false));
  }, [fetchStories, fetchSubStories, pageSize, enabled]);
 
  // ── Rebuild merged list when either stream grows ───────────────────────────
  useEffect(() => {
    setItems(buildSortedFeed(directStories, subStories));
  }, [directStories, subStories]);
 
  // ── getMore: pages both streams, PageList calls this on scroll ─────────────
  const getMore = useCallback(async () => {
    const tasks = [];
 
    if (fetchStories && hasMoreDirect) {
      tasks.push(
        Promise.resolve(fetchStories(skip, pageSize))
          .catch(() => [])
          .then((res) => {
            const arr = Array.isArray(res) ? res : [];
            if (arr.length < pageSize) setHasMoreDirect(false);
            setDirectStories((prev) => {
              const ids = new Set(prev.map((p) => p.id));
              return [...prev, ...arr.filter((i) => !ids.has(i.id))];
            });
            setSkip((p) => p + pageSize);
          })
      );
    }
 
    if (fetchSubStories && hasMoreSub) {
      tasks.push(
        Promise.resolve(fetchSubStories(subSkip, pageSize))
          .catch(() => [])
          .then((res) => {
            const arr = Array.isArray(res) ? res : [];
            if (arr.length < pageSize) setHasMoreSub(false);
            setSubStories((prev) => {
              const ids = new Set(prev.map((p) => p.id));
              return [...prev, ...arr.filter((i) => !ids.has(i.id))];
            });
            setSubSkip((p) => p + pageSize);
          })
      );
    }
 
    await Promise.all(tasks);
  }, [fetchStories, fetchSubStories, hasMoreDirect, hasMoreSub, skip, subSkip, pageSize]);
 
  return {
    items,
    getMore,
    hasMore: hasMoreDirect || hasMoreSub,
    isLoading,
  };
}
 
