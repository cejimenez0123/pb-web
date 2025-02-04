import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
export default function usePersistentCurrentProfile(fetchData) {
    const key = "cachedMyProfile"
    const location = useLocation()
    const [profile, setProfile] = useState(() => {
      const saved =localStorage.getItem(key);
      return saved ? JSON.parse(saved) :null;
    });
  

    useEffect(() => {
      fetchData().then(res=>checkResult(res,payload=>{
        setProfile(payload.profile)
        localStorage.setItem(key, JSON.stringify(payload.profile));
      }))}
,[location.pathname]);

    return profile;
  }