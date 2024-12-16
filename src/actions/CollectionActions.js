import { createAsyncThunk ,createAction} from "@reduxjs/toolkit"
import axios from "axios"
import collectionRepo from "../data/collectionRepo"
import Enviroment from "../core/Enviroment"
import storyRepo from "../data/storyRepo"

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
const setCollectionInView = createAction("books/setCollectionInView", (params)=> {

    const {collection} = params
    
    return  {payload:
      collection}
      
    
  })
const addCollectionListToCollection = createAsyncThunk("books/addCollectionListToCollection",async(
    {id,list},thunkApi
)=>{
  

    let data = await collectionRepo.addCollectionListToCollection({id,list})
    return {collection:data.collection}
})
const addStoryListToCollection = createAsyncThunk("books/addStoryListToCollection",async(
    {id,list},thunkApi
)=>{


    let data = await collectionRepo.addStoryListToCollection({id,list})
    return {collection:data.collection}
})
const createCollection = createAsyncThunk("collection/createCollection",async (params,thunkApi)=>{
    let {
        title,
        purpose,
        isPrivate,
        profileId,
        isOpenCollaboration
    }=params
    try{
        let data = await collectionRepo.createCollection(params)
        console.log(data.collection)

        if(!data.collection){
        const {collection}=data
          client.initIndex("collection").saveObject(
            {objectID:collection.id,title:collection.title,type:"collection"}).wait()
        }   
        return {collection: data.collection}

      }catch(error){
      return {
        error: new Error(`Error: Create Library: ${error.message}`)
      }
    }
})
const fetchCollection = createAsyncThunk("collection/getCollectionPublic",async(params,thunkApi)=>{
   let data = await collectionRepo.fetchCollection(params)
   return {
    collection:data.collection
   }
})
const fetchCollectionProtected = createAsyncThunk("collection/getCollectionProtected",async(params,thunkApi)=>{
    let data = await collectionRepo.fetchCollectionProtected(params)
    return {
     collection:data.collection
    }
 })
const getSubCollectionsProtected = createAsyncThunk("collection/getSubCollectionsProtected",async(params,thunkApi)=>{
    let data = await collectionRepo.fetchSubCollectionsProtected(params)
    return {
        list:data.list
    }
})
const getSubCollectionsPublic = createAsyncThunk("collection/getSubCollectionsPublic",async(params,thunkApi)=>{
    let data = await collectionRepo.fetchSubCollectionsProtected(params)
    return {
        list:data.list
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

const getProtectCollectionStories = createAsyncThunk("collection/getProtectCollectionStories",async(
    params,thunkApi
)=>{
    let data = await storyRepo.getCollectionStoriesProtected(params)
    return {list:data.list}
})
const getPublicCollectionStories=createAsyncThunk("collection/getPublicCollectionStories",
    async (params,thunkApi)=>{
        let data = await storyRepo.getCollectionStoriesPublic(params)
        console.log(data)
        return {list:data.list}
    }
)
export {
    getPublicBooks,
    saveRoleToCollection,
    isProfileMember,
    getMyCollections,
    createCollection,
    getPublicProfileCollections,
    getProtectCollectionStories,
    getPublicCollectionStories,
    fetchCollection,
    fetchCollectionProtected,
    setCollectionInView,
    addCollectionListToCollection,
    addStoryListToCollection
}