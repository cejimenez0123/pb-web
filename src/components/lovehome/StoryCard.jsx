function StoryCard({
  story,
  view,
  onSelect,
}) {
  const isGrid = view === "grid";
function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}
  return (
    <div
      type="button"
      onClick={() => onSelect(story)}
      className={`
        group
        w-[100%]
        text-left
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-soft/40
        focus:ring-offset-2
        focus:ring-offset-cream
        dark:focus:ring-offset-base-bgDark

        ${
          isGrid
            ? `
              min-h-[210px]
              rounded-2xl
              border
              border-plumb-mint/40
           
              p-6
              sm:p-7
              hover:-translate-y-1
              hover:border-plumb-mint/80
          
            `
            : `
              rounded-2xl
              border
              border-plumb-mint/30
              bg-cream/45
              px-6
              py-5
              sm:px-7
              hover:border-plumb-mint/80
              hover:bg-base-bg
            `
        }

        dark:bg-base-bgDark/40
        dark:hover:bg-base-bgDark/70
      `}
    >
      <div
        className={" "+
          isGrid
            ? "flex h-[100%] flex-col justify-between gap-10"
            : "flex w-[100%] items-center justify-between gap-6"
        }
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            {story.status && (
              <span className="text-[0.68rem] uppercase tracking-[0.12em] text-soft/55 dark:text-cream/50">
                {formatStatus(story.status)}
              </span>
            )}

            {story.isPrivate && (
              <span className="text-[0.68rem] uppercase tracking-[0.12em] text-soft/40 dark:text-cream/40">
                Private
              </span>
            )}
          </div>

          <h3
            className={`
              mt-3
              truncate
              font-serif
              font-bold
              leading-tight
              text-soft
              dark:text-cream
              ${
                isGrid
                  ? "text-[1.45rem] sm:text-[1.6rem]"
                  : "text-lg sm:text-xl"
              }
            `}
          >
            {story.title || "Untitled"}
          </h3>

          {story.description && (
            <p
              className={`
                mt-2
                font-serif
                leading-relaxed
                text-soft/55
                dark:text-cream/55
                ${
                  isGrid
                    ? "line-clamp-2 text-sm"
                    : "hidden max-w-xl text-sm sm:block"
                }
              `}
            >
              {story.description}
            </p>
          )}
        </div>

        <div
          className={
            isGrid
              ? "flex items-end justify-between"
              : "flex shrink-0 items-center gap-5"
          }
        >
          <span className="text-xs text-soft/45 dark:text-cream/40">
            {formatDate(story.updated || story.created)}
          </span>

          <span
            aria-hidden="true"
            className="
              text-xl
              text-soft/45
              transition-transform
              duration-200
              group-hover:translate-x-1
              group-hover:text-soft
              dark:text-cream/40
              dark:group-hover:text-cream
            "
          >
            →
          </span>
        </div>
      </div>
    </div>
  );
}

export default StoryCard
function formatStatus(status) {
  const labels = {
    draft: "Draft",
    fragment: "Fragment",
    workshop: "Workshop",
    finished: "Published",
  };

  return labels[status] || status;
}