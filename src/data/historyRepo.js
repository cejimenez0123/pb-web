import axios from "axios"
import Enviroment from "../core/Enviroment"
class HistoryRepo{
 
    url=Enviroment.url+"/history"
    token="token"

    async storyCreate({profile,story}){
        let res= await axios.post(this.url+"/story",{profile,story},{headers:{
                Authorization:"Bearer "+localStorage.getItem("token")
            }})
    return res.data
    }
    async collectionCreate({profile,collection}){
        let res= await axios.post(this.url+"/collection",{profile,collection},{headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
        }})
        return res.data
    }
}
export default new HistoryRepo()