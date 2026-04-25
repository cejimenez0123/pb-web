

import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { getPublicStories } from '../actions/PageActions.jsx';
import { getPublicCollections } from '../actions/CollectionActions.js';
import { getPublicLibraries } from '../actions/LibraryActions.jsx';
import checkResult from '../core/checkResult.js';
import { useMediaQuery } from 'react-responsive';
import { BookListItem } from '../components/collection/BookListItem.jsx';
import { initGA } from '../core/ga4.js';
import ScrollDownButton from '../components/ScrollDownButton.jsx';
import Context from '../context.jsx';
import Paths from '../core/paths.js';
import useScrollTracking from '../core/useScrollTracking.jsx';
import sortItems from '../core/sortItems.js';
import { IonContent, useIonRouter } from '@ionic/react';
import Enviroment from '../core/Enviroment.js';
import SectionHeader from '../components/SectionHeader.jsx';
import HorizontalScroll from '../components/HorizontalScroll.jsx';
import { motion } from "framer-motion";
import PageList from '../components/page/PageList.jsx';

const PAGE_WRAP = "mx-auto pb-24 bg-base-surface dark:bg-base-bgDark min-h-screen";
const SECTION = "space-y-4";
const SECTION_HEADER_ROW = "flex items-center justify-between px-4 max-w-[50em] mx-auto";
const H_SCROLL_WRAP = "pl-4 -mx-4 sm:mx-0";
const H_SCROLL_ROW = "flex flex-row gap-4";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

function DiscoveryContainer() {
  const { setSeo } = useContext(Context);
  const currentProfile = useSelector(state => state.users.currentProfile);
  const router = useIonRouter();
  const dispatch = useDispatch();

  const { collections: cols, books, libraries, pagesInView } = useSelector(state => ({
    collections: state.books.collections,
    books: state.books.books,
    libraries: state.books.libraries,
    pagesInView: state.pages.pagesInView,
  }));

  const [viewItems, setViewItems] = useState([]);

  useScrollTracking({ name: 'discovery' });

  useLayoutEffect(() => { initGA(); }, []);

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
    dispatch(getPublicLibraries())
      .then(result => checkResult(result, () => {}, () => {}))
      .catch(() => {});
  };

  return (
    <IonContent style={{ "--background": "var(--base-surface)" }}>
      <div className={PAGE_WRAP}>

        {/* Communities */}
        <div className={SECTION}>
          <div className={SECTION_HEADER_ROW}>
            <SectionHeader title="Communities" />
          </div>
          <div className={H_SCROLL_WRAP}>
            <HorizontalScroll>
              <motion.div
                className={H_SCROLL_ROW}
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {libraries?.map((library) => (
                  <motion.div key={library.id} variants={itemVariants}>
                    <BookListItem book={library} />
                  </motion.div>
                ))}
              </motion.div>
            </HorizontalScroll>
          </div>
        </div>

        {/* Collections */}
        <div className={SECTION}>
          <div className={SECTION_HEADER_ROW}>
            <SectionHeader title="Collections" />
          </div>
          <div className={H_SCROLL_WRAP}>
            <HorizontalScroll>
              <motion.div
                className={H_SCROLL_ROW}
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {books?.map((book) => (
                  <motion.div key={book.id} variants={itemVariants}>
                    <BookListItem book={book} />
                  </motion.div>
                ))}
              </motion.div>
            </HorizontalScroll>
          </div>
        </div>

        {/* Pages */}
        <div className={SECTION}>
          <div className={SECTION_HEADER_ROW}>
            <SectionHeader title="Pages" />
          </div>

          <div className="px-4 max-w-[50em] mx-auto flex flex-col gap-3">
            <PageList items={viewItems}/>
            {/* {viewItems.map((item) => {
              const isCollection = !!item?.storyIdList;
              return (
                <div
                  key={item.id}
                  onClick={() =>
                    isCollection
                      ? router.push(Paths.collection.createRoute(item.id), "forward")
                      : router.push(Paths.page.createRoute(item.id), "forward")
                  }
                  className={`
                    border rounded-full px-4 py-3
                    bg-base-bg dark:bg-base-bgDark
                    shadow-sm active:scale-[0.98] transition cursor-pointer
                    ${isCollection ? "border-purple" : "border-blue"}
                  `}
                >
                  <div className="flex flex-row gap-3 items-center">
                    <h6 className={`text-[0.75rem] ${isCollection ? "text-purple" : "text-blue"}`}>
                      {isCollection ? "collection" : "page"} ·
                    </h6>
                    <h5 className="text-[0.95rem] text-soft dark:text-cream font-medium truncate">
                      {item.title || "Untitled"}
                    </h5>
                  </div>
                </div>
              );
            })} */}
          </div>

          {!currentProfile && (
            <div className="px-4 max-w-[50em] mx-auto">
              <ScrollDownButton
                text="Join the community"
                onClick={() => router.push(Paths.onboard)}
              />
            </div>
          )}
        </div>

      </div>
    </IonContent>
  );
}

export default DiscoveryContainer;