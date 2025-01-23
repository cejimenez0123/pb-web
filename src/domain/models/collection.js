

class Collection{
    
    storyIdList
    childCollections
    profiles
    
    constructor(pages=[],cols=[],profile){
        this.storyIdList = pages
        this.childCollections = cols
        this.profile = profile
    }
}
export default Collection