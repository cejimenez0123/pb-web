
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useLayoutEffect, useEffect, useContext } from "react";
import { IonContent, useIonRouter } from "@ionic/react";
import PageViewItem from "../../components/page/PageViewItem";
import CommentThread from "../../components/comment/CommentThread";
import { getStory } from "../../actions/StoryActions";
import { postStoryHistory } from "../../actions/HistoryActions";
import { setComments } from "../../actions/PageActions.jsx";
import ErrorBoundary from "../../ErrorBoundary";
import Context from "../../context";
import Paths from "../../core/paths.js";
import useScrollTracking from "../../core/useScrollTracking.jsx";
import checkResult from "../../core/checkResult.js";
import { initGA, sendGAEvent } from "../../core/ga4.js";
import Enviroment from "../../core/Enviroment.js";

// Layout
const WRAP = "max-w-[50em] mx-auto px-4";
const SECTION  = "pt-8 sm:pt-10 lg:pt-12 "; 
const BLOCK = "py-4";

// Typography
const HEADING = "text-[1em] font-bold text-emerald-800";

// Containers
const CARD = "bg-cream rounded-xl shadow-sm";
const FADE = "transition-opacity duration-500";

// Utility
const CENTER = "text-center mx-auto";
export default function PageViewContainer() {
  const { setSeo, seo, setError } = useContext(Context);
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useIonRouter();
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const page = useSelector((state) => state.pages.pageInView);
  const comments = useSelector((state) => state.comments.comments);




const canUserSee = (() => {
  if (!page) return false;
  
  if(page?.authorId === currentProfile?.id ){
    return true
  }
   if (!page.isPrivate) return true;
    if(page.betaReaders?.find(
    (r) => r.profileId === currentProfile.id && roles.includes(r.role))){
      return true
    }
   if (!currentProfile) return false;

  
})();

  const [pending, setPending] = useState(true);
  const [rootComments, setRootComments] = useState([]);
  const [errorStatus, setErrorStatus] = useState(null);

  const isNative = useIonRouter(); // placeholder for Capacitor.isNativePlatform()

  useScrollTracking({
    contentType: "story",
    contentId: page?.id,
    authorId: page?.authorId,
    enableCompletion: canUserSee,
    completionEvent: "story_read_complete",
  });

  useLayoutEffect(() => {
    initGA();
  }, []);

  const fetchStory = async () => {
    setPending(true);
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
              setPending(false);
            } else throw new Error("Story not found");
          },
          (err) => {
            console.log(err.response.status)
            setPending(false);
            if (err?.response?.status === 404){ 
              setErrorStatus(404);
              setPending(false)
              setError("Story not found");

            }
            else {
              setError(err.message || "Failed to load story");
              setErrorStatus(err?.response?.status || 500);
            }
          }
        );
      });
    } catch (error) {
      setPending(false);
      if (error?.response?.status === 403) setErrorStatus(403);
      else {
        setError(error.message);
        setErrorStatus(500);
      }
    }
  };

  useEffect(() => {
    fetchStory();
    dispatch(setComments({comments:[]}))
  }, [id]);

  useEffect(() => {
    if (comments?.length) {
      setRootComments(comments.filter((c) => c && !c.parentId));
    }
  }, [comments]);

  useEffect(() => {
    if (page) {
      setSeo({ ...seo, title: page.title, description: page.description });
    
      sendGAEvent({
        story_id: page.id,
        author_id: page.authorId,
        is_private: page.isPrivate,
        viewer_logged_in: Boolean(currentProfile),
        platform: isNative ? "native" : "web",
      });
    }
  }, [page]);

  const handleBack = () => {
    sendGAEvent("story_exit_back", {
      story_id: page?.id,
      exit_type: window.history.length > 1 ? "history_back" : "fallback_discovery",
    });
    window.history.length > 1 ? router.goBack() : router.push(Paths.discovery, "back");
  };
  
  return (
    <ErrorBoundary>
      <IonContent
        fullscreen
        className="ion-padding-bottom"
        style={{ "--background":Enviroment.palette.cream,"--padding-bottom":"15em" }}
      >
        <div className="relative">
  {pending && <PageViewSkeleton />}

 <div className={`${FADE} ${pending ? "opacity-0" : "opacity-100"}`}
  >
  {!pending && !errorStatus && canUserSee && (
      <div className={`${WRAP}`}>
  <div className={`${CARD} ${BLOCK}`}>
        <PageViewItem page={page}  currentProfile={currentProfile} />
       <div className={SECTION}>
  <h6 className={HEADING}>Responses</h6>
</div>
        <CommentThread page={page} comments={rootComments} rawComments={comments}/>
      </div>
      </div>
    )}


{!pending && errorStatus === 404 && 
(<div className={`${CENTER} ${SECTION}`}>
    <h1 className="text-emerald-800 font-bold text-lg">
      📖 Story not found
    </h1>
    <p className="text-sm mt-2">
      It may have been deleted or never existed.
    </p>
    <button
      onClick={handleBack}
      className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg"
    >
      Go back
    </button>
  </div>)}
{!pending && errorStatus === 403 && (<div>
  <h1 className={`${CENTER} ${SECTION} text-emerald-800`}>🚫 You don’t have permission to view this story.</h1>
     <h1 className={`${CENTER} ${SECTION}`}>Took a wrong turn</h1>
  </div>)}
  {!pending && !errorStatus && !canUserSee && (
  <h1 className={`${CENTER} ${SECTION}`}>
    🚫 You can’t view this story
  </h1>
)}



  </div>
</div>

      </IonContent>
    </ErrorBoundary>
  );
}
function PageViewSkeleton() {
  return (
    <div className={`${WRAP} animate-pulse`}>
  <div className="bg-slate-50 rounded-xl shadow-inner min-h-[40em]" />
</div>  );
}