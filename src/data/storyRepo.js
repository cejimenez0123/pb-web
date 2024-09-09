import axios from "axios";
import Enviroment from "../core/Enviroment";




class StoryRepo{

    url = Enviroment.url

    async getPublicStories(){
        let res = await  axios.get(this.url+"/story")
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
        const res = await axios.post(this.url+"/story/"+id,{
                profileId: profileId,
                type:type,
                data: data,
                isPrivate:privacy,
                approvalScore:approvalScore,
                title:title,
                commentable:commentable
             })
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
         })
         return res.data
    }
    async deleteStory(data){
        const {id} = data
        let res = await axios.delete(this.url+"/story/"+id)
        return res.data
    }
}
export default new StoryRepo()
