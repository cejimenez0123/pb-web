import { useMediaQuery } from "react-responsive"
//import {Dialog,DialogTitle,DialogActions,DialogContent} f/material"
import { useLayoutEffect, useState } from "react"
import Dialog from "../Dialog"

export default function FeedbackDialog({open,page,isFeedback,handleClose,handleChange,handlePostPublic,handleFeedback}){
    const isPhone =  useMediaQuery({
        query: '(max-width: 768px)'
      })
    const isHeightPhone = useMediaQuery({query:'(max-height: 366px)'})
 
    useLayoutEffect(()=>{
      if(page && page.description){

      handleChange(page.description)
    }},[])
    const [feedback,setFeedback]=useState(!page || isFeedback?"":page.description)
    return( <Dialog
        isOpen={open}
      
        onClose={handleClose}
  
        title={
        !isFeedback?"Add a description for context":"What kind of feedback do you want?"}
    
      text={  <div className={`${isHeightPhone?"":""}`}>
    {/* <DialogContent className="w-[100%]"> */}
    <div className={`${isHeightPhone?" mx-auto w-[80%]  ":""}`}> 
            <textarea 
            value={feedback}
            onChange={e=>{
                setFeedback(e.target.value)
                handleChange(e.target.value)
              }}
            className={`textarea mx-2 ${isHeightPhone?"w-[80vw]":"md:w-[30em]"} w-[96%]  min-h-[7rem] rounded-lg border-2 bg-transparent text-emerald-800 border-emerald-600`}/>
                   <div className="mt-8">
          <h2 className="mont-medium text-[1rem] text-emerald-700" onClick={handleClose}>Continue Working</h2>
             {isFeedback? <h2 className="mont-medium mx-1 text-[1rem] text-emerald-700" onClick={()=>handleFeedback()}>
     Get feedback
          </h2>:<h2 className="mont-medium text-[1rem]  text-emerald-700" onClick={()=>handlePostPublic()}>
  Publish
          </h2>}
        </div>
    {/* </DialogContent> */}
    </div>
    </div>
}/>)
}