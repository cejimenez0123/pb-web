import { Timestamp } from "firebase/firestore"
import Craft from "./craft"
import Contributors from "./contributor"

export default class Library extends Craft {
    id
    name
    pageIdList
    bookIdList
    profileId
    contributors
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
        contributors= new Contributors(),
        updatedAt=Timestamp.now(),
        created=Timestamp.now()
    ){
        super(  id,
                profileId,
                contributors.readers,
                contributors.writers,
                contributors.commenters,
                contributors.editors)
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