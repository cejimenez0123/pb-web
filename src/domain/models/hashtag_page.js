class HashtagPage{
    id
    hashtagId
    pageId
    created
    constructor(id,hashtagId,pageId,created){
        this.id = id;
        this.hashtagId=hashtagId;
        this.pageId=pageId;
        this.created = created;
    }
    static className="hashtag_page"
}
export default HashtagPage