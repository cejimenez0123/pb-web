import axios from "axios";
import Enviroment from "../core/Enviroment";



 class CollectionRepo{
    async getPublicBooks(){
        let res = await axios.get(Enviroment.url+"/collection/book")
        return res.data
    }
    async getPublicLibraries(){
        let res = await axios.get(Enviroment.url+"/collection/library")
        return res.data
    }
    async createCollection(data){
       
            let {name,
            profileId,
            purpose,
            privacy,
            writingIsOpen,
            }=data
        let res = await axios.post(Enviroment.url+"/collection",{
            title:name,
            purpose,
            isPrivate:privacy,
            profileId:profileId,
            isOpenCollaboration:writingIsOpen
        })
        return res.data
    }
    async updateCollection(data){
        const {id }= data
        let res = await axios.put(Enviroment.url+"/collection/"+id)
        return res.data
    }
    async addStoryToCollection(data){
        const {collection,story}=data
        let res = await axios.post(Enviroment.url+"/collection/"+collection.id+"/story/"+story.id)
        return res.data
    }
    async addCollectionToCollection(data){
        let {parentCollection,childCollection}=data
        let res = await axios.post(Enviroment.url+"/collection/"+parentCollection.id+"/collection/"+childCollection.id)
        return res.data
    }
    async deleteCollection(data){
        let {id}=data
        let res = await axios.delete(Enviroment.url+"/collection/"+id)
        return res.data
    }
    async getProfileLibraries({profile}){
    
        let res = await axios.get(Enviroment.url+"/collection/profile/"+profile.id+"/library")
        return res.data
    }
  
    async fetchCollection({id}){
        const res = await axios.get(Enviroment.url+"/collection/"+id)
        return res.data
    }
    async getProfileBooks({profile}){
     
        let res = await axios.get(Enviroment.url+"/collection/profile/"+profile.id+"/book")
        return res.data
    }
}
export default new CollectionRepo()