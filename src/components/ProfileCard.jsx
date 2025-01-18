import React from "react"
import {useSelector} from 'react-redux'
import { useState ,useEffect} from "react"
import getDownloadPicture from "../domain/usecases/getDownloadPicture"
import isValidUrl from "../core/isValidUrl"
export default function ProfileCard({profile,onClickFollow,following}){
    const [profilePic,setProfilePic]=useState("")
    const FollowDiv=({following,onClickFollow})=>{

      return following?
      (<div 
       className=" bg-emerald-600  w-[9rem] rounded-full text-white text-center"
               onClick={onClickFollow}>
            <h5 className="text-white py-3 font-bold"> Following</h5>   </div>):(
        <div className="border-2 border-emerald-600 bg-transparent w-[9rem] rounded-full text-center"
                   onClick={onClickFollow}
       ><h5 className="text-emerald-800 py-3 font-bold">Follow</h5></div>)
   }
    useEffect(()=>{
      if(profile){
          if(isValidUrl(profile.profilePic)){
              setProfilePic(profile.profilePic)
              setPending(false)
          }else{
           getDownloadPicture(profile.profilePic).then(image=>{
              setProfilePic(image)
              setPending(false) } )
          }}
  },[profile])
        if(profile!=null){
      return(<div className="pb-8 border-3 rounded-lg  sm:min-h-[30em] mx-auto sm:max-w-[52em] border-emerald-400">
        <div className="text-left p-4">
            <div className="flex flex-row">  
            <img src={profilePic} className="max-w-36 object-fit max-h-36 mb-2 rounded-lg" alt=""/>
         <div>
            <div className="px-3 pt-3 flex flex-col justify-between  h-48">
           <div className="h-fit"><h5 className="sm:text-[1rem] text-[0.8rem]  h-40 overflow-y-scroll flex-wrap flex text-emerald-800 overflow-scroll">{profile.selfStatement}</h5>
           </div> 
            <div className="h-fit pb-2"><h5 className="text-emerald-800 text-[1.2rem] font-bold">{profile.username}</h5></div>
        </div></div>
        </div>
            <div className="mt-3">
                <FollowDiv following={following} onClickFollow={onClickFollow}/>
            </div>
        </div>
      
        </div>)
    }else{
       return <div className=" skeleton profile-card"/>
    }
    
    
    
    }