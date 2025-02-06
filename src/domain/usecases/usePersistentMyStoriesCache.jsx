import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
export default function usePersistentMyStoriesCache(fetchData) {
    const key = "cachedMyStories"
    const [stories, setStories] = useState(() => {
      const saved =localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
 
    });

  
    useEffect(() => {
      fetchData().then((res) => {
        checkResult(res,payload=>{
          console.log(payload)
            // if(payload.pageList){
            // const {pageList} =payload
            // console.log(pageList)
            // localStorage.setItem(key,JSON.stringify(pageList))
            // setStories(pageList)
            // }
        },err=>{

        })
       
        });
      
    }, []);
  
    return stories;
  }