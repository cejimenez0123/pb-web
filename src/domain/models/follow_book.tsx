import { Timestamp } from "firebase/firestore";

export default class FollowBook{
    id:string
    bookId: string;
    profileId:string
    created:Timestamp
    constructor(id:string,
                bookId:string,
                profileId:string,
                created:Timestamp=Timestamp.now()){
                    this.id = id;
                    this.bookId=bookId;
                    this.profileId = profileId;
                    this.created = created;
    }
    static className  = 'follow_book'
}