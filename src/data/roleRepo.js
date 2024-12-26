import axios from "axios"
import Enviroment from "../core/Enviroment"



class RoleRepo{
    url=Enviroment.url+"/role"
    token = "token"
    async patchRoles({roles,profileId,storyId}){

        let res = await axios.put(this.url+"/story",{roles,profileId,storyId},{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
        }})
        return res.data
    }
    async storyRoles({storyId}){
        let res = await axios.get(this.url+"/story/"+storyId,{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
        }})
        console.log(res)
        return res.data
    }

}

export default new RoleRepo()