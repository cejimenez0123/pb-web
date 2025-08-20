import Enviroment from "../core/Enviroment"
import axios from "axios"
import { Preferences } from "@capacitor/preferences";
class LikeRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    url=Enviroment.url+"/like"
    token="token"

    async storyCreate({story,profile}){
          let res =  await axios.post(this.url+"/story",{story,profile},{
                headers:{
                    Authorization:"Bearer "+localStorage.getItem(this.token)
                }
            })
            console.log(res.data)
            return res.data
    }
    async storyDelete({id}){
        let res =  await axios.delete(this.url+"/story/like/"+id,{
            headers:{
                Authorization:"Bearer "+localStorage.getItem(this.token)
            }
            
        })
     
        return res.data
    }

}

export default new LikeRepo()