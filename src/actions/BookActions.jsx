import { createAsyncThunk ,createAction} from "@reduxjs/toolkit"
import collectionRepo from "../data/collectionRepo"


  const getProfileBooks= createAsyncThunk(
    'books/getProfileBooks',
    async (params,thunkApi) => {
      try {
        const profile = params["profile"]
        const data = await collectionRepo.getProfileBooks({profile})

            return {
                bookList:data.collections
            }
          }catch(err){
    
      return {
            error: new Error(`Error: GET PROFILE BOOKS: ${err.message}`)
            }
        }
    }
  )


  export { 
            getProfileBooks,
        }