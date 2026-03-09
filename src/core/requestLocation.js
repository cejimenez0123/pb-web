import { Geolocation } from "@capacitor/geolocation";

 
 const requestLocation = async () => {

  try {
    // Check current geolocation permission state
    const permStatus = await Geolocation.checkPermissions();

    if (permStatus.location === 'granted') {
      // Permission already granted, get location
     getPostion()
      
      console.log("request location",null);
    }else if (permStatus.location === 'prompt' || permStatus.location === 'denied') {
      // Request permission explicitly, triggers iOS popup if needed
      const requestResult = await Geolocation.requestPermissions();
      if (requestResult.location === 'granted') {
        const position = await Geolocation.getCurrentPosition();
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        if (currentProfile && currentProfile.id) {
            location&&  registerUser(currentProfile.id, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
        console.log("request location",null);
      } else {
        console.log("request location","Location permission denied. Please enable location permissions in your device settings.");
      }
    } else {
      console.log("request location","Unable to determine location permission state.");
    }
  } catch (err) {
    console.error("Error requesting location or getting position:", err);
    console.log("request location","Could not get location. Please try again.");
  } finally {
 
  }
};
export default requestLocation