

import { useEffect, useState, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createStory, fetchRecommendedStories, updateStory, getPrompts } from '../actions/StoryActions';
import { setPageInView, setEditingPage, setHtmlContent } from '../actions/PageActions.jsx';
import { sendGAEvent } from '../core/ga4.js';
import Paths from '../core/paths';
import checkResult from '../core/checkResult';
import { PageType } from '../core/constants';
import Context from '../context';
import { IonText, IonContent, IonSpinner, IonList, IonItem, IonLabel, IonToggle, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { Preferences } from '@capacitor/preferences';
import axios from "axios";
import { debounce } from 'lodash';
import ErrorBoundary from '../ErrorBoundary.jsx';
import { getCurrentProfile } from '../actions/UserActions.jsx';
import { findWorkshopGroups } from '../actions/WorkshopActions.jsx';
import requestLocation from '../core/requestLocation.js';
import StoryItem from '../components/page/StoryItem.jsx';
import Enviroment from '../core/Enviroment.js';


// Section Header Component
const SectionHeader = ({ title, right }) => (
  <div className="flex items-center justify-between px-1 mb-2 mt-6">
    <IonText className="text-lg font-semibold text-gray-900">{title}</IonText>
    {right}
  </div>
);

// Workshop Card Component
const WorkshopItem = ({ item, router }) => (
  <IonItem  style={{"--background":"#f4f4e0"}} onClick={() => router.push(Paths.collection.createRoute(item.id))} className="bg-cream ">
    <IonLabel>
      <h2 className="text-md font-semibold text-emerald-800 truncate">{item.title}</h2>
      <p className="text-sm text-gray-600 line-clamp-3">{item.description || "No description available."}</p>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{item.location || "Online / TBD"}</span>
        {item.participants ? <span className="font-bold text-emerald-600">{item.participants} participants</span> : null}
      </div>
    </IonLabel>
  </IonItem>
);

// Hook for fetching profile-dependent data
function useProfileDependentEffects(currentProfile, isGlobal) {
  const dispatch = useDispatch();
  const isNative = Capacitor.isNativePlatform();

  const [results, setResults] = useState({
    workshops: [],
    stories: [],
    prompts: [],
    location: null,
  });

  const fetchPrompts = async () => {
    try {
      const res = await dispatch(getPrompts());
      checkResult(res, ({ prompts }) => {
        const sorted = [...prompts].sort((a,b)=>new Date(b.updated)-new Date(a.updated));
        setResults(prev => ({ ...prev, prompts: sorted }));
      });
    } catch (err) { console.error("Failed fetching prompts:", err); }
  };

  const fetchStories = async () => {
    try {
      const res = await dispatch(fetchRecommendedStories());
      checkResult(res, ({ stories }) => setResults(prev => ({ ...prev, stories })));
    } catch (err) { console.error("Failed fetching stories:", err); }
  };

  const fetchWorkshops = async () => {
    if (!currentProfile) return;
    try {
      const res = await dispatch(findWorkshopGroups({
        location: currentProfile.location,
        radius: 50,
        global: isGlobal
      }));
      checkResult(res, ({ groups }) => {
        const sorted = [...groups].sort((a,b)=>new Date(b.updated)-new Date(a.updated));
        setResults(prev => ({ ...prev, workshops: sorted || [] }));
      });
    } catch (err) { console.error("Failed fetching workshops:", err); }
  };

  const fetchLocation = () => {
    if (!isGlobal) return;
    if (isNative) requestLocation();
    else navigator.geolocation.getCurrentPosition(
      pos => setResults(prev => ({ ...prev, location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } })),
      err => console.error("Location error:", err)
    );
  };

  useEffect(() => {
    if (!currentProfile) return;
    fetchPrompts();
    fetchStories();
    fetchWorkshops();
    fetchLocation();
  }, [currentProfile, isGlobal]);

  return results;
}

// Main HomeContainer Component
function HomeContainer() {
  const [isGlobal, setIsGlobal] = useState(true);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const router = useIonRouter();
  const { seo, setSeo } = useContext(Context);

  const currentProfile = useSelector(state => state.users.currentProfile);
  const collections = useSelector(state => state.books.collections);

  const { workshops, stories, prompts } = useProfileDependentEffects(currentProfile, isGlobal);
  const [whatsHappeningList, setWhatsHappeningList] = useState([]);

  const sortedWorkshops = useMemo(() => [...workshops].sort((a,b) => a.title.localeCompare(b.title)), [workshops]);
  const filteredPrompts = useMemo(() => prompts?.filter(p => p?.story?.data) || [], [prompts]);

  // Update “What’s Happening” section
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
 <IonContent className='pt-12' style={{'--background': Enviroment.palette.cream }}>
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
            {sortedWorkshops.map(workshop => (
              <WorkshopItem key={workshop.id} item={workshop} router={router} />
            ))}
            </div>
          {/* </IonList> */}

          {/* Prompts */}
          <SectionHeader title="Writing Prompts for you" />
          {/* <div className="flex flex-row gap-3"> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {filteredPrompts.length
              ? filteredPrompts.map(({ story }) => <StoryItem key={story.id} page={story} />)
              : [1,2,3,4].map(i => <div key={i} className="skeleton min-w-[20em] min-h-[20em]" />)
            }
          </div>
        </div>
      </IonContent>
    </ErrorBoundary>
  );
}

export default HomeContainer;