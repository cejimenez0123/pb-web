import { useLayoutEffect, useState } from "react"
export default function FeedbackDialog({page,isFeedback,handleChange,handlePostPublic,handleFeedback}){

 const [feedback,setFeedback]=useState(!page || isFeedback?"":page.description)
    useLayoutEffect(()=>{
      

      handleChange(feedback)
    },[feedback])
    // const {closeDialog}=useDialog()

    return<div className={`h-[100%]`}>

    {/* <div className={`${isHeightPhone?" mx-auto w-[80%]  ":""}`}>  */}
            <textarea 
            value={feedback}
            onChange={e=>{
                setFeedback(e.target.value)
                handleChange(e.target.value)
              }}
            className={`textarea mx-2 w-[96%] dark:text-cream min-h-[7rem] border-opacity-50 rounded-lg border-2 bg-transparent text-emerald-800 border-emerald-600`}/>
                   <div className="mt-8">
            <button onClick={()=>handlePostPublic(feedback)} className="btn btn-emerald btn-sm w-full">Post Publicly</button>
            </div>
             <div className="mt-4">
            <button onClick={()=>handleFeedback(feedback)} className="btn btn-emerald btn-sm w-full">Get Feedback</button>
        </div>
 
    {/* </div> */}
    </div> 
  }