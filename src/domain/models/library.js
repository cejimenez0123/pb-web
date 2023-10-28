import { Timestamp } from "firebase/firestore"
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
        id,
        name,
        profileId,
        purpose,
        pageIdList=[],
        bookIdList=[],
        writingIsOpen=false,
        privacy=false,
        readers=[],
        writers=[],
        editors=[],
        commenters=[],
        updatedAt=Timestamp.now(),
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
    itemHashInLibrary(hash){
        let p = this.pageIdList.find(id=>id == hash.item.id)
        let b = this.bookIdList.find(id=>id == hash.item.id)
        return !!p && !!b
    }
}
    // typeof HashItem = {
    //     type:string,
    //     item:Story
    // }