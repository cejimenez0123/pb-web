import { createAsyncThunk } from "@reduxjs/toolkit"
import Library from "../domain/models/library"
import { getDoc,collection,setDoc,doc ,Timestamp,getDocs,where,query} from "firebase/firestore"

import { db } from "../core/di"

//make a bookmark library for joe

const updateLibrary = createAsyncThunk("libraries/updateLibrary", async function(params,thunkApi){
//     const ref = collection(db,"page")
//     const id = doc(ref).id
  
//     // const {profileId,data,privacy,approvalScore,type,title}=params
//     console.log(`data ${profileId}`)
//    const created = Timestamp.now()
  //  const page = 
    try{
  
    
    // const snapshot = await setDoc(doc(db,"page", id), {id,title,data,profileId,approvalScore,privacy,type,created:created})
    // console.log(`savePage ${JSON.stringify(snapshot)}`)
    // const page = new Page(id,title,data,profileId,approvalScore,privacy,type,created)
    // console.log(`savePage ${JSON.stringify(page)}`)
    const page = {}
    return { page }
    }catch(error){
    //   console.log(`savePage ${JSON.stringify(error)}`)
      return {
        error: new Error(`Error: updateLibrary ${error.message}`)
      }
    }
  
  
  })
const fetchLibrary = createAsyncThunk("libraries/fetchLibrary", async function (params, thunkApi){
    let id = params["id"]

 

  try {
  const docSnap = await getDoc(doc(db, "library", id))
  const pack = docSnap.data()
    let lId = pack["id"]
    let libName =pack["name"]
    let pageIds = pack["pageIdList"]
    let bookIds= pack["bookIdList"]
    let profileId = pack["profileId"]
    let purpose = pack["purpose"]
    let privacy = pack["privacy"]
    let writingIsOpen = pack["writingIsOpen"]
    let created = pack["created"]

  const library = new Library(lId,libName,profileId,purpose,pageIds,bookIds,writingIsOpen,privacy,created)
//   const page = new Page(id=pId,title,data,profileId,approvalScore,privacy,type,created)
  return {
    library
  }
  }catch(e){
    return {
      error: new Error(`Error: Fetch Library: ${e.message}`)
    }

  }
})

const createLibrary = createAsyncThunk("library/createLibrary", async function(params,thunkApi){
    const ref = collection(db,"library")
    const id = doc(ref).id
  
    const {
        name,
        pageIdList,
        bookIdList,
        profileId,
        purpose,
        privacy,
        writingIsOpen
        }=params
    console.log(`data ${profileId}`)
   const created = Timestamp.now()
  //  const page = 
    try{
      console.log(`createLibrary ${JSON.stringify(params)}`)
    
    const snapshot = await setDoc(doc(db,"library", id), {
        id,
        name,
        purpose,
        profileId,
        pageIdList,
        bookIdList,
        privacy,
        writingIsOpen,created:created})
  
    console.log(`createLibrary ${JSON.stringify(snapshot)}`)
    const library =new Library(id,name,profileId,purpose,pageIdList,bookIdList,writingIsOpen,privacy,created)

    return { library }
    }catch(error){
     
      return {
        error: new Error(`Error: Create Library: ${error.message}`)
      }
    }
  
  
  })
  const getProfileLibraries= createAsyncThunk(
    'libraries/getProfileLibraries',
    async (params,thunkApi) => {
      let libraryList = []
      const profileId = params["profileId"]
      const userId = params["userId"]
      const page = params["page"]
      const groupBy = params["groupBy"]??9
      const quotient = page * groupBy
  
    try {
     
       
        
       
       
    const snapshot = await getDocs(
                  query(collection(db, "library"),  where("profileId", "==", profileId)));
         let libList = []
          snapshot.docs.forEach(doc => {
          
                const pack = doc.data();
                const { id } = doc;
                const name =pack["name"]
                const pageIds = pack["pageIdList"]
                const bookIds = pack["bookIdList"]
                const profileId = pack["profileId"]
                const privacy = pack["privacy"]
                const purpose = pack["purpose"]
                const writingIsOpen = pack["writingIsOpen"]
                const created = pack["created"]
            
          
              const lib = new Library( id,name,profileId,purpose,pageIds,bookIds,writingIsOpen,privacy,created)
              libList = [...libList,lib]
            })
    return {
  
        libList
    }
  
  
    }catch(err){
     const error = err??new Error("Error: Get Profile Library")
      return {error }
    }}
  )
export {fetchLibrary,updateLibrary,createLibrary,getProfileLibraries}