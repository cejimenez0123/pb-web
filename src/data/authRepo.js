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
    async startSession({uId,email}){
        const res = await axios.post(Enviroment.url+"/auth/session",{uId,email})
        localStorage.setItem("token",res.data.token)
        return res.data
    }
    }

export default new AuthnRepo()