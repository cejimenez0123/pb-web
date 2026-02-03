import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useLayoutEffect, useContext, useMemo } from "react";

import { IonContent, IonInfiniteScroll,IonHeader,IonToolbar,IonButtons,IonBackButton,IonItem, IonTitle, useIonRouter } from "@ionic/react";
import ErrorBoundary from "../../ErrorBoundary";
import checkResult from "../../core/checkResult";
import { useMediaQuery } from "react-responsive";
import BookListItem from "../../components/BookListItem";
import DashboardItem from "../../components/page/DashboardItem";
import { initGA, sendGAEvent } from "../../core/ga4.js";
import { fetchHashtag } from "../../actions/HashtagActions";
import { setCollections } from "../../actions/CollectionActions";
import { appendToPagesInView, setPagesInView } from "../../actions/PageActions.jsx";
import Context from "../../context";
import useScrollTracking from "../../core/useScrollTracking.jsx";
import Paths from "../../core/paths.js";
import grid from "../../images/grid.svg";
import stream from "../../images/stream.svg";
import loadingGif from "../../images/loading.gif";

export default function HashtagContainer() {

  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useIonRouter()
  const { setError, seo, setSeo } = useContext(Context);
  const handleBack = () => {
    if (window.history.length > 1) {
        router.goBack()
    } else {
      router.push(Paths.discovery);
    }
  };
  const collections = useSelector((state) => state.books.collections);
  const pagesInView = useSelector((state) => state.pages.pagesInView);

  const [hash, setHashtag] = useState(null);
  const [hasMoreLibraries, setHasMoreLibraries] = useState(true);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isGrid, setIsGrid] = useState(false);

  const isNotPhone = useMediaQuery({ query: "(min-width: 999px)" });

  useScrollTracking({ name: id });

  /** Derived lists */
  const books = useMemo(
    () =>
      collections.filter(
        (col) => col && col.childCollections && col.childCollections.length === 0
      ),
    [collections]
  );

  const libraries = useMemo(
    () =>
      collections.filter(
        (col) => col && col.childCollections && col.childCollections.length > 0
      ),
    [collections]
  );

  /** Initialize analytics & SEO */
  useLayoutEffect(() => {
    initGA();
    if (hash) {
      sendGAEvent(
        "View Page",
        `View Hashtag ${JSON.stringify({ id: hash.id, name: hash.name })}`,
        hash.name
      );
      setSeo({
        ...seo,
        title: `Plumbum Hashtag (${hash.name}) - Your Writing, Your Community`,
      });
    }
  }, [hash]);

  /** Fetch hashtag data */
  const getHashtag = async () => {
    try {
      dispatch(setCollections({ collections: [] }));
      dispatch(setPagesInView({ pages: [] }));

      const res = await dispatch(fetchHashtag({ id }));
      checkResult(
        res,
        (payload) => {
          const { hashtag } = payload;
          if (!hashtag) return setError("No hashtag found");

          setHashtag(hashtag);
          dispatch(setPagesInView({ pages: hashtag.stories.map((s) => s.story) }));
          dispatch(setCollections({ collections: hashtag.collections.map((c) => c.collection) }));
          hashtag.collections.forEach((c) => {
            const stories = c.collection.storyIdList.map((sTc) => sTc.story);
            dispatch(appendToPagesInView({ pages: stories }));
          });

          setHasMoreLibraries(false);
          setHasMoreBooks(false);
          setHasMorePages(false);
        },
        (err) => {
          setError(err);
          setHasMoreLibraries(false);
          setHasMoreBooks(false);
          setHasMorePages(false);
        }
      );
    } catch (err) {
      setError(err.message);
    }
  };

  /** Load data on mount or ID change */
  useLayoutEffect(() => {
    getHashtag();
  }, [id]);

  /** Auto toggle grid view on screen resize */
  useEffect(() => {
    if (!isNotPhone) setIsGrid(false);
  }, [isNotPhone]);

  /** Grid toggle handler */
  const onClickForGrid = (bool) => {
    setIsGrid(bool);
    sendGAEvent(
      "Click",
      `Click for ${bool ? "Grid" : "Stream"} View on Hashtag Page`,
      bool ? "Grid Icon" : "Stream Icon"
    );
  };

  /** Library (Community) section */
  const renderLibraries = () => {
  if(libraries.length==0){
    return
  }
    return (
  <div className="w-full  h-[14rem]">
        <h3 className="text-emerald-900 font-extrabold lora-bold text-2xl ml-14 md:ml-16 mb-4">
          Communities
        </h3>
       <div className="mb-4">
        <div className="flex flex-row overflow-x-auto overflow-y-clip sh-[12rem] space-x-4 px-4 no-scrollbar">
            {libraries.map((library) => (
              <IonItem key={library.id} className="mx-3">
                <BookListItem book={library} />
              </IonItem>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /** Books (Collections) section */
  const renderBooks = () => (
    <div className="w-full  h-[14rem]">
        <h3 className="text-emerald-900 text-left font-extrabold ml-14 lora-bold mb-4 text-2xl">
          Collections
        </h3>
      <div className="mb-12">
        <div className="flex flex-row overflow-x-auto overflow-y-clip min-h-[14rem] space-x-4 px-4 no-scrollbar">
        
        {books.map((book, i) => (
          <IonItem  className="my-auto mx-4  " key={`${book.id}_${i}`}>
            <BookListItem book={book} />
          </IonItem>
        ))}
        </div>
        </div>

    </div>
  );

  /** Individual story pages */
  const renderPages = () => (
    <div className="w-[96vw] md:w-page mx-auto">
      <IonInfiniteScroll
        dataLength={pagesInView.length}
        hasMore={hasMorePages}
        scrollThreshold={1}
        endMessage={
          <div className="flex">
            <h2 className="mx-auto my-12 text-emerald-800 lora-medium">
              You can write for this hashtag.<br />
              Add a hashtag to your work.
            </h2>
          </div>
        }
        loader={
          <div className="flex">
            <img className="max-h-36 mx-auto my-12 max-w-36" src={loadingGif} />
          </div>
        }
      >
        <div className={`${isGrid ? "grid grid-cols-2 gap-2" : ""}`}>
          {pagesInView.filter(Boolean).map((page, i) => (
            <div key={`${page.id}_${i}`} className="break-inside-avoid mb-4 auto-cols-min">
              <DashboardItem item={page} index={i} isGrid={isGrid} page={page} />
            </div>
          ))}
        </div>
      </IonInfiniteScroll>
    </div>
  );

  return (
    <ErrorBoundary>
   
             <IonHeader translucent>
          <IonToolbar className="flex flex-row">
            <IonButtons>
              <IonBackButton 
              onClick={handleBack}
              defaultHref={Paths.collection.createRoute(id)}
      />
            </IonButtons>
            <IonTitle slot="end" className="ml-8 ion-text-center">
              {hash?"#"+hash.name:"hashtag"}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
       

            <div className="text-left">
              { renderLibraries()}
              {renderBooks()}

              <div className="flex flex-col max-w-[96vw] md:w-page mx-auto">
                <h3 className="text-emerald-900 font-extrabold text-2xl text-left lora-bold my-4">
                  Pages
                </h3>
                {isNotPhone && (
                  <div className="flex flex-row pb-8">
                    <button
                      onClick={() => onClickForGrid(true)}
                      className="bg-transparent ml-2 px-1 border-none py-0"
                    >
                      <img src={grid} />
                    </button>
                    <button
                      onClick={() => onClickForGrid(false)}
                      className="bg-transparent border-none px-1 py-0"
                    >
                      <img src={stream} />
                    </button>
                  </div>
                )}
              </div>

              <div className="max-w-screen">{renderPages()}</div>
            </div>
          {/* </div> */}
        {/* </IonContent> */}
      {/* </IonPage> */}
    </ErrorBoundary>
  );
}
