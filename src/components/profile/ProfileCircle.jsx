import {  useEffect, useLayoutEffect,useState } from "react";
import isValidUrl from "../../core/isValidUrl";
import { useNavigate } from "react-router-dom";
import Paths from "../../core/paths";
import Enviroment from "../../core/Enviroment";
import { useMediaQuery } from "react-responsive";
import { initGA, sendGAEvent } from "../../core/ga4";
import { IonImg } from "@ionic/react";
function ProfileCircle({profile,color="white",isGrid=false}){
    const [profilePic,setProfilePic]=useState(Enviroment.blankProfile)
    const navigate = useNavigate()
          // const fetchPreview = async (url) => {
  // try {
//     console.log("DXX",url)
//     const response = await axios.get(
//       `${Enviroment.proxyUrl}/preview?url=${encodeURIComponent(url)}`
//     );

//     const data = response.data; // ✅ axios already gives JSON
// console.log("Fdfdf",data)
//     console.log("Fetched preview data:", data);
//     setProfilePic(data.url)
//   } catch (error) {
//     console.error('Failed to fetch link preview:', error);
//   } finally {
//     setLoading(false);
//   }
// };
  
    useLayoutEffect(()=>{
  
            if(profile){
              if(isValidUrl(profile.profilePic)){

                setProfilePic(profile.profilePic)
         
            }else{
          console.log(profilePic)
               const src = Enviroment.imageProxy(profile.profilePic);
            
setProfilePic(src)
          
          
            }}
    },[profile])
    useEffect(()=>{
      initGA()
    },[])
    const ProfilePic = ({url})=><IonImg className="object-fit max-h-9 max-w-10 " src={url}/>
    const handleNavigate=()=>{
      sendGAEvent("Navigate",`Navigate to profile:${{id:profile.id,userrname:profile.username}}`,profile.username,0,false)
      navigate(Paths.profile.createRoute(profile.id))
    }
  return(<span className="flex flex-row">{profile?<span className="flex flex-row"><div  onClick={handleNavigate}className="overflow-hidden bg-emerald-700 rounded-full max-w-8 min-w-8  min-h-8 max-h-8  border-2 border-white ">
  <ProfilePic url={profilePic}/></div> <h6 className={`my-auto  px-2 ${isGrid?"text-[0.6rem]":""} ${"text-"+color}`}>{profile.username}</h6><span/></span>:<div className=" max-w-8 min-w-8  bg-slate-100 skeleton"/>}</span>)


}

export default ProfileCircle