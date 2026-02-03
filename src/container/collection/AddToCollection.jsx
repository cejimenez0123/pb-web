import { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
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
  useIonRouter,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
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
import StoryCollectionTabs from "../../components/page/StoryCollectionTabs.jsx";
import { Capacitor } from "@capacitor/core";
import { useParams } from "react-router";
  const filterTypes = {
    filter: "Filter",
    recent: "Recent",
    oldest: "Oldest",
    feedback: "Feedback",
    AZ: "A-Z",
    ZA: "Z-A"
  };
export default function AddToCollectionContainer() {
  const router = useIonRouter()
  const pathParams = useParams()
  const dispatch = useDispatch();
  const { seo, setSeo } = useContext(Context);
  const [filterType, setFilterType] = useState(filterTypes.filter);
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const pending = useSelector((state) => state.books.loading);
  const profile = useSelector((state) => state.users.currentProfile);
  const [search, setSearch] = useState("");
  const colInView = useSelector((state) => state.books.collectionInView);
  const collections = useSelector((state) => state.books.collections);
  const cTcList = useSelector((state) => state.books.collectionToCollectionsList);
    const stories = useSelector((state) =>
    state.pages.pagesInView.filter((page) => page)
  );
const filteredSortedStories = useMemo(() => {
    let result = stories || [];

    if (filterType === filterTypes.feedback) {
      result = result.filter(s => s.needsFeedback);
    } else {
      switch (filterType) {
        case filterTypes.recent:
          result = [...result].sort((a, b) => new Date(b.updated) - new Date(a.updated));
          break;
        case filterTypes.oldest:
          result = [...result].sort((a, b) => new Date(a.updated) - new Date(b.updated));
          break;
        case filterTypes.AZ:
          result = [...result].sort((a, b) => a.title.localeCompare(b.title));
          break;
        case filterTypes.ZA:
          result = [...result].sort((a, b) => b.title.localeCompare(a.title));
          break;
        default:
          break;
      }
    }

    if (search.trim().length > 0) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(s => s.title && s.title.toLowerCase().includes(lowerSearch));
    }

    return result;
  }, [stories, filterType, search]);

  const filteredSortedCollections = useMemo(() => {
    let result = collections || [];
    if(filterType==filterTypes.feedback){
      result = collections.filter(col=>col.type=="feedback"||col.purpose.toLowerCase().includes("feedback"))
    }
    switch (filterType) {
      case filterTypes.AZ:
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case filterTypes.ZA:
        result = [...result].sort((a, b) => b.title.localeCompare(a.title));
        break;
      case filterTypes.recent:
        result = [...result].sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      case filterTypes.oldest:
        result = [...result].sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      default:
        break;
    }

    if (search.trim().length > 0) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(c => c && c.title && c.title.toLowerCase().includes(lowerSearch));
    }

    return result;
  }, [collections, filterType, search]);




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
       router.goBack()
    } else {
      router.push(Paths.discovery);
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
        router.push(Paths.collection.createRoute(colInView.id));
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
        router.push(Paths.collection.createRoute(colInView.id));
      });
    }
  };

  const storyList = () => {
    return (
      <IonList>
        {filteredSortedStories
          .filter((story) => story)
          .filter(
            (story) =>
              !colInView?.storyIdList?.some(
                (sj) => sj?.story?.id === story.id
              ) && story?.title.toLowerCase().includes(search.toLowerCase())
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
                <div onClick={()=>{router.push(Paths.page.createRoute(story.id))}} className="flex flex-row py-2 border-b border-emerald-600 justify-between w-[100%]">
  
                <IonLabel slot="start" className="text-emerald-800 my-auto truncate max-w-[70%]  font-medium
text-[1rem]">
                  {story?.title?.trim() || "Untitled"}
                </IonLabel>
                <div
                slot="end"
                     className="w-10 h-10 flex items-center my-auto justify-center bg-emerald-700 rounded-full cursor-pointer transition-all duration-200 hover:bg-emerald-600 active:scale-95"
    onClick={() =>
                    addedToCollection
                      ? setNewStories(newStories.filter((s) => s.id !== story.id))
                      : setNewStories([...newStories, story])
                  }
                >
                  <IonImg
                    src={addedToCollection ? checked : emptyBox}
                    alt="toggle"
                  className="w-[2rem] p-2 h-[2rem]"
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
        {filteredSortedCollections
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
                <div className="flex flex-row py-2 my-auto justify-between w-[100%]">
  
                <IonLabel slot="start" onClick={()=>{router.push(Paths.collection.createRoute(col.id))}}className="text-emerald-800  truncate w-[100%]  font-medium
text-[1rem]">
    {col.title?.trim() || "Untitled"}
  </IonLabel>

  <div
  slot="end"
    className="max-w-10 max-h-10 flex items-center my-auto justify-center bg-emerald-700 rounded-full cursor-pointer transition-all duration-200 hover:bg-emerald-600 active:scale-95"
   onClick={() =>
      addedToCollection
        ? setNewCollections(newCollection.filter((c) => c.id !== col.id))
        : setNewCollections([...newCollection, col])
    }
  >
    <IonImg
      src={addedToCollection ? checked : emptyBox}
      alt="toggle"
      className="w-[2rem] p-2  h-[2rem]"
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
<div>
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
      </div>
    );
  }

  return (
    <ErrorBoundary>
        <IonContent fullscreen={true} className="ion-padding">
              <IonHeader translucent>
          <IonToolbar>
        <IonButtons slot="start">
                  {Capacitor.isNativePlatform()?<IonBackButton defaultHref={Paths.discovery} onClick={handleBack} />:null}
            </IonButtons>
            <IonTitle className="text-emerald-800 font-semibold">
              Add to Collection
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* <IonContent fullscreen={true} className="ion-padding pt-12 ion-text-emerald-800" scrollY > */}
        <div className="sm:max-w-[50rem] mx-auto ion-padding">
          <h2 className="text-xl font-semibold text-emerald-800 mb-1">
            {colInView.title?.trim() || "Untitled"}
          </h2>
          <p className="text-emerald-700 mb-4">{colInView.purpose || ""}</p>
          <div className="flex justify-between items-center mb-4">
         
            
            <div className="text-center text-emerald-800">
              <div className="text-lg font-medium">
                {newCollection.length + newStories.length}
              </div>
              <div className="text-sm text-gray-600">New items</div>
            </div>
            <div className="flex space-x-4 flex-row">
                 <div
              onClick={save}
              className="bg-soft text-white px-5 py-2 rounded-full  btn hover:bg-emerald-400 flex w-[6rem] h-[3rem] text-center  cursor-pointer shadow-md"
            >
             <h6 className="mx-auto my-auto text-[1.4em] ">Save</h6> 
           
            </div>
            <div
              onClick={()=>router.push(Paths.collection.createRoute(colInView.id))}
              className="bg-soft flex text-white px-5 py-2 w-[6rem] btn h-[3rem] hover:bg-emerald-400  rounded-full text-center  cursor-pointer shadow-md"
            >
              <h6 className="my-auto mx-auto text-[1.4rem]">View</h6>
            </div> </div>
          </div>
          <div className="pb-4">
      <select
        onChange={e => setFilterType(e.target.value)}
        value={filterType}
        className="select w-24 text-emerald-800 rounded-full bg-transparent"
      >
        {Object.entries(filterTypes).map(([, val]) => (
          <option key={val} value={val}>{val}</option>
        ))}
      </select>
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

        <div className="sm:max-w-[50em] mx-auto">
          <StoryCollectionTabs tab={tab} setTab={setTab}  storyList={storyList} colList={colList}/>
          </div>
       </div> 
       
    </IonContent>
    </ErrorBoundary>
  );
}
