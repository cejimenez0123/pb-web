import axios from "axios"
import Enviroment from "../core/Enviroment"
class FollowRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    token = "token"
    async create({follower,following}){
       let res = await axios.post(Enviroment.url+"/follow",{follower,following},
       {headers:{Authorization:"Bearer "+localStorage.getItem(this.token)}})
       console.log(res)
       return res.data
    }
    
    async delete({id}){
        let res = await axios.delete(Enviroment.url+"/follow/"+id,{headers:
            {Authorization:"Bearer "+localStorage.getItem(this.token)}})
        return res.data
    }


}
export default new FollowRepo()
 