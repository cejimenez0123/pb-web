import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useIonRouter } from "@ionic/react";
import Paths from "./core/paths";

const PrivateRoute = ({ children }) => {
  const { currentProfile, authResolved } = useSelector((state) => state.users);
  const router = useIonRouter();

  useEffect(() => {
    if (authResolved && !currentProfile) {
      router.push(Paths.login, "root");
    }
  }, [authResolved, currentProfile]);

  return <>{children}</>;
};


export default PrivateRoute;