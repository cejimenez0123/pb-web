// import React, { useState, useLayoutEffect, useContext,useEffect } from 'react';
// import '../App.css';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchRecommendedStories } from '../actions/StoryActions.jsx';
// import ExploreList from '../components/collection/ExploreList.jsx';
// import { fetchCollectionProtected, getPublicCollections, getRecommendedCollectionsProfile } from '../actions/CollectionActions.js';
// import { appendToPagesInView, } from '../actions/PageActions.jsx';
// import Context from '../context.jsx';
// import checkResult from '../core/checkResult.js';
// import { initGA } from '../core/ga4.js';
// import ListView from '../components/page/ListView.jsx';
// import Enviroment from '../core/Enviroment.js';
// import {  IonText, IonItem, useIonRouter, IonList, IonContent} from '@ionic/react';
// import {BookListItem} from '../components/BookListItem.jsx';

// function DashboardEmbed() {
//   const router = useIonRouter()
//   const pathName = router.routeInfo.pathname;
//   const currentProfile = useSelector(state=>state.users.currentProfile)
//   const { setSeo, seo ,isNotPhone} = useContext(Context);
//   const dispatch = useDispatch();
//    const collections = [...(useSelector(state => state.books.collections) ?? [])]
//   .sort((a, b) => new Date(b.updated) - new Date(a.updated));
//   const recommendedCols= useSelector(state => state.books.recommendedCols).filter(str=>currentProfile?str.profileId!=currentProfile.id:true)
//   const stories = useSelector(state => state.pages.pagesInView ?? []);
//   const recommendedStories = useSelector(state => state.pages.recommendedStories ?? []).filter(str=>currentProfile?str.authorId!=currentProfile.id:true)

//    let feedbackCol = currentProfile.rolesToCollection.map(col=>col.collection).filter(col=>col.type=="feedback")
//   const [feedbackCols,setFeedbackCols]=useState(feedbackCol)
//   const [hasMore, setHasMore] = useState(false);
//   useEffect(()=>{
//     // if(currentProfile){
//       dispatch(getRecommendedCollectionsProfile())
//       dispatch(getPublicCollections({type:"feedback"})).then(res=>{
//         checkResult(res,payload=>{
          
  
// payload && payload.collections && setFeedbackCols(prevState=>[...prevState,...payload.collections])
      
//         },err=>{

//         })
//       })
      
//     // }
// },[])
// const libraryForums = () => {
//   if (!collections) return null;

//   return (
//     <div className="bg-cream w-[100vw]">
//       <IonText
//         className={`text-emerald-900 ${
//           isNotPhone ? 'ml-16 pl-6' : 'ml-16'
//         } mb-4 lora-bold font-extrabold text-2xl`}
//       >
//         Offer Your Insight
//       </IonText>

//       {/* Horizontal scroll area */}
//       <div className="mb-4 ">
//         <div className="flex flex-row overflow-x-auto overflow-y-clip h-[14rem]  space-x-4 no-scrollbar">
//           <div className="flex flex-row overflow-x-scroll">
//           {feedbackCols.map((library) => (
         
//               <BookListItem book={library} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//   useLayoutEffect(() => {
//     initGA();
//        setSeo(prev => ({
//       ...prev,
//       title: "Plumbum Dashboard | Manage Writing, Events & Community",
//       description:
//         "Your Plumbum dashboard for managing writing, workshops, and community participation in one place.",
//       url: `${Enviroment.domain}${router.routeInfo.pathname}`
//     }))
    
//   }, []);

//   const getContent = () => {
//     dispatch(fetchRecommendedStories());
//     dispatch(getRecommendedCollectionsProfile());
//   };

//   const getHomeCollectionContent = () => {

//     if (currentProfile && currentProfile?.profileToCollections) {
//       let ptc = currentProfile.profileToCollections.find(ptc => ptc.type === 'home');
//       if (ptc) {
//         dispatch(fetchCollectionProtected({ id: ptc.collectionId })).then(res => {
//           checkResult(
//             res,
//             payload => {
//               if (payload.collection) {
//                 const { collection } = payload;
//                 let pages = [];
//                 if (collection.storyIdList) {
//                   pages = collection.storyIdList.map(stc => stc.story);
//                 }
//                 if (collection.childCollections) {
//                   let contentArr = [];
//                   for (let i = 0; i < collection.childCollections.length; i++) {
//                     if (collection.childCollections[i]) {
//                       let col = collection.childCollections[i].childCollection;
//                       if (col?.storyIdList) {
//                         contentArr = [...contentArr, ...col.storyIdList];
//                       }
//                     }
//                   }
//                   const sorted = [...pages, ...contentArr]
//                     .sort((a, b) => a.updated && b.updated && b.updated > a.updated)
//                     .map(stc => stc.story);
//                   dispatch(appendToPagesInView({ pages: sorted }));
//                 }
//               }
//             },
//             err => {
//               // handle error if needed
//             }
//           );
//         });
//       }
//     }
//   };

//   useLayoutEffect(() => {
//     setHasMore(true);
//     getContent();
//     getHomeCollectionContent();
//   }, []);

//   return (
//     <IonContent fullscreen={true} style={{"--background":Enviroment.palette.cream}} className="bg-cream min-h-screen">
   
//               {libraryForums()}
//               <div className="">
//                 <div role="tablist" className="tabs max-w-[100vw]">
//                   {/* Recommendations Tab */}
//                   <input
//                     type="radio"
//                     name="my_tabs_2"
//                     role="tab"
//                     defaultChecked
//                     className="tab hover:min-h-10 [--tab-bg:transparent] rounded-full mont-medium text-emerald-800 border-3 text-md md:text-xl"
//                     aria-label="Recommendations"
//                   />
//                   <div role="tabpanel" className="tab-content">
//                     <ListView items={[...recommendedStories,...recommendedCols]} hasMore={hasMore} getMore={getContent} />
//                   </div>

//                   {/* Home Tab */}
//                   <input
//                     type="radio"
//                     name="my_tabs_2"
//                     role="tab"
//                     className="tab text-emerald-800 mont-medium rounded-full mx-auto bg-transparent border-3 text-md md:text-xl"
//                     aria-label="Home"
//                   />
//                   <div
//                     role="tabpanel"
//                     className="tab-content"
//                   >
//                     <ListView items={stories} hasMore={hasMore} getMore={getContent} />
//                   </div>
//                 </div>
         

//             {/* Explore List */}
//             <ExploreList items={collections} />
//           </div>
   
  
//      </IonContent>
//   );
// }

// export default DashboardEmbed;
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useLayoutEffect, useContext } from 'react';
import '../styles/Discovery.css';
import '../Dashboard.css';
import { getPublicStories, setPagesInView } from '../actions/PageActions.jsx';
import { getPublicCollections, setCollections } from '../actions/CollectionActions.js';
import { getPublicLibraries } from '../actions/LibraryActions.jsx';
import checkResult from '../core/checkResult.js';
import { useMediaQuery } from 'react-responsive';
import {BookListItem} from '../components/BookListItem.jsx';
import { initGA, sendGAEvent } from '../core/ga4.js';
import ListView from '../components/page/ListView.jsx';
import ScrollDownButton from '../components/ScrollDownButton.jsx';
import Context from '../context.jsx';
import Paths from '../core/paths.js';
import useScrollTracking from '../core/useScrollTracking.jsx';
import sortItems from '../core/sortItems.js';
import {   IonContent, IonItem, IonList, IonText, useIonRouter } from '@ionic/react';
import PageList from '../components/page/PageList.jsx';

function DiscoveryContainer() {
  const { seo,setSeo } = useContext(Context);
  const  currentProfile = useSelector(state=>state.users.currentProfile)
  const router = useIonRouter()
  const dispatch = useDispatch();
const {
  collections: cols,
  books,
  libraries,
  pagesInView,
} = useSelector(state => ({
  collections: state.books.collections,
  books: state.books.books,
  libraries: state.books.libraries,
  pagesInView: state.pages.pagesInView,
}));

  const [hasMoreLibraries, setHasMoreLibraries] = useState(false);
  const [viewItems, setViewItems] = useState([]);

  const isNotPhone = useMediaQuery({ query: '(min-width: 999px)' });

  useScrollTracking({ name: 'discovery' });
  useLayoutEffect(() => {
    initGA();
  }, []);

  useLayoutEffect(() => {
    setSeo({
      title: 'Plumbum (Discovery) - Read Fresh Writing',
      description: 'Explore events, workshops, and writer meetups on Plumbum.',
      name: 'Plumbum',
      type: '',
    });
  }, [setSeo]);

  useLayoutEffect(() => {
    // dispatch(setPagesInView({ pages: [] }));
    fetchContentItems();
    fetchLibraries();
  }, [currentProfile, dispatch]);
  


  useEffect(() => {
    let finalList = sortItems(
      pagesInView,
      cols.filter(item => item && item.storyIdList && item.storyIdList.length > 0)
    );
    setViewItems(finalList);
  }, [pagesInView, cols]);

 
  const fetchContentItems = () => {
    dispatch(setPagesInView({ pages: [] }));
    dispatch(setCollections({ collections: [] }));
    dispatch(getPublicStories());
    dispatch(getPublicCollections());
  };

  const fetchLibraries = () => {
    // setHasMoreLibraries(true);
    dispatch(getPublicLibraries())
      .then(result =>
        checkResult(
          result,
          payload => setHasMoreLibraries(false),
          err => setHasMoreLibraries(false)
        )
      )
      .catch(() => setHasMoreLibraries(false));
  };


const LibraryForums = () => {
  if (!libraries) return null;

  return (
    <div className="">
      <IonText
      style={{"--padding-bottom":"4em"}}
        className={`text-emerald-900 ${
          isNotPhone ? 'ml-16 pl-6' : 'ml-16'
        } mb-4 lora-bold font-extrabold text-2xl`}
      >
        Communities
      </IonText>

      {/* Horizontal scroll area */}
      <div    style={{"--padding-top":"4em"}} className="mb-4">
        <div className="flex flex-row overflow-x-auto overflow-y-clip  space-x-4 px-4 no-scrollbar">
          {libraries.map((library) => (
         
              <BookListItem book={library} />
       
          ))}
        </div>
      </div>
    </div>
  );
};

  const BookList = () => {

    if (!books) return null;
    return (
      <div className=''>
        <h3     style={{"--padding-bottom":"4em"}} className="text-emerald-900 text-left bg-transparent font-extrabold ml-16  mb-4 text-2xl">
          Collections
        </h3>
<div className="mb-4 bg-transparent ">

         <IonList style={{background:"transparent"}} className="bg-transparent">
        
          <div className="flex flex-row  overflow-x-auto overflow-y-clip h-[14rem] space-x-4 px-4 no-scrollbar">
          {books.map((book, i) => {
            const id = `${book.id}_${i}`;
            return (
         
                <BookListItem book={book} />
        
            );
          })}
          </div>
          </IonList>
    </div>

      </div>
    );
  };



  return (
    <IonContent style={{"--padding-top":"4em"}}>
<div>
   
           
             
          <div className="text-left  ">
            
            <LibraryForums books={books}/>
          </div>

          <div className="mb-12"><BookList books={books}/></div>

          <div className="flex max-w-[100vw] md:w-[50em] mx-auto flex-col">
            <div className="flex flex-row items-center justify-between">
              <h3 className="text-emerald-900 font-extrabold text-2xl text-left mx-4 lora-bold my-4 lg:mb-4">
                Pages
              </h3>

         
            </div>
          </div>

        <div className='mx-auto sm:max-w-[45em] '>
            <PageList items={viewItems} />
         </div>

          <div className="lg:flex-1 lg:mx-4" />

          {!currentProfile ? (
            <ScrollDownButton
              text="Join the community"
              onClick={() => {
                sendGAEvent('Navigate to Apply', 'Navigate to Apply', 'Join the community', 0, false);
                router.push(Paths.onboard);
              }}
            />
          ) : null}
         {/* </div> */}
     </div>
</IonContent>
  );
}

export default DiscoveryContainer