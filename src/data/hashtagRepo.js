import axios from "axios"
import Enviroment from "../core/Enviroment"
import { Preferences } from "@capacitor/preferences"


class HashtagRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    
    url=Enviroment.url+"/hashtag"
    async getAuthHeaders() {
    const { value} = await Preferences.get({ key: "token" });
    return {
      ...this.headers,
      Authorization: `Bearer ${value}`,
    };
  }
    async all(){
            let res = await axios.get(this.url+"/")
            return res.data
    }
    async fetch({id}){
        let res = await axios.get(this.url+"/"+id)
        return res.data
    }
    async create({name,profileId}){
        const headers = await this.getAuthHeaders()
   let res =    await axios.post(this.url,{
            name,profileId
        },{
            headers:headers
        })
        return res.data
    }
    async fetchStoryHashtag({storyId,profileId}){
          const headers = await this.getAuthHeaders()
     let res=  await axios.get(this.url+"/profile/"+profileId+"/story/"+storyId,{headers:headers})
        return res.data
    }
    async fetchUserHashtagCommentUse({profileId}){
          const headers = await this.getAuthHeaders()
       let res = await axios.get(this.url+"/profile/"+profileId+"/comment",{headers:headers})
        return res.data
    }
    async comment({name,commentId,profileId}){
    const headers = await this.getAuthHeaders()
        let res = await axios.post(this.url+"/comment/"+commentId,{name,profileId:profileId.id},{
            headers:headers
        })
        return res.data
    }
    async story({name,storyId,profile}){
          const headers = await this.getAuthHeaders()
        let res = await axios.post(this.url+"/story/"+storyId,{name,profile},{
            headers:headers})
        return res.data
    }
    async deleteComment({hashtagCommentId}){
        const headers = await this.getAuthHeaders()
            let res = await axios.delete(this.url+"/comment/"+hashtagCommentId,{
                headers:headers})
            return res.data
        
    }
    async deleteStory({id}){
        const headers = await this.getAuthHeaders()
        let res = await axios.delete(this.url+"/story/"+id,{
            headers:headers})
        return res.data
    
}
async fetchStoryHashtagsProtected(params){
      const headers = await this.getAuthHeaders()
    let res = await axios.get(this.url+"/story/"+params.id+"/protected",{
        headers:headers})

    return res.data

}
async fetchCollectionHashtagsProtected({id}){
      const headers = await this.getAuthHeaders()
    let res = await axios.get(this.url+"/collection/"+id+"/protected",{
        headers:headers})

    return res.data

}
async fetchStoryHashtagsPublic({id}){
    let res = await axios.get(this.url+"/collection/"+id+"/public")
        return res.data
}
    async fetchStoryHashtagsPublic(params){
        let res = await axios.get(this.url+"/story/"+params.id+"/public")
            return res.data
    }
    async collection({name,colId,profile}){
          const headers = await this.getAuthHeaders()
        let res = await axios.post(this.url+"/collection/"+colId,{name,profile},{
            headers:headers})
        return res.data
    }
    async deleteCollection({colId,hashId}){
          const headers = await this.getAuthHeaders()
          console.log("XC<",hashId)
        let res = await axios.delete(this.url+"/collection/"+colId+"/hash/"+hashId,{headers:headers})
        return res.data
    }
    }

export default new HashtagRepo()