import { useDispatch } from "react-redux";
import { useState ,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { useSelector } from "react-redux";
export default function usePersistentNotifications(fetchData) {
  
    const key = "cachedNotifications"
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [payload, setPayload] = useState(() => {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    });
  
    useEffect(() => {
 
      fetchData().then((res) => {
        checkResult(res,load=>{
            setPayload(load);
            localStorage.setItem(key, JSON.stringify(load));
        })
       
        });
      
    }, []);
  
    return payload;
  }