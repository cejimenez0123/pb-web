// data class BookRole(
//     val id: String = "",
//     val profileId: String = "",
//     val bookId: String = "",
//     val role: String = "",
//     @ServerTimestamp
//     val created: Timestamp = Timestamp.now()
// ):Parcelable

import { Timestamp } from "firebase/firestore"

export default class BookRole {
    id
    profileId
    bookId
    role
    created
    constructor(
        id:string | undefined,
        profileId:string,
        bookId:string,
        role:string,
        created:Timestamp=Timestamp.now()
    ){
        this.id = id
        this.profileId = profileId
        this.bookId = bookId
        this.role = role
        this.created = created
    }
    static className(){
        return "book_role"
    }
    
    }