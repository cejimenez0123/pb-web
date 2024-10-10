import axios from "axios";
import Enviroment from "../core/Enviroment";




class StoryRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    url= Enviroment.url+"/story"
    
    token = localStorage.getItem("token")
    async getPublicStories(){
        let res = await  axios.get(this.url,{headers:{'Access-Control-Allow-Origin': "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"}})
        return res.data

    }
    async getProfileStories({profileId}){
        let res = await axios.get(this.url+"/profile/"+profileId+"/public",{headers:{
            Authorization: "Bearer "+this.token,'Access-Control-Allow-Origin':"*"
        }})
        return res.data
    }
    async getMyStories({profileId}){
        let res = await axios.get(this.url+"/profile/"+profileId+"/private",{
            headers:{
                Authorization:"Bearer "+this.token
            }
        })
        return res.data
    }
    async getPublicProfileStories({profileId}){
        let res = await axios.get(this.url+"/profile"+profileId)
        return res.data
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
        const res = await axios.post(this.url,{
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
       const res = await axios.put(this.url+"/"+page.id,{
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
    
        let res = await axios.delete(this.url+"/"+id,
        {headers:{
            Authorization: "Bearer "+this.token
    }})
        return res.data
    }
}
export default new StoryRepo()
