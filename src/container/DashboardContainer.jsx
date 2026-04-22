import React, { useState,useEffect, useRef } from 'react';
import '../App.css';
import { useSelector, useDispatch } from 'react-redux';
import { createStory, getMyStories } from '../actions/StoryActions';
import ExploreList from '../components/collection/ExploreList.jsx';
import arrowToRight from '../images/icons/arrowToRight.svg'
import checkResult from '../core/checkResult.js';
import ErrorBoundary from '../ErrorBoundary.jsx';
import {IonText, useIonRouter, } from '@ionic/react';
import { fetchYourWorkshops } from '../actions/WorkshopActions.jsx';
import ProfileCircle from '../components/profile/ProfileCircle.jsx';
import truncate from 'html-truncate';
import { PageType } from '../core/constants.js';
import Paths from '../core/paths.js';
import debounce from '../core/debounce.js';
import { sendGAEvent } from '../core/ga4.js';
import { setPageInView } from '../actions/PageActions.jsx';
import { useDialog } from '../domain/usecases/useDialog.jsx';
import CreateCollectionForm from '../components/collection/CreateCollectionForm.jsx';
import Enviroment from '../core/Enviroment.js';
import { Capacitor } from '@capacitor/core';
import { getMyCollections } from '../actions/CollectionActions.js';
import StoryDashboardItem from '../components/StoryDashboardItem.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { useMediaQuery } from 'react-responsive';
import { useResponsiveGrid } from '../core/ResponsiveGrid.jsx';
import usePaginatedResource from '../core/usePaginatedResource.jsx';
import PaginatedList from '../components/page/PaginatedList.jsx';
import shortName from '../core/shortName.jsx';
import ListPill from '../components/page/ListPill.jsx';
import WorkshopItem from '../components/page/WorkshopItem.jsx';

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
const WRAP = "max-w-2xl mx-auto ";
const SECTION_GAP = "pt-10";  // applied to each section's root div
const SECTION_HEADING = "text-xl lora-medium";          // text style only
const SECTION_HEADER_ROW = "flex items-center justify-between py-4"; // row layout
const LIST_WRAP = "flex flex-col gap-4";  // Saves

const TILE = "w-36 md:w-44 flex-shrink-0";
const ACTION_ROW = "flex flex-col items-center gap-4 w-full";
function DashboardEmbed() {

  const currentProfile = useSelector(state=>state.users.currentProfile)
 const isTablet = useMediaQuery({ query: '(min-width: 768px)' });
const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const router = useIonRouter()
  const dispatch = useDispatch();
   const collectionsRaw = useSelector(state => state.books.collections) ?? [];
const pageSize = 3
const { columns, rows } = useResponsiveGrid();
const visibleCount = columns * rows;

const collections = collectionsRaw
  .slice() // safer than spread in this context
  .sort((a, b) => new Date(b.updated) - new Date(a.updated));
  
  const [workshop,setWorkshop]=useState(null)
  const [saves,setSaved]=useState([])
  const {openDialog,closeDialog,resetDialog}=useDialog()
  const isNative = Capacitor.isNativePlatform()
     const [homeCol,setHomeCol]=useState(null)
    const [archiveCol,setArchiveCol]=useState(null)
    
const personalStories = usePaginatedResource({
  key: "stories",
  fetcher: getMyStories,
  pageSize,
  enabled: !!currentProfile?.id,
  select: (res) => ({
    items: res.pageList,
    totalCount: res.totalCount,
  }),
});
const myStories = personalStories.items
const personalCollections = usePaginatedResource({
  key: "collections",
  fetcher: getMyCollections,
  pageSize,
  enabled: !!currentProfile?.id,
  select: (res) => ({
    items: res.collections,
    totalCount: res.totalCount,
  }),
});
const [results,setResults]=useState(personalCollections.items)
 const myCollections = personalCollections.items

useEffect(()=>{
 fetchWorkshops()
},[])
// inside your dialog state

useEffect(() => {
  try {
    console.log("FCSXL",results)
    if (results?.length > 0) {
      const group = results[0];
      // console.log("FCKSXLCC",group)
      const stories = group.storyIdList?.filter(a => a?.story?.type === PageType.text)
        .sort((a, b) => a?.story?.updated - b?.story?.updated)
      
      setWorkshop({ group, story:stories[0]});
     
    }
  } catch (err) {
    console.log(err);
  }

  
}, [results]);

  
const openPages = () => {


  openDialog({
  title: "Pages",
  height: 94,
  text: (
    <div>

  
   <PaginatedList
   
  cacheKey="stories"
  fetcher={getMyStories}
  pageSize={8}
  // search={search}
  enableInternalSearch={true}
  renderItem={(story) => (
        <div
          onClick={() => {
            router.push(Paths.page.createRoute(story?.id));
            resetDialog();
          }}
          className="p-4 border border-soft rounded-xl"
        >
          {shortName(story?.title,40) || "Untitled"}
        </div>
      )}
    />  </div>
  )})}

  const openCollections = () => {
  openDialog({
  title: "Collections",
  height: 94,
  text: (
    <PaginatedList
      cacheKey="collections"
      fetcher={getMyCollections}
      pageSize={8}
      loadingState={true}
      enableInternalSearch={true}
      renderItem={(col) => (
          <div
            onClick={() => {
              router.push(Paths.collection.createRoute(col.id));
              resetDialog();
            }}
            className="p-4 border border-soft rounded-xl"
          >
            {col.title || "Untitled"}
          </div>
        )}
     
    
    />
  )})}

const openYourWorkshops = () => {
  

  openDialog({
    title: "Communities",
    scrollY: false,
    breakpoint: 1,
    height: 90,
    disagree: () => resetDialog(),
    text: (
      <PaginatedList
       cacheKey="collections:type=library"
        fetcher={getMyCollections}
        enableInternalSearch={true}
        pageSize={8}
        params={{ type: "feedback" }} // ✅ THIS NOW WORKS
        renderItem={(c) => (
          <ListPill item={c} onClick={()=>router.push(Paths.collection.createRoute(c.id))}/>
     
        )}
      />
    ),
  });
};

const openCommunities = () => {
  openDialog({
    title: "Communities",
    scrollY: false,
    breakpoint: 1,
    height: 90,
    disagree: () => resetDialog(),
    text: (
      <PaginatedList
       cacheKey="collections:type=library"
        fetcher={getMyCollections}
        pageSize={8}
        enableInternalSearch={true}
        params={{ type: "library" }} // ✅ THIS NOW WORKS
        renderItem={(story) => (
          <div
            onClick={() => {
              router.push(Paths.collection.createRoute(story.id));
              resetDialog();
            }}
            className="p-4 border border-soft rounded-xl"
          >
            <h4 className="text-[.9rem]">
              {story.title || "Untitled"}
            </h4>
          </div>
        )}
      />
    ),
  });
};
              useEffect(() => {
            fetchWorkshops()
                if (currentProfile?.profileToCollections) {
                  let home = currentProfile.profileToCollections.find(pTc => pTc.type === "home")?.collection || null;
                     console.log("HOME COL",home)
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
        router.push(Paths.editPage.createRoute(payload?.story?.id),'forward', 'push');
        }else{
          window.alert("COULD NOT CREATE STORY")
        }
      },err=>{
        setErrorLocal(err.message)
      }));
    }
  }, 5);
// function WorkshopItem({workshop}){

//   return( <div onClick={()=>{router.push(Paths.collection.createRoute(workshop.group.id),"forward")}}

//   className={`border rounded-xl  bg-base-soft  hover:bg-card-highlight shadow-md  border-1 p-4 border-blue `}>

//                   <h1 className='text-[1.4em] py-2 text-text-inverse '>{workshop.group.title}</h1>
//                   <h6 className='text-soft  text-text-inverse py-2'>Most Recent</h6>
//                   {workshop?.story && <div className='py-2  text-text-inverse'>{workshop?.story?.title}</div>}
//                   {workshop?.story && workshop?.story?.type==PageType.text && <div  className=" text-text-inversep-2 rounded-xl"
//                   dangerouslySetInnerHTML={{ __html: truncate(workshop?.story?.data ?? "", 100, {}) }}/>
//                     }
//                     {/* {<div dangerouslySetInnerHTML={{__html:truncate(workshop.story.data,20,{})/>}</div> */}
//                   <div className='flex flex-row  text-text-inverse py-4 '>{
// workshop?.group?.roles?.map((role, i) =>
//   <ProfileCircle key={role?.profile?.id ?? i} profile={role?.profile} includeUsername={false}/>
// )
// }</div>
//                 </div>)
// }
  
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
//  const columns = isDesktop ? 3 : isTablet ? 2 : 1;
// const visibleCount = columns * 2; 

 return (
        <ErrorBoundary>

          
            
                      <div className="flex flex-row mx-auto  md:max-w-[40em] flex-wrap my-4 justify-center gap-4">
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
    {/* <h4 className={SECTION_HEADING}>Saves</h4> */}
<SectionHeader title={"Saves"}/>
           

              <img src={arrowToRight} onClick={()=>homeCol && router.push(Paths.collection.createRoute(homeCol?.id))}className='max-w-8 mt-auto mb-4 max-h-8 mx-4' />
              </div>
              <div className='flex mx-4 flex-col gap-4'>
               {saves?.length==0?<div><h2>Bookmark things you want to see often</h2></div>:saves?.map((item, i) => { 
  return (
    <div key={item?.id ?? i}
    onClick={() => {
      if (!item) return;
      item?.data
        ? router.push(Paths.page.createRoute(item.id), "forward")
        : router.push(Paths.collection.createRoute(item.id), "forward");
    }}
  
    className={`border shadow-md border-1  rounded-full border-purple bg-base-bg  p-4`}
  >
    
    {/* {Enviroment.palette.accent.} */}
    {item ? (
      // ✅ REAL CONTENT
      <div className="flex flex-row gap-4 bg-base-bg px-4 items-center">
        <h6 className='text-soft dark:text-emerald-200'>{item.type} ·</h6>
        {/* {Enviroment.palette.base.} */}
        <h5 className="text-[1.2em] dark:text-emerald-200 text-soft" >
          {shortName(item.title,20)}
         </h5>
      </div>
    ) : (
      // ✅ SKELETON STATE
      <div className="flex flex-row gap-4  bg-base-bg  items-center animate-pulse">
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

</div> 
</div>

             
            </div>
          
<div className={`${WRAP} ${SECTION_GAP}`}>
  <div className={SECTION_HEADER_ROW}>
    <div onClick={() => openYourWorkshops()}>
      <SectionHeader
        title="Workshops"
        right={
          <img
            onClick={() => openYourWorkshops()}
            src={arrowToRight}
            className="max-w-8 max-h-8"
          />
        }
      />
    </div>
  </div>

  <div className="px-4">
    {workshop ? (
      <WorkshopItem workshop={workshop} router={router} />
    ) : (
      <h2 className="text-lg text-soft">
        Click Join a Workshop or Studio below
      </h2>
    )}
    </div>
  </div>





            
        
               <div className={` ${SECTION_GAP}`}>
                
  <div className={SECTION_HEADER_ROW}>
<SectionHeader title={"Recent Pages"}/>
         

  <h5
    className="text-[1rem] text-soft cursor-pointer mt-4 pr-4 hover:opacity-70 transition"
    onClick={ClickWriteAStory}
  >
    Write Something new +
  </h5>
</div>
            <div className="w-full grid gap-4 auto-rows-fr items-stretch">
  <div className="relative min-h-[120px]">

  {/* EMPTY STATE */}


  {/* STORIES LIST */}
  <div
    className={`
      transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
      ${myStories.length > 0
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-2 pointer-events-none absolute inset-0"}
    `}
  >
    {myStories.length > 0 &&  (
<div
  className="w-full px-4 grid gap-4"
  style={{
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
  }}
>
    {[...myStories]
      .sort((a, b) => b.updated - a.updated) // newest first 🔥
      .slice(0, visibleCount)
      .map((story, index) => (
        <div
          key={story?.id}
         className="transition-all duration-300"
          style={{
            transitionDelay: `${index * 60}ms`
          }}
        >
          <StoryDashboardItem story={story} router={router} />
        </div>
      ))}
  </div>
)}
   </div>
</div>
         </div>  
            
            
     
          
       </div>
      <div className='min-h-[28rem]'>
        <ExploreList items={collections} />
 </div>
      </ErrorBoundary>
  );
}

export default DashboardEmbed

