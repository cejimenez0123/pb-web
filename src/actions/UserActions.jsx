import { createAsyncThunk,createAction } from "@reduxjs/toolkit";
import { auth ,storage} from  "../core/di"
import {  ref, uploadBytes,getDownloadURL,deleteObject } from "firebase/storage";
import authRepo from "../data/authRepo";
import profileRepo from "../data/profileRepo";
import uuidv4 from "../core/uuidv4";
import { Preferences } from "@capacitor/preferences";
import algoliaRepo from "../data/algoliaRepo";
const logIn = createAsyncThunk(
    'users/logIn',
    async (params,thunkApi) => {
   
     
try{        const {uId,email,password,idToken,isNative}=params


        const authData = await authRepo.startSession({uId:uId,email:email,password,identityToken:idToken})
   
        
        const {token}=authData  

  
         await Preferences.set({key:"token",value:token})
  
        return {token:token,profile:authData.user.profiles[0]}
}catch(error){
  console.log(error)
}
      
    }
)


const referSomeone =createAsyncThunk('users/referral',async (params,thunkApi)=>{
  let data = await authRepo.referral(params)
  return data
 })
const signOutAction = createAsyncThunk('users/signOut',async (params,thunkApi)=>{
    try{
       await Preferences.clear()
   await signOut(auth)
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

    console.log("✅ Profile updated in Algolia via API");
  } catch (err) {
    console.error("⚠️ Failed to update profile in Algolia:", err);
  }
}
    return data
  }catch(err){
    return err
  }
})
const signUp = createAsyncThunk(
    'users/signUp',
    async (params,thunkApi) => {
      const{email,token,idToken,googleId,frequency,password,username,profilePicture,selfStatement,privacy}=params

      try {
        
          // const userCred = await  createUserWithEmailAndPassword(auth, email, password)
          let data = await profileRepo.register({uId:"",idToken,frequency,token,email,password,username,profilePicture,selfStatement,privacy})
           

           
          if (!privacy) {
            const {profile}= data
    try {
      await algoliaRepo.saveObject("profile", {
        objectID: profile.id,
        username: profile.username,
        selfStatement: profile.selfStatement,
        profilePic: profile.profilePic,
      });
      console.log("✅ Profile indexed in Algolia");
    } catch (err) {
      console.error("⚠️ Failed to save to Algolia:", err);
    }
  }
            
      return {
      
            profile:data.profile
            
      }
    } catch (error){
       
          console.error("⚠️", err);
       
    }
    }
)



 const searchMultipleIndexes = createAsyncThunk(
  "users/searchMultipleIndexes",
  async (params, thunkApi) => {
    const { query } = params;

    try {
      // Call server-side search via the repo
      const data = await algoliaRepo.search(query);
console.log(data)
      // data should be { results: [...] } as returned by the server
      return { results: data.results };
    } catch (error) {
      console.error("Search failed:", error);
      return thunkApi.rejectWithValue({ error: "Search failed" });
    }
  }
);

const setDialog = createAction("user/setDialog", (params)=> {


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
const getCurrentProfile = createAsyncThunk('users/getCurrentProfile',
async (params,thunkApi) => {
  try{
    const data = await profileRepo.getMyProfiles()
    
   return data
 
    }catch(error){     
      return {error}
    }});

const updateProfile = createAsyncThunk("users/updateProfile",
                    async (params,thunkApi)=>{
try{
          let data = await  profileRepo.updateProfile(params)
          if(data.profile){
            const {profile}=data
           
        try{
        await algoliaRepo.partialUpdateObject("profile",profile.id,{username:profile.username})
        }catch(err){
          console.log(err)
        }
          }
          console.log(data)
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
      return {
        error: new Error("ERROR:FETCH PROFILEE:"+e.message)
      }
  
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
    console.log('File deleted successfully!');
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
    }