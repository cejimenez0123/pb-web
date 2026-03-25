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


