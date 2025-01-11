import Enviroment from "../core/Enviroment"
import axios from "axios"
class WorkshopRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    url= Enviroment.url+"/workshop"
    token = "token"
    async joinWorkshop({profile,story,location}){
        let res = await axios.post(Enviroment.url+'/workshop/groups',{profile,story,location},{headers:{
            Authorization:"Bearer "+localStorage.getItem(this.token)
        }})
       return res.data
    }
    async joinGlobalWorkshop({profile,story}){
      let res = await axios.post(Enviroment.url+'/workshop/groups/global',{profile,story},{headers:{
          Authorization:"Bearer "+localStorage.getItem(this.token)
      }})
     return res.data
  }
    async postActiveUser({story,profile}){


    const response = await axios.post(Enviroment.url+`/workshop/active-users`,{
        story:story,
        profile:profile
      },{headers:{
        Authorization:"Bearer "+localStorage.getItem(this.token)
      }}); 
      return response.data
    }
}

export default new WorkshopRepo()