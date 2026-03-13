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
  async findWorkshops({radius=50,location,global=false}){
    const headers = await this.getAuthHeaders()
      const query = new URLSearchParams({ radius, global: global });
    let res = await axios.post(this.url+`/look?${query.toString()}`,{location},{headers:headers})
   return res.data
  }
async joinWorkshop({ profile, story, location, radius = 50, isGlobal = false }) {
 
  const headers = await this.getAuthHeaders();
  const query = new URLSearchParams({ radius, global: isGlobal });
  const res = await axios.post(
    `${this.url}/group/join?${query.toString()}`,
    { profile, story, locale:location },
    { headers }
  );
  return res.data;
}
// } joinGlobalWorkshop({profile,story,isGlobal=true}){
  //     const headers = await this.getAuthHeaders()
  //     let res = await axios.post(Enviroment.url+`/workshop/groups/?global=${isGlobal}`,{profile,story},{headers:headers})
  //    return res.data
  // }
    async postActiveUser({story,profile,location}){

 const headers = await this.getAuthHeaders()
    const response = await axios.post(Enviroment.url+`/workshop/active-users`,{
        story:story,
        profile:profile,
        location
      },{headers:headers}); 
      return response.data
    }
}

export default new WorkshopRepo()