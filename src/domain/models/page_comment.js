import { Timestamp } from "firebase/firestore"

export default class PageComment{
    id
    text
    pageId
    profileId
    parentCommentId
    approvalScore
    created
     constructor(   id,
                    text, 
                    pageId, 
                    profileId,
                    parentCommentId,
                    approvalScore=0.0,
                    created=Timestamp.now(),)
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


