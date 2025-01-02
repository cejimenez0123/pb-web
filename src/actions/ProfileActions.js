
import { createAsyncThunk,createAction } from "@reduxjs/toolkit";
import profileRepo from "../data/profileRepo";
import uuidv4 from "../core/uuidv4";
import {storage} from  "../core/di"
import { client } from "../core/di";
import {  ref, uploadBytes,getDownloadURL,deleteObject   } from "firebase/storage";

const createProfile= createAsyncThunk("users/createProfile",async (params,thunkApi)=>{

    const data = await profileRepo.create(params)

    if(data.token){
    
       localStorage.setItem("token",data.token)
    }
    if(data.profile){
        const {profile}=data
        client.initIndex("profile").saveObject(
            {objectID:profile.id,username:profile.username,type:"profile"}).wait()
    }
    return data
 })
 const uploadProfilePicture = createAsyncThunk("users/uploadProfilePicture",async (params,thunkApi)=>{
    try {
    const {file }= params
    const fileName = `profile/${file.name??uuidv4()}-${uuidv4()}.jpg`
    const storageRef = ref(storage, fileName);
    const blob = new Blob([file])
    await uploadBytes(storageRef, blob)
  
    const url = await getDownloadURL(storageRef)
        return{ 
            url: url,
            fileName
        }
    }catch(err){
        return{ error: new Error("Error: UPLOAD Profile Picture" + err.message) }
    }

})
const fetchProfiles = createAsyncThunk("users/fetchProfiles",async (params,thunkApi)=>{

  let data = await profileRepo.all()
  return {
    profiles:data.profiles
  }
})
 export {
    createProfile,
    uploadProfilePicture,
    fetchProfiles
}
