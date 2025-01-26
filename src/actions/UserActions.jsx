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
const logIn = createAsyncThunk(
    'users/logIn',
    async (params,thunkApi) => {
      const {email,password}=params
     
      try{
      const userCred = await signInWithEmailAndPassword(auth,email,password)
      if(userCred.user){
        
      const authData = await authRepo.startSession({uId:userCred.user.uid,email:email,password})
        const {token}=authData
        console.log("1",token)
        localStorage.setItem("token",token)
        const profileRes = await profileRepo.getMyProfiles({token:token})
        const profile = profileRes.profiles[0]
     
   
        return{
          profile:profile
        }}else{
          throw new Error("Check")
        }
    }catch(error){
  try{

        const authData = await authRepo.startSession({uId:null,email:email,password})

        const {token}=authData
        localStorage.setItem("token",token)
        const profileRes = await profileRepo.getMyProfiles({token:authData.token})
        const profile = profileRes.profiles[0]
        
        return{
          profile: profile
       } }catch(error){
return{error}
        }
    }}
)
const referSomeone =createAsyncThunk('users/referral',async (params,thunkApi)=>{
  let data = await authRepo.referral(params)
  return data
 })
const signOutAction = createAsyncThunk('users/signOut',async (params,thunkApi)=>{
    localStorage.clear()
   await signOut(auth)
   return {
        profile:null
   }
})

const signUp = createAsyncThunk(
    'users/signUp',
    async (params,thunkApi) => {
      const{email,token,password,username,profilePicture,selfStatement,privacy}=params

      try {
        
          const userCred = await  createUserWithEmailAndPassword(auth, email, password)
          let data = await profileRepo.register({uId:userCred.user.uid,token,email,password,username,profilePicture,selfStatement,privacy})
           
        
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
          let data = await profileRepo.register({token,password,username,profilePicture,selfStatement,privacy})
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
const getCurrentProfile = createAsyncThunk('users/getCurrentProfile',
async (params,thunkApi) => {
  try{

  let token = localStorage.getItem("token")
  if(token){
    let data = await profileRepo.getMyProfiles({token:token})
  
    return {
    profile: data.profiles[0]
   } 
  }else{
    throw new Error("No Token")
  }
    
    }catch(error){
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


  const fileName = `image/picture-${file.name}.jpg`
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
      let data = await profileRepo.getProfile(params)


      return{
        profile:data.profile
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
const deleteFollowBook= createAsyncThunk("users/deleteFollowBook", async (params,thunkApi)=>{
            // try{
            //   const {followBook,book,profile}=params
            //   if(followBook){
            //     await deleteDoc(doc(db,"follow_book",followBook.id));
            //   }else{
            //     await deleteDoc(doc(db,"follow_book",`${profile.id}_${book.id}`));
            
            //   }
            //   return {
            //     followBook
            //   }
            // }catch(e){
            //   return {error: new Error("Error: Delete Follow Book"+e.message)};
            // }
          })
const deleteFollowLibrary= createAsyncThunk("users/deleteFollowLibrary", async (params,thunkApi)=>{
            // try{
            //   const {followLibrary,library,profile}=params
            //   if(followLibrary){
            //     await deleteDoc(doc(db, "follow_library",followLibrary.id));
            //   }else{
            //     await deleteDoc(doc(db, "follow_library",`${profile.id}_${library.id}`));
            
            //   }
            //   return {
            //     followLibrary: followLibrary
            //   }
            // }catch(e){
            //   return {error: new Error("Error: Delete Follow Library"+e.message)};
            // }
          })
const deleteFollowProfile= createAsyncThunk("users/deleteFollowProfile", async (params,thunkApi)=>{
            try{
              // const {followProfile,follower,following}=params
              // if(followProfile){
              //   await deleteDoc(doc(db,"follow_profile",followProfile.id));
              // }else{
              //   await deleteDoc(doc(db,"follow_profile",`${follower.id}_${following.id}`));
            
              // }
              return {
                followProfile
              }
            }catch(e){
              return {error: new Error("Error: Delete Follow Profile"+e.message)};
            }
})
const createFollowProfile = createAsyncThunk("users/createFollowProfile", async function(params,thunkApi){
            try{
                const {
                    follower,
                    following
                }=params
                // const id = `${follower.id}_${following.id}`
                // const created = Timestamp.now()
                //     await setDoc(doc(db,"follow_profile",id), { 
                //         id:id,
                //         followerId: follower.id,
                //         followingId: following.id,
                //         created: created
                //     })
                //     const lb = new FollowProfile(id,follower.id,following.id,created);
                return { 
                    followProfile:lb
                }
            }catch(error){
                return {
                    error: new Error(`Error: Follow Profile ${error.message}`)
                }
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
    const uId =auth.currentUser.uid
   let snapshot = await getDocs(
      query(collection(db, "profile"),
      where("userId", "==",uId)))    
      const pack =  snapshot.docs[0].data() 
      let id = pack["id"]
      deleteDoc(doc(db,"profile",id))
      client.initIndex("profile").deleteObject(id).wait()
      auth.currentUser.delete()
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
// const fetchArrayOfProfiles = createAsyncThunk("pages/fetchArrayOfProfiles",async (params,thunkApi)=>{
//   try{ 
//     const profileIdList = params["profileIdList"]
//     const profilePromises = profileIdList.map((profileId) => {
//       const profileRef = doc(db, "profile", profileId);
//       return getDoc(profileRef);
//     });
//     let snapshots = await Promise.all(profilePromises)
//     let profileList = snapshots.map(snapshot => unpackProfileDoc(snapshot))
  
//     return {profileList:profileList}
//   }catch(err){
//     const error = err??new Error("Error: Fetch Array of Profiles")
//     return {error }
//     }
//   }
// )
const  searchDialogToggle = createAction("users/searchDialogToggle",(params,thunkApi)=>{
  const {open} = params
  return {payload: open}
})
// const unpackProfileDoc = (doc)=>{
//   const pack =  doc.data() 

//   if(pack!=null){  
//       const id = pack["id"]
//       const username = pack["username"]??""
//       const profilePicture = pack["profilePicture"]??""
//       const selfStatement = pack["selfStatement"]
//       const homeLibraryId = pack["homeLibraryId"]
//       const bookmarkLibraryId = pack["bookmarkLibraryId"]
//       const userId = pack["userId"]
//       const privacy = pack["privacy"]
//       const created = pack["created"]
//       const profile = new Profile(id,
//                                   username,
//                                   profilePicture,
//                                   selfStatement,
//                                   bookmarkLibraryId,
//                                   homeLibraryId,
//                                   userId,
//                                   privacy,
//                                   created)
//     return profile
// }}

const unpackUserApprovalDoc = (doc)=>{
  const pack = doc.data();
            const { id } = doc;
            const {score,pageId,profileId}=pack
        let userApproval = new UserApproval(id,pageId,profileId,score)
      return userApproval
}
let clickMe = createAsyncThunk("Sf",async (params,thunkApi)=>{

})

export {logIn,
        signUp,
        getCurrentProfile,
        updateProfile,
        // fetchAllProfiles,
        // uploadProfilePicture,
        fetchProfile,
        setProfileInView,
        createFollowBook,
        createFollowLibrary,
        fetchFollowBooksForProfile,
        fetchFollowLibraryForProfile,
     
        deleteFollowProfile,
  
        fetchFollowProfilesForProfile,
        signOutAction,
        clickMe,
        uploadPicture,
        deleteUserAccounts,
        fetchHomeCollection,
        updateHomeCollection,
        setSignedInTrue,
        setSignedInFalse,
        getPageApprovals,
        searchDialogToggle,
        searchMultipleIndexes,
        deletePicture
        // fetchArrayOfProfiles
    }