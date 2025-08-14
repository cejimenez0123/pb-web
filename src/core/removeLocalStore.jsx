import { Preferences } from "@capacitor/preferences"
import DeviceCheck from "../components/DeviceCheck"
export default  async function getLocalStore(ke,isNative){
    // const isNative = DeviceCheck()
    const removePrefernces = async (k)=>{
       return await Preferences.remove({key:k})
      }
    const removeLocalStorage =  (k)=>{
        return localStorage.removeItem(k)
       
      }
    if(isNative){
     return  removePrefernces(key)
    }else{
     return  removeLocalStorage(key)
    }
    return <></>
}