import axios from "axios"
import Enviroment from "../core/Enviroment"
import {Preferences} from  "@capacitor/preferences"

class AuthRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    async apply(form){
       let res = await axios.post(Enviroment.url+"/auth/apply",form,{headers:this.headers})
       return res.data
    }
    async applyFromNewsletter(form){
        let res = await axios.post(Enviroment.url+"/auth/newsletter/apply",form,{headers:this.headers})
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
      
        return res.data
    }
    async feedback({ preferredName,
        email,
        subject,
        purpose,
        message}){
        const res = await axios.post(Enviroment.url+"/auth/feedback",{ preferredName,
                email,
                subject,
                purpose,
                message})


        return res.data
        }
    async generateReferral(){

      
        let res = await axios.post(Enviroment.url+"/auth/generate-referral",{},{
            headers:{
                Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
            }
        })
        return res.data
    }
    async resetPassword({username,password,token}){
         let res =   await axios.post(Enviroment.url+"/auth/reset-password",{username,password,token})
    
         return res.data
    }
    async forgotPassword({username,email}){
      let res =  await axios.post(Enviroment.url+"/auth/forgot-password",{username,email})
     
      return res.data
    }
    async startSession({uId,email,password,identityToken}){

        const res = await axios.post(Enviroment.url+"/auth/session",{uId,email,password,identityToken})

        return res.data
    }
    async updateSubscription({token,frequency}){
        
        const res = await axios.put(Enviroment.url+"/auth/subscription",{
            token,frequency
        })
        return res.data
    }

    async useReferral({token, email, password ,username,profilePicture,selfStatement,isPrivate}){
       let res = await axios.post(Enviroment.url+"/auth/use-referral",{token, email, password ,username,profilePicture,selfStatement,isPrivate})
        return res.data    
    }
    async deleteUser(){
        let res = await axios.delete(Enviroment.url+"/auth/",{headers:{
            Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
        }})
         return res.data    
     }
     async checkUsername(query){
        let parms = new URLSearchParams({username:query})
        let res = await axios.get(Enviroment.url+"/auth/check-username?"+parms.toString())
     
        return res.data
    }
    async googleSignIn({email,googleId}){
       let res =await axios.post(Enviroment.url+"/auth/google",{email,googleId})
       return res.data
    }
    async appleSignIn({identityToken}){
        let res =await axios.post(Enviroment.url+"/auth/ios",{idToken:identityToken})
        console.log("Res",res.data)
        return res.data
    }
    }

export default new AuthRepo()