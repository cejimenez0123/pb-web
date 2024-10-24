import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Enviroment from "../core/Enviroment";
import storyRepo from "../data/storyRepo";

const getStory = createAsyncThunk("story/getStory",async (params,thunkApi)=>{
    
    let res = await axios(Enviroment.url+"/story/"+params.id,{
        headers:{
            'Access-Control-Allow-Origin': "*"
        }
    })
    return {
        story: res.data.story
    }
})
const getMyStories= createAsyncThunk(
    'pages/getMyStories',
    async (params,thunkApi) => {
      try{
      let data = await storyRepo.getMyStories({profileId:params["profile"].id})
  
    return {
      pageList:data.stories
    }
    }catch(e){
  
    return {error:`Page Query Where Error: ${e.message}`}
  }})
const createStory = createAsyncThunk("pages/createStory",async (params,thunkApi)=>{
  try{

      let data = await storyRepo.postStory(params)
      return {
        story:data.story
      }
  }catch(e){
    return {
      error: "Create Story"+e
    }
  }
})
const updateStory = createAsyncThunk("pages/updateStory",async(params,thunkApi)=>{
  try{
  let data = await storyRepo.updateStory(params)
  return {
    story: data.story
  }
}catch(e){
  return{
    error: "Update Story"+e
  }
}
})
export {getStory,getMyStories,createStory,updateStory}