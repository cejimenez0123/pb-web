

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
import styles from "../../styles/style";

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
  const isSupported = isStory || isCollection;

  useEffect(() => {
    if (!item?.id || !col?.id || !isSupported) {
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

    const existingLink = item.parentCollections?.find(
      (parentCollection) =>
        parentCollection?.parentCollectionId === col.id
    );

    setFound(existingLink || null);
  }, [item, col?.id, isStory, isCollection, isSupported]);

  const handleAdd = async () => {
    if (!item?.id || !col?.id || pending || !isSupported) {
      return;
    }

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
            payload?.collection?.childCollections?.find(
              (child) =>
                child?.childCollectionId === item.id
            );

          // Keep the added state even if the API doesn't return
          // the relationship ID. Removal requires a real ID.
          setFound(newLink || { added: true });

          showAlert({
            message: "Added",
            type: AlertType.success,
          });

          onSuccess?.();
        });

        return;
      }

      const result = await dispatch(
        addStoryListToCollection({
          id: col.id,
          list: [item],
          profile: currentProfile,
        })
      );

      checkResult(result, (payload) => {
        const newLink = payload?.stories?.find(
          (story) => story?.id === item.id
        );

        setFound(newLink || { added: true });

        showAlert({
          message: "Added",
          type: AlertType.success,
        });

        onSuccess?.();
      });
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
    // A real relationship ID is required to remove an item.
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
      <div
        className={styles.addToCollection.skeleton}
        aria-hidden="true"
      />
    );
  }

  const collectionTitle =
    shortName(col.title, 25) || "Untitled";

  const canRemove = Boolean(found?.id);

  return (
    <div className={styles.pageShell.row.outer+" border border-1 border-plumb-mint/70  dark:border-plumb-surface"} >
      <button
        type="button"
    onClick={() =>
          router.push(Paths.collection.createRoute(col.id))
        }
      > 
        <span className={styles.addToCollection.rowTitle+" text-plumb-ink dark:text-plumb-surface text-lg truncate"}>
          {collectionTitle}
        </span>
      </button>

      {pending ? (
        <div
          className={styles.addToCollection.pending}
          role="status"
          aria-live="polite"
        >
          <span
            className={styles.addToCollection.spinner}
            aria-hidden="true"
          />
          <span>Loading</span>
        </div>
      ) : found ? (
        <Pill
          label="Added ✓"
          onClick={canRemove ? handleRemove : undefined}
       baseClass={styles.pill.interactive+" border border-t-1 border-b-1 border-plumb-mint/70 text-plumb-mint"}
      
          
        />
      ) : (
        <Pill
          label="Add"
          onClick={handleAdd}
   baseClass={styles.pill.interactive+""}
      
        />
      )}
    </div>
  );
}