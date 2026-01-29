import { useContext, useLayoutEffect, useState } from "react"
import authRepo from "../data/authRepo"
import { debounce } from "lodash"
import validateEmail from "../core/validateEmail"
//import { Dialog, DialogActions, DialogContent, Button,DialogTitle } from "@mui/material"
import Context from "../context"
import { IonContent, IonText } from "@ionic/react"
import { useDialog } from "../domain/usecases/useDialog"

export default function FeedbackContainer(props){
    const {seo,setSeo}=useContext(Context)
    const [email,setEmail]=useState("")
    const [preferredName,setPreferredName]=useState("")
    const [subject,setSubject]=useState("")
    const [purpose,setPurpose]=useState("feedback")
    const [message,setMessage]=useState("")
    const [open,setOpen]=useState(false)
    const {dialog,openDialog} =useDialog()
    useLayoutEffect(()=>{
        let soo = seo
        soo.title= "Plumbum (Feedback) - Your Writing, Your Community"
        soo.description="Explore events, workshops, and writer meetups on Plumbum."
        setSeo(soo)
      
    },[])
    const openMessageSentDialog = (purpose) => {
       dispatch(setDialog({isOpen:false}))
        let dia = {...dialog}
        dia.isOpen = true;
        dia.title = "Message Sent Successfully";
        dia.text = (
          <div className="card bg-emerald-50 rounded-lg overflow-hidden">
            <IonHeader translucent={true}>
              <IonToolbar color="light">
                <IonTitle className="ion-text-center">
                  Message Sent Successfully
                </IonTitle>
              </IonToolbar>
            </IonHeader>
              <IonText className="text-xl lora-medium block text-center text-emerald-800">
                Thank you for sending us your {purpose.toLowerCase()}.<br />
                We will respond if it is relevant.
              </IonText>
              <div className="ion-text-center ion-margin-top">
                <IonText>Best regards,</IonText>
                <br />
                <IonText>Plumbum</IonText>
              </div>
            {/* </IonContent> */}
    
            <IonFooter className="ion-padding">
              <div
                className="bg-emerald-600 cursor-pointer rounded-full text-white text-center w-full py-2 mont-medium"
                onClick={() => dispatch(setDialog({ isOpen: false }))}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") dispatch(setDialog({ isOpen: false }));
                }}
              >
                <IonText>Close</IonText>
              </div>
            </IonFooter>
          </div>
        );
    
        dia.onClose = () => {
          dispatch(setDialog({ isOpen: false }));
        };
        dia.disagreeText = null;
        dia.agreeText = null;
        dia.agree = null;
    
        openDialog(dia)
      }
    const handleFeedback=debounce((e)=>{
        e.preventDefault()
          try{
        authRepo.feedback({preferredName,email,subject,purpose,message}).then(data=>{
                
            openMessageSentDialog()
            })
        }catch(err){
            console.log(err)
        }
    
    },10)
    let input="input w-[80%] rounded-full open-sans-medium bg-transparent text-emerald-800 mx-3"
    return(
      <IonContent fullscreen={true} className="ion-padding">
      <div>
    
        <form className="my-8 px-4">
        <div className="card sm:max-w-[40rem] mx-auto lg:p-8">

<h2 className="mx-auto lora-bold text-[2rem] mb-8 text-emerald-800">Feedback</h2>
<label className="border border-2 flex  rounded-full text-xl mont-medium text-emerald-800 border-emerald-800 mb-4 px-4"> 
 <span className="my-auto">Name:</span>
<input value={preferredName}onChange={(e) => setPreferredName(e.target.value)} type="text" className={input}/></label>
<label className="border border-2 rounded-full text-xl mont-medium text-emerald-800 border-emerald-800 mb-4 px-4"> 
 <span className="my-auto">Email:</span>
<input value={email}onChange={(e) => setEmail(e.target.value)} type="text" className={input}/></label>
<label className="border border-2 rounded-full mont-medium text-xl text-emerald-800 border-emerald-800 mb-4 px-4"> 
<span className="my-auto">Purpose:</span>
<select
value={purpose}

onChange={(e) => setPurpose(e.target.value)}
className="w-[80%] bg-transparent rounded-full text-l select text-emerald-800 mont-medium ">
    <option value={"feedback"}>Feedback</option>
    <option value={"bug"}>Issue/Bug</option>
    <option value={"request"}>Feature Request</option>
    <option value={"encouragement"}>Encouragement</option>
    <option value={"event"}>Collaboration/Media</option>
    <option value={"collab/media"}>Collaboration/Media</option>
</select></label>
<label 
value={subject}

onChange={(e) => setSubject(e.target.value)}className="border flex border-2 mont-medium rounded-full border-emerald-800 text-xl mb-4 text-emerald-800 px-4">
   <span className="my-auto">Subject:</span> 
<input type="text" value={subject} className={input}/></label>
<label className="text-l open-sans-medium text-emerald-800 mont-medium">Message:</label>
<textarea value={message} onChange={(e) => setMessage(e.target.value)}className="textarea bg-transparent mt-4 text-emerald-800 border-emerald-800 border-2" />
<span
onClick={validateEmail(email)?handleFeedback:()=>{}}
className={`btn mont-medium 

${validateEmail(email)?"bg-gradient-to-r from-emerald-400 to-emerald-600  ":"bg-gradient-to-r from-slate-400 to-emerald-600 "}
rounded-full border-none py-2 text-white my-12`}>
    <h2 className="text-2xl text-white">Send</h2></span>
        </div>
        </form>
  
  
    
  </div></IonContent>)
}