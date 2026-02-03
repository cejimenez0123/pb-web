import { useMediaQuery } from "react-responsive"
import { useLayoutEffect, useState } from "react"
import { IonModal,IonHeader,IonToolbar,IonButtons,IonBackButton,IonTitle, IonRow, IonContent } from "@ionic/react"
import { getFeedback } from "@sentry/react"
import { useDialog } from "../../domain/usecases/useDialog"
export default function FeedbackDialog({page,isFeedback,handleChange,handlePostPublic,handleFeedback}){
    const isHeightPhone = useMediaQuery({query:'(max-height: 366px)'})
 const [feedback,setFeedback]=useState(!page || isFeedback?"":page.description)
    useLayoutEffect(()=>{
      

      handleChange(feedback)
    },[feedback])
    const {closeDialog}=useDialog()

    return<div className={`${isHeightPhone?"":""}`}>

    <div className={`${isHeightPhone?" mx-auto w-[80%]  ":""}`}> 
            <textarea 
            value={feedback}
            onChange={e=>{
                setFeedback(e.target.value)
                handleChange(e.target.value)
              }}
            className={`textarea mx-2 w-[96%]  min-h-[7rem] border-opacity-50 rounded-lg border-2 bg-transparent text-emerald-800 border-emerald-600`}/>
                   <div className="mt-8">
                    <IonRow className="justify-between flex">
          <h2 className="mont-medium text-[1rem] text-emerald-700" onClick={()=>closeDialog()}>Continue Working</h2>
             {isFeedback? <h2 className="mont-medium mx-1 text-[1rem] text-emerald-700" onClick={()=>handleFeedback(page)}>
     Get feedback
          </h2>:<h2 className="mont-medium text-[1rem]  text-emerald-700" onClick={()=>handlePostPublic()}>
  Publish
          </h2>}
          </IonRow>
        </div>
 
    </div>
    </div> 
  }