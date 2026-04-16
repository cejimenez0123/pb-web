
import { IonContent, IonText, useIonRouter } from "@ionic/react";
import { useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";
import Paths from "./core/paths";
import { useSelector } from "react-redux";

const LoggedRoute = ({ children }) => {
  const { currentProfile } = useSelector((state) => state.users);
  const [isLoading, setIsLoading] = useState(true);
  const router = useIonRouter();

  useEffect(() => {
    let didRedirect = false;

    const verifyAuth = async () => {
      // ✅ If already logged in → redirect immediately
      if (currentProfile) {
        didRedirect = true;
        router.push(Paths.myProfile, "root", "replace");
        return;
      }

      try {
        const { value } = await Preferences.get({ key: "token" });

        if (value && !didRedirect) {
          router.push(Paths.myProfile, "root", "replace");
          return;
        }
      } catch (e) {
        console.error("Auth check failed", e);
      }

      // ✅ Only allow render if NOT logged in
      setIsLoading(false);
    };

    verifyAuth();
  }, [currentProfile]);

  // ✅ Block render while checking
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