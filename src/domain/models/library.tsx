import { Timestamp } from "firebase/firestore"
import { Story } from "./page"
import Collection from "./collection"
export default class Library extends Collection {
    id
    name
    pageIdList
    bookIdList
    profileId
    purpose
    privacy
    writingIsOpen
    updatedAt
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
        readers:string[]=[],
        writers:string[]=[],
        editors:string[]=[],
        commenters:string[]=[],
        updatedAt:Timestamp,
        created=Timestamp.now()
    ){
        super(id,profileId,readers,writers,commenters,editors)
        this.id = id
        this.name=name
        this.pageIdList = pageIdList
        this.bookIdList = bookIdList
        this.writingIsOpen = writingIsOpen
        this.profileId = profileId
        this.privacy = privacy
        this.purpose = purpose
        this.updatedAt = updatedAt
        this.created = created
    }
    static className(){
        return "library"
    }
    itemHashInLibrary(hash:HashItem):Boolean{
        let p = this.pageIdList.find(id=>id == hash.item.id)
        let b = this.bookIdList.find(id=>id == hash.item.id)
        return !!p && !!b
    }
    }
    type HashItem = {
        type:string,
        item:Story
    }