import {db,auth} from "../core/di"
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
        client.initIndex("hashtag").partialUpdateObject({objectID: hashtag.id,name:hashtag.name},{createIfNotExists:true}).wait()
     }
   
    
     return {hashtag:data.hashtag
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
        let data = await hashtagRepo.story({name,storyId,profile})
      if(data.hashtag){
        return {
        hashtag:data.hashtag
       }
    }else{

        throw new Error(data.error)
    }
})

const getHashtagComments = createAsyncThunk("hashtag/getHashtagComment",async (params,thunkApi)=>{
    const {comment}=params
    let hashtagCommentList = []
    try{
     let ref = collection(db, HashtagComment.className)
    const request = query(ref,where("comment","==",comment.id))
    const snapshot = await getDocs(request)
        snapshot.docs.forEach(doc => {
            let hashtag = unpackHashtagCommentDoc(doc)
            hashtagCommentList = [...hashtagCommentList,hashtag ]
        })
        return {
            hashtagCommentList
        }
    }catch(err){
        return {error: err}
    }
})
const clearHashComments = createAction("hashtags/clearHashComments")
const clearHashPages = createAction("hashtags/clearHashPages")
const fetchStoryHashtags = createAsyncThunk("hashtags/fetchStoryHashtags",async (params,thunkApi)=>{
    const {profile,storyId}=params

    if(profile){
       let data =await hashtagRepo.fetchStoryHashtagsProtected({id:storyId})
       return {hashtags:data.hashtags}
    }else{
       let data = await hashtagRepo.fetchStoryHashtagsPublic({id:storyId})
       return {hashtags:data.hashtags}
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
        getHashtagComments,
        clearHashComments,
        clearHashPages,
        getProfileHashtagCommentUse,
        deleteHashtagComment,
        fetchStoryHashtags
}