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
const createColection = createAsyncThunk("collection/createCollection",async (params,thunkApi)=>{

    try{
        let data = await collectionRepo.createCollection(params)
        if(!data.collection.isPrivate){
          client.initIndex("collection").saveObject(
            {objectID:data.id,title:params.title,type:"collection"}).wait()
        }   
        return {collection: data.collection}

      }catch(error){
      return {
        error: new Error(`Error: Create Library: ${error.message}`)
      }
    }
})
const getMyCollections = createAsyncThunk("collection/getMyCollections",async (
    params,thunkApi
)=>{

     let data = await collectionRepo.getMyCollections()
     console.log(data)
      return {
        collections: data.collections
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
    createColection,
    getPublicProfileCollections
}