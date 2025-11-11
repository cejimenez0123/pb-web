import Enviroment from "../core/Enviroment"
import axios from "axios"
import { Preferences } from "@capacitor/preferences";
class LikeRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    url=Enviroment.url+"/like"
    // token="token"
      async getAuthHeaders() {
    const { value} = await Preferences.get({ key: "token" });
    return {
      ...this.headers,
      Authorization: `Bearer ${value}`,
    };
  }
    
    async storyCreate({story,profile}){
         const headers = await this.getAuthHeaders()
          let res =  await axios.post(this.url+"/story",{story,profile},{
                headers:headers
            })
            console.log(res.data)
            return res.data
    }
    async storyDelete({id}){
         const headers = await this.getAuthHeaders()
        let res =  await axios.delete(this.url+"/story/like/"+id,{
            headers:headers
            
        })
     
        return res.data
    }

}

export default new LikeRepo()