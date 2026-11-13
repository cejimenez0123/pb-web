import { createAsyncThunk,createAction } from "@reduxjs/toolkit"
import collectionRepo from "../data/collectionRepo"
import profileRepo from "../data/profileRepo"


const updateLibrary = createAsyncThunk("libraries/updateLibrary", async function(params,thunkApi){
  try{
    const {
      library,
      name,
      purpose,
      privacy,
      writingIsOpen
    }=params

    let data = await collectionRepo.updateCollection({id:library.id,
        title:name,
        purpose:purpose,
        isPrivate:privacy,
        isOpenCollaboration:writingIsOpen})

    return { library:data.collection }
    }catch(error){

      return {
        error: new Error(`Error: updateLibrary ${error.message}`)
      }
    }
  
  
  })  










 const getPublicLibraries = createAsyncThunk(
  'libraries/getPublicLibraries',
  async (thunkApi) => {
     
      let data = await collectionRepo.getPublicLibraries()
   
  return {

      libraries: data.libraries
    }
  
    
  }
)

export {  
          updateLibrary,
         
  
  
          getPublicLibraries, 
    
          
          }