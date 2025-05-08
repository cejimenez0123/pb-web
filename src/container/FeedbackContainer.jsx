import { useState } from "react"
import authRepo from "../data/authRepo"
import { debounce } from "lodash"
import validateEmail from "../core/validateEmail"
import { Dialog, DialogActions, DialogContent, Button,DialogTitle } from "@mui/material"

export default function FeedbackContainer(props){

    const [email,setEmail]=useState("")
    const [preferredName,setPreferredName]=useState("")
    const [subject,setSubject]=useState("")
    const [purpose,setPurpose]=useState("feedback")
    const [message,setMessage]=useState("")
    const [open,setOpen]=useState(false)
    const handleFeedback=debounce((e)=>{
        e.preventDefault()
          try{
        authRepo.feedback({preferredName,email,subject,purpose,message}).then(data=>{
                
               setOpen(data.message && data.message=="Success")
            })
        }catch(err){
            console.log(err)
        }
    },10)
    let input="input w-[80%] rounded-full open-sans-medium bg-transparent text-emerald-800 mx-3"
    return(<div>
        <form className="my-8">
        <div className="card lg:max-w-[40rem] mx-auto lg:p-8">

<h2 className="mx-auto lora-bold text-[2rem] mb-8 text-emerald-800">Feedback</h2>
<label className="border border-2 rounded-full text-xl mont-medium text-emerald-800 border-emerald-800 mb-4 px-4"> 
 Name:
<input value={preferredName}onChange={(e) => setPreferredName(e.target.value)} type="text" className={input}/></label>
<label className="border border-2 rounded-full text-xl mont-medium text-emerald-800 border-emerald-800 mb-4 px-4"> 
 Email:
<input value={email}onChange={(e) => setEmail(e.target.value)} type="text" className={input}/></label>
<label className="border border-2 rounded-full mont-medium text-xl text-emerald-800 border-emerald-800 mb-4 px-4"> Purpose:
<select
value={purpose}

onChange={(e) => setPurpose(e.target.value)}
className="w-[80%] bg-transparent rounded-full text-xl select text-emerald-800 mont-medium ">
    <option value={"feedback"}>Feedback</option>
    <option value={"bug"}>Issue/Bug</option>
    <option value={"request"}>Feature Request</option>
    <option value={"encouragement"}>Encouragement</option>
    <option value={"event"}>Collaboration/Media</option>
    <option value={"collab/media"}>Collaboration/Media</option>
</select></label>
<label 
value={subject}

onChange={(e) => setSubject(e.target.value)}className="border border-2 mont-medium rounded-full border-emerald-800 text-xl mb-4 text-emerald-800 px-4">
    Subject:
<input type="text" value={subject} className={input}/></label>
<label className="text-xl open-sans-medium text-emerald-800 mont-medium">Message:</label>
<textarea value={message} onChange={(e) => setMessage(e.target.value)}className="textarea bg-transparent mt-4 text-emerald-800 border-emerald-800 border-2" />
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
                <DialogContent> <p className="text-xl lora-medium">Thank you for sending us your {purpose.toLowerCase()}.
                We will respond if it is relavent.
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