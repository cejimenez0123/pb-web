import Enviroment from "../core/Enviroment"
import axios from "axios"
import { Preferences } from "@capacitor/preferences";
class WorkshopRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    url= Enviroment.url+"/workshop"
    token = "token"
    async joinWorkshop({profile,story,location}){
        let res = await axios.post(Enviroment.url+'/workshop/groups',{profile,story,location},{headers:{
            Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
        }})
       return res.data
    }
    async joinGlobalWorkshop({profile,story}){
      let res = await axios.post(Enviroment.url+'/workshop/groups/global',{profile,story},{headers:{
          Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
      }})
     return res.data
  }
    async postActiveUser({story,profile}){


    const response = await axios.post(Enviroment.url+`/workshop/active-users`,{
        story:story,
        profile:profile
      },{headers:{
        Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
      }}); 
      return response.data
    }
}

export default new WorkshopRepo()