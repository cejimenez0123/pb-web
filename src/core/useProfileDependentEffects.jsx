
// import { Capacitor } from "@capacitor/core";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   getMyStories,
//   getPrompts,
// } from "../actions/StoryActions";

// import checkResult from "./checkResult";
// import { findWorkshopGroups } from "../actions/WorkshopActions";

// function useProfileDependentEffects(
//   currentProfile,
//   isGlobal,
//   promptTake
// ) {
//   const dispatch = useDispatch();
//   const isNative = Capacitor.isNativePlatform();

//   const profileId = currentProfile?.id;
//   const location = currentProfile?.location;

//   // Use stable location primitives rather than the entire profile object.
//   const locationKey =
//     typeof location === "string"
//       ? location
//       : [
//           location?.latitude ?? location?.lat ?? "",
//           location?.longitude ?? location?.lng ?? "",
//           location?.city ?? "",
//           location?.state ?? "",
//         ].join("|");

//   const recommendedStories = useSelector(
//     (state) => state.pages.recommendedStories
//   );

//   const [results, setResults] = useState({
//     workshops: [],
//     prompts: [],
//     location: null,
//   });

//   // Fetch prompts and stories when the profile changes.
//   useEffect(() => {
//     if (!profileId) return;

//     let active = true;

//     const fetchPrompts = async () => {
//       try {
//         const res = await dispatch(
//           getPrompts({ take: promptTake })
//         );

//         if (!active) return;

//         checkResult(
//           res,
//           (payload) => {
//             if (!active) return;

//             const sorted = [...(payload?.prompts || [])].sort(
//               (a, b) =>
//                 new Date(b.updated || 0) -
//                 new Date(a.updated || 0)
//             );

//             setResults((prev) => ({
//               ...prev,
//               prompts: sorted,
//             }));
//           },
//           () => {}
//         );
//       } catch (err) {
//         console.error("Failed fetching prompts:", err);
//       }
//     };

//     const fetchStories = async () => {
//       try {
//         await dispatch(getMyStories());
//       } catch (err) {
//         console.error("Failed fetching stories:", err);
//       }
//     };

//     fetchPrompts();
//     fetchStories();

//     return () => {
//       active = false;
//     };
//   }, [dispatch, profileId, promptTake]);

//   // Fetch workshops only when the profile/location or global setting changes.
//   useEffect(() => {
//     if (!profileId) return;

//     let active = true;

//     const fetchWorkshops = async () => {
//       try {
//         const res = await dispatch(
//           findWorkshopGroups({
//             location,
//             radius: 50,
//             global: isGlobal,
//           })
//         );

//         if (!active) return;

//         checkResult(
//           res,
//           (payload) => {
//             if (!active) return;

//             const sorted = [...(payload?.groups || [])].sort(
//               (a, b) =>
//                 new Date(b.updated || 0) -
//                 new Date(a.updated || 0)
//             );

//             setResults((prev) => ({
//               ...prev,
//               workshops: sorted,
//             }));
//           },
//           () => {}
//         );
//       } catch (err) {
//         console.error("Failed fetching workshops:", err);
//       }
//     };

//     fetchWorkshops();

//     return () => {
//       active = false;
//     };
//   }, [dispatch, profileId, locationKey, isGlobal]);

//   return {
//     ...results,
//     stories: recommendedStories || [],
//   };
// }

// export default useProfileDependentEffects;




import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchRecommendedStories, getPrompts } from "../actions/StoryActions";
import checkResult from "./checkResult";
import { findWorkshopGroups } from "../actions/WorkshopActions";
import requestLocation from "./requestLocation";
function useProfileDependentEffects(currentProfile, isGlobal) {
  const dispatch = useDispatch();
  const isNative = Capacitor.isNativePlatform();

  const [results, setResults] = useState({
    workshops: [],
    stories: [],
    prompts: [],
    location: null,
  });

  const fetchPrompts = async () => {
    try {
      const res = await dispatch(getPrompts());
      checkResult(res, ({ prompts }) => {
   
        const sorted = [...prompts].sort((a,b)=>new Date(b.updated)-new Date(a.updated));
        setResults(prev => ({ ...prev, prompts: sorted }));
      });
    } catch (err) { console.error("Failed fetching prompts:", err); }
  };
 
  const fetchStories = async () => {
    try {
      const res = await dispatch(fetchRecommendedStories());
      checkResult(res, ({ stories }) => setResults(prev => ({ ...prev, stories })));
    } catch (err) { console.error("Failed fetching stories:", err); }
  };

  const fetchWorkshops = async () => {
    if (!currentProfile) return;
    try {
      const res = await dispatch(findWorkshopGroups({
        location: currentProfile.location,
        radius: 50,
        global: isGlobal
      }));
      checkResult(res, (payload) => {
       
        const {groups}=payload
        const sorted = [...groups].sort((a,b)=>new Date(b.updated)-new Date(a.updated));
        setResults(prev => ({ ...prev, workshops: sorted || [] }));
      });
    } catch (err) { console.error("Failed fetching workshops:", err); }
  };

  const fetchLocation = () => {
    if (!isGlobal) return;
    if (isNative) requestLocation();
    else navigator.geolocation.getCurrentPosition(
      pos => setResults(prev => ({ ...prev, location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } })),
      err => console.error("Location error:", err)
    );
  };
  const fetches=()=>{
     fetchPrompts();
    fetchStories();
    fetchWorkshops();
    fetchLocation();
  }
  useEffect(() => {
        fetches()

  }, [currentProfile, isGlobal]);

  return results;
}
export default useProfileDependentEffects