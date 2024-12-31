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
     

        if(!data.collection.isPrivate){
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
const fetchProfileCollections =createAsyncThunk("collection/fetchProfileCollections",async(params,thunkApi)=>{

    collectionRepo
})
const fetchCollection = createAsyncThunk("collection/getCollectionPublic",async(params,thunkApi)=>{
   let data = await collectionRepo.fetchCollection(params)
   return {
    collection:data.collection
   }
})
const deleteStoryFromCollection = createAsyncThunk("collection/deleteStoryFromCollection",async({id,storyId},thunkApi)=>{
    let data = await collectionRepo.deleteStoryToCollection({id,storyId})
    return {
     collection:data.collection
    }
 })
 const deleteCollectionFromCollection = createAsyncThunk("collection/deleteCollectionFromCollection",async({id,childCollectionId},thunkApi)=>{
    let data = await collectionRepo.deleteCollectionToCollection({id,childCollectionId})
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
        list:data.collections
    }
})
const getSubCollectionsPublic = createAsyncThunk("collection/getSubCollectionsPublic",async(params,thunkApi)=>{
    let data = await collectionRepo.fetchSubCollectionsProtected(params)
    const list = data.collections.map(col=>col.childCollection)
    return {
        list:list
    }
})
const getMyCollections = createAsyncThunk("collection/getMyCollections",async (
    params,thunkApi
)=>{

     let data = await collectionRepo.getMyCollections()

      return {
        collections: data.collections
      }
})
const getPublicProfileCollections = createAsyncThunk("collection/getPublicProfileCollections",async (
    params,thunkApi
)=>{

     let res = await collectionRepo.getPublicProfileCollections({id:params["profile"].id})

      return {
        data: res.data
      }
})
const getProtectedProfileCollections = createAsyncThunk("collection/getProtectedProfileCollections",async (
    params,thunkApi
)=>{

     let res = await collectionRepo.getProtectedProfileCollections({id:params["profile"].id})

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
const deleteCollection = createAsyncThunk("collection/deleteCollection",async(
    params,thunkApi
)=>{
   let data = await collectionRepo.deleteCollection(params)
   return data
})
const getPublicCollectionStories=createAsyncThunk("collection/getPublicCollectionStories",
    async (params,thunkApi)=>{
        let data = await storyRepo.getCollectionStoriesPublic(params)
     
        return {list:data.list}
    }
)
const patchCollectionRoles = createAsyncThunk("collection/patchCollectionRoles",async({roles,profileId,colId},thunkApi)=>{


    let data= await collectionRepo.patchCollectionRoles({roles,profileId,colId})

    return {
        roles:data.roles
    }
})

const patchCollectionContent=createAsyncThunk("collection/patchCollectionContent",
    async ({id,storyToCol,colToCol,col},thunkApi)=>{
        let data = await collectionRepo.updateCollectionContent({id,storyToCol,colToCol,col})
     
        return {collection:data.collection}
    }
)
const clearCollections = createAction("collection/clearCollections")
export {
    getPublicBooks,
    saveRoleToCollection,
    isProfileMember,
    getMyCollections,
    createCollection,
    getProtectedProfileCollections,
    getPublicProfileCollections,
    getProtectCollectionStories,
    getPublicCollectionStories,
    fetchCollection,
    fetchCollectionProtected,
    setCollectionInView,
    addCollectionListToCollection,
    addStoryListToCollection,
    getSubCollectionsProtected,
    getSubCollectionsPublic,
    deleteCollection,
    deleteCollectionFromCollection,
    deleteStoryFromCollection,
    patchCollectionContent,
    patchCollectionRoles,
    clearCollections
}