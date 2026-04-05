import { useEffect, useMemo, useState } from "react";
import {
  IonContent,
  IonList,
  IonText,
  IonSkeletonText,
  useIonRouter,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import Paths from "../../core/paths";
import {
  addCollectionListToCollection,
  addStoryListToCollection,
  fetchCollectionProtected,
  getMyCollections,
  setCollections,
} from "../../actions/CollectionActions";
import StoryCollectionTabs from "../../components/page/StoryCollectionTabs.jsx";
import { useParams } from "react-router";
import Enviroment from "../../core/Enviroment.js";
import { setPagesInView } from "../../actions/PageActions.jsx";
import Pill from "../../components/Pill.jsx";
import { getMyStories } from "../../actions/StoryActions.jsx";

const filterTypes = {
  filter: "Filter",
  recent: "Recent",
  oldest: "Oldest",
  feedback: "Feedback",
  AZ: "A-Z",
  ZA: "Z-A"
};

export default function AddToCollectionContainer() {
  const router = useIonRouter();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [filterType, setFilterType] = useState(filterTypes.filter);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("page");
  const [newStories, setNewStories] = useState([]);
  const [newCollections, setNewCollections] = useState([]);

  const currentProfile = useSelector((state) => state.users.currentProfile);
  const {myCollections:collections,collectionInView:colInView}=useSelector(state=>state.books)
  const stories = useSelector((state) => state.pages.myPages);
  const [pending,setPending]=useState(false)
  const storyIdList = colInView?.storyIdList || [];
  // const storiesLoaded = !!stories;
  // const collectionLoaded = colInView && colInView.storyIdList;
  // const pending = !(storiesLoaded && collectionLoaded);

  const isOwner = currentProfile && colInView && currentProfile.id === colInView.authorId;
useEffect(() => {
    if (currentProfile) {
      dispatch(getMyCollections());
      dispatch(getMyStories());
    }

  }, [currentProfile, dispatch]);
useEffect(()=>{
      dispatch(fetchCollectionProtected({id}))
},[id])
  const filteredSortedStories = useMemo(() => {
    let result = stories?.filter(Boolean) || [];

    if (!pending && colInView?.storyIdList) {
      result = result.filter(
        (story) => !colInView?.storyIdList.some((s) => s?.story?.id === story.id)
      );
    }

    if (filterType === filterTypes.feedback) {
      result = result.filter(
        (s) => s.status?.toLowerCase().includes("draft") || s.title.toLowerCase().includes("workshop")
      );
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

    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter((s) => s.title?.toLowerCase().includes(lower));
    }

    return result;
  }, [stories, filterType, search, storyIdList]);

  const filteredSortedCollections = useMemo(() => {
    let result = collections || [];
    if (filterType === filterTypes.feedback) {
      result = collections.filter(
        (col) => col.type === "feedback" || col.purpose.toLowerCase().includes("feedback")
      );
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
      result = result.filter((c) => c?.title?.toLowerCase().includes(lowerSearch));
    }

    return result;
  }, [collections, filterType, search]);

  const save = () => {
    const storyIdList = newStories.filter(Boolean);
    const collectionIdList = newCollections.filter(Boolean).map((c) => c.id);

    Promise.all([
      collectionIdList.length > 0 &&
        dispatch(
          addCollectionListToCollection({
            id: colInView.id,
            list: collectionIdList,
            profile: currentProfile,
          })
        ),
      storyIdList.length > 0 &&
        dispatch(
          addStoryListToCollection({
            id: colInView.id,
            list: storyIdList,
            profile: currentProfile,
          })
        ),
    ]).then(() => {
      router.push(Paths.collection.createRoute(colInView.id));
    });
  };

  const storyList = () => {
    if (pending) {
      return (
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((i) => (
            <IonSkeletonText
              key={i}
              animated
              style={{ width: "90%", height: 50, margin: "0.5rem auto", borderRadius: 12 }}
            />
          ))}
        </div>
      );
    }

    if (!filteredSortedStories.length) {
      return (
        <div className="py-8 text-center text-gray-500">
          {isOwner ? <p>No stories available.</p> : <p>No stories available.</p>}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {filteredSortedStories.map((story) => {
          const added = newStories.some((s) => s.id === story.id);
          return (
            <div
              key={story.id}
              className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between"
            >
              <div
                onClick={() => router.push(Paths.page.createRoute(story.id))}
                className="flex-1 pr-3 cursor-pointer"
              >
                <p className="text-sm font-medium truncate">{story.title.length>25?story.title.slice(0,25)+"..." : story.title || "Untitled"}</p>
              </div>
              <Pill
                label={added ? "Added ✓" : "Add"}
                onClick={() =>
                  setNewStories((prev) =>
                    added ? prev.filter((s) => s.id !== story.id) : [...prev, story]
                  )
                }
                variant={added ? "secondary" : "primary"}
                color={added ? "softBlue" : "soft"}
              />
            </div>
          );
        })}
      </div>
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
              style={{ width: "90%", height: 50, margin: "0.5rem auto", borderRadius: 12 }}
            />
          ))}
        </div>
      );
    }

    if (!filteredSortedCollections.length) {
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

    return (
      <div className="space-y-2">
        {filteredSortedCollections.map((col) => {
          if (col.id === colInView.id) return null;
          const added =
            newCollections.some((c) => c.id === col.id) ||
            colInView?.childCollections?.some((j) => j.childCollectionId === col.id);

          return (
            <div
              key={col.id}
              className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between"
            >
              <div
                onClick={() => router.push(Paths.collection.createRoute(col.id))}
                className="flex-1 pr-3 cursor-pointer"
              >
                <p className="text-sm font-medium truncate">{col.title || "Untitled"}</p>
              </div>
              <Pill
                label={added ? "Added ✓" : "Add"}
                onClick={() =>
                  setNewCollections((prev) =>
                    added ? prev.filter((c) => c.id !== col.id) : [...prev, col]
                  )
                }
                variant={added ? "secondary" : "primary"}
                color={added ? "softBlue" : "soft"}
              />
            </div>
          );
        })}
      </div>
    );
  };

  if (!colInView) {
    return (
      <IonContent style={{ "--background": Enviroment.palette.cream }} className="ion-padding">
        {pending ? (
          <>
            <IonSkeletonText
              animated
              style={{ width: "90%", height: 120, margin: "1rem auto", borderRadius: 16 }}
            />
            <IonSkeletonText
              animated
              style={{ width: "90%", height: 300, margin: "1rem auto", borderRadius: 16 }}
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
    );
  }

  return (
    <IonContent fullscreen style={{ "--background": Enviroment.palette.cream }} className="ion-padding">
      <ErrorBoundary>
        <div className="sm:max-w-[50rem] mx-auto py-4">
          {/* Header */}
          <div className="mb-4 space-y-2">
            <h2 className="text-xl font-semibold text-soft">Add to {colInView?.title||"Collection"}</h2>
            <p className="text-sm text-gray-500">Select stories or collections to include</p>
            <div className="flex items-center justify-between mt-3">
               
              {/* <span className="text-sm text-soft">{newStories.length + newCollections.length} selected</span> */}
              <Pill
                label="View"
                onClick={() => router.push(Paths.collection.createRoute(colInView.id))}
                variant="secondary"
               baseClass="bg-blueSea text-white"
              />
                  <Pill
                label={`Save (${newStories.length + newCollections.length})`}
                onClick={save}
                variant="primary"
               baseClass="bg-blueSea text-white"
                className="w-full justify-center text-base py-4 shadow-lg"
              />
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
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
            <div className="flex-1 rounded-full border border-emerald-300 flex items-center px-4 py-2 bg-white shadow-sm">
              <IonText className="text-emerald-700 font-medium mr-2 text-sm">Search:</IonText>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="...title"
                className="bg-transparent w-[100%] py-1 focus:outline-none text-emerald-800 text-sm"
              />
            </div>

          </div>

          {/* List container */}
          <div className="bg-cream rounded-2xl p-3 pb-24 shadow-sm">
            <StoryCollectionTabs tab={tab} setTab={setTab} storyList={storyList} colList={colList} />
          </div>

          {/* Sticky Save
          <div className="fixed bottom-4 left-0 right-0 px-4">
            <div className="max-w-[42em] mx-auto">
              <Pill
                label={`Save (${newStories.length + newCollections.length})`}
                onClick={save}
                variant="primary"
                color="blueSea"
                className="w-full justify-center text-base py-4 shadow-lg"
              />
            </div>
          </div> */}
        </div>
      </ErrorBoundary>
    </IonContent>
  );
}
