import { useEffect, useState } from "react"

export default function Alert({error,success}){
    // const [err,setErr]=useState(error)
    // const [succ,setSucc]=useState(suc)
    return( error || success?       <div className='fixed top-4 left-0 right-0 md:left-[20%] w-[96vw] mx-4 md:w-[60%]  z-50 mx-auto'>
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
<span>{error?error:success}</span>
</div></div> :null)
}