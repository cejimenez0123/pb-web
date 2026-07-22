import { createAsyncThunk,createAction } from "@reduxjs/toolkit";
import { storage} from  "../core/di"
import {  ref,deleteObject } from "firebase/storage";
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
const useReferral = createAsyncThunk("users/useReferral",async(params,thunkApi)=>{
  try{ 
  let data = await authRepo.useReferral(params)
 if (data.profile && !data.profile.isPrivate) {
  const { profile } = data;

  try {
    await algoliaRepo.partialUpdateObject(
      "profile", // ✅ index name
      profile.id, // ✅ objectID
      {
        username: profile.username, // ✅ field(s) to update
      }
    );

  } catch (err) {
    return thunkApi.rejectWithValue(err);
  }
}
    return data
  }catch(err){
    return err
  }
})
const setMainLoading = createAction("books/setCollectionInView", (params)=> {

  
    
    return  {payload:params
    }


  })
const signUp = createAsyncThunk(
    'users/signUp',
    async (params,thunkApi) => {
         const { email, referralToken, writingSprintSlots, idToken, googleId, frequency, password, username, profilePicture, selfStatement, privacy } = params

      try {
        

let data = await profileRepo.register({
  uId: "",
  idToken,
  writingSprintSlots,
  frequency,
  referralToken,  // ← renamed
  email,
  password,
  username,
  profilePicture,
  selfStatement,
  privacy
})
           
          if (!privacy) {
            const {profile}= data
    try {
      await algoliaRepo.saveObject("profile", {
        objectID: profile.id,
        username: profile.username,
        selfStatement: profile.selfStatement,
        profilePic: profile.profilePic,
      });
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
            
      return {
      
            profile:data.profile
            
      }
    } catch (error){
      return thunkApi.rejectWithValue(error);
    }
  }
);

const searchMultipleIndexes = createAsyncThunk(
  "users/searchMultipleIndexes",
  async (params, thunkApi) => {
    const { query, filters = [],profileId} = params;

    try {
      const data = await algoliaRepo.search(query, profileId,filters);

      return { results: data.results??[] };
    } catch (error) {
      console.error("Search failed:", error);
      return thunkApi.rejectWithValue({ error: "Search failed" });
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

const updateProfile = createAsyncThunk("users/updateProfile",
                    async (params,thunkApi)=>{
try{
          let data = await  profileRepo.updateProfile(params)
          if(data.profile){
            const {profile}=data
           
        try{
        await algoliaRepo.partialUpdateObject("profile",profile.id,{username:profile.username})
        }catch(err){
          return thunkApi.rejectWithValue(err)
        }
          }
          return {profile:data.profile}
        }catch(err){
          return err
        }
})




const fetchProfile = createAsyncThunk("users/fetchProfile", async function(params,thunkApi){
  
    try {
      const token =(await Preferences.get({key:"token"})).value
      if(token){
   
        let data = await profileRepo.getProfileProtected(params)
     
        return{
          profile:data.profile
        }
      }else{
        
        let data = await profileRepo.getProfile(params)


        return{
          profile:data.profile
        }
      }
    }catch(e){
      return thunkApi.rejectWithValue(e)
    }
  
  
  })
  const setProfileInView = createAction("users/setProfileInView", (params)=> {

    const {profile} = params
   
    return  {payload:
      profile}
      
    
  })


const deletePicture = createAsyncThunk("users/deletePicture",async (params,thunkApi)=>{
  try {
    const {fileName}=params
    const imageRef = ref(storage, fileName); // Create a reference to the file
    await deleteObject(imageRef); // Delete the file
    return{message:"Success delete"}
  } catch (error) {
    
    console.error('Error deleting file:', error);
       return{message:error.message}
  }
})


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


const  searchDialogToggle = createAction("users/searchDialogToggle",(params,thunkApi)=>{
  const {open} = params
  return {payload: open}
})

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
        searchDialogToggle,
        searchMultipleIndexes,
        deletePicture,
        updateSubscription,
        getIosInfo,
        setAuthResolved,
        acceptTerms,
        setUserLoading,setCurrentProfile,referSomeone,setMainLoading,setAlert
    }