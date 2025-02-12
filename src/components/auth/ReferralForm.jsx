import { useContext, useState } from "react"
import authRepo from "../../data/authRepo"
import Context from "../../context"

import copyContent from "../../images/icons/content_copy.svg"


export default function ReferralForm({onClose}){
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [referralLink,setReferralLink]=useState("")
    const [pending,setPending]=useState(false)
    const {setSuccess}=useContext(Context)
    const handleClick = ()=>{
        authRepo.referral({email:email.toLowerCase(),name}).then(data=>{
            if(data.message){
                alert(data.message)
                onClose()
            }
        })}
    const generateReferral=()=>{
        authRepo.generateReferral().then(data=>{
          
            if(data.referralLink){
            setReferralLink(data.referralLink)
            }
        })}
    const copyToClipboard=()=>{
        navigator.clipboard.writeText(referralLink)
        .then(() => {
            onClose()
            setSuccess('Link Copied to clipboard');
      
          })
    }
    return(   <div className="flex flex-col md:min-w-[30em] md:min-h-[40em] m-1 px-3 py-4">
<h1 className="mx-auto lora-bold text-xl">Refer Someone Today</h1>
<span className="rounded-full btn flex text-center border-none text-lg mont-medium text-white px-4  bg-gradient-to-r 
from-emerald-400 to-emerald-600  "
onClick={generateReferral}>
    <h6 className="">Create Referral Link</h6></span>
    
        {pending?<img src={loadingGif} className="icon"/>:referralLink.trim().length>0?
        <span className="flex my-6"><input type="text" 
         value={referralLink} disabled className="bg-transparent border-2 border-emerald-800 py-4 px-4 rounded-full text-lg md:text-xl "/><img src={copyContent} onClick={copyToClipboard} className="icon"/></span>:<div className="icon"/>}
          <h3 className="text-emerald-800 mont-medium text-l  py-4 mt-3 mx-auto text-opacity-70">OR</h3>
          <label className="text-emerald-800 mx-4 text-lg mont-medium mt-3">
            Name
        </label>
        <input
          value={name} 
          onChange={(e)=>setName(e.target.value)}
        className='text-xl my-4 px-4 py-4 open-sans-medium bg-transparent border-emerald-800 border-2 rounded-full rounded-full text-emerald-800  w-[100%]' type='text'/>
        <label className="text-emerald-800 text-lg mont-medium">
            Email of person
        </label>
        <input 
        value={email}
        onChange={(e)=>setEmail(e.target.value.toLocaleLowerCase().trim())}
        className='text-xl my-4 rounded-full px-2 py-4 open-sans-medium bg-transparent border-2 bordr-emerald-800 text-emerald-800 w-[100%]' type='text'/>
        <div className=" rounded-full mont-medium  h-12 mx-auto  py-2 flex bg-gradient-to-r md:w-[20em] from-emerald-600 to-emerald-500 text-emerald-800 " onClick={handleClick}><h6 className="text-emerald-800 mx-auto text-xl mx-auto  py-4 text-white my-auto">Submit</h6></div>
     
     </div>)
}