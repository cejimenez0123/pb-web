import { IonContent, IonText, useIonRouter } from '@ionic/react';
import { useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";
import Paths from "./core/paths";
import { useSelector } from 'react-redux';

const LoggedRoute = ({ children }) => {
  const { currentProfile } = useSelector(state => state.users);
  const [isLoading, setIsLoading] = useState(false);
  const router = useIonRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // ✅ 1. If Redux already has user → redirect immediately
        if (currentProfile) {
   router.push(Paths.myProfile, "root", "replace"); // use root to prevent back nav
          return;
        }

        // ✅ 2. Otherwise check token
        const { value } = await Preferences.get({ key: "token" });

        if (value) {
         router.push(Paths.myProfile, "root", "replace");
        } else {
          setIsLoading(false);
        }
      } catch (e) {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [currentProfile]); // 👈 important

  if (isLoading) {
    return (
      <IonContent>
        <div className="flex justify-center items-center h-full">
          <IonText>Loading...</IonText>
        </div>
      </IonContent>
    );
  }

  return <>{children}</>;
};

export default LoggedRoute;