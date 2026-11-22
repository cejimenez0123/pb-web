
import SectionHeader from "../pieces/SectionHeader";
import EmptyState from "../general/EmptyState";
import shortName from "../../core/shortName";
import AlertType from "../../core/AlertType";
import { useAlert } from "../../core/useAlert";
import { Preferences } from "@capacitor/preferences";
import storyRepo from "../../data/storyRepo";
import { useIonRouter } from "@ionic/react";
import Paths from "../../core/paths";
import styles from "../../styles/style";

export default function UpcomingEventsSection({
  events = [],
  currentProfile,
  onViewEvents,
}) {

 const {showAlert,showPrompt}=useAlert()
 const router =useIonRouter()
  const handleSelectSuggestedEvent = async (event) => {
  if (!event) return;

  const eidMatch = event.googleLink?.match(/[?&]eid=([^&]+)/);

  const gid =
    event.googleCalendarId ||
    (eidMatch ? eidMatch[1] : "");

  try {
    const { value: token } = await Preferences.get({
      key: "token",
    });



    const data = await storyRepo.saveEvent({
      event: {
        ...event,
        summary: event.title || event.summary,
        googleCalendarId: gid,
      },
    });

showPrompt({
  message: "Added to your Events! Want to take a look?",
  agreeText: "View event",
  disagreeText: "Maybe later",
  agree: () => {
         token?data?.story?.id && router.push(Paths.page.createRoute(data.story.id)): window.open(
          event.googleLink,
          "_blank",
          "noopener,noreferrer"
        );
    
  },
});


  } catch (err) {
    showAlert({
      message: err?.message || "Couldn't save this event.",
      type: AlertType.error,
    });
  }
};
const now = new Date();
const today = new Date(now);
today.setHours(0, 0, 0, 0);

const upcomingEvents = events
  .map((story) => ({
    ...story,
    eventInfo: extractEventDateInfo(story),
  }))
  .filter(({ eventInfo }) => {
    const { date, isDateOnly } = eventInfo;

    // Keep events when no date could be extracted.
    if (!date) return true;

    // Date-only events remain upcoming throughout today.
    if (isDateOnly) return date >= today;

    // Timed events must not have already started.
    return date >= now;
  })
  .sort((a, b) => {
    const dateA = a.eventInfo.date?.getTime() ?? Infinity;
    const dateB = b.eventInfo.date?.getTime() ?? Infinity;

    return dateA - dateB;
  })
  .slice(0, 2);




  return (
    <section className={[styles.pageShell.body,"mt-14"].join(" ")} aria-label="Upcoming events">
      <SectionHeader
        eyebrow="For you"
        title="Something happening"
        actionLabel="See all events ↗"
        onAction={onViewEvents}
        buttonClass="
        
          dark:bg-transparent
          text-lg
          border border-plumb-mintLight/20
          rounded-full
          bg-plumb-mintLight/20
          text-plumb-mint
          dark:text-plumb-mintLight
        "
      />

      <div className="mt-6">
        {upcomingEvents.length > 0 ? (
  <div className="space-y-3">
    {upcomingEvents.map((event) => {
    
      const eventDate = event.eventInfo.date;
    
      const eventTime = formatEventTime(eventDate);
      const metadata = extractEventMetadata(getEventHtml(event));

      const location = event.location || metadata.location;
      const area = event.area || metadata.area;
      const moreInfoUrl =
        event.moreInfoUrl || metadata.moreInfoUrl;
    

              return (
                <article
                  key={event.id}
                  className="
                  hover:bg-plumb-mintLight/50
                    rounded-2xl
                    border border-card-border
                    bg-plumb-surface
                    p-5
                    dark:bg-plumb-dark-surface
                  "
                  onClick={()=>{
router.push(Paths.page.createRoute(event.id))
                  }
                }
                    // handleSelectSuggestedEvent(event)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">


                   <h3 className="mt-1 font-serif text-xl leading-tight text-text-primary dark:text-text-dark">
  {event.title || "Untitled event"}
</h3>
<div className="flex flex-row gap-1">
                                  {eventDate && (
  <p className="text-xs font-medium uppercase my-auto tracking-[0.12em] text-text-brand">
    {eventDayLabel(eventDate)}:
  </p>
)}


{eventTime && (
  <span className="shrink-0 text-xs my-auto font-medium text-text-secondary">
    {eventTime}
  </span>
)}</div>
                    </div>

                    <span className="shrink-0 text-sm font-medium text-text-secondary">



                      {/* {eventTime || "Time TBD"} */}
                    </span>
                    {/*  */}
                  </div>

                  {location && (
                    <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                      {location}
                    </p>
                  )}

                  {event.description && (
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                      {shortName(event.description, 140)}
                    </p>
                  )}

                  {(area || moreInfoUrl) && (
                    <div className="mt-5 flex items-center justify-between gap-3">
                      {area && (
                        <span className="text-xs uppercase tracking-wide text-text-secondary">
                          {area}
                        </span>
                      )}

                      {moreInfoUrl && (
                        <a
                          href={moreInfoUrl}
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
              );
            })}
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

/* --------------------------------
   Date helpers
--------------------------------- */

// Accepts a Date or date string.
function toDate(value) {
  if (!value) return null;

  const date = value instanceof Date
    ? value
    : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

// Extracts the date from the HTML stored in Story.data.
function extractEventDate(data) {
  if (!data) return null;

  const match = String(data).match(
    /<time\b[^>]*\bdatetime=["']([^"']+)["']/i
  );

  if (!match) return null;

  const value = match[1].trim();

  // A date-only value should not be shifted by timezone conversion.
  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (dateOnly) {
    const [, year, month, day] = dateOnly;

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return Number.isNaN(date.getTime()) ? null : date;
  }

  return toDate(value);
}

// Compares local calendar days.
function sameDay(a, b) {
  const dateA = toDate(a);
  const dateB = toDate(b);

  if (!dateA || !dateB) return false;

  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

// Returns Today, Tomorrow, or the formatted event date.
function eventDayLabel(value) {
  const date = toDate(value);

  if (!date) return "Date TBD";

  const today = new Date();

  if (sameDay(date, today)) return "Today";

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (sameDay(date, tomorrow)) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

// Formats the event's local time.
function formatEventTime(date) {
  if (!date) return null;

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/* --------------------------------
   Event HTML metadata helpers
--------------------------------- */

// Extracts location, area, and organizer link
// from the HTML stored in Story.data.
function extractEventMetadata(data) {
  const result = {
    location: "",
    area: "",
    moreInfoUrl: "",
  };

  if (!data) return result;

  const html = String(data);

  const getText = (label) => {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const match = html.match(
      new RegExp(
        `<li>\\s*<strong>${escaped}:<\\/strong>\\s*([^<]+)`,
        "i"
      )
    );

    return match?.[1]?.trim() || "";
  };

  result.location = getText("Where");
  result.area = getText("Area");

  const linkMatch = html.match(
    /<a\b[^>]*href=["']([^"']+)["'][^>]*>\s*More info\s*<\/a>/i
  );

  result.moreInfoUrl = linkMatch?.[1] || "";

  return result;
}

function extractEventDateInfo(story) {

  const html = getEventHtml(story);

  if (!html) {
    return {
      date: null,
      isDateOnly: false,
      source: "missing-html",
    };
  }

  const patterns = [
    // Semantic HTML
    /<time\b[^>]*\bdatetime=["']([^"']+)["']/i,

    // Common event date attributes
    /data-start-date=["']([^"']+)["']/i,
    /data-event-date=["']([^"']+)["']/i,

    // JSON-LD
    /"startDate"\s*:\s*"([^"]+)"/i,

    // Organizer-generated metadata
    /(?:Date|When|Starts|Event date)\s*:\s*<\/?[^>]*>?\s*([^<\n]+)/i,
  ];

  let value = null;
  let source = null;

  for (let i = 0; i < patterns.length; i++) {
    const match = html.match(patterns[i]);

    if (match?.[1]) {
      value = match[1].trim();
      source = `pattern-${i}`;
      break;
    }
  }

  if (!value) {
    return {
      date: null,
      isDateOnly: false,
      source: "not-found",
    };
  }

  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);

  let date;

  if (isDateOnly) {
    const [year, month, day] = value.split("-").map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) {
    return {
      date: null,
      isDateOnly: false,
      source: "invalid-date",
    };
  }

  return { date, isDateOnly, source };
}
function getEventHtml(story) {
  if (!story) return "";

  const candidates = [
    story.data,
    story.content,
    story.html,
    story.body,
    story.page?.data,
    story.page?.content,
    story.event?.data,
    story.event?.content,
    story.story?.data,
    story.story?.content,
  ];

  return candidates.find(
    (value) =>
      typeof value === "string" &&
      value.trim().length > 0
  ) || "";
}