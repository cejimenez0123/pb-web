export default class Craft{
    id
    profileId
    readers
    writers
    editors
    commenters
    constructor(id,
        profileId,
        readers,
        writers,
        commenters,
        editors
    ){
        this.id = id
        this.profileId = profileId
        this.readers = readers 
        this.writers = writers
        this.commenters = commenters
        this.editors = editors
    }
    
    }