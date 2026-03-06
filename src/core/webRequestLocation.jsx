import { useState } from "react";
import { registerUser } from "../actions/WorkshopActions";

  const webRequestLocation=()=>{
    const [location, setLocation] = useState(null);
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

  export default webRequestLocation;