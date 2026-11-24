
import { createAsyncThunk,createAction } from "@reduxjs/toolkit";
import profileRepo from "../data/profileRepo";
import uuidv4 from "../core/uuidv4";
import {storage} from  "../core/di"

import { Preferences } from "@capacitor/preferences";
import Enviroment from "../core/Enviroment";
import photoRepo from "../data/photoRepo";


const addNotification = createAction("profile/ADD_NOTIFICATION",(notification)=>{

return notification
})
const createProfile= createAsyncThunk("users/createProfile",async (params,thunkApi)=>{

    const data = await profileRepo.create(params)
    const profile = data.profile
 
    if(data.token){
    
       await Preferences.set({key:"token",value:JSON.stringify(data.token)})
    }
 

    if(params.privacy){
         await algoliaRepo.saveObject("profile",{
        objectID:profile.id,
        username:profile.username
    });

    }
    return data
 })
 const markNotificationsRead = createAsyncThunk(
  "notifications/markRead",
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await profileRepo.markNotificationsRead();
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data ?? e.message);
    }
  }
);
 const fetchNotifcations = createAsyncThunk("users/fetchNotifications",async (params,thunkApi)=>{
 
        // const {profile}=params
        let items =[]
    

             let data = await profileRepo.notifications(params)
          
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

      if (!file) {
        throw new Error("No profile picture provided.");
      }

      const result = await photoRepo.uploadProfilePicture({ file });

      return {
        photo: result.photo,
      };
    } catch (err) {
      console.error("Profile picture upload error:", err);

      return thunkApi.rejectWithValue({
        message: err?.message || "Unable to upload profile picture.",
      });
    }
  }
);

// const uploadProfilePicture = createAsyncThunk(
//   "users/uploadProfilePicture",
//   async (params, thunkApi) => {
//     try {
//       const { file, id } = params;

//       if (!file) {
//         throw new Error("No file provided");
//       }

//       if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
//         throw new Error("Please select a valid image.");
//       }

//       const extension =
//         file.type === "image/png"
//           ? "png"
//           : file.type === "image/webp"
//             ? "webp"
//             : "jpg";

//       const fileName = `profile/${uuidv4()}-${uuidv4()}.${extension}`;

//       const formData = new FormData();

//       formData.append("file", file, fileName.split("/").pop());
//       formData.append("profileId", id);
//       formData.append("purpose", "profile");
//       formData.append("filename", fileName);

//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/photos`,
//         {
//           method: "POST",
//           credentials: "include",
//           body: formData,
//         }
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Upload failed.");
//       }

//       return {
//         url: `${ import.meta.env.VITE_URL}${result.photo.url}`,
//         fileName,
//         photoId: result.photo.id,
//       };

//     } catch (err) {
//       console.error("Upload error:", err);

//       return thunkApi.rejectWithValue({
//         message: "UPLOAD FAILED: " + err.message,
//       });
//     }
//   }
// );

const uploadPicture = createAsyncThunk(
  "users/uploadPicture",
  async (params, thunkApi) => {
    try {
      const { file, id } = params;

      if (!file) {
        throw new Error("No file provided");
      }

      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        throw new Error("Please select a valid image.");
      }

      const extension =
        file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "jpg";

      const fileName = `image/${Date.now()}-${uuidv4()}.${extension}`;

      const formData = new FormData();

      formData.append("file", file, fileName.split("/").pop());
      formData.append("profileId", id);
      formData.append("purpose", "general");
      formData.append("filename", fileName);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/photos`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Upload failed.");
      }

      return {
        url: `${import.meta.env.VITE_API_URL}${result.photo.url}`,
        fileName,
        photoId: result.photo.id,
      };

    } catch (err) {
      console.error("Upload error:", err);

      return thunkApi.rejectWithValue({
        message: "UPLOAD FAILED: " + err.message,
      });
    }
  }
);


// const uploadPicture = createAsyncThunk(
//   "users/uploadPicture",
//   async (params, thunkApi) => {
//     try {
//       const { file, id } = params;

//       if (!file) {
//         throw new Error("No file provided");
//       }

//       if (!file.type?.startsWith("image/")) {
//         throw new Error("Please select a valid image.");
//       }

//       const storage = getStorage();

//       const extension =
//         file.type === "image/png"
//           ? "png"
//           : file.type === "image/webp"
//             ? "webp"
//             : "jpg";

//       const fileName = `image/${Date.now()}-${uuidv4()}.${extension}`;

//       const storageRef = ref(storage, fileName);

//       await uploadBytes(storageRef, file, {
//         contentType: file.type,
//       });

//       const url = await getDownloadURL(storageRef);

//       return {
//         url,
//         fileName,
//       };
//     } catch (err) {
//       console.error("Upload error:", err);

//       return thunkApi.rejectWithValue({
//         message: "UPLOAD FAILED: " + err.message,
//       });
//     }
//   }
// );
const fetchProfileRecommendations = createAsyncThunk(
  "profile/fetchRecommendations",
  async ({ profileId, limit = 10 }, { rejectWithValue }) => {
    try {
    let data = await profileRepo.recommend({profileId,limit})
    
      return { profiles:data.profiles };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error ?? "Failed to fetch recommendations");
    }
  }
);
const fetchProfiles = createAsyncThunk("users/fetchProfiles",async (params,thunkApi)=>{

  let data = await profileRepo.all()

  return {
    profiles:data.profiles
  }
})
const getMyProfileCollections = createAsyncThunk(
  "profile/getMyProfileCollections",
  async (params, thunkApi) => {
    try {
      return await profileRepo.getMyProfileCollections(params);
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data || error.message
      );
    }
  }
);
 export {
  getMyProfileCollections,
    createProfile,

    uploadPicture,
    uploadProfilePicture,
    fetchProfiles,
    fetchNotifcations,
    addNotification,
    markNotificationsRead,
    fetchProfileRecommendations
}
