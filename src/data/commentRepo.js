import axios from "axios"
import Enviroment from "../core/Enviroment"
import { Preferences } from "@capacitor/preferences";

class CommentRepo{
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
    
    async create({profile,storyId,text,parentId}){
          const headers = await this.getAuthHeaders()
       let res = await axios.post(Enviroment.url+"/comment",{profileId:profile.id,storyId,text,parentId},
       {headers:headers})
       return res.data
    }
    async helpful(){
        let res = await axios.get(Enviroment.url+"/comment/helpful")
        return res.data
    }
    async delete({id}){
      const headers = await this.getAuthHeaders()
        let res = await axios.delete(Enviroment.url+"/comment/"+id,
        {headers:headers})
         
        return res.data
    }
   async update({id,text}){
      const headers = await this.getAuthHeaders()
    let res = await axios.patch(Enviroment.url+"/comment/"+id,{text},{headers:headers})
    return res.data
   }

    }

export default new CommentRepo()