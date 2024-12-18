import axios from "axios"
import Enviroment from "../core/Enviroment"


class HashtagRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    url=Enviroment.url+"/hashtag"
    token="token"
    async create({name,profileId}){
        axios.post(this.url,{
            name,profileId
        },{
            headers:{
                Authorization: "Bearer "+localStorage.getItem(this.token)
            }
        })
    }
    async fetch({storyId,profileId}){
        axios.get(this.url+"/profile/"+profileId+"/story/"+storyId,{headers:{
            Authorization:"Bearer "+localStorage.getItem(this.token)
        }})
    }
    }

export default new HashtagRepo()