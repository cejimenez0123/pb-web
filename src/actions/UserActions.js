import { createAsyncThunk,createAction } from "@reduxjs/toolkit";
import { auth,db } from  "../core/di"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword,setPersistence, browserSessionPersistence } from "firebase/auth"
import {where,query,collection,getDocs,setDoc,getDoc,doc,orderBy,limit,Firestore , QuerySnapshot, DocumentData, DocumentSnapshot, updateDoc ,Timestamp} from "firebase/firestore"
import Profile from "../domain/models/profile";
import Library from "../domain/models/library";
import {  ref, uploadBytes,uploadBytesResumable,getDownloadURL  } from "firebase/storage";
import { storage } from "../core/di";
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
        await setDoc(doc(db,"library",libId),{
                id:libId,
                name:"Saved",
                profileId:pId,
                purpose:"Anything you find interesting can be saved here, for future use",
                pageIdList:[],
                bookIdList:[],
                writingIsOpen:false,
                privacy:true,
                editors:[],
                writers:[],
                commmenters:[],
                readers:[],
                created: timestamp
        })
        
       await setDoc(doc(db, "user", uId), {
            id:uId,
            defaultProfileId: pId,
            email: email,
            created: timestamp
        });
        const { username,profilePicture,selfStatement,privacy} = params

      const profile = new Profile(pId,username,profilePicture,selfStatement,libId,libId,uId,privacy)
      await setDoc(doc(db,"profile", pId),{
        id:pId,
        username,
      profilePicture: profilePicture,
        selfStatement:selfStatement,
        bookmarkLibraryId:libId,
        homeLibraryId:libId,
        userId:uId,
        privacy:privacy,
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
        const privacy = pack["privacy"]
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
const fetchAllProfiles = createAsyncThunk("users/fetchAllProfiles",async (state,{params})=>{
    try {
    let  profileRef = collection(db,"profile")
    let snapshot = await getDocs(profileRef)
    let profileList = []
    snapshot.docs.forEach(doc => {
        const { id } = doc
        const pack = doc.data()
        const username = pack["username"]
        const profilePicture = pack["profilePicture"]
        const selfStatement = pack["selfStatment"]
        const bookmarkLibraryId = pack["bookmarkLibraryId"]
        const homeLibraryId = pack["homeLibraryId"]
        const userId = pack["userId"]
        const privacy= pack["privacy"]
        const created = pack["created"]
       let prof = new Profile(id,
                    username,
                    profilePicture, 
                    selfStatement, 
                    bookmarkLibraryId,
                    homeLibraryId,
                    userId,
                    privacy,
                    created)
        profileList.push(prof)
     })

    
    return {profileList}
    
    }catch(err) {
        return {
            error: new Error("Error: FETCH ALL PROFILES" + err.message)
        }
    }
})
const uploadProfilePicture = createAsyncThunk("users/uploadProfilePicture",async (params,thunkApi)=>{
    try {
    const {file }= params
    const fileName = `profile/profilePicture-${file.name}.jpg`
    const storageRef = ref(storage, fileName);
    const blob = new Blob([file])
    const upload = await uploadBytes(storageRef, blob)
    console.log(`Uploading profile picture ${JSON.stringify(upload)}`)
    const url = await getDownloadURL(storageRef)
        return{ 
            url: url
        }
    }catch(err){
        return{ error: new Error("Error: UPLOAD Profile Picture" + err.message) }
    }

})
const fetchProfile = createAsyncThunk("users/fetchProfile", async function(params,thunkApi){
    let pId= params["id"]
  
   
 
    try {
    const docSnap = await getDoc(doc(db, "profile", pId))
    const pack = docSnap.data()
    let {id,username,profilePicture,selfStatement,bookmarkLibraryId,homeLibraryId,userId,privacy,created}=pack
        if(privacy){
            privacy=false
        }
   const profile = new Profile( id,
                                username,
                                profilePicture,
                                selfStatement,
                                bookmarkLibraryId,
                                homeLibraryId,
                                userId,
                                privacy,
                                created)
    return {
      profile
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
export {logIn,
        signUp,
        getCurrentProfile,
        updateProfile,
        fetchAllProfiles,
        uploadProfilePicture,
        fetchProfile,
        setProfileInView}