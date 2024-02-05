import { Timestamp } from "firebase/firestore";

export default class FollowBook{
    id
    bookId
    profileId
    created
    constructor(id,
                bookId,
                profileId,
                created=Timestamp.now()){
                    this.id = id;
                    this.bookId=bookId;
                    this.profileId = profileId;
                    this.created = created;
    }
    static className  = 'follow_book'
}