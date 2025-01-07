import { useEffect, useState } from "react";
import isValidUrl from "../../core/isValidUrl";
import getDownloadPicture from "../../domain/usecases/getDownloadPicture";
import { useNavigate } from "react-router-dom";
import Paths from "../../core/paths";

function ProfileCircle({profile}){
    const [profilePic,setProfilePic]=useState("")
    const [pending,setPending]=useState(true)
    const navigate = useNavigate()
    useEffect(()=>{
        getDownloadPicture(profile.profilePic).then(image=>{
            setProfilePic(image)
            setPending(false)
    }
        )
    },[profile])
if(isValidUrl(profilePic)&&!pending&&profile){
  return(<div  onClick={()=>navigate(Paths.profile.createRoute(profile.id))}className="overflow-hidden rounded-full max-h-7 max-w-8  border-2 border-white "><img className="object-scale-down h-6 h-8  " src={profilePic}/></div> )

}else{
    return <div className="w-7 skeleton  bg-slate-400 h-8"></div>
}}

export default ProfileCircle