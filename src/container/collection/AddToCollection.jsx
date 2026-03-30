import { useEffect,  useMemo, useState } from "react";
import {
 
  IonContent,
  IonList,
  IonText,
  IonImg,
  IonItem,
  IonSkeletonText,
  IonLabel,
  useIonRouter,
  IonButton,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import Paths from "../../core/paths";
import {
  addCollectionListToCollection,
  addStoryListToCollection,
 
  setCollections,
} from "../../actions/CollectionActions";


import checked from "../../images/icons/check.svg";
import emptyBox from "../../images/icons/empty_circle.svg";
import StoryCollectionTabs from "../../components/page/StoryCollectionTabs.jsx";
import { Capacitor } from "@capacitor/core";
import { useParams } from "react-router";
import Enviroment from "../../core/Enviroment.js";
import { setPagesInView } from "../../actions/PageActions.jsx";
import { getCurrentProfile } from "../../actions/UserActions.jsx";

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
  const dispatch = useDispatch();

  const [filterType, setFilterType] = useState(filterTypes.filter);
  const currentProfile = useSelector((state) => state.users.currentProfile);
  // const pending = useSelector((state) => state.books.loading);

  // const profile = useSelector((state) => state.users.currentProfile);
  const [search, setSearch] = useState("");
  const colInView = useSelector((state) => state.books.collectionInView);
  const isOwner = currentProfile && colInView && currentProfile.id === colInView.authorId;
  const collections = useSelector((state) => state.books.collections);
  const cTcList = useSelector((state) => state.books.collectionToCollectionsList);
 const stories =  useSelector((state) => state.pages.pagesInView);
    const storyIdList = colInView?.storyIdList || [];
    const {id}= useParams()
    const storiesLoaded = !!stories 
const collectionLoaded = colInView && colInView.storyIdList;
const pending = storiesLoaded || collectionLoaded ? false : true; 
  const filteredSortedStories = useMemo(() => {
  let result = currentProfile?.stories || [];

  // remove nulls early
  result = result.filter(Boolean);


  if (storiesLoaded && collectionLoaded) {
  result = result.filter(
    (story) =>
      !colInView.storyIdList.some(
        (sj) => sj?.story?.id === story.id
      )
  );
// }
  }

  // filter type
  if (filterType === filterTypes.feedback) {
    result = result.filter(s => s.status && s.status.toLowerCase().includes("draft")||s.title.toLowerCase().includes("workshop"));
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
    }
  }

  // search (ONLY HERE)

  if (search.trim()) {
    const lower = search.toLowerCase();
    result = result.filter(
      (s) => s.title && s.title.toLowerCase().includes(lower)
    );
  }

  return result;
}, [stories, filterType, search,storyIdList]);

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

    if (search.trim()?.length > 0) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(c => c && c.title && c.title.toLowerCase().includes(lowerSearch));
    }

    return result;
  }, [collections, filterType, search]);




  const [tab, setTab] = useState("page");
  const [newStories, setNewStories] = useState([]);
  const [newCollections, setNewCollections] = useState([]);

 



useEffect(() => {

  if (currentProfile){
    dispatch(setCollections({collections:currentProfile.collections}))
    dispatch(setPagesInView({pages:currentProfile.stories}))

  }else{
    dispatch(getCurrentProfile())
  }
}, [ currentProfile?.id,colInView?.id,id]);



  const handleSearch = (e) => setSearch(e.target.value);

  const save = () => {
    const storyIdList = newStories.filter((s) => s);
    const collectionIdList = newCollections.filter((c) => c).map((c) => c.id);

Promise.all([
  collectionIdList?.length > 0 &&
    dispatch(
        addCollectionListToCollection({
          id: colInView.id,
          list: collectionIdList,
          profile: currentProfile,
        })
      ),
  storyIdList?.length > 0 &&
    dispatch(
        addStoryListToCollection({
          id: colInView.id,
          list: storyIdList,
          profile: currentProfile,
        })
      )
]).then(() => {router.push(Paths.collection.createRoute(colInView.id));});


    
   
     
  };

  const storyList = () => {
    if (pending) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map((i) => (
          <IonSkeletonText
            key={i}
            animated
            style={{
              width: "90%",
              height: 50,
              margin: "0.5rem auto",
              borderRadius: 12,
            }}
          />
        ))}
      </div>
    );
  }

  if (filteredSortedStories?.length < 1) {
    return (
      <div className="py-8 text-center text-gray-500">
        {isOwner ? (
          <div>
            <p>No stories available.</p>
         
          </div>
        ) : (
          <p>No stories available.</p>
        )}
      </div>
    );
  }

    return (
      <IonList    style={{ "--background": "#f4f4e0" }}>
        <div className="flex gap-4 flex-col bg-cream">
        {filteredSortedStories
       
          .map((story, i) => {
           const addedToCollection = newStories.some((s) => s.id === story.id);
           
return(<IonItem
  button
  onClick={() => router.push(Paths.page.createRoute(story.id))}
  className="rounded-full border border-emerald-600"
>
  <IonLabel slot="start">
    {story?.title?.trim() || "Untitled"}
  </IonLabel>
 
                 
<div
  slot="end"
  className="w-10 h-10 flex items-center my-auto justify-center bg-emerald-700 rounded-full cursor-pointer transition-all duration-200 hover:bg-emerald-600 active:scale-95"
  onClick={(e) => {
    e.stopPropagation(); // prevent navigation
    setNewStories((prev) =>
      prev.some((s) => s.id === story.id)
        ? prev.filter((s) => s.id !== story.id)
        : [...prev, story]
    );
  }}
>
  <IonImg
    src={addedToCollection ? checked : emptyBox}
    alt="toggle"
    className="w-[2rem] p-2 h-[2rem]"
  />
</div>


</IonItem>)
          })}
          </div>
      </IonList>
    );
  };
  
  const colList = () => {
    if (pending) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map((i) => (
          <IonSkeletonText
            key={i}
            animated
            style={{
              width: "90%",
              height: 50,
              margin: "0.5rem auto",
              borderRadius: 12,
            }}
          />
        ))}
      </div>
    );
  }

  if (filteredSortedCollections?.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        {isOwner ? (
          <div>
            <p>No collections available.</p>
            <button
              onClick={() => router.push(Paths.addToCollection.createRoute(colInView.id))}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-full shadow hover:bg-emerald-700"
            >
              Add Your First Collection
            </button>
          </div>
        ) : (
          <p>No collections available.</p>
        )}
      </div>
    );
  }

    if (cTcList?.length > 0) {
      let list = cTcList.filter(
        (col) =>
          !colInView?.childCollections?.some(
            (joint) => joint.childCollectionId === col?.id
          )
      );
    }

    return (
      <IonList 
     style={{ "--background": "#f4f4e0" }}>
           <div className="flex gap-4 flex-col bg-cream">
        {filteredSortedCollections
        
          .map((col) => {
            if (col?.id === colInView?.id) return null; 
            const addedToCollection =
              newCollections.some(c => c.id === col.id) ||
              colInView?.childCollections?.some(

                (joint) => joint.childCollectionId === col?.id
              );
return(<IonItem
  button
  onClick={() => router.push(Paths.collection.createRoute(col.id))}
  className="rounded-full border border-emerald-600"
>
  <IonLabel slot="start">
    {col?.title?.trim() || "Untitled"}
  </IonLabel>

<div
  slot="end"
  className="w-10 h-10 flex items-center my-auto justify-center bg-emerald-700 rounded-full cursor-pointer transition-all duration-200 hover:bg-emerald-600 active:scale-95"
  onClick={(e) => {
    e.stopPropagation(); // prevent navigation
    setNewCollections((prev) =>
      prev.some((c) => c.id === col.id)
        ? prev.filter((c) => c.id !==col.id)
        : [...prev,col]
    );
  }}
>
  <IonImg
    src={addedToCollection ? checked : emptyBox}
    alt="toggle"
    className="w-[2rem] p-2 h-[2rem]"
  />
</div>

</IonItem>)

          })}
  


</div>
      </IonList>
    );
  };

  if (!colInView) {
    return (
      <IonContent    style={{ "--background": Enviroment.palette.cream }}  className="ion-padding">
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
      </IonContent>
    );
  }
return(<IonContent fullscreen style={{ "--background": Enviroment.palette.cream }} className="ion-padding">
  <ErrorBoundary>
  <div className="sm:max-w-[50rem] mx-auto py-4">
    {/* Header */}
    <div className="mb-4">
      <h2 className="text-2xl font-semibold text-emerald-800 mb-1">
        {colInView.title?.trim() || "Untitled"}
      </h2>
      {colInView.purpose && (
        <p className="text-emerald-700 text-sm mb-2">{colInView.purpose}</p>
      )}
    </div>

    {/* Stats + Actions */}
    <div className="flex justify-between items-center mb-4">
      <div className="text-center">
        <div className="text-lg font-medium text-emerald-800">
          {newCollections?.length + newStories?.length}
        </div>
        <div className="text-xs text-gray-500">New items</div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={save}
          className="bg-emerald-700 text-white rounded-full px-5 py-2 shadow-md active:scale-95 transition transform"
        >
          Save
        </button>
        <button
          onClick={() => router.push(Paths.collection.createRoute(colInView.id))}
          className="bg-emerald-700 text-white rounded-full px-5 py-2 shadow-md active:scale-95 transition transform"
        >
          View
        </button>
      </div>
    </div>

    {/* Filter + Search */}
    <div className="flex justify-between max-w-[100vw] items-center mb-4 space-x-3">
      <select
        onChange={(e) => setFilterType(e.target.value)}
        value={filterType}
        className="select w-full sm:w-32 rounded-full border border-emerald-300 bg-white px-3 py-1 text-emerald-800 shadow-sm focus:outline-none"
      >
        {Object.entries(filterTypes).map(([, val]) => (
          <option key={val} value={val}>{val}</option>
        ))}
      </select>

      <div className="flex-1 rounded-full border border-emerald-300 flex items-center px-4 py-2 bg-white shadow-sm">
        <IonText className="text-emerald-700 font-medium mr-2 text-sm">Search:</IonText>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="...title"
          className=" bg-transparent w-[100%] py-1 focus:outline-none text-emerald-800 text-sm"
        />
      </div>
    </div>

    {/* List container */}
    <div className="bg-cream rounded-2xl p-3 pb-24 shadow-sm">
      <StoryCollectionTabs tab={tab} setTab={setTab} storyList={storyList} colList={colList} />
    </div>
  </div>
  </ErrorBoundary>
</IonContent>)

}
