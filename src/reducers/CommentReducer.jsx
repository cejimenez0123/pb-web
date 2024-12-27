import { createSlice} from "@reduxjs/toolkit"
import { fetchCommentsOfPage } from "../actions/PageActions"

import { createComment } from "../actions/PageActions"

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
})
}

})
export default commentSlice