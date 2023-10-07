import { Timestamp } from "firebase/firestore"
export default class Role {
    id
    profileId
    role
    created
    constructor(
        id:string | undefined,
        profileId:string,
        role:string,
        created:Timestamp=Timestamp.now()
    ){
        this.id = id
        this.profileId = profileId 
        this.role = role
        this.created = created
    }

}