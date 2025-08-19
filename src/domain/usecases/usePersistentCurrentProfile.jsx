import { useState, useEffect } from "react";
import { Preferences } from "@capacitor/preferences";

export default function usePersistentCurrentProfile(fetchData) {
  const key = "cachedMyProfile";
  const [profile, setProfile] = useState(null);

  // Get the profile from Preferences storage
  const getUser = async () => {
    try {
      const { value } = await Preferences.get({ key });
      if(value) {
        const parsed = JSON.parse(value);
        setProfile(parsed);
        return parsed;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error reading from preferences:", error);
      return null;
    }
  };

  // Set or update the profile to Preferences storage
  const saveUser = async (newProfile) => {
    try {
      await Preferences.set({
        key,
        value: JSON.stringify(newProfile),
      });
      setProfile(newProfile);
    } catch (error) {
      console.error("Error saving to preferences:", error);
    }
  };

  // On component mount, fetch from remote and update profile + prefs
  useEffect(() => {
    const fetchAndSave = async () => {
      const remoteProfile = await fetchData();
      if(remoteProfile) {
        saveUser(remoteProfile);
      }
    };

    fetchAndSave();
  }, [fetchData]);

  // Load local profile from storage when component mounts
  useEffect(() => {
    getUser();
  }, []);

  return profile;
}
