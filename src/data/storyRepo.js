import axios from "axios";
import Enviroment from "../core/Enviroment";




class StoryRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    url = Enviroment.url
    token = localStorage.getItem("token")
    async getPublicStories(){
        let res = await  axios.get(this.url+"/story",{headers:{'Access-Control-Allow-Origin': "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"}})
        return res.data

    }
    async getProfileStories({profileId}){
        let res = await axios.get(Enviroment.url+"/story/profile/"+profileId+"/protected",{headers:{
            Authorization: "Bearer "+this.token,'Access-Control-Allow-Origin':"*"
        }})
        return res.data
    }
    async getPublicProfileStories({profileId}){
        let res = await axios.get(Enviroment.url+"/story/profile"+profileId)
    }
    async postStory(params){
        const { 
            profileId,
            data,
            privacy,
            approvalScore,
            type,
            title,
            commentable}=params
        const res = await axios.post(this.url+"/story",{
            title,data,isPrivate:privacy,authorId:profileId,commentable:commentable,
            type
    },{headers:{
        Authorization: "Bearer "+this.token
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
           }=params
       const res = await axios.put(this.url+"/story/"+page.id,{
            data: data,
            isPrivate:privacy,
            approvalScore:approvalScore,
            title:title,
            commentable:commentable,
            approvalScore: page.approvalScore
         },{headers:{
            Authorization: "Bearer "+this.token
        }})
         return res.data
    }
    async deleteStory({id}){
    
        let res = await axios.delete(this.url+"/story/"+id,
        {headers:{
            Authorization: "Bearer "+this.token
    }})
        return res.data
    }
}
export default new StoryRepo()
