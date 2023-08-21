import { createAsyncThunk } from "@reduxjs/toolkit"





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
  let data = pack["pageIds"]
  let profileId = pack["bookIds"]
  let privacy = pack["profileId"]
  let approvalScore = pack["purpose"]
  let type = pack["privacy"]
  let created = pack["writingIsOpen"]
  
  pageIds
  bookIds
  profileId
  purpose
  privacy
  writingIsOpen
  created
  
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