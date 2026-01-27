import {useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useLayoutEffect, useEffect, useContext } from "react";
import "../../styles/PageView.css";
import PageViewItem from "../../components/page/PageViewItem";
import { getStory } from "../../actions/StoryActions";
import CommentThread from "../../components/comment/CommentThread";
import { postStoryHistory } from "../../actions/HistoryActions";
import { getProfileHashtagCommentUse } from "../../actions/HashtagActions";
import ErrorBoundary from "../../ErrorBoundary";
import Context from "../../context";
import { initGA, sendGAEvent } from "../../core/ga4.js";
import useScrollTracking from "../../core/useScrollTracking.jsx";
import checkResult from "../../core/checkResult.js";
import { IonBackButton, IonContent, IonHeader } from "@ionic/react";
import { setComments } from "../../actions/PageActions.jsx";
import Paths from "../../core/paths.js";
import { Capacitor } from "@capacitor/core";
import { useIonRouter } from '@ionic/react';
export default function PageViewContainer() {
  const { setSeo, seo, setError, } = useContext(Context);
  const { id } = useParams();
  const dispatch = useDispatch();
 const { currentProfile } = useSelector((state) => state.users);
  const router = useIonRouter()
  const page = useSelector((state) => state.pages.pageInView);
  const comments = useSelector((state) => state.comments.comments);
    const [canUserSee, setCanUserSee] = useState(false)
page && useScrollTracking({
  contentType: "story",
  contentId: page?.id,
  authorId: page?.authorId,
  enableCompletion: canUserSee === true,
  completionEvent: "story_read_complete",
});
  const [pending, setPending] = useState(true);
;
  const [rootComments, setRootComments] = useState([]);
  const [errorStatus, setErrorStatus] = useState(null);

  useScrollTracking({ name: page ? JSON.stringify(page) : id });

  useLayoutEffect(() => {
    initGA();
  }, []);

  useLayoutEffect(() => {
    if (currentProfile) {
      dispatch(getProfileHashtagCommentUse({ profileId: currentProfile.id }));
    }
    return () => {
      if (currentProfile && page && import.meta.env.VITE_NODE_ENV !== "dev") {
        dispatch(postStoryHistory({ profile: currentProfile, story: page }));
      }
    };
  }, []);

  useEffect(() => {
    if (comments?.length) {
      setRootComments(comments.filter((c) => c && c.parentId == null));
    }
  }, [comments]);

  useEffect(() => {

    fetchStory();
  }, [id,dispatch]);

  const fetchStory = async () => {
    setPending(true)
    setErrorStatus(null);

    try {
       dispatch(getStory({ id })).then((res) => {


      checkResult(
        res,
        (payload) => {
          if (payload?.story) {
            if (payload.story.comments?.length) {
              dispatch(setComments({ comments: payload.story.comments }));
            }
            setPending(false)
          } else {
            throw new Error("Story not found");
          }
        },
        (err) => {
          // Handle forbidden specifically
              setPending(false)
          if (err?.response?.status === 403) {
   
            setErrorStatus(403);
          } else {
            setError(err.message || "Failed to load story");
            setErrorStatus(err?.response?.status || 500);
          }

        }
           )});

    } catch (error) {
          setPending(false)
      if (error?.response?.status === 403) {
        setErrorStatus(403);

      } else {
        setError(error.message);
      
        setErrorStatus(500);
      }
    }
  };
  const soCanUserSee=()=>{
    if(!page.isPrivate){
      return true
    }
    if (page?.isPrivate) {
    
      if (currentProfile && currentProfile.id === page.authorId) {
        return true;
      }
   
     if(page.collections){

     let found = page.collections.find(col=>!col.collection.isPrivate)
    if(found) return true
        }

    if(page.betaReaders.length){
      let canSee = page.betaReaders.find((br) => {
        if (currentProfile && br.profileId === currentProfile.id) {
          return true;
        }
      });

      if(canSee){
      return true;
      }
    }
    }else{
    return false
    }}
  useEffect(() => {
    setPending(true);
    page && setCanUserSee(soCanUserSee()) && sendGAEvent({
  story_id: page.id,
  author_id: page.authorId,
  is_private: page.isPrivate,
  viewer_logged_in: Boolean(currentProfile),
  platform: Capacitor.isNativePlatform() ? "native" : "web"
})


    setPending(false);
  },[page])
  useEffect(() => {
  if (errorStatus === 403) {
    sendGAEvent("story_access_denied", {
      story_id: id,
      viewer_logged_in: Boolean(currentProfile),
    });
  }
}, [errorStatus]);
useEffect(() => {
  if (page && rootComments && rootComments.length ) {
    sendGAEvent("view_comments", {
      story_id: page.id,
      comment_count: rootComments?.length,
    });
  }
}, [rootComments]);

  const handleBack = () => {
     sendGAEvent("story_exit_back", {
    story_id: page?.id,
    exit_type: window.history.length > 1
      ? "history_back"
      : "fallback_discovery",
  });
    if (window.history.length > 1) {
          router.goBack()
    } else {
      router.push(Paths.discovery());
    }
  };
  useLayoutEffect(() => {
    if (page) {
      setSeo({
        ...seo,
        title: page.title,
        description: page.description,
      });
    }
  }, [page]);

  const PageDiv = ({ page }) =>
    page ? (
      <PageViewItem page={page} currentProfile={currentProfile} />
    ) : (
      <div className="skeleton w-[95vw] mx-auto sm:w-[50em] mx-auto bg-emerald-50 h-page" />
    );

  return (
    <ErrorBoundary>
         <IonContent fullscreen={true}  style={{"--background":"#f4f4e0"}}className="ion-padding-bottom" >
 

        <IonHeader className=" ">
          {Capacitor.isNativePlatform()||true?<IonBackButton
             className="ion-padding-start "
      onClick={handleBack}
    />:null}</IonHeader>
    <div className="py-12 bg-cream">
       <div className=" min-h-[40em] ion-padding-bottom  ">
        <div className=" text-center bg-cream py-[4em] mx-auto h-[100%]" >
          {pending ? ( 
            <div className="skeleton mx-auto bg-slate-50 max-w-[96vw] mx-auto md:w-page h-page" />
          ) : errorStatus === 403 ? (
            <div className="flex  mx-auto md:w-50 px-8 h-page">
              <h1 className="mont-medium my-12 mx-auto text-center text-emerald-800">
                🚫 You don’t have permission to view this story.
              </h1>
            </div>
          ) : canUserSee ? (
            <div className="w-fit  bg-cream  mx-auto sm:max-w-[50em]">
              <PageDiv page={page} />
             <div className="text-left px-4 bg-cream bg-cream py-4"> <h6 className="text-[1em] font-bold">Responses</h6></div>
              <CommentThread page={page} comments={rootComments} />
        
           </div>
          ) : (
            <div className="flex max-w-[96vw] mx-auto sm:w-page h-page">
              <h1 className="mont-medium my-12 mx-auto">Took a wrong turn</h1>
            </div>
          )}
        </div>
       
      
</div>
         </div>
      </IonContent>
    </ErrorBoundary>
  );
}
