
import { useParams } from "react-router-dom";
import Paths from "../../core/paths";
import loadingGif from "../../images/loading.gif";
import { useContext, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Context from "../../context";
import { IonImg, useIonRouter } from "@ionic/react";
import {
  deleteStoryFromCollection,
  deleteCollectionFromCollection,
  addCollectionListToCollection,
  addStoryListToCollection,
} from "../../actions/CollectionActions";
import checkResult from "../../core/checkResult";
import Pill from "../Pill"; // adjust path

export default function AddToItem({ col }) {
  const { setError, setSuccess } = useContext(Context);
  const { currentProfile } = useSelector((state) => state.users);
  const { id, type } = useParams();

  const collectionInView = useSelector((s) => s.books.collectionInView);
  const pageInView = useSelector((s) => s.pages.pageInView);

  const [item, setItem] = useState(
    type === "collection" ? collectionInView : pageInView
  );

  const router = useIonRouter();
  const dispatch = useDispatch();

  const [pending, setPending] = useState(false);

  // ===== CHECK IF ALREADY ADDED =====
  const isFound = () => {
    if (type === "story" && item?.collections) {
      return item.collections.find((s) => s.collectionId === col.id);
    }
    if (type === "collection" && item?.parentCollections) {
      return item.parentCollections.find(
        (p) => p.parentCollectionId === col.id
      );
    }
    return null;
  };

  const [found, setFound] = useState(isFound());

  useLayoutEffect(() => {
    setFound(isFound());
  }, [item]);

  // ===== ADD =====
  const handleAdd = async () => {
    setPending(true);

    try {
      if (type === "collection") {
        const res = await dispatch(
          addCollectionListToCollection({
            id: col.id,
            list: [item.id],
            profile: currentProfile,
          })
        );

        checkResult(res, (payload) => {
          setItem(payload.collection);
          setSuccess("Added");
        });
      }

      if (type === "story") {
        const res = await dispatch(
          addStoryListToCollection({
            id: col.id,
            list: [item],
            profile: currentProfile,
          })
        );

        checkResult(res, (payload) => {
          if (payload.stories) {
            setItem(payload.stories.find((s) => s.id === id));
          }
          setSuccess("Added");
        });
      }
    } catch (e) {
      setError(e.message);
    }

    setPending(false);
  };

  // ===== REMOVE =====
  const handleRemove = async () => {
    setPending(true);

    try {
      if (type === "collection" && found?.id) {
        const res = await dispatch(
          deleteCollectionFromCollection({ tcId: found.id })
        );

        checkResult(res, (payload) => {
          setItem(payload.collection);
          setSuccess("Removed");
        });
      }

      if (type === "story" && found?.id) {
        const res = await dispatch(
          deleteStoryFromCollection({ stId: found.id })
        );

        checkResult(res, (payload) => {
          if (payload.story) setItem(payload.story);
          setSuccess("Removed");
        });
      }
    } catch (e) {
      setError(e.message);
    }

    setPending(false);
  };

  if (!col) {
    return <div className="skeleton h-16 w-full rounded-xl" />;
  }

  return (
    <div className="bg-base-bg rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between">

      {/* LEFT: TITLE */}
      <div
        onClick={() => router.push(Paths.collection.createRoute(col.id))}
        className="flex-1 pr-3 cursor-pointer"
      >
        <p className="text-sm font-medium truncate">
          {col.title || "Untitled"}
        </p>
      </div>

      {/* RIGHT: ACTION */}
   {pending ? (
  <div className="px-4 py-3 rounded-full bg-soft/80 text-white text-sm flex items-center gap-2 shadow-sm">
    <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
    <span>Adding</span>
  </div>
) : !found ? (
  <Pill
    label="Add"
    onClick={handleAdd}
    variant="primary"
    color="soft"
  />
) : (
  <Pill
    label="Added ✓"
    onClick={handleRemove}
    variant="secondary"
    color="softBlue"
  />
)}
    </div>
  );
}