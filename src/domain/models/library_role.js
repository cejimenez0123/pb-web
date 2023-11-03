import Role from "./role"
import { Timestamp } from "firebase/firestore"


export default class LibraryRole extends Role{
    libraryId
    constructor(
        id,
        profile,
        libraryId,
        role,
        created=Timestamp.now()
    ){
        super(id, profile, role, created)
       
        this.libraryId = libraryId
      
    }
    static type="library"
    
    }