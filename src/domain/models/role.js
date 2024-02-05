import { Timestamp } from "firebase/firestore"

export default class Role {
    id
    profile
    role
    created
    constructor(
        id,
        profile,
        role,
        created=Timestamp.now()
    ){
        this.id = id
        this.profile = profile
        this.role = role
        this.created = created
    }
}