import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { useLocation } from "react-router-dom";
import { Preferences} from "@capacitor/preferences"
export default function usePersistentMyStoriesCache(fetchData) {
    const pathname = useLocation().pathname
    const key = "cachedMyStories"
    const [stories, setStories] = useState(async() => {
     
      const saved =(await (Preferences.get(key))).value;
      return saved ? JSON.parse(saved) : [];
 
    });

  
    useEffect(() => {
      fetchData().then((res) => {
        checkResult(res,payload=>{
            if(payload.pageList){
            const {pageList} =payload

          Preferences.set(key,JSON.stringify(pageList))
            setStories(pageList)
            }
        },err=>{

        })
       
        });
      
    }, [pathname]);
  
    return stories;
  }