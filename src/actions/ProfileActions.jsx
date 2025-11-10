
import { createAsyncThunk,createAction } from "@reduxjs/toolkit";
import profileRepo from "../data/profileRepo";
import uuidv4 from "../core/uuidv4";
import {storage} from  "../core/di"
import {  ref, uploadBytes,getDownloadURL   } from "firebase/storage";
import { Preferences } from "@capacitor/preferences";
import Enviroment from "../core/Enviroment";
const createProfile= createAsyncThunk("users/createProfile",async (params,thunkApi)=>{

    const data = await profileRepo.create(params)
    const profile = data.profile
    if(data.token){
    
       await Preferences.set({key:"token",value:JSON.stringify(data.token)})
    }
    console.log(params)

    if(params.privacy){
         await algoliaRepo.saveObject("profile",{
        objectID:profile.id,
        username:profile.username
    });

    }
    return data
 })
 const fetchNotifcations = createAsyncThunk("users/fetchNotifications",async (params,thunkApi)=>{
 
        const {profile}=params
        let items =[]
       const token =(await Preferences.get({key:"token"})).value

             let data = await profileRepo.notifications({token,profile})
          
             const payload = data
           
             if(payload){
              
                let seen = []
                const{collections, comments,following,followers}=payload
                let newFollowers = followers?followers.map(follow=>{return{type:"follower",item:follow}}):[]
                let newComs = comments?comments.map(com=>{return{type:"comment",item:com}}):[]
                let newFollowContent = following?following.map(fol=>{
                    
                   return fol.following.stories.map(story=>{
                        return {type:"story",item:story,profile:fol.following}
                    })
                }).flat():[]
                let newCols = collections? collections.filter(item=>item.storyIdList!=0).map(col=>{
                 
                    let storyList = col.storyIdList
                   let latest=storyList.sort((a,b)=>{
                        return b.created>a.created 
                    })[0].story
                    return {type:"collection",item:latest,collection:col}
                }):[]
                let list = [...newComs,...newFollowContent,...newCols,...newFollowers].filter(item => {
                    
                    let found = seen.find(i=>i.item.id==item.item.id)
                   
                    if (!found) {
                      seen.push(item);
                      return true;
                    }
                    return false;
                  })
                let sorted = seen.sort((a,b)=>{
                    return b.item.created>a.item.created 
                })
                const index = sorted.findIndex(item => {
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(today.getDate() - 1);
                  
                    return new Date(item.item.created) < yesterday
                });
            
                const before = sorted.slice(0, index);
                const after = sorted.slice(index); 
                const newItemArray = [Enviroment.blankPage]; 
                const newArray = before.concat(newItemArray, after);
                items = [...items,...newArray]
                return items
            }
               
        
        
         

          return data
  
 })

const uploadProfilePicture = createAsyncThunk(
  "users/uploadProfilePicture",
  async (params, thunkApi) => {
    try {
      const { file } = params;

      if (!file) throw new Error("No file provided");

     
      const extension = file.name?.split(".").pop() || "jpg";
      const fileName = `profile/${file.name?.split(".")[0] ?? uuidv4()}-${uuidv4()}.${extension}`;

      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);

      return {
        url,
        fileName,
      };
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      return thunkApi.rejectWithValue({
        message: "Error: UPLOAD Profile Picture " + err.message,
      });
    }
  }
);
const uploadPicture = createAsyncThunk("users/uploadPicture",async (params,thunkApi)=>{
  try {
  // const {file,profile}= params
      try {
      const { file } = params;

      if (!file) throw new Error("No file provided");

     
      const extension = file.name?.split(".").pop() || "jpg";
      const fileName = `image/${file.name?.split(".")[0] ?? uuidv4()}-${uuidv4()}.${extension}`;

      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);

      return {
        url,
        fileName,
      };
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      return thunkApi.rejectWithValue({
        message: "Error: UPLOAD Profile Picture " + err.message,
      });
    }
  }catch(e){
    console.log(e)
    }
  }

)
const fetchProfiles = createAsyncThunk("users/fetchProfiles",async (params,thunkApi)=>{

  let data = await profileRepo.all()

  return {
    profiles:data.profiles
  }
})
 export {
    createProfile,
    uploadPicture,
    uploadProfilePicture,
    fetchProfiles,
    fetchNotifcations
}
