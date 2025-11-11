import axios from "axios"
import Enviroment from "../core/Enviroment"

import {Preferences} from "@capacitor/preferences"

class RoleRepo{
    url=Enviroment.url+"/role"
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
    
    async patchRoles({roles,profileId,storyId}){
 const headers = await this.getAuthHeaders()
        let res = await axios.put(this.url+"/story",{roles,profileId,storyId},{headers:headers})
        return res.data
    }
    async storyRoles({storyId}){
         const headers = await this.getAuthHeaders()
        let res = await axios.get(this.url+"/story/"+storyId,{headers:headers
        })

        return res.data
    }
    async postCollectionRole({type,profileId,collectionId}){
         const headers = await this.getAuthHeaders()
       let res = await axios.post(this.url+"/collection",{type,profileId,collectionId},{headers:headers})
       
        return res.data
    }
    async deleteCollectionRole({role}){
         const headers = await this.getAuthHeaders()
        let res = await axios.delete(this.url+"/collection/"+role.id,{headers:headers})

        return res.data
    }
    async patchCollectionRoles({roles,profile,collection}){
 const headers = await this.getAuthHeaders()
        let res = await axios.put(this.url+"/collection",{roles,profileId:profile.id,collectionId:collection.id},
            {headers:headers})
        return res.data
    }
    async collectionRoles({collection}){
         const headers = await this.getAuthHeaders()
        let res = await axios.get(this.url+"/collection/"+collection.id,{headers:headers})
    
        return res.data
    }

}

export default new RoleRepo()