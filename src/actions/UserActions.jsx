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
          updateDoc,
          Timestamp} from "firebase/firestore"
import UserApproval from "../domain/models/user_approval";
import Profile from "../domain/models/profile";
import Library from "../domain/models/library";
import {  ref, uploadBytes,getDownloadURL  } from "firebase/storage";
import FollowBook from "../domain/models/follow_book"
import FollowLibrary from "../domain/models/follow_library"
import FollowProfile from "../domain/models/follow_profile"
import Collection from "../domain/models/collection";
import uuidv4 from "../core/uuidv4";
const logIn = createAsyncThunk(
    'users/logIn',
    async (params,thunkApi) => {
        let email = params["email"]
        let password = params["password"]
        try {
           
        const userCred = await signInWithEmailAndPassword(auth,email,password)

            
            const uId=userCred.user.uid
            const snapshot = await getDocs(
                query(collection(db, "profile"),
                where("userId", "==",uId)))    
                const pack =  snapshot.docs[0].data() 

            if(pack!=null){  
                const id = pack["id"]
                const username = pack["username"]
                const profilePicture = pack["profilePicture"]??""
                const selfStatement = pack["selfStatement"]
                const homeLibraryId = pack["homeLibraryId"]
                const bookmarkLibraryId = pack["bookmarkLibraryId"]
                const userId = pack["userId"]
                const privacy = pack["privacy"]
                const created = pack["created"]
                const profile = new Profile(id,
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
            }else{
                throw new Error("Profile not found for the logged-in user.");
            }
        }catch(error) {
            return {
            
                    error: error?? new Error("Error: Performing Login")
                
            }
        }}
)
const signOutAction = createAsyncThunk('users/signOut',async (params,thunkApi)=>{

   await signOut(auth)
   return {
        profile:null
   }
})

const signUp = createAsyncThunk(
    'users/signUp',
    async (params,thunkApi) => {
    
        
    let email = params["email"]
    let password = params["password"]
    try {
        const userCred = await  createUserWithEmailAndPassword(auth, email, password)
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

      await setDoc(doc(db,"profile",pId,"collection","home"),
            { books:[],
              libraries:[],
              pages:[],
              profiles:[]})
      client.initIndex("profile").saveObject({ objectID:pId,
                                              username:username,
                                              type:"profile"}).wait()
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
const searchMultipleIndexes = createAsyncThunk("users/seachMultipleIndexes",
  async (params,thunkApi)=>{
    	  const {query} = params
        const queries = [{
          indexName: 'profile',
          query: query,
        }, {
          indexName: 'page',
  query: query,

}, {
  indexName: 'book',
  query: query,
  
}, {
  indexName: 'library',
  query: query,
  
}];
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
  try{
  const {profile,books,libraries,pages,profiles} = params
 
  await updateDoc(doc(db,"profile",profile.id,"collection","home"),
  { books:books,
    libraries:libraries,
    pages:pages,
    profiles:profiles})
    let collection =new Collection(pages,books,libraries,profiles)
    return {
      collection:collection
    }
  }catch(e){
    return {
      error: new Error(`Update Home Collection Error: ${e.message}`)
    }
  }
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
    
    
    try {
if(auth.currentUser){
    const snapshot = await getDocs(query(collection(db, "profile"), where("userId", "==",auth.currentUser.uid)))
   
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
        
        return {
            profile
        } 
      }else{
          throw new Error("No Authenticated User")
        }         
        }catch(error) {
            return {
               
             error: new Error(` Getting current profile ${error.message}`)
                
            }
        }});

const updateProfile = createAsyncThunk("users/updateProfile",
                    async (params,thunkApi)=>{
        try{               
                        const profile = params["profile"]
                        const newUsername = params["username"]
                        const profilePicture = params["profilePicture"]
                      const profileRef = doc(db, "profile", profile.id);
                        const newSelfStatement = params["selfStatement"]
                        const newPrivacy = params["privacy"]

      await updateDoc(profileRef, {
            username: newUsername,
            profilePicture,
            selfStatement: newSelfStatement,
            privacy: newPrivacy,
        });
        client.initIndex("profile")
        .partialUpdateObject({objectID: profile.id,username:newUsername},
          {createIfNotExists:true})
        const snapshot = await getDoc(profileRef)
      
        const updatedProfile = unpackProfileDoc(snapshot)

            return {
                profile: updatedProfile
            }
          }catch(e){
            return {error: new Error(`Update Profile failed: ${e.message}`)}
          }
})
const fetchAllProfiles = createAsyncThunk("users/fetchAllProfiles",async (state,{params})=>{
    try {
    let  profileRef = collection(db,"profile")
    let snapshot = await getDocs(profileRef)
    let profileList = []
    snapshot.docs.forEach(doc => {
      const prof = unpackProfileDoc(doc)
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
    const fileName = `profile/${file.name}-${uuidv4()}.jpg`
    const storageRef = ref(storage, fileName);
    const blob = new Blob([file])
    await uploadBytes(storageRef, blob)
  
    const url = await getDownloadURL(storageRef)
        return{ 
            url: url
        }
    }catch(err){
        return{ error: new Error("Error: UPLOAD Profile Picture" + err.message) }
    }

})
const uploadPicture = createAsyncThunk("users/uploadPicture",async (params,thunkApi)=>{
  try {
  const {file,
        }= params
  const fileName = `image/picture-${file.name}.jpg`
  const storageRef = ref(storage, fileName);
  const blob = new Blob([file])
  await uploadBytes(storageRef, blob)

  const url = await getDownloadURL(storageRef)
      return{ 
          ref:fileName,
          url: url
      }
  }catch(err){
      return{ error: new Error("Error: UPLOAD Picture" + err.message) }
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
const deleteFollowBook= createAsyncThunk("users/deleteFollowBook", async (params,thunkApi)=>{
            try{
              const {followBook,book,profile}=params
              if(followBook){
                await deleteDoc(doc(db,"follow_book",followBook.id));
              }else{
                await deleteDoc(doc(db,"follow_book",`${profile.id}_${book.id}`));
            
              }
              return {
                followBook
              }
            }catch(e){
              return {error: new Error("Error: Delete Follow Book"+e.message)};
            }
          })
const deleteFollowLibrary= createAsyncThunk("users/deleteFollowLibrary", async (params,thunkApi)=>{
            try{
              const {followLibrary,library,profile}=params
              if(followLibrary){
                await deleteDoc(doc(db, "follow_library",followLibrary.id));
              }else{
                await deleteDoc(doc(db, "follow_library",`${profile.id}_${library.id}`));
            
              }
              return {
                followLibrary: followLibrary
              }
            }catch(e){
              return {error: new Error("Error: Delete Follow Library"+e.message)};
            }
          })
const deleteFollowProfile= createAsyncThunk("users/deleteFollowProfile", async (params,thunkApi)=>{
            try{
              const {followProfile,follower,following}=params
              if(followProfile){
                await deleteDoc(doc(db,"follow_profile",followProfile.id));
              }else{
                await deleteDoc(doc(db,"follow_profile",`${follower.id}_${following.id}`));
            
              }
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
                const id = `${follower.id}_${following.id}`
                const created = Timestamp.now()
                    await setDoc(doc(db,"follow_profile",id), { 
                        id:id,
                        followerId: follower.id,
                        followingId: following.id,
                        created: created
                    })
                    const lb = new FollowProfile(id,follower.id,following.id,created);
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
const fetchArrayOfProfiles = createAsyncThunk("pages/fetchArrayOfProfiles",async (params,thunkApi)=>{
  try{ 
    const profileIdList = params["profileIdList"]
    const profilePromises = profileIdList.map((profileId) => {
      const profileRef = doc(db, "profile", profileId);
      return getDoc(profileRef);
    });
    let snapshots = await Promise.all(profilePromises)
    let profileList = snapshots.map(snapshot => unpackProfileDoc(snapshot))
  
    return {profileList:profileList}
  }catch(err){
    const error = err??new Error("Error: Fetch Array of Profiles")
    return {error }
    }
  }
)
const  searchDialogToggle = createAction("users/searchDialogToggle",(params,thunkApi)=>{
  const {open} = params
  return {payload: open}
})
const unpackProfileDoc = (doc)=>{
  const pack =  doc.data() 

  if(pack!=null){  
      const id = pack["id"]
      const username = pack["username"]??""
      const profilePicture = pack["profilePicture"]??""
      const selfStatement = pack["selfStatement"]
      const homeLibraryId = pack["homeLibraryId"]
      const bookmarkLibraryId = pack["bookmarkLibraryId"]
      const userId = pack["userId"]
      const privacy = pack["privacy"]
      const created = pack["created"]
      const profile = new Profile(id,
                                  username,
                                  profilePicture,
                                  selfStatement,
                                  bookmarkLibraryId,
                                  homeLibraryId,
                                  userId,
                                  privacy,
                                  created)
    return profile
}}

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
        fetchAllProfiles,
        uploadProfilePicture,
        fetchProfile,
        setProfileInView,
        createFollowBook,
        createFollowLibrary,
        fetchFollowBooksForProfile,
        fetchFollowLibraryForProfile,
        deleteFollowBook,
        deleteFollowLibrary,
        deleteFollowProfile,
        createFollowProfile,
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
        fetchArrayOfProfiles
    }