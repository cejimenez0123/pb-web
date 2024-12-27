import { Timestamp } from "firebase/firestore"

export default class Role {
    id
    profile
    role
    story
    created
    constructor(
        id,
        profile,
        story,
        role,
        created=Timestamp.now()
    ){
        this.id = id
        this.story=story
        this.profile = profile
        this.role = role
        this.created = created
    }
}