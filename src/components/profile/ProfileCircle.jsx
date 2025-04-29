import {  useEffect, useLayoutEffect,useState } from "react";
import isValidUrl from "../../core/isValidUrl";
import getDownloadPicture from "../../domain/usecases/getDownloadPicture";
import { useNavigate } from "react-router-dom";
import Paths from "../../core/paths";
import Enviroment from "../../core/Enviroment";
import { useMediaQuery } from "react-responsive";
import { initGA, sendGAEvent } from "../../core/ga4";

function ProfileCircle({profile,color="white",isGrid=false}){
       const isPhone = useMediaQuery({
        query: '(max-width: 768px)'
      })
    const [profilePic,setProfilePic]=useState(Enviroment.blankProfile)
    const navigate = useNavigate()
    useLayoutEffect(()=>{
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
    },[])
    useEffect(()=>{
      initGA()
    },[])
    const handleNavigate=()=>{
      sendGAEvent("Navigate",`Navigate to profile:${{id:profile.id,userrname:profile.username}}`,profile.username,0,false)
      navigate(Paths.profile.createRoute(profile.id))
    }
  return(<span className="flex flex-row">{profile?<span className="flex flex-row"><div  onClick={handleNavigate}className="overflow-hidden rounded-full max-w-8 min-w-8  min-h-8 max-h-8  border-2 border-white ">
    <img className="object-fit max-h-9 max-w-10 " src={profilePic}/></div> {!isGrid?!isPhone?<h6 className={`my-auto  px-2 ${isGrid?"text-[0.6rem]":""} ${"text-"+color}`}>{profile.username}</h6>:<span/>:""}</span>:<div className=" max-w-8 min-w-8  bg-slate-100 skeleton"/>}</span>)


}

export default ProfileCircle