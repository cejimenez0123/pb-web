import { useNavigate, useParams } from "react-router-dom";
import Paths from "../../core/paths";
import loadingGif from "../../images/loading.gif";
import addBox from "../../images/icons/add_circle.svg";
import clear from "../../images/icons/close.svg";
import { useContext, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Context from "../../context";
import { IonImg } from "@ionic/react";
import {
  deleteStoryFromCollection,
  deleteCollectionFromCollection,
  addCollectionListToCollection,
  addStoryListToCollection
} from "../../actions/CollectionActions";
import checkResult from "../../core/checkResult";

export default function AddToItem({ col }) {
  const pathParams = useParams();
  const { setError, setSuccess, currentProfile } = useContext(Context);
  const { id, type } = pathParams;

  const collectionInView = useSelector(state => state.books.collectionInView);
  const pageInView = useSelector(state => state.pages.pageInView);
  const [item, setItem] = useState(type === "collection" ? collectionInView : pageInView);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pending, setPending] = useState(false);

  // Determine if the current item is already in the collection 'col'
  const isFound = () => {
    if (type === "story" && item?.collections && item.id) {
      return item.collections.find(sTc => sTc.collectionId === col.id);
    }
    if (type === "collection" && item?.parentCollections && item.id) {
      return item.parentCollections.find(ptc => ptc.parentCollectionId === col.id);
    }
    return null;
  };

  const [found, setFound] = useState(isFound());

  // Add the item (collection or story) to the collection col
  const addStory = (e) => {
    e.preventDefault();
    setPending(true);

    if (item?.storyIdList && type === "collection") {
      dispatch(addCollectionListToCollection({ id: col.id, list: [item.id], profile: currentProfile })).then(res =>
        checkResult(res, payload => {
          setItem(payload.collection);
          setPending(false);
          setSuccess("Added to collection");
        }, err => {
          setError(err.message);
          setPending(false);
        })
      );
      return;
    }

    if (item && type === "story") {
      let story = item || { id };
      dispatch(addStoryListToCollection({ id: col.id, list: [story], profile: currentProfile })).then(res => {
        checkResult(res, payload => {
          if (payload.stories) {
            setItem(payload.stories.find(s => s.id === id));
          }
          setPending(false);
          setSuccess("Added story to collection");
        }, err => {
          setError(err.message);
          setPending(false);
        });
      });
      return;
    }
  };

  // Remove the item from the collection col
  const deleteStory = (e) => {
    e.preventDefault();
    setPending(true);

    if (item && type === "collection" && item.id && found && found.id) {
      dispatch(deleteCollectionFromCollection({ tcId: found.id })).then(res => {
        checkResult(res, payload => {
          if (payload.collection) setItem(payload.collection);
          setPending(false);
          setSuccess("Removed from collection");
        }, err => {
          setError(err.message);
          setFound(isFound());
          setPending(false);
        });
      });
      return;
    }

    if (item && type === "story" && found && found.id) {
      dispatch(deleteStoryFromCollection({ stId: found.id })).then(res => {
        checkResult(res, payload => {
          setPending(false);
          if (payload.story) setItem(payload.story);
          setFound(isFound());
          setSuccess("Removed story from collection");
        }, err => {
          setError(err.message);
          setPending(false);
        });
      });
      return;
    }

    setPending(false);
    setError("Something went wrong");
  };

  useLayoutEffect(() => {
    setFound(isFound());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  if (!col) {
    return <div className="skeleton w-[100%]" />;
  }

  return (
    <div className="border-emerald-600 border-2 mx-auto w-[96%] flex flex-row justify-between rounded-full px-6 py-4 my-3 items-center">
      <h6
        onClick={() => navigate(Paths.collection.createRoute(col.id))}
        className="text-md lg:text-xl my-auto overflow-hidden text-ellipsis max-w-[12rem] md:max-w-[25rem] whitespace-nowrap cursor-pointer"
        role="link"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') navigate(Paths.collection.createRoute(col.id)); }}
      >
        {col.title.length>0?col.title:"Untitled"}
      </h6>
      {pending ? (
        <div className="bg-emerald-600 p-2 max-w-10 max-h-10 rounded-full flex items-center justify-center">
          <IonImg alt="loading" src={loadingGif} style={{ width: 24, height: 24 }} />
        </div>
      ) : !found ? (
        <div
          onClick={addStory}
          className="bg-emerald-600 p-2 max-w-12 max-h-12 rounded-full cursor-pointer flex items-center justify-center hover:bg-emerald-700 transition"
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') addStory(e); }}
          aria-label={`Add ${col.title} to collection`}
        >
          <IonImg alt="add" src={addBox} style={{ width: 28, height: 28 }} />
        </div>
      ) : (
        <div
          onClick={deleteStory}
          className="bg-emerald-600 p-2 max-w-12 max-h-12 rounded-full cursor-pointer flex items-center justify-center hover:bg-red-600 transition"
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') deleteStory(e); }}
          aria-label={`Remove ${col.title} from collection`}
        >
          <IonImg alt="remove" src={clear} style={{ width: 28, height: 28 }} />
        </div>
      )}
    </div>
  );
}

