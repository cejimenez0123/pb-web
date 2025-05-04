import { createSlice} from "@reduxjs/toolkit"
import { fetchCommentsOfPageProtected,fetchCommentsOfPagePublic } from "../actions/PageActions.jsx"

import { createComment,appendComment,updateComment,deleteComment } from "../actions/PageActions.jsx"

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
    let list = state.comments
    if(payload.comment){
   let index = list.findIndex(com=>com.id==payload.comment.id)
   if(index>-1){
    list[i]=payload.comment
    // let arr = list.map(com=>{
    //   if(com.id==payload.comment.id){
    //     return payload.comment
    //   }
    // })
    state.comments = list
  }else{
 
    list.push(payload.comment)
    state.comments = list
  
    
  
   }
  }
   
}).addCase(createComment.pending,(state,{payload})=>{
    state.loading=true
}).addCase(createComment.rejected,(state,{payload})=>{
    state.error = payload.error
}).addCase(appendComment.type,(state,{payload})=>{
  let list = state.comments
  if(Array.isArray(state.comments)){
  
  if(payload){
 let index = list.findIndex(com=>com.id==payload.id)
 if(index>-1){
  list[i]=payload

  state.comments = list
}else{

  list.push(payload.comment)
  state.comments = list

  

 }
}
   
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