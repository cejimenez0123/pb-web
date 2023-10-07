export default class Collection{
    id:string
    profileId:string
    readers:string[]
    writers:string[]
    editors:string[]
    commenters:string[]
    constructor(id:string,
        profileId: string,
        readers:string[],
        writers:string[],
        commenters:string[],
        editors:string[]
    ){
        this.id = id
        this.profileId = profileId
        this.readers = readers 
        this.writers = writers
        this.commenters = commenters
        this.editors = editors
    }
    
    }