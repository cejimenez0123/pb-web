import { io } from 'socket.io-client';
import Enviroment from '../core/Enviroment';
console.log(Enviroment.url)
const socket = io(Enviroment.url);
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

socket.on("connect", () => {
    console.log("Connected to the server:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("connect error",JSON.stringify(error));
});
const registerUser = (profileId, location) => {
    console.log("cutiepie",{profileId,location})
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
export {registerUser,disconnectUser, fetchActiveUsers, fetchWorkshopGroups }