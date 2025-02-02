import { useState,useEffect} from "react";
import checkResult from "../../core/checkResult";
import { useDispatch } from "react-redux";
import { setCollections } from "../../actions/CollectionActions";
export default function usePersistentMyCollectionCache(fetchData) {
    const key = "cachedMyCols"
    const [collections, setCols] = useState(() => {
      const saved =localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    });
    const dispatch = useDispatch()
  
    useEffect(() => {
    
      fetchData().then((res) => {
        checkResult(res,payload=>{

            dispatch(setCollections({collections:payload.collections}))
            setCols(payload.collections);
            localStorage.setItem(key, JSON.stringify(payload.collections));
        })
       
        });
      
    }, []);
  
    return collections;
  }