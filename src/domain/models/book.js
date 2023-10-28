
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
        id,
        purpose,
        title,
        profileId,
        pageIdList,
        privacy,
        writingIsOpen,
        writers= [],
        readers=[],
        commenters=[],
        editors=[],
        updatedAt=Timestamp.now(),
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
