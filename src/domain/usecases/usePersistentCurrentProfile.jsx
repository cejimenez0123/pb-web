import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { Preferences } from "@capacitor/preferences";
import DeviceCheck from "../../components/DeviceCheck";
import getLocalStore from "../../core/getLocalStore";
import setLocalStore from "../../core/setLocalStore";
export default function usePersistentCurrentProfile(fetchData) {
    const key = "cachedMyProfile"
    const isNative = DeviceCheck()
    const [profile, setProfile] = useState(null);
   
      const getUser= async ()=>{
        if(isNative&&Preferences){
      let profile = await getLocalStore(key,isNative)
      
      setProfile(JSON.parse(profile))
      return JSON.parse(profile)
        }else{
          try {
            const saved =await getLocalStore(key,isNative);
            return JSON.parse(saved)
          } catch (e) {
            console.log(e)
            return null
          }
    
          
        }
    }
    useEffect(()=>{
      fetchData()
    },[])
    useEffect(()=>{
    getUser().then(()=>{})
    },[])
  

    return profile;
  }