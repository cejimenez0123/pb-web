import { Timestamp } from "firebase/firestore";
import { ST } from "next/dist/shared/lib/utils";

class Story {
    id
    title

    constructor(id,title){
        this.id = id
        this.title = title
       
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
        type,
        created=Timestamp.now()
    ){
        super(id,title,data)
        this.data = data
        this.title = title
        this.profileId = profileId
        this.approvalScore = approvalScore
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