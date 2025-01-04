import { io } from 'socket.io-client';
import Enviroment from '../core/Enviroment';
console.log(Enviroment.url)
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
async ({profile,group,groupName},thunkApi)=>{
    try{
        let colData = await collectionRepo.createCollection({title:groupName,isPrivate:true,
          isOpenCollaboration:false,profileId:profile.id,purpose:"Get Feedback"
          
        })
        let collection = colData.collection
       let role = new Role(null,profile,collection,RoleType.editor)
       let roles = group.map(profile=>new Role(null,profile,collection,RoleType.writer))        
        roles=[...roles,role]
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
const fetchWorkshopGroups = createAsyncThunk("books/fetchWorkshopGroups",    async ({radius=50},thunkApi) => {
    try {
        const response = await axios.get(Enviroment.url+`/workshop/groups?radius=${radius}`);
        const {groups}= response.data
        return {groups}
      } catch (error) {
        console.log( error);
        return [];
      }


})
// const fetchWorkshopGroups = async (radius = 50) => {
   
//   };
export {registerUser,disconnectUser, fetchActiveUsers,createWorkshopGroup, fetchWorkshopGroups }