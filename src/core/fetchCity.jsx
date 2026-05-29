import { getGeocode } from "use-places-autocomplete";

const fetchCity = async (location) => {

      if (!location?.latitude || !location?.longitude) return;
  
      try {
        const { latitude: lat, longitude: lng } =location;
  
        const results = await getGeocode({
          location: { lat, lng }
        });
  
        const comps = results[0].address_components;
  
        const get = (type) =>
          comps.find(c => c.types.includes(type))?.long_name;
  
        const city =
          get("locality") ||
          get("sublocality") ||
          get("administrative_area_level_2");
  
        const state = get("administrative_area_level_1");

        // setLocationName(
        return  city && state ? `${city}, ${state}` : city || state || "Unknown"
        // );
  
      } catch (err) {
        console.error("Reverse geocode failed:", err);
      }
    }
export default fetchCity