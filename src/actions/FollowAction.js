import { createAsyncThunk } from "@reduxjs/toolkit";
import followRepo from "../data/followRepo";



const createFollow = createAsyncThunk("follow/createFollow",    async ({follower,following},thunkApi) => {
    try{
    let data = await followRepo.create({follower,following})
    return {follow:data.follow}

    }catch(error){
    
        return {error}
    }
})
const deleteFollow = createAsyncThunk("follow/deleteFollow",    async ({follow},thunkApi) => {
    try{
    let data = await followRepo.delete({id:follow.id})
    return {profile:data.profile,followed:data.followed}

    }catch(error){
        
        return {profile:null,error}
    }
})

export {deleteFollow,createFollow}
