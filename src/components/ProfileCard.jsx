import { useState ,useEffect} from "react"
import isValidUrl from "../core/isValidUrl"
import { setDialog } from "../actions/UserActions"
import { useSelector } from "react-redux"
import FollowerCard from "./profile/FollowerCard"
import { IonImg } from "@ionic/react"
import Enviroment from "../core/Enviroment"
export default function ProfileCard({profile,onClickFollow,following}){
    const dialog = useSelector(state=>state.users.dialog)
    const [profilePic,setProfilePic]=useState(Enviroment.blankProfile)
    const [pending,setPending]=useState(false)
    const FollowDiv=({following,onClickFollow})=>{

      return following?
      (<div 
       className=" bg-emerald-600  w-[9rem] btn rounded-full text-white text-center"
               onClick={onClickFollow}>
            <h5 className="text-white py-3 font-bold"> Following</h5>   </div>):(
        <div className="border-2 border-emerald-600 btn bg-transparent w-[9rem] rounded-full text-center"
                   onClick={onClickFollow}
       ><h5 className="text-emerald-800 py-3 font-bold">Follow</h5></div>)
   }
    useEffect(()=>{
  
      if(profile){
          if(isValidUrl(profile.profilePic)){
        
              setProfilePic(profile.profilePic)
              setPending(false)
          }else{
             const src = Enviroment.imageProxy(profile.profilePic);
setProfilePic(src)
   

        }
        }
          
  },[profile])
  const openDialog=()=>{
    let dia = dialog
    dia.isOpen = true
    dia.disagreeText="Close"
    dia.title = "Followers"
    dia.text =(<div className="card   min-w-[30em] p-6 rounded-lg">

    {profile&&profile.followers? <FollowerCard followers={profile.followers}/>:null}
      </div>)
      dispatch(setDialog(dia))
  }
    
    if(!profile||!profile.id){
    
            return <div className=" skeleton  w-[96vw] sm:w-[50em]  min-h-40"/>
         
    }
    if(profile){
        
      return(<div className="pb-8 sm:border-3 rounded-lg  w-[96vw] sm:max-w-[60em] sm:min-h-40 mx-auto  sm:border-blueSea">
        <div className="text-left p-4">
            <div className="flex flex-row">
              <div>  
            {profilePic.length>0?<span className="max-h-28  "><IonImg src={profilePic} className="max-w-36 object-fit mb-2 rounded-lg" alt=""/></span>:<div className="skeleton max-w-36 object-fit max-h-36  mb-2 rounded-lg"/>}
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
                <div onClick={openDialog} className="text-emerald-800 text-center mx-4">
                    <h5 className="open-sans-bold text-[1rem] ">Followers</h5>
                <h6>{profile.followers.length}</h6>
                </div>
            </div>
        </div>
  
        </div>)
    }
    
    
    
    }