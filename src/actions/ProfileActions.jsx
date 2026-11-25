
import { createAsyncThunk,createAction } from "@reduxjs/toolkit";
import profileRepo from "../data/profileRepo";
import uuidv4 from "../core/uuidv4";


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
  async ({ file }, thunkApi) => {
    try {
      const result = await photoRepo.uploadProfilePicture({ file });

      if (!result?.photo?.id) {
        throw new Error("Invalid profile picture upload response.");
      }

      return {
        photo: result.photo,
        profile: result.profile,
      };

    } catch (err) {
      const status = err?.response?.status || err?.status;
      const code = err?.response?.data?.code || err?.code;

      let message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to upload profile picture.";

      if (status === 413 || code === "LIMIT_FILE_SIZE") {
        message = "Image is too large. The maximum size is 5 MB.";
      } else if (status === 401) {
        message = "Your session has expired. Please sign in again.";
      } else if (status === 403) {
        message = "You are not authorized to update this picture.";
      } else if (status >= 500) {
        message = "The server couldn't save your picture. Please try again.";
      } else if (!err?.response && !status && err?.code === "ERR_NETWORK") {
        message = "Network error. Check your connection and try again.";
      }

      console.error("Profile picture upload failed:", {
        status,
        code,
        message,
      });

      return thunkApi.rejectWithValue({
        status,
        code,
        message,
      });
    }
  }
);

// const uploadProfilePicture = createAsyncThunk(
//   "users/uploadProfilePicture",
//   async ({ file }, thunkApi) => {
//     try {
//       if (!file) {
//         throw new Error("No profile picture provided.");
//       }

//       if (file.size > 5 * 1024 * 1024) {
//         throw new Error("Image exceeds the 5 MB upload limit.");
//       }

//       const result = await photoRepo.uploadProfilePicture({ file });

//       if (!result?.photo?.id) {
//         throw new Error(
//           "The image was uploaded, but the server did not return a valid Photo ID."
//         );
//       }

//       return {
//         photo: result.photo,
//         profile: result.profile,
//       };
//     } catch (err) {
//       const status = err?.response?.status || err?.status;
//       const serverMessage = err?.response?.data?.message;

//       let message = serverMessage || err?.message;

//       if (
//         status === 413 ||
//         err?.code === "LIMIT_FILE_SIZE" ||
//         err?.code === "ERR_FR_MAX_BODY_LENGTH_EXCEEDED"
//       ) {
//         message = "Image is too large. Please choose an image smaller than 5 MB.";
//       } else if (status === 401) {
//         message = "Your session has expired. Please sign in again.";
//       } else if (status === 403) {
//         message = "You don't have permission to update your profile picture.";
//       } else if (!status && !err?.response) {
//         message =
//           message || "Network error. Check your connection and try again.";
//       }

//       console.error("Profile picture upload error:", {
//         status,
//         code: err?.code,
//         message,
//       });

//       return thunkApi.rejectWithValue({
//         status,
//         code: err?.code,
//         message: message || "Unable to upload profile picture.",
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
