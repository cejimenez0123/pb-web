
import { createSlice } from "@reduxjs/toolkit"
import { getHashtags,createHashtag,createHashtagComment,createHashtagPage, getProfileHashtagCommentUse, deleteHashtagComment, fetchStoryHashtags } from "../actions/HashtagActions"
const initialState = {
    hashtags:[],
    error: null,
    hashtagComments:[],
    storyHashtags:[],
    collectionHashtags:[],
    profileHashtagComments:[],
    profileHashtagsStory:[],
   
}
const hashSlice = createSlice({
name: 'hashtags',
initialState,
extraReducers(builder) {
builder
    .addCase(getHashtags.fulfilled,(state,{payload})=>{
      state.hashtags = payload.hashtags  
    }).addCase(getHashtags.rejected,(state,{payload})=>{
        state.error = payload.error  
    }).addCase(createHashtag.fulfilled,(state,{payload})=>{
        if(payload&&payload.hashtag){
            state.hashtags = [...state.hashtags,payload.hashtag]
        }
       
    }).addCase(createHashtag.rejected,(state,{payload})=>{
        state.error = payload.error  
    }).addCase(createHashtagComment.fulfilled,(state,{payload})=>{
        state.hashtagComments=[...state.hashtagComments,payload.hashtag]
    }).addCase(createHashtagPage.fulfilled,(state,{payload})=>{
        if(payload.hashtag&&payload.hashtag.name){
            state.storyHashtags=[...state.storyHashtags,payload.hashtag]
        }

    }).addCase(getProfileHashtagCommentUse.fulfilled,(state,{payload})=>{
        state.profileHashtagComments = payload.hashtags
    }).addCase(getProfileHashtagCommentUse.rejected,(state,{payload})=>{
    
        if(payload && payload.error){state.error = payload.error}
    }).addCase(deleteHashtagComment.fulfilled,(state,{payload})=>{
       let hashtags = state.profileHashtagComments
       let hs = hashtags.filter(hash=>{
        hash.id !== payload.hashtagCommentId
       })
       state.profileHashtagComments = hs
    }).addCase(deleteHashtagComment.rejected,(state,{payload})=>{
       
     }).addCase(fetchStoryHashtags.fulfilled,(state,{payload})=>{
        state.storyHashtags = payload.hashtags
     })
    

}})
export default hashSlice