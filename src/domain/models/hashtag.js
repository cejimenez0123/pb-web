


class Hashtag{
    id
    name
    created
    popularityScore
    profileId
    constructor(id,name,profileId,popularityScore,created){
        this.id = id;
        this.name = name;
        this.profileId = profileId;
        this.popularityScore=popularityScore;
        this.created = created;
    }
    static className="hashtag"
}
export default Hashtag