import IndexItem from "../page/IndexItem"
import ProfileCircle from "./ProfileCircle"
import { IonList } from "@ionic/react"
export default function FollowerCard({followers=[]}){

 
    return(<IonList
        className="  mx-auto mx-8" 
              dataLength={followers.length}
          
          >
                  {followers.map((follow,i)=>{
                       return <IndexItem key={i}><div className="my-2 px-4 pt-3 pb-3 w-[100%] border-2 border-opacity-60   rounded-full border-emerald-600 "><ProfileCircle profile={follow.follower} color="emerald-700"/></div></IndexItem>
                  })}
          </IonList>)
}