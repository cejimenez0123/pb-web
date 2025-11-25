import { io } from 'socket.io-client';
import Enviroment from '../core/Enviroment';
console.log("Enviroment",Enviroment.url)
let domain = import.meta.env.VITE_DOMAIN
if(import.meta.env.VITE_NODE_ENV=="dev"){
  domain=import.meta.env.VITE_DEV_DOMAIN
}
const socket = io(Enviroment.url);
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import workshopRepo from '../data/workshopRepo';

socket.on("connect", () => {
    console.log("Connected to the server:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("connect error",JSON.stringify(error));
});
const registerUser = (profileId, location) => {
    socket.emit('register', { profileId, location });
  };

const disconnectUser = () => {
    socket.disconnect();
};
const postActiveUser = createAsyncThunk("books/postActiveUser",async(params,thunkApi)=>{
    try {
const {story,profile}=params
     let data= await workshopRepo.postActiveUser({story,profile})
      return {
        profiles:data.profiles,
        profile:data.profile,
        story:data.story
      }
    } catch (error) {
      console.error('Error fetching active users:', error);
      return { profiles:[],
        profile:null,
      story:null}
    }}
  )
const createWorkshopGroup = createAsyncThunk("books/createWorkshopGroup",
async ({profile,story,location,isGlobal},thunkApi)=>{
    try{   
      if(!isGlobal){

  
        let data =await workshopRepo.joinWorkshop({profile,story,location})
        if(!data.collection) throw new Error(data.error)
        console.log("X",data)
        return data
      } else{
        let data =await workshopRepo.joinGlobalWorkshop({profile,story,location})
       if(!data.collection) throw new Error(data.error)
        return data
      }
    }catch(error){
          
        
        return {
            error
          }
    }
}
)
function mergeSmallArrays(input) {
  // Flatten the input array to separate items and small arrays
  let result = [];
  let flattened = [];
  for (let i = 0; i <input.length; i++) { 
    let item = input[i]
    if (Array.isArray(item)) {
      if (item.length < 6) {
        flattened.push(...item);
      } else {
        result.push(item); // Keep arrays with 6 or more items as is
      }
    } else {
      result.push(item); // Include non-array items as is
    }
  }
 
    // Merge the small items into groups of 6 or less
 
    let tempGroup = [];
    flattened.forEach(item => {
      tempGroup.push(item);
      if (tempGroup.length === 6) {
        result.push(tempGroup);
        tempGroup = [];
      }
    });





  // Push any remaining items as a group
  if (tempGroup.length > 0) {
    result.push(tempGroup);
  }

  return result;
}




const fetchWorkshopGroups = createAsyncThunk("books/fetchWorkshopGroups",    async ({radius=50},thunkApi) => {
    try {
        const response = await axios.get(Enviroment.url+`/workshop/groups?radius=${radius}`,{
          headers:{
            Authorization:"Bearer "+(await Preferences.get({key:"token"})).value
          }
        });
    
        return response.data
      } catch (error) {
        console.log( error);
        return [];
      }


})

export {registerUser,disconnectUser, postActiveUser,createWorkshopGroup, fetchWorkshopGroups }