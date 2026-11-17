
// import { Geolocation } from "@capacitor/geolocation";


// const requestLocation = async ({
//   setLocation,
//   currentProfile,
//   registerUser,
// }) => {
//   try {
//     // 1. Check current permissions
//     let permissions = await Geolocation.checkPermissions();

//     const locationPermission = permissions.location;

//     // 2. Handle denied permissions
//     if (locationPermission === "denied") {
//       console.warn(
//         "request location",
//         "Location permission denied. Enable it in device settings."
//       );
//       return null;
//     }

//     // 3. Request permission when necessary
//     if (
//       locationPermission === "prompt" ||
//       locationPermission === "prompt-with-rationale"
//     ) {
//       permissions = await Geolocation.requestPermissions();

//       if (permissions.location !== "granted") {
//         console.warn("request location", "Location permission not granted.");
//         return null;
//       }
//     }

//     if (permissions.location !== "granted") {
//       console.warn(
//         "request location",
//         "Unable to determine location permission state."
//       );
//       return null;
//     }

//     // 4. Retrieve current position
//     const position = await Geolocation.getCurrentPosition({
//       enableHighAccuracy: false,
//       timeout: 15000,
//       maximumAge: 30000,
//     });

//     const coordinates = {
//       latitude: position.coords.latitude,
//       longitude: position.coords.longitude,
//     };

//     // 5. Update application state
//     setLocation(coordinates);

//     // 6. Register location when authenticated
//     if (currentProfile?.id && registerUser) {
//       await registerUser(currentProfile.id, coordinates);
//     }

//     console.log("request location", coordinates);

//     return coordinates;

//   } catch (err) {
//     console.error("Error requesting location:", err);

//     return null;
//   }
// };

// export default requestLocation;

// import { Geolocation } from "@capacitor/geolocation";

 
import { Geolocation } from "@capacitor/geolocation";

const requestLocation = async () => {
  try {
    const permStatus = await Geolocation.checkPermissions();

    if (permStatus.location === "denied") {
      console.log(
        "request location",
        "Location permission denied. Please enable location permissions in your device settings."
      );
      return;
    }

    if (permStatus.location === "prompt") {
      const requestResult = await Geolocation.requestPermissions();

      if (requestResult.location !== "granted") {
        console.log(
          "request location",
          "Location permission denied."
        );
        return;
      }
    } else if (permStatus.location !== "granted") {
      console.log(
        "request location",
        "Unable to determine location permission state."
      );
      return;
    }

    const position = await Geolocation.getCurrentPosition();

    const coordinates = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    setLocation(coordinates);

    if (currentProfile?.id) {
      await registerUser(currentProfile.id, coordinates);
    }

    console.log("request location", coordinates);

  } catch (err) {
    console.error(
      "Error requesting location or getting position:",
      err
    );

    console.log(
      "request location",
      "Could not get location. Please try again."
    );
  }
};

export default requestLocation;

//  const requestLocation = async () => {

//   try {
//     // Check current geolocation permission state
//     const permStatus = await Geolocation.checkPermissions();

//     if (permStatus.location === 'granted') {
//       // Permission already granted, get location
//      getPostion()
      
 
//     }else if (permStatus.location === 'prompt' || permStatus.location === 'denied') {
//       // Request permission explicitly, triggers iOS popup if needed
//       const requestResult = await Geolocation.requestPermissions();
//       if (requestResult.location === 'granted') {
//         const position = await Geolocation.getCurrentPosition();
//         setLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//         if (currentProfile && currentProfile.id) {
//             location&&  registerUser(currentProfile.id, {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         }
//         console.log("request location",null);
//       } else {
//         console.log("request location","Location permission denied. Please enable location permissions in your device settings.");
//       }
//     } else {
//       console.log("request location","Unable to determine location permission state.");
//     }
//   } catch (err) {
//     console.error("Error requesting location or getting position:", err);
//     console.log("request location","Could not get location. Please try again.");
//   } finally {
 
//   }
// };
// export default requestLocation