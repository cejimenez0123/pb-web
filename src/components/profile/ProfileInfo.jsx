import { useState,useEffect, } from "react"
import "../../App.css"
import isValidUrl from "../../core/isValidUrl"

import Enviroment from "../../core/Enviroment"

const ProfileInfo = ({ profile }) => {
     
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

  if (!profile) {
    return <div className="h-20 w-20 rounded-full bg-gray-200" />;
  }

  return (
    <div className="max-h-20 max-w-20 rounded-full overflow-hidden">
      <img
        src={pictureUrl}
        alt="profile"
        className="w-full h-full object-cover"
      />
    </div>
  );
}; 
export default ProfileInfo