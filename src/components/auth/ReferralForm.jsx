import { useContext, useEffect,useLayoutEffect, useState } from "react"
import authRepo from "../../data/authRepo"
import Context from "../../context"
import close from "../../images/icons/clear.svg"
import loadingGif from "../../images/loading.gif"
import copyContent from "../../images/icons/content_copy.svg"
import Dialog from "../Dialog"
// import {DialogActions,Button} from "@mui/material"

export default function ReferralForm({onClose}){
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [referralLink,setReferralLink]=useState("")
    const [pending,setPending]=useState(false)
    const {setSuccess}=useContext(Context)
    const [message,setMessage]=useState("")
    const [referral,setReferral]=useState(null)
    useLayoutEffect(()=>{

        setPending(true)
        authRepo.generateReferral().then(data=>{
        
            if(data.referralLink){
            setReferralLink(data.referralLink)
            }
            if(data.message){
                setMessage(data.message)
            }
            // if(data.referral){
            //     setReferral(data.referral)
            // }
            setPending(false)
        })},[])
    const handleClick = ()=>{
        authRepo.referral({email:email.toLowerCase(),name}).then(data=>{
            if(data.message){
                alert(data.message)
                onClose()
            }
        })}
   
    const copyToClipboard=()=>{
        navigator.clipboard.writeText(referralLink)
        .then(() => {
       
            setSuccess('Link Copied to clipboard');
            setMessage("Link copied")
          })
          setTimeout(()=>{
            setMessage("")
          },2000)
    }
    return( 

    <div className="flex flex-col md:min-w-[30em] md:min-h-[40em] m-1 px-3 py-4">
        
<h1 className="mx-auto mont-bold text-emerald-800 mb-8 text-xl">Refer Someone Today</h1>

            {referral&&   referral.usageCount?<h2 className="text-emerald-800">{referral.usageCount}</h2>:null}
        {pending?<img src={loadingGif} className="icon"/>:referralLink.trim().length>0?
        <span className="flex mt-6"><input type="text" 
         value={referralLink} disabled className="bg-transparent w-[100%] border-2 border-emerald-800 py-2 px-4 rounded-full text-[0.8rem] md:text-l "/><img src={copyContent} onClick={copyToClipboard} className="icon"/></span>:<div className="icon"/>}
         <div className="text-center"><h6 className="mont-medium  mb-6 mx-8">{message}</h6></div>
          <h3 className="text-emerald-800 mont-medium text-xl  py-4 mt-3 mx-auto text-opacity-70">OR</h3>
          <label className="text-emerald-800 mx-4 text-lg mont-medium mt-3">
            Name
        </label>
        <input
          value={name} 
          onChange={(e)=>setName(e.target.value)}
        className='text-xl my-4 px-4 py-3 open-sans-medium text-[0.8rem] bg-transparent border-emerald-800 border-2 rounded-full rounded-full text-emerald-800  w-[100%]' type='text'/>
        <label className="text-emerald-800 text-lg mont-medium">
            Email of person
        </label>
        <input 
        value={email}
        onChange={(e)=>setEmail(e.target.value.toLocaleLowerCase().trim())}
        className='text-[0.8rem] my-4 rounded-full px-2 py-4 open-sans-medium bg-transparent border-2 border-emerald-800 text-emerald-800 w-[100%]' type='text'/>
        <div className=" rounded-full mont-medium  h-12 mx-auto  py-2 flex bg-gradient-to-r w-[20em] from-emerald-600 to-emerald-500 text-emerald-800 " onClick={handleClick}><h6 className="text-emerald-800 mx-auto text-lg mx-auto  py-3 text-white my-auto">Submit</h6></div>


     </div>
     

    )
}