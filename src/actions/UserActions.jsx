import { createAsyncThunk,createAction } from "@reduxjs/toolkit";
import { auth, client ,storage} from  "../core/di"
import {  ref, uploadBytes,getDownloadURL,deleteObject } from "firebase/storage";
import authRepo from "../data/authRepo";
import profileRepo from "../data/profileRepo";
import uuidv4 from "../core/uuidv4";
import { Preferences } from "@capacitor/preferences";
import algoliaRepo from "../data/algoliaRepo";

const logIn = createAsyncThunk(
    'users/logIn',
    async (params,thunkApi) => {
   
     await Preferences.clear()
try{        const {uId,email,password,idToken,isNative}=params


        const authData = await authRepo.startSession({uId:uId,email:email,password,identityToken:idToken})
   
        
        const {token}=authData 
        Preferences.set({key:"token",value:token})
      console.log(authData)
        return {token:authData,profile:authData.user.profiles[0]}
}catch(error){
    console.log(error)
  return {error:error.message}

}
      
    }
)

const referSomeone =createAsyncThunk('users/referral',async (params,thunkApi)=>{
  let data = await authRepo.referral(params)
  return data
 })
const signOutAction = createAsyncThunk('users/signOut',async (params,thunkApi)=>{
   await Preferences.clear()
    try{
      
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
const searchMultipleIndexes = createAsyncThunk("users/seachMultipleIndexes",
  async (params,thunkApi)=>{
    	  const {query} = params
        const queries = [{
          indexName: 'profile',
          query: query,
        }, {
          indexName: 'story',
  query: query,

}, {
  indexName: 'collection',
  query: query,
  
},{indexName:"hashtag",query:query}];

  let {results}= await client.multipleQueries(queries)

  return {results}
})

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
  let token = (await Preferences.get({key:"token"})).value

 if(token){
    const data = await profileRepo.getMyProfiles({token:token})
  // console.log("CURRENT PROFILE xDATA",data)
  //  if(data && data.token){
  //   await Preferences.set({key:"token",value:data.token})
  //  }


   return data
  }else{
    throw new Error("No Token")
  } 
  
  
    
    }catch(error){     
      return {error}
    }});

const updateProfile = createAsyncThunk("users/updateProfile",
                    async (params,thunkApi)=>{

          let data = await  profileRepo.updateProfile(params)
          if(data.profile){
            const {profile}=data
            await client.partialUpdateObject(
                {objectID:profile.id,attributesToUpdate:{username:profile.username},indexName:"profile"})
        }
          return {profile:data.profile}
  
})


const uploadPicture = createAsyncThunk("users/uploadPicture",async (params,thunkApi)=>{
  try {
  const {file,profile}= params
  if(file){
    

  const fileName = `/image/${profile.id}/${file.name}?!@@${uuidv4()}`

  const storageRef = ref(storage, fileName);
  const blob = new Blob([file])
  await uploadBytes(storageRef, blob)

  const url = await getDownloadURL(storageRef)
      return{ 
          ref:fileName,
          url: url
      }
    }else{
        throw new Error("file not found")
    }
  }catch(err){
      return{ error: err }
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
        uploadPicture,
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