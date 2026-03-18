import React, { useState, useLayoutEffect, useContext,useEffect } from 'react';
import '../App.css';
import { useSelector, useDispatch } from 'react-redux';
import { createStory, fetchRecommendedStories } from '../actions/StoryActions';
import ExploreList from '../components/collection/ExploreList.jsx';

import checkResult from '../core/checkResult.js';
import ErrorBoundary from '../ErrorBoundary.jsx';
import {IonText, IonItem, useIonRouter, IonContent, IonList} from '@ionic/react';

import { fetchYourWorkshops } from '../actions/WorkshopActions.jsx';
import ProfileCircle from '../components/profile/ProfileCircle.jsx';
import truncate from 'html-truncate';
import { PageType } from '../core/constants.js';
import Paths from '../core/paths.js';
import debounce from '../core/debounce.js';
import { sendGAEvent } from '../core/ga4.js';
import { setEditingPage, setPageInView } from '../actions/PageActions.jsx';
import { useDialog } from '../domain/usecases/useDialog.jsx';
function DashboardContainer() {

  const currentProfile = useSelector(state=>state.users.currentProfile)
  // const { setSeo, seo ,isNotPhone} = useContext(Context);
  const router = useIonRouter()
  const dispatch = useDispatch();
   const collectionsRaw = useSelector(state => state.books.collections) ?? [];

const collections = collectionsRaw
  .slice() // safer than spread in this context
  .sort((a, b) => new Date(b.updated) - new Date(a.updated));
  const [results,setResults]=useState([])
  const [workshop,setWorkshop]=useState(null)
  const {openDialog,closeDialog,resetDialog}=useDialog()
  const recommendedCols= useSelector(state => state.books.recommendedCols);
  const stories = useSelector(state => state.pages.pagesInView ?? []);
  const recommendedStories = useSelector(state => state.pages.recommendedStories ?? []);

  useEffect(()=>{
    fetchWorkshops()
  },[currentProfile])
useEffect(() => {
  try {
    if (results.length > 1) {
      const group = results[1]; // same as skipping first
console.log("EFC",group.storyIdList)
      const story = [...group.storyIdList]
        .filter(a => a.story.type === PageType.text)
        .sort((a, b) => a.story.updated - b.story.updated)
console.log("EFE",story)
      setWorkshop({ group, story });
    }
  } catch (err) {
    console.log(err);
  }
}, [results]);
const openYourWorkshops=()=>{

    openDialog({
    title: null,
  scrollY: true,
  breakpoint: 1,


    disagree:()=>resetDialog(),
    text: (<div className=''>
      <h4 className='text-[1rem] mt-8 mb-4 lora-bold text-soft'>Workshops</h4>
        <IonList style={{backgroundColor:"#f4f4e0"}}>
          <div className='bg-cream overflow-y-scroll max-h-[80em]'> 
        {results.map(workshop=>{
          return<li className=' my-2 bg-cream' onClick={()=>{
            router.push(Paths.collection.createRoute(workshop.id))
            resetDialog()
          }}><div className='p-4 w-[100%] border-1 border border-soft rounded-xl'><h4>{workshop.title}</h4></div></li>
        })}
        </div>
        </IonList>

      
    </div>
    )})
  
}
const openPages=()=>{
   openDialog({
    title: null,
  scrollY: true,
  breakpoint: 1,


    disagree:()=>resetDialog(),
    text: (<div className=''>
      <h4 className='text-[1rem] mt-8 mb-4 lora-bold text-soft'>Pages</h4>
        <IonList style={{backgroundColor:"#f4f4e0"}}>
          <div className='bg-cream overflow-y-scroll max-h-[80em]'> 
        {currentProfile.stories.map(story=>{
          return<li className=' my-2 bg-cream' onClick={()=>{
            router.push(Paths.page.createRoute(story.id))
            resetDialog()
          }}><div className='p-4 w-[100%] border-1 border border-soft rounded-xl'><h4>{story.title}</h4></div></li>
        })}
        </div>
        </IonList>

      
    </div>
    )})}
            
  const fetchWorkshops = async () => {
    if (!currentProfile) return;
    try {
      dispatch(fetchYourWorkshops()).then(res=>{
      checkResult(res, ({ groups }) => {
      
        console.log("GRGRR",groups)
        setResults(groups)
      })})
    } catch (err) {
      console.error("Failed fetching workshops:", err);
    }}
    const ClickWriteAStory = debounce(() => {
    if (currentProfile?.id) {
      sendGAEvent("Create", "Write a Story", "Click Write Story");
      dispatch(createStory({
        profileId: currentProfile.id,
        privacy: true,
        type: PageType.text,
        title: "Unititled",
        commentable: true
      })).then(res => checkResult(res, payload => {
        if (payload.story) {
          dispatch(setEditingPage({ page: payload.story }));
          dispatch(setPageInView({ page: payload.story }));
        router.push(Paths.editPage.createRoute(payload.story.id),'forward', 'push');
        }else{
          windowl.alert("COULD NOT CREATE STORY")
        }
      },err=>{
        setErrorLocal(err.message)
      }));
    }
  }, 5);
function WorkshopItem({workshop}){
  return( <div onClick={()=>{router.push(Paths.collection.createRoute(workshop.group.id),"forward")}}className='border rounded-xl border-1 p-4 border-soft'>
                  <h1 className='text-[1.4em] py-2 lora-medium'>{workshop.group.title}</h1>
                  <h6 className='text-soft py-2'>Most Recent</h6>
                  {workshop.story && <div className='py-2'>{workshop?.story?.title}</div>}
                  {workshop.story && workshop.story.type==PageType.text && <div  className="bg-softBlue bg-opacity-30 p-2 rounded-xl"dangerouslySetInnerHTML={{__html:truncate(workshop.story.data,100,{})}}/>
                    }
                    {/* {<div dangerouslySetInnerHTML={{__html:truncate(workshop.story.data,20,{})/>}</div> */}
                  <div className='flex flex-row py-4 '>{
                    workshop.group.roles.map(role=><ProfileCircle profile={role.profile} includeUsername={false}/>)
}</div>
                </div>)
}
    function StoryItem({story}){
      return<div onClick={()=>router.push(Paths.page.createRoute(story.id))} className='border border-1 border-soft p-4 rounded-xl'>
    <div className='flex flex-col gap-2'>
       <h4 className='text-[1.2em]'>{story.title}</h4>
  <h6 className='text-[1em]'>{story.status}</h6>
  </div></div>
    }
  return (
        <ErrorBoundary>
{/* <IonContent fullscreen> */}

          <div className='bg-cream h-[100%] p-4'>
<div className='text-left'>
            <div className=' '>
              <h4 className='text-xl lora-medium'>Saves</h4>
            </div>
            <div>
              <h4 className='text-xl lora-medium py-4'>Your Spaces</h4>
              <div className='flex flex-row gap-4 overflow-scroll'>
              <div  onClick={()=>openPages()}className='border-1 border border-soft rounded-lg p-4 min-h-24 min-w-24 relative'><div className='absolute top-2 left-2 '>Pages</div></div>
                 <div className='border-1 border border-soft rounded-lg p-4 min-h-24 min-w-24 relative'><div className='absolute  top-2 left-2 '>Collections</div></div>
              <div onClick={()=>router.push(Paths.collection.createRoute(currentProfile.profileToCollections[0].collectionId))}className='border-1 border border-soft rounded-lg p-4 min-h-24 min-w-24 relative'><div className='absolute  top-2 left-2 '>Archive</div></div>
              <div className='border-1 border border-soft rounded-lg p-4 min-h-24 min-w-24 relative'><div className='absolute top-2 left-2 '>Communites</div></div>
              </div>
            </div>
            <div className='flex flex-col justify-between px-4 mt-8'>
              <div className='flex flex-row justify-between px-4 pb-4 mt-8'><h4 className='text-xl lora-medium'>Workshop</h4><h5 onClick={()=>{openYourWorkshops()}}>Your workshops {"->"} </h5></div>
              {workshop&&<WorkshopItem workshop={workshop}/>}
              <div className='border border-solf border p-4 '></div>
            </div>
            <div>
              <div className='flex flex-row justify-between'><h4 className='text-xl lora-medium '>Recent Pages</h4><h4 className='my-auto' onClick={()=>ClickWriteAStory()}>Write Something new+</h4></div>
              <div className='flex flex-col gap-4 py-4'>
                {[...(currentProfile.stories ?? [])]
  .sort((a, b) => a.updated - b.updated)
  .slice(0, 3)
  .map(story => <StoryItem story={story}/>)}
              </div>
            </div>
            </div>
            {/* Explore List */}
            <ExploreList items={collections} />
          </div>
   
   {/* </IonContent> */}
      </ErrorBoundary>
  );
}

export default DashboardContainer;
