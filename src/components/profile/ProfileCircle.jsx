import {  useEffect, useLayoutEffect,useState } from "react";
import isValidUrl from "../../core/isValidUrl";
import Paths from "../../core/paths";
import Enviroment from "../../core/Enviroment";
import { initGA, sendGAEvent } from "../../core/ga4";
import { IonImg, IonText, useIonRouter } from "@ionic/react";
function ProfileCircle({profile,color="white",fontSize="",isGrid=false}){
    const [profilePic,setProfilePic]=useState(Enviroment.blankProfile)
    const router = useIonRouter()

  
    useLayoutEffect(()=>{
  
            if(profile){
              if(isValidUrl(profile.profilePic)){

                setProfilePic(profile.profilePic)
         
            }else{
          
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
     router.push(Paths.profile.createRoute(profile.id))
    }
  
  return(<span className="flex flex-row bg-transparent">{profile?<span className="flex flex-row bg-transparent"><div  onClick={handleNavigate}className="overflow-hidden bg-emerald-700 rounded-full max-w-8 min-w-8  min-h-8 max-h-8  border-2 border-white ">
  <ProfilePic url={profilePic}/></div> <IonText className={`my-auto  px-2 text-soft ${fontSize} `}>{profile.username.length>9?profile.username.toLowerCase().slice(0,9)+"...":profile.username}</IonText><span/></span>:<div className=" max-w-8 min-w-8  bg-slate-100 skeleton"/>}</span>)


}

export default ProfileCircle