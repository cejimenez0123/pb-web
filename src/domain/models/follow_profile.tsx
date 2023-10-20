import { Timestamp } from "firebase/firestore";

export  default class FollowProfile{
    id: string;
    followerId: string;
    followingId: string;
    created:Timestamp

    constructor(id:string,
                followerId:string,
                followingId:string,
                created:Timestamp=Timestamp.now()) {
                    this.id=id
                    this.followerId=followerId
                    this.created=created
                    this.followingId=followingId
        
    }
    public static className = "follow_profile"
}