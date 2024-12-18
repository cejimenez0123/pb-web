import axios from "axios"
import Enviroment from "../core/Enviroment"


class AuthnRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    async apply(form){
       let res = await axios.post(Enviroment.url+"/auth/apply",form,{headers:this.headers})
       return res.data
    }
    async login(form){

    }
    async referral({email,name}){
        let res = await axios.post(Enviroment.url+"/auth/referral",{email,name},{
            headers:{
                Authorization:"Bearer "+localStorage.getItem("token")
            }
        })
        return res.data
    }
    async startSession({uId,email,password}){

        const res = await axios.post(Enviroment.url+"/auth/session",{uId,email,password})
       
        return res.data
    }
    }

export default new AuthnRepo()