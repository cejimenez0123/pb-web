import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
export default function usePersistentCurrentProfile(fetchData) {
    const key = "cachedMyProfile"
    const [profile, setProfile] = useState(() => {
      const saved =localStorage.getItem(key);
      return saved ? JSON.parse(saved) :null;
    });
    const dispatch= useDispatch()
  
    let token = localStorage.getItem("token")

    useEffect(() => {
      
      if(token){
        console.log("token",token)
        fetchData().then(res=>checkResult(res,payload=>{
        setProfile(payload.profile)
        
        localStorage.setItem(key, JSON.stringify(payload.profile));
      }))}else{
        setProfile(null)
      }}
    ,[token]);

    return profile;
  }