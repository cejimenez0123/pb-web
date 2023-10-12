import { Timestamp } from "firebase/firestore"
import Profile from "./profile"
export default class Role {
    id
    profile
    role
    created
    constructor(
        id:string | undefined,
        profile:Profile,
        role:string,
        created:Timestamp=Timestamp.now()
    ){
        this.id = id
        this.profile = profile
        this.role = role
        this.created = created
    }

}