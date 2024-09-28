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
    async createCollection({name,
        profileId,
        purpose,
        privacy,
        writingIsOpen,
        }){
       
          
        let res = await axios.post(Enviroment.url+"/collection",{
            title:name,
            purpose,
            isPrivate:privacy,
            profileId:profileId,
            isOpenCollaboration:writingIsOpen
        })
        return res.data
    }
    async updateCollection({id,title,
    purpose,
    isPrivate,
    isOpenCollaboration}){
        let res = await axios.put(Enviroment.url+"/collection/"+id,{
            title,
            purpose,
            isPrivate,
            isOpenCollaboration
        })
        return res.data
    }
    async addStoriesToCollection({collection,storyIdList}){
   
        let res = await axios.post(Enviroment.url+"/collection/"+collection.id+"/story/",{
            storyIdList:storyIdList
        })
        return res.data
    }
    async addCollectionToCollection({parentCollection,childCollection}){
     
        let res = await axios.post(Enviroment.url+"/collection/"+parentCollection.id+"/collection/"+childCollection.id)
        return res.data
    }
    async deleteCollection({id}){
      
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