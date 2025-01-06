class FollowRepo{
    headers= {
        'Access-Control-Allow-Origin': "*"
    }
    token = "token"
    async create({follower,following}){
       let res = await axios.post(Enviroment.url+"/follow",{follower,following},
       {headers:{Authorization:"Bearer "+localStorage.getItem(this.token)}})
       return res.data
    }
    
    async delete({id}){
        let res = await axios.post(Enviroment.url+"/follow/"+id,{profile,text},{headers:{Authorization:"Bearer "+localStorage.getItem(this.token)}})
        return res.data
    }


}
export default new FollowRepo()
 