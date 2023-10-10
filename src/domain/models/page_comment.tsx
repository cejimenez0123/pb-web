// val id: String = "",
// val text: String = "",
// val pageId: String = "",
// val profileId: String = "",
// val parentCommentId:String="",
// var approvalScore:Double=0.0,
// @ServerTimestamp
// val created: Timestamp = Timestamp.now()

import { Timestamp } from "firebase/firestore"

export default class PageComment{
    id:string
    text: string
    pageId:string
    profileId:string
    parentCommentId:string|undefined
    approvalScore:number
    created:Timestamp
     constructor(   id:string,
                    text:string, 
                    pageId:string, 
                    profileId:string,
                    parentCommentId:string,
                    approvalScore:number=0.0,
                    created:Timestamp=Timestamp.now(),)
                    {
                        this.id = id;
                        this.text = text;
                        this.pageId = pageId;
                        this.profileId = profileId;
                        this.parentCommentId = parentCommentId;
                        this.approvalScore = approvalScore
                        this.created = created

     }
     static className = "comment"
}


