
import { Timestamp } from "firebase/firestore"
import Role from "./role"
import Profile from "./profile"

export default class BookRole extends Role {

    bookId
    constructor(
        id:string | undefined,
        profile:Profile,
        bookId:string,
        role:string,
        created:Timestamp=Timestamp.now()
    ){
        super(id,profile,role,created)
        this.bookId = bookId
        
    
    }
    static type = "book"
    
    }