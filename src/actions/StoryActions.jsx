import { createAsyncThunk } from "@reduxjs/toolkit";
import storyRepo from "../data/storyRepo";
import { PageType } from "../core/constants";
import { Preferences } from "@capacitor/preferences";
import algoliaRepo from "../data/algoliaRepo";
import { FirebaseStorage } from "@capacitor-firebase/storage";

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
 
    return {error}
  }
})
const deleteStory = createAsyncThunk("pages/deleteStory",async (params,thunkApi)=>{
try{
  const {page}=params
try{
       if(page && page.type==PageType.picture){
  
  await FirebaseStorage.deleteFile({
    path: page.data,
  });

  }
}catch(err){
  
}
 storyRepo.deleteStory({id:page.id})
    return page


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
const getMyStories = createAsyncThunk(
  'pages/getMyStories',
  async (params, thunkApi) => {
    try {
          
      const data = await storyRepo.getMyStories(params);



      return {
        totalCount:data.totalCount,
        hasMore:data.hasMore,
        skip:data.skip,
        take:data.take,
        pageList: data.items,
      };
    } catch (e) {
   

      return thunkApi.rejectWithValue(
        e?.response?.data || e.message
      );
    }
  }
);
const createStory = createAsyncThunk("pages/createStory",async (params,thunkApi)=>{
  try{

      let data = await storyRepo.postStory(params)
       const {story}=data
      
      if(story && !story.isPrivate && story.id) {
       await algoliaRepo.partialUpdateObject("story",story.id,{title:story?.title})
      }

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
    return {
      error: e
    }
  }}
)
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
const getPrompts = createAsyncThunk("pages/getPrompts",async ({take },thunkApi)=>{
  try{
     let data = await storyRepo.getPrompts({take })
 
     return {
      prompts:data.prompts
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
export {deleteStory,getStory,getMyStories,createStory,updateStory,getPrompts,
  getCollectionStoriesProtected,getCollectionStoriesPublic,fetchRecommendedStories
}