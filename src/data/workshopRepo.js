import Enviroment from "../core/Enviroment"
import axios from "axios"
import { Preferences } from "@capacitor/preferences";
class WorkshopRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    url= Enviroment.url+"/workshop"
     async getAuthHeaders() {
    const { value} = await Preferences.get({ key: "token" });
    return {
      ...this.headers,
      Authorization: `Bearer ${value}`,
    };
  }
    async joinWorkshop({profile,story,location}){
      const headers = await this.getAuthHeaders()
        let res = await axios.post(Enviroment.url+'/workshop/groups',{profile,story,location},{headers:headers})
       return res.data
    }
    async joinGlobalWorkshop({profile,story}){
      const headers = await this.getAuthHeaders()
      let res = await axios.post(Enviroment.url+'/workshop/groups/global',{profile,story},{headers:headers})
     return res.data
  }
    async postActiveUser({story,profile}){

 const headers = await this.getAuthHeaders()
    const response = await axios.post(Enviroment.url+`/workshop/active-users`,{
        story:story,
        profile:profile
      },{headers:headers}); 
      return response.data
    }
}

export default new WorkshopRepo()