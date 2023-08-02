import { Timestamp } from "firebase/firestore"

export default class Library {
    id
    name
    pageIds
    bookIds
    profileId
    purpose
    privacy
    writingIsOpen
    created
    constructor(
        id,
        name,
        pageIds=[String],
        bookIds=[String],
        writingIsOpen=false,
        privacy=false,
        profileId,
        purpose,
        created=Timestamp.now()
    ){
        this.id = id
        this.name=name
        this.pageIds = pageIds
        this.bookIds = bookIds
        this.writingIsOpen = writingIsOpen
        this.profileId = profileId
        this.privacy = privacy
        this.purpose = purpose
        this.created = created
    }
    }