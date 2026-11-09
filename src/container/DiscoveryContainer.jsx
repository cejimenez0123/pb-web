import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import { getPublicStories } from "../actions/PageActions.jsx";
import { getPublicCollections } from "../actions/CollectionActions.js";
import { BookListItem } from "../components/collection/BookListItem.jsx";

import ScrollDownButton from "../components/ScrollDownButton.jsx";
import Paths from "../core/paths.js";
import useScrollTracking from "../core/useScrollTracking.jsx";
import sortItems from "../core/sortItems.js";
import { IonContent, useIonRouter } from "@ionic/react";

import styles from "../styles/style.js";
import SectionHeader from "../components/pieces/SectionHeader.jsx";
import StoryCard from "../components/lovehome/StoryCard.jsx";
import { getPublicLibraries } from "../actions/LibraryActions.jsx";






function shuffle(items = []) {
  return [...items].sort(() => Math.random() - 0.5);
}



function DiscoveryContainer() {




  const router = useIonRouter();
  const dispatch = useDispatch();

const cols = useSelector(
  (state) => state.books.collections ?? EMPTY_ARRAY
);

const books = useSelector(
  (state) => state.books.books ?? EMPTY_ARRAY
);

const libraries = useSelector(
  (state) => state.books.libraries ?? EMPTY_ARRAY
);

const pagesInView = useSelector(
  (state) => state.pages.pagesInView ?? EMPTY_ARRAY
);
const currentProfile = useSelector((state)=>state.users.currentProfile)


  const [shelfKey, setShelfKey] = useState(0);

  useScrollTracking({
    name: "discovery",
  });



const fetchContentItems = () => {
  dispatch(getPublicStories());
  dispatch(getPublicCollections());
  dispatch(getPublicLibraries());
}
const fetchFragments=()=>{
dispatch(
  getPublicStories({
    status: "fragment",
  })
);
}

useEffect(()=>{
  fetchFragments()
  fetchContentItems()
},[])
  /*
   * Collections that actually contain stories.
   *
   * These are the existing collection objects used by
   * sortItems/PageList and the existing collection UI.
   */
  const availableCollections = useMemo(() => {
    return cols.filter(
      (item) =>
        item &&
        item.storyIdList &&
        item.storyIdList.length > 0
    );
  }, [cols]);

  /*
   * Keep the existing sorting behavior from the old
   * Discovery page.
   */
  const sortedItems = useMemo(() => {
    return sortItems(
      pagesInView,
      availableCollections
    );
  }, [pagesInView, availableCollections]);

  /*
   * Search is intentionally lightweight for now.
   *
   * Discovery currently has a relatively small public
   * content pool, so we can search the content already
   * loaded into Redux without creating a second search
   * architecture.
   *


  /*
   * The default shelf is intentionally finite.
   *
   * Discovery is not an infinite engagement feed.
   * A new shelf is created when the user chooses
   * "Look again."
   */
  // const shelfItems = useMemo(() => {
  //   return shuffle(
  //     search.trim()
  //       ? searchedItems
  //       : sortedItems
  //   ).slice(0, 8);
  // }, [
  //   shelfKey,
  //   search,
  //   searchedItems,
  //   sortedItems,
  // ]);
 const shelfStories = useMemo(() => {
    return shuffle(pagesInView).slice(0, 6);
  }, [shelfKey, pagesInView]);
  const shelfCollections = useMemo(() => {
    return shuffle(books).slice(0, 6);
  }, [shelfKey, books]);

  const shelfLibraries = useMemo(() => {
    return shuffle(libraries).slice(0, 4);
  }, [shelfKey, libraries]);

  const handleLookAgain = () => {
    setShelfKey((current) => current + 1);
  };



  const handleJoin = () => {
    router.push(Paths.onboard);
  };

  return (
    <IonContent 

    >
      <main className={styles.pageShell.base+" "+styles.pageShell.scroll}>
        <div >

          {/* Intro */}
          <header className={styles.pageShell.head+" pb-8 px-4"}>
            <p className="text-sm uppercase px-2 tracking-[0.14em] text-base-content/55">
              Discover
            </p>

            <h1 
            className={styles.text.display}
            >
                Find something
              <br />
              to fall into.
            </h1>

            <p 
            className={styles.content.text.body}
            >
            {/* // className="mt-7 max-w-2xl font-serif text-lg leading-relaxed text-base-content/90 sm:text-xl"> */}
              Wander through writing, collections, and Rooms.
              Start with a story. See where it takes you.
            </p>
          </header>

       
      

       
            <section>
           <div>
           
              <SectionHeader 
              title={"Start somewhere."}
              description={" A few pieces people have intentionally left open."}
              eyebrow={"Open Shelf"}
              buttonClass={" bg-transparent  dark:text-plumb-surface"}
              onAction={()=>{
 handleLookAgain()
              }}
              actionLabel={"Look again ↗"}/>
                   <div className="mt-7 overflow-hidden">
                   <div className="flex gap-5 px-8 min-h-[16.2rem] overflow-x-auto pb-4">
                      {shelfStories.map((book) => {
                        return(
                        <div
                          key={book.id}
                          className="min-w-[17rem] max-w-[20rem] shrink-0"
                        >
                          <StoryCard story={book}/>
                        </div>)}
                      )}
                      </div>
                      </div>
                      </div>
                     
             


        <SectionHeader eyebrow={"Go deeper"}
        title={"Enter a room."}
        description={"One story can lead somewhere bigger."}/>
                  <div 
                       >
         
                  </div>

                  <div className="mt-7 overflow-hidden">
                    <div className="flex gap-5 overflow-x-auto pb-4">
                      {shelfCollections.map((book) => (
                        <div
                          key={book.id}
                          className="min-w-[17rem] max-w-[20rem] shrink-0"
                        >
                          <BookListItem book={book} />
                        </div>
                      ))}
                    </div>
                  </div>
          
              {/* )} */}

              {/* Rooms */}
              {shelfLibraries.length > 0 && (
                <>
                {/* // <section className=" sm:mt-28"> */}
                  <div className="flex flex-col gap-5 border-b border-base-content/10 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
                   <SectionHeader eyebrow={"Places to linger"}
                   title={"Find a Room."}
                   description={`Writing lives somewhere. Rooms are
                        where people keep coming back.`}/>
       
                  </div>

                  <div className="mt-7 overflow-hidden">
                    <div className="flex px-4 gap-5 overflow-x-auto pb-4">
                      {shelfLibraries.map((library) => (
                        <div
                          key={library.id}
                          className="min-w-[17rem] max-w-[20rem] shrink-0"
                        >
                          <BookListItem book={library} />
                        </div>
                      ))}
                    </div>
                  </div>
                  </>
                // </section>
              )}

              {/* Light invitation */}
              {!currentProfile && (
                <section className="mt-20 sm:mt-28">
                  <div className="rounded-3xl bg-soft/15 px-6 py-12 text-center sm:px-10 sm:py-16">
                    <p className="font-serif text-2xl font-bold sm:text-3xl">
                      Found somewhere you want to stay?
                    </p>

                    <p className="mx-auto mt-3 max-w-xl font-serif text-base leading-relaxed text-base-content/65">
                      Join Plumbum to write, find your Rooms,
                      and become part of the places you keep
                      returning to.
                    </p>

                    <div className="mt-7">
                      <ScrollDownButton
                        text="Join the community"
                        onClick={handleJoin}
                      />
                    </div>
                  </div>
                </section>
              )}
            </section>
     
        </div>
      </main>
    </IonContent>
  );
}

export default DiscoveryContainer;


function getItemTitle(item) {
  return (
    item?.name ||
    item?.title ||
    item?.username

  );
}
  

  function getItemDescription(item) {
  return (
    item?.description ||
    item?.story?.description ||
    item?.collection?.purpose ||
    ""
  );
}


function getItemAuthor(item = {}, type) {
  if (type !== "story") {
    return null;
  }

  return (
    item.authorName ||
    item.authorUsername ||
    item.username ||
    item.author?.username ||
    item.author?.name ||
    null
  );
}