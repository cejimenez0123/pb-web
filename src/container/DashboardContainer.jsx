import React, { useState,useEffect } from 'react';
import '../App.css';
import { useSelector, useDispatch } from 'react-redux';
import { createStory, getMyStories } from '../actions/StoryActions';
import ExploreList from '../components/collection/ExploreList.jsx';
import arrowToRight from '../images/icons/arrowToRight.svg'
import checkResult from '../core/checkResult.js';
import ErrorBoundary from '../ErrorBoundary.jsx';
import {IonText, useIonRouter,  IonList} from '@ionic/react';

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
import { getMyCollections } from '../actions/CollectionActions.js';
import StoryDashboardItem from '../components/StoryDashboardItem.jsx';
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
const WRAP = "max-w-2xl mx-auto px-4";
const SECTION_GAP = "pt-10";  // applied to each section's root div
const SECTION_HEADING = "text-xl lora-medium";          // text style only
const SECTION_HEADER_ROW = "flex items-center justify-between py-4"; // row layout
const LIST_WRAP = "flex flex-col gap-4";  // Saves
// Recent Pages grid already has px-4 — move it to the section wrapper
const TILE = "w-36 md:w-44 flex-shrink-0";
const ACTION_ROW = "flex flex-col items-center gap-4 w-full";
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
     const [homeCol,setHomeCol]=useState(null)
    const [archiveCol,setArchiveCol]=useState(null)
const myStories = useSelector(state=>state.pages.myPages.filter(t=>t))
 const myCollections = useSelector(state=>state.books.myCollections.filter(t=>t))
useEffect(()=>{
 fetchWorkshops()
},[])
useEffect(()=>{
  if(currentProfile){
  dispatch(getMyCollections())
  dispatch(getMyStories())
  }

},[currentProfile])
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

      <div className={`bg-cream overflow-y-auto  px-4 ${isNative? "h-[36rem] sm:h-[40rem] md:h-[48rem] lg:h-[50rem]":"h-[30rem] sm:h-[40rem] md:h-[48rem] lg:h-[50rem]"}`}> 
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
         
        {myCollections.length==0?<div ><h3>No Collections</h3>
        <h4 onClick={()=>router.push(Paths.discovery)}>Click Here</h4></div>:myCollections.map(story=>{
          return<li className=' my-2 bg-cream' onClick={()=>{
            router.push(Paths.collection.createRoute(story.id))
            resetDialog()
          }}><div className='p-4 w-[100%] border-1 border  border-soft rounded-xl'><h4 className='text-[.9rem]'>{story.title}</h4></div></li>
        })}
   
        </IonList>

          
    </div>
    )})}
    const openCommunities=()=>{
      console.log(myCollections)
     const communities = myCollections?.filter(col=>col.type=="library")||[]
 openDialog({
    title: "Communities",
  scrollY: false,
  breakpoint: 1,
  height:90,

    disagree:()=>resetDialog(),
    text: (<div className=''>
    
  
        <IonList style={{backgroundColor:Enviroment.palette.cream}}>
        
        {communities.map(story=>{
          return<li className=' my-2 bg-cream' onClick={()=>{
            router.push(Paths.collection.createRoute(story.id))
            resetDialog()
          }}><div className='p-4 w-[100%] border-1 border border-soft rounded-xl'><h4 className='text-[.9rem]'>{story.title.length?story.title:
        "Untitled"}</h4></div></li>
        })||null}
    
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
        {myStories.length==0?<div className='text-center p-8'><h2 >No Posts</h2>
        <h2 onClick={()=>router.push(Paths.discovery)}>Click here</h2></div>:myStories.map(story=>{
          return<li className=' my-2 bg-cream' onClick={()=>{
            router.push(Paths.page.createRoute(story.id))
            resetDialog()
          }}><div className='p-4 w-[100%] border-11 border border-soft rounded-xl'><h4 className='text-[.9rem]'>{story?.title?.length>0?story.title:"Untitled"}</h4></div></li>
        })}
        
        </IonList>

      
    </div>
    )})}
 
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
          // dispatch(setEditingPage({ page: payload.story }));
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

  return( <div onClick={()=>{router.push(Paths.collection.createRoute(workshop.group.id),"forward")}}

  className={`border rounded-xl  bg-base-soft  hover:bg-card-highlight shadow-md  border-1 p-4 border-blue `}>

                  <h1 className='text-[1.4em] py-2 text-text-inverse '>{workshop.group.title}</h1>
                  <h6 className='text-soft  text-text-inverse py-2'>Most Recent</h6>
                  {workshop.story && <div className='py-2  text-text-inverse'>{workshop?.story?.title}</div>}
                  {workshop.story && workshop.story.type==PageType.text && <div  className=" text-text-inversep-2 rounded-xl"dangerouslySetInnerHTML={{__html:truncate(workshop.story.data,100,{})}}/>
                    }
                    {/* {<div dangerouslySetInnerHTML={{__html:truncate(workshop.story.data,20,{})/>}</div> */}
                  <div className='flex flex-row  text-text-inverse py-4 '>{
                    workshop.group.roles.map(role=><ProfileCircle profile={role.profile} includeUsername={false}/>)
}</div>
                </div>)
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

          
            
                      <div className="flex flex-row mx-auto max-w-[40em] flex-wrap my-4 justify-center gap-4">
        <ButtonWrapper
          onClick={ClickWriteAStory}
          className="bg-button-secondary-bg hover:bg-button-secondary-hover  border-button-secondary-bg  border-opacity-80 text-white rounded-xl h-[3rem] w-[8.5rem]"
        >
          <IonText className='text-[1.2em]'><span className='pb-2'>Write</span><span> Something</span></IonText>
        </ButtonWrapper>
        <ButtonWrapper
          onClick={ClickCreateACollection}
          className="bg-button-secondary-bg hover:bg-button-secondary-hover  border-button-secondary-bg  text-white rounded-xl h-[3rem] w-[8.5rem]"
        >
          <IonText className="text-white text-[1.2em]"><span className='pb-2'>Create</span><span> Collection</span></IonText>
        </ButtonWrapper>
      </div>

      {/* Row 2: Join a Workshop */}
      <div className="flex justify-center md:justify-start w-full">

        <ButtonWrapper
       onClick={() => router.push(Paths.workshop.reader(), "forward")}
          className="font-bold mx-auto bg-button-primary-bg hover:bg-opacity-70 border-blueSea border-opacity-80 mx-4 rounded-full h-[3rem] w-[90vw] sm:w-[21rem]"
        >
          <IonText className="text-button-primary-text text-[1.2em]">Join a Workshop</IonText>
        </ButtonWrapper>
      </div>
      <div>
     <div className={`${WRAP} ${SECTION_GAP}`}>
  <div className={SECTION_HEADER_ROW}>
    <h4 className={SECTION_HEADING}>Saves</h4>

           

              <img src={arrowToRight} onClick={()=>homeCol && router.push(Paths.collection.createRoute(homeCol.id))}className='max-w-8 mt-auto mb-4 max-h-8 mx-4' />
              </div>
              <div className='flex mx-4 flex-col gap-4'>
               {saves.length==0?<div><h2>Bookmark things you want to see often</h2></div>:saves.map(item=>{ 
                return (
  <div
    onClick={() => {
      if (!item) return;
      item?.data
        ? router.push(Paths.page.createRoute(item.id), "forward")
        : router.push(Paths.collection.createRoute(item.id), "forward");
    }}
  
    className={`border shadow-md border-1 rounded-full border-purple bg-base-bg  p-4`}
  >
    
    {/* {Enviroment.palette.accent.} */}
    {item ? (
      // ✅ REAL CONTENT
      <div className="flex flex-row gap-4 px-4 items-center">
        <h6 className='text-text-primary'>{item.type} ·</h6>
        {/* {Enviroment.palette.base.} */}
        <h5 className="text-[1.2em] text-text-primary" >{item.title}</h5>
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

                    })}
             
  </div>
</div>

              
              {/* <h4 className='text-xl lora-medium mx-4 py-4'>Your Spaces</h4> */}
              {/* <div> */}
            
                <div className={`${WRAP} ${SECTION_GAP}`}>
  <div className={SECTION_HEADER_ROW}>
    <h4 className={SECTION_HEADING}>Your Spaces</h4>

</div>
  {/* content */}
{/* </div>
  <h4 className='text-xl lora-medium mx-4 pb-4 pt-8'></h4> */}

  <div className='flex flex-row px-4 gap-4 overflow-x-auto'>
    
    {[
      { label: "Pages", onClick: openPages },
      { label: "Collections", onClick: openCollections },
      { label: "Archive", onClick: () => archiveCol && router.push(Paths.collection.createRoute(archiveCol.id) )},
      { label: "Communities", onClick: openCommunities }
    ].map((item) => (
      
      <div
      // {Enviroment.palette.accent.blue}
        key={item.label}
        onClick={item.onClick}
        className={`
          flex-shrink-0
          
          min-w-36 sm:w-36 md:w-44 lg:w-44 
          aspect-square                
          rounded-2xl
          border border-soft
          
          bg-base-bg
  bg-button
          backdrop-blur-sm
         shadow-md 
          active:scale-95
          transition-all
          flex items-end
          p-3 relative
        `}
      >

           <h4 className={`
          absolute top-3 left-3
       
          text-[1.4em] text-[${Enviroment.palette.text.brand}]
        `}>
    {/* {Enviroment.palette.text.inverse} */}
          {item.label}
        </h4>
      </div>

    ))}
</div>
</div>
  {/* </div> */}
{/* </div> */}
             
            </div>
            
                           <div className={`${WRAP} ${SECTION_GAP}`}>
  <div className={SECTION_HEADER_ROW}>

              <h4 className={SECTION_HEADING}  onClick={()=>{openYourWorkshops()}} >Workshop</h4>
          
              <img  onClick={()=>{openYourWorkshops()}} src={arrowToRight} className='max-w-8 mt-auto mb-4 max-h-8 mx-4' />
</div>
              {workshop?<div className='px-4'><WorkshopItem workshop={workshop}/></div>:<div><h2>Click Join a Workshop or Studio below</h2></div>}
              <div className=' p-4 '></div>
            </div>
            <div  className='w-fit mx-auto '>
               <div className={`${WRAP} ${SECTION_GAP}`}>
  <div className={SECTION_HEADER_ROW}>

              <h4 className={SECTION_HEADING}
         >
    Recent Pages
  </h4>

  <h5
    className="text-base text-emerald-700 cursor-pointer hover:opacity-70 transition"
    onClick={ClickWriteAStory}
  >
    Write Something new +
  </h5>
</div>
              <div className="grid grid-cols-1 px-4 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {myStories.length==0?<div>This is a beginning. Start writing</div>:[...(myStories)]
  .sort((a, b) => a.updated - b.updated)
  .slice(0, 4)
  .map(story => <StoryDashboardItem story={story} router={router}/>)}
         </div>  
            
            
            {/* Explore List */}
            <ExploreList items={collections} />
       </div>
   </div>
 
      </ErrorBoundary>
  );
}

export default DashboardEmbed
