import { useEffect, useState } from "react";
import isValidUrl from "../../core/isValidUrl";
import getDownloadPicture from "../../domain/usecases/getDownloadPicture";
import { useNavigate } from "react-router-dom";
import Paths from "../../core/paths";
import Enviroment from "../../core/Enviroment";

function ProfileCircle({profile}){
    const [profilePic,setProfilePic]=useState(Enviroment.blankProfile)
    const navigate = useNavigate()
    useEffect(()=>{
        if(profile){
            if(isValidUrl(profile.profilePic)){

                setProfilePic(profile.profilePic)
         
            }else{
             getDownloadPicture(profile.profilePic).then(image=>{
                if(image){
                    setProfilePic(image)
           
                }
            } ).catch(err=>{
                
            })
            }}
    },[profile])

  return(<span className="flex flex-row">{profile?<span className="flex flex-row"><div  onClick={()=>navigate(Paths.profile.createRoute(profile.id))}className="overflow-hidden rounded-full max-w-8 min-w-8  min-h-8 max-h-8  border-2 border-white ">
    <img className="object-fit max-h-9 max-w-10 " src={profilePic}/></div> <h6 className="my-auto  mx-1 text-emerald-800">{profile.username}</h6></span>:<div className=" max-w-8 min-w-8  bg-slate-100 skeleton"/>}</span>)


}

export default ProfileCircle