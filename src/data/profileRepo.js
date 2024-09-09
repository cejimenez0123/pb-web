import axios from "axios"
import Enviroment from "../core/Enviroment"



class ProfileRepo {

    async getUsersProfiles(params){
        const {id}=params
        let res = await axios.get(Enviroment.url+"/profile/user/"
            +id
        )
        return res.data
    }
    async getProfile(params){
        const {id}=params
        let res = await axios.get(Enviroment.url+"/profile/"+id)
        return res.data
    }
    async updateProfile(params){
        let res = await axios.put(Enviroment.url+"/profile/"+params.profile.id,{
            ...params
        })
        return res.data
    }
}

export default new ProfileRepo()