import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonText,
  IonImg,
  IonSkeletonText,
  IonList,
  IonButtons,
  IonBackButton,
  IonItem,
} from "@ionic/react";
import { clearPagesInView } from "../../actions/PageActions.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Paths from "../../core/paths";
import checkResult from "../../core/checkResult";
import Context from "../../context.jsx";
import ErrorBoundary from "../../ErrorBoundary";
import {
  addCollectionListToCollection,
  addStoryListToCollection,
  fetchCollectionProtected,
  fetchCollection,
  getMyCollections,
} from "../../actions/CollectionActions";
import { getMyStories } from "../../actions/StoryActions";
import loadingGif from "../../images/loading.gif";
import checked from "../../images/icons/check.svg";
import emptyBox from "../../images/icons/empty_circle.svg";
import getLocalStore from "../../core/getLocalStore.jsx";
import { Preferences } from "@capacitor/preferences";

let colStr = "collection";

export default function AddToCollectionContainer(props) {
  const pathParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { seo, setSeo } = useContext(Context);
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const pending = useSelector((state) => state.books.loading);
  const profile = useSelector((state) => state.users.currentProfile);
  const [search, setSearch] = useState("");
  const [token,setToken]=useState(null)
  const colInView = useSelector((state) => state.books.collectionInView);
  const pagesInView = useSelector((state) =>
    state.pages.pagesInView
      .filter((page) => page)
      .filter((col) => {
        if (search.length > 0) {
          return col.title.toLowerCase().includes(search.toLowerCase());
        }
        return true;
      })
  );
  useEffect(()=>{
    Preferences.get("token").then(tok=>setToken(tok.value))
  },[])
  useEffect(()=>{
    if(token){
    dispatch(getMyCollections({ profile,token }));
    dispatch(getMyStories({ profile ,token}));
    }
  },[token])
  const collections = useSelector((state) =>
    state.books.collections.filter((col) => {
      if (search.length > 0) {
        return col.title.toLowerCase().includes(search.toLowerCase());
      }
      return true;
    })
  );
  const cTcList = useSelector((state) => state.books.collectionToCollectionsList);

  const [newStories, setNewStories] = useState([]);
  const [newCollection, setNewCollections] = useState([]);
  const [tab, setTab] = useState("page");
  const location = useLocation()
  useLayoutEffect(() => {
    if (profile) {
      dispatch(fetchCollectionProtected(pathParams));
    } else {
      dispatch(fetchCollection(pathParams));
    }
   
  }, [location.pathname]);

  const save = () => {
    let storyIdList = newStories.filter((stor) => stor);
    let collectionIdList = newCollection.filter((col) => col).map((col) => col.id);

    if (collectionIdList.length > 0 && currentProfile)
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
        dispatch(clearPagesInView());
        navigate(Paths.collection.createRoute(colInView.id));
      });

    if (storyIdList.length > 0)
      dispatch(
        addStoryListToCollection({
          id: colInView.id,
          list: storyIdList,
          profile: currentProfile,
        })
      ).then((res) => {
        dispatch(clearPagesInView());
        setNewCollections([]);
        setNewStories([]);
        navigate(Paths.collection.createRoute(colInView.id));
      });
  };

  

  const addNewCollection = (col) => {
    setNewCollections((state) => {
      return [...state, col];
    });
  };
  const addNewStory = (story) => {
    setNewStories((state) => {
      return [...state, story];
    });
  };
  const removeNewStory = (sto) => {
    let list = newStories.filter((story) => story.id !== sto.id);
    setNewStories(list);
  };
  const removeNewCollection = (col) => {
    let list = newCollection.filter((collection) => col.id !== collection.id);
    setNewCollections(list);
  };
  const handleSearch = (value) => setSearch(value);

  const storyList = () => {
    return (
        <div className="my-4  mx-auto text-emerald-800 overflow-scroll text-left mb-2">
      
       
        <IonList
    
        >
          {pagesInView
            .filter((str) => str)
            .filter(
              (story) =>
                colInView &&
                colInView.storyIdList &&
                !colInView.storyIdList.find((storyJoint) => storyJoint && storyJoint.story && (storyJoint.story.id === story.id))
            )
            .map((story,i) => {
              const addedToCollection =
                colInView?.storyIdList?.some((sj) => sj && sj.story && (sj.story.id === story.id)) ||
                newStories.includes(story);
              return (
                <IonItem key={i}>
                <div
                  key={story.id}
                  className="text-left mx-auto  flex flex-row justify-between border-3 border-emerald-400 rounded-full py-4 my-2"
                >
                  <h2 className="text-l my-auto max-w-[15em] truncate text-md md:text-lg ml-8 mont-medium">
                    {story.title && story.title.trim().length > 0 ? story.title : "Untitled"}
                  </h2>
                  <div className="bg-emerald-800 rounded-full max-w-[10em] overflow-hidden text-ellipsis mr-6 p-2 cursor-pointer select-none">
                    {addedToCollection ? (
                      <div onClick={() => removeNewStory(story)} role="button" tabIndex={0} onKeyPress={() => removeNewStory(story)}>
                        <IonImg
                          src={checked}
                          alt="checked"
                          style={{ maxHeight: "1.5rem", maxWidth: "1.5rem" }}
                        />
                      </div>
                    ) : (
                      <div onClick={() => addNewStory(story)} role="button" tabIndex={0} onKeyPress={() => addNewStory(story)}>
                        <IonImg
                          src={emptyBox}
                          alt="empty"
                          className="text-emerald-800"
                          style={{ maxHeight: "1.5rem", maxWidth: "1.5rem" }}
                        />
                      </div>
                    )}
                  </div>
                </div></IonItem>
              );
            })}
        </IonList>
      </div>
    );
  };

  const colList = () => {
    let list = [];
    if (collections) {
      list = collections;
    }
    if (cTcList.length > 0) {
      list = cTcList.filter(
        (col) => !colInView.childCollections.find((joint) => joint.childCollectionId === col.id)
      );
    }
    return (
      <div className="my-4 mx-auto text-emerald-800 overflow-scroll text-left mb-2">
       
        <IonList>
          {list.map((col) => {
            if (col && colInView && col.id && colInView.id && col.id === colInView.id) {
              return null;
            }
            const addedToCollection =
              colInView?.childCollections?.some((colJoint) => colJoint.childCollectionId === col.id) ||
              newCollection.includes(col);
            return (
                <IonItem>
              <div
                key={col.id}
                className="text-left mx-auto w-[92vw] md:w-[96%]  flex flex-row justify-between border-3 border-emerald-400 rounded-full py-4 my-2"
              >
                <h2 className="text-l my-auto max-w-[15em] truncate text-md md:text-lg ml-8 mont-medium">
                  {col.title && col.title.trim().length > 0 ? col.title : "Untitled"}
                </h2>
                <div className="bg-emerald-800 rounded-full overflow-hidden text-ellipsis mr-6 p-2 cursor-pointer select-none">
                  {addedToCollection ? (
                    <div
                      onClick={() => removeNewCollection(col)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={() => removeNewCollection(col)}
                    >
                      <IonImg
                        src={checked}
                        style={{ maxWidth: 32, maxHeight: 32 }}
                        alt="checked"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => addNewCollection(col)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={() => addNewCollection(col)}
                    >
                      <IonImg
                        src={emptyBox}
                        style={{ maxWidth: 32, maxHeight: 32 }}
                        alt="empty"
                      />
                    </div>
                  )}
                </div>
              </div>
              </IonItem>
            );
          })}
        </IonList>
      </div>
    );
  };

  if (!colInView) {
    return pending ? (
      <IonContent fullscreen={true} scrollY>
        <IonSkeletonText
          animated
          style={{ width: "96vw", height: 150, margin: "2rem auto", borderRadius: 18 }}
        />
        <IonSkeletonText
          animated
          style={{ width: "96vw", height: 400, margin: "2rem auto", borderRadius: 18 }}
        />
      </IonContent>
    ) : (
      <IonContent fullscreen scrollY>
        <div className="ion-text-center ion-padding">
          <IonText color="medium">
            <h5>Collection Not Found</h5>
          </IonText>
        </div>
      </IonContent>
    );
  }

  return (
    <ErrorBoundary>
    <IonContent fullscreen={true}scrollY className="ion-padding" >
     <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
            <IonBackButton defaultHref={Paths.myProfile()}/>
        </IonButtons>
        <IonTitle >Add to Collection</IonTitle>
        <IonButtons>
            <div/>
        </IonButtons>
        </IonToolbar>
     </IonHeader>
            <h2 className="text-2xl truncate md:max-w-[30em] text-emerald-800 mb-2">{colInView.title?.trim() || "Untitled"}</h2>
          <h6 className="sm:my-4 text-emerald-800 sm:mx-8 p-4 min-h-24 text-lg sm:max-w-[35rem]">
            {colInView ? colInView.purpose : null}
          </h6>

          <div className="flex flex-row justify-center">
            {/* Replace button with div + IonText for custom style */}
            <div
              className="bg-green-600 ml-4 mont-medium rounded-full text-white mt-4 px-6 text-xl cursor-pointer flex items-center justify-center select-none"
              style={{ minWidth: 120, minHeight: 44 }}
              role="button"
              tabIndex={0}
              onClick={save}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") save();
              }}
            >
              <IonText>Save</IonText>
            </div>

            <div className="text-xl my-auto flex flex-col content-center px-4 pt-[0.7em] rounded-full">
              <span className="text-center text-emerald-800 mx-auto">{newCollection.length + newStories.length}</span>
              <span className="text-center text-emerald-800 text-sm">New items</span>
            </div>
          </div>
        {/* </div> */}

        {/* Search Input */}
        <label className="flex max-w-[96vw] md:w-page mx-auto border-emerald-700 border-2 rounded-full mb-1 mt-8 flex-row mx-2 items-center p-2">
          <IonText className="my-auto text-emerald-800 mx-2 w-full mont-medium">Search:</IonText>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="rounded-full open-sans-medium px-2 min-w-[19em] py-1 text-sm bg-transparent my-1 rounded-full border-emerald-700 border-1 text-emerald-800 focus:outline-none"
            placeholder="Search collections"
            aria-label="Search collections"
          />
        </label>

        <div className="sm:flex rounded-t-lg  mx-auto sm:flex-row">
          <div className=" md:mt-8 mx-auto flex flex-col ">
            <div role="tablist" className="tabs grid">
              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                defaultChecked
                className="tab hover:min-h-10 [--tab-bg:transparent] rounded-full mont-medium text-emerald-800 border-3 w-[96vw] md:w-page text-xl"
                aria-label="Stories"
                onChange={() => setTab("page")}
                checked={tab === "page"}
              />
              <div
                role="tabpanel"
                className="tab-content pt-1    "
              >
                {tab === "page" && storyList()}
              </div>

              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                className="tab hover:min-h-10 [--tab-bg:transparent] rounded-full mont-medium text-emerald-800 border-3  text-xl"
                aria-label="Collections"
                onChange={() => setTab("collection")}
                checked={tab === "collection"}
              />
              <div
                role="tabpanel"
                className="tab-content pt-1 lg:py-4 rounded-lg md:mx-auto "
              >
                {tab === "collection" && colList()}
              </div>
            </div>
          </div>
        </div>
     
    </IonContent>
    </ErrorBoundary>
  );
}
