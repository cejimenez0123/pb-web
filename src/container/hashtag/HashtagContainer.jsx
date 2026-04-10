import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useLayoutEffect, useContext, useMemo } from "react";

import { IonContent, IonInfiniteScroll,IonItem,  useIonRouter } from "@ionic/react";
import ErrorBoundary from "../../ErrorBoundary";
import checkResult from "../../core/checkResult";
import { useMediaQuery } from "react-responsive";
import {BookListItem} from "../../components/BookListItem";
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
import { useParams } from "react-router";
import SectionHeader from "../../components/SectionHeader.jsx";
import Enviroment from "../../core/Enviroment.js"
import { motion, AnimatePresence } from "framer-motion";;
// Layout
const containerBase = "mx-auto w-full md:w-page";
const containerSpacing = "px-3 md:px-4 pb-16 pt-2";
const sectionSpacing = "mb-6";

// Cards / items
const itemBase = "bg-white rounded-xl border border-gray-200 shadow-sm";
const itemPadding = "p-4";
const itemSpacing = "space-y-3";

// Text
const titleStyle = "text-xl font-semibold text-gray-900";
const subtitleStyle = "text-sm text-gray-500";

// States
const centerState = "flex flex-col items-center justify-center text-center py-12";

export default function HashtagContainer() {

  const { id } = useParams()
  const dispatch = useDispatch();
  const router = useIonRouter()
  const { setError, seo, setSeo,isPhone } = useContext(Context);
const [pending,setPending]=useState(false)
  const collections = useSelector((state) => state.books.collections);
  const pagesInView = useSelector((state) => state.pages.pagesInView);

  const [hashtag, setHashtag] = useState(null);
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
console.log("BOOKS",books)
console.log("LIBRARIEs",libraries)
  /** Initialize analytics & SEO */
  useLayoutEffect(() => {
    initGA();
    if (hashtag) {
      sendGAEvent(
        "View Page",
        `View Hashtag ${JSON.stringify({ id: hashtag.id, name: hashtag.name })}`,
       hashtag.name
      );
      setSeo({
        ...seo,
        title: `Plumbum Hashtag (${hashtag.name}) - Your Writing, Your Community`,
      });
    }
  }, [hashtag]);

  /** Fetch hashtag data */
  const getHashtag = async () => {
    try {
      setPending(true)
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
setPending(false)
        },
        (err) => {
          setError(err);
          setHasMoreLibraries(false);
          setHasMoreBooks(false);
          setHasMorePages(false);
          setPending(false)
        }
      );
    } catch (err) {
      setError(err.message);
    }
  };

  /** Load data on mount or ID change */
  useLayoutEffect(() => {
    getHashtag();
  }, [id])

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
        {/* <h3 className="text-emerald-900 font-extrabold lora-bold text-2xl ml-14 md:ml-16 mb-4">
          Communities
        </h3> */}
        <SectionHeader title={"Communities"}/>
       <div className="mb-4">
        <div className="flex flex-row overflow-x-auto bg-cream overflow-y-clip sh-[12rem] space-x-4 px-4 no-scrollbar">
            {libraries.map((library) => (
              // <IonItem key={library.id} className="mx-3">
                <BookListItem book={library} />
              // </IonItem>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /** Books (Collections) section */
  const renderBooks = () => (
    <div className="w-full  h-[14rem]">
      
        <SectionHeader title="Collections"/>
        <AnimatePresence mode="wait">
  {pending ? (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <SkeletonList />
    </motion.div>
  ) : books.length === 0 ? (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <EmptyState hashtag={hashtag} />
    </motion.div>
  ) : (
    <motion.div
      key="content"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={itemSpacing}
    >
          {books.map((book, i) => (
          <IonItem  className="my-auto mx-4  " key={`${book.id}_${i}`}>
            <BookListItem book={book} />
          </IonItem>
        ))}
    </motion.div>
  )}
</AnimatePresence>
  

    </div>
  );

  /** Individual story pages */
  const renderPages = () => (
    <AnimatePresence mode="wait">
  {pending ? (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <SkeletonList />
    </motion.div>
  ) : pagesInView.length === 0 ? (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <EmptyState hashtag={hashtag} />
    </motion.div>
  ) : (
    <motion.div
      key="content"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={itemSpacing}
    >
      { <div className={`px-4 ${isGrid ? "grid grid-cols-2 gap-2" : ""}`}>
          {pagesInView.filter(Boolean).map((page, i) => (
            <div key={`${page.id}_${i}`} className="break-inside-avoid mb-4 auto-cols-min">
              <DashboardItem item={page} index={i} isGrid={isGrid} page={page} />
            </div>
          ))}
        </div>}
    </motion.div>
  )}
</AnimatePresence>

  );

  return (
    <ErrorBoundary>
   <IonContent  fullscreen style={{"--padding-bottom":"15em",'--padding-top':isPhone?"4em":"10em", '--background': Enviroment.palette.cream  }}>
            
       

            <div className="text-left">
              { renderLibraries()}
              {renderBooks()}

              <div className="flex flex-col max-w-[96vw] md:w-page mx-auto">
                {/* <h3 className="text-emerald-900 font-extrabold text-2xl text-left lora-bold my-4">
                  Pages
                </h3> */}
                <SectionHeader title={"Pages"}/>
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
     
      </IonContent>
    </ErrorBoundary>
  );
}

const EmptyState = ({ hashtag }) => (
  <div className={centerState}>
    

    <h2 className="text-lg font-medium text-gray-800">
      No posts for #{hashtag?.name}
    </h2>

    <p className="text-sm text-gray-500 mt-1 max-w-sm">
      Be the first to start the conversation. Share something and shape what this space becomes.
    </p>
  </div>
);
const SkeletonItem = () => (
  <div className={`${itemBase} ${itemPadding} animate-pulse`}>
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
    <div className="h-3 bg-gray-200 rounded w-1/3" />
  </div>
);

const SkeletonList = () => (
  <div className={itemSpacing}>
    {[...Array(5)].map((_, i) => (
      <SkeletonItem key={i} />
    ))}
  </div>
);