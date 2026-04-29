
// ── About Panel ──────────────────────────────────────

import { useEffect, useState } from "react";
import fetchCity from "../../core/fetchCity";
import Paths from "../../core/paths";
import SectionHeader from "../SectionHeader";

const AboutPanel = ({ profile, router }) => {
  const [locationName, setLocationName] = useState("Location not specified");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    if (!profile) return;

    const location = profile.location;

    // ❌ No location at all
    if (!location) {
      setLocationName("Location not specified");
      return;
    }

    // ✅ City already exists
    if (location.city) {
      setLocationName(location.city);
      return;
    }

    // 🔄 Otherwise fetch
    const fetchLocation = async () => {
      try {
        setIsLoadingLocation(true);
       const cache = new Map();

if (cache.has(JSON.stringify(location))) {
  setLocationName(cache.get(JSON.stringify(location)));
} else {
  const address = await fetchCity(location);
  cache.set(JSON.stringify(location), address);
     setLocationName(address || "Unknown location");
}


      } catch (err) {
        setLocationName("Unknown location");
      } finally {
        setIsLoadingLocation(false);
      }
    };

    fetchLocation();
  }, [profile]);
  
  // const [locationName,setLocationName]=useState("")
//   useEffect(()=>{
    
//   async function city(){
//     let address =await fetchCity(profile.location)
// if (address) {
//   setLocationName(address);
// }
//   }
//   profile?.location ?setLocationName(profile.location.city):city()
//   },[profile])
  if (!profile) return null;

  const hashtags = profile.hashtags ?? profile.tags ?? [];

  return (
    <div className="space-y-6 px-4">
      <SectionHeader title="Bio"/>
      {(profile.bio || profile.selfStatement) && (
        <p className="text-sm text-gray-700 leading-relaxed">
          {profile.bio ?? profile.selfStatement}
        </p>
      )}

     <div>
 
<SectionHeader title="Location"/>
  {isLoadingLocation ? (
    <div className="mt-1 h-4 w-32 bg-gray-200 rounded animate-pulse" />
  ) : (
    <p className="text-sm text-gray-700 mt-1">
      {locationName}
    </p>
  )}
</div>


      {hashtags.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase mb-2">Interests</p>
          <div className="flex flex-wrap gap-2">
            {hashtags.slice(0, 5).map((tag, i) => (
              <Pill key={i} onClick={()=>
                router.push(Paths.hashtag.createRoute(tag.id))}label={`#${typeof tag === "string" ? tag : tag.name ?? tag.tag}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPanel