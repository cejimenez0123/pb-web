import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { useLocation } from "react-router-dom";
export default function usePersistentMyStoriesCache(fetchData) {
    const pathname = useLocation().pathname
    const key = "cachedMyStories"
    const [stories, setStories] = useState(() => {
      const saved =localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
 
    });

  
    useEffect(() => {
      fetchData().then((res) => {
        checkResult(res,payload=>{
            if(payload.pageList){
            const {pageList} =payload

            localStorage.setItem(key,JSON.stringify(pageList))
            setStories(pageList)
            }
        },err=>{

        })
       
        });
      
    }, [pathname]);
  
    return stories;
  }