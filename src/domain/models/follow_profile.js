import { Timestamp } from "firebase/firestore";

export  default class FollowProfile{
    id
    followerId
    followingId
    created

    constructor(id,
                followerId,
                followingId,
                created=Timestamp.now()) {
                    this.id=id
                    this.followerId=followerId
                    this.created=created
                    this.followingId=followingId
        
    }
    static className = "follow_profile"
}