import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Enviroment from "../core/Enviroment";


const getStory = createAsyncThunk("story/getStory",async (params,thunkApi)=>{
    
    let res = await axios(Enviroment.url+"/story/"+params.id)
    return {
        story: res.data.story
    }
})

export {getStory}