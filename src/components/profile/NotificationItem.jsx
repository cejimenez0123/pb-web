import ProfileCircle from "./ProfileCircle";
import Paths from "../../core/paths";
import getTimePast from "../../core/getTimePassed";
import Enviroment from "../../core/Enviroment";
import { useIonRouter } from "@ionic/react";

export default function NotificationItem({ item, lastNotified }) {
  const router = useIonRouter();

  // Render separator for older notifications
  if (item === Enviroment.blankPage) {
    return (
      <div className="w-[100%] text-center py-2 text-emerald-800 text-opacity-60 font-bold">
        Older than today
      </div>
    );
  }

  // Base container classes for all notifications
  const containerClasses =
    "border-emerald-600 border-opacity-50 border-2 rounded-xl p-4 bg-white shadow flex flex-col justify-center w-[100%] max-w-[40rem] mx-auto cursor-pointer hover:bg-emerald-50 transition";

  const renderHeader = (profile, rightText) => (
    <div className="flex flex-row items-center justify-between gap-4 w-[100%]">
      <ProfileCircle profile={profile} color="emerald-700" />
      <span className="text-right text-sm text-emerald-700 truncate ml-2">
        {rightText}
      </span>
    </div>
  );

  const renderTitle = (title) => (
    <h5 className="open-sans-medium mt-2 text-[0.93rem] text-emerald-800 truncate">
      {title}
    </h5>
  );

  switch (item.type) {
    case "follower": {
      const profile = item.item.follower;
      return (
        <div
          onClick={() => router.push(Paths.profile.createRoute(profile.id))}
          className={containerClasses}
        >
          {renderHeader(profile, getTimePast(item.item.created))}
          {renderTitle(`New Follower: ${profile.username}`)}
        </div>
      );
    }
    case "collection": {
      const collection = item.collection;
      let latestCol = [...collection.childCollections].sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );
      let latestStory = [...collection.storyIdList].sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );
      let latest = "New Collection";
      if (latestCol.length && latestStory.length && latestCol[0].created > latestStory[0].created) {
        latest = "New Addition: " + latestCol[0].childCollection?.title;
      } else if (latestStory.length && !latestCol.length) {
        latest = "New Story: " + latestStory[0].story?.title;
      } else if (!latestStory.length && latestCol.length) {
        latest = "New Collection: " + latestCol[0].childCollection?.title;
      }

      return (
        <div
          onClick={() => router.push(Paths.collection.createRoute(collection.id))}
          className={containerClasses}
        >
          {renderHeader(collection.profile, `Published to ${collection?.title}`)}
          {renderTitle(latest)}
        </div>
      );
    }
    case "story": {
      const story = item.item;
      return (
        <div
          onClick={() => router.push(Paths.page.createRoute(story.id))}
          className={containerClasses}
        >
          {renderHeader(item.profile, lastNotified < new Date(story.created) ? "New Story" : "")}
          {renderTitle(story?.title)}
        </div>
      );
    }
    case "comment": {
      const comment = item.item;
      return (
        <div
          onClick={() => router.push(Paths.page.createRoute(comment.story.id))}
          className={containerClasses}
        >
          <div className="flex flex-row items-center justify-between gap-3 w-[100%]">
            <div className="flex items-center gap-2 truncate">
              <ProfileCircle profile={comment.profile} color="emerald-700" />
              <span className="text-emerald-700 text-[0.75rem] open-sans-medium truncate">
                <span className="font-semibold truncate">{comment.story.title}</span>
              </span>
            </div>
            <span className="text-right text-sm text-emerald-700 truncate">
              {getTimePast(comment.created)}
            </span>
          </div>
          <div className="open-sans-medium mt-2 text-[0.93rem] text-emerald-800 truncate overflow-hidden max-h-[4rem]">
            {comment.content}
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}
// import ProfileCircle from "./ProfileCircle";
// import Paths from "../../core/paths";
// import getTimePast from "../../core/getTimePassed";
// import Enviroment from "../../core/Enviroment";
// import { useIonRouter } from "@ionic/react";
// export default function NotificationItem({ item, lastNotified }) {
//   const router = useIonRouter()

//   // Render a separator for older notifications
//   if (item === Enviroment.blankPage) {
//     return (
//       <div>
//         <p className="lora-bold text-emerald-800 text-opacity-60">
//           Older than today
//         </p>
//       </div>
//     );
//   }

//   // Common container classes for every notification item
//   const containerClasses =
//     "border-emerald-600 border-2 my-1 md:my-2 max-h-[14rem] border-opacity-50 md:border-2 rounded-xl p-4 bg-white shadow flex flex-col justify-center";

//   switch (item.type) {
//     case "follower": {
//       const follow = item.item;
//       const profile = follow.follower;
//       return (
//         <div
//           onClick={() => router.push(Paths.profile.createRoute(profile.id))}
//           className={containerClasses}
//         >
//           <div className="flex flex-row items-center justify-between gap-4">
//             <ProfileCircle profile={profile} color="emerald-700" />
//             <span className="text-right text-sm text-emerald-700">
//               {getTimePast(follow.created)}
//             </span>
//           </div>
//           <h5 className="open-sans-medium mt-2 text-[0.93rem] text-emerald-800">
//             New Follower: <span className="font-semibold">{profile.username}</span>
//           </h5>
//         </div>
//       );
//     }
//     case "collection": {
//       const collection = item.collection;
//       let latestCol = [...collection.childCollections].sort(
//         (a, b) => new Date(b.created) - new Date(a.created)
//       )

//       let latestStory = [...collection.storyIdList].sort(
//         (a, b) => new Date(b.created) - new Date(a.created)
//       )

//       let latest = "New Collection";
//       if (latestCol && latestStory && latestCol.created > latestStory.created) {
//         latest = "New Addition: " + latestCol.childCollection?.title;
//       } else if (latestStory && !latestCol) {
//         latest = "New Story: " + latestStory.story?.title;
//       } else if (!latestStory && latestCol) {
//         latest = "New Collection: " + latestCol.childCollection?.title;
//       }

//       return (
//         <div
//           onClick={() => router.push(Paths.collection.createRoute(collection.id))}
//           className={containerClasses}
//         >
//           <div className="flex flex-row items-center justify-between gap-4">
//             <ProfileCircle profile={collection.profile} color="emerald-700" />
//             <span className="text-emerald-700 text-[0.78rem]">
//               Published to <span className="font-semibold">{collection?.title}</span>
//             </span>
//             <span className="text-right text-sm text-emerald-700">
//               {getTimePast(collection.created)}
//             </span>
//           </div>
//           <h5 className="open-sans-medium mt-2 text-[0.93rem] text-emerald-800">
//             {latest}
//           </h5>
//         </div>
//       );
//     }
//     case "story": {
//       const story = item.item;
//       return (
//         <div
//           onClick={() => router.push(Paths.page.createRoute(story.id))}
//           className={containerClasses}
//         >
//           <div className="flex flex-row items-center justify-between gap-4">
//             <ProfileCircle profile={item.profile} color="emerald-700" />
//             <span className="text-emerald-700 text-[0.78rem]">
//               {lastNotified < new Date(story.created) ? "New Story" : ""}
//             </span>
//             <span className="text-right text-sm text-emerald-700">
//               {getTimePast(story.created)}
//             </span>
//           </div>
//           <h5 className="open-sans-medium mt-2 text-[0.93rem] text-emerald-800 break-words">
//             {story?.title}
//           </h5>
//         </div>
//       );
//     }
//     case "comment": {
//       const comment = item.item;
//       return (
//         <div

//           className={containerClasses + " break-words"}
//         >
//           <div className="flex flex-row items-center h-[5rem] justify-between gap-3">
//             <div className="flex items-center ">
//               <ProfileCircle profile={comment.profile} color="emerald-700" />
//               <span className="text-emerald-700 ml-4 text-[0.75rem] open-sans-medium">
//             <span onClick={()=>router.push(comment.story.id)}className="font-semibold text-sm">{comment.story.title}</span>
//               </span>
//             </div>
//             <span className="text-right text-sm text-emerald-700">
//               {getTimePast(comment.created)}
//             </span>
//           </div>
//           <div           onClick={() => router.push(Paths.page.createRoute(comment.story.id))} className="open-sans-medium mt-2 text-[0.93rem] h-[4rem] text-emerald-800 break-words overflow-hidden">
//             {comment.content}
//           </div>
//         </div>
//       );
//     }
//     default:
//       return null;
//   }
// }

