import { useContext, useRef, useState } from "react";
import { useLayoutEffect,useEffect } from "react";
import useScrollTracking from "../core/useScrollTracking";
import storyRepo from "../data/storyRepo";
import Context from "../context";
import isValidUrl from "../core/isValidUrl";
import debounce from "../core/debounce"
import {sendGAEvent } from "../core/ga4";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import calendar from "../images/icons/calendar_add.svg"
import { IonImg, IonInput, IonItem, IonList, IonText,  } from "@ionic/react";
import { setDialog } from "../actions/UserActions";
import InfoTooltip from "./InfoTooltip";
import { useDialog } from "../domain/usecases/useDialog";

function CalendarEmbed(){
  const {isPhone}=useContext(Context)
  const dialog = useSelector(state=>state.users.dialog)
const [solEvents,setSolEvents]=useState([])
  const { openDialog, closeDialog } = useDialog()
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'short', month: '2-digit', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options); // e.g., "Mon, 07/21"
  
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
  
    const formattedHours = hours.toString().padStart(2, '0');
  
    // Split the formattedDate to get the weekday and the MM/DD part
    const [weekday, mmdd] = formattedDate.split(', '); 
  
    return `<span>${weekday}<br/> ${mmdd} <br/>${formattedHours}:${minutes} ${ampm}</span>`;
  }
    const {setError,currentProfile}=useContext(Context)
    
    const [selectedArea, setSelectedArea] = useState("")
  
    useScrollTracking({name:"Calendar Embed"})
    const ogEvents = useSelector(state=>state.users.events)
    const [list,setList]=useState(ogEvents??[])
    const [events,setEvents]=useState(
  [])

  const [hashtagSuggestions,setSuggestions]=useState(["poetry","experiment","free"])
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null)
 
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  function handleSearchInputChange(e) {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = hashtagSuggestions.filter(tag =>
      tag.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
sendGAEvent("calendar_search", {
  query: value,
  source: "calendar_embed",
});


  }

  
  
  const [selectedHashtag, setSelectedHashtag] = useState("");
  useEffect(() => {
    let filtered = list;
  
    if (selectedArea) {
      filtered = filtered.filter(event => 
        event.area.trim().toLowerCase() === selectedArea.toLowerCase()
      );
    }
  
    if (selectedHashtag) {
      filtered = filtered.filter(event => 
        event.hashtags.includes(selectedHashtag)
      );
    }
  
    setEvents(filtered);
  }, [selectedArea, selectedHashtag, list]);
  const areas = ["Downtown", "Uptown", "Virtual", "Queens"];

  useLayoutEffect(()=>{
      addEvents()
  },[])
      const addEvents= ()=>{
        try{ 
      storyRepo.fetchEvents({days:28}).then(res=>{
        
        let events = res.events.flatMap(event=>event.events)
  console.log(events[0])
      const eventList = events.filter(event => {
        const today = new Date();
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(today.getMonth() + 3);
           const endDate = event.end?.dateTime || event.end?.date;
           return new Date(endDate) >= Date.now() && new Date(endDate)<=threeMonthsLater
        }).sort((a, b) => {
            const aStart = new Date(a.start?.dateTime || a.start?.date);
            const bStart = new Date(b.start?.dateTime || b.start?.date);
            return aStart - bStart;
          }) .map(
            event => {
            const isAllDay = !event.start.dateTime;
            const startTimeFormatted = isAllDay ? "All Day" : formatDate(event.start.dateTime);
            let organizerLink = linkifyFirstUrl(event.description) 
          let location = ""
            if(event.location && event.location.length>0){
         location = isPhone?event.location.split(",")[0]:event.location.length > 24 ? event.location.slice(0, 25) + '...' : event.location
         }
         let summary = event.summary? event.summary.length > 22 ? event.summary.slice(0, 31) + '...' : event.summary:""
         console.log(event.description)   
         let obj = event.description?cleanDescriptionAndExtractHashtags(event.description):{cleanedDescription: "",suggestions:[],
                hashtags:[]}
          
          

  const baseUrl = 'https://calendar.google.com/calendar/render?';
const startField = event.start?.dateTime || event.start?.date;
const endField = event.end?.dateTime || event.end?.date;

// Construct the dates string: START/END
const eventDates = `${formatGoogleCalendarDate(startField)}/${formatGoogleCalendarDate(endField)}`;
const params = {
    action: 'TEMPLATE',
    text: event.summary,
    dates: eventDates,
    details: obj,
    location: event.location
};

// Map the parameters to the URL format and encode them
const queryString = Object.keys(params)
    .map(key => key + '=' + encodeURIComponent(params[key]))
    .join('&');

const googleAddLink = baseUrl + queryString;

            setSuggestions((prevState)=>[...new Set([...prevState,...obj.suggestions])])

            return {
              summary: event.summary,
              shortSummary:summary,
              description:obj.cleanedDescription,
              hashtags: obj.hashtags,
              startTime: startTimeFormatted,
              location: location||'',
              rawLocation: event.location,
              notes: event.description || '',
              googleLink:event.htmlLink||"",
              organizerLink:organizerLink||"",
              area: event.organizer.displayName||''
            };
          });
       const sunRegex = /☀️/
           const reg = /\u2600(\uFE0F)?/g

          setSolEvents(eventList.filter(eve=>{
           return sunRegex.test(eve.description)}))
         
                   
        
         
      setList(eventList)
        })
   
        }catch(err){
            console.log(err)
            setError(err)
        }
      }
      useEffect(()=>{
        setList(ogEvents)
      },[ogEvents])
      useEffect(()=>{ 
        const filteredEvents = selectedArea.length>0?list.filter(event => {
        
           return event.area.trim().toLowerCase() == selectedArea.toLowerCase()})
        : list;
   
        setEvents(filteredEvents)
      },[selectedArea])
      const dispatch = useDispatch()
  //     const handleDialogOpen=(chosenEvent)=>{
  //         // dispatch(setDialog({ isOpen: false }));
 
  //       let dia = {...dialog}
  //       dia.isOpen = true
  //       dia.disagreeText= "Close"
       
  //       dia.title =null
  //     dia.text=<div className="text-left text-blueSea">
  //       <span>{chosenEvent.location}</span>
  //   <span dangerouslySetInnerHTML={{__html:"<div>"+chosenEvent.description+"</div>"}} /></div>
  //       dia.onClose = ()=>{
  //          dispatch(setDialog({
  //   isOpen: false,
  //   text: null,
  //   title: null,
  //   agree: null,
  //   agreeText: null,
  //   disagreeText: null,
  // }));
  //       }
  //       dia.agreeText = "Organizer"
  //       dia.agree =chosenEvent&&chosenEvent.organizerLink?()=>{
       
  //         chosenEvent?window.location.href=chosenEvent.organizerLink:null
  //     }:null
      
    //     dispatch(setDialog(dia))
    // }
const handleDialogOpen = (chosenEvent) => {
    openDialog({
      title: null,
      text: (
        <div className="text-left text-blueSea">
          <span>{chosenEvent.location}</span>
          <span
            dangerouslySetInnerHTML={{ __html: "<div>" + chosenEvent.description + "</div>" }}
          />
        </div>
      ),
      disagreeText: "Close",
      agreeText: chosenEvent.organizerLink ? "Organizer" : null,
      onClose: () => closeDialog(),
      agree: chosenEvent.organizerLink
        ? () => (window.location.href = chosenEvent.organizerLink)
        : null,
    });
  };

      useEffect(() => {
        let filtered = list;
      
        if (selectedArea.length > 0) {
          filtered = filtered.filter(event =>
            event.area.trim().toLowerCase() === selectedArea.toLowerCase()
          );
        }
        
        if (searchTerm.trim().length > 0) {
          const lower = searchTerm.toLowerCase();
          filtered = filtered.filter(event =>
            event.hashtags.some(tag => tag.toLowerCase().includes(lower))||event.summary.toLowerCase().includes(lower)
          );
        }
        debounce(handleSearchInputChange,5)
        setEvents(filtered);
      }, [selectedArea, searchTerm, list]);
      
      function handleSuggestionClick(suggestion) {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
      sendGAEvent("calendar_hashtag_click", {
  hashtag: suggestion,
  source: "calendar_embed",
});

      }
      
      return (
        <div  className="">
        <div className={`flex  sm:w-[40em] mx-auto  text-left ${isPhone?"flex-col":"flex-row"}`}>
        <span className="flex flex-row my-auto max-h-12 w-16"> 
            <IonText className="my-auto mx-2 text-emerald-700">Filter by Area:</IonText>

        <select
          className="border w-fit  my-auto text-emerald-700 h-[2em] rounded-lg bg-transparent px-2 text-l"
          value={selectedArea}
          onChange={(e) =>{
            sendGAEvent("calendar_area_filter", {
      area: e.target.value || "all",
    });
            setSelectedArea(e.target.value)}}
        >
          <option defaultValue={true} value="">All Areas</option>
          {areas.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
        </span> 
       
      <span className={`flex flex-row my-auto  w-full text-left min-w-30`}>
          <IonText className="my-auto mx-4 text-emerald-800"> Search</IonText>
          <div ref={searchRef} className="relative w-[90vw] mx-auto">

<IonInput
  type="text"
  className="rounded-lg bg-emerald1-100  text-[1rem] text-emerald-800"
  value={searchTerm}

         
  onIonInput={handleSearchInputChange}
  onIonFocus={() => setShowSuggestions(true)}
  placeholder="(#writing, #workshop...)"
/>


  
  {showSuggestions && filteredSuggestions.length > 0 && (
    <ul className="absolute z-10 mt-1 bg-white w-[15em] sborder border-emerald-300 rounded-md shadow-lg w-full max-h-[10em] overflow-auto">
      {filteredSuggestions.map((suggestion, index) =>{
 
        return (
        <li
          key={index}
          className="px-4 py-2 hover:bg-emerald-100 cursor-pointer text-emerald-700"
          onClick={() => handleSuggestionClick(suggestion)}>
          {suggestion}
        </li>
      )})}
    </ul>
  )}
  </div>
  </span>
</div>
  {solEvents.length==0?null:<div className=" text-left">
<div className="flex flex-row">
<IonText className="font-bold text-[1.2rem] px-4 text-soft ">Events with Sol, Founder</IonText><InfoTooltip text="Want to meet the founder. Want to meet someone there so you're not alone. Join Sol at an Event. IG:@decibao"/></div>
<HorizontalEventList events={solEvents} handleDialogOpen={handleDialogOpen} sendGAEvent={sendGAEvent} isPhone={isPhone} areas={areas} calendar={calendar}  />
   </div> }
  
       <IonList className='flex sm:max-w-[50em] px-2 mx-auto flex-col'>
             <IonText className="font-bold text-[1.2rem] text-soft" >NYC CALENDAR</IonText>
                
                {events&&events.length?events.map((event,i)=>{
                        
                  let eId= event.googleLink.split("?eid=")[0]
                      return(
                      <div key={i} 
                    
                      onClick={()=>handleDialogOpen(event)}
                         className=" 
                          border-blueSea border  border-opacity-50 rounded-[3.5em]   min-h-42 my-1  py-4  "
                     >
                      <div  className={`flex
                      flex-row justify-between  px-6    `}>
                       {/* // */}
                     <span  className=" flex-col text-left flex"
                     >
                   
                     <span    className="mr-2 max-w-[15rem] text-overflow-ellipsis overflow-clip">{isPhone?event.shortSummary:event.summary}</span>     
                     {event.organizerLink&&isValidUrl(event.googleLink)? 
                       <span  className="flex flex-col"> 
          
                             <a className="text-blueSea overflow-clip text-overflow-ellipsis whitespace-nowrap no-underline max-w-[15rem] my-auto" >
                              <IonText onClick={()=>{
                            
                             const encoded = encodeURIComponent(event.rawLocation);
window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`)
                             
                              }}>{event.location.length<25?event.location:event.location.slice(0,20)+"..."}</IonText></a></span>:<h6 className=" whitespace-nowrap no-underline max-w-[20em]">{event.location}</h6>}
                          
                          
              
                          {event.area==areas[2]&&event.googleLink?<a 
                       ><h6 className="text-blueSea text-[0.6rem] flex flex-row"><span>{event.area}</span></h6></a> :<span className="text-slate-600 text-sm">{event.area}</span>}
                      <h5 className="text-[0.7rem] min-h-6">{event.hashtags.slice(0,4).join(" ")}</h5>
                       </span>
                     {/*  */}
                           <span className="flex flex-row justify-between min-w-20 w-20 ml-3">
                         
                            <IonText className="my-auto text-[0.8rem] w-[2.6rem] text-blueSea "><div dangerouslySetInnerHTML={{__html:event.startTime}}/></IonText>
              <IonImg 
              onClick={()=>{
                        sendGAEvent("calendar_add_click", {
  event_title: event.summary,
  hashtags: event.hashtags,
  area: event.area,
});

                        window.open(event.googleLink)
            
                            }} className="w-12 h-12  my-auto" src={calendar} /></span>
                            </div>
                            </div>)
                      
                      }):null
                    }
                    </IonList>
         
        
</div>)}


    
  export default CalendarEmbed
  

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
  return (
    <IonList
      className="
        flex flex-row overflow-x-auto px-2 space-x-4 py-2 scrollbar-hide
      "
    >
      {events && events.length
        ? events.map((event, i) => {
            const eId = event.googleLink.split("?eid=")[0];
            return (
              // <IonItem
              //   key={i}
                
                    
              //   className="
              //     border-blueSea border-opacity-50 border rounded-[30px]
              //     min-w-[16rem] max-w-[18rem]
              //     flex-shrink-0 flex-col p-4
              //   "
               
              // >
                <div  
                className="
               border-blueSea border-opacity-50 border rounded-[30px]
                 min-w-[16rem] max-w-[18rem]
                flex-shrink-0 flex-col p-4
               "
                >
                <div className="flex flex-col justify-between h-full">
                  <span
                onClickCapture={()=>handleDialogOpen(event)}
                    className="flex flex-col text-left cursor-pointer"
                  >
                    <span className="mr-2 max-w-[15rem] text-ellipsis overflow-hidden whitespace-nowrap">
                      {isPhone ? event.shortSummary : event.summary}
                    </span>

                    {event.organizerLink && event.googleLink ? (
                      <span
                        onClick={() => {
                          sendGAEvent(
                            "Click",
                            `Navigate by event name ${event.summary},${JSON.stringify(event.hashtags)}`,
                            event.summary,
                            "",
                            false
                          );

                          // window.open(event.googleLink);
                        }}
                        className="flex flex-col"
                      >
                        <a className="text-blueSea overflow-hidden text-ellipsis whitespace-nowrap no-underline max-w-[15rem] my-auto">
                          <IonText>{event.location}</IonText>
                        </a>
                      </span>
                    ) : (
                      <h6 className="whitespace-nowrap no-underline max-w-[20em]">
                        {event.location}
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
                        sendGAEvent(
                          "Click",
                          `Navigate to ${event.summary}}`,
                          event.summary,
                          "",
                          false
                        );
                        window.open(event.googleLink);
                      }}
                      className="w-10 h-10 my-auto"
                      src={calendar}
                    />
                  </span>
                </div>
                </div>
              // </IonItem>
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

