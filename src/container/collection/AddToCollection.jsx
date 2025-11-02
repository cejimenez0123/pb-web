import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonText,
  IonImg,
  IonSkeletonText,
  IonLabel,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Preferences } from "@capacitor/preferences";
import ErrorBoundary from "../../ErrorBoundary";
import Context from "../../context.jsx";
import Paths from "../../core/paths";
import {
  clearPagesInView,
} from "../../actions/PageActions.jsx";
import {
  addCollectionListToCollection,
  addStoryListToCollection,
  fetchCollectionProtected,
  fetchCollection,
  getMyCollections,
} from "../../actions/CollectionActions";
import { getMyStories } from "../../actions/StoryActions";

import checked from "../../images/icons/check.svg";
import emptyBox from "../../images/icons/empty_circle.svg";

export default function AddToCollectionContainer() {
  const pathParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { seo, setSeo } = useContext(Context);

  const currentProfile = useSelector((state) => state.users.currentProfile);
  const pending = useSelector((state) => state.books.loading);
  const profile = useSelector((state) => state.users.currentProfile);
  const colInView = useSelector((state) => state.books.collectionInView);
  const collections = useSelector((state) => state.books.collections);
  const cTcList = useSelector((state) => state.books.collectionToCollectionsList);

  const pagesInView = useSelector((state) =>
    state.pages.pagesInView.filter((page) => page)
  );

  const [search, setSearch] = useState("");
  const [token, setToken] = useState(null);
  const [tab, setTab] = useState("page");
  const [newStories, setNewStories] = useState([]);
  const [newCollection, setNewCollections] = useState([]);

  useEffect(() => {
    Preferences.get({ key: "token" }).then((tok) => setToken(tok.value));
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(getMyCollections({ profile, token }));
      dispatch(getMyStories({ profile, token }));
    }
  }, [token]);

  useLayoutEffect(() => {
    if (profile) {
      dispatch(fetchCollectionProtected(pathParams));
    } else {
      dispatch(fetchCollection(pathParams));
    }
  }, [location.pathname]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(Paths.discovery());
    }
  };

  const handleSearch = (e) => setSearch(e.target.value);

  const save = () => {
    const storyIdList = newStories.filter((s) => s);
    const collectionIdList = newCollection.filter((c) => c).map((c) => c.id);

    if (collectionIdList.length > 0 && currentProfile) {
      dispatch(
        addCollectionListToCollection({
          id: colInView.id,
          list: collectionIdList,
          profile: currentProfile,
        })
      ).then(() => {
        dispatch(clearPagesInView());
        setNewCollections([]);
        setNewStories([]);
        navigate(Paths.collection.createRoute(colInView.id));
      });
    }

    if (storyIdList.length > 0) {
      dispatch(
        addStoryListToCollection({
          id: colInView.id,
          list: storyIdList,
          profile: currentProfile,
        })
      ).then(() => {
        dispatch(clearPagesInView());
        setNewCollections([]);
        setNewStories([]);
        navigate(Paths.collection.createRoute(colInView.id));
      });
    }
  };

  const storyList = () => {
    return (
      <IonList>
        {pagesInView
          .filter((story) => story)
          .filter(
            (story) =>
              !colInView?.storyIdList?.some(
                (sj) => sj?.story?.id === story.id
              ) && story.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((story, i) => {
            const addedToCollection =
              newStories.includes(story) ||
              colInView?.storyIdList?.some((sj) => sj?.story?.id === story.id);

            return (
              <IonItem
                key={i}
               lines="none"
              
                className="rounded-xl my-2  pb-2 "
              >
                <div className="flex flex-row py-2 border-b border-emerald-600 justify-between w-full">
  
                <IonLabel slot="start" className="text-emerald-800  truncate max-w-[70%]  font-medium
text-[1rem]">
                  {story.title?.trim() || "Untitled"}
                </IonLabel>
                <div
                slot="end"
                     className="w-10 h-10 flex items-center justify-center bg-emerald-700 rounded-full cursor-pointer transition-all duration-200 hover:bg-emerald-600 active:scale-95"
    onClick={() =>
                    addedToCollection
                      ? setNewStories(newStories.filter((s) => s.id !== story.id))
                      : setNewStories([...newStories, story])
                  }
                >
                  <IonImg
                    src={addedToCollection ? checked : emptyBox}
                    alt="toggle"
                  className="w-10 p-2 h-10"
                  />
                </div>
                </div>
              </IonItem>
            );
          })}
      </IonList>
    );
  };

  const colList = () => {
    let list = collections || [];
    if (cTcList.length > 0) {
      list = cTcList.filter(
        (col) =>
          !colInView?.childCollections?.some(
            (joint) => joint.childCollectionId === col.id
          )
      );
    }

    return (
      <IonList>
        {list
          .filter((col) => col.title.toLowerCase().includes(search.toLowerCase()))
          .map((col) => {
            if (col.id === colInView?.id) return null;
            const addedToCollection =
              newCollection.includes(col) ||
              colInView?.childCollections?.some(
                (joint) => joint.childCollectionId === col.id
              );

            return (
              <IonItem
  key={col.id}
  lines="none"
 
                className="rounded-xl my-2 border-b border-emerald-600 pb-2 "
              >
                <div className="flex flex-row py-2  justify-between w-full">
  
                <IonLabel slot="start" className="text-emerald-800  truncate max-w-[70%]  font-medium
text-[1rem]">
    {col.title?.trim() || "Untitled"}
  </IonLabel>

  <div
  slot="end"
    className="max-w-10 max-h-10 flex items-center justify-center bg-emerald-700 rounded-full cursor-pointer transition-all duration-200 hover:bg-emerald-600 active:scale-95"
   onClick={() =>
      addedToCollection
        ? setNewCollections(newCollection.filter((c) => c.id !== col.id))
        : setNewCollections([...newCollection, col])
    }
  >
    <IonImg
      src={addedToCollection ? checked : emptyBox}
      alt="toggle"
      className="w-10 p-2 h-10"
    />
    </div>
  {/*  */}
  {/* </div>
  </div> */}
  </div>
</IonItem>)
// <IonItem
             
          
          })}
      </IonList>
    );
  };

  if (!colInView) {
    return (
      <IonPage>
        <IonContent fullscreen={true}>
          {pending ? (
            <>
              <IonSkeletonText
                animated
                style={{
                  width: "90%",
                  height: 120,
                  margin: "1rem auto",
                  borderRadius: 16,
                }}
              />
              <IonSkeletonText
                animated
                style={{
                  width: "90%",
                  height: 300,
                  margin: "1rem auto",
                  borderRadius: 16,
                }}
              />
            </>
          ) : (
            <div className="ion-text-center ion-padding">
              <IonText color="medium">
                <h5>Collection Not Found</h5>
              </IonText>
            </div>
          )}
        </IonContent>
      </IonPage>
    );
  }

  return (
    <ErrorBoundary>
      {/* <IonPage> */}
        <IonHeader translucent>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={Paths.discovery()} onClick={handleBack} />
            </IonButtons>
            <IonTitle className="text-emerald-800 font-semibold">
              Add to Collection
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen={true} className="ion-padding">
          <h2 className="text-xl font-semibold text-emerald-800 mb-1">
            {colInView.title?.trim() || "Untitled"}
          </h2>
          <p className="text-emerald-700 mb-4">{colInView.purpose || ""}</p>

          {/* Save button */}
          <div className="flex justify-between items-center mb-4">
            <div
              onClick={save}
              className="bg-emerald-700 text-white px-5 py-2 rounded-full text-center text-lg cursor-pointer shadow-md"
            >
              Save
            </div>
            <div className="text-center text-emerald-800">
              <div className="text-lg font-medium">
                {newCollection.length + newStories.length}
              </div>
              <div className="text-sm text-gray-600">New items</div>
            </div>
          </div>

          {/* Search */}
          <div className="rounded-full border border-emerald-700 flex items-center px-4 py-2 mb-4">
            <IonText className="text-emerald-700 font-medium mr-2">Search:</IonText>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              className="flex-1 bg-transparent focus:outline-none text-emerald-800"
              placeholder="Search collections or stories"
            />
          </div>

        
          <StoryCollectionTabs tab={tab} setTab={setTab}  storyList={storyList} colList={colList}/>
        
        </IonContent>
      {/* </IonPage> */}
    </ErrorBoundary>
  );
}

import { AnimatePresence, motion } from "framer-motion";


 function StoryCollectionTabs({ tab, setTab, storyList, colList }) {
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
    if (swipe < -50 && tab === "page") setTab("collection");
    if (swipe > 50 && tab === "collection") setTab("page");
  };

  return (
    <div className="flex flex-col w-full">
      {/* Tabs */}
      <div className="flex justify-center mb-2">
        <div className="flex rounded-full border border-emerald-600 overflow-hidden">
          <button
            className={`px-4 py-2 transition-colors ${
              tab === "page"
                ? "bg-emerald-700 text-white"
                : "text-emerald-700 bg-transparent"
            }`}
            onClick={() => setTab("page")}
          >
            Stories
          </button>
          <button
            className={`px-4 py-2 transition-colors ${
              tab === "collection"
                ? "bg-emerald-700 text-white"
                : "text-emerald-700 bg-transparent"
            }`}
            onClick={() => setTab("collection")}
          >
            Collections
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
            {tab === "page" ? storyList() : colList()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

