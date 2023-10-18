import { Timestamp } from "firebase/firestore";


export  default class FollowLibrary{
    id: string;
    profileId: string;
    libraryId: string;
    created:Timestamp
    constructor(id:string,
                profileId:string,
                libraryId:string,
                created:Timestamp=Timestamp.now()) {
                    this.id=id
                    this.profileId=profileId
                    this.created=created
                    this.libraryId=libraryId
        
    }
    static className = "follow_library"
}