import { Timestamp } from "firebase/firestore";

// interface Story {
//     id:string,
//     data:string,
//     created:Timestamp

// }
export default class Page {
    id
    title
    data
    profileId
    privacy
    type
    created
    constructor(
        id,
        title,
        data,
        profileId,
        privacy,
        type,
        created=Timestamp.now()
    ){
        this.id = id
        this.title = title
        this.data = data
        this.profileId = profileId
        this.privacy = privacy
        this.type = type
        this.created = created
    }
    }