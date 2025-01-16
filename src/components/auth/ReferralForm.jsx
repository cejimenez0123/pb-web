import { useState } from "react"
import authRepo from "../../data/authRepo"



export default function ReferralForm({onClose}){
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const handleClick = ()=>{
        authRepo.referral({email:email.toLowerCase(),name}).then(data=>{
            if(data.message){
                alert(data.message)
            }
        })}
    return(   <div className="bg-emerald-800  px-3 py-4">

          <label className="text-white open-sans-mediummt-3">
            Name
        </label>
        <input
          value={name} 
          onChange={(e)=>setName(e.target.value)}
        className='text-xl rounded-lg my-4 p-2 open-sans-medium bg-transparent border-white border text-white w-[100%]' type='text'/>
        <label className="text-white  open-sans-medium">
            Email of person
        </label>
        <input 
        value={email}
        onChange={(e)=>setEmail(e.target.value.toLocaleLowerCase().trim())}
        className='text-xl my-4 rounded-lg p-2 open-sans-medium bg-transparent border-white border text-white w-[100%]' type='text'/>
        <div className=" rounded-full mont-medium w-24 h-14 flex bg-green-400 text-white " onClick={handleClick}><h6 className="text-emerald-800 mx-auto my-auto">Submit</h6></div>
     </div>)
}