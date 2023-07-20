import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth,db } from  "../core/di"
import { signInWithEmailAndPassword } from "firebase/auth"
import {where,query,collection,getDocs,getDoc,doc,Firestore , QuerySnapshot, DocumentData, DocumentSnapshot} from "firebase/firestore"
import Profile from "../domain/models/profile";
const logIn = createAsyncThunk(
    'users/logIn',
    async (email,password,thunkApi) => {
     const userCred =  await signInWithEmailAndPassword(auth,email,password)  
   const user = userCred.user
   const snapshot = await getDocs(query(collection(db, "profile"), where("userId", "==", user.uid)))
        const id = snapshot.docs[0].id
        const pack =  snapshot.docs[0].data() 
        const username = pack["useername"]
        const profilePicture = pack["profilePicture"]
        const selfStatement = pack["selfStatement"]
        const homeLibraryId = pack["homeLibraryId"]
        const userId = pack["userId"]
        const privacy = pack["private"]
        const created = pack["created"]
        const profile = new Profile(id,username,profilePicture,selfStatement,homeLibraryId,userId,privacy,created)
        return {
            payload: {
                profile
                }
            }
        }
)
export {logIn}