
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useIonRouter, IonContent, IonImg } from "@ionic/react";
import loadingGif from "./images/loading.gif";
import Paths from "./core/paths";

const PrivateRoute = ({ children }) => {
  const { currentProfile } = useSelector((state) => state.users);
  const router = useIonRouter();
  const pathName = router.routeInfo.pathname;

  const loggedInPaths = [Paths.login()];
  const loggedOutPaths = [Paths.home, Paths.myProfile];

  useEffect(() => {
    // if (loading) return; // <-- wait until we know the auth state

    // Redirect logged-in users away from login
    if (currentProfile && loggedInPaths.includes(pathName)) {
      router.push(Paths.home, "root");
      return;
    }

    // Redirect logged-out users to login
    if (!currentProfile && loggedOutPaths.includes(pathName)) {
      router.push(Paths.login(), "root");
      return;
    }
  }, [pathName, currentProfile]);

  // Optionally show a loading overlay while fetching profile


  return <>{children}</>;
};

export default PrivateRoute;