import { useContext, useRef, useState, useEffect, useLayoutEffect } from "react";
import useScrollTracking from "../core/useScrollTracking";
import storyRepo from "../data/storyRepo";
import Context from "../context";
import { useSelector } from "react-redux";
import calendar from "../images/icons/calendar_add_blue.svg";
import { IonImg, IonInput, IonList, IonLoading, IonText } from "@ionic/react";
import { useDialog } from "../domain/usecases/useDialog";
import Enviroment from "../core/Enviroment";
import SectionHeader from "./SectionHeader";
const WRAP = "max-w-[42rem] mx-auto px-4";
const PAGE_Y = "pt-16 pb-10";
const STACK_LG = "space-y-8";
const STACK_MD = "space-y-4";
const STACK_SM = "space-y-2";
function CalendarEmbed({ variant = "eventbrite" }) {
  const [loading, setLoading] = useState(true);
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

 const areas = [

  {
    label: "Downtown",
    emoji: "🏙️"
  },
  {
    label: "Uptown",
    emoji: "🚆"
  },
   {
    label: "Queens",
    emoji: "👑"
  },
   {
    label: "Virtual",
    emoji: "💻"
  }];

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
          setLoading(true);
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
console.log(event.organizer.displayName)      
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
            area: event.organizer?.displayName.toLowerCase() || "",
          };
        });

        // ☀️ PB Events
        setSolEvents(eventList.filter(e => e.description?.includes("☀️")));
        setList(eventList);
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => setList(ogEvents), [ogEvents]);

  useEffect(() => {
    let filtered = list;

    if (selectedArea) {
   filtered = filtered.filter(
  (e) =>
    e.area.toLowerCase().includes(selectedArea.toLowerCase())
)}

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
  const value = e.target.value ?? "";
  setSearchTerm(value);

  const filtered = hashtagSuggestions.filter((tag) =>
    tag.toLowerCase().includes(value.toLowerCase())
  );

  setFilteredSuggestions(filtered);
  setShowSuggestions(true);
}
  // function handleSearchInputChange(e) {
  //   const value = e.target.value;
  //   setSearchTerm(value);

  //   const filtered = hashtagSuggestions.filter((tag) =>
  //     tag.toLowerCase().includes(value.toLowerCase())
  //   );

  //   setFilteredSuggestions(filtered);
  //   setShowSuggestions(true);
  // }

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
    className="bg-base-bg px-4 pb-3 pt-4 border-b border-soft  active:scale-[0.98] transition-transform"
    style={{ WebkitTapHighlightColor: "transparent" }}
  >
    <div className="flex justify-between gap-3">

      {/* Left: main info */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-semibold text-soft dark:text-cream min-h-10 truncate">{event.summary}</span>

        {/* Location with pin icon */}
        {event.location && (
          <button
            onClick={(e) => { e.stopPropagation(); openGooglemaps(event); }}
            className="flex items-center gap-1 mt-1 text-left w-fit"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-soft dark:text-cream flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-xs text-soft dark:text-cream underline underline-offset-2">{event.location}</span>
          </button>
        )}

        {event.area && (
          <span className="text-xs text-soft dark:text-cream mt-0.5 opacity-70">{event.area}</span>
        )}

        {/* Hashtags */}
        {event.hashtags?.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-2">
            {event.hashtags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-base-soft border border-soft text-cream px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right: time + calendar */}
      <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
        <IonText
          className="text-xs text-soft dark:text-cream"
          dangerouslySetInnerHTML={{ __html: event.startTime }}
        />
        <button
          onClick={(e) => { e.stopPropagation(); window.open(event.googleLink); }}
          className="flex flex-col items-center gap-0.5 active:scale-95 transition-transform"
          // style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <IonImg className="w-9 h-9" src={calendar} />
          <span className="text-[10px] text-soft dark:text-cream opacity-60">Add</span>
        </button>
      </div>

    </div>
  </div>
);

  // ---------------------------
  // HORIZONTAL LIST (PB EVENTS)
  // ---------------------------

  const HorizontalScroll = () => {
    if (!solEvents.length) return null;
    const renderEvent=(event)=>(<div
  
  onClick={() => handleDialogOpen(event)}
  className="w-[220px] min-h-56 max-h-56 bg-base-bg rounded-xl p-4 border border-soft shadow-sm active:scale-[0.98] transition-transform"
  style={{ WebkitTapHighlightColor: "transparent" }}
>
  <p className="font-semibold text-sm text-soft dark:text-cream truncate">{event.summary}</p>

  {/* Location with pin */}
  {event.location && (
    <button
      onClick={(e) => { e.stopPropagation(); openGooglemaps(event); }}
      className="flex items-center gap-1 mt-1 w-fit"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-soft dark:text-cream flex-shrink-0">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      <span className="text-xs text-soft dark:text-cream underline underline-offset-2">{event.location}</span>
    </button>
  )}

  <IonText
    className="text-xs text-soft dark:text-cream opacity-70 mt-1 block"
    dangerouslySetInnerHTML={{ __html: event.startTime }}
  />

  {event.hashtags?.length > 0 && (
    <div className="flex gap-1 mt-2 flex-wrap">
      {event.hashtags.slice(0, 2).map((tag, idx) => (
        <span key={idx} className="text-[10px] bg-base-soft border border-soft text-cream px-2 py-0.5 rounded-full">
          #{tag}
        </span>
      ))}
    </div>
  )}
</div>)
    return (
      <div>
    <div className="pb-3">
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
        {/* // <div className="flex items-center gap-2 mb-2"> */}
          
         <SectionHeader title={"Events from Pb"}/>
        </div>

        <div className="flex gap-3 px-4 overflow-x-auto">
          {solEvents.map((event, i) => (<div key={i}>
            {renderEvent(event)}
          </div>   ))}
          {/* {solEvents.map((event, i) => (
            <div
              key={i}
              onClick={() => handleDialogOpen(event)}
              className="min-w-[220px] bg-base-bg rounded-xl p-4 border-soft border border-1  shadow-sm"
            >
              <p className="font-semibold text-sm dark:text-emerald-100">{event.summary}</p>
              <p className="text-xs text-gray-500 dark:text-emerald-100">{event.location}</p>
     <IonText
            className="text-xs text-gray-600 dark:text-emerald-100"
            dangerouslySetInnerHTML={{ __html: event.startTime }}
          />
              <div className="flex gap-1 mt-2 flex-wrap">
                {event.hashtags.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="text-[10px] dark:bg-base-bg dark:text-emerald-100 px-2 py-1 rounded-full">
                 
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))} */}
        </div>
        </div>
        
      </div>
    );
  };

  return (
  <div className="space-y-6">

       <IonLoading isOpen={loading} message="Loading events..." />
    
 
    <div><div className="space-y-3 pb-4">
      <div className="flex gap-2 justify-center overflow-x-auto px-4 pb-1">
  <button
    onClick={() => setSelectedArea("")}
    className={`px-4 py-2 ml-8 rounded-full text-sm font-medium transition-all active:scale-95 flex-shrink-0 ${
      selectedArea === "" ? "bg-purple  text-cream" : "bg-soft text-cream border border-soft"
    }`}
    style={{ WebkitTapHighlightColor: "transparent" }}
  >
   <span className="text-cream">   All</span>
  </button>
  {areas.map((area) => (
    <button
      key={area.label}
      onClick={() => setSelectedArea(area.label)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 flex-shrink-0 flex flex-col items-center leading-tight ${
        selectedArea === area.label ?  "bg-purple  text-cream" : "bg-soft border border-soft"
      }`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <span className="text-cream">{area.label}</span>
      <span className="text-xs">{area.emoji}</span>
    </button>
  ))}
</div>

        <div className="mt-3 max-w-[50em] bg-base-bg mb-4 brounded-full px-4    mx-auto">
          <input type="text"
            value={searchTerm}
            onChange={handleSearchInputChange}
            placeholder="Search events"
            className="text-soft input dark:text-cream dark:text-cream max-w-[94%] mx-auto bg-base-bg  py-2"
          />
        </div>
      </div>
<div
  className={`
    overflow-hidden transition-all duration-300 ease-in-out
    ${selectedArea === ""&&searchTerm.length==0
      ? "max-h-[800px] opacity-100 translate-y-0"
      : "max-h-0 opacity-0 -translate-y-2"}
  `}
>
  <HorizontalScroll />
</div>
   

  <IonList style={{ "--background": Enviroment.palette.cream }}>
  
        {paginatedEvents.map(renderEvent)}
      </IonList>

      {totalPages > 1 && (
  <div className="flex items-center justify-between px-4 py-4">

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
)}</div>
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
                bg-base-bg
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

