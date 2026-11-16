
import { Geolocation } from "@capacitor/geolocation";


const requestLocation = async ({
  setLocation,
  currentProfile,
  registerUser,
}) => {
  try {
    // 1. Check current permissions
    let permissions = await Geolocation.checkPermissions();

    const locationPermission = permissions.location;

    // 2. Handle denied permissions
    if (locationPermission === "denied") {
      console.warn(
        "request location",
        "Location permission denied. Enable it in device settings."
      );
      return null;
    }

    // 3. Request permission when necessary
    if (
      locationPermission === "prompt" ||
      locationPermission === "prompt-with-rationale"
    ) {
      permissions = await Geolocation.requestPermissions();

      if (permissions.location !== "granted") {
        console.warn("request location", "Location permission not granted.");
        return null;
      }
    }

    if (permissions.location !== "granted") {
      console.warn(
        "request location",
        "Unable to determine location permission state."
      );
      return null;
    }

    // 4. Retrieve current position
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 30000,
    });

    const coordinates = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    // 5. Update application state
    setLocation(coordinates);

    // 6. Register location when authenticated
    if (currentProfile?.id && registerUser) {
      await registerUser(currentProfile.id, coordinates);
    }

    console.log("request location", coordinates);

    return coordinates;

  } catch (err) {
    console.error("Error requesting location:", err);

    return null;
  }
};

export default requestLocation;
