import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useLayoutEffect, useContext } from 'react';
import '../styles/Discovery.css';
import '../Dashboard.css';
import ErrorBoundary from '../ErrorBoundary';
import { getPublicStories, setPagesInView } from '../actions/PageActions';
import { getPublicCollections, setCollections } from '../actions/CollectionActions';
import { getPublicLibraries } from '../actions/LibraryActions.jsx';
import checkResult from '../core/checkResult';
import { useMediaQuery } from 'react-responsive';
import BookListItem from '../components/BookListItem';
import grid from '../images/grid.svg';
import stream from '../images/stream.svg';
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

  const cols = useSelector(state => state.books.collections);
  const books = useSelector(state => state.books.books);
  const libraries = useSelector(state => state.books.libraries);
  const pagesInView = useSelector(state => state.pages.pagesInView);

  const [isGrid, setIsGrid] = useState(false);
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

  // useEffect(() => {
  //   if (!isNotPhone) {
  //     setIsGrid(false);
  //   }
  // }, [isNotPhone]);

  useEffect(() => {
    let finalList = sortItems(
      pagesInView,
      cols.filter(item => item && item.storyIdList && item.storyIdList.length > 0)
    );
    setViewItems(finalList);
  }, [pagesInView, cols]);

  // Fetch functions

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

  // const onClickForGrid = bool => {
  //   setIsGrid(bool);
  //   if (bool) {
  //     sendGAEvent('Click Grid View Discovery', 'Click Grid View Discovery', 'Grid Icon', 0);
  //   } else {
  //     sendGAEvent('Click Stream View Discovery', 'Click Stream View Discovery', 'Stream Icon', 0);
  //   }
  // };

  return (
  
      <ErrorBoundary>
   
        <IonContent fullscreen={true} scrollY>
      
          <div className="text-left  mt-12">
            {libraryForums()}
          </div>

          <div className="mb-12">{bookList()}</div>

          <div className="flex max-w-[96vw] md:w-[50em] mx-auto flex-col">
            <div className="flex flex-row items-center justify-between">
              <h3 className="text-emerald-900 font-extrabold text-2xl text-left mx-4 lora-bold my-4 lg:mb-4">
                Pages
              </h3>

              {/* {isNotPhone ? (
                <div className="flex flex-row">
                  <IonButton
                    fill="clear"
                    onClick={() => onClickForGrid(true)}
                    className="p-0 ml-2 mr-0"
                    aria-label="Grid view"
                  >
                    <IonImg src={grid} style={{ width: '24px', height: '24px' }} />
                  </IonButton>
                  <IonButton
                    fill="clear"
                    onClick={() => onClickForGrid(false)}
                    className="p-0"
                    aria-label="Stream view"
                  >
                    <IonImg src={stream} style={{ width: '24px', height: '24px' }} />
                  </IonButton>
                </div>
              ) : null} */}
            </div>
          </div>

          <span className="flex justify-center mx-auto sm:max-w-[50rem]">
            <ListView items={viewItems} />
          </span>

          <div className="lg:flex-1 lg:mx-4" />

          {!currentProfile ? (
            <ScrollDownButton
              text="Join the community"
              onClick={() => {
                sendGAEvent('Navigate to Apply', 'Navigate to Apply', 'Join the community', 0, false);
                navigate(Paths.apply());
              }}
            />
          ) : null}
         
        </IonContent>
      </ErrorBoundary>

  );
}

export default DiscoveryContainer;
