

class HashtagComment{
    id
    hashtag_id
    comment_id
    created
    constructor(id,hashtag_id,comment_id,created){
        this.id = id;
        this.hashtag_id=hashtag_id;
        this.comment_id=comment_id;
        this.created = created;
    }
    static className="hashtag_comment"
}
export default HashtagComment