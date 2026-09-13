import { EventDateBadge } from "./EventDateBadge";
import { EventMeta } from "./EventMeta";
import { Pill } from "../ui/Pill";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

export function EventCard({ event, onAttend, onToggleSave }) {
  return (
    <article className="paper-dots rounded-[21px] border border-plumb-line p-7 shadow-sm md:p-8">
      <div className="flex gap-7">
        <EventDateBadge day={event.day} month={event.month} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <Pill tone="mint">{event.source}</Pill>
            <Pill>{event.type}</Pill>
          </div>

          <h3 className="mt-5 font-display text-2xl font-semibold leading-tight tracking-[-0.025em] md:text-3xl">
            {event.title}
          </h3>

          <div className="mt-3">
            <EventMeta
              date={event.date}
              time={event.time}
              location={event.location}
            />
          </div>

          <p className="mt-1 text-[16px] text-plumb-muted">
            Organised by {event.organizer}
          </p>

          <p className="mt-6 max-w-5xl font-display text-[19px] leading-[1.55] text-plumb-muted md:text-[20px]">
            {event.description}
          </p>

          <div className="mt-7 flex items-center gap-3 text-[16px] text-plumb-muted">
            <span className="inline-block h-px w-6 bg-plumb-line" />
            <span>{event.socialProof}</span>
            <Icon name="users" size={20} />
            <span>{event.attendees} people going</span>
          </div>
        </div>
      </div>

      <div className="mt-7 border-t border-plumb-line pt-6">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => onAttend?.(event)}>I'll be there</Button>
          <Button
            variant="secondary"
            onClick={() => onToggleSave?.(event)}
            aria-pressed={event.saved}
          >
            <Icon name={event.saved ? "bookmarkCheck" : "bookmark"} size={19} />
            {event.saved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>
    </article>
  );
}
