import { useState } from "react"

import {
   
    Typography} from "@mui/material"
import authRepo from "../../data/authRepo"
    


const ForgotPasswordForm = ({close})=>{
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [error,setError]=useState(null)
    const [success,setSuccess]=useState(null)
    const [loading,setLoading]=useState(false)
    const handleClick=()=>{
        setLoading(true)
            authRepo.forgotPassword({username,email}).then(data=>{
                setError(null)   
setSuccess(data.message)
setLoading(false)

            }).catch(err=>{
                setLoading(false)
                if(err.message){
                    setSuccess(null)
                    setError(err.message)
                }

            })
    }
    return(<div className="border-lg p-8 lg:min-w-[30em]">
       
       <div className='fixed top-4 left-0 right-0 md:left-[20%] w-[96vw] mx-4 md:w-[60%]  z-50 mx-auto'>
             {error || success? <div role="alert" className={`alert    ${success?"alert-success":"alert-warning"} animate-fade-out`}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 shrink-0 stroke-current"
    fill="none"
    viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>{error?error:success}</span>
</div>:null}</div>
                   <div className="flex flex-col">
                         <Typography 
                    id="modal-modal-title" className="text-emerald-700" variant="h6" component="h2"
                    >
      Forgot Password
    </Typography>

<div className=" py-8 ">
<label  className="flex-row flex border-emerald-600 rounded-full border-1 px-4">
    <h6 className="my-auto text-l text-emerald-800 lora-medium">Email</h6>
<input  placeholder="email" className="input bg-transparent w-[100%] text-emerald-800" value={email} onChange={(e)=>setEmail(e.target.value.trim())}/>
</label>         
                        <a
                        onClick={handleClick}
                            className="my-8 bg-emerald-600 text-white flex rounded-full py-3"
                            variant='outlined'
                         >
                         <h6 className="mx-auto mont-medium my-auto">Sent</h6>
                        
                   </a>
                   {loading?<h6>Loading...</h6>:null}
                   </div>
                   </div>
    </div>)
}

export default ForgotPasswordForm