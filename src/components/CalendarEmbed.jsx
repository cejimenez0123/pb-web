import { useContext, useRef, useState } from "react";
import { useLayoutEffect,useEffect } from "react";
import useScrollTracking from "../core/useScrollTracking";
import storyRepo from "../data/storyRepo";
import InfiniteScroll from "react-infinite-scroll-component";
import Context from "../context";
import isValidUrl from "../core/isValidUrl";
import debounce from "../core/debounce"
import {sendGAEvent } from "../core/ga4";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import calendar from "../images/icons/calendar_add.svg"
import insta from "../images/icons/instagram.svg"
import Dialog from "./Dialog";

function CalendarEmbed(){
  const {isPhone}=useContext(Context)
  
    const {setError,currentProfile}=useContext(Context)
    
    const [selectedArea, setSelectedArea] = useState("")
    const [chosenEvent,setChoice]=useState(null);
    useScrollTracking({name:"Calendar Embed"})
    const ogEvents = useSelector(state=>state.users.events)
    const [list,setList]=useState(ogEvents??[])
    const [events,setEvents]=useState(
  [])
  useEffect(()=>{
    if(chosenEvent){
      sendGAEvent("Looked at Event", `Chose to look at ${chosenEvent.summary} `+searchTerm, searchTerm);
    }
  },[chosenEvent])
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
  sendGAEvent("Search", "User Searched for Hashtags "+searchTerm, searchTerm);

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
      },[currentProfile])
 
      const addEvents= ()=>{
        try{ 
      storyRepo.fetchEvents({days:28}).then(res=>{
        
        let events = res.events.flatMap(event=>event.events)
  
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
          }) .map(event => {
            const isAllDay = !event.start.dateTime;
            const startTimeFormatted = isAllDay ? "All Day" : formatDate(event.start.dateTime);
            let organizerLink = linkifyFirstUrl(event.description) 
        
            let location = event.location? event.location.length > (isPhone?30: 40) ? event.location.slice(0,isPhone?30: 40) + '...' : event.location:""
            let summary = event.summary? event.summary.length > 22 ? event.summary.slice(0, 40) + '...' : event.summary:""
            let obj = event.description?cleanDescriptionAndExtractHashtags(event.description):{cleanedDescription: "",suggestions:[],
                hashtags:[]}
           
            setSuggestions((prevState)=>[...new Set([...prevState,...obj.suggestions])])
           console.log(organizerLink)
            return {
              summary: event.summary,
              shortSummary:summary,
              description:obj.cleanedDescription,
              hashtags: obj.hashtags,
              startTime: startTimeFormatted,
              location: location||'',
              notes: event.description || '',
              googleLink:event.htmlLink||"",
              organizerLink:organizerLink||"",
              area: event.organizer.displayName||''
            };
          });
      
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
      
        sendGAEvent("Search", "User Clicked Suggested Hashtag", suggestion);
      }
      
      return (
        <div className="w-[100%]">
        <div className={`flex w-page mx-auto text-left ${isPhone?"flex-col":`flex-row`}`}>
        <span className="flex flex-row"> 
            <h2 className="my-auto mont-medium mx-4 text-emerald-700">Filter by Area:</h2>

        <select
          className="border w-fit  p-2 text-emerald-700 rounded-full bg-transparent px-2 text-l"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
        >
          <option defaultValue={true} value="">All Areas</option>
          {areas.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
        </span> 
        {/*  */}
      <span className={`flex flex-row`}>
          <h5 className="my-auto ml-4 mr-2 mont-medium text-emerald-800"> Search</h5>
          <div ref={searchRef} className="relative w-[14em] ">
  <input
    type="text"
    className="border p-2 rounded-full bg-transparent text-emerald-800 w-full"
    value={searchTerm}
    onChange={handleSearchInputChange}
    onFocus={() => setShowSuggestions(true)}
    placeholder="#writing, #workshop..."
  />
  
  {showSuggestions && filteredSuggestions.length > 0 && (
    <ul className="absolute z-10 mt-1 bg-white border border-emerald-300 rounded-md shadow-lg w-full max-h-[10em] overflow-auto">
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
{chosenEvent? <Dialog isOpen={chosenEvent}onClose={()=>setChoice(null)}
  agree={chosenEvent&&chosenEvent.organizerLink?()=>{
    // console.log(JSON.stringify(chosenEvent.organizerLink))
    chosenEvent?window.location.href=chosenEvent.organizerLink:null
}:null}text={
  <div className="text-left text-emerald-800">
    <span>{chosenEvent.location}</span>
<span dangerouslySetInnerHTML={{__html:"<div>"+chosenEvent.description+"</div>"}} /></div>} title={chosenEvent.summary}/>:null}
          <InfiniteScroll 
          className="w-page-mobile shadow-sm md:w-page max-h-[30em] md:max-h-[40rem] mx-auto "
                next={()=>{}}
                hasMore={false}
                loader={<p>Loading...</p>}
          dataLength={events.length}>
          {events&&events.length?events.map((event,i)=>{
                        
        let eId= event.googleLink.split("?eid=")[0]
            return(
            <div key={eId} 
            onClick={()=>{
         
              setChoice(event)
            }}
                className={`flex flex-row justify-between border-emerald-600  px-6  rounded-[50px]  border my-1 shadow-md min-h-42  py-4 mx-auto `}
           >
           <span className="flex flex-col justify-between text-left mont-medium text-emerald-800 ">
           <span    className="my-auto mr-2">{isPhone?event.shortSummary:event.summary}</span>     
           {event.organizerLink&&isValidUrl(event.googleLink)? 
             <span   onClick={()=>{
              sendGAEvent("Click",`Navigate by event name ${event.summary},${JSON.stringify(event.hashtags)}`,event.summary,"",false)
              window.location.href = event.googleLink
  f
                  }} className="flex flex-col"> 

                   <a className="text-green-600 whitespace-nowrap no-underline max-w-[25em] my-auto" >
                    <h6 >{event.location}</h6></a></span>:<h6 className=" whitespace-nowrap no-underline max-w-[20em]">{event.location}</h6>}
                {/* <span> */}
             {/* <a onClick={()=>{
                  sendGAEvent("Click",`Event Click for Location ${event.summary},${JSON.stringify(event.hashtags)}`,event.summary,"",false)
                  window.location.href = event.organizerLink
                  
               
                }} > </a> */}
                  {/* <h5 className="text-ellipsis  text-green-600  flex flex-row 
            whitespace-nowrap no-underline max-w-[14em] sm:max-w-[25rem] ">
               */}
        
          
              {/* <img onClick={()=>{
                  sendGAEvent("Click",`Event Click Organizer ${event.summary},${JSON.stringify(event.hashtags)}`,event.summary,"",false)
                  window.location.href = event.organizerLink
                  
               
                }}  className="max-h-6 max-w-6 mt-2 " src={insta}/> */}
                
    
                {event.area==areas[2]&&event.googleLink?<a 
             ><h6 className="text-green-600 text-[0.6rem] flex flex-row"><span>{event.area}</span></h6></a> :<span className="text-slate-600 text-sm">{event.area}</span>}
            <h5 className="text-[0.7rem]">{event.hashtags.join(" ")}</h5>
             </span>
            {/* <span className="flex w-fit overflow-hidden flex-col text-right "> */}
            {/* </h6> */}
           
                 {/* </span> */}
                 <span className="flex flex-row justify-between w-24 ml-3">
                 {/* <h5 className="flex flex-row mt-2"> */}
                  <h5 className="my-auto text-[0.8rem] max-w-12 text-emerald-800 ">{event.startTime??""}</h5>
    <img  onClick={()=>{
              sendGAEvent("Click",`Navigate by event name ${event.summary},${JSON.stringify(event.hashtags)}`,event.summary,"",false)
              window.location.href = event.googleLink
  
                  }} className="w-12 h-12  my-auto" src={calendar} /></span>
                  
                  </div>)
            
            }):null
          }
          </InfiniteScroll>
         
        
</div>)}


    
  export default CalendarEmbed
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
  
    return `${weekday} ${mmdd} ${formattedHours}:${minutes} ${ampm}`;
  }
  //  function linkifyFirstUrl(text) {
  //   if (!text) return '';
  
  //   const urlRegex = /(https?:\/\/[^\s]+)/;
  //   const match = text.match(urlRegex);
  
  //   if (!match) return text; // No URL found
  
  //   const url = match[0];
  //   console.log(url)
  //   return url
  //   // return text.replace(urlRegex, linkedUrl);
  // }

const linkifyFirstUrl=(text) =>{
  if (!text) return '';

  // Remove HTML tags
  const strippedText = text.replace(/<[^>]*>/g, '');

  // Match the first URL in plain text
  const urlRegex = /(https?:\/\/[^\s]+)/;
  const match = strippedText.match(urlRegex);

  if (!match) return ''; // No URL found

  const url = match[0];
  console.log(url);
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
 