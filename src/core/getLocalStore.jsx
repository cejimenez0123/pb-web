import { Preferences } from "@capacitor/preferences"
import DeviceCheck from "../components/DeviceCheck"
export default  async function getLocalStore(key,isNative){
  
    const getPrefernces = async (k)=>{
       let {value }= await Preferences.get({key:k})
   
       return value
      }
 
    
  
     return  await getPrefernces(key).value
    
    
}