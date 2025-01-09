import { io } from 'socket.io-client';
import Enviroment from '../core/Enviroment';
console.log("Enviroment",Enviroment.url)
const socket = io(Enviroment.url);
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import collectionRepo from '../data/collectionRepo';
import Role from '../domain/models/role';
import { RoleType } from '../core/constants';
import roleRepo from '../data/roleRepo';

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
const fetchActiveUsers = async ({profile,story}) => {
    try {

      const response = await axios.post(Enviroment.url+`/workshop/active-users`,{
        story:story,
        profile:profile
      },{headers:{
        Authorization:"Bearer "+localStorage.getItem("token")
      }});  
// console.log("Rponer",response)
      return response.data.profiles;
    } catch (error) {
      console.error('Error fetching active users:', error);
      return [];
    }
  };
const createWorkshopGroup = createAsyncThunk("books/createWorkshopGroup",
async ({profile,story,location},thunkApi)=>{
    try{
     let res = await axios.post(Enviroment.url+'/workshop/groups',{profile,story:story,location},{headers:{
      Authorization:"Bearer "+localStorage.getItem("token")
     }})
    
  return({collection:res.data.collection})
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

// Example usage


const fetchWorkshopGroups = createAsyncThunk("books/fetchWorkshopGroups",    async ({radius=50},thunkApi) => {
    try {
        const response = await axios.get(Enviroment.url+`/workshop/groups?radius=${radius}`,{
          headers:{
            Authorization:"Bearer "+localStorage.getItem("token")
          }
        });
        console.log("REreere",response.data)
        // const {groups}= response.data
        // let result = mergeSmallArrays(groups)
     
        return response.data
      } catch (error) {
        console.log( error);
        return [];
      }


})
// const fetchWorkshopGroups = async (radius = 50) => {
   
//   };
export {registerUser,disconnectUser, fetchActiveUsers,createWorkshopGroup, fetchWorkshopGroups }