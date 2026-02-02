
import ProfileCircle from "./ProfileCircle"
export default function FollowerCard({followers=[]}){
    if(!followers && !followers.length){
        return
    }
 
    return(<div className="flex flex-col justify-center">
                  {followers.map((follow,i)=>{
                    console.log(follow)
                       return <div className="my-2 bg-transparent px-4 pt-3 pb-3 bg-transparent w-[100%] border-2 border-opacity-60   rounded-full border-emerald-600 "><ProfileCircle profile={follow.follower} color="emerald-700"/></div>
                  })}
          </div>)
}