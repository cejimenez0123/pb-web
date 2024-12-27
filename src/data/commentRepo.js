import axios from "axios"
import Enviroment from "../core/Enviroment"


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
    
    async delete({id}){
        let res = await axios.post(Enviroment.url+"/comment/"+id,{profile,text},{headers:{Authorization:"Bearer "+localStorage.getItem(this.token)}})
        return res.data
    }
   async update({id,text,profile}){
    let res = await axios.post(Enviroment.url+"/comment/"+id,{profile,text},{headers:{Authorization:"Bearer "+localStorage.getItem(this.token)}})
    return res.data
   }

    }

export default new CommentRepo()