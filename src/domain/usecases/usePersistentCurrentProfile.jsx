import { useState, useEffect, useRef } from "react";
import { Preferences } from "@capacitor/preferences";
import { useDispatch } from "react-redux";
import { setCurrentProfile, setAuthResolved } from "../../actions/UserActions";

export default function usePersistentCurrentProfile(fetchData) {
  const key = "cachedMyProfile";
  const [profile, setProfile] = useState(null);
  const hasFetched = useRef(false);
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const { value } = await Preferences.get({ key });
      if (value) {
        const parsed = JSON.parse(value);
        setProfile(parsed);
        dispatch(setCurrentProfile(parsed));
        return parsed;
      }
      return null;
    } catch (error) {
      console.error("Error reading from preferences:", error);
      return null;
    }
  };

  const saveProfile = async (newProfile) => {
    try {
      await Preferences.set({ key, value: JSON.stringify(newProfile) });
      setProfile(newProfile);
      dispatch(setCurrentProfile(newProfile));
    } catch (error) {
      console.error("Error saving to preferences:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      const { value: token } = await Preferences.get({ key: "token" });

      if (token && token !== "undefined" && token !== "null") {
        const cached = await getUser(); // hydrate from cache first, no network wait
        const remoteProfile = await fetchData({ token });
   if (remoteProfile) {
  saveProfile(remoteProfile);
  dispatch(setAuthResolved(true));
} else if (!cached) {
  dispatch(setAuthResolved(true));
}
        else if (!cached) dispatch(setAuthResolved(true));
      } else {
        dispatch(setAuthResolved(true));
      }
    };
    init();
  }, []);

  return profile;
}