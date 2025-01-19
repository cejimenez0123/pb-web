import { createSlice} from "@reduxjs/toolkit"
import { fetchCommentsOfPage } from "../actions/PageActions"

import { createComment,appendComment,updateComment,deleteComment } from "../actions/PageActions"

const initialState = {
    comments:[],
    userCritique:[],
    loading:false,
    error:"",
    role:null
}
const commentSlice = createSlice({
name: 'comments',
initialState,
extraReducers(builder) {
builder.addCase(createComment.fulfilled,(state,{payload})=>{
    state.comments = [payload.comment,...state.comments]
}).addCase(createComment.pending,(state,{payload})=>{
    state.loading=true
}).addCase(createComment.rejected,(state,{payload})=>{
    state.error = payload.error
}).addCase(fetchCommentsOfPage.rejected,(state,{payload})=>{
    state.error = payload.error
    state.loading =false
}).addCase(fetchCommentsOfPage.pending,(state,{payload})=>{
    state.loading= true
}).addCase(fetchCommentsOfPage.fulfilled,(state,{payload})=>{
 
    state.comments = payload.comments
    state.loading =false
}).addCase(appendComment,(state,{payload})=>{
    if(Array.isArray(state.comments)){
      state.comments = [...state.comments,payload.comment]
    }else{
      state.comments = [payload.comment]
    }
    
  }).addCase(updateComment.rejected,(state,{payload})=>{
    state.error = payload.error
  }).addCase(updateComment.fulfilled,(state,{payload})=>{
    let list = state.comments
    
   let newList = list.map(comment=>{
      if(comment.id==payload.comment.id){
 
        return payload.comment
      }else{
        return comment
      }
    })

    state.comments = newList
  }).addCase(deleteComment.rejected,(state,{payload})=>{
    state.error = payload.error
  }).addCase(deleteComment.fulfilled,(state,{payload})=>{
    let list = state.comments
     let comments= list.filter(com=>com.id !== payload.comment.id)
    state.comments = comments
    })}})
export default commentSlice