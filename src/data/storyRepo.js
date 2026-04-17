import axios from "axios";
import Enviroment from "../core/Enviroment";

import { Preferences } from "@capacitor/preferences";


class StoryRepo{
    headers= {
          }
    url= Enviroment.url+"/story"
    
  async getAuthHeaders() {
    const { value } = await Preferences.get({ key: "token" });
    return {
      ...this.headers,
      Authorization: `Bearer ${value}`,
    };
  }
  
    async getPublicStories({ skip = 0, take = 20 } = {}) {
  const res = await axios.get(this.url + "/", {
    params: {
      skip,
      take,
    },
  });

  return res.data;
}
    async getPublicProfileStories({profileId}){
   
        let res = await axios.get(this.url+"/profile/"+profileId+"/public")
        
        return res.data
    }
        async getPrompts(){
   try{
        let res = await axios.get(this.url+"/prompts")
        
        return res.data
   }catch(err){

 return {error:err}
   }
             
    }
    async getProtectedProfileStories({ profileId, skip = 0, take = 20 } = {}) {
  const headers = await this.getAuthHeaders();

  const res = await axios.get(
    this.url + `/profile/${profileId}/protected`,
    {
      headers: { ...headers },
      params: {
        skip,
        take,
      },
    }
  );

  return res.data;
}
    // async getProtectedProfileStories({profileId}){
    //     let headers = await this.getAuthHeaders()
    //     let res = await axios.get(this.url+"/profile/"+profileId+"/protected",{
    //         headers:{...headers}
    //     })
  
    //     return res.data
    // }
    async recommendations(){
           let headers = await this.getAuthHeaders()
        let res = await axios.get(this.url+"/recommendations",{headers
     
        })

        return res.data
    }
    async getStoryProtected({id}){
         let headers = await this.getAuthHeaders()
        let res = await axios.get(this.url+"/"+id+"/protected",{
            headers
        })
       console.log(res)
        return res.data
    }
    async getStoryPublic({id}){
        let res = await axios.get(this.url+"/"+id+"/public")
      
        return res.data
    }

     async getMyStories({ skip = 0, take = 50 ,search=""} = {}) {
  try {
    const headers = await this.getAuthHeaders();



    const res = await axios.get(
      this.url + "/profile/protected",
      {
        headers,
        params: { skip, take,search}, // 🔥 THIS is the key
      }
    );

    console.log("GET MY STORIES", res);

    return res.data;
  } catch (e) {
    console.error("getMyStories failed:", e);
    throw e;
  }
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
            status,
            needsFeedback,
            commentable,
            type
           }=params
           console.log("Updating Story with params",params)
             let headers = await this.getAuthHeaders()
       const res = await axios.put(this.url+"/"+id,{
        ...params,
            data: data,
            isPrivate:isPrivate,
            page:page,
            status,
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
