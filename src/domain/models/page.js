import { Timestamp } from "firebase/firestore";
import { ST } from "next/dist/shared/lib/utils";

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
    constructor(
        id,
        title,
        data,
        profileId,
        approvalScore=0,
        privacy,
        commentable,
        type,
        readers=[],
        writers=[],
        editors=[],
        commenters=[],
        created=Timestamp.now()
    ){
        super(id,title,readers,writers,editors,commenters)
        this.data = data
        this.title = title
        this.profileId = profileId
        this.approvalScore = approvalScore
        this.commentable = commentable
        this.privacy = privacy
        this.type = type
        this.created = created
    }
    static className(){
        "page"
    }
}

export {Story}
export default Page