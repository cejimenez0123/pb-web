

import { useEffect, useState } from "react";
import { debounce } from "lodash";
import validateEmail from "../core/validateEmail";
import authRepo from "../data/authRepo";
import ReactGA from "react-ga4"
import events from "../images/icons/event.svg"
import { Dialog,DialogTitle,DialogContent,DialogActions,Button } from "@mui/material";
import Enviroment from "../core/Enviroment";
import { Helmet } from 'react-helmet-async';
import Paths from "../core/paths";
export default function CalendarContainer(){
    useEffect(()=>{
        ReactGA.event({
            category: "Calendar",
            action: "Page View Calendar",
            label:"Page View Calendar",
          
            nonInteraction: false
          });
     
    },[])
return(<div>
    <div className="mx-auto m-4 w-fit text-center">
        <h1 className="lora-bold text-emerald-800 text-opacity-70 mb-4">Plumbum Calendar</h1>
    <CalendarEmbed/>
    <SubmitEvent/>
    </div>
    </div>
)
}
const CalendarEmbed = () => {
    return (
      <div className="overflow-hidden rounded-lg shadow-lg mx-auto w-full max-w-[900px]">
        <iframe
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&mode=AGENDA&title=Plumbum%20NYC&src=Zjg4OTA0YzYzYTQ3ZGViODAyMTYyMGIwYjA1ZDIzYzIzYWFlNThhZDI2YWQxZWQ1NTU3Yzk5ZGNmY2QyYzIyNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Mzc1ODY3OGRkYWJmNDY3YTZjYzVhYTFiOWRlMTljMjYzNjRmMzljOWUzZWIzMGU1NmE0ODMyNDZjOTIyZGViZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZjU5Nzk3YmIwNTllMjczMzQ0OWI3Y2RmYzNhMDY3ZTcwYjNjMTEyZTIwZGQ3OGQ4Mjc3ZDJlNjMxZDM5ZThjOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=YWY0ZGEwNDk1MzUxMjI1N2NlYzhlYWNlYjljMWNmMTk2MTMwM2IwZjk1MjljMTExNTUyNmJiMjRiYTY2MTg0NEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%234285F4&color=%23F09300&color=%2333B679&color=%23E4C441&color=%230B8043" 
              className="w-full h-[600px]"
          width={"100%"}
          
        ></iframe>
      </div>
    );
  };

  function SubmitEvent(){
const [email,setEmail]=useState("")
    const [preferredName,setPreferredName]=useState("")
    const [subject,setSubject]=useState("")
    const [location,setLocation]=useState("uptown")
    const [message,setMessage]=useState("")
    const [open,setOpen]=useState(false)
    const handleFeedback=debounce((e)=>{
        e.preventDefault()

        try{
        authRepo.feedback({preferredName,email,subject:location+" "+subject,purpose:"Event Submission",message:message}).then(data=>{
                
               setOpen(data.message && data.message=="Success")
            })
        }catch(err){
            console.log(err)
        }
    },10)
    let input="input w-[80%] rounded-full open-sans-medium bg-transparent text-emerald-800 mx-3"
    return(<div>
               <Helmet>
               <title>Plumbum Calendar -FOR NYC WRITERS</title>
<meta name="title" content="Plumbum Calendar -FOR NYC WRITERS" />


<meta property="og:type" content="website" />
<meta property="og:title" content="Plumbum Calendar" />
      <meta property="og:description" content="An event calendar for the events a budding writer needs for inspiration." />
      <meta property="og:image" content={events}/>
      <meta property="og:url" content={Enviroment.domain+Paths.calendar()} />

<meta property="twitter:card" content={events}/>
<meta property="twitter:url" content={Enviroment.domain+Paths.calendar()}  />
<meta property="twitter:title" content="Plumbum Calendar-Events for Writers" />
<meta property="twitter:description" content="An event calendar for the events a budding writer needs for inspiration." />
<meta property="twitter:image" content={events}/>


        </Helmet>
    
        <form className="my-8 mx-2">
        <div className="card lg:max-w-[40rem] mx-auto lg:p-8">

<h2 className="mx-auto lora-bold text-[1.5rem] mb-8 text-emerald-800">Submit an Event</h2>
<label className="border border-2 flex-row flex rounded-full text-l w-24 mont-medium text-emerald-800 border-emerald-800 mb-4 px-4"> 
 <span className="my-auto">Name:</span>
<input value={preferredName}onChange={(e) => setPreferredName(e.target.value)} type="text" className={input}/></label>
<label className="border border-2 lex-row flex rounded-full text-l mont-medium text-emerald-800 border-emerald-800 mb-4 px-4"> 
 <span className="my-auto">Email:</span>
<input value={email}onChange={(e) => setEmail(e.target.value)} type="text" className={input}/></label>
<label className="border border-2 rounded-full mont-medium text-l text-emerald-800 border-emerald-800 mb-4 px-4"> Locale:
<select
value={location}

onChange={(e) => setLocation(e.target.value)}
className="w-[80%] bg-transparent rounded-full text-l select text-emerald-800 mont-medium ">
    <option value={"uptown"}>Uptown</option>
    <option value={"downtown"}>Downtown</option>
    <option value={"queens"}>Queens</option>
    <option value={"virtual"}>Virtual</option>
</select></label>
<label 
value={subject}

onChange={(e) => setSubject(e.target.value)} className="border flex-row flex border-2 mont-medium rounded-full border-emerald-800 text-l mb-4 text-emerald-800 px-4">
   <span className="my-auto">Event Name:</span>
<input type="text" value={subject} className={input}/></label>
<label className="text-[1.3rem] text-left open-sans-medium text-emerald-800 mont-medium">Message:</label>
<textarea value={message} onChange={(e) => setMessage(e.target.value)}
placeholder="Event Link, Instagram, and introduce yourself. Say Hi!"
className="textarea bg-transparent mt-4 text-emerald-800 border-emerald-800 border-2" />
<span
onClick={validateEmail(email)?handleFeedback:()=>{}}
className={`btn mont-medium 

${validateEmail(email)?"bg-gradient-to-r from-emerald-400 to-emerald-600  ":"bg-gradient-to-r from-slate-400 to-emerald-600 "}
rounded-full border-none py-2 text-white my-12`}>
    <h2 className="text-2xl text-white">Send</h2></span>
        </div>
        </form>
        <Dialog
        
        open={open}
        onClose={()=>{
            setOpen(false)
        }}>
            <div className="card bg-emerald-50">
                <DialogTitle >
                        Message Sent Successfully
                </DialogTitle>
                <DialogContent> <p className="text-xl lora-medium">Thank you for sending us your event!
                <p>Best regards,</p>
                <p>Plumbum</p>
                </p>
                <DialogActions>
                    <Button onClick={()=>{
                        setOpen(false)
                    }}>Close</Button>
                </DialogActions>
    </DialogContent>
                       </div>
        </Dialog>
    </div>)
  }
  
  
    