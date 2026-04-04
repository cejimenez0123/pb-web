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
import { Capacitor } from '@capacitor/core';
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
function DashboardEmbed() {

  const currentProfile = useSelector(state=>state.users.currentProfile)

  const router = useIonRouter()
  const dispatch = useDispatch();
   const collectionsRaw = useSelector(state => state.books.collections) ?? [];

const collections = collectionsRaw
  .slice() // safer than spread in this context
  .sort((a, b) => new Date(b.updated) - new Date(a.updated));
  const [results,setResults]=useState([])
  const [workshop,setWorkshop]=useState(null)
  const [saves,setSaved]=useState([])
  const {openDialog,dialog,closeDialog,resetDialog}=useDialog()
  const isNative = Capacitor.isNativePlatform()

useEffect(()=>{
 fetchWorkshops()
},[])

useEffect(() => {
  try {
    if (results?.length > 1) {
      const group = results[1]; // same as skipping first
      const story = [...group.storyIdList]
        .filter(a => a?.story?.type === PageType.text)
        .sort((a, b) => a?.story?.updated - b?.story?.updated)
      setWorkshop({ group, story });
    }
  } catch (err) {
    console.log(err);
  }
 
   
  
}, [results]);
const openYourWorkshops=()=>{

    openDialog({
    title: "Your Workshops",
  scrollY: false,
  breakpoint: 1,
  height:90,

    disagree:()=>resetDialog(),
    text: (<div className=''>

      <div className={`bg-cream overflow-y-auto border  ounded-xl border-soft px-4 ${isNative? "h-[36rem] sm:h-[40rem] md:h-[48rem] lg:h-[50rem]":"h-[30rem] sm:h-[40rem] md:h-[48rem] lg:h-[50rem]"}`}> 
        <IonList 
         style={{
          backgroundColor: Enviroment.palette.cream,
          paddingTop: "0.5em"
        }}>
           
       
        {results.map(workshop=>{
          return<li className=' my-2 bg-cream' onClick={()=>{
            router.push(Paths.collection.createRoute(workshop.id))
            resetDialog()
          }}><div className='p-4 w-[100%] border-1 border border-soft  rounded-xl'><h4 className='text-[.9rem]'>{workshop.title.length ? workshop.title : "Untitled"}</h4></div></li>
        })}
      
        </IonList>
</div>
      
    </div>
    )})
  
}
const openCollections=()=>{
 openDialog({
    title: "Collections",
  scrollY: false,
  breakpoint: 1,
  height:90,

    disagree:()=>resetDialog(),
    text: (<div className=''>
            {/* <div className={`bg-cream overflow-y-auto ${isNative? "h-[36rem]":"h-[30rem]"}`}>  */}
        <IonList 
         style={{
          backgroundColor: Enviroment.palette.cream,
         
        }}>
         
        {currentProfile.collections.map(story=>{
          return<li className=' my-2 bg-cream' onClick={()=>{
            router.push(Paths.collection.createRoute(story.id))
            resetDialog()
          }}><div className='p-4 w-[100%] border-1 border  border-soft rounded-xl'><h4 className='text-[.9rem]'>{story.title}</h4></div></li>
        })}
   
        </IonList>

           {/* </div> */}
    </div>
    )})}
    const openCommunities=()=>{
      const communities = currentProfile.collections.filter(col=>col.type=="library")
 openDialog({
    title: "Communities",
  scrollY: false,
  breakpoint: 1,
  height:90,

    disagree:()=>resetDialog(),
    text: (<div className=''>
        {/* <div className={`bg-cream overflow-y-scroll ${isNative? "h-[35rem]":"h-[30rem]"}`}>  */}
  
        <IonList style={{backgroundColor:Enviroment.palette.cream}}>
        
        {communities.map(story=>{
          return<li className=' my-2 bg-cream' onClick={()=>{
            router.push(Paths.collection.createRoute(story.id))
            resetDialog()
          }}><div className='p-4 w-[100%] border-1 border border-soft rounded-xl'><h4 className='text-[.9rem]'>{story.title.length?story.title:
        "Untitled"}</h4></div></li>
        })}
    
        </IonList>
    </div>
      
  
    )})}
const openPages=()=>{
   openDialog({
    title: "Pages",
  scrollY: false,
  height:90,
 
    text: (<div className=''>
               
        <IonList 
         style={{
          backgroundColor: Enviroment.palette.cream,
         
        }}>
        {currentProfile.stories.map(story=>{
          return<li className=' my-2 bg-cream' onClick={()=>{
            router.push(Paths.page.createRoute(story.id))
            resetDialog()
          }}><div className='p-4 w-[100%] border-11 border border-soft rounded-xl'><h4 className='text-[.9rem]'>{story?.title?.length>0?story.title:"Untitled"}</h4></div></li>
        })}
        
        </IonList>

      
    </div>
    )})}
    const [homeCol,setHomeCol]=useState(null)
    const [archiveCol,setArchiveCol]=useState(null)
              useEffect(() => {
                
                if (currentProfile?.profileToCollections) {
                  let home = currentProfile.profileToCollections.find(pTc => pTc.type === "home")?.collection || null;
                  setHomeCol(home);
            
                  let archive = currentProfile.profileToCollections.find(pTc => pTc.type === "archive")?.collection || null;
                  setArchiveCol(archive);
                }
            
              }, [currentProfile]);
  const fetchWorkshops = async () => {
    if (!currentProfile) return;
    try {
      dispatch(fetchYourWorkshops()).then(res=>{
      checkResult(res, ({ groups }) => {
      
    
        setResults(groups||[])
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
useEffect(()=>{
  if(homeCol){
 let save = [...homeCol?.childCollections.map(c=>c.childCollection),...homeCol?.storyIdList.map(s=>s.story)].slice(0,4)
 setSaved(save)
  }
},[homeCol])
  const ClickCreateACollection = () => {
     try {
    sendGAEvent("create_collection_open", {
      area: "collections",
      modal_type: "create_collection",
      user_id: currentProfile?.id || null, // optional, if you want to track
    });
  } catch (e) {
    // console.warn("GA event failed", e);
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
  

 return (
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
       onClick={() => router.push(Paths.workshop.reader(), "forward")}
          className="font-bold mx-auto bg-blueSea hover:bg-opacity-70 border-blueSea border-opacity-80 mx-4 rounded-xl h-[3rem] w-[90vw] sm:w-[21rem]"
        >
          <IonText className="text-white text-[1.2em]">Join a Workshop</IonText>
        </ButtonWrapper>
      </div>
      <div className='flex flex-row justify-between max-h-24'>
              <h4 className='text-xl pt-8 mx-4 lora-medium pb-4'>Saves</h4>
              <img src={arrowToRight} onClick={()=>homeCol && router.push(Paths.collection.createRoute(homeCol.id))}className='max-w-8 mt-auto mb-4 max-h-8 mx-4' />
              </div>
              <div className='flex mx-4 flex-col gap-4'>
               {saves.map(item=>{ 
                return (
  <div
    onClick={() => {
      if (!item) return;
      item?.data
        ? router.push(Paths.page.createRoute(item.id), "forward")
        : router.push(Paths.collection.createRoute(item.id), "forward");
    }}
    className="border border-soft rounded-xl p-4"
  >
    {item ? (
      // ✅ REAL CONTENT
      <div className="flex flex-row gap-4 items-center">
        <h6>{item.type} ·</h6>
        <h5 className="text-[1.2em]">{item.title}</h5>
      </div>
    ) : (
      // ✅ SKELETON STATE
      <div className="flex flex-row gap-4 items-center animate-pulse">
        <div className="h-4 w-16 bg-gray-300 rounded-md" />
        <div className="h-5 w-40 bg-gray-300 rounded-md" />
      </div>
    )}
  </div>
);
                  // console.log("SAVES",item)
                  // return<div onClick={()=>item?.data?router.push(Paths.page.createRoute(item.id),"forward"):router.push(Paths.collection.createRoute(item.id),"forward")}className='border-1 border border-soft rounded-xl p-4'><div className='flex flex-row gap-4 '><h6>{item?.type} ·</h6>
                  // <h5 className='text-[1.2em]'>{item?.title}</h5></div></div>
                })}
                
              </div>
            </div>
            <div>
              
              {/* <h4 className='text-xl lora-medium mx-4 py-4'>Your Spaces</h4> */}
              <div>
  <h4 className='text-xl lora-medium mx-4 py-4'>Your Spaces</h4>

  <div className='flex flex-row px-4 gap-4 overflow-x-auto'>
    
    {[
      { label: "Pages", onClick: openPages },
      { label: "Collections", onClick: openCollections },
      { label: "Archive", onClick: () => archiveCol && router.push(Paths.collection.createRoute(archiveCol.id) )},
      { label: "Communities", onClick: openCommunities }
    ].map((item) => (
      
      <div
        key={item.label}
        onClick={item.onClick}
        className="
          flex-shrink-0
          hover:bg-softBlue
          min-w-36 sm:w-36 md:w-44 lg:w-44 
          aspect-square                
          rounded-2xl
          border border-soft
          bg-white/60
          backdrop-blur-sm
          shadow-sm
          active:scale-95
          transition-all
          flex items-end
          p-3 relative
        "
      >
           <span className="
          absolute top-3 left-3
          lora-medium
          text-sm md:text-base
        ">
          {item.label}
        </span>
      </div>

    ))}

  </div>
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
  .slice(0, 4)
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

export default DashboardEmbed
