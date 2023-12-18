


export default class UserApproval {
    id
    pageId
    profileId
    score
    constructor(id,pageId, profileId, score=2){
        this.id = id;
        this.pageId = pageId;
        this.profileId = profileId;
        this.score = score;
    }
    static className = "user_approval"
}