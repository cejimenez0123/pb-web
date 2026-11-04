
// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useIonRouter } from "@ionic/react";
// import Paths from "./core/paths";

// const PrivateRoute = ({ children }) => {
//   const { currentProfile, authResolved } = useSelector(
//     (state) => state.users
//   );

//   const router = useIonRouter();

//   useEffect(() => {
//     if (authResolved && !currentProfile) {
//       router.push(Paths.login, "root");
//     }
//   }, [authResolved, currentProfile, router]);

//   // Don't mount protected pages until authentication is resolved.
//   if (!authResolved || !currentProfile) {
//     return null;
//   }

//   return children;
// };

// export default PrivateRoute;

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useIonRouter } from "@ionic/react";
import Paths from "./core/paths";

const PrivateRoute = ({ children }) => {
  const { currentProfile, authResolved } = useSelector(
    (state) => state.users
  );

  const router = useIonRouter();

  useEffect(() => {
    if (authResolved && !currentProfile?.id) {
      router.push(Paths.login, "root");
    }
  }, [authResolved, currentProfile?.id]);

  if (!authResolved || !currentProfile?.id) return null;

  return children;
};

export default PrivateRoute;