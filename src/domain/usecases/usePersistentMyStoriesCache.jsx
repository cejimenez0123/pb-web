import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { Preferences} from "@capacitor/preferences"
import { useIonRouter } from "@ionic/react";
export default function usePersistentMyStoriesCache(fetchData) {
  const router = useIonRouter()
    const pathname = router.routeInfo.pathname
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