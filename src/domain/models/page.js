import { Timestamp } from "firebase/firestore";
import Contributors from "./contributor";

class Story {
    id
    title
    readers
    writers
    editors
    commenters
    constructor(id,title,readers,writers,editors,commenters){
        this.id = id
        this.title = title
        this.readers = readers
        this.writers = writers
        this.editors = editors
        this.commenters = commenters

    }
}
 class Page extends Story{
    data
    profileId
    approvalScore
    privacy
    type
    created
    ref
    constructor(
        id,
        title,
        data,
        profileId,
        approvalScore=0,
        privacy,
        commentable,
        type,
        contributors=new Contributors(),
        created=Timestamp.now(),
        ref
    ){
        super(id,title,contributors.readers,contributors.writers,contributors.editors,contributors.commenters)
        this.data = data
        this.title = title
        this.profileId = profileId
        this.approvalScore = approvalScore
        this.commentable = commentable
        this.privacy = privacy
        this.type = type
        this.created = created
        this.ref = ref
    }
    static className(){
        "page"
    }
}

export {Story}
export default Page