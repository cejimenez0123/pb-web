import axios from "axios"
import Enviroment from "../core/Enviroment"
import {Preferences} from "@capacitor/preferences"
class HistoryRepo{
 
    url=Enviroment.url+"/history"
  headers= {
        'Access-Control-Allow-Origin': "*"
    }
   async getAuthHeaders() {
    const { value} = await Preferences.get({ key: "token" });
    return {
      ...this.headers,
      Authorization: `Bearer ${value}`,
    };
  }
    async storyCreate({profile,story}){
         const headers = await this.getAuthHeaders()
        let res= await axios.post(this.url+"/story",{profile,story},{headers:headers})
    return res.data
    }
    async collectionCreate({profile,collection}){
          const headers = await this.getAuthHeaders()
        let res= await axios.post(this.url+"/collection",{profile,collection},{headers:headers})
        return res.data
    }
}
export default new HistoryRepo()