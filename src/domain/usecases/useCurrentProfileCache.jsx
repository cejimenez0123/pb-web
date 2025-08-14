import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { Preferences } from "@capacitor/preferences";
import DeviceCheck from "../../components/DeviceCheck";
import getLocalStore from "../../core/getLocalStore";
import setLocalStore from "../../core/setLocalStore";
export default function usePersistentCurrentProfile(fetchData) {
    const key = "cachedMyProfile"
    const isNative = DeviceCheck()
      const getUser= async ()=>{
        if(isNative&&Preferences){
      let profile = await getLocalStore(key,isNative)
      setProfile(JSON.parse(profile))
      return JSON.parse(profile)
        }else{
          try {
            const saved =getLocalStore(key,isNative);
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


  
    let token = getLocalStore("token",isNative)
    const setPrefernces = async (profile)=>{
      await Preferences.set({key:key,value:JSON.stringify(profile)})
    }
    useEffect(() => {
      
      if(token){
        
        fetchData().then(res=>checkResult(res,payload=>{
        setProfile(payload.profile)
        // setPrefernces(payload.profile)
        setLocalStore(key, JSON.stringify(payload.profile),isNative);
      }))
    }
      else{
        setProfile(null)
      }}
    ,[token]);

    return profile;
  }