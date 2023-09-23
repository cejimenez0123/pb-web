
import { Timestamp } from "firebase/firestore";
import {Story} from "./page"
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
        updatedAt: Timestamp,
        created=Timestamp.now()
    ){

        super(id,title)
        this.purpose = purpose
        this.title = title
        this.pageIdList = pageIdList
        this.profileId = profileId
        this.updatedAt = updatedAt
        this.writingIsOpen = writingIsOpen
        this.privacy = privacy
        this.created = created
    }
    static className(){
        return "book"
    }
    }
