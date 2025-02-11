import axios from "axios"
import Enviroment from "../core/Enviroment"


class AuthRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    async apply(form){
       let res = await axios.post(Enviroment.url+"/auth/apply",form,{headers:this.headers})
       return res.data
    }
    async newsletter(form){
        let res = await axios.post(Enviroment.url+"/auth/newsletter",form)
        return res.data
     }
    async user({token}){
        let res = await axios.get(Enviroment.url+"/auth/user",{
            headers:{
                Authorization:"Bearer "+token
            }
        })
        console.log(res)
        return res.data
    }
    async referral({email,name}){

      
        let res = await axios.post(Enviroment.url+"/auth/referral",{email,name},{
            headers:{
                Authorization:"Bearer "+localStorage.getItem("token")
            }
        })
        return res.data
    }
    async resetPassword({username,password,token}){
         let res =   await axios.post(Enviroment.url+"/auth/reset-password",{username,password,token})
         console.log(res)
         return res.data
    }
    async forgotPassword({username,email}){
      let res =  await axios.post(Enviroment.url+"/auth/forgot-password",{username,email})
     
      return res.data
    }
    async startSession({uId,email,password}){

        const res = await axios.post(Enviroment.url+"/auth/session",{uId,email,password})
       
        return res.data
    }
    async updateSubscription({token,frequency}){
      
        const res = await axios.put(Enviroment.url+"/auth/subscription",{
            token,frequency
        })
        return res.data
    }

  
    }

export default new AuthRepo()