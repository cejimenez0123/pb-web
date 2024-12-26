import axios from "axios"
import Enviroment from "../core/Enviroment"


class HashtagRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    url=Enviroment.url+"/hashtag"
    token="token"
    async all(){
            let res = await axios.get(this.url+"/")
            return res.data
    }
    async create({name,profileId}){
       
   let res =    await axios.post(this.url,{
            name,profileId
        },{
            headers:{
                Authorization: "Bearer "+localStorage.getItem(this.token)
            }
        })
        return res.data
    }
    async fetch({storyId,profileId}){
     let res=  await axios.get(this.url+"/profile/"+profileId+"/story/"+storyId,{headers:{
            Authorization:"Bearer "+localStorage.getItem(this.token)
        }})
        return res.data
    }
    async fetchUserHashtagCommentUse({profileId}){
       let res = await axios.get(this.url+"/profile/"+profileId+"/comment",{headers:{
            Authorization:"Bearer "+localStorage.getItem(this.token)
        }})
        return res.data
    }
    async comment({name,commentId,profileId}){
        console.log(commentId)
        let res = await axios.post(this.url+"/comment/"+commentId,{name,profileId:profileId.id},{
            headers:{
                Authorization:"Bearer "+localStorage.getItem(this.token)
            }
        })
        return res.data
    }
    async story({name,storyId,profileId}){
        let res = await axios.post(this.url+"/story/"+storyId,{name,profileId},{
            headers:{
                Authorization:"Bearer "+localStorage.getItem(this.token)
            }})
        return res.data
    }
    async deleteComment({hashtagCommentId}){
      
            let res = await axios.delete(this.url+"/comment/"+hashtagCommentId,{
                headers:{
                    Authorization:"Bearer "+localStorage.getItem(this.token)
                
            }})
            return res.data
        
    }
    async deleteStory({id}){
      
        let res = await axios.delete(this.url+"/story/"+id,{
            headers:{
                Authorization:"Bearer "+localStorage.getItem(this.token)
            
        }})
        return res.data
    
}
    }

export default new HashtagRepo()