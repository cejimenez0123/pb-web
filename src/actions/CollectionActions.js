import { createAsyncThunk ,createAction} from "@reduxjs/toolkit"
import axios from "axios"
import collectionRepo from "../data/collectionRepo"
import Enviroment from "../core/Enviroment"

const getPublicBooks = createAsyncThunk(
    'books/getPublicBooks',
    async (thunkApi) => {
       
   
        try{
                let res = await axios(Enviroment.url+"/collection/public/book")
    
    return {
  
        bookList: res.data.books
    }
}catch (error) {
    return{
        error: new Error(`getPublicColBooks ${error.message}`)
    }
}
      
    }
)

const saveRoleToCollection= createAsyncThunk("collection/saveRoleToCollection",
    async (params,thunkApi)=>{
        const id = params["id"]
        const profileId = params["profileId"]
        const role = params["role"]
        const res = await axios.post(Enviroment.url+"/collection/"+id+"/role",{
            profileId:profileId,
            role:role
        })
        return {role:res.data}
    }
)
const isProfileMember = createAsyncThunk("collection/isProfileMember",async (
    params,thunkApi
)=>{

      let res =  await axios(Enviroment.url+"/collection/"+params["id"]+"/profile/"+params["profileId"],
        { headers:{
            'Access-Control-Allow-Origin': "*"
        }}
      )

      return {
        data: res.data
      }
})
const getMyCollections = createAsyncThunk("collection/getMyCollections",async (
    params,thunkApi
)=>{

     let res = await collectionRepo.getMyCollections({id:params["profile"].id})
      return {
        collections: res.collections
      }
})
const getPublicProfileCollections = createAsyncThunk("collection/getMyCollections",async (
    params,thunkApi
)=>{

     let res = await collectionRepo.getPublicProfilesCollections({id:params["profile"].id})

      return {
        data: res.data
      }
})


export {
    getPublicBooks,
    saveRoleToCollection,
    isProfileMember,
    getMyCollections,
    getPublicProfileCollections
}