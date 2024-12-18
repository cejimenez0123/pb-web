import axios from "axios"
import Enviroment from "../core/Enviroment"



class RoleRepo{
    url=Enviroment.url+"/role"
    token = "token"
    async create({role,profileId,storyId}){

        await axios.post(this.url,{role,profileId,storyId},{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
        }})
    }

}

export default new RoleRepo()