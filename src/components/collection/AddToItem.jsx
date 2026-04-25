
import { useParams } from "react-router-dom";
import Paths from "../../core/paths";
import { useContext, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Context from "../../context";
import { useIonRouter } from "@ionic/react";
import {
  deleteStoryFromCollection,
  deleteCollectionFromCollection,
  addCollectionListToCollection,
  addStoryListToCollection,
} from "../../actions/CollectionActions";
import checkResult from "../../core/checkResult";
import Pill from "../Pill";
import shortName from "../../core/shortName";

export default function AddToItem({ col, item }) {
  const { setError, setSuccess } = useContext(Context);
  const { currentProfile } = useSelector((state) => state.users);
  const { id, type } = useParams();
  const router = useIonRouter();
  const dispatch = useDispatch();
  const [pending, setPending] = useState(false);
console.log("BOX",col)
  const isFound = () => {
    if (type === "story") return item?.collections?.find((s) => s.collectionId === col.id);
    if (type === "collection") return item?.parentCollections?.find((p) => p.parentCollectionId === col.id);
    return null;
  };

  const [found, setFound] = useState(isFound());
  useLayoutEffect(() => setFound(isFound()), [item]);

  const handleAdd = async () => {
    setPending(true);
    try {
      if (type === "collection") {
        const res = await dispatch(addCollectionListToCollection({ id: col.id, list: [item.id], profile: currentProfile }));
        checkResult(res, (payload) => {
          const newLink = payload.collection?.childCollections?.find((c) => c.childCollectionId === item.id);
          setFound(newLink);
          setSuccess("Added");
        });
      }
      if (type === "story") {
        const res = await dispatch(addStoryListToCollection({ id: col.id, list: [item], profile: currentProfile }));
        checkResult(res, (payload) => {
          const newLink = payload.stories?.find((s) => s.id === id);
          setFound(newLink);
          setSuccess("Added");
        });
      }
    } catch (e) { setError(e.message); }
    setPending(false);
  };

  const handleRemove = async () => {
    setPending(true);
    try {
      if (type === "collection" && found?.id) {
        const res = await dispatch(deleteCollectionFromCollection({ tcId: found.id }));
        checkResult(res, () => { setFound(null); setSuccess("Removed"); });
      }
      if (type === "story" && found?.id) {
        const res = await dispatch(deleteStoryFromCollection({ stId: found.id }));
        checkResult(res, () => { setFound(null); setSuccess("Removed"); });
      }
    } catch (e) { setError(e.message); }
    setPending(false);
  };

  if (!col) return <div className="skeleton h-16 w-full rounded-full" />;

  return (
    <div className="
      bg-base-bg  dark:bg-base-surfaceDark
      rounded-full px-6 py-3 shadow-md
      flex items-center justify-between border-1
      border border-border-default dark:border-purple
    ">
      <div
        onClick={() => router.push(Paths.collection.createRoute(col.id))}
        className="flex-1 pr-3 cursor-pointer"
      >
        <p className="text-sm font-medium truncate text-soft dark:text-cream">
          {shortName(col.title,25) || "Untitled"}
        </p>
      </div>

      {pending ? (
        <div className="px-4 py-2 rounded-full bg-soft/80 text-white text-sm flex items-center gap-2 shadow-sm">
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          <span>Loading</span>
        </div>
      ) : !found ? (
        <Pill label="Add" onClick={handleAdd} variant="primary" color="soft" />
      ) : (
        <Pill label="Added ✓" onClick={handleRemove} variant="secondary" color="softBlue" />
      )}
    </div>
  );
}