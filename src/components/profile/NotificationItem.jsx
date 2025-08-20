import { useNavigate } from "react-router-dom";
import ProfileCircle from "./ProfileCircle";
import Paths from "../../core/paths";
import getTimePast from "../../core/getTimePassed";
import Enviroment from "../../core/Enviroment";
export default function NotificationItem({ item, lastNotified }) {
  const navigate = useNavigate();

  // Render a separator for older notifications
  if (item === Enviroment.blankPage) {
    return (
      <div>
        <p className="lora-bold text-emerald-800 text-opacity-60">
          Older than today
        </p>
      </div>
    );
  }

  // Common container classes for every notification item
  const containerClasses =
    "border-emerald-600 border-t-2 md:my-2 max-h-[14rem] border-opacity-60 md:border-2 md:rounded-xl p-4 bg-white shadow flex flex-col justify-center";

  switch (item.type) {
    case "follower": {
      const follow = item.item;
      const profile = follow.follower;
      return (
        <div
          onClick={() => navigate(Paths.profile.createRoute(profile.id))}
          className={containerClasses}
        >
          <div className="flex flex-row items-center justify-between gap-4">
            <ProfileCircle profile={profile} color="emerald-700" />
            <span className="text-right text-sm text-emerald-700">
              {getTimePast(follow.created)}
            </span>
          </div>
          <h5 className="open-sans-medium mt-2 text-[0.93rem] text-emerald-800">
            New Follower: <span className="font-semibold">{profile.username}</span>
          </h5>
        </div>
      );
    }
    case "collection": {
      const collection = item.collection;
      let latestCol = [...collection.childCollections].sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      )

      let latestStory = [...collection.storyIdList].sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      )

      let latest = "New Collection";
      if (latestCol && latestStory && latestCol.created > latestStory.created) {
        latest = "New Addition: " + latestCol.childCollection.title;
      } else if (latestStory && !latestCol) {
        latest = "New Story: " + latestStory.story.title;
      } else if (!latestStory && latestCol) {
        latest = "New Collection: " + latestCol.childCollection.title;
      }

      return (
        <div
          onClick={() => navigate(Paths.collection.createRoute(collection.id))}
          className={containerClasses}
        >
          <div className="flex flex-row items-center justify-between gap-4">
            <ProfileCircle profile={collection.profile} color="emerald-700" />
            <span className="text-emerald-700 text-[0.78rem]">
              Published to <span className="font-semibold">{collection.title}</span>
            </span>
            <span className="text-right text-sm text-emerald-700">
              {getTimePast(collection.created)}
            </span>
          </div>
          <h5 className="open-sans-medium mt-2 text-[0.93rem] text-emerald-800">
            {latest}
          </h5>
        </div>
      );
    }
    case "story": {
      const story = item.item;
      return (
        <div
          onClick={() => navigate(Paths.page.createRoute(story.id))}
          className={containerClasses}
        >
          <div className="flex flex-row items-center justify-between gap-4">
            <ProfileCircle profile={item.profile} color="emerald-700" />
            <span className="text-emerald-700 text-[0.78rem]">
              {lastNotified < new Date(story.created) ? "New Story" : ""}
            </span>
            <span className="text-right text-sm text-emerald-700">
              {getTimePast(story.created)}
            </span>
          </div>
          <h5 className="open-sans-medium mt-2 text-[0.93rem] text-emerald-800 break-words">
            {story.title}
          </h5>
        </div>
      );
    }
    case "comment": {
      const comment = item.item;
      return (
        <div

          className={containerClasses + " break-words"}
        >
          <div className="flex flex-row items-center h-[5rem] justify-between gap-3">
            <div className="flex items-center ">
              <ProfileCircle profile={comment.profile} color="emerald-700" />
              <span className="text-emerald-700 ml-4 text-[0.75rem] open-sans-medium">
            <span className="font-semibold text-sm">{comment.story.title}</span>
              </span>
            </div>
            <span className="text-right text-sm text-emerald-700">
              {getTimePast(comment.created)}
            </span>
          </div>
          <div           onClick={() => navigate(Paths.page.createRoute(comment.story.id))} className="open-sans-medium mt-2 text-[0.93rem] h-[4rem] text-emerald-800 break-words overflow-hidden">
            {comment.content}
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}

// import { useNavigate } from "react-router-dom"
// import ProfileCircle from "./ProfileCircle"
// import Paths from "../../core/paths"
// import getTimePast from "../../core/getTimePassed"
// export default function NotificationItem({item,lastNotified}){
//     const navigate = useNavigate()
//     if(item==Enviroment.blankPage){
//         return<div><p className="lora-bold text-emerald-800 text-opacity-60">Older than today</p></div>
//     }
//     switch(item.type){
//         case "follower":{
       
//             const follow = item.item
//             const profile = follow.follower
//             return(<div onClick={()=>navigate(Paths.profile.createRoute(profile.id))}className="border-emerald-600 border-t-2 md:my-2  min-h-[8rem] max-h-[10rem] border-opacity-60 md:border-2 md:rounded-full p-2">
//             <div className="md:px-12" ><span    className="flex justify-between flex-row ">
        
//             <ProfileCircle profile={profile} color="emerald-700"/>
           
 
//             <h4 className="my-auto">{getTimePast(follow.created)}</h4>
//             </span>
//             <h5 className="open-sans-medium
//              my-2 text-[0.8rem] px-2 text-emerald-800">New Follower {profile.username}</h5>
      
//             </div></div>)
//         }
//         case "collection":{
           
//         const collection = item.collection
//         let latestCol = collection.childCollections.sort((a,b)=>new Date(a.created)-new Date(b.created))[0]
//         let latestStory = collection.storyIdList.sort((a,b)=>new Date(a.created)-new Date(b.created))[0]
//         let latest = "New Collection"
//         if(latestCol && latestStory && latestCol.created>latestStory.created){
//             latest = "New Addition "+latestCol.childCollection.title
//         }else if(latestStory && !latestCol){
          
//                 latest = "New Story "+latestStory.story.title
      
//         }else if(!latestStory && latestCol){

//             latest = "New Collection"+latestCol.childCollection.title
//         }
     
//             return(<div onClick={()=>navigate(Paths.collection.createRoute(collection.id))}className="border-emerald-600 border-t-2 md:my-2  min-h-[8rem] max-h-[10rem] border-opacity-60 md:border-2 md:rounded-full p-2">
//             <div className="md:px-12" ><span    className="flex justify-between flex-row ">
        
//             <ProfileCircle profile={collection.profile} color="emerald-700"/>
//             <h4 className="text-emerald-700 mx-4 my-2 text-[0.7rem] open-sans-medium">Published to {collection.title}</h4>
 
//             <h4 className="my-auto">{getTimePast(collection.created)}</h4>
//             </span>
//             <h5 className="open-sans-medium
//              my-2 text-[0.8rem] px-2 text-emerald-800">{latest}</h5>
//             </div></div>)
//         }
//         case "story":{
//             const story = item.item
//             return(<div onClick={()=>navigate(Paths.page.createRoute(story.id))}className="border-emerald-600 border-t-2 md:my-2  min-h-[8rem] max-h-[10rem]   border-opacity-60 md:border-2 md:rounded-full p-2">
//             <div className="md:px-12" ><span    className="flex justify-between flex-row ">
        
//             <ProfileCircle profile={item.profile} color="emerald-700"/>
//             <h4 className="text-emerald-700 mx-4 my-2 text-[0.7rem] open-sans-medium">{lastNotified<new Date(story.created)?"New Story":null}</h4>
 
//             <h4 className="my-auto">{getTimePast(story.created)}</h4>
//             </span>
//             <h5 className="open-sans-medium my-2 text-[0.8rem] px-2 text-emerald-800">{story.title}</h5>
//             </div></div>)
//         }
//         case "comment":{
//             const comment = item.item
        
//             return(<div onClick={()=>navigate(Paths.page.createRoute(comment.story.id))}
//             className="border-emerald-600  max-h-[8rem] border-t-2 md:my-2  overflow-hidden border-opacity-60 md:border-2 md:rounded-full p-4">
//             <div className="px-6" ><span    className="flex flex-row justify-between"><span
//             className="flex flex-row ">
//             <ProfileCircle profile={comment.profile} color="emerald-700"/>
//             <h4 className="text-emerald-700 mx-4 my-2 text-[0.7rem] md:max-w-[12em] text-nowrap text-ellipsis my-auto open-sans-medium">Commented on {comment.story.title}</h4></span>
//             <h4 className="my-auto">{getTimePast(comment.created)}</h4>
//             </span>
//             <h5 className="open-sans-medium my-2 px-2 text-[0.8rem] text-emerald-800">{comment.content}</h5>
//             </div></div>)
//         }
//     }
// }
