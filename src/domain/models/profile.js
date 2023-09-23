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
    bookmarkLibraryId
    homeLibraryId
    userId
    privacy
    created
    constructor(
        id,
        username,
        profilePicture,
        selfStatement,
        bookmarkLibraryId,
        homeLibraryId,
        userId,
        privacy,
        created= Timestamp.now()
    ){
        this.id = id
        this.username = username
        this.profilePicture = profilePicture
        this.selfStatement = selfStatement
        this.bookmarkLibraryId = bookmarkLibraryId
        this.profileId = homeLibraryId
        this.userId = userId
        this.privacy = privacy
        this.created = created
    }
    }