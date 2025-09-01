import { createSlice} from "@reduxjs/toolkit"
import { fetchCommentsOfPageProtected,fetchCommentsOfPagePublic, setComments } from "../actions/PageActions.jsx"

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
    let list = [...state.comments]
    if(payload.comment){
   let index = list.findIndex(com=>com.id==payload.comment.id)
   if(index>-1){
    list[i]=payload.comment
  
    state.comments = list
  }else{
    
    list.unshift(payload.comment)
    state.comments = [...list]
  
    
  
   }
  }
   
}).addCase(createComment.pending,(state,{payload})=>{
    state.loading=true
}).addCase(createComment.rejected,(state,{payload})=>{
    state.error = payload.error
}).addCase(setComments.type,(state,{payload})=>{

  state.comments = payload
}).addCase(appendComment.type,(state,{payload})=>{
  let list = [...state.comments]
  
  if(payload&&!payload.length){ 
 let index = list.findIndex(com=>com.id==payload.id)
 if(index>-1){
  list[index]=payload
  console.log(list)
  state.comments = list
 }else{
  console.log(list)
  list.unshift(payload)
  state.comments = [...list]
 }
}else{
  console.log(list)
 if(state.comments.length==0){
  state.comments = [...payload]
 }else{
  state.comments = [...new Set([...list,...payload])]
 }
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
    console.log(payload.error)
    state.error = payload.error
  }).addCase(deleteComment.fulfilled,(state,{payload})=>{
    let list = [...state.comments]
    console.log(payload)
     let comments= list.filter(com=>com.id != payload.comment.id)
    state.comments = comments
    })}})
export default commentSlice