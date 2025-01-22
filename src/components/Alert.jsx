import { useContext, useEffect, useState } from "react"
import Context from "../context"

export default function Alert(){
    const {error,success,setSuccess,setError}=useContext(Context)
    useEffect(()=>{
        setTimeout(()=>{

        setError(null)
      setSuccess(null)
      
      
      },4001)},[error,success])
    return( error || success?       <div className='fixed top-4 left-0 right-0  w-[96vw] mx-4 md:w-[60%]  z-50 mx-auto'>
    <div role="alert" className={`alert    ${success?"alert-success":"alert-warning"} animate-fade-out`}>
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
<span>{error?err:success}</span>
</div></div> :null)
}