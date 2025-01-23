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
    async story({name,storyId,profile}){
        let res = await axios.post(this.url+"/story/"+storyId,{name,profile},{
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
async fetchStoryHashtagsProtected(params){
    let res = await axios.get(this.url+"/story/"+params.id+"/protected",{
        headers:{
            Authorization:"Bearer "+localStorage.getItem(this.token)
        
    }})

    return res.data

}
async fetchCollectionHashtagsProtected({id}){
    let res = await axios.get(this.url+"/collection/"+id+"/protected",{
        headers:{
            Authorization:"Bearer "+localStorage.getItem(this.token)
        
    }})

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
        let res = await axios.post(this.url+"/collection/"+colId,{name,profile},{
            headers:{
                Authorization:"Bearer "+localStorage.getItem(this.token)
            }})
        return res.data
    }
    async deleteCollection({hashId}){
        let res = await axios.delete(this.url+"/collection/"+hashId,{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
        }})
        return res.data
    }
    }

export default new HashtagRepo()