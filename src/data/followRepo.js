import axios from "axios"
import Enviroment from "../core/Enviroment"
import { Preferences } from "@capacitor/preferences";
class FollowRepo{
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
    async create({follower,following}){
        let headers = await this.getAuthHeaders()
       let res = await axios.post(Enviroment.url+"/follow",{follower,following},
       {headers:headers})
 
       return res.data
    }
    
    async delete({id}){
         let headers = await this.getAuthHeaders()
        let res = await axios.delete(Enviroment.url+"/follow/"+id,{headers:
            headers})
        return res.data
    }


}
export default new FollowRepo()
 