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
  }, [currentProfile, router]);

  if (isLoading) {
    // Return null or a spinner. 
    // If this stays null, your LoginContainer will never render.
    return null; 
  }

  return <>{children}</>;
};

export default LoggedRoute;
// import { useIonRouter } from '@ionic/react';
// import { useEffect, useState } from "react";
// import { Preferences } from "@capacitor/preferences";
// import Paths from "./core/paths";
// import { useSelector } from 'react-redux';

// const LoggedRoute = ({ children }) => {
//   // const router = useIonRouter();
//   const {currentProfile}=useSelector(state=>state.users)
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useIonRouter()
// useEffect(() => {
//     const verifyAuth = async () => {
//       const { value } = await Preferences.get({ key: "token" });
      
//       // If we have a profile in Redux OR a token in storage
//       if (currentProfile?.id || value) {
//         // Use 'replace' to prevent "Insecure Operation" and back-button loops
//         router.push(Paths.myProfile, "forward", "replace");
//       } else {
//         setChecking(false);
//       }
//     };

//     verifyAuth();
//   }, [currentProfile, router]);


//   if (isLoading) {
//     return null; // Or a loading spinner
//   }

//   return children;
// };

// export default LoggedRoute;
