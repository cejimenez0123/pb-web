// import { Capacitor } from "@capacitor/core";
// import { useEffect, useState } from "react";
// import { useDispatch,useSelector } from "react-redux";
// import { fetchRecommendedStories, getPrompts } from "../actions/StoryActions";
// import checkResult from "./checkResult";
// import { findWorkshopGroups } from "../actions/WorkshopActions";
// import requestLocation from "./requestLocation";
// function useProfileDependentEffects(currentProfile, isGlobal,promptTake) {
//   const dispatch = useDispatch();
//   const isNative = Capacitor.isNativePlatform();

//   const [results, setResults] = useState({
//     workshops: [],
//     stories: [],
//     prompts: [],
//     location: null,
//   });
// const fetchPrompts = async (take = 3) => {
//   try {
//     const res = await dispatch(getPrompts({ take }));
//     checkResult(res, payload => {
//       const sorted = [...payload?.prompts].sort((a, b) => new Date(b.updated) - new Date(a.updated));
//       setResults(prev => ({ ...prev, prompts: sorted }));
//     }, err => {});
//   } catch (err) { console.error("Failed fetching prompts:", err); }
// };

//   const fetchStories = async () => {
//     try {
//       const res = await dispatch(fetchRecommendedStories());
//       checkResult(res, ({ stories }) => setResults(prev => ({ ...prev, stories })));
//     } catch (err) { console.error("Failed fetching stories:", err); }
//   };

//   const fetchWorkshops = async () => {
//     if (!currentProfile) return;
//     try {
//       const res = await dispatch(findWorkshopGroups({
//         location: currentProfile.location,
//         radius: 50,
//         global: isGlobal
//       }));
//       checkResult(res, (payload) => {
       
//         const {groups}=payload
//         const sorted = [...groups].sort((a,b)=>new Date(b.updated)-new Date(a.updated));
//         setResults(prev => ({ ...prev, workshops: sorted || [] }));
//       });
//     } catch (err) { console.error("Failed fetching workshops:", err); }
//   };

//   const fetchLocation = () => {
//     if (!isGlobal) return;
//     if (isNative) requestLocation();
//     else navigator.geolocation.getCurrentPosition(
//       pos => setResults(prev => ({ ...prev, location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } })),
//       err => console.error("Location error:", err)
//     );
//   };
// const fetches = (take = 3) => {
//   fetchPrompts(take);
//   fetchStories();
//   fetchWorkshops();
//   fetchLocation();
// };
//   useEffect(() => {
//         fetches(promptTake)

//   }, [currentProfile, isGlobal]);

//   return results;
// }
// export default useProfileDependentEffects
import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchRecommendedStories,
  getPrompts,
} from "../actions/StoryActions";

import checkResult from "./checkResult";

import {
  findWorkshopGroups,
} from "../actions/WorkshopActions";

import requestLocation from "./requestLocation";


function useProfileDependentEffects(
  currentProfile,
  isGlobal,
  promptTake
) {
  const dispatch = useDispatch();
  const isNative = Capacitor.isNativePlatform();

  /*
   * Stories come directly from Redux.
   *
   * This means when deleteStory.fulfilled updates
   * state.pages.recommendedStories, Home gets the
   * updated list immediately.
   */
  const recommendedStories = useSelector(
    (state) => state.pages.recommendedStories
  );

  const [results, setResults] = useState({
    workshops: [],
    prompts: [],
    location: null,
  });


  const fetchPrompts = async (take = 3) => {
    try {
      const res = await dispatch(
        getPrompts({ take })
      );

      checkResult(
        res,
        (payload) => {
          const sorted = [
            ...(payload?.prompts || [])
          ].sort(
            (a, b) =>
              new Date(b.updated) -
              new Date(a.updated)
          );

          setResults((prev) => ({
            ...prev,
            prompts: sorted,
          }));
        },
        () => {}
      );
    } catch (err) {
      console.error(
        "Failed fetching prompts:",
        err
      );
    }
  };


  const fetchStories = async () => {
    try {
      /*
       * The thunk updates Redux.
       *
       * We intentionally do NOT copy the stories
       * into local React state here.
       */
      await dispatch(
        fetchRecommendedStories()
      );
    } catch (err) {
      console.error(
        "Failed fetching stories:",
        err
      );
    }
  };


  const fetchWorkshops = async () => {
    if (!currentProfile) return;

    try {
      const res = await dispatch(
        findWorkshopGroups({
          location: currentProfile.location,
          radius: 50,
          global: isGlobal,
        })
      );

      checkResult(
        res,
        (payload) => {
          const { groups } = payload;

          const sorted = [
            ...(groups || [])
          ].sort(
            (a, b) =>
              new Date(b.updated) -
              new Date(a.updated)
          );

          setResults((prev) => ({
            ...prev,
            workshops: sorted,
          }));
        }
      );
    } catch (err) {
      console.error(
        "Failed fetching workshops:",
        err
      );
    }
  };


  const fetchLocation = () => {
    if (!isGlobal) return;

    if (isNative) {
      requestLocation();
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setResults((prev) => ({
            ...prev,
            location: {
              latitude:
                pos.coords.latitude,
              longitude:
                pos.coords.longitude,
            },
          })),
        (err) =>
          console.error(
            "Location error:",
            err
          )
      );
    }
  };


  const fetches = (take = 3) => {
    fetchPrompts(take);
    fetchStories();
    fetchWorkshops();
    fetchLocation();
  };


  useEffect(() => {
    fetches(promptTake);
  }, [currentProfile, isGlobal]);


  return {
    ...results,

    /*
     * Stories are now always the current Redux value.
     */
    stories: recommendedStories || [],
  };
}


export default useProfileDependentEffects;