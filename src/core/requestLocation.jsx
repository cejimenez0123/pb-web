import { useState } from "react";
import { registerUser } from "../actions/WorkshopActions";
import { useSelector } from "react-redux";

export default async function requestLocation (isNative) {
//   setLoading(true);
const {currentProfile} = useSelector(state => state.users)
const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
const [error, setError] = useState(null);
if(isNative){
  try {
    // Check current geolocation permission state
    const permStatus = await Geolocation.checkPermissions();

    if (permStatus.location === 'granted') {
      // Permission already granted, get location
      const position = await Geolocation.getCurrentPosition();
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      if (currentProfile && currentProfile.id) {
        registerUser(currentProfile.id, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }
      setError(null);
    } else if (permStatus.location === 'prompt' || permStatus.location === 'denied') {
      // Request permission explicitly, triggers iOS popup if needed
      const requestResult = await Geolocation.requestPermissions();
      if (requestResult.location === 'granted') {
        const position = await Geolocation.getCurrentPosition();
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        if (currentProfile && currentProfile.id) {
          registerUser(currentProfile.id, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
        setError(null);
      } else {
        setError("Location permission denied. Please enable location permissions in your device settings.");
      }
    } else {
      setError("Unable to determine location permission state.");
    }
  } catch (err) {
    console.error("Error requesting location or getting position:", err);
    setError("Could not get location. Please try again.");
  } finally {
    setLoading(false);
  }
}else{
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        if(currentProfile&&currentProfile.id){
          registerUser(currentProfile.id,location)
        }
    
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.log("location error")
        setError("We use location to conect with you fellow writers. Reload for access.");
        setLoading(false);
  
      }
    );
  
}
  return {error,locale:location,pending:loading}
};

