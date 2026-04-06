import { useContext, useRef, useState, useEffect, useLayoutEffect } from "react";
import useScrollTracking from "../core/useScrollTracking";
import storyRepo from "../data/storyRepo";
import Context from "../context";
import { useSelector } from "react-redux";
import calendar from "../images/icons/calendar_add_blue.svg";
import { IonImg, IonInput, IonList, IonText } from "@ionic/react";
import InfoTooltip from "./InfoTooltip";
import { useDialog } from "../domain/usecases/useDialog";
import Enviroment from "../core/Enviroment";

function CalendarEmbed({ variant = "eventbrite" }) {
  const { isPhone, setError } = useContext(Context);
  const { openDialog, closeDialog } = useDialog();

  const [list, setList] = useState([]);
  const [events, setEvents] = useState([]);
  const [solEvents, setSolEvents] = useState([]);

  const [selectedArea, setSelectedArea] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [hashtagSuggestions, setSuggestions] = useState(["poetry", "experiment", "free"]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
const PAGE_SIZE = isPhone ? 24 : 30;

const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.ceil(events.length / PAGE_SIZE);

const paginatedEvents = events.slice(
  (currentPage - 1) * PAGE_SIZE,
  currentPage * PAGE_SIZE
);
  const searchRef = useRef(null);
  const ogEvents = useSelector((state) => state.users.events);

  const areas = ["Downtown", "Uptown", "Virtual", "Queens"];

  useScrollTracking({ name: "Calendar Embed" });

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
      storyRepo.fetchEvents({ days: 28 }).then((res) => {
        let events = res.events.flatMap((e) => e.events);

        const eventList  = events
  .sort((a, b) => {
    const aStart = new Date(a.start?.dateTime || a.start?.date);
    const bStart = new Date(b.start?.dateTime || b.start?.date);
    return aStart - bStart; // ascending (soonest first)
  })
  .map((event) => {
          const hashtags = extractHashtags(event.description || "");
let obj = event.description?cleanDescriptionAndExtractHashtags(event.description):{cleanedDescription: "",suggestions:[]}             
console.log(obj)      
return {
            summary: event.summary,
            shortSummary: event.summary?.slice(0, 30),
            description: obj?.cleanedDescription ||"",
            hashtags,
            startTime: formatDate(event.start?.dateTime),
            location: event.location || "",
            rawLocation: event.location,
            googleLink: event.htmlLink || "",
            organizerLink: extractFirstUrl(event.description),
            area: event.organizer?.displayName || "",
          };
        });

        // ☀️ PB Events
        setSolEvents(eventList.filter(e => e.description?.includes("☀️")));
        setList(eventList);
      });
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => setList(ogEvents), [ogEvents]);

  useEffect(() => {
    let filtered = list;

    if (selectedArea) {
      filtered = filtered.filter(
        (e) => e.area.toLowerCase() === selectedArea.toLowerCase()
      );
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.summary.toLowerCase().includes(lower) ||
          e.hashtags.some((t) => t.toLowerCase().includes(lower))
      );
    }

    setEvents(filtered);
  }, [selectedArea, searchTerm, list]);

  function handleSearchInputChange(e) {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = hashtagSuggestions.filter((tag) =>
      tag.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  }

  const openGooglemaps = (event) => {
    const encoded = encodeURIComponent(event.rawLocation);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`);
  };

  function handleDialogOpen(event) {
    openDialog({
      text: (
        <div className="text-left">
          <h2 className="text-lg font-semibold">{event.summary}</h2>
          <p className="text-sm text-gray-500">{event.location}</p>

          <p className="mt-3 text-sm">{event.description}</p>

          {/* ORGANIZER BUTTON */}
          {event.organizerLink && (
            <button
              onClick={() => window.open(event.organizerLink)}
              className="mt-4 w-full bg-black text-white py-2 rounded-xl"
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

  // ---------------------------
  // EVENT CARD
  // ---------------------------

  const renderEvent = (event, i) => (
    <div
      key={i}
      onClick={() => handleDialogOpen(event)}
      className="mx-4 mb-3 bg-white rounded-2xl p-4 shadow-sm active:scale-[0.98]"
    >
      <div className="flex justify-between gap-3">
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-semibold truncate">{event.summary}</span>

          <span
            onClick={(e) => {
              e.stopPropagation();
              openGooglemaps(event);
            }}
            className="text-sm text-gray-500 mt-1"
          >
            {event.location}
          </span>

          <span className="text-xs text-gray-400 mt-1">{event.area}</span>

          {/* HASHTAGS */}
          <div className="flex gap-2 flex-wrap mt-2">
            {event.hashtags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <IonText
            className="text-xs text-gray-600"
            dangerouslySetInnerHTML={{ __html: event.startTime }}
          />

          <IonImg
            onClick={(e) => {
              e.stopPropagation();
              window.open(event.googleLink);
            }}
            className="w-10 h-10 mt-2"
            src={calendar}
          />
        </div>
      </div>
    </div>
  );

  // ---------------------------
  // HORIZONTAL LIST (PB EVENTS)
  // ---------------------------

  const HorizontalScroll = () => {
    if (!solEvents.length) return null;

    return (
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <IonText className="font-semibold text-sm">Events from Pb</IonText>
         
        </div>

        <div className="flex gap-3 overflow-x-auto">
          {solEvents.map((event, i) => (
            <div
              key={i}
              onClick={() => handleDialogOpen(event)}
              className="min-w-[220px] bg-white rounded-xl p-3 shadow-sm"
            >
              <p className="font-semibold text-sm">{event.summary}</p>
              <p className="text-xs text-gray-500">{event.location}</p>
     <IonText
            className="text-xs text-gray-600"
            dangerouslySetInnerHTML={{ __html: event.startTime }}
          />
              <div className="flex gap-1 mt-2 flex-wrap">
                {event.hashtags.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="text-[10px] bg-gray-100 px-2 py-1 rounded-full">
                 
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* FILTERS */}
      <div className="py-3">
        <div className="flex gap-2 overflow-x-auto">
          <button onClick={() => setSelectedArea("")} className={`pill px-4 ${selectedArea==""?"bg-soft text-white":""}`}>
            All
          </button>

          {areas.map((area) => (
            // Enviroment.palette.card
            <button key={area} onClick={() => setSelectedArea(area)} className={`pill px-2 mx-1 ${selectedArea==area?"bg-soft hover:bg-card-highlight text-white":""}`}>
              {area}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <IonInput
            value={searchTerm}
            onIonInput={handleSearchInputChange}
            placeholder="Search events"
            className="bg-gray-100 rounded-xl px-3 py-2"
          />
        </div>
      </div>

      {/* HORIZONTAL PB EVENTS */}
      <HorizontalScroll />

      {/* MAIN LIST */}
      <IonList style={{ "--background": Enviroment.palette.cream,minHeight:"12em"}}>
        {paginatedEvents.map(renderEvent)}
      </IonList>
      {totalPages > 1 && (
  <div className="flex items-center justify-between px-6 py-4 max-w-[500px] mx-auto">

    {/* PREVIOUS */}
    <button
      disabled={currentPage === 1}
      onClick={() => {
        setCurrentPage((p) => Math.max(1, p - 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={`px-4 py-2 rounded-xl text-sm ${
        currentPage === 1
          ? "text-gray-300"
          : "bg-gray-100 active:bg-gray-200"
      }`}
    >
      Prev
    </button>

    {/* PAGE INDICATOR */}
    <div className="text-sm text-gray-500">
      {currentPage} / {totalPages}
    </div>

    {/* NEXT */}
    <button
      disabled={currentPage === totalPages}
      onClick={() => {
        setCurrentPage((p) => Math.min(totalPages, p + 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={`px-4 py-2 rounded-xl text-sm ${
        currentPage === totalPages
          ? "text-gray-300"
          : "bg-gray-100 active:bg-gray-200"
      }`}
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

export default CalendarEmbed;
const linkifyFirstUrl=(text) =>{
  if (!text) return '';

  // Remove HTML tags
  const strippedText = text.replace(/<[^>]*>/g, '');

  // Match the first URL in plain text
  const urlRegex = /(https?:\/\/[^\s]+)/i;
  const match = strippedText.match(urlRegex);

  if (!match) return ''; // No URL found

  const url = match[0];
 
  return url;
}
  
  function cleanDescriptionAndExtractHashtags(description) {
    // Step 1: Remove URLs
    const urlRegex = /(https?:\/\/[^\s]+)/i;
    const hashtagRegex = /#(\w+)/g;
    const descriptionWithoutLinks = description.replace(urlRegex, '').trim();
let suggestions = []
  const cleanDescription = descriptionWithoutLinks.replace(hashtagRegex, '').trim();
    // Step 2: Find hashtags

    const hashtags = [];
    let match;
    while ((match = hashtagRegex.exec(descriptionWithoutLinks)) !== null) {
      hashtags.push(`#${match[1]}`);
        suggestions.push(match[1])
    }
  
    // Step 3: Return both
    return {
      cleanedDescription: cleanDescription,
      suggestions:suggestions,
      hashtags: hashtags,
    };
  }
function HorizontalEventList({ events, handleDialogOpen, sendGAEvent, isPhone, areas, calendar }) {
  const openGooglemaps=(event)=>{

                            
                             const encoded = encodeURIComponent(event.rawLocation);
window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`)
                             
                              
}

  return (
    <IonList
            style={{ "--background": Enviroment.palette.cream }}
      className="
        flex flex-row overflow-x-auto bg-cream px-2 space-x-4 py-2 scrollbar-hide
      "
    >
      {events && events.length
        ? events.map((event, i) => {
            const eId = event.googleLink.split("?eid=")[0];
            return (
          
                <div  

                className="
                bg-cream
               border-blueSea border-opacity-50 border rounded-[30px]
                 min-w-[16rem] max-w-[18rem]
                flex-shrink-0 flex-col p-4
               "
                >
                <div className="flex flex-col justify-between h-full">
                  <span
            
                    className="flex flex-col text-left cursor-pointer"
                  >
                    <span     onClick={()=>handleDialogOpen(event)} className="mr-2 max-w-[15rem] text-ellipsis overflow-hidden whitespace-nowrap">
                      {isPhone ? event.shortSummary : event.summary}
                    </span>

                    {event.organizerLink && event.googleLink ? (
                      <span
                        onClick={() => {
                          sendGAEvent("navigate_event", {
  event_summary: event.summary,
  hashtags: event.hashtags,
  hashtags_count: event.hashtags?.length ?? 0,
  source: "event_click",
});


                        }}
                        className="flex flex-col"
                      >
                        <a className="text-blueSea overflow-hidden py-4 text-ellipsis whitespace-nowrap no-underline max-w-[15rem] my-auto">
                          <h6 onClick={()=>openGooglemaps(event)} className="text-[0.8rem]">{event.location.length<25?isPhone?event.location:event.location.slice(0,20)+"...":event.location.slice(0,37)}</h6>
                        </a>
                      </span>
                    ) : (
                      <h6  className="whitespace-nowrap  no-underline py-4 text-[0.8rem]">
                       <a onClick={()=>openGooglemaps(event)}>{event.location.length<25?isPhone?event.location:event.location:event.location.slice(0,25)+"..."}</a>
                      </h6>
                    )}

                    {event.area === areas[2] && event.googleLink ? (
                      <a>
                        <h6 className="text-blueSea text-[0.6rem] flex flex-row">
                          <span>{event.area}</span>
                        </h6>
                      </a>
                    ) : (
                      <span className="text-slate-600 text-sm">{event.area}</span>
                    )}

                    <h5 className="text-[0.7rem] min-h-6">
                      {event.hashtags.slice(0, 4).join(" ")}
                    </h5>
                  </span>

                  <span className="flex flex-row justify-between mt-3">
                    <IonText className="my-auto text-[0.8rem] text-blueSea">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: event.startTime,
                        }}
                      />
                    </IonText>
                    <IonImg
                      onClick={() => {
                        sendGAEvent("navigate_event", {
  event_summary: event.summary,
  hashtags: event.hashtags,
  hashtags_count: event.hashtags?.length ?? 0,
  source: "event_click",
});

                        window.open(event.googleLink);
                      }}
                      className="w-10 h-10 my-auto"
                      src={calendar}
                    />
                  </span>
                </div>
                </div>
            
            );
          })
        : null}
    </IonList>
  );
}





// Helper function to format date objects (like event.start.dateTime)
const formatGoogleCalendarDate = (isoDateString) => {
    if (!isoDateString) return '';
    // For all-day events, the API returns a 'date' field (e.g., 2025-12-31)
    if (isoDateString.length === 10) {
        // Return YYYYMMDD (no time component needed)
        return isoDateString.replace(/-/g, '');
    }
    // For timed events, return YYYYMMDDTHHMMSSZ
    return new Date(isoDateString).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
};

