
import { useState, useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import {
  IonImg,
  IonLoading,
  IonText,
  useIonRouter,
} from "@ionic/react";
import { Preferences } from "@capacitor/preferences";
import { useMediaQuery } from "react-responsive";
import taphand from "../images/icons/hand.svg"
import useScrollTracking from "../core/useScrollTracking";
import storyRepo from "../data/storyRepo";
import calendar from "../images/icons/calendar_add_blue.svg";
import { useDialog } from "../domain/usecases/useDialog";
import { useAlert } from "../core/useAlert";
import { sendGAEvent } from "../core/ga4";
import AlertType from "../core/AlertType";
import Paths from "../core/paths";
import styles from "../styles/style";

const DATE_FILTERS = [
  { key: "all", label: "All dates" },
  { key: "tonight", label: "Tonight" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "thisWeekend", label: "This weekend" },
  { key: "nextWeekend", label: "Next weekend" },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "plumbum", label: "Plumbum" },
  { key: "neighbourhood", label: "Neighbourhood" },
  { key: "saved", label: "Saved" },
];

const AREAS = [
  { label: "Downtown", emoji: "🏙️" },
  { label: "Uptown", emoji: "🚆" },
  { label: "Queens", emoji: "👑" },
  { label: "Virtual", emoji: "💻" },
];

const PAGE_SIZE_DESKTOP = 30;
const PAGE_SIZE_PHONE = 24;

function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function isSameDay(dateA, dateB) {
  return (
    startOfDay(dateA).getTime() ===
    startOfDay(dateB).getTime()
  );
}

// If today is Saturday or Sunday, use the current weekend.
// Otherwise, use the upcoming Saturday and Sunday.
function getWeekendRange(referenceDate, weekendOffset = 0) {
  const today = startOfDay(referenceDate);
  const day = today.getDay();

  let daysUntilSaturday;

  if (day === 6) {
    daysUntilSaturday = 0;
  } else if (day === 0) {
    daysUntilSaturday = -1;
  } else {
    daysUntilSaturday = 6 - day;
  }

  const saturday = addDays(
    today,
    daysUntilSaturday + weekendOffset * 7
  );

  return {
    start: saturday,
    end: addDays(saturday, 2),
  };
}

function getEventStartDate(event) {
  return (
    event?.startDate ||
    event?.start?.dateTime ||
    event?.start?.date ||
    null
  );
}

function matchesDateFilter(startDate, filter) {
  if (filter === "all") {
    return true;
  }

  // Events without a usable start date cannot match
  // a specific date filter.
  if (!startDate) {
    return false;
  }

  const eventDate = new Date(startDate);

  if (Number.isNaN(eventDate.getTime())) {
    return false;
  }

  const now = new Date();

  if (filter === "tonight") {
    return (
      isSameDay(eventDate, now) &&
      eventDate.getTime() >= now.getTime()
    );
  }

  if (filter === "tomorrow") {
    return isSameDay(eventDate, addDays(now, 1));
  }

  if (filter === "thisWeekend") {
    const { start, end } = getWeekendRange(now);

    return eventDate >= start && eventDate < end;
  }

  if (filter === "nextWeekend") {
    const { start, end } = getWeekendRange(now, 1);

    return eventDate >= start && eventDate < end;
  }

  return true;
}

function formatDate(dateStr) {
  if (!dateStr) {
    return "";
  }

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "short",
  });

  const mmdd = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });

  let hours = date.getHours();
  const minutes = date
    .getMinutes()
    .toString()
    .padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `<span>${weekday}<br/>${mmdd}<br/>${hours}:${minutes} ${ampm}</span>`;
}

function CalendarEmbed() {
  const { showAlert } = useAlert();
  const { openDialog, closeDialog } = useDialog();
  const router = useIonRouter();

  const isPhone = useMediaQuery({
    query: "(max-width: 750px)",
  });

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [events, setEvents] = useState([]);

  const [selectedDateFilter, setSelectedDateFilter] =
    useState("all");
  const [selectedFilter, setSelectedFilter] =
    useState("all");
  const [selectedArea, setSelectedArea] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const savedEvents =
    useSelector((state) => state.users.events) || [];

  const PAGE_SIZE = isPhone
    ? PAGE_SIZE_PHONE
    : PAGE_SIZE_DESKTOP;

  const totalPages = Math.ceil(events.length / PAGE_SIZE);

  const paginatedEvents = events.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useScrollTracking({ name: "Calendar Embed" });

  const handleAddEvent = async (e, event) => {
    e.stopPropagation();

    sendGAEvent("navigate_event", {
      event_summary: event.summary,
      hashtags: event.hashtags,
      hashtags_count: event.hashtags?.length ?? 0,
      source: "event_click",
    });

    const eidMatch = event.googleLink?.match(
      /[?&]eid=([^&]+)/
    );

    const gid =
      event.googleCalendarId ||
      (eidMatch ? eidMatch[1] : "");

    try {
      const { value: token } = await Preferences.get({
        key: "token",
      });

      if (!token || !gid) {
        if (event.googleLink) {
          window.open(
            event.googleLink,
            "_blank",
            "noopener,noreferrer"
          );
        }
        return;
      }

      const data = await storyRepo.saveEvent({
        event: {
          ...event,
          googleCalendarId: gid,
        },
      });

      showAlert({
        message: "Saved in your Events",
        type: AlertType.success,
      });

      if (data?.story?.id) {
        router.push(
          Paths.page.createRoute(data.story.id)
        );
      }
    } catch (err) {
      if (event.googleLink) {
        window.open(
          event.googleLink,
          "_blank",
          "noopener,noreferrer"
        );
      } else {
        showAlert({
          message: err?.message || String(err),
          type: AlertType.error,
        });
      }
    }
  };

  const addEvents = async () => {
    setLoading(true);

    try {
      const res = await storyRepo.fetchEvents({
        days: 21,
      });

      const rawEvents = (res?.events || []).flatMap(
        (group) => group.events || []
      );

      const eventList = rawEvents
        .sort((a, b) => {
          const aStart = new Date(
            a.start?.dateTime || a.start?.date
          );

          const bStart = new Date(
            b.start?.dateTime || b.start?.date
          );

          return aStart - bStart;
        })
        .map((event) => {
          const description = event.description || "";
          const hashtags = extractHashtags(description);

          const cleaned = cleanDescriptionAndExtractHashtags(
            description
          );

          const startDate =
            event.start?.dateTime || event.start?.date;

          return {
            summary: event.summary || "Untitled event",
            shortSummary: event.summary?.slice(0, 30),
            description: cleaned.cleanedDescription || "",
            hashtags,
            startDate,
            startTime: formatDate(startDate),
            location: event.location || "",
            rawLocation: event.location || "",
            googleLink: event.htmlLink || "",
            organizerLink: extractFirstUrl(description),
            area:
              event.organizer?.displayName?.toLowerCase() ||
              "",
          };
        });

      setList(eventList);
    } catch (err) {
      showAlert({
        message: err?.message || String(err),
        type: AlertType.error,
      });
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    addEvents();
    // Fetch once when the calendar mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let source = list;

    if (selectedFilter === "plumbum") {
      source = list.filter((event) =>
        event.description?.includes("☀️")
      );
    } else if (selectedFilter === "neighbourhood") {
      source = list.filter(
        (event) => !event.description?.includes("☀️")
      );
    } else if (selectedFilter === "saved") {
      source = savedEvents;
    }

    let filtered = source;

    if (selectedArea) {
      filtered = filtered.filter((event) =>
        event.area
          ?.toLowerCase()
          .includes(selectedArea.toLowerCase())
      );
    }

    if (searchTerm.trim()) {
      const lower = searchTerm.trim().toLowerCase();

      filtered = filtered.filter(
        (event) =>
          event.summary?.toLowerCase().includes(lower) ||
          event.hashtags?.some((tag) =>
            tag.toLowerCase().includes(lower)
          )
      );
    }

    if (selectedDateFilter !== "all") {
      filtered = filtered.filter((event) =>
        matchesDateFilter(
          getEventStartDate(event),
          selectedDateFilter
        )
      );
    }

    setEvents(filtered);
    setCurrentPage(1);
  }, [
    selectedFilter,
    selectedDateFilter,
    selectedArea,
    searchTerm,
    list,
    savedEvents,
  ]);

  const openGooglemaps = (event) => {
    if (!event.rawLocation) {
      return;
    }

    const encoded = encodeURIComponent(event.rawLocation);

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encoded}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  function handleDialogOpen(event) {
    openDialog({
      text: () => (
        <div className="text-left">
          <h2 className={styles.text.heading}>
            {event.summary}
          </h2>

          {event.location && (
            <p className={`${styles.text.body} mt-2`}>
              {event.location}
            </p>
          )}

          {event.description && (
            <p className={`${styles.text.body} mt-3`}>
              {event.description}
            </p>
          )}

          {event.organizerLink && (
            <button
              type="button"
              onClick={() =>
                window.open(
                  event.organizerLink,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className={[
                styles.button.base,
                styles.button.primary,
                "mt-4 w-full min-h-11",
              ].join(" ")}
            >
              View Organizer
            </button>
          )}
        </div>
      ),
      disagreeText: "Close",
      disagree: closeDialog,
    });
  }

  const renderEvent = (event, index) => (
    <li key={`${event.googleLink || event.summary}-${index}`}>
      <article
        className={[
          styles.event.card,
          "cursor-pointer",
        ].join(" ")}
      >
        <div className="flex justify-between gap-4">
          <div
            className="flex min-w-0 flex-1 flex-col"
          >
            <button
              type="button"
              onClick={() => handleDialogOpen(event)}
              aria-label={`View details for ${event.summary}`}
              className={[
                "w-full min-h-11 text-left rounded",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-plumb-focus",
                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-plumb-surface",
                "dark:focus-visible:ring-offset-plumb-dark-surface",
              ].join(" ")}
            >
              <span className={styles.event.title}>
              <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  width="24"
  height="24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.5"
  strokeLinecap="round"
  strokeLinejoin="round"
  aria-hidden="true"
  className="mr-[1em]"

>
  <circle cx="12" cy="12" r="10" />

  <path
    d="M8.5 17.5H6.8
       A2.8 2.8 0 0 1 4 14.7V11
       A2.5 2.5 0 0 1 5.8 8.6
       L8.1 6.5
       A1.2 1.2 0 0 1 10 8.2
       L9.2 9.3
       L14.8 9.3
       A1.7 1.7 0 0 1 14.8 12.7
       H12.3
       A1.4 1.4 0 0 1 12.3 15.5
       H11.8
       A1.2 1.2 0 0 1 11.8 17.5
       Z"
  />

  <path d="M17 7.5V6.5" />
  <path d="M18.5 9L19.3 8.4" />
  <path d="M18.5 12L19.3 12.6" />
  </svg> 
 
{event.summary}
              </span>
            </button>

            {event.location && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openGooglemaps(event);
                }}
                aria-label={`View ${event.location} on map`}
                className={[
                  "mt-1 flex w-fit min-h-11 items-center gap-1",
                  "rounded text-left",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-plumb-focus",
                  "focus-visible:ring-offset-2",
                  "dark:focus-visible:ring-offset-plumb-dark-surface",
                ].join(" ")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 text-plumb-mintHover dark:text-plumb-mintLight"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>

                <span
                  className={[
                    "font-open-sans text-xs underline underline-offset-2",
                    "text-plumb-muted dark:text-plumb-darkMuted",
                  ].join(" ")}
                >
                  {event.location}
                </span>
              </button>
            )}

            {event.hashtags?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {event.hashtags.slice(0, 4).map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    className={styles.event.tag}
                  >
                    #{tag.replace(/^#/, "")}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-shrink-0 flex-col items-end justify-between gap-3">
            <IonText
              className={styles.event.metadata}
              aria-label={
                event.startDate
                  ? new Date(event.startDate).toLocaleString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )
                  : "Event date unavailable"
              }
              dangerouslySetInnerHTML={{
                __html: event.startTime,
              }}
            />

            <button
              type="button"
              onClick={(e) => handleAddEvent(e, event)}
              aria-label={`Add ${event.summary} to your events`}
              className={[
                "flex min-h-11 min-w-11 flex-col",
                "items-center justify-center gap-0.5",
                "rounded-xl px-2",
                "transition-transform active:scale-95",
                "motion-reduce:transform-none motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-plumb-focus focus-visible:ring-offset-2",
                "dark:focus-visible:ring-offset-plumb-dark-surface",
              ].join(" ")}
            >
              <IonImg
                className="h-7 w-7"
                src={calendar}
                alt=""
                aria-hidden="true"
              />

              <span className={styles.event.metadata}>
                Add
              </span>
            </button>
          </div>
        </div>
      </article>
    </li>
  );

  const filterButtonClass = (active) =>
    [
      styles.button.base,
      styles.button.filter,
      styles.button.medium,
      active
        ? styles.button.filterActive
        : styles.button.filterInactive,
    ].join(" ");

  return (
    <div className="space-y-6 text-plumb-text dark:text-plumb-darkText">
      <IonLoading
        isOpen={loading}
        message="Loading events..."
        aria-label="Loading events"
      />

      <section aria-label="Filter events by date">
        <p className={styles.text.metadata + " mb-2"}>
          When
        </p>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter events by date"
        >
          {DATE_FILTERS.map((filter) => {
            const active =
              selectedDateFilter === filter.key;

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() =>
                  setSelectedDateFilter(filter.key)
                }
                aria-pressed={active}
                className={filterButtonClass(active)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-label="Filter events by type">
        <p className={styles.text.metadata + " mb-2"}>
          Event type
        </p>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter events by type"
        >
          {FILTERS.map((filter) => {
            const active =
              selectedFilter === filter.key;

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() =>
                  setSelectedFilter(filter.key)
                }
                aria-pressed={active}
                className={filterButtonClass(active)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-label="Filter events by area">
        <p className={styles.text.metadata + " mb-2"}>
          Area
        </p>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter events by area"
        >
          <button
            type="button"
            onClick={() => setSelectedArea("")}
            aria-pressed={selectedArea === ""}
            className={filterButtonClass(
              selectedArea === ""
            )}
          >
            All areas
          </button>

          {AREAS.map((area) => {
            const active =
              selectedArea === area.label;

            return (
              <button
                key={area.label}
                type="button"
                onClick={() =>
                  setSelectedArea(area.label)
                }
                aria-pressed={active}
                className={filterButtonClass(active)}
              >
                {area.emoji} {area.label}
              </button>
            );
          })}
        </div>
      </section>

      <div>
        <label
          htmlFor="calendar-event-search"
          className={styles.text.metadata + " mb-2 block"}
        >
          Search events
        </label>

        <input
          id="calendar-event-search"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by event or hashtag"
          className={[
            styles.input,
            "text-base",
            "focus-visible:outline-none",
          ].join(" ")}
        />
      </div>

      <div>
        <h2 className={styles.text.title}>
          Coming up
        </h2>

        <p
          className={styles.text.metadata + " mt-1"}
          aria-live="polite"
          aria-atomic="true"
        >
          {events.length}{" "}
          {events.length === 1 ? "event" : "events"} listed
        </p>
      </div>

      <hr className="border-plumb-border dark:border-plumb-darkBorder" />

      {events.length === 0 ? (
        <div
          className={[
            "rounded-2xl border border-dashed",
            "border-plumb-borderStrong dark:border-plumb-darkBorderStrong",
            "bg-plumb-surface dark:bg-plumb-dark-surface",
            "px-5 py-16 text-center",
          ].join(" ")}
        >
          <h3 className={styles.text.section}>
            No events found.
          </h3>

          <p className={styles.text.muted + " mt-2"}>
            Try another date, area, or search term.
          </p>

          {(selectedDateFilter !== "all" ||
            selectedFilter !== "all" ||
            selectedArea ||
            searchTerm) && (
            <button
              type="button"
              onClick={() => {
                setSelectedDateFilter("all");
                setSelectedFilter("all");
                setSelectedArea("");
                setSearchTerm("");
              }}
              className={[
                styles.button.base,
                styles.button.primary,
                "mt-5 min-h-11 px-5",
              ].join(" ")}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {paginatedEvents.map(renderEvent)}
        </ul>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Event pages"
          className="flex items-center justify-between gap-3 py-4"
        >
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((page) =>
                Math.max(1, page - 1)
              );
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className={[
              styles.button.base,
              styles.button.cancel,
              styles.button.medium,
            ].join(" ")}
          >
            Previous
          </button>

          <span
            className={styles.text.metadata}
            aria-live="polite"
          >
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((page) =>
                Math.min(totalPages, page + 1)
              );
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className={[
              styles.button.base,
              styles.button.cancel,
              styles.button.medium,
            ].join(" ")}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}

// ---------------------------
// HELPERS
// ---------------------------

function extractHashtags(text) {
  return (text.match(/#\w+/g) || []).map((tag) =>
    tag.replace("#", "")
  );
}

function extractFirstUrl(text) {
  const match = text?.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : "";
}

function cleanDescriptionAndExtractHashtags(description) {
  const urlRegex = /(https?:\/\/[^\s]+)/i;
  const hashtagRegex = /#(\w+)/g;

  const descriptionWithoutLinks = description
    .replace(urlRegex, "")
    .trim();

  const cleanDescription = descriptionWithoutLinks
    .replace(hashtagRegex, "")
    .trim();

  const hashtags = [];
  let match;

  while (
    (match = hashtagRegex.exec(descriptionWithoutLinks)) !==
    null
  ) {
    hashtags.push(`#${match[1]}`);
  }

  return {
    cleanedDescription: cleanDescription,
    hashtags,
  };
}

export default CalendarEmbed;
