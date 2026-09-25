import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useIonRouter } from "@ionic/react";

import Paths from "../../core/paths";
import {
  deleteStoryFromCollection,
  deleteCollectionFromCollection,
  addCollectionListToCollection,
  addStoryListToCollection,
} from "../../actions/CollectionActions";
import checkResult from "../../core/checkResult";
import Pill from "../Pill";
import shortName from "../../core/shortName";
import { useAlert } from "../../core/useAlert";
import AlertType from "../../core/AlertType";

export default function AddToItem({
  col,
  item,
  itemType = "story",
  onSuccess,
}) {
  const router = useIonRouter();
  const dispatch = useDispatch();
  const { showAlert } = useAlert();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const [pending, setPending] = useState(false);
  const [found, setFound] = useState(null);

  const isStory = itemType === "story";
  const isCollection = itemType === "collection";

  useEffect(() => {
    if (!item?.id || !col?.id) {
      setFound(null);
      return;
    }

    if (isStory) {
      const existingLink = item.collections?.find(
        (storyCollection) =>
          storyCollection?.collectionId === col.id
      );

      setFound(existingLink || null);
      return;
    }

    if (isCollection) {
      const existingLink = item.parentCollections?.find(
        (parentCollection) =>
          parentCollection?.parentCollectionId === col.id
      );

      setFound(existingLink || null);
      return;
    }

    setFound(null);
  }, [item, col?.id, isStory, isCollection]);

  const handleAdd = async () => {
    if (!item?.id || !col?.id || pending) return;

    setPending(true);

    try {
      if (isCollection) {
        const result = await dispatch(
          addCollectionListToCollection({
            id: col.id,
            list: [item.id],
            profile: currentProfile,
          })
        );

        checkResult(result, (payload) => {
          const newLink =
            payload.collection?.childCollections?.find(
              (child) =>
                child?.childCollectionId === item.id
            );

          setFound(newLink || true);

          showAlert({
            message: "Added",
            type: AlertType.success,
          });

          onSuccess?.();
        });

        return;
      }

      if (isStory) {
        const result = await dispatch(
          addStoryListToCollection({
            id: col.id,
            list: [item],
            profile: currentProfile,
          })
        );

        checkResult(result, (payload) => {
          const newLink = payload.stories?.find(
            (story) => story?.id === item.id
          );

          setFound(newLink || true);

          showAlert({
            message: "Added",
            type: AlertType.success,
          });

          onSuccess?.();
        });
      }
    } catch (error) {
      showAlert({
        message: error?.message || "Something went wrong.",
        type: AlertType.error,
      });
    } finally {
      setPending(false);
    }
  };

  const handleRemove = async () => {
    if (!found?.id || pending) return;

    setPending(true);

    try {
      if (isCollection) {
        const result = await dispatch(
          deleteCollectionFromCollection({
            tcId: found.id,
          })
        );

        checkResult(result, () => {
          setFound(null);

          showAlert({
            message: "Removed",
            type: AlertType.success,
          });

          onSuccess?.();
        });

        return;
      }

      if (isStory) {
        const result = await dispatch(
          deleteStoryFromCollection({
            stId: found.id,
          })
        );

        checkResult(result, () => {
          setFound(null);

          showAlert({
            message: "Removed",
            type: AlertType.success,
          });

          onSuccess?.();
        });
      }
    } catch (error) {
      showAlert({
        message: error?.message || "Something went wrong.",
        type: AlertType.error,
      });
    } finally {
      setPending(false);
    }
  };

  if (!col) {
    return (
      <div className="skeleton h-16 w-full rounded-full" />
    );
  }

  const collectionTitle =
    shortName(col.title, 25) || "Untitled";

  return (
    <div
      className="
        bg-base-bg dark:bg-base-surfaceDark
        rounded-full
        px-4 sm:px-6
        py-3
        shadow-sm
        flex items-center gap-3
        border border-border-default dark:border-purple
      "
    >
      <button
        type="button"
        onClick={() =>
          router.push(
            Paths.collection.createRoute(col.id)
          )
        }
        className="
          min-w-0
          flex-1
          text-left
          cursor-pointer
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-soft
          rounded-full
        "
      >
        <p
          className="
            text-sm
            font-medium
            truncate
            text-soft
            dark:text-cream
          "
        >
          {collectionTitle}
        </p>
      </button>

      {pending ? (
        <div
          className="
            shrink-0
            px-4 py-2
            rounded-full
            bg-soft/80
            text-white
            text-sm
            flex items-center gap-2
            shadow-sm
          "
        >
          <span
            className="
              w-4 h-4
              border-2
              border-white/40
              border-t-white
              rounded-full
              animate-spin
            "
          />
          <span>Loading</span>
        </div>
      ) : found ? (
        <Pill
          label="Added ✓"
          onClick={handleRemove}
          variant="secondary"
          color="softBlue"
        />
      ) : (
        <Pill
          label="Add"
          onClick={handleAdd}
          variant="primary"
          color="soft"
        />
      )}
    </div>
  );
}
// import { useParams } from "react-router-dom";
// import Paths from "../../core/paths";
// import { useContext, useLayoutEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import Context from "../../context";
// import { useIonRouter } from "@ionic/react";
// import {
//   deleteStoryFromCollection,
//   deleteCollectionFromCollection,
//   addCollectionListToCollection,
//   addStoryListToCollection,
// } from "../../actions/CollectionActions";
// import checkResult from "../../core/checkResult";
// import Pill from "../Pill";
// import shortName from "../../core/shortName";
// import { useAlert } from "../../core/useAlert";
// import AlertType from "../../core/AlertType";

// export default function AddToItem({ col, item, onSuccess }) {
 
//   const {showAlert}=useAlert()
//   const { currentProfile } = useSelector((state) => state.users);
//   const { id } = useParams();
//   const type = !!item?.data ? "story" : "collection";
//   const router = useIonRouter();
//   const dispatch = useDispatch();
//   const [pending, setPending] = useState(false);

//   const isFound = () => {
//     if (type === "story") return item?.collections?.find((s) => s.collectionId === col.id);
//     if (type === "collection") return item?.parentCollections?.find((p) => p.parentCollectionId === col.id);
//     return null;
//   };

//   const [found, setFound] = useState(isFound());
//   useLayoutEffect(() => setFound(isFound()), [item]);

//   const handleAdd = async () => {
//     setPending(true);
//     try {
//       if (type === "collection") {
//         const res = await dispatch(addCollectionListToCollection({ id: col.id, list: [item.id], profile: currentProfile }));
//         checkResult(res, (payload) => {
//           const newLink = payload.collection?.childCollections?.find((c) => c.childCollectionId === item.id);
//           setFound(newLink);
//         showAlert({message:"Added",type:AlertType.success})
//           onSuccess?.();
//         });
//       }
//       if (type === "story") {
//         const res = await dispatch(addStoryListToCollection({ id: col.id, list: [item], profile: currentProfile }));
//         checkResult(res, (payload) => {
//           const newLink = payload.stories?.find((s) => s.id === id);
//           setFound(newLink);
//          showAlert({message:"Added",type:AlertType.success});
//           onSuccess?.();
//         });
//       }
//     } catch (e) {showAlert({message:e.message,type:AlertType.error}); }
//     setPending(false);
//   };

//   const handleRemove = async () => {
//     setPending(true);
//     try {
//       if (type === "collection" && found?.id) {
//         const res = await dispatch(deleteCollectionFromCollection({ tcId: found.id }));
//         checkResult(res, () => {
//           setFound(null);
//           showAlert({message:"Removed",type:AlertType.success});
//           onSuccess?.();
//         });
//       }
//       if (type === "story" && found?.id) {
//         const res = await dispatch(deleteStoryFromCollection({ stId: found.id }));
//         checkResult(res, () => {
//           setFound(null);
//           showAlert({message:"Removed",type:AlertType.error});
//           onSuccess?.();
//         });
//       }
//     } catch (e) { showAlert({message:e.message,type:AlertType.error}) }
//     setPending(false);
//   };

//   if (!col) return <div className="skeleton h-16 w-full rounded-full" />;

//   return (
//     <div className="
//       bg-base-bg dark:bg-base-surfaceDark
//       rounded-full px-6 py-3 shadow-md
//       flex items-center justify-between border-1
//       border border-border-default dark:border-purple
//     ">
//       <div
//         onClick={() => router.push(Paths.collection.createRoute(col.id))}
//         className="flex-1 pr-3 cursor-pointer"
//       >
//         <p className="text-sm font-medium truncate text-soft dark:text-cream">
//           {shortName(col.title, 25) || "Untitled"}
//         </p>
//       </div>
//       {pending ? (
//         <div className="px-4 py-2 rounded-full bg-soft/80 text-white text-sm flex items-center gap-2 shadow-sm">
//           <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//           <span>Loading</span>
//         </div>
//       ) : !found ? (
//         <Pill label="Add" onClick={handleAdd} variant="primary" color="soft" />
//       ) : (
//         <Pill label="Added ✓" onClick={handleRemove} variant="secondary" color="softBlue" />
//       )}
//     </div>
//   );
// }