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

  return(<div  onClick={()=>navigate(Paths.profile.createRoute(profile.id))}className="overflow-hidden rounded-full max-w-8  max-h-8  border-2 border-white ">
    <img className="object-fit  " src={profilePic}/></div> )


}

export default ProfileCircle