import InfiniteScroll from "react-infinite-scroll-component"
import ProfileCircle from "./ProfileCircle"
export default function FollowerCard({followers=[]}){

 
    return(<InfiniteScroll
        className="  mx-auto mx-8" 
              dataLength={followers.length}
          
          >
                  {followers.map(follow=>{
                       return <div className="my-2 px-4 pt-3 pb-3 w-[100%] border-2 border-opacity-60   rounded-full border-emerald-600 "><ProfileCircle profile={follow.follower} color="emerald-700"/></div>
                  })}
          </InfiniteScroll>)
}