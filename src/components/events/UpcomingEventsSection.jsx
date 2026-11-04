import SectionHeader from "../pieces/SectionHeader";
import EmptyState from "../general/EmptyState";
import shortName from "../../core/shortName";

export default function UpcomingEventsSection({
  events = [],
  onViewEvents,
}) {
  return (
    <section className="mt-14" aria-label="Upcoming events">
      <SectionHeader
        eyebrow="For you"
        title="Something happening"
        actionLabel="See all events"
        onAction={onViewEvents}
      />

      <div className="mt-6">
        {events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => (
              <article
                key={event.storyId}
                className="
                  rounded-2xl
                  border border-card-border
                  bg-plumb-surface
                  p-5
                  dark:bg-plumb-dark-surface
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-brand">
                      {eventDayLabel(event.start)}
                    </p>

                    <h3 className="mt-1 font-serif text-xl leading-tight text-text-primary dark:text-text-dark">
                      {event.title || "Untitled event"}
                    </h3>
                  </div>

                  <span className="shrink-0 text-sm font-medium text-text-secondary">
                    {new Date(event.start).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {event.location && (
                  <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                    {event.location}
                  </p>
                )}

                {event.description && (
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {shortName(event.description, 140)}
                  </p>
                )}

                {(event.area || event.moreInfoUrl) && (
                  <div className="mt-5 flex items-center justify-between">
                    {event.area && (
                      <span className="text-xs uppercase tracking-wide text-text-secondary">
                        {event.area}
                      </span>
                    )}

                    {event.moreInfoUrl && (
                      <a
                        href={event.moreInfoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-text-brand hover:opacity-70"
                      >
                        More info →
                      </a>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Quiet calendar."
            description="Nothing you've saved is happening today or tomorrow."
          />
        )}
      </div>
    </section>
  );
}

function eventDayLabel(date) {
  const today = new Date();

  if (sameDay(date, today)) return "Today";

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (sameDay(date, tomorrow)) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}