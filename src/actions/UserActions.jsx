import { createAsyncThunk,createAction } from "@reduxjs/toolkit";
import { auth,db, client ,storage} from  "../core/di"
import {  signInWithEmailAndPassword,
          signOut,
          createUserWithEmailAndPassword,
       } from "firebase/auth"
import {  where,
          query,
          deleteDoc,
          collection,
          getDocs,
          setDoc,
          getDoc,
          doc,
          Timestamp} from "firebase/firestore"
import UserApproval from "../domain/models/user_approval";
import {  ref, uploadBytes,getDownloadURL  } from "firebase/storage";
import FollowBook from "../domain/models/follow_book"
import FollowLibrary from "../domain/models/follow_library"
import FollowProfile from "../domain/models/follow_profile"
import Collection from "../domain/models/collection";
import authRepo from "../data/authRepo";
import profileRepo from "../data/profileRepo";
import collectionRepo from "../data/collectionRepo";
import uuidv4 from "../core/uuidv4";
const logIn = createAsyncThunk(
    'users/logIn',
    async (params,thunkApi) => {
   
     

        const {email,password}=params


        const authData = await authRepo.startSession({uId:null,email:email,password})
   
        
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
      const{email,token,frequency,password,username,profilePicture,selfStatement,privacy}=params

      try {
        
          const userCred = await  createUserWithEmailAndPassword(auth, email, password)
          let data = await profileRepo.register({uId:userCred.user.uid,frequency,token,email,password,username,profilePicture,selfStatement,privacy})
           
        
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
          let data = await profileRepo.register({token,frequency,password,username,profilePicture,selfStatement,privacy})
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

const createCollection = createAsyncThunk("ds",async (params,thunkApi)=>{
  const {profile} = params
 
  await setDoc(doc(db,"profile",profile.Id,"collection","home"),
  { books:[],
    libraries:[],
    pages:[],
    profiles:[]})
})
const updateHomeCollection = createAsyncThunk("users/updatecollection",async (params,thunkApi)=>{
  // try{
  // const {profile,books,libraries,pages,profiles} = params
 
  // await updateDoc(doc(db,"profile",profile.id,"collection","home"),
  // { books:books,
  //   libraries:libraries,
  //   pages:pages,
  //   profiles:profiles})
  //   let collection =new Collection(pages,books,libraries,profiles)
  //   return {
  //     collection:collection
  //   }
  // }catch(e){
  //   return {
  //     error: new Error(`Update Home Collection Error: ${e.message}`)
  //   }
  // }
  }


)
const fetchHomeCollection = createAsyncThunk("users/fetchHomeCollection", async(params,thunkApi)=>{
  try{


  const {profile}= params
  const snapshot = await getDoc(doc(db,"profile",profile.id,"collection","home"))
  const pack = snapshot.data()
  const {pages,books,libraries,profiles} = pack
  const collection = new Collection(pages,books,libraries,profiles)
  return {
    collection:collection
  }
}catch(e) {

return {error: new Error(`Fetch home Error: ${e.message}`)}
}
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
  const {file}= params
  if(file){


  const fileName = `image/${uuidv4()}/picture-${file.name}+${uuidv4()}.jpg`

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
  const createFollowBook = createAsyncThunk("users/createFollowBook", async function(params,thunkApi){

        try{
        const {
            profile,
            book
            }=params
            
        const id =  `${profile.id}_${book.id}`
        const created = Timestamp.now()
        await setDoc(doc(db,"follow_book",id), { 
            id:id,
            bookId: book.id,
            profileId: profile.id,
            created: created
        })
        const fb = new FollowBook(id,book.id,profile.id,created);
        return {
                followBook:fb 
            }
      }catch(error){
        return {
            error: new Error(`Error:Create Follow Book ${error.message}`)
        }
      }
    
    
    })
const createFollowLibrary = createAsyncThunk("users/createFollowLibrary", async function(params,thunkApi){
    try{
        const {
            profile,
            library
        }=params
        const id = `${profile.id}_${library.id}`
        const created = Timestamp.now()
            await setDoc(doc(db,"follow_library",id), { 
                id:id,
                libraryId: library.id,
                profileId: profile.id,
                created: created
            })
            const lb = new FollowLibrary(id,profile.id,library.id,created);
        return { 
            followLibrary:lb
        }
    }catch(error){
           
        return {
            error: new Error(`Error: Create Follow Library ${error.message}`)
        }
    }
})
const fetchFollowBooksForProfile= createAsyncThunk("users/fetchFollowBooksForProfile",async (params,thunkApi)=>{
            try{
              const {profile} = params
            const ref = collection(db,"follow_book")
          
            const snapshot =await getDocs(ref,where("profileId","==",profile.id))
          
            let followList = []
            snapshot.docs.forEach(doc => {
                  const pack = doc.data();
                  const { id,
                          profileId,
                          bookId,
                          created
                        }=pack
                const fb = new FollowBook(id,bookId,profileId,profile,created)
                
                followList = [...followList, fb]
              })
          return {
          
            followList: followList,
          }}catch(err) {
                return {
                    error: new Error(`Error: Fetch Follow Books: ${err.message}`)
  }
}})
const fetchFollowLibraryForProfile= createAsyncThunk("users/fetchFollowlibraryForProfile",async (params,thunkApi)=>{
            try{
              const {profile} = params
            const ref = collection(db,"follow_library")
          
            const snapshot =await getDocs(ref,where("profileId","==",profile.id))
          
            let followList = []
            snapshot.docs.forEach(doc => {
                  const pack = doc.data();
                  const { id,
                profileId,
                libraryId,
                created
               }=pack
               const fl = new FollowLibrary(id,profileId,libraryId,created)
                
                followList = [...followList, fl]
              })
          return {
          
            followList: followList,
          }}catch(err) {
                return {
                    error: new Error(`Error: Fetch Follow books: ${err.message}`)
                }
          }})
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


const fetchFollowProfilesForProfile= createAsyncThunk("users/fetchFollowProfilesForProfile",async (params,thunkApi)=>{
                    try{
                        const {profile} = params
                        const ref = collection(db,"follow_profile")
                        const snapshot =await getDocs(ref,where("followerId","==",profile.id))
                        let followList = []
                    snapshot.docs.forEach(doc => {
                            const pack = doc.data();
                            const { id,
                                    followerId,
                                    followingId ,
                                    created
                                }=pack
                    const fb = new FollowProfile(id,followerId,followingId,created) 
                    followList = [...followList, fb]
                    })
            return {
                followList: followList,
            }
        }catch(err) {
            return {
                error: new Error(`Error: Fetch Follow Profile: ${err.message}`)
            }
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



const getPageApprovals = createAsyncThunk("users/getPageApprovals",async (params,thunkApi)=>{
  try{
  const {profile}=params
  const snapshot = await getDocs(query(collection(db, UserApproval.className), where("profileId", "==", profile.id)))
  let userApprovals = []
  snapshot.docs.forEach(doc => {
    let userApproval = unpackUserApprovalDoc(doc)
    userApproval.push(userApproval)
  })
  return {
    userApprovals
  }
}catch(e){
  return {
    error: e
  }
}
})

const  searchDialogToggle = createAction("users/searchDialogToggle",(params,thunkApi)=>{
  const {open} = params
  return {payload: open}
})


const unpackUserApprovalDoc = (doc)=>{
  const pack = doc.data();
            const { id } = doc;
            const {score,pageId,profileId}=pack
        let userApproval = new UserApproval(id,pageId,profileId,score)
      return userApproval
}

export {logIn,
        signUp,
        getCurrentProfile,
        updateProfile,
    
        fetchProfile,
        setProfileInView,
        createFollowBook,
        createFollowLibrary,
        fetchFollowBooksForProfile,
        fetchFollowLibraryForProfile,
     
       
  
        fetchFollowProfilesForProfile,
        signOutAction,
        useReferral,
        uploadPicture,
        deleteUserAccounts,
        fetchHomeCollection,
        updateHomeCollection,
        setSignedInTrue,
        setSignedInFalse,
        getPageApprovals,
        searchDialogToggle,
        searchMultipleIndexes,
        deletePicture,
        updateSubscription
    }