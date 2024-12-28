
export default class CollectionToCollection{
    id
    index
    childCollection
    parentCollection
    profile


    constructor(id,index,childCollection,parentCollection,profile){
        this.id = id
        this.index = index
        this.childCollection = childCollection
        this.parentCollection = parentCollection
        this.profile = profile
    }

}