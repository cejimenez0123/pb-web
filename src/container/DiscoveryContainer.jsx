import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useLayoutEffect, useContext } from 'react';
import '../styles/Discovery.css';
import '../Dashboard.css';
import ErrorBoundary from '../ErrorBoundary.jsx';
import { getPublicStories, setPagesInView } from '../actions/PageActions.jsx';
import { getPublicCollections, setCollections } from '../actions/CollectionActions.js';
import { getPublicLibraries } from '../actions/LibraryActions.jsx';
import checkResult from '../core/checkResult.js';
import DiscoveryEmbed from '../container/DiscoveryEmbed.jsx';
import { useMediaQuery } from 'react-responsive';
import DashboardEmbed from './DashboardEmbed.jsx';
import { AnimatePresence, motion } from "framer-motion";
import BookListItem from '../components/BookListItem.jsx';
import calendar from '../images/icons/calendar.svg'
import { initGA, sendGAEvent } from '../core/ga4.js';
import ListView from '../components/page/ListView.jsx';
import ScrollDownButton from '../components/ScrollDownButton.jsx';
import Context from '../context.jsx';
import {  useNavigate } from 'react-router-dom';
import Paths from '../core/paths.js';
import useScrollTracking from '../core/useScrollTracking.jsx';
import sortItems from '../core/sortItems.js';
import {  IonContent,IonButton,IonImg, IonList, IonItem, IonInfiniteScroll, IonText } from '@ionic/react';

function DiscoveryContainer() {
  const { seo,setSeo } = useContext(Context);
  const  currentProfile = useSelector(state=>state.users.currentProfile)
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const [tab, setTab] = useState("disc");
  const cols = useSelector(state => state.books.collections);
  const books = useSelector(state => state.books.books);
  const libraries = useSelector(state => state.books.libraries);
  const pagesInView = useSelector(state => state.pages.pagesInView);

  const [hasMoreLibraries, setHasMoreLibraries] = useState(false);
  const [viewItems, setViewItems] = useState([]);

  const isNotPhone = useMediaQuery({ query: '(min-width: 999px)' });

  useScrollTracking({ name: 'discovery' });
  useLayoutEffect(() => {
    initGA();
  }, []);

  useLayoutEffect(() => {
    setSeo({
      title: 'Plumbum (Discovery) - Read Fresh Writing',
      description: 'Explore events, workshops, and writer meetups on Plumbum.',
      name: 'Plumbum',
      type: '',
    });
  }, [setSeo]);

  useLayoutEffect(() => {
    dispatch(setPagesInView({ pages: [] }));
    fetchContentItems();
    fetchLibraries();
  }, [currentProfile, dispatch]);



  useEffect(() => {
    let finalList = sortItems(
      pagesInView,
      cols.filter(item => item && item.storyIdList && item.storyIdList.length > 0)
    );
    setViewItems(finalList);
  }, [pagesInView, cols]);

 
  const fetchContentItems = () => {
    dispatch(setPagesInView({ pages: [] }));
    dispatch(setCollections({ collections: [] }));
    dispatch(getPublicStories());
    dispatch(getPublicCollections());
  };

  const fetchLibraries = () => {
    setHasMoreLibraries(true);
    dispatch(getPublicLibraries())
      .then(result =>
        checkResult(
          result,
          payload => setHasMoreLibraries(false),
          err => setHasMoreLibraries(false)
        )
      )
      .catch(() => setHasMoreLibraries(false));
  };


const libraryForums = () => {
  if (!libraries) return null;

  return (
    <div className="">
      <IonText
        className={`text-emerald-900 ${
          isNotPhone ? 'ml-16 pl-6' : 'ml-16'
        } mb-4 lora-bold font-extrabold text-2xl`}
      >
        Communities
      </IonText>

      {/* Horizontal scroll area */}
      <div className="mb-4">
        <div className="flex flex-row overflow-x-auto overflow-y-clip h-[14rem] space-x-4 px-4 no-scrollbar">
          {libraries.map((library) => (
            <IonItem
              key={library.id}
              className=" flex-shrink-0 border-none bg-transparent"
            >
              <BookListItem book={library} />
            </IonItem>
          ))}
        </div>
      </div>
    </div>
  );
};

  const bookList = () => {
    // if (!books) return null;
    return (
      <div className='h-[14rem]'>
        <h3 className="text-emerald-900 text-left font-extrabold ml-16 lora-bold mb-4 text-2xl">
          Collections
        </h3>
<div className="mb-4">
        <div className="flex flex-row overflow-x-auto overflow-y-clip h-[14rem] space-x-4 px-4 no-scrollbar">
         
          {books.map((book, i) => {
            const id = `${book.id}_${i}`;
            return (
              <IonItem key={id} className="mx-3 h-[10rem]">
                <BookListItem book={book} />
              </IonItem>
            );
          })}
    </div>
    </div>
      </div>
    );
  };



  return (
  
      <ErrorBoundary>

        <IonContent fullscreen={true} scrollY>
            <div className=' '>
                 <div className='flex  sm:mt-36 pt-24 flex-row justify-end'>

          <img src={calendar}   onClick={()=>{navigate(Paths.calendar())}}
          className='  p-4 absolute  top-8 sm:top-32  min-w-20 max-h-24 mas-w-24 min-h-20 sm:right-12   '/>
                    </div>
  <DiscDashTabs tab={tab} setTab={setTab} disc={() =><DiscoveryEmbed/>} dash={()=><DashboardEmbed />} />
        </div>
 
          
        </IonContent>
     
      </ErrorBoundary>

  );
}

export default DiscoveryContainer;




 function DiscDashTabs({ tab, setTab, disc, dash}) {
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 20 : -20, // smaller distance for tighter slide
      opacity: 0,
      position: "absolute",
      width: "100%",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
      width: "100%",
    },
    exit: (direction) => ({
      x: direction > 0 ? -20 : 20,
      opacity: 0,
      position: "absolute",
      width: "100%",
    }),
  };

  const handleSwipe = (event, info) => {
    const swipe = info.offset.x;
    if (swipe < -50 && tab === "disc") setTab("disc");
    if (swipe > 50 && tab === "dash") setTab("dash");
  };

  return (
    <div className="flex h-full flex-col w-full">
      {/* Tabs */}
      <div className="flex justify-center mb-2">
        <div className="flex rounded-full border border-emerald-600 overflow-hidden">
          <button
            className={`px-4 py-2 transition-colors ${
              tab === "page"
                ? "bg-emerald-700 text-white"
                : "text-emerald-700 bg-transparent"
            }`}
            onClick={() => setTab("disc")}
          >
            Discovery
          </button>
          <button
            className={`px-4 py-2 transition-colors ${
              tab === "collection"
                ? "bg-emerald-700 text-white"
                : "text-emerald-700 bg-transparent"
            }`}
            onClick={() => setTab("dash")}
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Animated, Swipeable Content */}
      <div className="relative overflow-hidden w-full">
        <AnimatePresence custom={tab === "collection" ? 1 : -1} mode="wait">
          <motion.div
            key={tab}
            custom={tab === "collection" ? 1 : -1}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.26, // faster
              ease: "easeOut", // more responsive
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleSwipe}
            className="w-full"
          >
            {tab === "disc" ? disc() :dash()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

