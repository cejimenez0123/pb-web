
// import { useIonRouter } from "@ionic/react";
// import Paths from "../../core/paths";
// import styles from "../../styles/style.js";
// import shortName from "../../core/shortName.jsx";
// import truncate from "html-truncate";

// const CARD =
//   "group flex h-full min-h-[12rem]  flex-col rounded-2xl border border-plumb-border bg-plumb-surface p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-plumb-mint hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plumb-focus focus-visible:ring-offset-2 focus-visible:ring-offset-plumb-canvas dark:border-plumb-darkBorder dark:bg-plumb-dark-surface dark:hover:border-plumb-mint dark:focus-visible:ring-offset-plumb-dark-canvas sm:p-6 motion-reduce:transform-none motion-reduce:transition-none";

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
// console.log(room)
//   return (
//     <button
//       type="button"
//       onClick={openRoom}
//       aria-label={`Open room: ${room?.title || "Untitled Room"}`}
//       className={CARD}
//     >
//       {/* Main content */}
//       <div className="flex min-w-0 flex-1 flex-col">
//         {room?.type && (
//           <div
//             className={`
//               mb-2 text-[0.68rem] uppercase tracking-[0.16em]
//               ${styles.text.subheading}
//             `}
//           >
//             {formatRoomType(room.type)}
//           </div>
//         )}

//         <div className="flex items-start justify-between gap-3">
//           <h3
//             className={`
//               min-w-0 flex-1 font-serif
//               text-xl leading-snug
//               transition-colors
//               group-hover:text-plumb-mint
//               ${styles.text.body}
//             `}
//           >
//             {shortName(room?.title,24) || "Untitled Room"}
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
//               mt-2 line-clamp-2 text-sm leading-relaxed
//               ${styles.text.body}
//             `}
//           >
//             {room.purpose}
//           </p>
//         )}
//       </div>

//       {/* Metadata stays aligned at the bottom */}
//       <div
//         className={`
//           mt-5 flex min-h-5 flex-wrap items-center
//           gap-x-4 gap-y-1 border-t
//           border-plumb-border/70 pt-3
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
import styles from "../../styles/style.js";
import shortName from "../../core/shortName.jsx";

const META =
  "text-xs text-plumb-muted dark:text-plumb-darkMuted";

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

export default function RoomPreview({ room, history }) {
  const router = useIonRouter();

  const childCount = room?.childCollections?.length ?? 0;
  const pageCount = room?.storyIdList?.length ?? 0;

  const openRoom = () => {
    router.push(Paths.collection.createRoute(room.id));
  };

  return (
    <button
      type="button"
      onClick={openRoom}
      aria-label={`Open room: ${room?.title || "Untitled Room"}`}
      className={`
        group flex h-full min-h-[14rem] flex-col
        text-left
        ${styles.card}
      `}
    >
      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {room?.type && (
          <div
            className={`
              mb-3 text-[0.68rem] uppercase tracking-[0.16em]
              ${styles.text.subheading}
            `}
          >
            {formatRoomType(room.type)}
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <h3
            className={`
              min-w-0 flex-1
              font-serif text-xl leading-snug
              transition-colors
              group-hover:text-plumb-mint
              ${styles.text.body}
            `}
          >
            {shortName(room?.title, 40) || "Untitled Room"}
          </h3>

          <span
            className="
              shrink-0 pt-0.5 text-lg
              text-plumb-muted transition-transform
              group-hover:translate-x-0.5
              group-hover:text-plumb-mint
              dark:text-plumb-darkMuted
              motion-reduce:transform-none
            "
            aria-hidden="true"
          >
            →
          </span>
        </div>

        {room?.purpose && (
          <p
            className={`
              mt-4 line-clamp-3
              text-sm leading-relaxed
              ${styles.text.body}
            `}
          >
            {room.purpose}
          </p>
        )}
      </div>

      {/* Metadata */}
      <div
        className={`
          mt-6 flex min-h-5 flex-wrap items-center
          gap-x-4 gap-y-1
          border-t border-plumb-border/70 pt-4
          dark:border-plumb-darkBorder
          ${META}
        `}
      >
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
