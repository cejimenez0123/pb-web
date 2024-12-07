import axios from "axios";
import Enviroment from "../core/Enviroment";



 class CollectionRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    url = Enviroment.url+"/collection"
    token = "token"
    async getPublicBooks(){
        let res = await axios.get(this.url+"/public/book",{headers})
        return res.dxfata
    }
    async getPublicLibraries(){
        let res = await axios.get(this.url+"/public/library",{headers})
        return res.data
    }
    async getMyCollections(){

        let res = await axios.get(this.url+"/profile/private",{
            headers:{
                Authorization:"Bearer "+localStorage.getItem(this.token),
                'Access-Control-Allow-Origin': "*"
            }
        })
    
        return res.data
    }
    async getPublicProfilesCollections({id}){
        let res = await axios.get(this.url+`/id${id}/public`)
        return res.data
    }
    async createCollection({
        title,
        purpose,
        isPrivate,
        profileId,
        isOpenCollaboration
    }){
       
          
        let res = await axios.post(Enviroment.url+"/collection",{
            title:title,
            purpose,
            isPrivate:isPrivate,
            profileId:profileId,
            isOpenCollaboration:isOpenCollaboration
        },{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
        }})
        console.log(res)
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
        },{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
        }})
        return res.data
    }
    async addStoriesToCollection({collection,storyIdList}){
   
        let res = await axios.post(Enviroment.url+"/collection/"+collection.id+"/story/",{
            storyIdList:storyIdList
        })
        return res.data
    }
    async addCollectionToCollection({parentCollection,childCollection}){
     
        let res = await axios.post(this.url+"/"+parentCollection.id+"/collection/"+childCollection.id)
        return res.data
    }
    async deleteCollection({id}){
      
        let res = await axios.delete(this.url+"/"+id)
        return res.data
    }
    async getProfileLibraries({profile}){
    
        let res = await axios.get(Enviroment.url+"/profile/"+profile.id+"/library")
        return res.data
    }
  
    async fetchCollection({id}){
        const res = await axios.get(this.url+"/"+id)
        return res.data
    }
    async fetchCollectionProtected({id}){
        const res = await axios.get(this.url+"/"+id,{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
        }})
        return res.data
    }
    async getProfileBooks({profile}){
     
        let res = await axios.get(this.url+"/profile/"+profile.id+"/book")
        return res.data
    }
    async fetchSubCollectionsProtected({id}){
        const res = await axios.get(this.url+"/"+id+"/collection/protected",{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
        }})
    }
    async fetchSubCollectionsPublic({id}){
        const res = await axios.get(this.url+"/"+id+"/collection/public",{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
        }})}
}
export default new CollectionRepo()