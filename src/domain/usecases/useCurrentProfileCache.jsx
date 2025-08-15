import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { Preferences } from "@capacitor/preferences";
import DeviceCheck from "../../components/DeviceCheck";
import getLocalStore from "../../core/getLocalStore";
import setLocalStore from "../../core/setLocalStore";
export default function usePersistentCurrentProfile(fetchData) {
    const key = "cachedMyProfile"
    const [token,setToken]=useState(null)
    const isNative = DeviceCheck()
    getLocalStore("token",isNative).then(tok=>setToken(tok))
   
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
    const [profile, setProfile] = useState(async () => {
   
     
       let profile = await getUser()
        return profile?profile:null
     

    });


  

   
    useEffect(() => {
      if(token){
        
        fetchData().then(res=>checkResult(res,payload=>{
          console.log("xssx",payload)
        setProfile(payload.profile)
        setLocalStore(key, JSON.stringify(payload.profile),isNative);
      }))
    }
      else{
        setProfile(null)
      }},[]
    );

    return profile;
  }