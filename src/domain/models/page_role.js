import Role from "./role"
import { Timestamp } from "firebase/firestore"


export default class PageRole extends Role{
    pageId
    constructor(
        id,
        profile,
        pageId,
        role,
        created=Timestamp.now()
    ){
        super(id, profile, role, created)
       
        this.pageId = pageId
      
    }
    static type="page"
    
    }