import { Preferences } from "@capacitor/preferences"
import DeviceCheck from "../components/DeviceCheck"


export default function setLocalStore(key,value,isNative){
    // const isNative = DeviceCheck()
    const setPrefences = async (k,v)=>{
        await Preferences.set({key:k,value:v})
      }
    const setLocalStorage =  (k,v)=>{
        localStorage.setItem(k,v)
       
      }
    if(isNative){
        setPrefences(key,value)
    }else{
        setLocalStorage(key,value)
    }
return <></>
}