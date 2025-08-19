import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Preferences } from "@capacitor/preferences";
import DeviceCheck from "../../components/DeviceCheck";
export default function useGoogleAccessToken(fetchData) {
    const key = "googledrivetoken"
    const isNative = DeviceCheck()
    const [gtoken,setToken]=useState(null)
      const getToken= async ()=>{
        if(isNative&&Preferences){
let token = await Preferences.get({key:key})
setToken(token)
    //   setProfile(JSON.parse(profile))
      return JSON.parse(profile)
        }else{
          const saved =(await Preferences.get(key)).value;
          return saved ? JSON.parse(saved) :null;
        }
    }
    useEffect(()=>{
        getToken()
    },[])
    // const [profile, setProfile] = useState(async () => {
   
    //   if(isNative){
    //    let profile = await getUser()
    //     return profile?profile:null
    //   }else{
      
    //   }

    // });


  
    // let token = localStorage.getItem("googledrivetoken")
    // const setPrefences = async (profile)=>{
    //   await Preferences.set({key:key,value:JSON.stringify(profile)})
    // }
    // useEffect(() => {
      
    //   if(token){
        
    //     // fetchData().then(res=>checkResult(res,payload=>{
    //     // setProfile(payload.profile)
    //     // setPrefences(payload.profile)
    //     // localStorage.setItem(key, JSON.stringify(payload.profile));
    // //   }))}else{
    // //     setProfile(null)
    // //   }}
    // ,[token]);

    return gtoken
  }