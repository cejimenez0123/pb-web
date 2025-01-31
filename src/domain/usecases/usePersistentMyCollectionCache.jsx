import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
export default function usePersistentMyCollectionCache(fetchData) {
    const key = "cachedMyCols"
    const [collections, setCols] = useState(() => {
      const saved =localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    });
  
    useEffect(() => {
      if (!collections) {
      fetchData.then((res) => {
        checkResult(res,payload=>{
            console.log(payload)
            setCols(payload.collections);
            localStorage.setItem(key, JSON.stringify(payload.collections));
        })
       
        });
      }
    }, [fetchData, collections]);
  
    return collections;
  }