

import { useEffect, useState, useContext, useMemo } from 'react';
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

// ── Layout ──────────────────────────────────────
const WRAP = "max-w-[72rem] dark:bg-base-bgDark bg-base-surface mx-auto sm:px-6 lg:px-8";


// ── Sections ────────────────────────────────────

//
// ── Layout ──────────────────────────────────────
const PAGE_Y = "pt-4 px-4 pb-12";
const STACK_LG = "space-y-10";
const STACK_MD = "space-y-6";

// ── Sections ────────────────────────────────────
const SECTION = "space-y-4";

// horizontal scroll that feels native
const SCROLL_ROW = "flex gap-4 overflow-x-auto pb-2 min-h-fit -mx-4 px-4 sm:mx-0 sm:px-0";

// responsive grid
const GRID = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";

// ── Cards ───────────────────────────────────────
const CARD = "bg-base-bg border-base-bg dark:border-purple border-1 border bg-base-surfaceDark rounded-2xl shadow-sm w-full";
const CARD_PAD = "p-4 sm:p-5";

// ── Skeleton ────────────────────────────────────
const SKELETON_BLOCK = "bg-gray-200 rounded animate-pulse";
const WorkshopItem = ({ item, router }) => {
  if (!item) return <WorkshopItemSkeleton />;

  return (

  <div onClick={() => router.push(Paths.collection.createRoute(item.id))} className={`${CARD} ${CARD_PAD}  w-[100%]`}>
      <IonLabel>
        <h2 className="text-md font-semibold dark:text-cream text-emerald-800 truncate">
          {shortName(item.title,30)}
        </h2>

        <p className="text-sm text-gray-600 dark:text-cream line-clamp-3">
          {shortName(item.description,40) || "No description available."}
        </p>

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
    // </IonItem>
  );
};


function HomeEmbed({workshops,stories,prompts,isGlobal,setIsGlobal}) {


  const dispatch = useDispatch();
  const router = useIonRouter();
  const { seo, setSeo } = useContext(Context);

  const currentProfile = useSelector(state => state.users.currentProfile);
  const {recommendedStories} = useSelector(state=>state.pages)


  const [whatsHappeningList, setWhatsHappeningList] = useState([]);

  const sortedWorkshops = useMemo(() => [...workshops]?.sort((a,b) => a?.title.localeCompare(b?.title)), [workshops]);
  const filteredPrompts =prompts
  //  useMemo(() => prompts?.filter(p => p?.data) || [], [prompts]);
console.log("filteredPromptsx",prompts)
console.log("filteredPrompts",filteredPrompts)
  useEffect(() => {
    if (stories?.length) {
      const sorted = [...stories].sort((a,b)=>new Date(b.updated)-new Date(a.updated));
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
      if (!payload.story) return window.alert("COULD NOT CREATE STORY");
      // dispatch(setEditingPage({ page: payload.story }));
      dispatch(setPageInView({ page: payload?.story }));
      router.push(Paths.editPage.createRoute(payload?.story?.id), 'forward', 'push');
    }));
  }, 5);

  if (!currentProfile) return <div className="flex justify-center mt-12"><IonSpinner /></div>;
 
  return (
    <ErrorBoundary>

        <div className={`${WRAP} ${PAGE_Y} ${STACK_LG}`}>
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
</div>
          {/* Workshops */}
          
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
         
        
           <div className={SECTION}>
  <div className="grid gap-4 sm:grid-cols-2  lg:grid-cols-2">
            {sortedWorkshops?.length
  ? sortedWorkshops.map(workshop => (
      <WorkshopItem key={workshop?.id} item={workshop} router={router} />
    ))
  : [1,2,3].map(i => (
      <WorkshopItem key={i} item={null} router={router} />
    ))
}
 </div>

        
     <div className={SECTION}>
          {/* Prompts */}
          {/* {filteredPrompts.length? */}
          <><SectionHeader title="Writing Prompts for you" />
       {/* <div className='px-4'> */}
          <div className={`${GRID} `}>

           
              {  filteredPrompts.map(( story ) =>{ return<StoryItem key={story?.id} page={story} html={story.html} />})}
              {/* // : [1,2,3,4].map(i => <div key={i} className="skeleton min-w-[20em] min-h-[20em]" />)} */}
            </div></> 
            {/* :null } */}
          </div>
          {/* </div> */}
       <div className={SECTION}>
           <SectionHeader title="What's new" />
              {/* <div className='px-4'> */}
          <PageList  items={recommendedStories.slice(0,4)}/>
          {/* </div> */}
          </div>
        </div>
    </div>
    </div>
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