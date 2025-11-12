import axios from "axios"
import Enviroment from "../core/Enviroment"
import { Preferences } from "@capacitor/preferences"
class ProfileRepo {
    url = Enviroment.url+"/profile"

    async all(){
        let res = await axios.get(this.url+"/")
        return res.data
    }
     headers= {
        'Access-Control-Allow-Origin': "*"
    }
    async getAuthHeaders() {
    const { value } = await Preferences.get({ key: "token" });
    if (!value) throw new Error("No token found");
  
    return {
      ...this.headers,
      Authorization: `Bearer ${value}`,
    };
  }
    async getMyProfiles(){
        const headers = await this.getAuthHeaders()

  try{
       const res = await axios.get(this.url+"/protected",{ headers:headers}
        )

        return res.data
    }catch(e){
        console.log(e)
        return e
    }
    }
    async create({email,token,password,username,profilePicture,selfStatement,privacy}){
        let headers = await this.getAuthHeaders()

        let res = await axios.post(this.url,
        {email,token,password,username,profilePicture,selfStatement,privacy},{
            headers:headers
        })

        return res.data
    }
    async notifications({token,profile}){
    let headers = await this.getAuthHeaders()




        let res = await axios.get(this.url+"/"+profile.id+"/alert",{headers:headers})
        console.log(res)
     return res.data

    }
    async register({uId,idToken,token,password,username,googleId,profilePicture,selfStatement,privacy}){

       const res = await axios.post(Enviroment.url+"/auth/register",{googleId,identityToken:idToken,token,password,username,
        profilePicture,selfStatement,privacy
       }) 

       return res.data
    
    }
    async getProfileProtected(params){
let headers = await this.getAuthHeaders()

        const {id}=params
        let res = await axios.get(this.url+"/"+id+"/protected",{headers:headers})
        return res.data
    }
    async getProfile(params){
        const {id}=params
        let res = await axios.get(this.url+"/"+id+"/public")
        return res.data
    }
    async updateProfile(params){
        let headers = await this.getAuthHeaders()

        let res = await axios.put(this.url+"/"+params.profile.id,{
            ...params
        },{headers:headers})
        console.log(res)
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