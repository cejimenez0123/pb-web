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
        let res = await axios.post(this.url,
        {email,token,password,username,profilePicture,selfStatement,privacy},{
            headers:{
                Authorization:"Bearer "+token
            }
        })

        return res.data
    }

    async register({uId,token,password,username,profilePicture,selfStatement,privacy}){

       const res = await axios.post(Enviroment.url+"/auth/register",{uId,token,password,username,
        profilePicture,selfStatement,privacy
       },{headers:{
        Authorization:"Bearer "+token
       }}) 
       console.log(res.data)
       return res.data
    
    }
    async getProfile(params){
        const {id}=params
        let res = await axios.get(this.url+"/"+id)
        return res.data
    }
    async updateProfile(params){
        let res = await axios.put(this.url+"/"+params.profile.id,{
            ...params
        },{headers:{
            Authorization:"Bearer "+localStorage.getItem(this.token)
        }})
        return res.data
    }
    async getProfileBookmarkCollection({profileId}){
        let res = await axios.get(this.url+"/"+id+"/collection")
        return res.data
    }
    async createBookmark({profile,collection}){
        let res = await axios.post(this.url+"/"+profile.id+"/collection/"+collection.id)
        return res.data
    }
}

export default new ProfileRepo()