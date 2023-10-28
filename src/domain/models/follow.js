import { Timestamp } from "firebase/firestore"

export default class Follow {
    id
    profileId
    created
    constructor(id,
                profileId,
                created=Timestamp.now()){
        this.id = id
        this.profileId = profileId
        this.created = created
    }
}