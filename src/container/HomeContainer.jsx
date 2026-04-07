

import { useEffect, useState, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createStory, } from '../actions/StoryActions';
import { setPageInView, setEditingPage } from '../actions/PageActions.jsx';
import { sendGAEvent } from '../core/ga4.js';
import Paths from '../core/paths';
import checkResult from '../core/checkResult';
import { PageType } from '../core/constants';
import Context from '../context';
import { IonText, IonContent, IonSpinner, IonItem, IonLabel, IonToggle, useIonRouter, useIonViewWillEnter } from '@ionic/react';

import { debounce } from 'lodash';
import ErrorBoundary from '../ErrorBoundary.jsx';
import StoryItem from '../components/page/StoryItem.jsx';
import Enviroment from '../core/Enviroment.js';
import PageList from '../components/page/PageList.jsx';
import SectionHeader from '../components/SectionHeader.jsx';



// Section Header Component
// const SectionHeader = ({ title, right }) => (
//   <div className="flex items-center justify-between px-1 mb-2 mt-6">
//     <IonText className="text-lg font-semibold text-gray-900">{title}</IonText>
//     {right}
//   </div>
// );
const WorkshopItem = ({ item, router }) => {
  if (!item) return <WorkshopItemSkeleton />;

  return (
    <IonItem
      style={{ "--background": Enviroment.palette.cream }}
      onClick={() => router.push(Paths.collection.createRoute(item.id))}
      className="bg-cream"
    >
      <IonLabel>
        <h2 className="text-md font-semibold text-emerald-800 truncate">
          {item.title}
        </h2>

        <p className="text-sm text-gray-600 line-clamp-3">
          {item.description || "No description available."}
        </p>

        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{item?.location?.city || "Online / TBD"}</span>

          {item.participants ? (
            <span className="font-bold text-emerald-600">
              {item.participants} participants
            </span>
          ) : null}
        </div>
      </IonLabel>
    </IonItem>
  );
};
// Workshop Card Component
// const WorkshopItem = ({ item, router }) => (
//   const WorkshopItem = ({ item, router }) => (
//   <div className="px-3 py-2">
//     <IonItem
//       onClick={() => router.push(Paths.collection.createRoute(item.id))}
//       className="!bg-transparent !p-0 !inner-padding-end-0"
//       lines="none"
//     >
//       <div className="w-full bg-base-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-4 border border-base-200">
        
//         <h2 className="text-md font-semibold text-emerald-800 truncate">
//           {item.title}
//         </h2>

//         <p className="text-sm text-gray-600 line-clamp-3 mt-1">
//           {item.description || "No description available."}
//         </p>

//         <div className="flex justify-between text-xs text-gray-500 mt-3">
//           <span>{item.location || "Online / TBD"}</span>

//           {item.participants ? (
//             <span className="font-bold text-emerald-600">
//               {item.participants} participants
//             </span>
//           ) : null}
//         </div>

//       </div>
//     </IonItem>
//   </div>
// );
  // <IonItem  style={{"--background":Enviroment.palette.cream}} onClick={() => router.push(Paths.collection.createRoute(item.id))} className="bg-cream ">
  //   <IonLabel>
  //     <h2 className="text-md font-semibold text-emerald-800 truncate">{item.title}</h2>
  //     <p className="text-sm text-gray-600 line-clamp-3">{item.description || "No description available."}</p>
  //     <div className="flex justify-between text-xs text-gray-500 mt-1">
  //       <span>{item.location || "Online / TBD"}</span>
  //       {item.participants ? <span className="font-bold text-emerald-600">{item.participants} participants</span> : null}
  //     </div>
  //   </IonLabel>
  // </IonItem>
// );

// Hook for fetching profile-dependent data

function HomeEmbed({workshops,stories,prompts,isGlobal,setIsGlobal}) {


  const dispatch = useDispatch();
  const router = useIonRouter();
  const { seo, setSeo } = useContext(Context);

  const currentProfile = useSelector(state => state.users.currentProfile);
  const {recommendedStories} = useSelector(state=>state.pages)


  const [whatsHappeningList, setWhatsHappeningList] = useState([]);

  const sortedWorkshops = useMemo(() => [...workshops].sort((a,b) => a.title.localeCompare(b.title)), [workshops]);
  const filteredPrompts = useMemo(() => prompts?.filter(p => p?.story?.data) || [], [prompts]);


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
      dispatch(setEditingPage({ page: payload.story }));
      dispatch(setPageInView({ page: payload.story }));
      router.push(Paths.editPage.createRoute(payload.story.id), 'forward', 'push');
    }));
  }, 5);

  if (!currentProfile) return <div className="flex justify-center mt-12"><IonSpinner /></div>;

  return (
    <ErrorBoundary>

        <div className="max-w-[60rem] mx-auto px-4 mt-4">
          
          {/* Stories */}
          <SectionHeader title="What's happening in your communities" />
          <div className="flex gap-4 overflow-x-auto pb-2">
            {whatsHappeningList.length
              ? whatsHappeningList.map(story => <StoryItem key={story.id} page={story} isGrid />)
              : [1,2,3].map(i => <div key={i} className="skeleton min-w-[20em] min-h-[20em]" />)
            }
          </div>

          {/* Workshops */}
          <SectionHeader
            title="Workshops near you"
            right={
              <div className="flex items-center gap-2">
                <IonText className="text-sm">{isGlobal ? "Global" : "Local"}</IonText>
                <IonToggle checked={isGlobal} onIonChange={handleGlobal} />
              </div>
            }
          />
          {/* <IonList inset> */}
          <div className='flex-row col'>
            {sortedWorkshops? sortedWorkshops.map(workshop => (
              <WorkshopItem key={workshop.id} item={workshop} router={router} />
            )):[1,2,3].map(i=>{
                <WorkshopItem key={i} item={null} router={router}/>
            })}
            </div>
        

          {/* Prompts */}
          <SectionHeader title="Writing Prompts for you" />
       
          <div className="grid pb-[10em] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {filteredPrompts.length
              ? filteredPrompts.map(({ story }) => <StoryItem key={story.id} page={story} />)
              : [1,2,3,4].map(i => <div key={i} className="skeleton min-w-[20em] min-h-[20em]" />)
            }
          </div>
          <PageList  items={recommendedStories}/>
        </div>
    
    </ErrorBoundary>
  );
}

export default HomeEmbed
const WorkshopItemSkeleton = () => {
  return (
    <div className="px-3 py-2">
      <div className="bg-base-100 rounded-2xl shadow-md p-4 animate-pulse border border-base-200">
        
        <div className="h-4 w-2/3 bg-gray-300 rounded mb-2"></div>

        <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
        <div className="h-3 w-5/6 bg-gray-200 rounded mb-3"></div>

        <div className="flex justify-between">
          <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
          <div className="h-3 w-1/4 bg-gray-300 rounded"></div>
        </div>

      </div>
    </div>
  );
};