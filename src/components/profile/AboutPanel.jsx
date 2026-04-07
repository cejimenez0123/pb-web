
// ── About Panel ──────────────────────────────────────

import { useEffect, useState } from "react";
import fetchCity from "../../core/fetchCity";
import Paths from "../../core/paths";

const AboutPanel = ({ profile,router }) => {
  const [locationName,setLocationName]=useState("")
  useEffect(()=>{
    
  async function city(){
    let address =await fetchCity(profile.location)
if (address) {
  setLocationName(address);
}
  }
  profile?.location ?setLocationName(profile.location.city):city()
  },[profile])
  if (!profile) return null;

  const hashtags = profile.hashtags ?? profile.tags ?? [];

  return (
    <div className="space-y-6 px-4">
      {(profile.bio || profile.selfStatement) && (
        <p className="text-sm text-gray-700 leading-relaxed">
          {profile.bio ?? profile.selfStatement}
        </p>
      )}

      <div>
          <p className="text-xs text-gray-400 uppercase">Location</p>
          <p className="text-sm text-gray-700 mt-1">{locationName}</p>
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