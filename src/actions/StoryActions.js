import { createAsyncThunk } from "@reduxjs/toolkit";
import storyRepo from "../data/storyRepo";
import { client } from "../core/di";
const getStory = createAsyncThunk("story/getStory",async (params,thunkApi)=>{
    
    let token = localStorage.getItem("token")
    if(token){
   
     let data = await storyRepo.getStoryProtected({id:params.id})
     return {story:data.story}
    
    }else{
      let data = await storyRepo.getStoryPublic({id:params.id})
      return {story:data.story}
    }

})
const deleteStory = createAsyncThunk("pages/deleteStory",async (params,thunkApi)=>{

  const {page}=params
  let data = await storyRepo.deleteStory({id:page.id})
  client.initIndex("page").deleteObject(page.id).wait()

    return data
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
      if(!data.story.isPrivate){
        const {story}=data
          client.initIndex("story").saveObject(
            {objectID:story.id,title:story.title,type:"story"}).wait()
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
  return{
    error: "Update Story"+e
  }
}
})
const getCollectionStoriesPublic = createAsyncThunk("pages/getCollectionStoriesPublic",async (params,thunkApi)=>{
  try{

     let data = await storyRepo.getCollectionStoriesPublic(params)
    console.log(data)
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
  getCollectionStoriesProtected,getCollectionStoriesPublic
}