import isValidUrl from "../../core/isValidUrl";
import Paths from "../../core/paths";
import Enviroment from "../../core/Enviroment";
import {  sendGAEvent } from "../../core/ga4";
import { IonText, useIonRouter } from "@ionic/react";
import { useEffect, useState } from "react";
function ProfileCircle({profile, color="white", fontSize="", includeUsername=true, isGrid=false}) {
  const router = useIonRouter()
    const [pictureUrl,setPictureUrl]=useState(Enviroment.blankProfile)
  async function fetchImage() {
            if(!profile?.profilePic)return null
            if(isValidUrl(profile?.profilePic)){
                setPictureUrl(profile?.profilePic)
         
            }else{
             const src = Enviroment.imageProxy(profile.profilePic)

                    setPictureUrl(src)
            }
              
            }
        useEffect(() => {
    let isMounted = true;
 
    


    fetchImage();
    return () => (isMounted = false);
  }, [profile]);
  const handleNavigate = () => {
    sendGAEvent(
      "Navigate",
      `Navigate to profile:${{id:profile.id,userrname:profile.username}}`,
      profile.username,
      0,
      false
    )
    router.push(Paths.profile.createRoute(profile.id))
  }

  if (!profile) {
    return (
      <span className="flex flex-row shadow">
        <div className="overflow-hidden bg-emerald-700 rounded-full max-w-8 min-w-8 min-h-8 max-h-8 border-2 border-white" />
      </span>
    )
  }

  // ✅ compute once, no state, no effect
  // const profilePic = resolveSrc(profile.profilePic)

  return (
    <span className="flex flex-row bg-transparent">
      <span className="flex flex-row bg-transparent">
        <div
          onClick={handleNavigate}
          className="overflow-hidden bg-emerald-700 rounded-full max-w-8 min-w-8 min-h-8 max-h-8 border-2 border-white"
        >
          <img
            src={pictureUrl}
            className="object-cover w-full h-full"
            alt="profile"
          />
        </div>

        <IonText className={`my-auto px-2 text-soft ${fontSize}`}>
          {!includeUsername
            ? null
            : profile.username.length > 9
              ? profile.username.toLowerCase().slice(0, 9) + "..."
              : profile.username.toLowerCase()}
        </IonText>
      </span>
    </span>
  )
}
export default ProfileCircle;