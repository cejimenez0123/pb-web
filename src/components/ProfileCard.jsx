import { useState ,useEffect} from "react"
import isValidUrl from "../core/isValidUrl"
import { useSelector } from "react-redux"
import FollowerCard from "./profile/FollowerCard"
import { IonImg } from "@ionic/react"
import Enviroment from "../core/Enviroment"
import { useDialog } from "../domain/usecases/useDialog"
import fetchCity from "../core/fetchCity"
export default function ProfileCard({profile,onClickFollow,following}){
    const dialog = useSelector(state=>state.users.dialog)
    const [profilePic,setProfilePic]=useState(Enviroment.blankProfile)
    const {currentProfile}=useSelector(state=>state.users)
    const [pending,setPending]=useState(false)
    const {openDialog,closeDialog}=useDialog()  //   const FollowDiv=({following,onClickFollow})=>{
  const [locationName, setLocationName] = useState(null);
  const [city,setCity]=useState("")
    // const [location,setLocation]=useState("")
  useEffect(()=>{
    
  async function city(){
    let address =await fetchCity(profile.location)

    setLocationName(address)
  }
  city()
  },[profile])

  
  
  const FollowDiv = ({ following, onClickFollow }) => {
  // Common classes for both states
    const [location,setLocation]=useState("")
  useEffect(()=>{
    
  async function city(){let address =await fetchCity(profile.location)
    setLocation(address)
  }
  city()
  },[profile])
  const baseClasses = "flex items-center justify-center w-[9rem] h-[3rem] rounded-full transition-all duration-200 cursor-pointer";
  
  return following ? (
    <div 
      className={`${baseClasses} bg-emerald-600 text-white`}
      onClick={onClickFollow}
    >
      <span className="font-bold text-[1rem]">Following</span>
    </div>
  ) : (
    <div 
      className={`${baseClasses} border-2 border-emerald-600 bg-transparent text-emerald-800`}
      onClick={onClickFollow}
    >
      <span className="font-bold text-[1rem]">Follow</span>
    </div>
  );
};
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
  const open=()=>{
          openDialog({
        title: null,
        text: (profile&&profile.followers? <FollowerCard followers={profile.followers}/>:null),
        breakpoint:1})
     
        }
    
    if(!profile||!profile.id){
    
            return <div className=" skeleton  w-[96vw] sm:w-[50em]  min-h-40"/>
         
    }
    if(profile){
        
      return(<div className="pb-8 rounded-lg  w-[96vw] sm:max-w-[60em] sm:min-h-40 mx-auto  ">
        <div className="text-left p-4">
            {/* <div className="flex flex-row"> */}
              <div>  
           <div>  
  {profilePic.length>0?
    <span className="max-h-[10em] flex flex-row">
      <img src={profilePic} className="max-h-[14em]" />
      <div className="p-4 ">
        <h5 className="text-[1.2em]">{profile.username}</h5>
        {locationName && (
  <div className="text-sm text-soft mt-2">
    {locationName}
  </div>
)}
      </div>
    </span>
  :<div className="skeleton max-w-36 object-fit max-h-36  mb-2 rounded-lg"/>}</div>
              
        
              </div> <div>
            <div className="px-3 pt-3 flex flex-col justify-between  h-48">
          
            
        </div>
        </div>
         <div className="mt-3 mx-auto w-[20em] justify-between flex flex-row">
                <FollowDiv following={following} onClickFollow={onClickFollow}/>
                <div onClick={open} className="text-emerald-800 text-center mx-4">
                    <h5 className="text-[1rem] my-auto">Followers</h5>
                <h6>{profile.followers.length}</h6>
                </div>
        </div>
           
            </div>
        {/* </div> */}
  
        </div>)
  
   
  }
    
    if(!profile||!profile.id){
    
            return <div className=" skeleton  w-[96vw] sm:w-[50em]  min-h-40"/>
         
    }
    if(profile){
        
      return(<div className="pb-8 rounded-lg  w-[96vw] sm:max-w-[60em] sm:min-h-40   ">
        <div className="text-left p-4">
            {/* <div className="flex flex-row"> */}
              <div className="flex flex-row">  
            {profilePic.length>0?
            <span className="max-h-[12em] overflow-hidden flex flex-row">
              <IonImg src={profilePic} className="max-w-36 object-fit mb-2 rounded-lg" alt=""/>
             </span>
          
                :<div className="skeleton max-w-36 object-fit max-h-36  mb-2 rounded-lg"/>}
{/*           
        <h5 className="text-[0.8em]
            ">{profile.username}</h5> */}
            </div>     <div>
            <div className="px-3 pt-3 flex flex-col justify-between  ">
          
            
        </div>
        </div>
         <div className="mt-3 mx-auto w-[20em] justify-between flex flex-row">
                {/* <FollowDiv following={following} onClickFollow={onClickFollow}/>
                <div onClick={openDialog} className="text-emerald-800 text-center mx-4">
                    <h5 className="text-[1rem] my-auto">Followers</h5>
                <h6>{profile.followers.length}</h6>
                </div> */}
        </div>
           
            </div>
        {/* </div> */}
  
        </div>)
    }
    

    }