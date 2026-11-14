

function StoryCard({ story, onSelect }) {
  if (!story) return null;

  function formatDate(date) {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "";

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(parsed);
  }

  // Normalize description to plain text.
  const description =
    typeof story.description === "string"
      ? story.description
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : "";

  const title =
    typeof story.title === "string" && story.title.trim()
      ? story.title
      : "Untitled";

  return (
    <button
      type="button"
      onClick={() => onSelect?.(story)}
      className="
        group
        flex
        w-[100%]
        min-w-0
        items-start
        justify-between
        gap-5
        rounded-2xl
        border
        border-soft/15
        bg-plumb-canvas
        p-5
        text-left
        transition-colors
        hover:bg-soft/5
        dark:border-cream/10
        dark:bg-base-bg
        dark:hover:bg-base-bgDark/70
      "
    >
      <div className="min-w-0 flex-1">
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3">
          {story.status && (
            <span
              className="
                text-[0.68rem]
                uppercase
                tracking-[0.12em]
                text-soft/55
                dark:text-cream/50
              "
            >
              {formatStatus(story.status)}
            </span>
          )}

          {story.isPrivate && (
            <span
              className="
                text-[0.68rem]
                uppercase
                tracking-[0.12em]
                text-soft/40
                dark:text-cream/40
              "
            >
              Private
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="
            mt-2
            truncate
            font-serif
            text-lg
            font-bold
            leading-tight
            text-soft
            sm:text-xl
            dark:text-cream
          "
        >
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p
            className="
              mt-3
              hidden
              max-w-xl
              overflow-hidden
              font-serif
              text-sm
              leading-relaxed
              text-soft/55
              sm:block
              dark:text-cream/55
            "
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Date and navigation */}
      <div
        className="
          flex
          shrink-0
          items-center
          gap-3
          pt-1
        "
      >
        <span
          className="
            whitespace-nowrap
            text-xs
            text-soft/45
            dark:text-cream/40
          "
        >
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
    </button>
  );
}

function formatStatus(status) {
  const labels = {
    draft: "Draft",
    fragment: "Fragment",
    workshop: "Workshop",
    finished: "Published",
  };

  return labels[status] || status;
}

export default StoryCard;


