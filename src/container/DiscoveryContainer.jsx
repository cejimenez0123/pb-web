
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useLayoutEffect, useContext } from 'react';
import '../styles/Discovery.css';
import '../Dashboard.css';
import { getPublicStories, setPagesInView } from '../actions/PageActions.jsx';
import { getPublicCollections, setCollections } from '../actions/CollectionActions.js';
import { getPublicLibraries } from '../actions/LibraryActions.jsx';
import checkResult from '../core/checkResult.js';
import { useMediaQuery } from 'react-responsive';
import {BookListItem} from '../components/BookListItem.jsx';
import { initGA, sendGAEvent } from '../core/ga4.js';
import ListView from '../components/page/ListView.jsx';
import ScrollDownButton from '../components/ScrollDownButton.jsx';
import Context from '../context.jsx';
import Paths from '../core/paths.js';
import useScrollTracking from '../core/useScrollTracking.jsx';
import sortItems from '../core/sortItems.js';
import {   IonContent, IonItem, IonList, IonText, useIonRouter } from '@ionic/react';
import PageList from '../components/page/PageList.jsx';
import Enviroment from '../core/Enviroment.js';
import SectionHeader from '../components/SectionHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import HorizontalScroll from '../components/HorizontalScroll.jsx';
import BookDashboardItem from '../components/collection/BookDashboardItem.jsx';
import DashboardItem from '../components/page/DashboardItem.jsx';
function DiscoveryContainer() {
  const { seo,setSeo } = useContext(Context);
  const  currentProfile = useSelector(state=>state.users.currentProfile)
  const router = useIonRouter()
  const dispatch = useDispatch();
const {
  collections: cols,
  books,
  libraries,
  pagesInView,
} = useSelector(state => ({
  collections: state.books.collections,
  books: state.books.books,
  libraries: state.books.libraries,
  pagesInView: state.pages.pagesInView,
}));

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

  useEffect(() => {
    
    fetchContentItems();
    fetchLibraries();
  }, [currentProfile]);
  


  useEffect(() => {
    let finalList = sortItems(
      pagesInView,
      cols.filter(item => item && item.storyIdList && item.storyIdList.length > 0)
    );
    setViewItems(finalList);
  }, [pagesInView, cols]);

 
  const fetchContentItems = () => {
 
    dispatch(getPublicStories());
    dispatch(getPublicCollections());
  };

  const fetchLibraries = () => {
    // setHasMoreLibraries(true);
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


const LibraryForums = () => {
  if (!libraries) return null;

  return (
    <div className="">
      <IonText
      style={{"--padding-bottom":"4em"}}
        className={`text-emerald-900 ${
          isNotPhone ? 'ml-16 pl-6' : 'ml-16'
        } mb-4 lora-bold font-extrabold text-2xl`}
      >
        Communities
      </IonText>

      {/* Horizontal scroll area */}
      <div    style={{"--padding-top":"4em"}} className="mb-4">
        <div className="flex flex-row overflow-x-auto overflow-y-clip  space-x-4 px-4 no-scrollbar">
          {libraries.map((library) => (
         
              <BookListItem book={library} />
       
          ))}
        </div>
      </div>
    </div>
  );
};

  const BookList = () => {

    if (!books) return null;
    return (
      <div className=''>
        <h3     style={{"--padding-bottom":"4em"}} className="text-emerald-900 text-left bg-transparent font-extrabold ml-16  mb-4 text-2xl">
          Collections
        </h3>
<div className="mb-4 bg-transparent ">

         <IonList style={{background:"transparent"}} className="bg-transparent">
        
          <div className="flex flex-row  overflow-x-auto overflow-y-clip h-[14rem] space-x-4 px-4 no-scrollbar">
          {books.map((book, i) => {
            const id = `${book.id}_${i}`;
            return (
         
                <BookListItem book={book} />
        
            );
          })}
          </div>
          </IonList>
    </div>

      </div>
    );
  };

return<IonContent style={{ "--background": Enviroment.palette.base.background }}>
  <div className="max-w-[45em] mx-auto px-4 pb-24 space-y-10">

    {/* Communities */}
    <SectionHeader title="Communities" />
    {/* <HorizontalScroll> */}
    <HorizontalScroll>
      {libraries?.map((library) => (
          <BookListItem key={library.id} book={library} />
      
      ))}
      </HorizontalScroll>
    {/* </HorizontalScroll> */}

    {/* Collections */}
    <SectionHeader title="Collections" />
  <HorizontalScroll>
      {books?.map((book) => (
        <BookListItem key={book.id} book={book}/>
        // <BookDashboardItem key={book.id} book={book} isGrid />
      ))}
    </HorizontalScroll>

    {/* Pages */}
    <SectionHeader title="Pages" />
  <PageList items={viewItems} />
    {/* <div className="space-y-4">
      {viewItems?.length === 0 ? (
        <EmptyState text="No pages yet." />
      ) : (
        viewItems.map((page) => (
          <DashboardItem key={page.id} page={page} />
        ))
      )}
    </div> */}

    {!currentProfile && (
      <ScrollDownButton
        text="Join the community"
        onClick={() => router.push(Paths.onboard)}
      />
    )}
  </div>
</IonContent>

//   return (
//     <IonContent style={{"--padding-top":"4em"}}>
// <div>
   
           
             
//           <div className="text-left  ">
            
//             <LibraryForums books={books}/>
//           </div>

//           <div className="mb-12"><BookList books={books}/></div>

//           <div className="flex max-w-[100vw] md:w-[50em] mx-auto flex-col">
//             <div className="flex flex-row items-center justify-between">
//               <h3 className="text-emerald-900 font-extrabold text-2xl text-left mx-4 lora-bold my-4 lg:mb-4">
//                 Pages
//               </h3>

         
//             </div>
//           </div>

//         <div className='mx-auto sm:max-w-[45em] '>
//             <PageList items={viewItems} />
//          </div>

//           <div className="lg:flex-1 lg:mx-4" />

//           {!currentProfile ? (
//             <ScrollDownButton
//               text="Join the community"
//               onClick={() => {
//                 sendGAEvent('Navigate to Apply', 'Navigate to Apply', 'Join the community', 0, false);
//                 router.push(Paths.onboard);
//               }}
//             />
//           ) : null}
//          {/* </div> */}
//      </div>
// </IonContent>
//   );
}

export default DiscoveryContainer