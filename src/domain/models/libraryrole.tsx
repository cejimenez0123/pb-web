import Role from "./role"
import { Timestamp } from "firebase/firestore"


export default class LibraryRole extends Role{
    libraryId
    constructor(
        id:string | undefined,
        profileId:string,
        libraryId:string,
        role:string,
        created:Timestamp=Timestamp.now()
    ){
        super(id, profileId, role, created)
       
        this.libraryId = libraryId
      
    }
    static className(){
        return "library_role"
    }
    
    }