import axios from "axios";
import Enviroment from "../core/Enviroment";
import { Preferences } from "@capacitor/preferences";



 class CollectionRepo{
  headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  async getAuthHeaders() {
    const { value } = await Preferences.get({ key: "token" });
    return {
      ...this.headers,
      Authorization: `Bearer ${value}`,
    };

  }
  url=Enviroment.url+"/collection"
    async getPublicBooks(){
        let res = await axios.get(this.url+"/public/book",this.headers)
        return res.data
    }
    async getPublicLibraries(){
        let res = await axios.get(this.url+"/public/library",this.headers)
        return res.data
    }
    async getMyCollections(){
         const headers = await this.getAuthHeaders();
        let res = await axios.get(this.url+"/profile/protected/",{
            headers
        })
    console.log("GETMY",res)
        return res.data
    }
    async getPublicProfileCollections({id}){
        let res = await axios.get(this.url+`/profile/${id}/public`)
        return res.data
    }
    async getProtectedProfileCollections({id}){
        let res = await axios.get(this.url+`/profile/${id}/private`,{headers:{
            Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
        }})
        return res.data
    }
    async createCollection({
        title,
        purpose,
        isPrivate,
        profileId,
        type,
        location,
        isOpenCollaboration
    }){
       
          
        let res = await axios.post(Enviroment.url+"/collection",{
            title:title,
            purpose,
            isPrivate:isPrivate,
            profileId:profileId,
            type,
            location,
            isOpenCollaboration:isOpenCollaboration
        },{headers:{
            Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
        }})

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
            Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
        }})
        return res.data
    }
    async patchCollectionRoles({roles,profileId,colId}){
        let res = await axios.patch(this.url+"/"+colId+"/role",{
                    roles,
                    profileId
                },{headers:{
                    Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
                }})

        return res.data
    }
    async updateCollectionContent({id,title,purpose,isPrivate,isOpenCollaboration,storyToCol,colToCol,col,profile}){
            let res = await axios.patch(this.url+"/"+id,
            {id,title,purpose,isPrivate,isOpenCollaboration,storyToCol,colToCol,col,profile},{headers:{
                Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
            }})
            console.log("SCC",res)
            return res.data
        }

    async addCollectionListToCollection({id,list,profile}){
        let res = await axios.post(this.url+"/"+id+"/collection",{
            list:list,
            profile
        },{headers:{
            Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
        }})

        return res.data
    }
    async addStoryListToCollection({id,list,profile}){
        
        let res = await axios.post(this.url+"/"+id+"/story",{
            list,
            profile
        },{headers:{
            Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
        }})
        return res.data
    }
    async addCollectionToCollection({parentCollection,childCollection}){
     
        let res = await axios.post(this.url+"/"+parentCollection.id+"/collection/"+childCollection.id)
        return res.data
    }

    async deleteCollection({id}){
      
        let res = await axios.delete(this.url+"/"+id,
            {headers:{
                Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
            }}
        )

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
        let headers = await this.getAuthHeaders()
        const res = await axios.get(this.url+"/col/"+id+"/protected",{headers:headers
        })
        console.log(res)
        return res.data
    }
    async getProfileBooks({profile}){
     
        let res = await axios.get(this.url+"/profile/"+profile.id+"/book")
        return res.data
    }
    async deleteCollectionToCollection({tcId}){
        let res = await axios.delete(this.url+"/colToCol/"+tcId,
            {headers:{
                Authorization: "Bearer "+(await Preferences.get({key:"token"})).value
            }}
        )
        console.log(res)
        return res.data
    }
    async deleteStoryToCollection({stId}){

        let res=  await axios.delete(this.url+"/storyToCol/"+stId,
             {headers:{
                 Authorization: "Bearer "+(await Preferences.get({key:"token"})).value
             }}
         )
 
         return res.data
     }
    async fetchSubCollectionsProtected({id}){
        const res = await axios.get(this.url+"/"+id+"/collection/protected",{headers:{
            Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
        }})
      
        return res.data
    }
    async postProfileToCollection({collection,type,token}){
        const res = await axios.post(this.url+"/home",{collection,type},{
            headers:{
                Authorization:"Bearer "+token
            }
        })
        console.log(res)
        return res.data

    }
    async recommendedColCollections({colId}){
        const res = await axios.get(this.url+"/"+colId+"/recommendations",)

        return res.data
    }
    async recommendations(){
        const res = await axios.get(this.url+"/recommendations",{headers:{
            Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
        }})

        return res.data
    }
    async recommendedStories({colId}){
        const res = await axios.get(this.url+"/"+colId+"/story/recommendations",{headers:{
         Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
        }})
   
        return res.data
    }
    async fetchSubCollectionsPublic({id}){
        const res = await axios.get(this.url+"/"+id+"/collection/public")
       
        return res.data
    }
}
export default new CollectionRepo()