import { io } from 'socket.io-client';
import Enviroment from '../core/Enviroment';
console.log(Enviroment.url)
const socket = io(Enviroment.url);
import axios from 'axios';


const registerUser = (userId, location) => {
    socket.emit('register', { userId, location });
  };

const disconnectUser = () => {
    socket.disconnect();
};
const fetchActiveUsers = async () => {
    try {
      const response = await axios.get(Enviroment.url+'/workshop/active-users');
      console.log(response)
      return response.data.profiles;
    } catch (error) {
      console.error('Error fetching active users:', error);
      return [];
    }
  };
const fetchWorkshopGroups = async (radius = 50) => {
    try {
      const response = await axios.get(Enviroment.url+`/workshop/groups?radius=${radius}`);
      return response.data;
    } catch (error) {
      console.log( error);
      return [];
    }
  };
export {registerUser,disconnectUser, fetchActiveUsers, fetchWorkshopGroups }