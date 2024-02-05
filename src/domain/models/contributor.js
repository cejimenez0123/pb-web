


export default class Contributors {
    readers
    writers
    editors
    commenters
    constructor(commenters=[],readers=[],writers=[], editors=[]){
        this.commenters = commenters;
        this.readers = readers;
        this.writers = writers;
        this.editors = editors;
    }
}