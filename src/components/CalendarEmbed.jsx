import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { useLayoutEffect,useEffect } from "react";
import useScrollTracking from "../core/useScrollTracking";
import { useMediaQuery } from "react-responsive";
import storyRepo from "../data/storyRepo";
import InfiniteScroll from "react-infinite-scroll-component";
import Context from "../context";
import isValidUrl from "../core/isValidUrl";
import { initGA,sendGAEvent } from "../core/ga4";
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
            initGA()
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
        const today = new Date();
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(today.getMonth() + 3);
        // const isWithinThreeMonths = event.end.dateTime >= Date.now() && event.end.dateTime <= threeMonthsLater;
           const endDate = event.end?.dateTime || event.end?.date;
           return new Date(endDate) >= Date.now() && new Date(endDate)<=threeMonthsLater
        }).sort((a, b) => {
            const aStart = new Date(a.start?.dateTime || a.start?.date);
            const bStart = new Date(b.start?.dateTime || b.start?.date);
            return aStart - bStart;
          })  .map(event => {
            const isAllDay = !event.start.dateTime;
            const startTimeFormatted = isAllDay ? "All Day" : formatDate(event.start.dateTime);
            let organizerLink = linkifyFirstUrl(event.description) || ''
        
            let location = event.location? event.location.length > 27 ? event.location.slice(0, 27) + '...' : event.location:""
            let summary = event.summary? event.summary.length > 23 ? event.summary.slice(0, 23) + '...' : event.summary:""
            let obj = event.description?cleanDescriptionAndExtractHashtags(event.description):{cleanedDescription: "",
                hashtags:[]}
            console.log(JSON.stringify(obj))
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
          className="w-page-mobile shadow-sm md:w-page max-h-[30em] md:max-h-[40rem] mx-auto "
                next={()=>{}}
                hasMore={false}
                loader={<p>Loading...</p>}
          dataLength={events.length}>
          {events.map((event,i)=>{

            return(
            <div key={i} 
                className={`flex flex-col border-emerald-600  px-6 px-4 rounded-full  border my-1 shadow-md   py-4 mx-auto `}
                onTouchStart={()=>{
            
                sendGAEvent("View Event","Clicked Event"+event.summary,event.summary,0,false)
            }}>
           <span className="flex flex-row justify-between text-left mont-medium text-emerald-800 ">
                <span>
             <a onClick={()=>{
              window.location.href = event.googleLink
              sendGAEvent("Click",`Event Click for name ${event.summary},${JSON.stringify(event.hashtags)}`,event.summary,"",false)
             }}><h5 className="text-ellipsis text-green-600  flex flex-col  
            whitespace-nowrap no-underline max-w-[20em] overflow-hidden">
            + {isPhone?event.shortSummary:event.summary}</h5></a>
                {event.area==areas[2]&&event.organizerLink?<a 
                onClick={()=>{
                  sendGAEvent("Click",`Event Click for Location ${event.summary},${JSON.stringify(event.hashtags)}`,event.summary,"",false)
          
                    window.location.href = event.organizerLink
               
                }}><span className="text-green-600 text-sm">{event.area}</span></a> :<span className="text-slate-600 text-sm">{event.area}</span>}
             </span>
            <span className="flex overflow-hidden flex-col text-right ">
            <h5>{event.startTime??""}</h5>
             {event.organizerLink&&isValidUrl(event.organizerLink)? 
              <a className="text-green-600 whitespace-nowrap no-underline max-w-[20em] " href={event.organizerLink}><h6 >{event.location}</h6></a>:<h6 className=" whitespace-nowrap no-underline max-w-[20em]">{event.location}</h6>}
              </span>
          </span>
            <span className="text-left  mont-medium text-slate-600"><h5 className="text-[0.7rem]">{event.hashtags.join(" ")}</h5></span></div>)
            
            })
          }
          </InfiniteScroll>
        
</div>)}


    
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

    return url
    // return text.replace(urlRegex, linkedUrl);
  }
  function cleanDescriptionAndExtractHashtags(description) {
    // Step 1: Remove URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const hashtagRegex = /#(\w+)/g;
    const descriptionWithoutLinks = description.replace(urlRegex, '').trim();

  const cleanDescription = descriptionWithoutLinks.replace(hashtagRegex, '').trim();
    // Step 2: Find hashtags

    const hashtags = [];
    let match;
    while ((match = hashtagRegex.exec(descriptionWithoutLinks)) !== null) {
      hashtags.push(`#${match[1]}`);
    }
  
    // Step 3: Return both
    return {
      cleanedDescription: cleanDescription,
      hashtags: hashtags,
    };
  }
  