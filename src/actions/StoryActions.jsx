import { createAsyncThunk } from "@reduxjs/toolkit";
import storyRepo from "../data/storyRepo";
import { client } from "../core/di";
import { PageType } from "../core/constants";
import {storage} from "../core/di"
import {  ref,deleteObject   } from "firebase/storage";
import { Preferences } from "@capacitor/preferences";

const getStory = createAsyncThunk("story/getStory",async ({id},thunkApi)=>{
  try{

    let token =(await Preferences.get({key:"token"})).value
    if(token){
     let data = await storyRepo.getStoryProtected({id:id})
     return {story:data.story}

    }else{
          let data = await storyRepo.getStoryPublic({id:id})
        return {story:data.story}

    }
  }catch(error){
    console.log("Error in getStory:", error);
    return {error}
  }
})
const deleteStory = createAsyncThunk("pages/deleteStory",async (params,thunkApi)=>{
try{
  const {page}=params
  if(page.type==PageType.picture){
    let refer = ref(storage,page.data)
    deleteObject(refer)
  }
  let data = await storyRepo.deleteStory({id:page.id})
  client.initIndex("story").deleteObject(page.id).wait()

    return data


}catch(error){

  return {
    error
  }
}
})
const fetchRecommendedStories = createAsyncThunk(
  'pages/fetchRecommendedStories',
  async (params,thunkApi) => {
try{
      let data = await storyRepo.recommendations()
      if(data.stories){
        return {
          stories:data.stories
        }
      }else{
        return{
          stories:[]
        }
      }
    }catch(error){
      return {error}
    }
  })
const getMyStories= createAsyncThunk(
    'pages/getMyStories',
    async (params,thunkApi) => {
      try{
      let data = await storyRepo.getMyStories(params)
 
    return {
      pageList:data.stories
    }
    }catch(e){
  
    return {error:`get my stories ${e.message}`}
  }})
const createStory = createAsyncThunk("pages/createStory",async (params,thunkApi)=>{
  try{

      let data = await storyRepo.postStory(params)
       const {story}=data
      if(!data.story.isPrivate){
       
        await client.partialUpdateObject(
  { objectID: story.id, title: story.title, type: "story" },
  { createIfNotExists: true }
);}
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
 
  if(data.story&& params && !data.story.isPrivate&&data.story.id){
  
    client.initIndex("story").partialUpdateObject(
      {objectID:data.story.id,title:data.story.title,type:"story"},{createIfNotExists:true}).wait()
   }else{

        client.initIndex("story").deleteObject(data.story.id)
      
   }
  return {
    story: data.story
  }
}catch(e){

  return{
    error: e
  }
}
})
const getCollectionStoriesPublic = createAsyncThunk("pages/getCollectionStoriesPublic",async (params,thunkApi)=>{
  try{
     let data = await storyRepo.getCollectionStoriesPublic(params)
     return {
      list:data.list
     }
  }catch(e){
    return {error:e}
  }
})
const getCollectionStoriesProtected = createAsyncThunk("pages/getCollectionStoriesProtected",async (params,thunkApi)=>{
  try{

    let data = await storyRepo.getCollectionStoriesProtected(params)
 
    return {
     list:data.list
    }
  }catch(e){
    return {
      error:e
    }
  }
})
export {deleteStory,getStory,getMyStories,createStory,updateStory,
  getCollectionStoriesProtected,getCollectionStoriesPublic,fetchRecommendedStories
}