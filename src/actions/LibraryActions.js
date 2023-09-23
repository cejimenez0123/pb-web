import { createAsyncThunk } from "@reduxjs/toolkit"
import Library from "../domain/models/library"
import { arrayRemove,arrayUnion,getDoc,collection,setDoc,doc ,Timestamp,getDocs,where,query,updateDoc} from "firebase/firestore"

import { db } from "../core/di"

//make a bookmark library for joe

const updateLibrary = createAsyncThunk("libraries/updateLibrary", async function(params,thunkApi){
//     


try{
const {
  library,
  name,
  purpose,
  privacy,
  writingIsOpen
  }=params
  const ref =doc(db, "library", library.id)
  await updateDoc(ref, {
    privacy:privacy,
    writingIsOpen:writingIsOpen,
    name:name,
    purpose:purpose,
  })
  const libraryItem =new Library(library.id,
              name,library.profileId,
              purpose,library.pageIdList,
              library.bookIdList,
              writingIsOpen,
              privacy,
              library.created)
    return { library:libraryItem }
    }catch(error){

      return {
        error: new Error(`Error: updateLibrary ${error.message}`)
      }
    }
  
  
  })
  const updateLibraryContent = createAsyncThunk("libraries/updateLibraryContent", async function(params,thunkApi){

    
    try{
      const {
        library,
        pageIdList,
        bookIdList
          }=params

  
      const ref =doc(db, "library", library.id)
      const diffBooks = library.bookIdList.filter(id => !bookIdList.includes(id));
      console.log(`FARKAB ${JSON.stringify(diffBooks)}`)
      // if(diffBooks.length>0){
          await updateDoc(ref, {
            bookIdList: bookIdList
          });
      //     await updateDoc(ref,{
      //       bookIdList: arrayUnion(bookIdList)
      //     })
      // }else{
      //   await updateDoc(ref,{
      //     bookIdList: arrayUnion(bookIdList)
      //   })
      // }
      const diffPages = library.pageIdList.filter(id => !pageIdList.includes(id));
      console.log(`FARKA ${JSON.stringify(diffPages)}`)
      // if(diffPages.length>0){
        await updateDoc(ref, {
          pageIdList: pageIdList
        });
      //   await updateDoc(ref,{
      //     pageIdIdList: arrayUnion(pageIdList)
      //   })
      // }else{
      //   await updateDoc(ref,{
      //     pageIdIdList: arrayUnion(pageIdList)
      //   })
      // }
      const newLibrary =new Library(library.id,
                  library.name,library.profileId,
                  library.purpose,pageIdList,
                  bookIdList,
                  library.writingIsOpen,
                  library.privacy,
                  library.created)
        return { library: newLibrary }
        }catch(error){
    
          return {
            error: new Error(`Error: update conteent Library ${error.message}`)
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

   const created = Timestamp.now()
  //  const page = 
    try{
     
    
    const snapshot = await setDoc(doc(db,"library", id), {
        id,
        name,
        purpose,
        profileId,
        pageIdList,
        bookIdList,
        privacy,
        writingIsOpen,created:created})
  

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

  const fetchBookmarkLibrary= createAsyncThunk(
    'libraries/fetchBookmarkLibrary',
    async (params,thunkApi) => {
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
          error: new Error(`Error: Fetch Bookmark Library: ${e.message}`)
        }
    
      }
    }
  )

export {fetchLibrary,updateLibrary,updateLibraryContent,createLibrary,getProfileLibraries,fetchBookmarkLibrary}