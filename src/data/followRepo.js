import axios from "axios"
import Enviroment from "../core/Enviroment"
import { Preferences } from "@capacitor/preferences";
class FollowRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    token = "token"
    async create({follower,following}){
       let res = await axios.post(Enviroment.url+"/follow",{follower,following},
       {headers:{Authorization:"Bearer "+await Preferences.get({key:"token"})}})
       console.log(res)
       return res.data
    }
    
    async delete({id}){
        let res = await axios.delete(Enviroment.url+"/follow/"+id,{headers:
            {Authorization:"Bearer "+await Preferences.get({key:"token"})}})
        return res.data
    }


}
export default new FollowRepo()
 