import { IonContent, IonText, useIonRouter } from "@ionic/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Paths from "./core/paths";

const LoggedRoute = ({ children }) => {
  const { currentProfile } = useSelector((state) => state.users);
  const router = useIonRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If user is logged in → redirect away from login
    if (currentProfile?.id) {
      router.push(Paths.myProfile, "root", "replace");
      return;
    }

    // No need for async storage check anymore
    setIsLoading(false);
  }, [currentProfile, router]);

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
