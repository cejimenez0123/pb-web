import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { Preferences } from "@capacitor/preferences";
import DeviceCheck from "../../components/DeviceCheck";
export default function usePersistentCurrentProfile(fetchData) {
    const key = "cachedMyProfile"
    const isNative = DeviceCheck()
      const getUser= async ()=>{
        if(isNative&&Preferences){
      let profile = await Preferences.get({key:key})
      setProfile(JSON.parse(profile))
      return JSON.parse(profile)
        }else{
          try {
            const saved =localStorage.getItem(key);
            return JSON.parse(saved)
          } catch (e) {
            console.log(e)
            return null
          }
    
          
        }
    }
    const [profile, setProfile] = useState(async () => {
   
      if(isNative){
       let profile = await getUser()
        return profile?profile:null
      }else{
      
      }

    });


  
    let token = localStorage.getItem("token")
    const setPrefernces = async (profile)=>{
      await Preferences.set({key:key,value:JSON.stringify(profile)})
    }
    useEffect(() => {
      
      if(token){
        
        fetchData().then(res=>checkResult(res,payload=>{
        setProfile(payload.profile)
        setPrefernces(payload.profile)
        localStorage.setItem(key, JSON.stringify(payload.profile));
      }))
    }
      else{
        setProfile(null)
      }}
    ,[token]);

    return profile;
  }