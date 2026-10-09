import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import EmptyState from "../EmptyState";
import SectionHeader from "../pieces/SectionHeader";
import { fetchCollection } from "../../actions/CollectionActions";
import checkResult from "../../core/checkResult";
import shortName from "../../core/shortName";

export default function UpcomingEventsSection({
  profile,
  onViewEvents,
}) {
  const dispatch = useDispatch();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const eventsCollectionId =
    profile?.profileToCollections?.find(
      (ptc) => ptc.type === "events"
    )?.collection?.id;

  useEffect(() => {
    let cancelled = false;

    async function loadCollection() {
      if (!eventsCollectionId) {
        setEvents([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const result = await dispatch(
          fetchCollection({
            id: eventsCollectionId,
          })
        );

        if (cancelled) return;

        checkResult(
          result,
          (payload) => {
            const collection = payload?.collection;

            if (!collection) {
              setEvents([]);
              setLoading(false);
              return;
            }

            const stories = [
              ...(collection.storyIdList ?? []),
            ]
              .filter((item) => item?.story)
              .map((item) => item.story);

            const upcomingEvents = stories
              .map(parseEventStory)
              .filter(Boolean)
              .filter(isTodayOrTomorrow)
              .sort(
                (a, b) =>
                  a.start.getTime() -
                  b.start.getTime()
              );

            setEvents(upcomingEvents);
            setLoading(false);
          },
          () => {
            setEvents([]);
            setLoading(false);
          }
        );
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Failed to load upcoming events:",
          error
        );

        setEvents([]);
        setLoading(false);
      }
    }

    loadCollection();

    return () => {
      cancelled = true;
    };
  }, [dispatch, eventsCollectionId]);

  return (
    <section className="mt-14">
      <SectionHeader
        eyebrow="For you"
        title="Something happening"
        actionLabel="See all events"
        onAction={onViewEvents}
      />

      {loading ? (
        <div className="py-8 text-sm text-text-secondary">
          Checking your calendar…
        </div>
      ) : events.length > 0 ? (
        <div className="mt-6 space-y-3">
          {events.map((event) => (
            <UpcomingEventCard
              key={event.storyId}
              event={event}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Quiet calendar."
          description="Nothing you've saved is happening today or tomorrow."
        />
      )}
    </section>
  );
}
function parseEventStory(story) {
  if (!story?.data) return null;

  const html = story.data;

  const whenMatch = html.match(
    /<strong>\s*When:\s*<\/strong>\s*<span>([\s\S]*?)<\/span>/i
  );

  if (!whenMatch) return null;

  const when = htmlToText(whenMatch[1]);

  const dateMatch = when.match(
    /\b(\d{1,2})\/(\d{1,2})\b/
  );

  const timeMatch = when.match(
    /\b(\d{1,2}):(\d{2})\s*(AM|PM)\b/i
  );

  if (!dateMatch) return null;

  const month = Number(dateMatch[1]);
  const day = Number(dateMatch[2]);

  const now = new Date();

  let year = now.getFullYear();

  let start;

  if (timeMatch) {
    let hour = Number(timeMatch[1]);
    const minute = Number(timeMatch[2]);
    const meridiem = timeMatch[3].toUpperCase();

    if (meridiem === "PM" && hour !== 12) {
      hour += 12;
    }

    if (meridiem === "AM" && hour === 12) {
      hour = 0;
    }

    start = new Date(
      year,
      month - 1,
      day,
      hour,
      minute
    );
  } else {
    start = new Date(
      year,
      month - 1,
      day
    );
  }

  if (Number.isNaN(start.getTime())) {
    return null;
  }

  const whereMatch = html.match(
    /<strong>\s*Where:\s*<\/strong>\s*([\s\S]*?)<\/li>/i
  );

  const areaMatch = html.match(
    /<strong>\s*Area:\s*<\/strong>\s*([\s\S]*?)<\/li>/i
  );

  const moreInfoMatch = html.match(
    /<a[^>]+href=["']([^"']+)["'][^>]*>\s*More info\s*<\/a>/i
  );

  return {
    storyId: story.id,
    story,
    title: story.title || "Untitled event",
    description: story.description || "",
    location: whereMatch
      ? htmlToText(whereMatch[1])
      : "",
    area: areaMatch
      ? htmlToText(areaMatch[1])
      : "",
    moreInfoUrl: moreInfoMatch?.[1] || "",
    start,
  };
}



function isTodayOrTomorrow(event) {
  if (!event?.start) return false;

  const today = new Date();

  const tomorrow = new Date();
  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  return (
    sameDay(event.start, today) ||
    sameDay(event.start, tomorrow)
  );
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function UpcomingEventCard({ event }) {
  const date = new Date(event.start);

  return (
    <article
      className="
        rounded-2xl
        border
        border-card-border
        bg-plumb-surface 
        p-5
        dark:bg-plumb-surface Dark
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-[0.12em]
              text-text-brand
            "
          >
            {eventDayLabel(event.start)}
          </p>

          <h3
            className="
              mt-1
              font-serif
              text-xl
              leading-tight
              text-text-primary
              dark:text-text-dark
            "
          >
            {event.title}
          </h3>
        </div>

        <span
          className="
            shrink-0
            text-sm
            font-medium
            text-text-secondary
          "
        >
          {date.toLocaleTimeString(
            "en-US",
            {
              hour: "numeric",
              minute: "2-digit",
            }
          )}
        </span>
      </div>

      {event.location && (
        <p
          className="
            mt-4
            text-sm
            leading-relaxed
            text-text-secondary
          "
        >
          {event.location}
        </p>
      )}

      {event.description && (
        <p
          className="
            mt-3
            text-sm
            leading-relaxed
            text-text-secondary
          "
        >
          {shortName(
            event.description,
            140
          )}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between">
        {event.area && (
          <span className="text-xs uppercase tracking-wide text-text-secondary">
            {event.area}
          </span>
        )}

        {event.moreInfoUrl && (
          <button
            type="button"
            onClick={() =>
              window.open(
                event.moreInfoUrl,
                "_blank"
              )
            }
            className="
              text-sm
              font-medium
              text-text-brand
              hover:opacity-70
            "
          >
            More info →
          </button>
        )}
      </div>
    </article>
  );
}


function htmlToText(html) {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}


// function isTodayOrTomorrow(event) {
//   if (!event?.start) {
//     return false;
//   }

//   const eventDate = event.start;

//   const today = new Date();

//   const tomorrow = new Date();
//   tomorrow.setDate(
//     tomorrow.getDate() + 1
//   );

//   return (
//     sameDay(eventDate, today) ||
//     sameDay(eventDate, tomorrow)
//   );
// }





function eventDayLabel(date) {
  const now = new Date();

  if (sameDay(date, now)) {
    return "Today";
  }

  const tomorrow = new Date();
  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  if (sameDay(date, tomorrow)) {
    return "Tomorrow";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "short",
      day: "numeric",
    }
  );
}