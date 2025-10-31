import axios from "axios";
import Enviroment from "../core/Enviroment";

import { Preferences } from "@capacitor/preferences";


class StoryRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    url= Enviroment.url+"/story"
    
  async getAuthHeaders() {
    const { value } = await Preferences.get({ key: "token" });
    return {
      ...this.headers,
      Authorization: `Bearer ${value}`,
    };
  }
    async getPublicStories(){
        let res = await  axios.get(this.url+"/",{headers:{'Access-Control-Allow-Origin': "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"}})
        return res.data

    }
    async getPublicProfileStories({profileId}){
        console.log("profileId",profileId)
        let res = await axios.get(this.url+"/profile/"+profileId+"/public")
        
        return res.data
    }
    async getProtectedProfileStories({profileId}){
        let headers = await this.getAuthHeaders()
        let res = await axios.get(this.url+"/profile/"+profileId+"/protected",{
            headers:headers
        })
  
        return res.data
    }
    async recommendations(){
           let headers = await this.getAuthHeaders()
        let res = await axios.get(this.url+"/recommendations",{headers
     
        })
        return res.data
    }
    async getStoryProtected({id}){
         let headers = await this.getAuthHeaders()
        let res = await axios.get(this.url+"/"+id+"/protected",{
            headers:headers
        })
       
        return res.data
    }
    async getStoryPublic({id}){
        let res = await axios.get(this.url+"/"+id+"/public")
      
        return res.data
    }
    async getMyStories(){
         let headers =await this.getAuthHeaders()
   
        let res = await axios.get(this.url+"/profile/protected/",{
            headers:headers
        })
     
        return res.data
    }
    async getPublicProfileStories({profileId}){
        let res = await axios.get(this.url+"/profile/"+profileId+"/public")
        return res.data
    }
    async postStory({ 
        profileId,
        data,
        isPrivate,
        approvalScore,
        type,
        title,
        commentable}){
       let headers = await this.getAuthHeaders()
        const res = await axios.post(this.url,{
            title,data,isPrivate,authorId:profileId,commentable:commentable,
            type
    },{headers})
        return res.data
    }
    async updateStory(params){
        const { 
            id,
            page,
            data,
            isPrivate,
            description,
            approvalScore,
            title,
            needsFeedback,
            commentable,
            type
           }=params
             let headers = await this.getAuthHeaders()
       const res = await axios.put(this.url+"/"+id,{
            data: data,
            isPrivate:isPrivate,
            description,
            needsFeedback,
            approvalScore:approvalScore,
            title:title,
            commentable:commentable,
            type
         },{headers
        })

       
         return res.data
    }
    async deleteStory({id}){
          let headers = await this.getAuthHeaders()
        let res = await axios.delete(this.url+"/"+id,
        {headers:headers
    })
        return res.data
        
    }
    async getCollectionStoriesProtected({id}){
          let headers = await this.getAuthHeaders()
        let res = await axios.get(this.url+"/collection/"+id+"/protected",{
            headers:headers
    })
   
    return res.data
    }
    async fetchCommentsOfPagePublic({pageId}){
        let res = await axios.get(this.url+"/"+pageId+"/comment/public")
        
        
        return res.data
    }
    async fetchCommentsOfPageProtected({pageId}){
          let headers = await this.getAuthHeaders()
        let res = await axios.get(this.url+"/"+pageId+"/comment/protected",{headers:headers})
        
        
        return res.data
    }
    async getCollectionStoriesPublic({id}){
        let res = await axios.get(this.url+"/collection/"+id+"/public")

        return res.data
    }
    async fetchEvents({days=7}){
        let res = await axios.get(this.url+"/events/"+days)

        return res.data
    }
}
export default new StoryRepo()
