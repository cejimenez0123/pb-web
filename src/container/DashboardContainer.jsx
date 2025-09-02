import React, { useState, useLayoutEffect, useContext,useEffect } from 'react';
import '../App.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRecommendedStories } from '../actions/StoryActions';
import ExploreList from '../components/collection/ExploreList.jsx';
import { fetchCollectionProtected, getRecommendedCollectionsProfile, setCollections } from '../actions/CollectionActions';
import { useLocation } from 'react-router-dom';
import { appendToPagesInView, setPagesInView } from '../actions/PageActions';
import Context from '../context.jsx';
import checkResult from '../core/checkResult.js';
import ErrorBoundary from '../ErrorBoundary.jsx';
import { initGA } from '../core/ga4.js';
import ListView from '../components/page/ListView.jsx';
import Enviroment from '../core/Enviroment.js';
import {  IonContent } from '@ionic/react';

function DashboardContainer() {
  const location = useLocation();
  const { currentProfile, setSeo, seo } = useContext(Context);

  const dispatch = useDispatch();
  const collections = useSelector(state => state.books.recommendedCols);
  const stories = useSelector(state => state.pages.pagesInView ?? []);
  const recommendedStories = useSelector(state => state.pages.recommendedStories ?? []);

  const [hasMore, setHasMore] = useState(false);
  useEffect(()=>{
    if(currentProfile){
      dispatch(getRecommendedCollectionsProfile())
    }

   
},[])
  useLayoutEffect(() => {
    initGA();
    let soo = { ...seo };
    soo.title = 'Plumbum (Dashboard) - Your Writing, Your Community';
    soo.description = 'Explore events, workshops, and writer meetups on Plumbum.';
    soo.url = Enviroment.domain + location.pathname;
    setSeo(soo);
  }, []);

  const getContent = () => {
    dispatch(fetchRecommendedStories());
    dispatch(getRecommendedCollectionsProfile());
  };

  const getHomeCollectionContent = () => {
    dispatch(setPagesInView({ pages: [] }));
    if (currentProfile?.profileToCollections) {
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
    // <IonPage>
      <IonContent fullscreen scrollY>
        <ErrorBoundary>
          <div id="dashboard">
            <div className="py-8">
              <div className="w-[98vw] md:mt-8 mx-auto flex flex-col md:w-page">
                <div role="tablist" className="tabs grid">
                  {/* Recommendations Tab */}
                  <input
                    type="radio"
                    name="my_tabs_2"
                    role="tab"
                    defaultChecked
                    className="tab hover:min-h-10 [--tab-bg:transparent] rounded-full mont-medium text-emerald-800 border-3 text-md md:text-xl"
                    aria-label="Recommendations"
                  />
                  <div role="tabpanel" className="tab-content pt-1 lg:py-4 rounded-lg md:mx-auto md:w-page">
                    <ListView items={recommendedStories} hasMore={hasMore} getMore={getContent} />
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
                    className="tab-content pt-1 lg:py-4 rounded-lg md:w-page md:mx-auto border-l-4 rounded-full"
                  >
                    <ListView items={stories} hasMore={hasMore} getMore={getContent} />
                  </div>
                </div>
              </div>
            </div>

            {/* Explore List */}
            <ExploreList items={collections} />
          </div>
        </ErrorBoundary>
      </IonContent>
    // </IonPage>
  );
}

export default DashboardContainer;
