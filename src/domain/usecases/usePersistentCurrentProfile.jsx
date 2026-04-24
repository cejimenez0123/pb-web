import { useState, useEffect, useRef } from "react";
import { Preferences } from "@capacitor/preferences";
import { setCurrentProfile } from "../../actions/UserActions";

export default function usePersistentCurrentProfile(fetchData) {
  const key = "cachedMyProfile";
  const [profile, setProfile] = useState(null);
  const hasFetched = useRef(false);

  const getUser = async () => {
    try {
      const { value } = await Preferences.get({ key });
      if (value) {
        const parsed = JSON.parse(value);
        setProfile(parsed);
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
      await Preferences.set({
        key,
        value: JSON.stringify(newProfile),
      });
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
      await getUser();
      const token = (await Preferences.get({ key: "token" })).value;
      if (token && token !== "undefined") {
        const remoteProfile = await fetchData({ token });
        if (remoteProfile) saveProfile(remoteProfile);
      }
    };
    init();
  }, []);

  return profile;
}