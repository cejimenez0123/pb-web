import styles from "../../styles/style";

function RoomGrid({ rooms, onSelectRoom }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {rooms.map((profileToCollection) => (
        <RoomCard
          key={profileToCollection.id}
          profileToCollection={profileToCollection}
          onClick={() => onSelectRoom(profileToCollection)}
        />
      ))}
    </div>
  );
}

function RoomCard({ profileToCollection, onClick }) {
  const room = profileToCollection?.collection;

  if (!room?.id) return null;

  const pieceCount =
    room?.storyCount ??
    room?.stories?.length ??
    room?.storyIdList?.length ??
    null;

  return (
    <div
      type="button"
      onClick={onClick}
      aria-label={`Open room ${room.title || room.name || "untitled room"}`}
      className={styles.roomPreview.card}

    >
      <p
        className={`
          ${styles.text.metadata}
          uppercase tracking-[0.1em]
        `}
      >
        Room
      </p>

      <div className="flex min-w-0 items-start justify-between gap-4">
        <h3
          className={`
            ${styles.text.title}
            mt-2 min-w-0 break-words font-serif
          `}
        >
          {room.title || room.name || "Untitled room"}
        </h3>

        <span
          aria-hidden="true"
          className="
            mt-2 shrink-0 text-xl
            text-plumb-muted transition-transform
            group-hover:translate-x-1
            dark:text-plumb-darkMuted
            motion-reduce:transform-none
          "
        >
          →
        </span>
      </div>

      {room.description && (
        <p
          className={`
            ${styles.text.body}
            mt-2 line-clamp-2
          `}
        >
          {room.description}
        </p>
      )}

      {pieceCount !== null && (
        <p className={`${styles.text.metadata} mt-auto pt-4`}>
          {pieceCount} {pieceCount === 1 ? "piece" : "pieces"}
        </p>
      )}
    </div>
  );
}
export default RoomGrid