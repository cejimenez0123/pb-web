import { useIonRouter } from '@ionic/react';
import { useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";
import Paths from "./core/paths";
import { useSelector } from 'react-redux';

const LoggedRoute = ({ children }) => {
  const { currentProfile } = useSelector(state => state.users);
  const [isLoading, setIsLoading] = useState(true); // Changed to match state
  const router = useIonRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const { value } = await Preferences.get({ key: "token" });
        
        // If user is already authenticated, send them to profile
        if (currentProfile?.id || value) {
          router.push(Paths.myProfile, "forward", "replace");
        } else {
          // IMPORTANT: If NOT authenticated, stop loading so children (Login) show
          setIsLoading(false); 
        }
      } catch (e) {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    // Return null or a spinner. 
    // If this stays null, your LoginContainer will never render.
    return null; 
  }

  return <>{children}</>;
};

export default LoggedRoute;
