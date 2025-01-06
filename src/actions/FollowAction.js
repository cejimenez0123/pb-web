import { createAsyncThunk } from "@reduxjs/toolkit";
import followRepo from "../data/followRepo";



const createFollow = createAsyncThunk("follow/createFollow",    async ({follower,following},thunkApi) => {
    try{
    let data = await followRepo.create({follower,following})
    return {follow:data.follow}

    }catch(error){
        console.log(error)
        return {error}
    }
})
const deleteFollow = createAsyncThunk("follow/deleteFollow",    async ({follow},thunkApi) => {
    try{
    let data = await followRepo.delete({id:follow.id})
    console.log(data)
    return {profile:data.profile}

    }catch(error){
        
        return {profile:null,error}
    }
})

export {deleteFollow,createFollow}
