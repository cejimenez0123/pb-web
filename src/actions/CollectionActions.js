import { createAsyncThunk ,createAction} from "@reduxjs/toolkit"
import Book from "../domain/models/book"
import { unpackPageDoc } from "./PageActions"
import {unpackLibraryDoc} from "./LibraryActions"
import { unpackProfileDoc } from "./UserActions"
import {  where,
          query,
          and,
          or,
          arrayUnion,
          collection,
          getDocs,
          getDoc,
          doc,
          setDoc,
          deleteDoc, 
          Timestamp,
          updateDoc} from "firebase/firestore"
import { db,auth,client} from "../core/di"
import Contributors from "../domain/models/contributor"
import axios from "axios"
import collectionRepo from "../data/collectionRepo"
import Enviroment from "../core/Enviroment"

const getPublicBooks = createAsyncThunk(
    'books/getPublicBooks',
    async (thunkApi) => {
       
   
        try{
                let res = await axios(Enviroment.url+"/collection/public/book")
    
    return {
  
        bookList: res.data.books
    }
}catch (error) {
    return{
        error: new Error(`getPublicColBooks ${error.message}`)
    }
}
      
    }
)

const saveRoleToCollection= createAsyncThunk("collection/saveRoleToCollection",
    async (params,thunkApi)=>{
        const id = params["id"]
        const profileId = params["profileId"]
        const role = params["role"]
        const res = await axios.post(Enviroment.url+"/collection/"+id+"/role",{
            profileId:profileId,
            role:role
        })
        return {role:res.data}
    }
)
const isProfileMember = createAsyncThunk("collection/isProfileMember",async (
    params,thunkApi
)=>{

      let res =  await axios(Enviroment.url+"/collection/"+params["id"]+"/profile/"+params["profileId"],
        { headers:{
            'Access-Control-Allow-Origin': "*"
        }}
      )

      return {
        data: res.data
      }
})


export {
    getPublicBooks,
    saveRoleToCollection,
    isProfileMember
}