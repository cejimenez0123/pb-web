import { createSlice } from "@reduxjs/toolkit"
import { createHashtag, getHashtagComments, getHashtagPages, getHashtags } from "../actions/HashtagActions"
const initialState = {
    hashtags:[],
    error: null,
    hashtagCommentList:[],
    hashtagPageList:[]
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
        state.hashtags = [...state.hashtags,payload.hashtag]
    }).addCase(createHashtag.rejected,(state,{payload})=>{
        state.error = payload.error  
    }).addCase(getHashtagComments.fulfilled,(state,{payload})=>{
        state.hashtagCommentList = [...state.hashtagPageList,...payload.hashtagCommentList]
    }).addCase(getHashtagPages.fulfilled,(state,{payload})=>{
        state.hashtagPageList = [...state.hashtagPageList,...payload.hashtagPageList]
      })}

})