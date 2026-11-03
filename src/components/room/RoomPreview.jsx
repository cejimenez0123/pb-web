


// import { useIonRouter } from "@ionic/react";
// import Paths from "../../core/paths";
// import styles from "../../styles/style.js";
// import shortName from "../../core/shortName.jsx";

// const META =
//   "text-xs text-plumb-muted dark:text-plumb-darkMuted";

// function formatRoomType(type) {
//   if (!type) return "";

//   const labels = {
//     book: "Book",
//     library: "Library",
//     feedback: "Feedback",
//     home: "Home",
//     archive: "Archive",
//   };

//   return (
//     labels[type] ||
//     String(type)
//       .replace(/[-_]/g, " ")
//       .replace(/\b\w/g, (char) => char.toUpperCase())
//   );
// }

// export default function RoomPreview({ room, history }) {
//   const router = useIonRouter();

//   const childCount = room?.childCollections?.length ?? 0;
//   const pageCount = room?.storyIdList?.length ?? 0;

//   const openRoom = () => {
//     router.push(Paths.collection.createRoute(room.id));
//   };

//   return (
//     <button
//       type="button"
//       onClick={openRoom}
//       aria-label={`Open room: ${room?.title || "Untitled Room"}`}
//       className={`
//         group flex h-full min-h-[14rem] flex-col
//         text-left
//         ${styles.card}
//       `}
//     >
//       {/* Main content */}
//       <div className="flex min-w-0 flex-1 flex-col">
//         {room?.type && (
//           <div
//             className={`
//               mb-3 text-[0.68rem] uppercase tracking-[0.16em]
//               ${styles.text.subheading}
//             `}
//           >
//             {formatRoomType(room.type)}
//           </div>
//         )}

//         <div className="flex items-start justify-between gap-4">
//           <h3
//             className={`
//               min-w-0 flex-1
//               font-serif text-xl leading-snug
//               transition-colors
//               group-hover:text-plumb-mint
//               ${styles.text.body}
//             `}
//           >
//             {shortName(room?.title, 40) || "Untitled Room"}
//           </h3>

//           <span
//             className="
//               shrink-0 pt-0.5 text-lg
//               text-plumb-muted transition-transform
//               group-hover:translate-x-0.5
//               group-hover:text-plumb-mint
//               dark:text-plumb-darkMuted
//               motion-reduce:transform-none
//             "
//             aria-hidden="true"
//           >
//             →
//           </span>
//         </div>

//         {room?.purpose && (
//           <p
//             className={`
//               mt-4 line-clamp-3
//               text-sm leading-relaxed
//               ${styles.text.body}
//             `}
//           >
//             {room.purpose}
//           </p>
//         )}
//       </div>

//       {/* Metadata */}
//       <div
//         className={`
//           mt-6 flex min-h-5 flex-wrap items-center
//           gap-x-4 gap-y-1
//           border-t border-plumb-border/70 pt-4
//           dark:border-plumb-darkBorder
//           ${META}
//         `}
//       >
//         {pageCount > 0 && (
//           <span>
//             {pageCount} {pageCount === 1 ? "page" : "pages"}
//           </span>
//         )}

//         {childCount > 0 && (
//           <span>
//             {childCount} {childCount === 1 ? "room" : "rooms"}
//           </span>
//         )}

//         {pageCount === 0 && childCount === 0 && (
//           <span>Empty</span>
//         )}
//       </div>
//     </button>
//   );
// }



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

export default function RoomPreview({ room }) {
  const router = useIonRouter();

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
