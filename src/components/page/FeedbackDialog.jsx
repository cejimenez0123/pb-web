import { useMediaQuery } from "react-responsive"
import {Dialog,DialogTitle,DialogActions,DialogContent} from "@mui/material"
import { useState } from "react"

export default function FeedbackDialog({page,string,open,handleClose,handleChange,handleFeedback}){
    const isPhone =  useMediaQuery({
        query: '(max-width: 600px)'
      })
    const [feedback,setFeedback]=useState("")
    return( <Dialog
        open={open}
        fullScreen={isPhone}
        onClose={handleClose}
        className=""
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >    <DialogTitle id="alert-dialog-title">
      {"What kind of feedback do you want?"}
    </DialogTitle>
    <DialogContent className="">
            <textarea 
            value={feedback}
            onChange={e=>{setFeedback(e.target.value)
                handleChange(e.target.value)}}
            className="textarea w-[100%] min-h-[7rem] rounded-lg border-2 bg-transparent text-emerald-800 border-emerald-600"/>
                   <DialogActions className="mt-8">
          <h2 className="mont-medium text-emerald-700" onClick={handleClose}>Continue Working</h2>
          <h2 className="mont-medium text-emerald-700" onClick={handleFeedback}>
           Get feedback
          </h2>
        </DialogActions>
    </DialogContent>
   
      </Dialog>)
}