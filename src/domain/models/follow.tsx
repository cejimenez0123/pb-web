import { Timestamp } from "firebase/firestore"

export default class Follow {
    id:string
    profileId:string
    created:Timestamp
    constructor(id:string, profileId:string, created:Timestamp=Timestamp.now()){
        this.id = id
        this.profileId = profileId
        this.created = created
    }
}