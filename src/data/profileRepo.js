import axios from "axios"
import Enviroment from "../core/Enviroment"

class ProfileRepo {
    url = Enviroment.url+"/profile"
    token="token"
    async all(){
        let res = await axios.get(this.url+"/")
        return res.data
    }
    async getMyProfiles({token}){
    
        let res = await axios.get(this.url+"/user/protected",{ headers:{
                Authorization:"Bearer "+token
            }}
        )

        return res.data
  
    }
    async create({email,token,password,username,profilePicture,selfStatement,privacy}){
        let res = await axios.post(Enviroment.url+"/profile/",
        {email,password,username,profilePicture,selfStatement,privacy},{
            headers:{
                Authorization:"Bearer "+localStorage.getItem(this.token)
            }
        })

        return res.data
    }
    async getCurrentProfile(auth){
        axios.get(Enviroment.url+"/profile")
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
        },{headers:{
            Authorization:"Bearer "+localStorage.getItem(this.token)
        }})
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