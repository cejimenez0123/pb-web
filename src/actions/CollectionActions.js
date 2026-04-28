import { createAsyncThunk ,createAction} from "@reduxjs/toolkit"
import axios from "axios"
import collectionRepo from "../data/collectionRepo"
import Enviroment from "../core/Enviroment"
import storyRepo from "../data/storyRepo"
import roleRepo from "../data/roleRepo"
import algoliaRepo from "../data/algoliaRepo"
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
    async (params,thunkApi) => {

        let query =""
       if(params && params.type && params.type.length>2){
        query = `?type=${params.type}`
       }
   
        try{
                let res = await axios(Enviroment.url+`/collection`+query)

    return {
  
       collections: res.data.data
    }
}catch (error) {
    return{
        error: new Error(`get Collections ${error.message}`)
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
  async ({ colId, type, skip = 0, take = 10 }, thunkApi) => {
    try {
      const { collections, totalCount } = await collectionRepo.recommendedColCollections({ 
        colId, type, skip, take 
      });
      if (collections) {
        return { collections, totalCount };
      }
      return { collections: [], totalCount: 0 };
    } catch (error) {
      return {
        collections: [],
        totalCount: 0,
        error: new Error(`getRecommendedCollections ${error.message}`)
      };
    }
  }
);
const getRecommendedCollectionsProfile = createAsyncThunk(
  'collections/recommendedCollections',
  async (params, thunkApi) => {
    try {
      const { skip = 0, take = 20 } = params || {};
      const { collections, totalCount } = await collectionRepo.recommendations({ skip, take });
      return { collections, totalCount };
    } catch (error) {
      return { error: new Error(`getRecommendedCollections ${error.message}`) };
    }
  }
);

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
  
    try{
        let data = await collectionRepo.createCollection(params)
     
  const {collection}=data
        if(!data.collection.isPrivate){
      await algoliaRepo.saveObject("collection", {
  objectID: collection.id,
  title: collection?.title
})
     
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
const fetchCollectionProtected = createAsyncThunk("collection/fetchCollectionProtected",async(params,thunkApi)=>{
    
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

const getMyCollections = createAsyncThunk(
  "collections/getMyCollections",
  async (params, thunkApi) => {
    try {
        
      const data = await collectionRepo.getMyCollections(params);

      return {
        collections: data.collections,
        totalCount: data.totalCount,
      };
    } catch (e) {
      return thunkApi.rejectWithValue(
        e?.response?.data || e.message
      );
    }
  }
);

const getPublicProfileCollections = createAsyncThunk(
  "collection/getPublicProfileCollections",
  async (params, thunkApi) => {
    try {
      const data = await collectionRepo.getPublicProfileCollections({
        id: params.profileId,
        skip: params.skip,
        take: params.take,
      });

      return {
        collections: data.collections,
        totalCount: data.totalCount,
      };
    } catch (err) {
      return thunkApi.rejectWithValue(err?.response?.data || err.message);
    }
  }
);

const getProtectedProfileCollections = createAsyncThunk(
  "collection/getProtectedProfileCollections",
  async (params, thunkApi) => {
    try {
      const data = await collectionRepo.getProtectedProfileCollections({
        id: params.profileId,
        skip: params.skip,
        take: params.take,
      });

      return {
        collections: data.collections,
        totalCount: data.totalCount,
      };
    } catch (err) {
      return thunkApi.rejectWithValue(err?.response?.data || err.message);
    }
  }
);


const getProtectCollectionStories = createAsyncThunk("collection/getProtectCollectionStories",async(
    params,thunkApi
)=>{
    let data = await storyRepo.getCollectionStoriesProtected(params)
    return {list:data.list}
})
const deleteCollection = createAsyncThunk("collection/deleteCollection",async(
    params,thunkApi
)=>{
    try{

       let data = await collectionRepo.deleteCollection(params)
 await algoliaRepo.deleteObject("collection", params.id)
   return data
    }catch(err){
        return err
    }
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
          await algoliaRepo.partialUpdateObject("collection", id, { title: title })
               }else{

       
            await algoliaRepo.deleteObject("collection",id)
                
            }  
        return {collection:data.collection}
    }

)
const getCollectionRecommendations = createAsyncThunk(
    'collections/getCollectionRecommendations',
    async ({ colId, skip = 0, take = 10, type }, thunkApi) => {
        try {
            const data = await collectionRepo.getCollectionRecommendations({ colId, skip, take, type });
            return { groups: data.groups, totalCount: data.totalCount };
        } catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data || error.message);
        }
    }
);

const getProfileRecommendations = createAsyncThunk(
    'collections/getProfileRecommendations',
    async ({ skip = 0, take = 10, type } = {}, thunkApi) => {
        try {
            const data = await collectionRepo.getProfileRecommendations({ skip, take, type });
            return { groups: data.groups, totalCount: data.totalCount };
        } catch (error) {
            return thunkApi.rejectWithValue(error?.response?.data || error.message);
        }
    }
);
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
    getCollectionRecommendations,
    getProfileRecommendations,

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