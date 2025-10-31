import { useDispatch } from "react-redux";
import { useState ,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { useSelector } from "react-redux";
import {Preferences} from "@capacitor/preferences"
export default function usePersistentNotifications(fetchData) {
  
    const key = "cachedNotifications"
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [payload, setPayload] = useState(async () => {
      const saved =(await Preferences.get(key)).value;
      return saved ? JSON.parse(saved) : null;
    });
  
    useEffect(() => {
 
      fetchData().then((res) => {
        checkResult(res,load=>{
            setPayload(load);
            Preferences.set(key, JSON.stringify(load));
        })
       
        });
      
    }, []);
  
    return payload;
  }