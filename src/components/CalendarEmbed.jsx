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
import { IonImg, IonInput, IonItem, IonList, IonText } from "@ionic/react";
import { setDialog } from "../actions/UserActions";

function CalendarEmbed(){
  const {isPhone}=useContext(Context)
  const dialog = useSelector(state=>state.users.dialog)

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
          let location = ""
            if(event.location && event.location.length>0){
         location = isPhone?event.location.split(",")[0]:event.location.length > 24 ? event.location.slice(0, 31) + '...' : event.location
         }
         let summary = event.summary? event.summary.length > 22 ? event.summary.slice(0, 31) + '...' : event.summary:""
            let obj = event.description?cleanDescriptionAndExtractHashtags(event.description):{cleanedDescription: "",suggestions:[],
                hashtags:[]}
           
            setSuggestions((prevState)=>[...new Set([...prevState,...obj.suggestions])])

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
      const dispatch = useDispatch()
      const handleDialogOpen=(chosenEvent)=>{
        sendGAEvent("Looked at Event", `Chose to look at ${chosenEvent.summary} `+searchTerm, searchTerm);
   
        let dia = {...dialog}
        dia.isOpen = true
        dia.disagreeText= "Close"
       
        dia.title =chosenEvent.summary
      dia.text=<div className="text-left text-emerald-800">
        <span>{chosenEvent.location}</span>
    <span dangerouslySetInnerHTML={{__html:"<div>"+chosenEvent.description+"</div>"}} /></div>
        dia.onClose = ()=>{
          dispatch(setDialog({isOpen:false}))
        }
        dia.agreeText = "Organizer"
        dia.agree =chosenEvent&&chosenEvent.organizerLink?()=>{
       
          chosenEvent?window.location.href=chosenEvent.organizerLink:null
      }:null
        dispatch(setDialog(dia))
    }

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
        <div id="cal-embed" className="max-w-[40rem]  mx-auto">
        <div className={`flex  mx-auto text-left ${isPhone?"flex-col":`flex-row`}`}>
        <span className="flex flex-row"> 
            <h2 className="my-auto mont-medium mx-2 text-emerald-700">Filter by Area:</h2>

        <select
          className="border w-fit  text-emerald-700 h-[3rem] rounded-lg bg-transparent px-2 text-l"
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
      <span className={`flex flex-col mt-4 w-full text-left min-w-30`}>
          <IonText className="my-auto mx-4 text-emerald-800"> Search</IonText>
          <div ref={searchRef} className="relative w-[90vw] mx-auto">

<IonInput
  type="text"
  className="rounded-lg bg-emerald1-100 text-[0.8rem] text-emerald-800"
  value={searchTerm}

         
  onIonInput={handleSearchInputChange}
  onIonFocus={() => setShowSuggestions(true)}
  placeholder="#writing, #workshop...)"
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

        <IonList className='flex  flex-col'>
            
                
                {events&&events.length?events.map((event,i)=>{
                        
                  let eId= event.googleLink.split("?eid=")[0]
                      return(
                      <IonItem key={i} 
                    
                      
                         className=" 
                          border-emerald-600 border  rounded-[50px]  shadow-md min-h-42 my-1  py-4  "
                     >
                      <div className={`flex
                      flex-row justify-between  px-6    `}>
                       {/* // */}
                     <span onClick={()=>{
                   
                   handleDialogOpen(event)
                 }} className=" flex-col text-left flex"
                     >
                   
                     <span    className="mr-2 max-w-[15rem] text-overflow-ellipsis overflow-clip">{isPhone?event.shortSummary:event.summary}</span>     
                     {event.organizerLink&&isValidUrl(event.googleLink)? 
                       <span   onClick={()=>{
                        sendGAEvent("Click",`Navigate by event name ${event.summary},${JSON.stringify(event.hashtags)}`,event.summary,"",false)
                        window.open(event.googleLink)
            
                            }} className="flex flex-col"> 
          
                             <a className="text-green-600 overflow-clip text-overflow-ellipsis whitespace-nowrap no-underline max-w-[15rem] my-auto" >
                              <IonText>{event.location}</IonText></a></span>:<h6 className=" whitespace-nowrap no-underline max-w-[20em]">{event.location}</h6>}
                          
                          
              
                          {event.area==areas[2]&&event.googleLink?<a 
                       ><h6 className="text-green-600 text-[0.6rem] flex flex-row"><span>{event.area}</span></h6></a> :<span className="text-slate-600 text-sm">{event.area}</span>}
                      <h5 className="text-[0.7rem] min-h-6">{event.hashtags.slice(0,4).join(" ")}</h5>
                       </span>
                     {/*  */}
                           <span className="flex flex-row justify-between min-w-20 w-20 ml-3">
                         
                            <h5 className="my-auto text-[0.8rem] w-[2.6rem] text-emerald-800 "><div dangerouslySetInnerHTML={{__html:event.startTime}}/></h5>
              <IonImg onClick={()=>{
                        sendGAEvent("Click",`Navigate by event name ${event.summary},${JSON.stringify(event.hashtags)}`,event.summary,"",false)
                        window.open(event.googleLink)
            
                            }} className="w-12 h-12  my-auto" src={calendar} /></span>
                            </div>
                            </IonItem>)
                      
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
 