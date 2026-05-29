// components/profile/RecommendedProfiles.jsx

import { useIonRouter } from "@ionic/react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchProfileRecommendations } from "../../actions/ProfileActions";
import ProfileCircle from "../profile/ProfileCircle";
import { useEffect } from "react";


function RecommendedProfiles({ profileId }) {
  const dispatch = useDispatch();
  const router = useIonRouter();
  const { recommendations=[],recommendationsStatus } = useSelector((state) => state.users);

  useEffect(() => {
    if (!profileId) return;
    dispatch(fetchProfileRecommendations({ profileId, limit: 10 }));
  }, [profileId, dispatch]);

  if (recommendationsStatus === "idle" || recommendationsStatus === "loading") {
    return (
      <div className="space-y-4 px-4 py-6 animate-pulse">
        <div className="h-3 w-28 bg-base-300 rounded skeleton" />
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[56px]">
              <div className="w-14 h-14 rounded-full bg-base-300 skeleton" />
              <div className="h-2 w-12 bg-base-200 rounded skeleton" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendationsStatus === "failed" || recommendations.length === 0) return null;

  return (
    <div className="space-y-4 px-4 py-6">
      <p className="text-xs text-gray-400 dark:text-cream/50 uppercase tracking-wide">
        Suggested for you
      </p>
      <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            onClick={() => router.push(Paths.profile.createRoute(rec.id))}
            className="flex flex-col items-center gap-2 min-w-[56px] cursor-pointer active:scale-95 transition"
          >
            <ProfileCircle profile={rec} includeUsername={false} size="large" />
            <span className="text-[0.65rem] text-gray-500 dark:text-cream/60 truncate w-14 text-center">
              @{rec.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendedProfiles;