import {db,auth, client} from "../core/di"
import {where,query,collection,getDocs,doc,setDoc, Timestamp, } from "firebase/firestore"
import { createAction,createAsyncThunk } from "@reduxjs/toolkit"
import Hashtag from "../domain/models/hashtag"
import HashtagComment from "../domain/models/hashtag_comment"
import HashtagPage from "../domain/models/hashtag_page"
import hashtagRepo from "../data/hashtagRepo"
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
        client.initIndex("hashtag").partialUpdateObject({objectID: hashtag.id,name:name,type:"hashtag"},{createIfNotExists:true}).wait()
    
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
       return {
        hashtag:data.hashtag
       }
        
})
const createHashtagPage = createAsyncThunk("hashtag/createHashtagStory", 
async ({name,storyId,profile},thunkApi) => {
    try{
        let data = await hashtagRepo.story({name,storyId,profile})

const {hashtag}=data
      if(hashtag){
             client.initIndex("hashtag").partialUpdateObject({objectID: hashtag.id,name:name,type:"hashtag"},{createIfNotExists:true}).wait()
             return {
                hashtag:data.hashtag
                }
            }else{
                throw new Error("Hashtag already created")
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
        if(hashtag.id){
            client.initIndex("hashtag").partialUpdateObject({objectID: hashtag.id,name:name,type:"hashtag"},{createIfNotExists:true}).wait()
         }
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
   const data = await hashtagRepo.fetch({id})
   return{
    hashtag:data.hashtag
   }
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
const unpackHashtagDoc = (doc)=>{
    const id = doc.id
    const pack = doc.pack()
    const {name,created,popularityScore,profileId}=pack
    const hashtag = new Hashtag(id,
                                name,
                                profileId,
                                popularityScore,
                                created)
    return hashtag
}

const unpackHashtagCommentDoc = (doc)=>{
    const id = doc.id
    const pack = doc.pack()
    const {commentId,hashtagId,created}=pack
    const hashtag = new HashtagPage(id,
                                    hashtagId,
                                    commentId,
                                    created)
    return hashtag
}


export {unpackHashtagDoc,
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

