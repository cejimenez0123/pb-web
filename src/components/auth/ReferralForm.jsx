import { useState } from "react"
import authRepo from "../../data/authRepo"



export default function ReferralForm({onClose}){
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const handleClick = ()=>{
        authRepo.referral({email,name}).then(data=>{
            if(data.message){
                alert(data.message)
            }
        })}
    return(   <div>

          <label className="text-white mt-3">
            Name
        </label>
        <input
          value={name} 
          onChange={(e)=>setName(e.target.value)}
        className='text-xl rounded-lg my-4 p-2 bg-transparent border-white border text-white w-[100%]' type='text'/>
        <label className="text-white ">
            Email of person
        </label>
        <input 
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        className='text-xl my-4 rounded-lg p-2 bg-transparent border-white border text-white w-[100%]' type='text'/>
        <a className="btn p-2 mt-8 bg-red-100 text-white " onClick={handleClick}>Submit</a>
     </div>)
}