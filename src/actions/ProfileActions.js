
import { createAsyncThunk,createAction } from "@reduxjs/toolkit";
import profileRepo from "../data/profileRepo";
import uuidv4 from "../core/uuidv4";
import {storage} from  "../core/di"

import {  ref, uploadBytes,getDownloadURL,deleteObject   } from "firebase/storage";

const createProfile= createAsyncThunk("users/createProfile",async (params,thunkApi)=>{

    const data = await profileRepo.create(params)
    console.log(data)
    if(data.token){
        console.log(data.token)
       localStorage.setItem("token",data.token)
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
 export {
    createProfile,
    uploadProfilePicture
}
