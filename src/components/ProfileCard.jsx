import React from "react"
import {useSelector} from 'react-redux'
import { useState ,useEffect} from "react"
import { Dialog } from "@mui/material"
import getDownloadPicture from "../domain/usecases/getDownloadPicture"
import isValidUrl from "../core/isValidUrl"
import Clear from "../images/icons/clear.svg"
import { useMediaQuery } from "react-responsive"
import { useParams } from "react-router-dom"
import FollowerCard from "./profile/FollowerCard"
import { IonImg } from "@ionic/react"
export default function ProfileCard({profile,onClickFollow,following}){
    const [profilePic,setProfilePic]=useState("")
    const [pending,setPending]=useState(false)
    const {id}=useParams()
    const isPhone =  useMediaQuery({
        query: '(max-width: 768px)'
      })
    const [followersDialog,setFollowersDialog]=useState(false)
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
    useEffect(()=>{
        setFollowersDialog(false)
    },[id])
    if(!profile||!profile.id){
    
            return <div className=" skeleton  w-[96vw] auto mx-auto md:w-info h-info"/>
         
    }
    if(profile){
        
      return(<div className="pb-8 md:border-3 rounded-lg  w-[96vw] md:h-info mx-auto md:w-info md:border-emerald-400">
        <div className="text-left p-4">
            <div className="flex flex-row">
              <div>  
            {profilePic.length>0?<IonImg src={profilePic} className="max-w-36 object-fit max-h-36  mb-2 rounded-lg" alt=""/>:<div className="skeleton max-w-36 object-fit max-h-36  mb-2 rounded-lg"/>}
              <div className="h-fit px-2 pb-2"><h5 className="text-emerald-800 text-[1.2rem] open-sans-medium font-bold">{profile.username}</h5></div>
        
              </div> <div>
            <div className="px-3 pt-3 flex flex-col justify-between  h-48">
           <div className="h-fit"><h5 className="sm:text-[1rem] text-[0.8rem] max-h-40 overflow-y-scroll flex-wrap flex text-emerald-800 overflow-scroll">{profile.selfStatement}</h5>
           </div> 
            
        </div>
        </div>
        
        </div>
            <div className="mt-3 flex flex-row">
                <FollowDiv following={following} onClickFollow={onClickFollow}/>
                <div onClick={()=>setFollowersDialog(true)} className="text-emerald-800 text-center mx-4">
                    <h5 className="open-sans-bold text-[1rem] ">Followers</h5>
                <h6>{profile.followers.length}</h6>
                </div>
            </div>
        </div>
        <Dialog open={followersDialog}
        fullScreen={isPhone}
onClose={()=>{
    setFollowersDialog(false)
}}>
    <div className="card   min-w-[30em] py-6 rounded-lg">
       <div div className="px-4 ">
        <IonImg onClick={()=>setFollowersDialog(false)}src={Clear}/>
       </div>
      {profile&&profile.followers? <FollowerCard followers={profile.followers}/>:null}
        </div>
        </Dialog>
        </div>)
    }
    
    
    
    }