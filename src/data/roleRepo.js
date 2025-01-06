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
    async postCollectionRole({type,profileId,collectionId}){
       let res = await axios.post(this.url+"/collection",{type,profileId,collectionId},{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
        }})
        console.log("rsult",res)
        return res.data
    }
    async deleteCollectionRole({role}){
        let res = await axios.delete(this.url+"/collection/"+role.id,{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
        }})
        console.log("rsultd",res)
        return res.data
    }
    async patchCollectionRoles({roles,profile,collection}){

        let res = await axios.put(this.url+"/collection",{roles,profileId:profile.id,collectionId:collection.id},{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
        }})
        return res.data
    }
    async collectionRoles({collection}){
        let res = await axios.get(this.url+"/collection/"+collection.id,{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
        }})
    
        return res.data
    }

}

export default new RoleRepo()