import { createAsyncThunk,createAction } from "@reduxjs/toolkit"
import Library from "../domain/models/library"
import { deleteDoc,arrayRemove,arrayUnion,getDoc,collection,setDoc,doc ,Timestamp,getDocs,where,query,updateDoc} from "firebase/firestore"
import LibraryRole from "../domain/models/libraryrole"
import { db } from "../core/di"
import { read } from "@popperjs/core"

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
              library.readers,
              library.writers,
              library.editors,
              library.commenters,
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
    await updateDoc(ref, {
            bookIdList: bookIdList
          });
   await updateDoc(ref, {
          pageIdList: pageIdList
        });

      const newLibrary =new Library(library.id,
                  library.name,library.profileId,
                  library.purpose,pageIdList,
                  bookIdList,
                  library.writingIsOpen,
                  library.privacy,
                  library.readers,
                  library.writers,
                  library.editors,
                  library.commentsers,
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
    let commenters = pack["commenters"]
    let writers = pack["writers"]
    let editors = pack["editors"]
    let readers = pack["readers"]
    let purpose = pack["purpose"]
    let privacy = pack["privacy"]
    let writingIsOpen = pack["writingIsOpen"]
    let created = pack["created"]
    if(!commenters){
      commenters = []
    }
    if(!writers){
      writers = []
    }
    if(!editors){
      editors = []
    }
    if(!readers){
      readers = []
    }
  const library = new Library(lId,
                              libName,
                              profileId,
                              purpose,
                              pageIds,
                              bookIds,
                              readers,
                              writers,
                              editors,
                              commenters,
                              writingIsOpen,
                              privacy,
                              created)
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
        writingIsOpen,
        writers,
        editors,
        commenters,
        readers,
        }=params

   const created = Timestamp.now()

    try{
      
    
    const snapshot = await setDoc(doc(db,"library", id), {
        id,
        name,
        purpose,
        profileId,
        pageIdList,
        bookIdList,
        privacy,
        writingIsOpen,
        readers,
        writers,
        editors,
        commenters,
        created:created})
  

    const library =new Library( id,
                                name,
                                profileId,
                                purpose,
                                pageIdList,
                                bookIdList,
                                writingIsOpen,
                                privacy,
                                readers,
                                writers,
                                editors,
                                commenters,
                                created)

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
                let commenters = pack["commenters"]
                let editors = pack["editors"]
                let readers = pack["readers"]
                let writers = pack["writers"]
                if(!editors){
                  editors = []
                }
                if(!commenters){
                  commenters = []
                }
                if(!readers){
                  readers=[]
                }
                if(!writers){
                  writers=[]
                }
            
          
              const lib = new Library(  id,
                                        name,
                                        profileId,
                                        purpose,
                                        pageIds,
                                        bookIds,
                                        writingIsOpen,
                                        privacy,
                                        readers,
                                        writers,
                                        editors,
                                        commenters,
                                        created)
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
  const setLibraryInView = createAction("libraries/setLibraryInView", function prepare(library) {
    return {
       payload: library
    }
  })
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
        let commenters = pack["commenters"]
        let editors = pack["editors"]
        let readers = pack["readers"]
        let writers = pack["writers"]
        if(!editors){
          editors = []
        }
        if(!commenters){
          commenters = []
        }
        if(!readers){
          readers=[]
        }
        if(!writers){
          writers=[]
        }
    
      const library = new Library(lId,
                                  libName,
                                  profileId,
                                  purpose,
                                  pageIds,
                                  bookIds,
                                  writingIsOpen,
                                  privacy,
                                  readers,
                                  writers,
                                  editors,
                                  commenters,
                                  created)
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
  const saveRolesForLibrary = createAsyncThunk("libraries/saveRolesForLibrary",async (params,thunkApi)=>{
    
    try {
      const {library,
            readers,
            commenters,
            editors,
            writers} = params
     
 
        let ref = collection(db,'library',library.id)
       await updateDoc(ref,{ editors: editors,
          commenters:commenters,
          writers: writers,
          readers: readers,
        })
        const lib = Library(...library,commenters,editors,writers,readers)
        console.log(`FORTET ${JSON.stringify(lib)}`)
        return {
          library:lib
        }
     
     }catch(e){
       const error = e??new Error("Error: SAVE LIBRARY ROLES")
       return {error }
     }                
 })


export {  fetchLibrary,
          updateLibrary,
          updateLibraryContent,
          createLibrary,
          getProfileLibraries,
          fetchBookmarkLibrary,
          setLibraryInView,
          saveRolesForLibrary,
          }