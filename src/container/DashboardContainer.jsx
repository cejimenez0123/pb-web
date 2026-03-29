import React, { useState, useLayoutEffect, useContext,useEffect } from 'react';
import '../App.css';
import { useSelector, useDispatch } from 'react-redux';
import { createStory, fetchRecommendedStories } from '../actions/StoryActions';
import ExploreList from '../components/collection/ExploreList.jsx';
import arrowToRight from '../images/icons/arrowToRight.svg'
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
import CreateCollectionForm from '../components/collection/CreateCollectionForm.jsx';
import Enviroment from '../core/Enviroment.js';
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
function DashboardContainer() {

  const currentProfile = useSelector(state=>state.users.currentProfile)

  const router = useIonRouter()
  const dispatch = useDispatch();
   const collectionsRaw = useSelector(state => state.books.collections) ?? [];

const collections = collectionsRaw
  .slice() // safer than spread in this context
  .sort((a, b) => new Date(b.updated) - new Date(a.updated));
  const [results,setResults]=useState([])
  const [workshop,setWorkshop]=useState(null)
  const {openDialog,dialog,closeDialog,resetDialog}=useDialog()
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
  scrollY: false,
  breakpoint: 1,


    disagree:()=>resetDialog(),
    text: (<div className=''>
      <h4 className='text-[1rem] mt-8 mb-4 lora-bold text-soft'>Workshops</h4>
        <IonList style={{backgroundColor:Enviroment.palette.cream}}>
          <div className='bg-cream overflow-y-scroll max-h-[30em]'> 
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
const openCollections=()=>{
 openDialog({
    title: null,
  scrollY: false,
  breakpoint: 1,


    disagree:()=>resetDialog(),
    text: (<div className=''>
      <h4 className='text-[1rem] mt-8 mb-4 lora-bold text-soft'>Collections</h4>
        <IonList style={{backgroundColor:Enviroment.palette.cream}}>
          <div className='bg-cream overflow-y-scroll max-h-[30em]'> 
        {currentProfile.collections.map(story=>{
          return<li className=' my-2 bg-cream' onClick={()=>{
            router.push(Paths.collection.createRoute(story.id))
            resetDialog()
          }}><div className='p-4 w-[100%] border-1 border border-soft rounded-xl'><h4>{story.title}</h4></div></li>
        })}
        </div>
        </IonList>

      
    </div>
    )})}
    const openCommunities=()=>{
      const communities = currentProfile.collections.filter(col=>col.type=="library")
 openDialog({
    title: null,
  scrollY: false,
  breakpoint: 1,


    disagree:()=>resetDialog(),
    text: (<div className=''>
      <h4 className='text-[1rem] mt-8 mb-4 lora-bold text-soft'>Collections</h4>
        <IonList style={{backgroundColor:Enviroment.palette.cream}}>
          <div className='bg-cream overflow-y-scroll max-h-[30em]'> 
        {communities.map(story=>{
          return<li className=' my-2 bg-cream' onClick={()=>{
            router.push(Paths.collection.createRoute(story.id))
            resetDialog()
          }}><div className='p-4 w-[100%] border-1 border border-soft rounded-xl'><h4>{story.title}</h4></div></li>
        })}
        </div>
        </IonList>

      
    </div>
    )})}
const openPages=()=>{
   openDialog({
    title: null,
  scrollY: false,
  breakpoint: 1,


    disagree:()=>resetDialog(),
    text: (<div className=''>
      {/* <h5>Pages</h5> */}
      <h4 className='text-[1rem] mt-8 mb-4 lora-bold text-soft'>Pages</h4>
        <IonList style={{backgroundColor:Enviroment.palette.cream}}>
          <div className='bg-cream overflow-y-scroll max-h-[30em]'> 
        {currentProfile.stories.map(story=>{
          return<li className=' my-2 bg-cream' onClick={()=>{
            router.push(Paths.page.createRoute(story.id))
            resetDialog()
          }}><div className='p-4 w-[100%] border-1 border border-soft rounded-xl'><h4>{story?.title?.length>0?story.title:"Untitled"}</h4></div></li>
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
       <h4 className='text-[1.2em]'>{story.title.length>0?story.title:"Untitled"}</h4>
  <h6 className='text-[1em]'>{story.status}</h6>
  </div></div>
    }

  const ClickCreateACollection = () => {
     try {
    sendGAEvent("create_collection_open", {
      area: "collections",
      modal_type: "create_collection",
      user_id: currentProfile?.id || null, // optional, if you want to track
    });
  } catch (e) {
    console.warn("GA event failed", e);
  }

openDialog({
...dialog,
disagree:null,
scrollY: false,
  text: <CreateCollectionForm onClose={resetDialog} />,
  disagreeText: "Close", // optional button
  onClose: closeDialog,
  breakpoint: 1, // if you want a half-sheet style
});

  };
   let saves = [
  ...(
    currentProfile?.profileToCollections?.[1]?.collection?.childCollections?.map(col => col.childCollection)
    || []
  ),
  ...(
    currentProfile?.profileToCollections?.[1]?.collection?.storyIdList?.map(str => str.story)
    || []
  )
].slice(0, 3);  return (
        <ErrorBoundary>

          <div className='bg-cream h-[100%]'>
<div className='text-left'>
            <div className=' '>
                               <div className='flex  bg-cream h-[100%] pt-8 flex-row justify-between'>
                        

          
                  
                    </div>
                    <div className='mx-auto'>
                      <div className="flex flex-row mx-auto max-w-[40em] flex-wrap my-4 justify-center gap-4">
        <ButtonWrapper
          onClick={ClickWriteAStory}
          className="bg-soft hover:bg-emerald-500  border-emerald-700 border-opacity-80 text-white rounded-xl h-[3rem] w-[8.5rem]"
        >
          <IonText className='text-[1.2em]'><span className='pb-2'>Write</span><span> Something</span></IonText>
        </ButtonWrapper>
        <ButtonWrapper
          onClick={ClickCreateACollection}
          className="bg-soft hover:bg-emerald-500  border-emerald-700 border-opacity-80 text-white rounded-xl h-[3rem] w-[8.5rem]"
        >
          <IonText className="text-white text-[1.2em]"><span className='pb-2'>Create</span><span> Collection</span></IonText>
        </ButtonWrapper>
      </div>
</div>
      {/* Row 2: Join a Workshop */}
      <div className="flex justify-center md:justify-start w-full">
        <ButtonWrapper
          onClick={() => router.push(Paths.workshop.reader())}
          className="font-bold mx-auto bg-blueSea hover:bg-opacity-70 border-blueSea border-opacity-80 mx-4 rounded-xl h-[3rem] w-[90vw] sm:w-[21rem]"
        >
          <IonText className="text-white text-[1.2em]">Join a Workshop</IonText>
        </ButtonWrapper>
      </div>
      <div className='flex flex-row justify-between max-h-24'>
              <h4 className='text-xl pt-8 mx-4 lora-medium pb-4'>Saves</h4>
              <img src={arrowToRight} onClick={()=>router.push(Paths.collection.createRoute(currentProfile.profileToCollections[1].collectionId))}className='max-w-8 mt-auto mb-4 max-h-8 mx-4' />
              </div>
              <div className='flex mx-4 flex-col gap-4'>
                {saves.map(item=>{
                  
                  return<div onClick={()=>item.data?router.push(Paths.page.createRoute(item.id),"forward"):router.push(Paths.collection.createRoute(item.id),"forward")}className='border-1 border border-soft rounded-xl p-4'><div className='flex flex-row gap-4 '><h6>{item.type} ·</h6>
                  <h5 className='text-[1.2em]'>{item.title}</h5></div></div>
                })}
              </div>
            </div>
            <div>
              <h4 className='text-xl lora-medium mx-4 py-4'>Your Spaces</h4>
              <div className='flex flex-row px-4 gap-4 overflow-scroll'>
              <div  onClick={()=>openPages()}className='border-1 border border-soft rounded-lg p-4 min-h-24 min-w-24 relative'><div className='absolute top-2 left-2 '>Pages</div></div>
                 <div
                 onClick={()=>openCollections()}
                 className='border-1 border border-soft rounded-lg p-4 min-h-24 min-w-24 relative'><div className='absolute  top-2 left-2 '>Collections</div></div>
              <div onClick={()=>router.push(Paths.collection.createRoute(currentProfile.profileToCollections[0].collectionId))}className='border-1 border border-soft rounded-lg p-4 min-h-24 min-w-24 relative'><div className='absolute  top-2 left-2 '>Archive</div></div>
              <div  onClick={()=>openCommunities()}className='border-1 border border-soft rounded-lg p-4 min-h-24 min-w-24 relative'>
                <div className='absolute top-2 left-2 '>Communites</div></div>
              </div>
            </div>
            <div className='flex flex-col justify-between mt-8'>
              <div className='flex flex-row justify-between px-4 pb-4 mt-8'
              ><h4 className='text-xl lora-medium'>Workshop</h4><h5 onClick={()=>{openYourWorkshops()}}>Your workshops {"->"} </h5></div>
              {workshop&&<div className='px-4'><WorkshopItem workshop={workshop}/></div>}
              <div className=' p-4 '></div>
            </div>
            <div  className='w-fit mx-auto '>
              <div className='flex flex-row justify-between'><h4 className='text-xl mx-4 lora-medium pb-4  '>Recent Pages</h4><h4 className='my-auto mx-4' onClick={()=>ClickWriteAStory()}>Write Something new+</h4></div>
              {/* <div className='flex flex-col gap-4 px-4 py-4'> */}
              <div className="grid grid-cols-1 px-4 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {[...(currentProfile?.stories || [])]
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
