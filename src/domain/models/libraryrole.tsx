import Role from "./role"
import { Timestamp } from "firebase/firestore"
import Profile from "./profile"

export default class LibraryRole extends Role{
    libraryId
    constructor(
        id:string | undefined,
        profile:Profile,
        libraryId:string,
        role:string,
        created:Timestamp=Timestamp.now()
    ){
        super(id, profile, role, created)
       
        this.libraryId = libraryId
      
    }
    static type="library"
    
    }