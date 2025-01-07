import axios from "axios";
import Enviroment from "../core/Enviroment";




class StoryRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    url= Enviroment.url+"/story"
    
    token = "token"
    async getPublicStories(){
        let res = await  axios.get(this.url,{headers:{'Access-Control-Allow-Origin': "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"}})
        return res.data

    }
    async getPublicProfileStories({profileId}){
        let res = await axios.get(this.url+"/profile/"+profileId+"/public")
        return res.data
    }
    async getProtectedProfileStories({profileId}){
        let res = await axios.get(this.url+"/profile/"+profileId+"/protected",{
            headers:{
                Authorization:"Bearer "+localStorage.getItem("token")
            }
        })

        return res.data
    }
    async recommendations(){
        let res = await axios.get(this.url+"/recommendations",{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
        }})
        return res.data
    }
    async getStoryProtected({id}){
        let res = await axios.get(this.url+"/"+id+"/protected",{
            headers:{
                Authorization:"Bearer "+localStorage.getItem(this.token)
            }
        })
       
        return res.data
    }
    async getStoryPublic({id}){
        let res = await axios.get(this.url+"/"+id+"/public")
        return res.data
    }
    async getMyStories({profile,draft=""}){
        let res = await axios.get(this.url+"/profile/private/"+draft,{
            headers:{
                Authorization:"Bearer "+localStorage.getItem(this.token)
                
            }
        })
        console.log(res)
        return res.data
    }
    async getPublicProfileStories({profileId}){
        let res = await axios.get(this.url+"/profile"+profileId)
        return res.data
    }
    async postStory({ 
        profileId,
        data,
        privacy,
        approvalScore,
        type,
        title,
        commentable}){
     
        const res = await axios.post(this.url,{
            title,data,isPrivate:privacy,authorId:profileId,commentable:commentable,
            type
    },{headers:{
        Authorization: "Bearer "+localStorage.getItem(this.token)
    }})
        return res.data
    }
    async updateStory(params){
        const { 
            page,
            data,
            privacy,
            approvalScore,
            title,
            commentable,
            type
           }=params
       const res = await axios.put(this.url+"/"+page.id,{
            data: data,
            isPrivate:privacy,
            approvalScore:approvalScore,
            title:title,
            commentable:commentable,
            type
         },{headers:{
            Authorization: "Bearer "+localStorage.getItem(this.token)
        }})
       
         return res.data
    }
    async deleteStory({id}){
    
       
        let res = await axios.delete(this.url+"/"+id,
        {headers:{
            Authorization: "Bearer "+localStorage.getItem(this.token)
    }})
        return res.data
        
    }
    async getCollectionStoriesProtected({id}){
        let res = await axios.get(this.url+"/collection/"+id+"/protected",{
            headers:{
                Authorization: "Bearer "+localStorage.getItem(this.token)
    }})
   
    return res.data
    }
    async fetchCommentsOfPagePublic({pageId}){
        let res = await axios.get(this.url+"/"+pageId+"/comment/public")
        
        
        return res.data
    }
    async fetchCommentsOfPageProtected({pageId}){
        let res = await axios.get(this.url+"/"+pageId+"/comment/public",{headers:{
            Authorization: "Bearer "+localStorage.getItem(this.token)
        }})
        
        
        return res.data
    }
    async getCollectionStoriesPublic({id}){
        let res = await axios.get(this.url+"/collection/"+id+"/public")

        return res.data
    }
}
export default new StoryRepo()
