import { useContext, useEffect, useState } from "react"
import Context from "../context"

export default function Alert(){
    const {error,success,setSuccess,setError}=useContext(Context)
    useEffect(()=>{
        setTimeout(()=>{

        setError(null)
      setSuccess(null)
      
      
      },4001)},[error,success])
    return( error || success?       <div className='fixed top-4 left-0 right-0  w-[96vw]  mx-auto md:w-page z-50 mx-auto'>
    <div role="alert" className={`alert h-[6em]  w-[96vw]   md:w-page mx-auto ${success?"alert-success":"alert-warning"} animate-fade-out`}>
<div className="flex-row flex my-auto w-[100%]">
    {success?<svg
xmlns="http://www.w3.org/2000/svg"
className="max-h-6 max-w-6 shrink-0 my-auto stroke-current"
fill="none"
viewBox="0 0 24 24">
<path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth="2"
d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>:null}
<span className="my-auto  mx-4 whitespace-nowrap ">{error?error:success}</span></div>
<span/></div></div> :null)
}