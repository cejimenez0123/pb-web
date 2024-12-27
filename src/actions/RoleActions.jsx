import { createAsyncThunk } from "@reduxjs/toolkit";
import roleRepo from "../data/roleRepo";




const patchRoles=createAsyncThunk("roles/patchRoles",async (params,thunkApi)=>{

       let data = await roleRepo.patchRoles(params)
       return {
        roles: data.roles
       }
})

const fetchStoryRoles=createAsyncThunk("roles/fetchStoryRoles",async ({storyId},thunkApi)=>{

    let data = await roleRepo.storyRoles({storyId})
    
    return {
     roles: data.roles
    }
})

export {
    patchRoles,
    fetchStoryRoles
}