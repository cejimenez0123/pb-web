import axios from "axios"
import Enviroment from "../core/Enviroment"

class ProfileRepo {
    async startSession({uId,email}){
        const res = axios.post(Enviroment.url+"/auth/session",{uId,email})
        return res.data
    }
    async getUsersProfiles(params){
        const {id}=params
        let res = await axios.get(Enviroment.url+"/profile/user/"
            +id
        )
        return res.data
    }
    async register({uId,email,password,username,profilePicture,selfStatement,privacy}){
       const res = await axios.post(Enviroment.url+"/auth/register",{uId,email,password,username,
        profilePicture,selfStatement,privacy
       })
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
    async getProfileBookmarkCollection({profileId}){
        let res = await axios.get(Enviroment.url+"/profile/"+id+"/collection")
        return res.data
    }
    async createBookmark({profile,collection}){
        let res = await axios.post(Enviroment.url+"/profile/"+profile.id+"/collection/"+collection.id)
        return res.data
    }
}

export default new ProfileRepo()