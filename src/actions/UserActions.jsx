import { createAsyncThunk,createAction } from "@reduxjs/toolkit";
import { auth, client ,storage} from  "../core/di"
import {  ref, uploadBytes,getDownloadURL  } from "firebase/storage";
import authRepo from "../data/authRepo";
import profileRepo from "../data/profileRepo";
import uuidv4 from "../core/uuidv4";
const logIn = createAsyncThunk(
    'users/logIn',
    async (params,thunkApi) => {
   
     

        const {uId,email,password}=params


        const authData = await authRepo.startSession({uId:uId,email:email,password})
   
        
        const {token}=authData
        localStorage.setItem("token",token)
        const data= await profileRepo.getMyProfiles({token:token})
        const profile = data.profile
        
        return{
          profile: profile
       } 
     
      
      
    }
)

const referSomeone =createAsyncThunk('users/referral',async (params,thunkApi)=>{
  let data = await authRepo.referral(params)
  return data
 })
const signOutAction = createAsyncThunk('users/signOut',async (params,thunkApi)=>{
    localStorage.clear()
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
    if(data.profile&&!data.profile.isPrivate){
      const {profile}=data
      client.initIndex("profile").partialUpdateObject({objectID: profile.id,usernamename:profile.username,type:"profile"},{createIfNotExists:true}).wait()
    }
    return data
  }catch(err){
    return err
  }
})
const signUp = createAsyncThunk(
    'users/signUp',
    async (params,thunkApi) => {
      const{email,token,googleId,frequency,password,username,profilePicture,selfStatement,privacy}=params

      try {
        
          // const userCred = await  createUserWithEmailAndPassword(auth, email, password)
          let data = await profileRepo.register({uId:"",frequency,token,email,password,username,profilePicture,selfStatement,privacy})
           
        
            if(!privacy){
         client.initIndex("profile").saveObject({ objectID:data.profile.id,
                                              username:username,
                                             }).wait()  
                                            }                                    
                
      return {
      
            profile:data.profile
            
      }
    } catch (error){
        try{
          let data = await profileRepo.register({token,frequency,googleId,password,username,profilePicture,selfStatement,privacy})
          localStorage.setItem("token",data.token)
          client.initIndex("profile").saveObject({ objectID:data.profile.id,
            username:username,
           }).wait()       
          return {profile:data.profile}
        }catch(error){
          return {error}
        }
       
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

  let token = localStorage.getItem("token")
  if(token){
    const data = await profileRepo.getMyProfiles({token:token})
if(data.profile){


    return {
    profile: data.profile
   } }
  }
    throw new Error("No Token")
  
    
    }catch(error){
      console.log({error})
      localStorage.clear()
      return {error}
    }});

const updateProfile = createAsyncThunk("users/updateProfile",
                    async (params,thunkApi)=>{

          let data = await  profileRepo.updateProfile(params)
          if(data.profile){
            const {profile}=data
            client.initIndex("profile").saveObject(
                {objectID:profile.id,username:profile.username,type:"profile"}).wait()
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
      const token = localStorage.getItem("token")
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