import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth,db } from  "../core/di"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword,setPersistence, browserSessionPersistence } from "firebase/auth"
import {where,query,collection,getDocs,setDoc,getDoc,doc,orderBy,limit,Firestore , QuerySnapshot, DocumentData, DocumentSnapshot, updateDoc ,Timestamp} from "firebase/firestore"
import Profile from "../domain/models/profile";
import Library from "../domain/models/library";

// import {auth} from "../core/di"
const logIn = createAsyncThunk(
    'users/logIn',
    async (params,thunkApi) => {
        try {
         


            let email = params["email"]
            let password = params["password"]
     const userCred =  await signInWithEmailAndPassword(auth,email,password)  
    const uId=userCred.user.uid
    const snapshot = await getDocs(query(collection(db, "profile"), where("userId", "==",uId)))    
   // Check if the snapshot contains any documents
        const pack =  snapshot.docs[0].data() 
   
        const id = pack["id"]
        const username = pack["username"]
        const profilePicture = pack["profilePicture"]??""
        const selfStatement = pack["selfStatement"]
        const homeLibraryId = pack["homeLibraryId"]
        const bookmarkLibraryId = pack["bookmarkLibraryId"]
        const userId = pack["userId"]
        const privacy = pack["private"]
        const created = pack["created"]
        const profile = new Profile(id,username,profilePicture,selfStatement,bookmarkLibraryId,homeLibraryId,userId,privacy,created)
       
        if(pack!=null){    
        return {
          
                profile
                
            }}else{
                throw new Error("Profile not found for the logged-in user.");
            }
        }catch(error) {
            return {
            
                    error: error?? new Error("Error: Performing Login")
                
            }
        }}
)


const signUp = createAsyncThunk(
    'users/signUp',
    async (params,thunkApi) => {
    
        
    let email = params["email"]
    let password = params["password"]
    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password)
        const pId = doc(collection(db,"profile")).id
        const uId = userCred.user.uid
      
      
        const libId = doc(collection(db,"library")).id
    
        new Library(libId,"Saved")
        const timestamp = Timestamp.now()
         setDoc(doc(db,"library",libId),{
                id:libId,
                name:"Saved",
                profileId:pId,
                created: timestamp
        })
        
        setDoc(doc(db, "user", uId), {
            id:uId,
            defaultProfileId: pId,
            email: email,
            created: timestamp
        });
        const { username,selfStatement,privacy} = params
//  // email:suEmail,password:suPassword,username:suUsername,profilePicture:profilePicture,selfStatement:selfStatement,privacy:privacy
        // let username = params["username"] 
//         // console.log(`username: ${username}`)
        // let selfStatement = params["selfStatement"]
//     //   console.log(`selfStatement ${selfStatement}`)
    //   let privacy = params["privacy"]
//     //   console.log(`privacy ${privacy}`)
      const profile = new Profile(pId,username,"profilePicture",selfStatement,libId,libId,uId,privacy)
//       console.log(`something ${profile==null}`)

      setDoc(doc(db,"profile", pId),{
        id:pId,
        username,
      profilePicture: "profilePicture",
        selfStatement:"selfStatement",
        bookmarkLibraryId:libId,
        homeLibraryId:libId,
        userId:uId,
        privacy:false,
        created:timestamp
      })
      return {
      
            profile
            
      }
    } catch (error){

        return {
            error: new Error("Error: performing sign up")
        }
    }
    }
)

const getCurrentProfile = createAsyncThunk('users/getCurrentProfile',
async (params,thunkApi) => {
    console.log(`user2 ${JSON.stringify(params)}`)
    const uId = params["userId"]
    try {

    const snapshot = await getDocs(query(collection(db, "profile"), where("userId", "==",uId)))
   
   // Check if the snapshot contains any documents
        const pack =  snapshot.docs[0].data() 
        
        const id = pack["id"]
        const username = pack["username"]
        const profilePicture = pack["profilePicture"]??""
        const selfStatement = pack["selfStatement"]
        const homeLibraryId = pack["homeLibraryId"]
        const bookmarkLibraryId = pack["bookmarkLibraryId"]
        const userId = pack["userId"]
        const privacy = pack["private"]
        const created = pack["created"]
        const profile = new Profile(id,username,profilePicture,selfStatement,bookmarkLibraryId,homeLibraryId,userId,privacy,created)
        console.log(`user2 ${JSON.stringify(profile)}`)
        return {
            profile
        }          
        }catch(error) {
            return {
               
             error: new Error(` Getting current profile ${error.message}`)
                
            }
        }});

const updateProfile = createAsyncThunk("users/updateProfile",
                    async (params,thunkApi)=>{
                       
                        const profile = params["profile"]
                        const newUsername = params["username"]
                        const newBookmarkLibraryId = params["bookmarkLibraryId"]
                        const profileRef = doc(db, "profile", profile.id);

// Set the "capital" field of the city 'DC'
      await updateDoc(profileRef, {
            username: newUsername,
            bookmarkLibraryId: newBookmarkLibraryId
        });
       const snapshot = await getDoc(profileRef)
        const pack = snapshot.data()  
        const id = pack["id"]
        const username = pack["username"]
        const profilePicture = pack["profilePicture"]??""
        const selfStatement = pack["selfStatement"]
        const homeLibraryId = pack["homeLibraryId"]
        const bookmarkLibraryId = pack["bookmarkLibraryId"]
        const userId = pack["userId"]
        const privacy = pack["private"]
        const created = pack["created"]
        const updatedProfile = new Profile(id,username,profilePicture,selfStatement,bookmarkLibraryId,homeLibraryId,userId,privacy,created)
        
        if(updatedProfile){
            return {
                profile: updatedProfile
            }
        }else{
            throw new Error("Updating profile error")
            }
        }
        )

export {logIn,signUp,getCurrentProfile,updateProfile}