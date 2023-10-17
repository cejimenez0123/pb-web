
import { Timestamp } from "firebase/firestore";
import {Story} from "./page"
import Collection from "./collection";

export default class Book extends Story{
    purpose
    profileId
    pageIdList
    updatedAt
    privacy
    writingIsOpen
    created
    constructor(
        id: string,
        purpose:string,
        title:string,
        profileId: string,
        pageIdList:[string],
        privacy: boolean,
        writingIsOpen: boolean,
        
        writers:string[]= new Array<string>(),
        readers:string[],
        commenters:string[],
        editors:string[],
        updatedAt: Timestamp = Timestamp.now(),
        created=Timestamp.now()
    ){

        super(id,title,readers,writers,editors,commenters)
        this.purpose = purpose
        this.title = title
        this.pageIdList = pageIdList
        this.profileId = profileId
        this.updatedAt = updatedAt
        this.writingIsOpen = writingIsOpen
        this.privacy = privacy
        this.created = created
    }
    static className = "book"
    }
