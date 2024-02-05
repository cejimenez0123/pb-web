import { Timestamp } from "firebase/firestore";


export  default class FollowLibrary{
    id
    profileId
    libraryId
    created
    constructor(id,
                profileId,
                libraryId,
                created=Timestamp.now()) {
                    this.id=id
                    this.profileId=profileId
                    this.created=created
                    this.libraryId=libraryId
        
    }
    static className = "follow_library"
}