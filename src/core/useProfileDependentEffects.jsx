import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchRecommendedStories, getPrompts } from "../actions/StoryActions";
import checkResult from "./checkResult";
import { findWorkshopGroups } from "../actions/WorkshopActions";
import requestLocation from "./requestLocation";
import { Preferences } from "@capacitor/preferences";

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
      checkResult(res, ({ groups }) => {
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

  useEffect(() => {
    // Preferences.get({key:"token"}).then(({value})=>{
    // if (!value) return;
    fetchPrompts();
    fetchStories();
    fetchWorkshops();
    fetchLocation();
    // })

 
  }, [currentProfile, isGlobal]);

  return results;
}
export default useProfileDependentEffects