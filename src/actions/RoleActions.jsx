import { createAsyncThunk } from "@reduxjs/toolkit";
import roleRepo from "../data/roleRepo";
import collectionRepo from "../data/collectionRepo";




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

const postCollectionRole=createAsyncThunk("books/postCollectionRoles",async ({type,profileId,collectionId},thunkApi)=>{

    let data = await roleRepo.postCollectionRole({type,profileId,collectionId})
    return {
     collection: data.collection
    }
})
const deleteCollectionRole=createAsyncThunk("books/deleteCollectionRoles",async ({role},thunkApi)=>{

    let data = await roleRepo.deleteCollectionRole({role})
    let colData = await collectionRepo.fetchCollection({id:role.item.id})
    return {
     collection: colData.collection
    }
})

const fetchCollectionRoles=createAsyncThunk("roles/fetchCollectionRoles",async ({collection},thunkApi)=>{

 let data = await roleRepo.collectionRoles({collection})
 
 return {
  roles: data.roles
 }
})
export {
    patchRoles,
    fetchStoryRoles,
    fetchCollectionRoles,
    postCollectionRole,
    deleteCollectionRole
}