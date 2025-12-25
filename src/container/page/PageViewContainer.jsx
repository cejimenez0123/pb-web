import { useNavigate, useParams } from "react-router-dom";
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
import { initGA } from "../../core/ga4.js";
import useScrollTracking from "../../core/useScrollTracking.jsx";
import checkResult from "../../core/checkResult.js";
import { IonBackButton, IonContent, IonHeader } from "@ionic/react";
import { setComments } from "../../actions/PageActions.jsx";
import Paths from "../../core/paths.js";
import { Capacitor } from "@capacitor/core";

export default function PageViewContainer() {
  const { setSeo, seo, setError, currentProfile } = useContext(Context);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const page = useSelector((state) => state.pages.pageInView);
  const comments = useSelector((state) => state.comments.comments);

  const [pending, setPending] = useState(true);
  const [canUserSee, setCanUserSee] = useState(false);
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
  }, [id]);

  const fetchStory = async () => {

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
       
          } else {
            throw new Error("Story not found");
          }
        },
        (err) => {
          // Handle forbidden specifically
          if (err?.response?.status === 403) {
            // setCanUserSee(false);
            setErrorStatus(403);
          } else {
            setError(err.message || "Failed to load story");
            setErrorStatus(err?.response?.status || 500);
          }

        }
           )});

    } catch (error) {
      if (error?.response?.status === 403) {
        setErrorStatus(403);

      } else {
        setError(error.message);
      
        setErrorStatus(500);
      }
    }
  };
  const soCanUserSee=()=>{
    
    if ( page?.isPrivate) {
      if (!currentProfile) {
        return false;
      }
      if (currentProfile.id === page.authorId) {
        return true;
      }
    }else if(!page.isPrivate){
return true;
    }else{
     
      let canSee = page.betaReaders.find((br) => {
        if (currentProfile && br.profileId === currentProfile.id) {
          return true;
        }
      });
      if(canSee){
      return true;
      }
    }

  }
  useEffect(() => {
    setPending(true);
    page && setCanUserSee(soCanUserSee())
    setPending(false);
  },[page])
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(Paths.discovery());
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
      <div className="bg-emerald-100 min-h-[100%]">
      <IonContent fullscreen={true}  scrollY={true}>

      
        <IonHeader className=" ">
             <div className="bg-emerald-100 pt-12">{Capacitor.isNativePlatform()||true?<IonBackButton
             className="ion-padding-start "
      onClick={handleBack}
    />:null}</div>  </IonHeader>
       
        <div className=" text-center py-[4em]  bg-emerald-100 mx-auto" style={{height:"100%",margin:"auto auto",paddingBottom: "5rem" ,}}>
          {pending ? (
            <div className="skeleton mx-auto bg-slate-50 max-w-[96vw] mx-auto md:w-page h-page" />
          ) : errorStatus === 403 ? (
            <div className="flex  mx-auto md:w-50 px-8 h-page">
              <h1 className="mont-medium my-12 mx-auto text-center text-emerald-800">
                🚫 You don’t have permission to view this story.
              </h1>
            </div>
          ) : canUserSee ? (
            <div className="w-fit  bg-emerald-100  mx-auto sm:max-w-[50em]">
              <PageDiv page={page} />
             <div className="text-left px-4  py-4"> <h6 className="text-[1em] font-bold">Responses</h6></div>
              <CommentThread page={page} comments={rootComments} />
        
           </div>
          ) : (
            <div className="flex max-w-[96vw] mx-auto sm:w-page h-page">
              <h1 className="mont-medium my-12 mx-auto">Took a wrong turn</h1>
            </div>
          )}
        </div>
       
        
      </IonContent>
      </div>
    </ErrorBoundary>
  );
}
