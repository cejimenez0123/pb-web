import { useContext, useRef, useState, useEffect, useLayoutEffect } from "react";
import useScrollTracking from "../core/useScrollTracking";
import storyRepo from "../data/storyRepo";
import Context from "../context";
import debounce from "../core/debounce";
import { sendGAEvent } from "../core/ga4";
import { useSelector } from "react-redux";
import calendar from "../images/icons/calendar_add.svg";
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
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto">
          <button onClick={() => setSelectedArea("")} className={`pill ${selectedArea==""?"bg-soft text-white":""}`}>
            All
          </button>

          {areas.map((area) => (
            <button key={area} onClick={() => setSelectedArea(area)} className={`pill ${selectedArea==area?"bg-soft text-white":""}`}>
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
// function CalendarEmbed(){
//   const {isPhone}=useContext(Context)
  
//   const [solEvents,setSolEvents]=useState([])
//   const { openDialog, closeDialog} = useDialog()
//   function formatDate(dateStr) {
//     const date = new Date(dateStr);
//     const options = { weekday: 'short', month: '2-digit', day: '2-digit' };
//     const formattedDate = date.toLocaleDateString('en-US', options); // e.g., "Mon, 07/21"
  
//     let hours = date.getHours();
//     const minutes = date.getMinutes().toString().padStart(2, '0');
//     const ampm = hours >= 12 ? 'PM' : 'AM';
  
//     hours = hours % 12;
//     hours = hours ? hours : 12; // 0 should be 12
  
//     const formattedHours = hours.toString().padStart(2, '0');
  
//     // Split the formattedDate to get the weekday and the MM/DD part
//     const [weekday, mmdd] = formattedDate.split(', '); 
  
//     return `<span>${weekday}<br/> ${mmdd} <br/>${formattedHours}:${minutes} ${ampm}</span>`;
//   }
//     const {setError}=useContext(Context)
    
//     const [selectedArea, setSelectedArea] = useState("")
  
//     useScrollTracking({name:"Calendar Embed"})
//     const ogEvents = useSelector(state=>state.users.events)
//     const [list,setList]=useState(ogEvents??[])
//     const [events,setEvents]=useState(
//   [])

//   const [hashtagSuggestions,setSuggestions]=useState(["poetry","experiment","free"])
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredSuggestions, setFilteredSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const searchRef = useRef(null)
 
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowSuggestions(false);
//       }
//     }
  
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
//   function handleSearchInputChange(e) {
//     const value = e.target.value;
//     setSearchTerm(value);
//     const filtered = hashtagSuggestions.filter(tag =>
//       tag.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredSuggestions(filtered);
//     setShowSuggestions(true);
// sendGAEvent("search", {
//   search_term: value,
//   search_type: "calendar",
//   source: "calendar_embed",
// });



//   }

  
  
//   const [selectedHashtag, setSelectedHashtag] = useState("");
//   useEffect(() => {
//     let filtered = list;
  
//     if (selectedArea) {
//       filtered = filtered.filter(event => 
//         event.area.trim().toLowerCase() === selectedArea.toLowerCase()
//       );
//     }
  
//     if (selectedHashtag) {
//       filtered = filtered.filter(event => 
//         event.hashtags.includes(selectedHashtag)
//       );
//     }
  
//     setEvents(filtered);
//   }, [selectedArea, selectedHashtag, list]);
//   const areas = ["Downtown", "Uptown", "Virtual", "Queens"];

//   useLayoutEffect(()=>{
//       addEvents()
//   },[])
//       const addEvents= ()=>{
//         try{ 
//       storyRepo.fetchEvents({days:28}).then(res=>{
        
//         let events = res.events.flatMap(event=>event.events)

//       const eventList = events.filter(event => {
//         const today = new Date();
//         const threeMonthsLater = new Date();
//         threeMonthsLater.setMonth(today.getMonth() + 3);
//            const endDate = event.end?.dateTime || event.end?.date;
//            return new Date(endDate) >= Date.now() && new Date(endDate)<=threeMonthsLater
//         }).sort((a, b) => {
//             const aStart = new Date(a.start?.dateTime || a.start?.date);
//             const bStart = new Date(b.start?.dateTime || b.start?.date);
//             return aStart - bStart;
//           }) .map(
//             event => {
//             const isAllDay = !event.start.dateTime;
//             const startTimeFormatted = isAllDay ? "All Day" : formatDate(event.start.dateTime);
//             let organizerLink = linkifyFirstUrl(event.description) 
//           let location = ""
//             if(event.location && event.location.length>0){
//          location = event.location
//          }
//          let summary = event.summary? event.summary.length > 22 ? event.summary.slice(0, 31) + '...' : event.summary:""
          
//          let obj = event.description?cleanDescriptionAndExtractHashtags(event.description):{cleanedDescription: "",suggestions:[],
//                 hashtags:[]}
          
          

//   const baseUrl = 'https://calendar.google.com/calendar/render?';
// const startField = event.start?.dateTime || event.start?.date;
// const endField = event.end?.dateTime || event.end?.date;

// // Construct the dates string: START/END
// const eventDates = `${formatGoogleCalendarDate(startField)}/${formatGoogleCalendarDate(endField)}`;
// const params = {
//     action: 'TEMPLATE',
//     text: event.summary,
//     dates: eventDates,
//     details: obj,
//     location: event.location
// };

// // Map the parameters to the URL format and encode them
// const queryString = Object.keys(params)
//     .map(key => key + '=' + encodeURIComponent(params[key]))
//     .join('&');

// const googleAddLink = baseUrl + queryString;

//             setSuggestions((prevState)=>[...new Set([...prevState,...obj.suggestions])])

//             return {
//               summary: event.summary,
//               shortSummary:summary,
//               description:obj.cleanedDescription,
//               hashtags: obj.hashtags,
//               startTime: startTimeFormatted,
//               location: location||'',
//               rawLocation: event.location,
//               notes: event.description || '',
//               googleLink:event.htmlLink||"",
//               organizerLink:organizerLink||"",
//               area: event.organizer.displayName||''
//             };
//           });
//        const sunRegex = /☀️/
//            const reg = /\u2600(\uFE0F)?/g

//           setSolEvents(eventList.filter(eve=>{
//            return sunRegex.test(eve.description)}))
         
                   
        
         
//       setList(eventList)
//         })
   
//         }catch(err){
//             console.log(err)
//             setError(err)
//         }
//       }
//       useEffect(()=>{
//         setList(ogEvents)
//       },[ogEvents])
//       useEffect(()=>{ 
//         const filteredEvents = selectedArea.length>0?list.filter(event => {
        
//            return event.area.trim().toLowerCase() == selectedArea.toLowerCase()})
//         : list;
   
//         setEvents(filteredEvents)
//       },[selectedArea])

// const trackEventView = (event) => {
//   if (!event?.hashtags?.length) return;

//   event.hashtags.forEach(tag => {
//     sendGAEvent("view_item", {
//       item_type: "calendar_event",
//       item_name: event.summary,
//       hashtag: tag.replace("#", ""),
//       area: event.area,
//       source: "calendar_embed",
//     });
//   });
// };
// const handleDialogOpen = (chosenEvent) => {
//   // Analytics
//   sendGAEvent("select_item", {
//     item_type: "calendar_event",
//     item_name: chosenEvent.summary,
//     area: chosenEvent.area,
//     hashtags: chosenEvent.hashtags,
//   });

//   trackEventView(chosenEvent);

//   // Dialog config
//   openDialog({
//     title: null,
//     scrollY: false,
//     breakpoint:1,
//     text: (
//       <div className="text-left text-blueSea">
//         <span>{chosenEvent.location}</span>
//         <h6 className="text-[1.5em] pt-2">{chosenEvent.description}</h6>
//         {/* <span
//           dangerouslySetInnerHTML={{
//             __html: `<div>${chosenEvent.description}</div>`,
//           }}
//         /> */}
//       </div>
//     ),

//     disagreeText: "Close",
//     disagree: closeDialog,

//     agreeText: chosenEvent.organizerLink ? "Organizer" : null,
//     agree: chosenEvent.organizerLink
//       ? () => {
//           sendGAEvent("outbound_click", {
//             destination: "organizer",
//             event_name: chosenEvent.summary,
//           });
//           window.location.href = chosenEvent.organizerLink;
//         }
//       : null,
//   });
// };


// const openGooglemaps=(event)=>{

                            
//                              const encoded = encodeURIComponent(event.rawLocation);
// window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`)
                             
                              
// }

//       useEffect(() => {
//         let filtered = list;
      
//         if (selectedArea.length > 0) {
//           filtered = filtered.filter(event =>
//             event.area.trim().toLowerCase() === selectedArea.toLowerCase()
//           );
//         }
        
//         if (searchTerm.trim().length > 0) {
//           const lower = searchTerm.toLowerCase();
//           filtered = filtered.filter(event =>
//             event.hashtags.some(tag => tag.toLowerCase().includes(lower))||event.summary.toLowerCase().includes(lower)
//           );
//         }
//         debounce(handleSearchInputChange,5)
//         setEvents(filtered);
//       }, [selectedArea, searchTerm, list]);
      
//       function handleSuggestionClick(suggestion) {
//         setSearchTerm(suggestion);
//         setShowSuggestions(false);
//      sendGAEvent("search", {
//   search_term: suggestion,
//   search_type: "hashtag",
//   source: "calendar_embed",
// });


//       }
      
//       return (
//         <div  className="">
//         <div className={`flex  sm:w-[40em] mx-auto  text-left ${isPhone?"flex-col":"flex-row"}`}>
//         <span className="flex flex-row my-auto max-h-12 w-16"> 
//             <IonText className="my-auto mx-2 text-emerald-700">Filter by Area:</IonText>

//         <select
//           className="border w-fit  my-auto text-emerald-700 h-[2em] rounded-lg bg-transparent px-2 text-l"
//           value={selectedArea}
//           onChange={(e) =>{
//         sendGAEvent("filter", {
//   filter_type: "area",
//   filter_value: e.target.value || "all",
//   source: "calendar_embed",
// });

//             setSelectedArea(e.target.value)}}
//         >
//           <option defaultValue={true} value="">All Areas</option>
//           {areas.map(area => (
//             <option key={area} value={area}>{area}</option>
//           ))}
//         </select>
//         </span> 
       
//       <span className={`flex flex-row my-auto  w-full text-left min-w-30`}>
//           <IonText className="my-auto mx-4 text-emerald-800"> Search</IonText>
//           <div ref={searchRef} className="relative w-[90vw] mx-auto">

// <IonInput
//   type="text"
//   className="rounded-lg bg-emerald1-100  text-[1rem] text-emerald-800"
//   value={searchTerm}

         
//   onIonInput={handleSearchInputChange}
//   onIonFocus={() => setShowSuggestions(true)}
//   placeholder="(#writing, #workshop...)"
// />


  
//   {showSuggestions && filteredSuggestions.length > 0 && (
//     <ul className="absolute z-10 mt-1 bg-white w-[15em] sborder border-emerald-300 rounded-md shadow-lg w-full max-h-[10em] overflow-auto">
//       {filteredSuggestions.map((suggestion, index) =>{
 
//         return (
//         <li
//           key={index}
//           className="px-4 py-2 hover:bg-emerald-100 cursor-pointer text-emerald-700"
//           onClick={() => handleSuggestionClick(suggestion)}>
//           {suggestion}
//         </li>
//       )})}
//     </ul>
//   )}
//   </div>
//   </span>
// </div>
//   {solEvents.length==0?null:<div className=" text-left">
// <div className="flex flex-row">
// <IonText className="font-bold text-[1.2rem] px-4 text-soft ">Events from Pb</IonText><InfoTooltip text="Want to meet the founder. Want to meet someone there so you're not alone. Join Sol at an Event. IG:@decibao"/></div>
// <HorizontalEventList events={solEvents} handleDialogOpen={handleDialogOpen} sendGAEvent={sendGAEvent} isPhone={isPhone} areas={areas} calendar={calendar}  />
//    </div> }
  
//        <IonList         style={{ "--background":Enviroment.palette.cream}} className='flex bg-cream sm:max-w-[50em] px-2 mx-auto flex-col'>
//              <IonText className="font-bold text-[1.2rem] text-soft" >NYC CALENDAR</IonText>
                
//                 {events&&events.length?events.map((event,i)=>{
                
//                   let eId= event.googleLink.split("?eid=")[0]
//                       return(
//                       <div key={i} 
                    
//                       onClick={()=>handleDialogOpen(event)}
//                          className="  border-blueSea border  border-opacity-50 rounded-[3.5em]   min-h-42 my-1  py-4  "
//                      >
//                       <div  className={`flex flex-row justify-between  px-6    `}>
//                        {/* // */}
//                      <span  className=" flex-col text-left flex"
//                      >
                   
//                      <span    className="mr-2 max-w-[15rem] text-overflow-ellipsis overflow-clip">{isPhone?event.shortSummary:event.summary}</span>     
//                      {event.organizerLink&&isValidUrl(event.googleLink)? 
//                        <span  className="flex flex-col"> 
          
//                              <a className="text-blueSea overflow-clip text-overflow-ellipsis whitespace-nowrap no-underline max-w-[15rem] my-auto" >
//                               <h6  className="py-2 text-[0.8rem]"
//                               onClick={()=>{   
//                openGooglemaps(event)}}>{event.location.length<25?isPhone?event.location:event.location.slice(0,20)+"...":event.location.slice(0,37)}</h6></a></span>:
//                <a><h6  onClick={()=>{   
//                openGooglemaps(event)}}
//                className=" whitespace-nowrap text-[0.8rem] no-underline ">{event.location}</h6></a>}
                          
                          
              
//                           {event.area==areas[2]&&event.googleLink?<a 
//                        ><h6 className="text-blueSea text-[0.6rem] flex flex-row"><span>{event.area}</span></h6></a> :<span className="text-slate-600 text-sm">{event.area}</span>}
//                       <h5 className="text-[0.7rem] min-h-6">{event.hashtags.slice(0,4).join(" ")}</h5>
//                        </span>
//                      {/*  */}
//                            <span className="flex flex-row justify-between min-w-20 w-20 ml-3">
                         
//                             <IonText className="my-auto text-[0.8rem] w-[2.6rem] text-blueSea "><div dangerouslySetInnerHTML={{__html:event.startTime}}/></IonText>
//               <IonImg 
//               onClick={()=>{
//         sendGAEvent("add_to_calendar", {
//   event_name: event.summary,
//   area: event.area,
//   source: "calendar_embed",
// });


//                         window.open(event.googleLink)
            
//                             }} className="w-12 h-12  my-auto" src={calendar} /></span>
//                             </div>
//                             </div>)
                      
//                       }):null
//                     }
//                     </IonList>
         
        
// </div>)}


    
//   export default CalendarEmbed
  

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

