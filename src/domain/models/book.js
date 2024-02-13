
import { Timestamp } from "firebase/firestore";
import {Story} from "./page"
import Contributors from "./contributor";

export default class Book extends Story{
    purpose
    profileId
    pageIdList
    updatedAt
    privacy
    writingIsOpen
    created
    constructor(
        id,
        purpose,
        title,
        profileId,
        pageIdList,
        privacy,
        writingIsOpen,
        contributors=new Contributors(),
        updatedAt=Timestamp.now(),
        created=Timestamp.now()
    ){

        super(id,title,profileId,"",
                contributors.readers,
                contributors.writers,
                contributors.editors,
                contributors.commenters)
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
