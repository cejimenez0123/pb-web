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
      
//   try{
        let res = await axios.get(this.url+"/protected",{ headers:{
                Authorization:"Bearer "+token
            }}
        )
        console.log("VDVD",res)

        return res.data
    // }catch(e){
    //     console.log(e)
    // }
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
    async notifications({token,profile}){
    



        let res = await axios.get(this.url+"/"+profile.id+"/alert",{headers:{
            Authorization:"Bearer "+token
        }})
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
        const token = localStorage.getItem("token")
        const {id}=params
        let res = await axios.get(this.url+"/"+id+"/protected",{headers:{
            Authorization:"Bearer "+token
        }})
        return res.data
    }
    async getProfile(params){
        const {id}=params
        let res = await axios.get(this.url+"/"+id+"/public")
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