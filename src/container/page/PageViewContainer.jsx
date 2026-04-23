import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useLayoutEffect, useEffect, useContext, useMemo } from "react";
import { IonContent, useIonRouter } from "@ionic/react";
import PageViewItem from "../../components/page/PageViewItem";
import CommentThread from "../../components/comment/CommentThread";
import { getStory } from "../../actions/StoryActions";
import { fetchCommentsOfPage } from "../../actions/PageActions.jsx";
import ErrorBoundary from "../../ErrorBoundary";
import Context from "../../context";
import Paths from "../../core/paths.js";
import useScrollTracking from "../../core/useScrollTracking.jsx";
import checkResult from "../../core/checkResult.js";
import { initGA, sendGAEvent } from "../../core/ga4.js";
import Enviroment from "../../core/Enviroment.js";
import computePermissions from "../../core/compusePermissions.jsx";

// ── Module level — stable references, never recreated ─────────────────────────
const EMPTY_COMMENTS = [];

const STORY_CONFIG = {
  getOwnerId:    (r) => r.authorId,
  getAccessList: (r) => r.betaReaders ?? [],
  getAccessRole: (entry) => entry.role,
  isPrivate:     (r) => r.isPrivate,
  isOpen:        () => false,
  canWriteRoles: [],
  canEditRoles:  [],
};

// Layout
const WRAP    = "max-w-[50em] mx-auto px-4";
const SECTION = "pt-8 sm:pt-10 lg:pt-12";
const BLOCK   = "py-4";
const HEADING = "text-[1em] font-bold text-emerald-800 dark:text-emerald-300";
const CARD    = ["bg-[#f4f4e0] dark:bg-slate-900", "rounded-xl shadow-sm", "transition-colors duration-300"].join(" ");
const FADE    = "transition-opacity duration-500";
const CENTER  = "text-center mx-auto";

export default function PageViewContainer() {
  const { setError } = useContext(Context);
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useIonRouter();
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const page = useSelector((state) => state.pages.pageInView);

const { canSee, canAdd, canEdit } = useMemo(
  () => computePermissions(page, currentProfile, STORY_CONFIG),
  [page, currentProfile]  // ← add page
);
  // ── Stable selector — no ?? [] inside useSelector ────────────────────────
  const commentsRaw = useSelector((s) => s.comments.byStory?.[page?.id]);
  const comments = commentsRaw ?? EMPTY_COMMENTS;

  const [pending, setPending] = useState(true);
  const [rootComments, setRootComments] = useState([]);
  const [errorStatus, setErrorStatus] = useState(null);
  const isNative = useIonRouter();

  // ── Fetch comments ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!page?.id) return;
    dispatch(fetchCommentsOfPage({ id: page.id, isPublic: !currentProfile }));
  }, [page?.id]);

  // ── Derive root comments — one effect only ────────────────────────────────
  useEffect(() => {
    setRootComments(
      comments.length ? comments.filter((c) => c && !c.parentId) : []
    );
  }, [comments]);

  useScrollTracking({
    contentType:      "story",
    contentId:        page?.id,
    authorId:         page?.authorId,
    enableCompletion: canSee,
    completionEvent:  "story_read_complete",
  });

  useLayoutEffect(() => {
    initGA();
    fetchStory();
  }, [id]);

  // ── Unlock text selection inside Ionic shadow DOM ─────────────────────────
  useEffect(() => {
    const unlock = () => {
      document.querySelectorAll("ion-content").forEach((host) => {
        host.style.webkitUserSelect = "text";
        host.style.userSelect = "text";
        try {
          const inner = host.shadowRoot?.querySelector(".inner-scroll");
          if (inner) {
            inner.style.webkitUserSelect = "text";
            inner.style.userSelect = "text";
          }
        } catch (_) {}
        host.getScrollElement?.()
          .then((el) => {
            if (el) {
              el.style.webkitUserSelect = "text";
              el.style.userSelect = "text";
            }
          })
          .catch(() => {});
      });
    };
    const t = setTimeout(unlock, 200);
    return () => clearTimeout(t);
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
              setPending(false);
            } else throw new Error("Story not found");
          },
          (err) => {
            setPending(false);
            if (err?.response?.status === 404) {
              setErrorStatus(404);
              setError("Story not found");
            } else {
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

  const handleRefresh = () => window.location.reload();

  const handleBack = () => {
    sendGAEvent("story_exit_back", {
      story_id:  page?.id,
      exit_type: window.history.length > 1 ? "history_back" : "fallback_discovery",
    });
    window.history.length > 1
      ? router.goBack()
      : router.push(Paths.discovery, "back");
  };
// PageViewItem.jsx

  return (
    <ErrorBoundary>
      <IonContent
        fullscreen
        className="ion-padding-bottom"
        style={{ "--background": Enviroment.palette.cream }}
      >
        <div
          className="relative min-h-screen bg-[#f4f4e0] dark:bg-slate-950 transition-colors duration-300"
          style={{ WebkitUserSelect: "text", userSelect: "text" }}
        >
          {pending && <PageViewSkeleton />}

          <div className={`${FADE} ${pending ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            {(canSee || page?.authorId === currentProfile?.id) && (
              <div className={WRAP} style={{ WebkitUserSelect: "text", userSelect: "text" }}>
                <div className={`${CARD} ${BLOCK}`}>
                  <PageViewItem page={page} canEdit={canEdit}  currentProfile={currentProfile} />
                  <div className={SECTION}>
                    <h6 className={HEADING}>Responses</h6>
                  </div>
                  <CommentThread page={page} comments={rootComments} rawComments={comments} />
                </div>
              </div>
            )}

            {!pending && errorStatus === 404 && (
              <div className={`${CENTER} ${SECTION}`}>
                <h1 className="text-emerald-800 dark:text-emerald-300 font-bold text-lg">📖 Story not found</h1>
                <p className="text-sm mt-2 text-slate-500 dark:text-slate-400">It may have been deleted or never existed.</p>
                <button onClick={handleBack} className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors">
                  Go back
                </button>
              </div>
            )}

            {!pending && errorStatus === 403 && (
              <div className={`${CENTER} ${SECTION}`}>
                <h1 className="text-emerald-800 dark:text-emerald-300 font-bold">🚫 You don't have permission to view this story.</h1>
                <button onClick={handleRefresh} className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-none mt-4">Refresh</button>
              </div>
            )}

            {!pending && !errorStatus && !canSee && (
              <div className={`${CENTER} ${SECTION}`}>
                <h1 className="text-emerald-800 dark:text-emerald-300 font-bold">🚫 You can't view this story</h1>
                <button onClick={handleRefresh} className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-none mt-4">Refresh</button>
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </ErrorBoundary>
  );
}

function PageViewSkeleton() {
  return (
    <div className={`${WRAP} animate-pulse pt-6`}>
      <div className="bg-emerald-100/60 dark:bg-emerald-900/20 rounded-xl shadow-inner min-h-[40em]" />
    </div>
  );
}