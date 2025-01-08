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
const fetchActiveUsers = async () => {
    try {
      const response = await axios.get(Enviroment.url+'/workshop/active-users');

      return response.data.profiles;
    } catch (error) {
      console.error('Error fetching active users:', error);
      return [];
    }
  };
const createWorkshopGroup = createAsyncThunk("books/createWorkshopGroup",
async ({profile,group,page,groupName,location},thunkApi)=>{
    try{
        let colData = await collectionRepo.createCollection({title:groupName,isPrivate:true,
          isOpenCollaboration:false,profileId:profile.id,type:"feedback",location
          
        })
        let collection = colData.collection
       let role = new Role(null,profile,collection,RoleType.editor)
       let roles = group.map(profile=>new Role(null,profile,collection,RoleType.editor))        
        roles=[...roles,role]
        await collectionRepo.addStoryListToCollection({id:collection.id,list:[page],profile})
       let data = await roleRepo.patchCollectionRoles({roles,profile,collection})
       console.log("colData",colData) 
       console.log("Data",data)
       
       return {
          collection: data.collection,
          roles:data.roles
        }  
      
      }catch(error){
        console.log(error)
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
        const {groups}= response.data
        let result = mergeSmallArrays(groups)
        console.log(result)
        return {groups:  result}
      } catch (error) {
        console.log( error);
        return [];
      }


})
// const fetchWorkshopGroups = async (radius = 50) => {
   
//   };
export {registerUser,disconnectUser, fetchActiveUsers,createWorkshopGroup, fetchWorkshopGroups }