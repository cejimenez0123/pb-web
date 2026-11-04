
function FeaturedEventCard({ event, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group block w-full rounded-2xl
        border border-plumb-border
        bg-plumb-elevated p-6 text-left
        transition-all duration-200
        hover:border-plumb-mintHover hover:shadow-sm
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-plumb-focus
        focus-visible:ring-offset-2
        focus-visible:ring-offset-plumb-canvas
        dark:border-plumb-darkBorder
        dark:bg-plumb-dark-surface
        dark:hover:border-plumb-mintLight
        dark:focus-visible:ring-offset-plumb-dark-canvas
        sm:p-7
      "
    >
      <p className={styles.text.metadata}>
        {formatEventDate(event)}
      </p>

      <h3
        className={`
          ${styles.text.heading}
          mt-3 max-w-2xl
        `}
      >
        {event?.title || "Something happening"}
      </h3>

      {event?.description && (
        <p className={`${styles.text.body} mt-3 max-w-2xl`}>
          {event.description}
        </p>
      )}

      <span
        className="
          mt-5 inline-flex items-center
          text-sm font-medium
          text-plumb-mintHover
          dark:text-plumb-mintLight
        "
      >
        See event details
        <span
          aria-hidden="true"
          className="
            ml-2 transition-transform
            group-hover:translate-x-1
          "
        >
          →
        </span>
      </span>
    </button>
  );
}

export default FeaturedEventCard

function formatEventDate(event) {
  if (!event) return "";

  const rawDate =
    event?.startDate ||
    event?.start_date ||
    event?.date ||
    event?.start;

  if (!rawDate) return "";

  const date = new Date(rawDate);

  if (Number.isNaN(date.getTime())) {
    return rawDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}
