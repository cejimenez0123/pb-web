import { useContext, useState, useEffect, useLayoutEffect } from "react";
import useScrollTracking from "../core/useScrollTracking";
import storyRepo from "../data/storyRepo";
import { useSelector } from "react-redux";
import calendar from "../images/icons/calendar_add_blue.svg";
import { IonImg, IonList, IonLoading, IonText, useIonRouter } from "@ionic/react";
import { useDialog } from "../domain/usecases/useDialog";
import { Preferences } from "@capacitor/preferences";
import { useAlert } from "../core/useAlert";
import { sendGAEvent } from "../core/ga4";
import Context from "../context";
import AlertType from "../core/AlertType";
import Paths from "../core/paths";

const INK = "#12261f";
const MUTED = "#6b6f63";
const BORDER = "#ddd8c4";
const ACTIVE_BG = "#cfe8d9";

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

function CalendarEmbed() {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const { isPhone } = useContext(Context);
  const { openDialog, closeDialog } = useDialog();
  const router = useIonRouter();

  const [list, setList] = useState([]);
  const [events, setEvents] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedArea, setSelectedArea] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const PAGE_SIZE = isPhone ? 24 : 30;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(events.length / PAGE_SIZE);
  const paginatedEvents = events.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Assumption: state.users.events holds events the current user has saved,
  // based on the saveEvent() call in handleAddEvent below. Confirm this is
  // right for your data model before shipping.
  const savedEvents = useSelector((state) => state.users.events) || [];

  useScrollTracking({ name: "Calendar Embed" });

  const handleAddEvent = async (e, event) => {
    e.stopPropagation();

    sendGAEvent("navigate_event", {
      event_summary: event.summary,
      hashtags: event.hashtags,
      hashtags_count: event.hashtags?.length ?? 0,
      source: "event_click",
    });

    const eidMatch = event.googleLink?.match(/[?&]eid=([^&]+)/);
    const gid = event.googleCalendarId || (eidMatch ? eidMatch[1] : "");

    const { value: token } = await Preferences.get({ key: "token" });

    if (!token || !gid) {
      window.open(event.googleLink);
      return;
    }

    try {
      const data = await storyRepo.saveEvent({
        event: { ...event, googleCalendarId: gid },
      });

      showAlert({ message: "Saved in your Events", type: AlertType.success });

      if (data?.story?.id) {
        router.push(Paths.page.createRoute(data.story.id));
      }
    } catch (err) {
      window.open(event.googleLink);
    }
  };

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const mmdd = date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `<span>${weekday}<br/>${mmdd}<br/>${hours}:${minutes} ${ampm}</span>`;
  }

  useLayoutEffect(() => {
    addEvents();
  }, []);

  const addEvents = () => {
    try {
      setLoading(true);
      storyRepo.fetchEvents({ days: 28 }).then((res) => {
        const rawEvents = res.events.flatMap((e) => e.events);

        const eventList = rawEvents
          .sort((a, b) => {
            const aStart = new Date(a.start?.dateTime || a.start?.date);
            const bStart = new Date(b.start?.dateTime || b.start?.date);
            return aStart - bStart; // soonest first
          })
          .map((event) => {
            const hashtags = extractHashtags(event.description || "");
            const cleaned = event.description
              ? cleanDescriptionAndExtractHashtags(event.description)
              : { cleanedDescription: "" };

            return {
              summary: event.summary,
              shortSummary: event.summary?.slice(0, 30),
              description: cleaned.cleanedDescription || "",
              hashtags,
              startTime: formatDate(event.start?.dateTime),
              location: event.location || "",
              rawLocation: event.location,
              googleLink: event.htmlLink || "",
              organizerLink: extractFirstUrl(event.description),
              area: event.organizer?.displayName?.toLowerCase() || "",
            };
          });

        setList(eventList);
      });
    } catch (err) {
      showAlert({ message: err, type: AlertType.error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let source = list;

    if (selectedFilter === "plumbum") {
      source = list.filter((e) => e.description?.includes("☀️"));
    } else if (selectedFilter === "neighbourhood") {
      source = list.filter((e) => !e.description?.includes("☀️"));
    } else if (selectedFilter === "saved") {
      source = savedEvents;
    }

    let filtered = source;
    if (selectedArea) {
      filtered = filtered.filter((e) =>
        e.area?.toLowerCase().includes(selectedArea.toLowerCase())
      );
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.summary?.toLowerCase().includes(lower) ||
          e.hashtags?.some((t) => t.toLowerCase().includes(lower))
      );
    }

    setEvents(filtered);
    setCurrentPage(1);
  }, [selectedFilter, selectedArea, searchTerm, list, savedEvents]);

  const openGooglemaps = (event) => {
    const encoded = encodeURIComponent(event.rawLocation);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`);
  };

  function handleDialogOpen(event) {
    openDialog({
      text: () => (
        <div className="text-left">
          <h2 className="lora-bold text-lg" style={{ color: INK }}>
            {event.summary}
          </h2>
          <p className="open-sans-medium text-sm" style={{ color: MUTED }}>
            {event.location}
          </p>

          <p className="open-sans-medium mt-3 text-sm" style={{ color: INK }}>
            {event.description}
          </p>

          {event.organizerLink && (
            <button
              onClick={() => window.open(event.organizerLink)}
              className="open-sans-medium mt-4 w-full rounded-full py-2 text-sm"
              style={{ backgroundColor: INK, color: "#f4f4e0" }}
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

  const renderEvent = (event, i) => (
    <div
      key={i}
      onClick={() => handleDialogOpen(event)}
      className="rounded-2xl border p-4 active:scale-[0.98] transition-transform"
      style={{ borderColor: BORDER, WebkitTapHighlightColor: "transparent" }}
    >
      <div className="flex justify-between gap-3">
        <div className="flex flex-col flex-1 min-w-0">
          <span
            className="lora-bold text-base truncate"
            style={{ color: INK }}
          >
            {event.summary}
          </span>

          {event.location && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openGooglemaps(event);
              }}
              className="flex items-center gap-1 mt-1 text-left w-fit"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke={MUTED}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span
                className="open-sans-medium text-xs underline underline-offset-2"
                style={{ color: MUTED }}
              >
                {event.location}
              </span>
            </button>
          )}

          {event.hashtags?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-2">
              {event.hashtags.slice(0, 4).map((tag, idx) => (
                <span
                  key={idx}
                  className="open-sans-medium text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: ACTIVE_BG, color: INK }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
          <IonText
            className="open-sans-medium text-xs"
            style={{ color: MUTED }}
            dangerouslySetInnerHTML={{ __html: event.startTime }}
          />
          <button
            onClick={(e) => handleAddEvent(e, event)}
            className="flex flex-col items-center gap-0.5 active:scale-95 transition-transform"
          >
            <IonImg className="w-8 h-8" src={calendar} />
            <span className="open-sans-medium text-[10px]" style={{ color: MUTED }}>
              Add
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <IonLoading isOpen={loading} message="Loading events..." />

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => {
          const active = selectedFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setSelectedFilter(f.key)}
              className="open-sans-medium text-xs tracking-widest uppercase px-4 py-2 rounded-full transition-all active:scale-95"
              style={
                active
                  ? { backgroundColor: ACTIVE_BG, color: INK }
                  : { backgroundColor: "transparent", color: MUTED, border: `1px solid ${BORDER}` }
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedArea("")}
          className="open-sans-medium text-xs px-3 py-1.5 rounded-full transition-all active:scale-95"
          style={
            selectedArea === ""
              ? { backgroundColor: ACTIVE_BG, color: INK }
              : { backgroundColor: "transparent", color: MUTED, border: `1px solid ${BORDER}` }
          }
        >
          All areas
        </button>
        {AREAS.map((area) => {
          const active = selectedArea === area.label;
          return (
            <button
              key={area.label}
              onClick={() => setSelectedArea(area.label)}
              className="open-sans-medium text-xs px-3 py-1.5 rounded-full transition-all active:scale-95"
              style={
                active
                  ? { backgroundColor: ACTIVE_BG, color: INK }
                  : { backgroundColor: "transparent", color: MUTED, border: `1px solid ${BORDER}` }
              }
            >
              {area.emoji} {area.label}
            </button>
          );
        })}
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search events"
        className="open-sans-medium w-full max-w-sm rounded-full px-4 py-2 text-sm outline-none"
        style={{ border: `1px solid ${BORDER}`, color: INK, backgroundColor: "transparent" }}
      />

      <div>
        <h2 className="lora-bold text-2xl" style={{ color: INK }}>
          Coming up
        </h2>
        <p className="open-sans-medium text-sm" style={{ color: MUTED }}>
          {events.length} listed
        </p>
      </div>
      <hr style={{ borderColor: BORDER }} />

      {events.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed py-16 text-center"
          style={{ borderColor: BORDER }}
        >
          <p className="lora-bold text-lg" style={{ color: INK }}>
            No events listed yet.
          </p>
          <p className="open-sans-medium text-sm mt-2" style={{ color: MUTED }}>
            When a reading or workshop is scheduled, it shows up here.
          </p>
        </div>
      ) : (
        <IonList className="space-y-3">
          {paginatedEvents.map(renderEvent)}
        </IonList>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between py-4">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="open-sans-medium px-4 py-2 rounded-full text-sm"
            style={{
              color: currentPage === 1 ? "#b9b6a3" : INK,
              border: currentPage === 1 ? "none" : `1px solid ${BORDER}`,
            }}
          >
            Prev
          </button>

          <div className="open-sans-medium text-sm" style={{ color: MUTED }}>
            {currentPage} / {totalPages}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="open-sans-medium px-4 py-2 rounded-full text-sm"
            style={{
              color: currentPage === totalPages ? "#b9b6a3" : INK,
              border: currentPage === totalPages ? "none" : `1px solid ${BORDER}`,
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------
// HELPERS
// ---------------------------

function extractHashtags(text) {
  return (text.match(/#\w+/g) || []).map((t) => t.replace("#", ""));
}

function extractFirstUrl(text) {
  const match = text?.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : "";
}

function cleanDescriptionAndExtractHashtags(description) {
  const urlRegex = /(https?:\/\/[^\s]+)/i;
  const hashtagRegex = /#(\w+)/g;
  const descriptionWithoutLinks = description.replace(urlRegex, "").trim();
  const cleanDescription = descriptionWithoutLinks.replace(hashtagRegex, "").trim();

  const hashtags = [];
  let match;
  while ((match = hashtagRegex.exec(descriptionWithoutLinks)) !== null) {
    hashtags.push(`#${match[1]}`);
  }

  return { cleanedDescription: cleanDescription, hashtags };
}

export default CalendarEmbed;