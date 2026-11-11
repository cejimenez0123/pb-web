

import { useIonRouter } from "@ionic/react";
import Paths from "../../core/paths";
import styles from "../../styles/style";
import shortName from "../../core/shortName";

function formatRoomType(type) {
  if (!type) return "";

  const labels = {
    book: "Book",
    library: "Library",
    feedback: "Feedback",
    home: "Home",
    archive: "Archive",
  };

  return (
    labels[type] ||
    String(type)
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export default function RoomPreview({ room,router}) {


  if (!room) return null;

  const title = room.title?.trim() || "Untitled Room";
  const displayTitle = shortName(title, 40) || title;

  const childCount = Array.isArray(room.childCollections)
    ? room.childCollections.length
    : 0;

  const pageCount = Array.isArray(room.storyIdList)
    ? room.storyIdList.length
    : 0;

  const openRoom = () => {
    if (!room.id) return;

    router.push(
      Paths.collection.createRoute(room.id),
      "forward"
    );
  };

  return (
    <button
      type="button"
      onClick={openRoom}
      disabled={!room.id}
      aria-label={`Open room: ${title}`}
      className={`
        ${styles.card}
        ${styles.roomPreview.card}
      `}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        {room.type && (
          <div className={styles.roomPreview.type}>
            {formatRoomType(room.type)}
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <h3 className={styles.roomPreview.title}>
            {displayTitle}
          </h3>

          <span
            className={styles.roomPreview.arrow}
            aria-hidden="true"
          >
            →
          </span>
        </div>

        {room.purpose && (
          <p className={styles.roomPreview.purpose}>
            {room.purpose}
          </p>
        )}
      </div>

      <div className={styles.roomPreview.meta}>
        {pageCount > 0 && (
          <span>
            {pageCount} {pageCount === 1 ? "page" : "pages"}
          </span>
        )}

        {childCount > 0 && (
          <span>
            {childCount} {childCount === 1 ? "room" : "rooms"}
          </span>
        )}

        {pageCount === 0 && childCount === 0 && (
          <span>Empty</span>
        )}
      </div>
    </button>
  );
}
