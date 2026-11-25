import { createAsyncThunk,createAction } from "@reduxjs/toolkit";

import authRepo from "../data/authRepo";
import profileRepo from "../data/profileRepo";
import { Preferences } from "@capacitor/preferences";
import algoliaRepo from "../data/algoliaRepo";

const logIn = createAsyncThunk(
  'users/logIn',
  async (params, thunkApi) => {
    try {
      const { uId, email, password, idToken, provider, isNative } = params;

      const body = {
        uId,
        email,
        password,
        idToken:       provider === 'google' ? idToken : null,
        identityToken: provider === 'apple'  ? idToken : null,
      };

      const authData = await authRepo.startSession(body);
      const { token } = authData;
      await Preferences.set({ key: "token", value: token });
         return { token, profile: authData.profile, user: authData.user, termsCurrent: authData.termsCurrent }
    } catch (error) {
      // Extract the useful parts from the axios error
      const status  = error?.response?.status;
      const message = error?.response?.data?.message || error?.message || "Unknown error";
      return thunkApi.rejectWithValue({ status, message });
    }
  }
);

const acceptTerms = createAsyncThunk(
    "user/acceptTerms",
    async ({ version }, { rejectWithValue }) => {
        try {
            const data = await authRepo.acceptTerms({ version });
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data || { message: error.message });
        }
    }
);
const referSomeone =createAsyncThunk('users/referral',async (params,thunkApi)=>{
  let data = await authRepo.referral(params)
  return data
 })
const signOutAction = createAsyncThunk('users/signOut',async (params,thunkApi)=>{
    try{
       await Preferences.clear()
    
  //  await signOut(auth)
   return 
    }catch(err){
      
    }
   return {
        profile:null
   }
})
const useReferral = createAsyncThunk(
  "users/useReferral",
  async (params, thunkApi) => {
    try {
      const data = await authRepo.useReferral(params);

      if (data.profile && !data.profile.isPrivate) {
        try {
          await algoliaRepo.partialUpdateObject(
            "profile",
            data.profile.id,
            { username: data.profile.username }
          );
        } catch (error) {
          // Algolia failure should not undo a successful signup.
          console.error("Referral profile Algolia update failed:", error);
        }
      }

      return data;
    } catch (error) {
      return thunkApi.rejectWithValue({
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to complete referral signup.",
      });
    }
  }
);
const setMainLoading = createAction("books/setCollectionInView", (params)=> {

  
    
    return  {payload:params
    }


  })
  const signUp = createAsyncThunk(
  "users/signUp",
  async (params, thunkApi) => {
    const {
      email,
      referralToken,
      writingSprintSlots,
      idToken,
      googleId,
      frequency,
      password,
      username,
      profilePicture,
      selfStatement,
      privacy,
    } = params;

    try {
      const data = await profileRepo.register({
        uId: "",
        idToken,
        writingSprintSlots,
        frequency,
        referralToken,
        email,
        password,
        username,
        profilePicture,
        selfStatement,
        privacy,
      });

      if (!data?.profile || !data?.token) {
        throw new Error("Registration did not return a profile and authentication token.");
      }

      // Save the authenticated profile token before uploading Photos.
      await Preferences.set({
        key: "token",
        value: data.token,
      });

      // Update the cached token too.
      profileRepo.token = data.token;

      if (!privacy) {
        try {
          await algoliaRepo.saveObject("profile", {
            objectID: data.profile.id,
            username: data.profile.username,
            selfStatement: data.profile.selfStatement,
            profilePic: data.profile.profilePic,
          });
        } catch (err) {
          console.warn("Algolia profile indexing failed:", err);
        }
      }

      return {
        profile: data.profile,
        token: data.token,
      };
    } catch (error) {
      return thunkApi.rejectWithValue({
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to complete registration.",
      });
    }
  }
);
// const signUp = createAsyncThunk(
//     'users/signUp',
//     async (params,thunkApi) => {
//          const { email, referralToken, writingSprintSlots, idToken, googleId, frequency, password, username, profilePicture, selfStatement, privacy } = params

//       try {
        

// let data = await profileRepo.register({
//   uId: "",
//   idToken,
//   writingSprintSlots,
//   frequency,
//   referralToken,  // ← renamed
//   email,
//   password,
//   username,
//   profilePicture,
//   selfStatement,
//   privacy
// })
           
//           if (!privacy) {
//             const {profile}= data
//     try {
//       await algoliaRepo.saveObject("profile", {
//         objectID: profile.id,
//         username: profile.username,
//         selfStatement: profile.selfStatement,
//         profilePic: profile.profilePic,
//       });
//     } catch (err) {
//       return thunkApi.rejectWithValue(err);
//     }
//   }
            
//       return {
      
//             profile:data.profile
            
//       }
//     } catch (error){
//       return thunkApi.rejectWithValue(error);
//     }
//   }
// );


const searchMyWork = createAsyncThunk(
  "users/searchMyWork",
  async ({ query = "", filters = [] }, thunkAPI) => {
    try {
      return await algoliaRepo.searchMyWork(
        query,
        filters
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


const searchMultipleIndexes = createAsyncThunk(
  "users/searchMultipleIndexes",
  async (params, thunkApi) => {
    const { query, filters = [] } = params;

    try {
      const data = await algoliaRepo.search(query, filters);

      return {
        results: data.results ?? [],
      };
    } catch (error) {
      console.error("Search failed:", error);

      return thunkApi.rejectWithValue({
        error: "Search failed",
      });
    }
  }
);

const setCurrentProfile = createAction("user/setCurrentProfile", (params)=> {


  return  {payload:
     params}
    
  
})
const setDialog = createAction("user/setDialog", (params)=> {


  return  {payload:
     params}


})
const setAlert = createAction("user/setAlert", (params) => {
  return { payload: params }
})
const setUserLoading = createAction("user/setUserLoading", (params)=> {


  return  {payload:
     params}
    
  
})
const getIosInfo = createAsyncThunk("user/iOSinfo",async (params)=> {

let data =await authRepo.appleSignIn(params)
  return  {profile:
     data.profile}
    
  
})

const setSignedInTrue = createAction("users/setSignedInTrue", async(params)=>{
 return
}
)
const setSignedInFalse = createAction("users/setSignedInFalse", async(params)=>{
  return
 }
 )
const updateSubscription= createAsyncThunk("users/updateSubscription", async (params,thunkApi)=>{
 
  const data = await authRepo.updateSubscription(params)

  return data
})
const setAuthResolved = createAction("users/setAuthResolved");
const getCurrentProfile = createAsyncThunk(
  'users/getCurrentProfile',
  async (params, thunkApi) => {
    try {
      const data = await profileRepo.getMyProfiles();
  
      return data; // ✅ return clean payload
    } catch (error) {

      return thunkApi.rejectWithValue(
        error?.response?.data || error.message
      );
    }
  }
);




const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (params, thunkAPI) => {
    try {
      return await profileRepo.updateProfile(params);
    } catch (err) {
      const data = err?.response?.data || {};

      return thunkAPI.rejectWithValue({
        ...data,
        status: err?.response?.status || err?.status,
        code: data?.code || err?.code,
        message:
          data?.message ||
          data?.error ||
          err?.message ||
          "Unable to update profile.",
      });
    }
  }
);




const fetchProfile = createAsyncThunk(
  "users/fetchProfile",
  async (params, thunkApi) => {
    try {
      const token = (await Preferences.get({ key: "token" })).value;

      const data = token
        ? await profileRepo.getProfileProtected(params)
        : await profileRepo.getProfile(params);

      if (!data?.profile) {
        return thunkApi.rejectWithValue(
          data?.message || "Profile could not be found."
        );
      }

      return {
        profile: data.profile,
        isPrivate: Boolean(data.isPrivate),
      };
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Unable to retrieve profile."
      );
    }
  }
);


  const setProfileInView = createAction("users/setProfileInView", (params)=> {

    const {profile} = params
   
    return  {payload:
      profile}
      
    
  })
 const resendProfileSetup = createAsyncThunk(
  "user/resendProfileSetup",
  async ({ email }, thunkAPI) => {
    try {
      return await authRepo.resendProfileSetup({ email });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Unable to send the profile setup email."
      );
    }
  }
);

// const deletePicture = createAsyncThunk("users/deletePicture",async (params,thunkApi)=>{
//   try {
//     const {fileName}=params
//     const imageRef = ref(storage, fileName); // Create a reference to the file
//     await deleteObject(imageRef); // Delete the file
//     return{message:"Success delete"}
//   } catch (error) {
    
//     console.error('Error deleting file:', error);
//        return{message:error.message}
//   }
// })


const deleteUserAccounts = createAsyncThunk("users/deleteUserAccounts",async (params,thunkApi)=>{

  try{
    await authRepo.deleteUser()

    return {
      code: 200
    }
  }catch(err) {

return {error: new Error("Error: Deleting useer account"+err.message)
  }
}})




const setEvents = createAction("users/addEVents", (params)=> {

  const {events} = params
  
  return  {payload:
    events}
    
  
})


export {logIn,
        signUp,
        getCurrentProfile,
        updateProfile,
    
        fetchProfile,
        setProfileInView,
    
        signOutAction,
        useReferral,
       
        deleteUserAccounts,
        setEvents,
        setSignedInTrue,
        setSignedInFalse,
        setDialog,

        searchMultipleIndexes,

        updateSubscription,
        getIosInfo,
        setAuthResolved,
        acceptTerms,
        searchMyWork,
        resendProfileSetup,
        setUserLoading,setCurrentProfile,referSomeone,setMainLoading,setAlert
    }