import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { useDispatch } from "react-redux";
import { setCollections } from "../../actions/CollectionActions";
import getLocalStore from "../../core/getLocalStore";
import DeviceCheck from "../../components/DeviceCheck";
import setLocalStore from "../../core/setLocalStore";
import { Preferences } from "@capacitor/preferences";
export default function usePersistentMyCollectionCache(fetchData) {
    const key = "cachedMyCols"
    const isNative = DeviceCheck()
    const [collections, setCols] = useState(async () => {
     let {value} = await Preferences.get(key)
         return value ? JSON.parse(value) : [];
    });
    const dispatch = useDispatch()
  
    useEffect(() => {
    console.log(fetchData)
      fetchData().then((res) => {
        checkResult(res,payload=>{
          console.log(payload)
            dispatch(setCollections({collections:payload.collections}))
            setCols(payload.collections);
            setLocalStore(key, JSON.stringify(payload.collections),isNative)
        })
       
        });
      
    }, []);
  
    return collections;
  }