import { createSlice } from "@reduxjs/toolkit"
import { fetchStoryRoles, patchRoles } from "../actions/RoleActions"

const initialState = {
    roles:[],
    collectionRoles:[],
    storyRoles:[],
    loading:false

}
const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    extraReducers(builder) {
        builder.addCase(fetchStoryRoles.fulfilled,(state,{payload})=>{
            
            state.storyRoles = payload.roles
            state.loading=false
        }).addCase(fetchStoryRoles.pending,(state,{payload})=>{
            
            state.loading = true

        }).addCase(patchRoles.fulfilled,(state,{payload})=>{
            state.storyRoles = payload.roles
            state.loading =false
        }).addCase(patchRoles.pending,(state,{payload})=>{
            state.loading =true
        })}})


export default rolesSlice