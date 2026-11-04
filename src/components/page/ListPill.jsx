export default function ListPill({ item, onClick }) {
  const usingItem = item?.collection || item?.story;
  const title = usingItem?.title?.trim() || "Untitled";

  return (
    <li
      key={usingItem?.id}
      className="group list-none w-[100%]"
    >
      <div
        type="button"
        onClick={onClick}
        aria-label={`Read ${title}`}
        className="
          flex w-[100%] min-h-12
          items-center justify-between gap-3
          rounded-full
          border border-plumb-borderStrong/50
          bg-transparent
          px-4 py-3
          text-left
          transition-colors duration-200
          hover:border-plumb-mintHover
       
          hover:bg-plumb-mint/5
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-plumb-focus/40
          active:scale-[0.99]
          dark:border-plumb-darkBorderStrong
          dark:text-plumb-darkText
          dark:hover:border-plumb-mintLight
          dark:hover:bg-plumb-mint/10
          motion-reduce:transition-none
        "
      >
        <span
          className="
            min-w-0 break-words
            font-serif text-base leading-snug
            font-medium
            text-plumb-ink
            transition-colors
            group-hover:text-plumb-mintHover
            dark:text-plumb-darkText
            dark:group-hover:text-plumb-mintLight
          "
        >
          {title}
        </span>

        <span
          aria-hidden="true"
          className="
            shrink-0 text-lg leading-none
            text-plumb-muted
            transition-transform duration-200
            group-hover:translate-x-1
            group-hover:text-plumb-mintHover
            dark:text-plumb-darkMuted
            dark:group-hover:text-plumb-mintLight
          "
        >
          →
        </span>
      </div>
    </li>
  );
}