import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { useSelector } from "react-redux";
export default function usePersistentCurrentProfile(fetchData) {
    const key = "cachedMyProfile"
    const [profile, setProfile] = useState(() => {
      const saved =localStorage.getItem(key);
      return saved ? JSON.parse(saved) :null;
    });
  
    const pages = useSelector(state=>state.pages.pagesInView)
  const collections = useSelector(state=>state.books.collections)
    useEffect(() => {
      fetchData().then(res=>checkResult(res,payload=>{
        setProfile(payload.profile)
        localStorage.setItem(key, JSON.stringify(payload.profile));
      }))}
,[pages,collections]);

    return profile;
  }