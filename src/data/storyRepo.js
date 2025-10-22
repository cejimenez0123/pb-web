import axios from "axios";
import Enviroment from "../core/Enviroment";

import { Preferences } from "@capacitor/preferences";


class StoryRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    url= Enviroment.url+"/story"
    
    token = "token"
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

        let res = await axios.get(this.url+"/profile/"+profileId+"/protected",{
            headers:{
                Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
            }
        })
  
        return res.data
    }
    async recommendations(){
        let res = await axios.get(this.url+"/recommendations",{headers:{
            Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
        }})
        return res.data
    }
    async getStoryProtected({id}){
        let res = await axios.get(this.url+"/"+id+"/protected",{
            headers:{
                Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
            }
        })
       
        return res.data
    }
    async getStoryPublic({id}){
        let res = await axios.get(this.url+"/"+id+"/public")
      
        return res.data
    }
    async getMyStories({token}){
        let draft = ""
        let res = await axios.get(this.url+"/profile/protected/"+draft,{
            headers:{
                Authorization:"Bearer "+token
                
            }
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
     
        const res = await axios.post(this.url,{
            title,data,isPrivate,authorId:profileId,commentable:commentable,
            type
    },{headers:{
        Authorization: "Bearer "+(await Preferences.get({key:"token"})).value
    }})
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
       const res = await axios.put(this.url+"/"+id,{
            data: data,
            isPrivate:isPrivate,
            description,
            needsFeedback,
            approvalScore:approvalScore,
            title:title,
            commentable:commentable,
            type
         },{headers:{
            Authorization: "Bearer "+(await Preferences.get({key:"token"})).value
        }})

       
         return res.data
    }
    async deleteStory({id}){
        let res = await axios.delete(this.url+"/"+id,
        {headers:{
            Authorization: "Bearer "+(await Preferences.get({key:"token"})).value
    }})
        return res.data
        
    }
    async getCollectionStoriesProtected({id}){
        let res = await axios.get(this.url+"/collection/"+id+"/protected",{
            headers:{
                Authorization: "Bearer "+(await Preferences.get({key:"token"})).value
    }})
   
    return res.data
    }
    async fetchCommentsOfPagePublic({pageId}){
        let res = await axios.get(this.url+"/"+pageId+"/comment/public")
        
        
        return res.data
    }
    async fetchCommentsOfPageProtected({pageId}){
        let res = await axios.get(this.url+"/"+pageId+"/comment/protected",{headers:{
            Authorization: "Bearer "+(await Preferences.get({key:"token"})).value
        }})
        
        
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
