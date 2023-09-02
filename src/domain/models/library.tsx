import { Timestamp } from "firebase/firestore"

export default class Library {
    id
    name
    pageIdList
    bookIdList
    profileId
    purpose
    privacy
    writingIsOpen
    created
    constructor(
        id:string,
        name:string,
        profileId:string,
        purpose:string,
        pageIdList=[String],
        bookIdList=[String],
        writingIsOpen:boolean=false,
        privacy:boolean=false,
        created=Timestamp.now()
    ){
        this.id = id
        this.name=name
        this.pageIdList = pageIdList
        this.bookIdList = bookIdList
        this.writingIsOpen = writingIsOpen
        this.profileId = profileId
        this.privacy = privacy
        this.purpose = purpose
        this.created = created
    }
    static className(){
        return "library"
    }
    }