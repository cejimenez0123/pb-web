
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

export default function PageViewContainer() {
  const { setSeo, seo, setError } = useContext(Context);
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useIonRouter();
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const page = useSelector((state) => state.pages.pageInView);
  const comments = useSelector((state) => state.comments.comments);

  const [canUserSee, setCanUserSee] = useState(false);
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
            setPending(false);
            if (err?.response?.status === 403) setErrorStatus(403);
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
  }, [id, currentProfile]);

  useEffect(() => {
    if (comments?.length) {
      setRootComments(comments.filter((c) => c && !c.parentId));
    }
  }, [comments]);

  useEffect(() => {
    if (page) {
      setSeo({ ...seo, title: page.title, description: page.description });
      const canSee = !page.isPrivate || page?.authorId === currentProfile?.id;
      setCanUserSee(canSee);
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
        style={{ "--background": "#f4f4e0" }}
      >
        <div className="min-h-[40em] pt-4 pb-[8em] text-center">
          {pending ? (
            <div className="skeleton mx-auto bg-slate-50 w-[95vw] md:w-[50em] h-page" />
          ) : errorStatus === 403 ? (
            <h1 className="mont-medium text-emerald-800 my-12">🚫 You don’t have permission to view this story.</h1>
          ) : canUserSee ? (
            <div className="w-fit mx-auto sm:max-w-[50em] bg-cream p-4 rounded-xl shadow-sm">
              <PageViewItem page={page} currentProfile={currentProfile} />
              <div className="mt-8 mb-4 text-left">
                <h6 className="text-[1em] font-bold text-emerald-800">Responses</h6>
              </div>
              <CommentThread page={page} comments={rootComments} rawComments={comments}/>
            </div>
          ) : (
            <h1 className="mont-medium my-12 mx-auto">Took a wrong turn</h1>
          )}
        </div>
      </IonContent>
    </ErrorBoundary>
  );
}