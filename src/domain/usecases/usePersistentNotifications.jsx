import { useDispatch } from "react-redux";
import { useState ,useEffect} from "react";
import checkResult from "../../core/checkResult";
export default function usePersistentNotifications(fetchData) {
  
    const key = "cachedNotifications"
    const [payload, setPayload] = useState(() => {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    });
  
    useEffect(() => {
      if (!payload) {
      fetchData.then((res) => {
        checkResult(res,load=>{
            setPayload(load);
            localStorage.setItem(key, JSON.stringify(load));
        })
       
        });
      }
    }, [fetchData, payload]);
  
    return payload;
  }