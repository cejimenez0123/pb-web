import React, { useState, useLayoutEffect, useContext,useEffect } from 'react';
import '../App.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRecommendedStories } from '../actions/StoryActions.jsx';
import ExploreList from '../components/collection/ExploreList.jsx';
import { fetchCollectionProtected, getPublicCollections, getRecommendedCollectionsProfile } from '../actions/CollectionActions.js';
import { appendToPagesInView, } from '../actions/PageActions.jsx';
import Context from '../context.jsx';
import checkResult from '../core/checkResult.js';
import { initGA } from '../core/ga4.js';
import ListView from '../components/page/ListView.jsx';
import Enviroment from '../core/Enviroment.js';
import {  IonText, IonItem, useIonRouter, IonList, IonContent} from '@ionic/react';
import BookListItem from '../components/BookListItem.jsx';

function DashboardEmbed() {
  const router = useIonRouter()
  const pathName = router.routeInfo.pathname;
  const currentProfile = useSelector(state=>state.users.currentProfile)
  const { setSeo, seo ,isNotPhone} = useContext(Context);
  const dispatch = useDispatch();
   const collections = [...(useSelector(state => state.books.collections) ?? [])]
  .sort((a, b) => new Date(b.updated) - new Date(a.updated));
  const recommendedCols= useSelector(state => state.books.recommendedCols);
  const stories = useSelector(state => state.pages.pagesInView ?? []);
  const recommendedStories = useSelector(state => state.pages.recommendedStories ?? []);
   let feedbackCol = currentProfile.rolesToCollection.map(col=>col.collection).filter(col=>col.type=="feedback")
  const [feedbackCols,setFeedbackCols]=useState(feedbackCol)
  const [hasMore, setHasMore] = useState(false);
  useEffect(()=>{
    // if(currentProfile){
      dispatch(getRecommendedCollectionsProfile())
      dispatch(getPublicCollections({type:"feedback"})).then(res=>{
        checkResult(res,payload=>{
          
  
payload && payload.collections && setFeedbackCols(prevState=>[...prevState,...payload.collections])
      
        },err=>{

        })
      })
      
    // }
},[])
const libraryForums = () => {
  if (!collections) return null;

  return (
    <div className="">
      <IonText
        className={`text-emerald-900 ${
          isNotPhone ? 'ml-16 pl-6' : 'ml-16'
        } mb-4 lora-bold font-extrabold text-2xl`}
      >
        Offer Your Insight
      </IonText>

      {/* Horizontal scroll area */}
      <div className="mb-4">
        <div className="flex flex-row overflow-x-auto overflow-y-clip h-[14rem] w-[100vw] space-x-4 px-4 no-scrollbar">
          <IonList className="flex flex-row overflow-x-scroll">
          {feedbackCols.map((library) => (
            <IonItem
              key={library.id}
              className=" flex-shrink-0 border-none bg-transparent"
            >
              <BookListItem book={library} />
            </IonItem>
          ))}
          </IonList>
        </div>
      </div>
    </div>
  );
};
  useLayoutEffect(() => {
    initGA();
    let soo = { ...seo };
    soo.title = 'Plumbum (Dashboard) - Your Writing, Your Community';
    soo.description = 'Explore events, workshops, and writer meetups on Plumbum.';
    soo.url = Enviroment.domain + pathName
    setSeo(soo);
  }, []);

  const getContent = () => {
    dispatch(fetchRecommendedStories());
    dispatch(getRecommendedCollectionsProfile());
  };

  const getHomeCollectionContent = () => {

    if (currentProfile && currentProfile?.profileToCollections) {
      let ptc = currentProfile.profileToCollections.find(ptc => ptc.type === 'home');
      if (ptc) {
        dispatch(fetchCollectionProtected({ id: ptc.collectionId })).then(res => {
          checkResult(
            res,
            payload => {
              if (payload.collection) {
                const { collection } = payload;
                let pages = [];
                if (collection.storyIdList) {
                  pages = collection.storyIdList.map(stc => stc.story);
                }
                if (collection.childCollections) {
                  let contentArr = [];
                  for (let i = 0; i < collection.childCollections.length; i++) {
                    if (collection.childCollections[i]) {
                      let col = collection.childCollections[i].childCollection;
                      if (col?.storyIdList) {
                        contentArr = [...contentArr, ...col.storyIdList];
                      }
                    }
                  }
                  const sorted = [...pages, ...contentArr]
                    .sort((a, b) => a.updated && b.updated && b.updated > a.updated)
                    .map(stc => stc.story);
                  dispatch(appendToPagesInView({ pages: sorted }));
                }
              }
            },
            err => {
              // handle error if needed
            }
          );
        });
      }
    }
  };

  useLayoutEffect(() => {
    setHasMore(true);
    getContent();
    getHomeCollectionContent();
  }, []);

  return (
    <IonContent className="bg-cream min-h-screen">
   
              {libraryForums()}
              <div className="">
                <div role="tablist" className="tabs max-w-[100vw]">
                  {/* Recommendations Tab */}
                  <input
                    type="radio"
                    name="my_tabs_2"
                    role="tab"
                    defaultChecked
                    className="tab hover:min-h-10 [--tab-bg:transparent] rounded-full mont-medium text-emerald-800 border-3 text-md md:text-xl"
                    aria-label="Recommendations"
                  />
                  <div role="tabpanel" className="tab-content">
                    <ListView items={[...recommendedStories,...recommendedCols]} hasMore={hasMore} getMore={getContent} />
                  </div>

                  {/* Home Tab */}
                  <input
                    type="radio"
                    name="my_tabs_2"
                    role="tab"
                    className="tab text-emerald-800 mont-medium rounded-full mx-auto bg-transparent border-3 text-md md:text-xl"
                    aria-label="Home"
                  />
                  <div
                    role="tabpanel"
                    className="tab-content"
                  >
                    <ListView items={stories} hasMore={hasMore} getMore={getContent} />
                  </div>
                </div>
         

            {/* Explore List */}
            <ExploreList items={collections} />
          </div>
   
  
     </IonContent>
  );
}

export default DashboardEmbed;
