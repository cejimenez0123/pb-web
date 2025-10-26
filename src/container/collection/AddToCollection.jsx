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
              //   key={col.id}
              //   lines="full"
              //   className="rounded-xl my-2 flex justify-between items-center"
              // >
              //   <IonLabel className="text-emerald-800 font-medium">
              //     {col.title?.trim() || "Untitled"}
              //   </IonLabel>
              //   <div
              //     className="bg-emerald-700 rounded-full p-2 cursor-pointer"
              //     onClick={() =>
              //       addedToCollection
              //         ? setNewCollections(
              //             newCollection.filter((c) => c.id !== col.id)
              //           )
              //         : setNewCollections([...newCollection, col])
              //     }
              //   >
              //     <IonImg
              //       src={addedToCollection ? checked : emptyBox}
              //       alt="toggle"
              //       style={{ width: 22, height: 22 }}
              //     />
              //   </div>
              // </IonItem>
          
          })}
      </IonList>
    );
  };

  if (!colInView) {
    return (
      <IonPage>
        <IonContent fullscreen>
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

        <IonContent fullscreen className="ion-padding">
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

          {/* Tabs */}
          <StoryCollectionTabs tab={tab} setTab={setTab}  storyList={storyList} colList={colList}/>
          {/* <div className="flex justify-center mb-2">
            <div className="flex rounded-full border border-emerald-600 overflow-hidden">
              <button
                className={`px-4 py-2 ${
                  tab === "page"
                    ? "bg-emerald-700 text-white"
                    : "text-emerald-700 bg-transparent"
                }`}
                onClick={() => setTab("page")}
              >
                Stories
              </button>
              <button
                className={`px-4 py-2 ${
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

          {tab === "page" ? storyList() : colList()} */}
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



// import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
// import {
//   IonContent,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonText,
//   IonImg,
//   IonSkeletonText,
//   IonList,
//   IonButtons,
//   IonBackButton,
//   IonItem,
// } from "@ionic/react";
// import { clearPagesInView } from "../../actions/PageActions.jsx";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Paths from "../../core/paths";
// import checkResult from "../../core/checkResult";
// import Context from "../../context.jsx";
// import ErrorBoundary from "../../ErrorBoundary";
// import {
//   addCollectionListToCollection,
//   addStoryListToCollection,
//   fetchCollectionProtected,
//   fetchCollection,
//   getMyCollections,
// } from "../../actions/CollectionActions";
// import { getMyStories } from "../../actions/StoryActions";
// import loadingGif from "../../images/loading.gif";
// import checked from "../../images/icons/check.svg";
// import emptyBox from "../../images/icons/empty_circle.svg";
// import getLocalStore from "../../core/getLocalStore.jsx";
// import { Preferences } from "@capacitor/preferences";

// let colStr = "collection";

// export default function AddToCollectionContainer(props) {
//   const pathParams = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { seo, setSeo } = useContext(Context);
//   const currentProfile = useSelector((state) => state.users.currentProfile);
//   const pending = useSelector((state) => state.books.loading);
//   const profile = useSelector((state) => state.users.currentProfile);
//   const [search, setSearch] = useState("");
//   const [token,setToken]=useState(null)
//   const colInView = useSelector((state) => state.books.collectionInView);
//   const pagesInView = useSelector((state) =>
//     state.pages.pagesInView
//       .filter((page) => page)
//       .filter((col) => {
//         if (search.length > 0) {
//           return col.title.toLowerCase().includes(search.toLowerCase());
//         }
//         return true;
//       })
//   );
//   useEffect(()=>{
//     Preferences.get({key:"token"}).then(tok=>setToken(tok.value))
//   },[])
//   useEffect(()=>{
//     if(token){
//     dispatch(getMyCollections({ profile,token }));
//     dispatch(getMyStories({ profile ,token}));
//     }
//   },[token])
//   const collections = useSelector((state) =>
//     state.books.collections.filter((col) => {
//       if (search.length > 0) {
//         return col.title.toLowerCase().includes(search.toLowerCase());
//       }
//       return true;
//     })
//   );
//   const cTcList = useSelector((state) => state.books.collectionToCollectionsList);

//   const [newStories, setNewStories] = useState([]);
//   const [newCollection, setNewCollections] = useState([]);
//   const [tab, setTab] = useState("page");
//   const location = useLocation()
//   useLayoutEffect(() => {
//     if (profile) {
//       dispatch(fetchCollectionProtected(pathParams));
//     } else {
//       dispatch(fetchCollection(pathParams));
//     }
   
//   }, [location.pathname]);

//   const save = () => {
//     let storyIdList = newStories.filter((stor) => stor);
//     let collectionIdList = newCollection.filter((col) => col).map((col) => col.id);

//     if (collectionIdList.length > 0 && currentProfile)
//       dispatch(
//         addCollectionListToCollection({
//           id: colInView.id,
//           list: collectionIdList,
//           profile: currentProfile,
//         })
//       ).then(() => {
//         dispatch(clearPagesInView());
//         setNewCollections([]);
//         setNewStories([]);
//         dispatch(clearPagesInView());
//         navigate(Paths.collection.createRoute(colInView.id));
//       });

//     if (storyIdList.length > 0)
//       dispatch(
//         addStoryListToCollection({
//           id: colInView.id,
//           list: storyIdList,
//           profile: currentProfile,
//         })
//       ).then((res) => {
//         dispatch(clearPagesInView());
//         setNewCollections([]);
//         setNewStories([]);
//         navigate(Paths.collection.createRoute(colInView.id));
//       });
//   };

  

//   const addNewCollection = (col) => {
//     setNewCollections((state) => {
//       return [...state, col];
//     });
//   };
//   const addNewStory = (story) => {
//     setNewStories((state) => {
//       return [...state, story];
//     });
//   };
//   const removeNewStory = (sto) => {
//     let list = newStories.filter((story) => story.id !== sto.id);
//     setNewStories(list);
//   };
//   const removeNewCollection = (col) => {
//     let list = newCollection.filter((collection) => col.id !== collection.id);
//     setNewCollections(list);
//   };
//   const handleSearch = (value) => setSearch(value);
//           const handleBack = (e) => {
//     e.preventDefault();
//     if (window.history.length > 1) {
//       navigate(-1);
//     } else {
//       navigate(Paths.discovery());
//     }
//   };
//   const storyList = () => {
//     return (
//         <div className="my-4  mx-auto text-emerald-800 overflow-scroll text-left mb-2">
      
       
//         <IonList
    
//         >
//           {pagesInView
//             .filter((str) => str)
//             .filter(
//               (story) =>
//                 colInView &&
//                 colInView.storyIdList &&
//                 !colInView.storyIdList.find((storyJoint) => storyJoint && storyJoint.story && (storyJoint.story.id === story.id))
//             )
//             .map((story,i) => {
//               const addedToCollection =
//                 colInView?.storyIdList?.some((sj) => sj && sj.story && (sj.story.id === story.id)) ||
//                 newStories.includes(story);
//               return (
//                 <IonItem key={i}>
//                 <div
//                   key={story.id}
//                   className="text-left mx-auto  flex flex-row justify-between border-3 border-emerald-400 rounded-full py-4 my-2"
//                 >
//                   <h2 className="text-l my-auto max-w-[15em] truncate text-md md:text-lg ml-8 mont-medium">
//                     {story.title && story.title.trim().length > 0 ? story.title : "Untitled"}
//                   </h2>
//                   <div className="bg-emerald-800 rounded-full max-w-[10em] overflow-hidden text-ellipsis mr-6 p-2 cursor-pointer select-none">
//                     {addedToCollection ? (
//                       <div onClick={() => removeNewStory(story)} role="button" tabIndex={0} onKeyPress={() => removeNewStory(story)}>
//                         <IonImg
//                           src={checked}
//                           alt="checked"
//                           style={{ maxHeight: "1.5rem", maxWidth: "1.5rem" }}
//                         />
//                       </div>
//                     ) : (
//                       <div onClick={() => addNewStory(story)} role="button" tabIndex={0} onKeyPress={() => addNewStory(story)}>
//                         <IonImg
//                           src={emptyBox}
//                           alt="empty"
//                           className="text-emerald-800"
//                           style={{ maxHeight: "1.5rem", maxWidth: "1.5rem" }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div></IonItem>
//               );
//             })}
//         </IonList>
//       </div>
//     );
//   };

//   const colList = () => {
//     let list = [];
//     if (collections) {
//       list = collections;
//     }
//     if (cTcList.length > 0) {
//       list = cTcList.filter(
//         (col) => !colInView.childCollections.find((joint) => joint.childCollectionId === col.id)
//       );
//     }
//     return (
//       <div className="my-4 mx-auto text-emerald-800 overflow-scroll text-left mb-2">
       
//         <IonList>
//           {list.map((col) => {
//             if (col && colInView && col.id && colInView.id && col.id === colInView.id) {
//               return null;
//             }
//             const addedToCollection =
//               colInView?.childCollections?.some((colJoint) => colJoint.childCollectionId === col.id) ||
//               newCollection.includes(col);
//             return (
//                 <IonItem>
//               <div
//                 key={col.id}
//                 className="text-left mx-auto w-[92vw] md:w-[96%]  flex flex-row justify-between border-3 border-emerald-400 rounded-full py-4 my-2"
//               >
//                 <h2 className="text-l my-auto max-w-[15em] truncate text-md md:text-lg ml-8 mont-medium">
//                   {col.title && col.title.trim().length > 0 ? col.title : "Untitled"}
//                 </h2>
//                 <div className="bg-emerald-800 rounded-full overflow-hidden text-ellipsis mr-6 p-2 cursor-pointer select-none">
//                   {addedToCollection ? (
//                     <div
//                       onClick={() => removeNewCollection(col)}
//                       role="button"
//                       tabIndex={0}
//                       onKeyPress={() => removeNewCollection(col)}
//                     >
//                       <IonImg
//                         src={checked}
//                         style={{ maxWidth: 32, maxHeight: 32 }}
//                         alt="checked"
//                       />
//                     </div>
//                   ) : (
//                     <div
//                       onClick={() => addNewCollection(col)}
//                       role="button"
//                       tabIndex={0}
//                       onKeyPress={() => addNewCollection(col)}
//                     >
//                       <IonImg
//                         src={emptyBox}
//                         style={{ maxWidth: 32, maxHeight: 32 }}
//                         alt="empty"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//               </IonItem>
//             );
//           })}
//         </IonList>
//       </div>
//     );
//   };

//   if (!colInView) {
//     return pending ? (
//       <IonContent fullscreen={true} scrollY>
//         <IonSkeletonText
//           animated
//           style={{ width: "96vw", height: 150, margin: "2rem auto", borderRadius: 18 }}
//         />
//         <IonSkeletonText
//           animated
//           style={{ width: "96vw", height: 400, margin: "2rem auto", borderRadius: 18 }}
//         />
//       </IonContent>
//     ) : (
//       <IonContent fullscreen={true} scrollY>
//         <div className="ion-text-center ion-padding">
//           <IonText color="medium">
//             <h5>Collection Not Found</h5>
//           </IonText>
//         </div>
//       </IonContent>
//     );
//   }

//   return (
//     <ErrorBoundary>
//     <IonContent fullscreen={true} scrollY className="ion-padding pt-12" >
//      <IonHeader>
//         <IonToolbar>
//         <IonButtons slot="start">
//             <IonBackButton defaultHref={handleBack}/>
//         </IonButtons>
//         <IonTitle >Add to Collection</IonTitle>
//         <IonButtons>
//             <div/>
//         </IonButtons>
//         </IonToolbar>
//      </IonHeader>
//             <h2 className="text-2xl truncate md:max-w-[30em] text-emerald-800 mb-2">{colInView.title?.trim() || "Untitled"}</h2>
//           <h6 className="sm:my-4 text-emerald-800 sm:mx-8 p-4 min-h-24 text-lg sm:max-w-[35rem]">
//             {colInView ? colInView.purpose : null}
//           </h6>

//           <div className="flex flex-row justify-center">
//             {/* Replace button with div + IonText for custom style */}
//             <div
//               className="bg-green-600 ml-4 mont-medium rounded-full text-white mt-4 px-6 text-xl cursor-pointer flex items-center justify-center select-none"
//               style={{ minWidth: 120, minHeight: 44 }}
//               role="button"
//               tabIndex={0}
//               onClick={save}
//               onKeyPress={(e) => {
//                 if (e.key === "Enter" || e.key === " ") save();
//               }}
//             >
//               <IonText>Save</IonText>
//             </div>

//             <div className="text-xl my-auto flex flex-col content-center px-4 pt-[0.7em] rounded-full">
//               <span className="text-center text-emerald-800 mx-auto">{newCollection.length + newStories.length}</span>
//               <span className="text-center text-emerald-800 text-sm">New items</span>
//             </div>
//           </div>
//         {/* </div> */}

//         {/* Search Input */}
//         <label className="flex max-w-[96vw] md:w-page mx-auto border-emerald-700 border-2 rounded-full mb-1 mt-8 flex-row mx-2 items-center p-2">
//           <IonText className="my-auto text-emerald-800 mx-2 w-full mont-medium">Search:</IonText>
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => handleSearch(e.target.value)}
//             className="rounded-full open-sans-medium px-2 min-w-[19em] py-1 text-sm bg-transparent my-1 rounded-full border-emerald-700 border-1 text-emerald-800 focus:outline-none"
//             placeholder="Search collections"
//             aria-label="Search collections"
//           />
//         </label>

//         <div className="sm:flex rounded-t-lg  mx-auto sm:flex-row">
//           <div className=" md:mt-8 mx-auto flex flex-col ">
//             <div role="tablist" className="tabs grid">
//               <input
//                 type="radio"
//                 name="my_tabs_2"
//                 role="tab"
//                 defaultChecked
//                 className="tab hover:min-h-10 [--tab-bg:transparent] rounded-full mont-medium text-emerald-800 border-3 w-[96vw] md:w-page text-xl"
//                 aria-label="Stories"
//                 onChange={() => setTab("page")}
//                 checked={tab === "page"}
//               />
//               <div
//                 role="tabpanel"
//                 className="tab-content pt-1    "
//               >
//                 {tab === "page" && storyList()}
//               </div>

//               <input
//                 type="radio"
//                 name="my_tabs_2"
//                 role="tab"
//                 className="tab hover:min-h-10 [--tab-bg:transparent] rounded-full mont-medium text-emerald-800 border-3  text-xl"
//                 aria-label="Collections"
//                 onChange={() => setTab("collection")}
//                 checked={tab === "collection"}
//               />
//               <div
//                 role="tabpanel"
//                 className="tab-content pt-1 lg:py-4 rounded-lg md:mx-auto "
//               >
//                 {tab === "collection" && colList()}
//               </div>
//             </div>
//           </div>
//         </div>
     
//     </IonContent>
//     </ErrorBoundary>
//   );
// }
