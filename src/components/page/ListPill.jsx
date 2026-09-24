export default function ListPill({
  item,
  onClick,
  profile,
}) {
  const lastSeen = profile?.lastNotified
    ? new Date(profile.lastNotified).getTime()
    : Date.now() - 24 * 60 * 60 * 1000;

  let isNew =
    item?.updated &&
    new Date(item.updated).getTime() > lastSeen;

  if (item?.userHistory?.length > 0) {
    isNew = false;
  }

  const title = item?.title?.trim() || "Untitled";

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        w-[100%]
        items-center
        justify-between
        gap-3
        border-b
        border-soft
        bg-transparent
        px-3
        py-4
        text-left
        transition
        duration-200
        hover:bg-cream/50
        active:scale-[0.995]
        sm:gap-4
        sm:px-4
      "
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {isNew && (
          <span
            aria-label="New"
            className="
              mt-2
              h-2
              w-2
              shrink-0
              rounded-full
              bg-emerald-700
            "
          />
        )}

        <span
          title={title}
          className="
            min-w-0
            flex-1
            overflow-hidden
            font-serif
            text-[1.05rem]
            leading-snug
            text-gray-900
            transition-colors
            duration-200
            group-hover:text-emerald-800
            line-clamp-2
            lg:line-clamp-1
          "
        >
          {title}
        </span>
      </div>

      <span
        aria-hidden="true"
        className="
          shrink-0
          pt-0.5
          text-lg
          leading-none
          text-gray-300
          transition-all
          duration-200
          group-hover:translate-x-1
          group-hover:text-emerald-700
        "
      >
        →
      </span>
    </button>
  );
}