import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth,db } from  "../core/di"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import {where,query,collection,getDocs,setDoc,getDoc,doc,orderBy,limit,Firestore , QuerySnapshot, DocumentData, DocumentSnapshot, Timestamp} from "firebase/firestore"
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
    const uId= userCred.user.uid
 //  const snapshot = await getDocs(query(collection(db, "profile"), where("userId", "==", user.uid),orderBy("created", "desc"), limit(1)))
   //const snapshot = await getDocs( query(collection(db, "profile"), where("userId", "==", uId), orderBy("created", "desc"), limit(1)))
   //const snapshot = await getDocs(query(collection(db, "profile"), where("userId", "==", uId), orderBy("created", "desc"), limit(1)));
    const snapshot = await getDocs(query(collection(db, "profile"), where("userId", "==",uId)))    
   // Check if the snapshot contains any documents
   
       
        const pack =  snapshot.docs[0].data() 
        console.log(pack)
        const id = pack["id"]
        const username = pack["username"]
        const profilePicture = pack["profilePicture"]??""
        const selfStatement = pack["selfStatement"]
        const homeLibraryId = pack["homeLibraryId"]
        const userId = pack["userId"]
        const privacy = pack["private"]
        const created = pack["created"]
        const profile = new Profile(id,username,"profilePicture",selfStatement,homeLibraryId,userId,privacy,created)
        console.log(profile)
        if(pack!=null){    
        return {
          
                profile
                
            }}else{
                throw new Error("Profile not found for the logged-in user.");
            }
        }catch(error) {
            return {
                payload: {
                    error
                }
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
        console.log(`pId ${pId} uId ${uId} libId ${libId}`)
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
      const profile = new Profile(pId,username,"profilePicture",selfStatement,libId,uId,privacy)
//       console.log(`something ${profile==null}`)

    //   setDoc(doc(db,"profile", pId),{
    //     id:pId,
    //     username,
    //   profilePicture: "profilePicture",
    //     selfStatement:"selfStatement",
    //     homeLibraryId:libId,
    //     userId:uId,
    //     privacy:false,
    //     created:timestamp
    //   })
      return {
      
            profile
            
      }
    } catch (error){

        return {
            error: error
        }
    }
    }
)

const getCurrentProfile = createAsyncThunk('users/getCurrentProfile',
async (params,thunkApi) => {

    const uId = auth.currentUser.uid
    try {
    const snapshot = await getDocs(query(collection(db, "profile"), where("userId", "==",uId)))    
   // Check if the snapshot contains any documents
   
       
        const pack =  snapshot.docs[0].data() 
        
        const id = pack["id"]
        const username = pack["username"]
        const profilePicture = pack["profilePicture"]??""
        const selfStatement = pack["selfStatement"]
        const homeLibraryId = pack["homeLibraryId"]
        const userId = pack["userId"]
        const privacy = pack["private"]
        const created = pack["created"]
        const profile = new Profile(id,username,"profilePicture",selfStatement,homeLibraryId,userId,privacy,created)
        console.log("Touch")
        if(pack!=null){    
        return {
        
                profile
                
            }}else{
                throw new Error("Profile not found for the logged-in user.");
            }
        }catch(error) {
            return {
                payload: {
                    error
                }
            }
        }}
)
export {logIn,signUp,getCurrentProfile}