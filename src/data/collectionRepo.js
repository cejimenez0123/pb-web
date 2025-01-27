import axios from "axios";
import Enviroment from "../core/Enviroment";



 class CollectionRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    url = Enviroment.url+"/collection"
    token = "token"
    async getPublicBooks(){
        let res = await axios.get(this.url+"/public/book",this.headers)
        return res.data
    }
    async getPublicLibraries(){
        let res = await axios.get(this.url+"/public/library",this.headers)
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
    async getPublicProfileCollections({id}){
        let res = await axios.get(this.url+`/profile/${id}/public`)
        return res.data
    }
    async getProtectedProfileCollections({id}){
        let res = await axios.get(this.url+`/profile/${id}/protected`,{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
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
            Authorization:"Bearer "+localStorage.getItem("token")
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
            Authorization:"Bearer "+localStorage.getItem("token")
        }})
        return res.data
    }
    async patchCollectionRoles({roles,profileId,colId}){
        let res = await axios.patch(this.url+"/"+colId+"/role",{
                    roles,
                    profileId
                },{headers:{
                    Authorization:"Bearer "+localStorage.getItem("token")
                }})

        return res.data
    }
    async updateCollectionContent({id,title,purpose,isPrivate,isOpenCollaboration,storyToCol,colToCol,col,profile}){
            let res = await axios.patch(this.url+"/"+id,
            {id,title,purpose,isPrivate,isOpenCollaboration,storyToCol,colToCol,col,profile},{headers:{
                Authorization:"Bearer "+localStorage.getItem("token")
            }})
            return res.data
        }

    async addCollectionListToCollection({id,list,profile}){
        let res = await axios.post(this.url+"/"+id+"/collection",{
            list:list,
            profile
        },{headers:{
            Authorization:"Bearer "+localStorage.getItem(this.token)
        }})
   
        return res.data
    }
    async addStoryListToCollection({id,list,profile}){
        
        let res = await axios.post(this.url+"/"+id+"/story",{
            list,
            profile
        },{headers:{
            Authorization:"Bearer "+localStorage.getItem(this.token)
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
                Authorization:"Bearer "+localStorage.getItem("token")
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
        const res = await axios.get(this.url+"/"+id+"/protected",{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
        }})
        return res.data
    }
    async getProfileBooks({profile}){
     
        let res = await axios.get(this.url+"/profile/"+profile.id+"/book")
        return res.data
    }
    async deleteCollectionToCollection({id,childCollectionId}){
        let res = await axios.delete(this.url+"/"+id+"/collection/"+childCollectionId,
            {headers:{
                Authorization: "Bearer "+localStorage.getItem("token")
            }}
        )
        return res.data
    }
    async deleteStoryToCollection({id,storyId}){
       let res=  await axios.delete(this.url+"/"+id+"/story/"+storyId,
            {headers:{
                Authorization: "Bearer "+localStorage.getItem("token")
            }}
        )

        return res.data
    }
    async fetchSubCollectionsProtected({id}){
        const res = await axios.get(this.url+"/"+id+"/collection/protected",{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
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
            Authorization:"Bearer "+localStorage.getItem(this.token)
        }})

        return res.data
    }
    async recommendedStories({colId}){
        const res = await axios.get(this.url+"/"+colId+"/story/recommendations",{headers:{
         "Authorization":"Bearer "+localStorage.getItem("token")
        }})
   
        return res.data
    }
    async fetchSubCollectionsPublic({id}){
        const res = await axios.get(this.url+"/"+id+"/collection/public")
       
        return res.data
    }
}
export default new CollectionRepo()