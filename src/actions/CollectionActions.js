import { createAsyncThunk ,createAction} from "@reduxjs/toolkit"
import axios from "axios"
import collectionRepo from "../data/collectionRepo"
import Enviroment from "../core/Enviroment"
import storyRepo from "../data/storyRepo"
import { client } from "../core/di"
import roleRepo from "../data/roleRepo"
const getPublicBooks = createAsyncThunk(
    'books/getPublicBooks',
    async (thunkApi) => {
       
   
        try{
                let res = await axios(Enviroment.url+"/collection/public/book")
            
    return {
  
        books: res.data.books
    }
}catch (error) {
    return{
        error: new Error(`getPublicColBooks ${error.message}`)
    }
}
      
    }
)

const getPublicCollections = createAsyncThunk(
    'books/getPublicCollections',
    async (thunkApi) => {
       
   
        try{
                let res = await axios(Enviroment.url+"/collection")
            
    return {
  
       collections: res.data.data
    }
}catch (error) {
    return{
        error: new Error(`getPublic Collections ${error.message}`)
    }
}
      
    }
)
const getRecommendedCollectionStory = createAsyncThunk(
    'collections/recommendatedCollectionStory',
    async ({colId},thunkApi) => {
    
   
        try{
           let data = await  collectionRepo.recommendedStories({colId:colId})

return {pages:data.pages}
}catch (error) {
    return{
        error: new Error(`getREcommendations ${error.message}`)
    }
}
      
    }
)

const getRecommendedCollections = createAsyncThunk(
    'collections/recommendedCollections',
    async (params,thunkApi) => {
    
        try{
     
          const {collections}= await collectionRepo.recommendedColCollections(params)
          if(collections){
          return {collections:collections}
          }
            return{
                collections:[]
            }
       

}catch (error) {
    return{
        collections:[],
        error: new Error(`getRecommendedCollections ${error.message}`)
    }
}
      
    }
)
const getRecommendedCollectionsProfile = createAsyncThunk(
    'collections/recommendedCollections',
    async (params,thunkApi) => {
    
        try{

          const {collections}= await collectionRepo.recommendations()
          return {collections:collections}
    
     

}catch (error) {
    return{
        error: new Error(`getRecommendedCollections ${error.message}`)
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
    {id,list,profile},thunkApi
)=>{

    let data = await collectionRepo.addCollectionListToCollection({id,list,profile})


    return {collection:data.collection}
})
const addStoryListToCollection = createAsyncThunk("books/addStoryListToCollection",async(
    {id,list,profile},thunkApi
)=>{
try{

    let data = await collectionRepo.addStoryListToCollection({id,list,profile})
   
    return data
}catch(error){
    return {error}
}
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
          client.saveObject(
            {objectID:collection.id,title:collection.title,indexName:"collection"})
        }   
        return {collection: data.collection}

      }catch(error){
       
      return {
        error
      }
    }
})

const fetchCollection = createAsyncThunk("collection/getCollectionPublic",async(params,thunkApi)=>{
   let data = await collectionRepo.fetchCollection(params)

   return {
    collection:data.collection
   }
})
const deleteStoryFromCollection = createAsyncThunk("collection/deleteStoryFromCollection",async({stId},thunkApi)=>{
    let data = await collectionRepo.deleteStoryToCollection({stId})
    return data
 })
 const deleteCollectionFromCollection = createAsyncThunk("collection/deleteCollectionFromCollection",async({tcId},thunkApi)=>{
   try{
    let data = await collectionRepo.deleteCollectionToCollection({tcId:tcId})


    return data
    
}catch(error){
   console.log(error)
    return{error,collection:null}
}
 })
const fetchCollectionProtected = createAsyncThunk("collection/getCollectionProtected",async(params,thunkApi)=>{
    
    let data = await collectionRepo.fetchCollectionProtected(params)  
 
    
    return {
     collection:data.collection
    }
 })
 const setCollections = createAction("cols/setCollections", (params)=> {

    const {collections} = params
    return  {payload:
      collections}
      
    
  })

const getMyCollections = createAsyncThunk("collection/getMyCollections",async (
    params,thunkApi
)=>{
     let data = await collectionRepo.getMyCollections(params)
      return {
        collections: data.collections
      }
})
const getPublicProfileCollections = createAsyncThunk("collection/getPublicProfileCollections",async (
    params,thunkApi
)=>{

     let data = await collectionRepo.getPublicProfileCollections({id:params["profile"].id})

      return {
      collections:data.collections
      }
})
const getProtectedProfileCollections = createAsyncThunk("collection/getProtectedProfileCollections",async (
    params,thunkApi
)=>{

     let data = await collectionRepo.getProtectedProfileCollections({id:params["profile"].id})

      return {
        collections:data.collections
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
   client.deleteObject({indexName:"collection",objectID:params.id})
   return data
})

const patchCollectionRoles = createAsyncThunk("collection/patchCollectionRoles",async({roles,profile,collection},thunkApi)=>{


    let data= await roleRepo.patchCollectionRoles({roles,profile,collection})

    return {
        roles:data.roles??[],
        collection:data.collection??[]
    }
})
const patchCollectionContent=createAsyncThunk("collection/patchCollectionContent",
    async ({id,title,purpose,isPrivate,isOpenCollaboration,storyToCol,colToCol,col,profile},thunkApi)=>{
        let data = await collectionRepo.updateCollectionContent({id,title,purpose,isPrivate,isOpenCollaboration,storyToCol,colToCol,col,profile})
        if(!isPrivate){
            
              client.partialUpdateObject({objectID:id,title:title,indexName:"collection"},{createIfNotExists:true})
            }else{
                client.deleteObject({indexName:"collection",objectID:id})
            }  
        return {collection:data.collection}
    }

)
const clearCollections = createAction("collection/clearCollections")
export {
    getPublicBooks,
    saveRoleToCollection,
    getPublicCollections,
    isProfileMember,
    getMyCollections,
    createCollection,
    getProtectedProfileCollections,
    getPublicProfileCollections,
    getProtectCollectionStories,


    fetchCollection,
    fetchCollectionProtected,
    setCollectionInView,
    addCollectionListToCollection,
    addStoryListToCollection,
    deleteCollection,
    deleteCollectionFromCollection,
    deleteStoryFromCollection,
    patchCollectionContent,
    patchCollectionRoles,
    clearCollections,
    getRecommendedCollections,
    getRecommendedCollectionStory,
    getRecommendedCollectionsProfile,
    setCollections
}