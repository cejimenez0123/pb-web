
import { Timestamp } from "firebase/firestore"
import Role from "./role"
export default class BookRole extends Role {
    bookId
    constructor(
        id,
        profile,
        bookId,
        role,
        created=Timestamp.now()
    ){
        super(id,profile,role,created)
        this.bookId = bookId  
    }
    static type = "book"
    
    }