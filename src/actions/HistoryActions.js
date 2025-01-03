import { createAsyncThunk } from "@reduxjs/toolkit";
import historyRepo from "../data/historyRepo";


const postStoryHistory = createAsyncThunk("history/postStoryHistory",async ({profile,story},thunkApi)=>{
    
   let {profile} = await historyRepo.storyCreate({profile,story})

    return {profile}

})


const postCollectionHistory = createAsyncThunk("history/postCollectionHistory",async({profile,collection},thunkApi)=>{


  let  {profile} = await historyRepo.collectionCreate({profile,collection})
  return {profile}
})

export {postStoryHistory,postCollectionHistory}