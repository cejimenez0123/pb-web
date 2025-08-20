import { useEffect, useState } from "react";
import { useParams, useSearchParams,useLocation, useNavigate } from "react-router-dom";
import authRepo from "../../data/authRepo";
import Paths from "../../core/paths";
import { IonContent } from "@ionic/react";




function ResetPasswordContainer(props){
   const location = useLocation()
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const query = new URLSearchParams(location.search);
    const [error,setError]=useState(null)
    const params = useParams()
  const navigate=useNavigate()
    useEffect(()=>{
       
    },[]) 
    const handleSubmit = ()=>{
        if(confirmPassword==password){
            if(password.length>6){
            const token = query.get("token")
        authRepo.resetPassword({password,token}).then(data=>{

            if(data.profile){
                navigate(Paths.login())
            }else if(data.error){
                setError(data.error.message)
            }else{
                setError("error updating password")
            }
        })
    }else{
        setError("Password to short 6 character minimum")
    }
    }
    }
    return(<IonContent fullscreen={true} className="flex">
                  <div className='fixed top-4 left-0 right-0 md:left-[20%] w-[96vw] mx-4 md:w-[60%]  z-50 mx-auto'>
         {error? <div role="alert" className={`alert    ${"alert-warning"} animate-fade-out`}>{error}</div>:null}
         </div> 
        <div className="mx-auto my-12 w-fit h-fit ">
       <p className="text-emerald-800 lora-medium ">Reset Password</p> 
            <div className="flex flex-col max-w-[96vw] lg:w-[20em] mx-auto">
            <label className=" border-emerald-700 rounded-full px-3 flex flex-row lg:w-1/2 text-emerald-800 border-2">
          
    <h6 className="my-auto">Password</h6> 
            <input type="password" 
             className="input bg-transparent w-[100%]" value={password} onChange={e=>setPassword(e.target.value.trim())} placeholder="password"/>  
            </label>
            <label className=" my-8 border-emerald-700 rounded-full px-3 flex flex-row  text-emerald-800 border-2">
          
          <h6 className="my-auto" >Confirm</h6> 
            <input type="password" 
             className="input bg-transparent w-[100%]" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value.trim())} placeholder="password"/>  
           </label>
           {confirmPassword!=password?<div className="text-orange-500 open-sans-medium">Password are not the same</div>:null}
             
          <a  className="bg-emerald-800 rounded-full p-2 my-8"
          
          onClick={handleSubmit}> <h6 className="text-white py-2 px-4">Reset Password</h6></a>
           </div>
           </div>
    </IonContent>)
}

export default ResetPasswordContainer