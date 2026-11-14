
function RoomCard({ room, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(room)}
      className="
        group
        flex
        w-[100%]
        max-w-2xl 

        min-w-0
        items-center
        gap-4
        rounded-2xl
        border
        border-soft/15
              bg-plumb-canvas
        p-5
        text-left
        transition-colors
        hover:bg-soft/5
        dark:border-cream/10
        dark:hover:bg-cream/5
      "
    >
      <div
        className="
          flex
          h-16
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-soft/10
          text-soft
          dark:bg-cream/10
          dark:text-cream
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path
            d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-10Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-serif text-lg font-bold text-soft dark:text-cream">
          {room.title || "Untitled room"}
        </h3>

        <p className="mt-1 truncate text-sm text-soft/55 dark:text-cream/50">
          {room.purpose || "Writing space"}
        </p>
      </div>

      <span
        aria-hidden="true"
        className="
          shrink-0
          text-xl
          text-soft/40
          transition-transform
          group-hover:translate-x-1
          dark:text-cream/40
        "
      >
        →
      </span>
    </button>
  );
}

export default RoomCard