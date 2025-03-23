import { useMediaQuery } from "react-responsive"
import {Dialog,DialogTitle,DialogActions,DialogContent} from "@mui/material"
import { useLayoutEffect, useState } from "react"

export default function FeedbackDialog({open,page,isFeedback,handleClose,handleChange,handlePostPublic,handleFeedback}){
    const isPhone =  useMediaQuery({
        query: '(max-width: 800px)'
      })
    const isHeightPhone = useMediaQuery({query:'(max-height: 366px)'})
    console.log(isHeightPhone)
    useLayoutEffect(()=>{
      if(page && page.description){

      handleChange(page.description)
    }},[])
    const [feedback,setFeedback]=useState(!page || isFeedback?"":page.description)
    return( <Dialog
        open={open}
        fullScreen={isPhone||isHeightPhone}
        onClose={handleClose}
        className="max-w-[100vw]"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >   <div className={`${isHeightPhone?"":""}`}> <DialogTitle id="alert-dialog-title">
      {!isFeedback?"Add a description for context":"What kind of feedback do you want?"}
    </DialogTitle>
    {/* <DialogContent className="w-[100%]"> */}
    <div className={`${isHeightPhone?" mx-auto w-[80%]  ":""}`}> 
            <textarea 
            value={feedback}
            onChange={e=>{
                setFeedback(e.target.value)
                handleChange(e.target.value)
              }}
            className={`textarea mx-2 ${isHeightPhone?"w-[80vw]":"md:w-[30em]"} w-[96%]  min-h-[7rem] rounded-lg border-2 bg-transparent text-emerald-800 border-emerald-600`}/>
                   <DialogActions className="mt-8">
          <h2 className="mont-medium text-[1rem] text-emerald-700" onClick={handleClose}>Continue Working</h2>
             {isFeedback? <h2 className="mont-medium mx-1 text-[1rem] text-emerald-700" onClick={()=>handleFeedback()}>
     Get feedback
          </h2>:<h2 className="mont-medium text-[1rem]  text-emerald-700" onClick={()=>handlePostPublic()}>
  Publish
          </h2>}
        </DialogActions>
    {/* </DialogContent> */}
    </div>
    </div>
      </Dialog>)
}