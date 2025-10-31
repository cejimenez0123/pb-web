import { client} from "../core/di"
import { createAction,createAsyncThunk } from "@reduxjs/toolkit"
import hashtagRepo from "../data/hashtagRepo"
import algoliaRepo from "../data/algoliaRepo"
const getProfileHashtagCommentUse = createAsyncThunk("hashtag/fetchProfileHashtagComments",
async ({profileId},thunkApi) => {
   let data = await hashtagRepo.fetchUserHashtagCommentUse({profileId})
   return {hashtags:data.hashtags

   }
}
)
const createHashtag = createAsyncThunk("hashtag/createHashtag", 
    async ({name,profileId},thunkApi) => {
     let data =  await hashtagRepo.create({name,profileId})
    const {hashtag}=data
     if(hashtag){
        algoliaRepo.partialUpdateObject("hashtag",hashtag.id,{name:name})
        return {hashtag:data.hashtag
        } 
    }
   
    

})
const deleteHashtagComment = createAsyncThunk("hashtag/deleteHashtagComment", 
    async ({hashtagCommentId},thunkApi) => {
     let data =  await hashtagRepo.deleteComment({hashtagCommentId})
     return {
        hashtagCommentId,
        message:data.message
        }

})
const deleteHashtagStory = createAsyncThunk("hashtag/deleteHashtagStory", 
    async ({hashtagStoryId},thunkApi) => {
     let data =  await hashtagRepo.deleteStory({id:hashtagStoryId})
     return {
        hashtagStoryId,
        message:data.message
        }

})
const getHashtags = createAsyncThunk("hashtag/getHashtags",async (params,thunkApi)=>{

  
    let data = await hashtagRepo.all()
 
  
   
    return {
        hashtags: data.hashtags
    }
  
})
const createHashtagComment = createAsyncThunk("hashtag/createHashtagComment", 
    async ({name,commentId,profileId},thunkApi) => {
       let data = await hashtagRepo.comment({name,commentId,profileId})
       let hashtag = data.hashtag
       
       return {
        hashtag:data.hashtag
       }
        
})
const createHashtagPage = createAsyncThunk("hashtag/createHashtagStory", 
async ({name,storyId,profile},thunkApi) => {
    try{
        let data = await hashtagRepo.story({name,storyId,profile})

            const {hashtag}=data
            
                   return {
                hashtag:data.hashtag
                }
            

       
    }catch(err){
        return{
            hashtag:null
            ,error:err
        }
    }
     
})
const createHashtagCollection = createAsyncThunk("hashtag/createHashtagCollection", 
async ({name,colId,profile},thunkApi) => {
        let data = await hashtagRepo.collection({name,colId,profile})
      if(data.hashtag){
        const {hashtag}=data
        
        return {
        hashtag:data.hashtag
       }
    }else{

        throw new Error(data.error)
    }
})
const deleteHashtagCollection = createAsyncThunk("hashtag/deleteHashtagCollection", 
async ({hashId},thunkApi) => {
        let data = await hashtagRepo.deleteCollection({hashId})
      return data
  
})
const fetchHashtag = createAsyncThunk("hashtag/fetchHashtag",async (params,thunkApi)=>{
    const {id}=params
   

    try{

    const data = await hashtagRepo.fetch({id})
   return{
    hashtag:data.hashtag
   }

    }catch(err){
   
        return err
    }
// }

})

const clearHashComments = createAction("hashtags/clearHashComments")
const clearHashPages = createAction("hashtags/clearHashPages")
const fetchCollectionHashtags = createAsyncThunk("hashtags/fetchStoryHashtags",async (params,thunkApi)=>{
    const {profile,colId}=params

    if(profile){
       let data =await hashtagRepo.fetchCollectionHashtagsProtected({id:colId})
       return {hashtags:data.hashtags}
    }else{
       let data = await hashtagRepo.fetchCollectionHashtagsPublic({id:colId})
       return {hashtags:data.hashtags}
    }
       

})
const fetchStoryHashtags = createAsyncThunk("hashtags/fetchStoryHashtags",async (params,thunkApi)=>{
    try{
    const {profile,storyId}=params

    if(profile){
       let data =await hashtagRepo.fetchStoryHashtagsProtected({id:storyId})
       return {hashtags:data.hashtags}
    }else{
       let data = await hashtagRepo.fetchStoryHashtagsPublic({id:storyId})
       return {hashtags:data.hashtags.filter(hash=>hash)}
    }
}catch(error){
    return {hashtags:[],error}
}   

})
export {
        createHashtag,
        createHashtagComment,
        createHashtagPage,
        getHashtags,
        deleteHashtagStory,
        // getHashtagComments,
        fetchHashtag,
        clearHashComments,
        clearHashPages,
        fetchCollectionHashtags,
        getProfileHashtagCommentUse,
        deleteHashtagComment,
        fetchStoryHashtags,
        deleteHashtagCollection,
        createHashtagCollection
}

