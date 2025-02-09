import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { useLocation } from "react-router-dom";
export default function usePersistentCurrentProfile(fetchData) {
    const key = "cachedMyProfile"
    const [profile, setProfile] = useState(() => {
      const saved =localStorage.getItem(key);
      return saved ? JSON.parse(saved) :null;
    });
  

    useEffect(() => {
      let token = localStorage.getItem("token")
      if(token){fetchData().then(res=>checkResult(res,payload=>{
        setProfile(payload.profile)
        localStorage.setItem(key, JSON.stringify(payload.profile));
      }))} }
    ,[location.pathname]);

    return profile;
  }