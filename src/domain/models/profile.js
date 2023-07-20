import { Timestamp } from "firebase/firestore";

// interface Story {
//     id:string,
//     data:string,
//     created:Timestamp

// }
export default class Profile {
    id
    username
    profilePicture
    selfStatement
    homeLibraryId
    userId
    privacy
    created
    constructor(
        id,
        username,
        profilePicture,
        selfStatement,
        homeLibraryId,
        userId,
        privacy,
        created
    ){
        this.id = id
        this.username = username
        this.profilePicture = profilePicture
        this.selfStatement = selfStatement
        this.profileId = homeLibraryId
        this.userId = userId
        this.privacy = privacy
        this.created = created
    }
    }