import { Preferences } from "@capacitor/preferences"
import DeviceCheck from "../components/DeviceCheck"
export default  async function getLocalStore(key,isNative){
  
    const getPrefernces = async (k)=>{
       return await Preferences.get({key:k})
      }
    const getLocalStorage =  (k)=>{
        return localStorage.getItem(k)
       
      }
    if(isNative){
     return  (await getPrefernces(key)).value
    }else{
     return  getLocalStorage(key)
    }
    
}