import { useIonRouter } from "@ionic/react";
import Paths from "../../core/paths";

export default function RoomPreview({
  room,
  history,
}) {
    const router = useIonRouter()
  const childCount =
    room?.childCollections?.length ?? 0;

  const pageCount =
    room?.storyIdList?.length ?? 0;


  return (
    <button
      onClick={() =>
        router.push(
          Paths.collection.createRoute(
            room.id
          )
        )
      }
      className="
        group
        w-[100%]
        text-left
        rounded-2xl
        border
        border-card-border
        bg-card-background
        p-5
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-button-primary-bg
        hover:shadow-sm
        dark:bg-plumb-surface Dark
        dark:border-white/10
      "
    >

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          {room?.type && (
            <p
              className="
                text-[0.68rem]
                uppercase
                tracking-[0.16em]
                text-text-secondary
                mb-2
              "
            >
              {formatRoomType(room.type)}
            </p>
          )}

          <h3
            className="
              font-serif
              text-xl
              text-text-primary
              dark:text-cream
              group-hover:text-text-brand
              transition-colors
            "
          >
            {room?.title ||
              "Untitled Room"}
          </h3>

          {room?.purpose && (
            <p
              className="
                mt-2
                text-sm
                leading-relaxed
                text-text-secondary
                line-clamp-2
              "
            >
              {room.purpose}
            </p>
          )}

        </div>


        <span
          className="
            text-lg
            text-text-secondary
            group-hover:text-text-brand
            transition-colors
          "
          aria-hidden="true"
        >
          →
        </span>

      </div>


      <div
        className="
          flex
          flex-wrap
          gap-x-4
          gap-y-1
          mt-5
          text-xs
          text-text-secondary
        "
      >
        {pageCount > 0 && (
          <span>
            {pageCount}{" "}
            {pageCount === 1
              ? "page"
              : "pages"}
          </span>
        )}

        {childCount > 0 && (
          <span>
            {childCount}{" "}
            {childCount === 1
              ? "room"
              : "rooms"}
          </span>
        )}

        {pageCount === 0 &&
          childCount === 0 && (
            <span>Empty</span>
          )}
      </div>

    </button>
  );
}
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
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      )
  );
}