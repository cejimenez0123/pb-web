import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { useLayoutEffect,useEffect } from "react";
import useScrollTracking from "../core/useScrollTracking";
import { useMediaQuery } from "react-responsive";
import storyRepo from "../data/storyRepo";
import InfiniteScroll from "react-infinite-scroll-component";
import Context from "../context";
import isValidUrl from "../core/isValidUrl";
function CalendarEmbed(){
    const {setError,currentProfile}=useContext(Context)
    const [selectedArea, setSelectedArea] = useState("");
    useScrollTracking({name:"Calendar"})
    const [list,setList]=useState([])
    const [events,setEvents]=useState(
  [])
  const isPhone =  useMediaQuery({
    query: '(max-width: 768px)'
  })
  const areas = ["Downtown", "Uptown", "Virtual", "Queens"];

     
        useLayoutEffect(()=>{
            addEvents()
      },[])
      useEffect(()=>{
        setEvents(list)
      },[list])
      const addEvents= ()=>{
        try{
      storyRepo.fetchEvents({days:30}).then(res=>{
    
        let events = res.events.flatMap(event=>event.events)
  
      const eventList = events.filter(event => {
           const endDate = event.end?.dateTime || event.end?.date;
           return new Date(endDate) >= Date.now();}).sort((a, b) => {
            const aStart = new Date(a.start?.dateTime || a.start?.date);
            const bStart = new Date(b.start?.dateTime || b.start?.date);
            return aStart - bStart;
          })  .map(event => {
            const isAllDay = !event.start.dateTime;
            const startTimeFormatted = isAllDay ? "All Day" : formatDate(event.start.dateTime);
            let organizerLink = linkifyFirstUrl(event.description) || ''
        
            let location = event.location? event.location.length > 24 ? event.location.slice(0, 24) + '...' : event.location:""
            let summary = event.summary? event.summary.length > 23 ? event.summary.slice(0, 23) + '...' : event.summary:""
            return {
            
              summary: event.summary,
              shortSummary:summary,
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
        const filteredEvents = selectedArea.length>0?list.filter(event => {
        
           return event.area.trim().toLowerCase() == selectedArea.toLowerCase()})
        : list;
   
        setEvents(filteredEvents)
      },[selectedArea])
      

      return (
        <div className="w-[100%]">
        <div className="flex w-page mx-auto text-left flex-row">
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
        </div>
          <InfiniteScroll 
          className="w-fit mx-auto "
                next={()=>{}}
                hasMore={false}
                loader={<p>Loading...</p>}
          dataLength={events.length}>
          {events.map((event,i)=>{

            return(<div key={i} className={`my-1 shadow-md text-left flex flex-row justify-between px-6 px-4 mont-medium text-emerald-800 py-4 border border-emerald-600 rounded-full mx-auto ${isPhone?"w-mobile-page":"w-page"} `}>
              <span>
                
              <a href={event.googleLink}><h5 className="text-ellipsis text-green-600  flex flex-col  
            whitespace-nowrap no-underline max-w-[20em] overflow-hidden">
                + {isPhone?event.shortSummary:event.summary}</h5></a>
                {event.area==areas[2]&&event.organizerLink?<a href={event.organizerLink}><span className="text-green-600 text-sm">{event.area}</span></a> :<span className="text-slate-600 text-sm">{event.area}</span>}
                </span>
              <span className="flex overflow-hidden flex-col text-right ">
                <h5>{event.startTime??""}</h5>
                {event.organizerLink&&isValidUrl(event.organizerLink)?
              <a className="text-green-600 whitespace-nowrap no-underline max-w-[20em] " href={event.organizerLink}><h6 >{event.location}</h6></a>:<h6 className=" whitespace-nowrap no-underline max-w-[20em]">{event.location}</h6>}
              </span>
            </div>)
          })}
          </InfiniteScroll>
        
          </div>
      );
    };
  export default CalendarEmbed
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
  
    const formattedHours = hours.toString().padStart(2, '0');
  
    return `${month}/${day} ${formattedHours}:${minutes} ${ampm}`;
  }
  function linkifyFirstUrl(text) {
    if (!text) return '';
  
    const urlRegex = /(https?:\/\/[^\s]+)/;
    const match = text.match(urlRegex);
  
    if (!match) return text; // No URL found
  
    const url = match[0];
    const linkedUrl = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    return url
    // return text.replace(urlRegex, linkedUrl);
  }