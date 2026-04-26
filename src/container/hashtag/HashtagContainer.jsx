
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useLayoutEffect, useContext, useMemo } from "react";
import { IonContent, useIonRouter } from "@ionic/react";
import ErrorBoundary from "../../ErrorBoundary";
import checkResult from "../../core/checkResult";
import { useMediaQuery } from "react-responsive";
import { BookListItem } from "../../components/collection/BookListItem";
import DashboardItem from "../../components/page/DashboardItem";
import { initGA, sendGAEvent } from "../../core/ga4.js";
import { fetchHashtag, followHashtag, unfollowHashtag } from "../../actions/HashtagActions";
import { setCollections } from "../../actions/CollectionActions";
import { appendToPagesInView, setPagesInView } from "../../actions/PageActions.jsx";
import Context from "../../context";
import useScrollTracking from "../../core/useScrollTracking.jsx";
import Paths from "../../core/paths.js";
import grid from "../../images/grid.svg";
import stream from "../../images/stream.svg";
import { useParams } from "react-router";
import SectionHeader from "../../components/SectionHeader.jsx";
import getBackground from "../../core/getbackground.jsx";
import ExploreList from "../../components/collection/ExploreList.jsx";

export default function HashtagContainer() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useIonRouter();
  const { setError, seo, setSeo, isPhone } = useContext(Context);
  const currentProfile = useSelector(state => state.users.currentProfile);
  const collections = useSelector((state) => state.books.collections);
  const pagesInView = useSelector((state) => state.pages.pagesInView);
  const [hashtag, setHashtag] = useState(null);
  const [pending, setPending] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followPending, setFollowPending] = useState(false);
  const [isGrid, setIsGrid] = useState(false);
  const isNotPhone = useMediaQuery({ query: "(min-width: 999px)" });

  useScrollTracking({ name: id });

  const books = useMemo(
    () => collections.filter((col) => col && col.childCollections?.length === 0),
    [collections]
  );
  const libraries = useMemo(
    () => collections.filter((col) => col && col.childCollections?.length > 0),
    [collections]
  );

  useLayoutEffect(() => {
    initGA();
    if (hashtag) {
      sendGAEvent("View Page", `View Hashtag ${JSON.stringify({ id: hashtag.id, name: hashtag.name })}`, hashtag.name);
      setSeo({ ...seo, title: `Plumbum Hashtag (${hashtag.name}) - Your Writing, Your Community` });
    }
  }, [hashtag]);

  useLayoutEffect(() => { getHashtag(); }, [id]);
  useEffect(() => { if (!isNotPhone) setIsGrid(false); }, [isNotPhone]);

  const getHashtag = async () => {
    setPending(true);
    dispatch(setCollections({ collections: [] }));
    dispatch(setPagesInView({ pages: [] }));
    try {
      const res = await dispatch(fetchHashtag({ id }));
      checkResult(res, (payload) => {
        const { hashtag } = payload;
        if (!hashtag) return setError("No hashtag found");
        setHashtag(hashtag);
        setFollowing(!!hashtag.followers?.some(f => f.followerId === currentProfile?.id));
        dispatch(setPagesInView({ pages: hashtag.stories.map((s) => s.story) }));
        dispatch(setCollections({ collections: hashtag.collections.map((c) => c.collection) }));
        hashtag.collections.forEach((c) => {
          dispatch(appendToPagesInView({ pages: c.collection.storyIdList.map((s) => s.story) }));
        });
        setPending(false);
      }, (err) => {
        setError(err);
        setPending(false);
      });
    } catch (err) {
      setError(err.message);
      setPending(false);
    }
  };

  const handleFollow = async () => {
    if (!currentProfile) return router.push(Paths.login);
    setFollowPending(true);
    try {
      if (following) {
        await dispatch(unfollowHashtag({ hashtagId: hashtag.id }));
        setFollowing(false);
      } else {
        await dispatch(followHashtag({ hashtagId: hashtag.id }));
        setFollowing(true);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setFollowPending(false);
    }
  };

  return (
   
      <IonContent
        fullscreen
        style={{
          ...getBackground(),
      
          "--min-height":"100%"
        }}
      >
        <ErrorBoundary>
        <div className="text-left bg-cream dark:bg-base-bgDark pb-34 pt-20">

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-4">
            <h1 className="text-2xl font-bold text-soft dark:text-cream">
              #{hashtag?.name}
            </h1>
            {currentProfile && (
              <button
                onClick={handleFollow}
                disabled={followPending}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95
                  ${followPending ? "opacity-50 pointer-events-none" : ""}
                  ${following
                    ? "bg-base-surface dark:bg-transparent border border-soft text-soft dark:text-cream"
                    : "bg-blue dark:bg-transparent border border-blue text-cream"
                  }`}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {followPending ? "..." : following ? "Following" : "Follow"}
              </button>
            )}
          </div>

          {/* Libraries */}
          {libraries.length > 0 && (
            <div className="w-full min-h-[14rem]">
              <SectionHeader title="Communities" />
              <div className="flex flex-row overflow-x-auto space-x-4 px-4 no-scrollbar pb-2">
                {libraries.map((library) => (
                  <BookListItem key={library.id} book={library} />
                ))}
              </div>
            </div>
          )}

          {/* Collections */}
          <div className="w-full min-h-[14rem]">
            <SectionHeader title="Collections" />
            {pending ? <SkeletonList /> : books.length === 0 ? (
              <EmptyState hashtag={hashtag} />
            ) : (
              <div className="space-y-3">
                {books.map((book, i) => (
                  <div className="my-2 mx-4" key={`${book.id}_${i}`}>
                    <BookListItem book={book} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pages */}
          <div className="flex flex-col max-w-[96vw] md:w-page mx-auto">
            <SectionHeader title="Pages" />
            {isNotPhone && (
              <div className="flex flex-row pb-4 px-4 gap-2">
                <button
                  onClick={() => setIsGrid(true)}
                  className={`p-2 rounded-lg transition-colors ${isGrid ? "bg-base-soft" : "bg-transparent"}`}
                >
                  <img src={grid} className="w-5 h-5" alt="grid view" />
                </button>
                <button
                  onClick={() => setIsGrid(false)}
                  className={`p-2 rounded-lg transition-colors ${!isGrid ? "bg-base-soft" : "bg-transparent"}`}
                >
                  <img src={stream} className="w-5 h-5" alt="stream view" />
                </button>
              </div>
            )}
          </div>

          <div className="max-w-screen ">
            {pending ? <SkeletonList /> : pagesInView.length === 0 ? (
              <EmptyState hashtag={hashtag} />
            ) : (
              <div className={`px-4 ${isGrid ? "grid grid-cols-2 gap-2" : "space-y-3"}`}>
                {pagesInView.filter(Boolean).map((page, i) => (
                  <div key={`${page.id}_${i}`} className="break-inside-avoid mb-4">
                    <DashboardItem item={page} index={i} isGrid={isGrid} page={page} />
                  </div>
                ))}
              </div>
            )}
          </div>
            <div className="pb-24">
              <ExploreList />
            </div>
        </div>
        </ErrorBoundary>
      </IonContent>

  );
}

const EmptyState = ({ hashtag }) => (
  <div className="flex flex-col items-center justify-center text-center py-12">
    <h2 className="text-lg font-medium text-soft dark:text-cream">
      No posts for #{hashtag?.name}
    </h2>
    <p className="text-sm text-soft dark:text-cream opacity-60 mt-1 max-w-sm">
      Be the first to start the conversation.
    </p>
  </div>
);

const SkeletonItem = () => (
  <div className="bg-base-bg rounded-xl border border-soft p-4 animate-pulse">
    <div className="h-4 bg-base-soft rounded w-2/3 mb-3" />
    <div className="h-3 bg-base-soft rounded w-1/2 mb-2" />
    <div className="h-3 bg-base-soft rounded w-1/3" />
  </div>
);

const SkeletonList = () => (
  <div className="space-y-3 px-4">
    {[...Array(5)].map((_, i) => <SkeletonItem key={i} />)}
  </div>
);