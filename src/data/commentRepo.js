import axios from "axios"
import Enviroment from "../core/Enviroment"
import { Preferences } from "@capacitor/preferences";

class CommentRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    token = "token"
    async create({profile,storyId,text,parentId}){
       let res = await axios.post(Enviroment.url+"/comment",{profileId:profile.id,storyId,text,parentId},
       {headers:{Authorization:"Bearer "+localStorage.getItem(this.token)}})
       return res.data
    }
    async helpful(){
        let res = await axios.get(Enviroment.url+"/comment/helpful")
        return res.data
    }
    async delete({id}){
       let token= (await Preferences.get({key:"token"})).value
    
        let res = await axios.delete(Enviroment.url+"/comment/"+id,
        {headers:
            {Authorization:"Bearer "+token}})
            console.log(res)
        return res.data
    }
   async update({id,text}){
    let res = await axios.patch(Enviroment.url+"/comment/"+id,{text},{headers:{Authorization:"Bearer "+localStorage.getItem(this.token)}})
    return res.data
   }

    }

export default new CommentRepo()