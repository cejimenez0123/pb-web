import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Preferences } from "@capacitor/preferences";
import DeviceCheck from "../../components/DeviceCheck";
export default function usePersistentCurrentProfile(fetchData) {
    const key = "cachedMyProfile"
    const isNative = DeviceCheck()
    const [profile, setProfile] = useState(async () => {
   
      if(isNative){
       let profile = await getUserFromPref()
        return profile?profile:null
      }else{
      const saved =localStorage.getItem(key);
      return saved ? JSON.parse(saved) :null;
      }

    });
  const getUserFromPref= async ()=>{
      let profile = await Preferences.get({key:key})
      setProfile(JSON.parse(profile))
      return JSON.parse(profile)
    }

  
    let token = localStorage.getItem("token")
    const setPrefences = async (profile)=>{
      await Preferences.set({key:key,value:JSON.stringify(profile)})
    }
    useEffect(() => {
      
      if(token){
        
        fetchData().then(res=>checkResult(res,payload=>{
        setProfile(payload.profile)
        setPrefences(payload.profile)
        localStorage.setItem(key, JSON.stringify(payload.profile));
      }))}else{
        setProfile(null)
      }}
    ,[token]);

    return profile;
  }