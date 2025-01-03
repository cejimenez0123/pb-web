import { createAsyncThunk } from "@reduxjs/toolkit";
import historyRepo from "../data/historyRepo";


const postStoryHistory = createAsyncThunk("history/postStoryHistory",async ({profile,story},thunkApi)=>{
    
   let data = await historyRepo.storyCreate({profile,story})

    return {profile:data.profile}

})
const postCollectionHistory = createAsyncThunk("history/postCollectionHistory",async({profile,collection},thunkApi)=>{


  let  data= await historyRepo.collectionCreate({profile,collection})
  return {profile:data.profile}
})

export {postStoryHistory,postCollectionHistory}