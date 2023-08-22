import { createAsyncThunk } from "@reduxjs/toolkit"
import Library from "../domain/models/library"


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
  let pageIds = pack["pageIds"]
  let bookIds= pack["bookIds"]
  let profileId = pack["profileId"]
  let approvalScore = pack["purpose"]
  let privacy = pack["privacy"]
  let writingIsOpen = pack["writingIsOpen"]
  let create = pack["created"]

  
  const page = new Page(id=pId,title,data,profileId,approvalScore,privacy,type,created)
  return {
    page
  }
  }catch(e){
    return {
      error: e
    }

  }
})

const createLibrary = createAsyncThunk("library/createLibrary", async function(params,thunkApi){
    const ref = collection(db,"library")
    const id = doc(ref).id
  
    const {
        name,
        pageIds,
        bookIds,
        profileId,
        purpose,
        privacy,
        writingIsOpen
        }=params
    console.log(`data ${profileId}`)
   const created = Timestamp.now()
  //  const page = 
    try{
  
    
    const snapshot = await setDoc(doc(db,"page", id), {
        id,
        name,
        purpose,
        profileId,
        pageIds,
        bookIds,
        privacy,
        writingIsOpen,created:created})
  
    console.log(`createLibrary ${JSON.stringify(snapshot)}`)
    const page = new Page(id,title,data,profileId,approvalScore,privacy,type,created)
    console.log(`savePage ${JSON.stringify(page)}`)
    return { page }
    }catch(error){
      console.log(`createLibrary ${JSON.stringify(error)}`)
      return {
        error: new Error(`Error: Create Library: ${error.message}`)
      }
    }
  
  
  })

  const createLibrary = createAsyncThunk("books/createBook", async function(params,thunkApi){
 
    //  const page = 
      try{
          const ref = collection(db,"book")
          const id = doc(ref).id
        
          const {
              title,
              purpose,
              profileId,
              pageIdList,
              privacy,
              writingIsOpen,
             }=params
              const created = Timestamp.now()
              const updatedAt = created
      const snapshot = await setDoc(doc(db,"book", id), 
                          { 
                              id:id,
                              title:title,
                              purpose:purpose,
                              profileId:profileId,
                              pageIdList:pageIdList,
                              privacy:privacy,
                              writingIsOpen:writingIsOpen,
                              updatedAt: created,
                              created: created
                          })
  
     const book = new Book(
      id,
      purpose,
      title,
      profileId,
      pageIdList,
      privacy,
      writingIsOpen,
      updatedAt,
      created,
  )
                          console.log(`boks ${JSON.stringify(book)}`)
    
      return { book }
      }catch(error){
    
        return {
          error: new Error(`Error: CreateBook ${error.message}`)
        }
      }})
  
export {fetchLibrary,updateLibrary}