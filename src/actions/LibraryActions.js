import { createAsyncThunk,createAction } from "@reduxjs/toolkit"
import Library from "../domain/models/library"
import { deleteDoc,and,or,arrayRemove,arrayUnion,getDoc,collection,setDoc,doc ,Timestamp,getDocs,where,query,updateDoc} from "firebase/firestore"
import LibraryRole from "../domain/models/library_role"
import { db,auth } from "../core/di"
import { read } from "@popperjs/core"
import Contributors from "../domain/models/contributor"

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
  const contributors= new Contributors(library.commenters,
              library.readers,library.writers,library.editors)
            
  const libraryItem =new Library(library.id,
              name,library.profileId,
              purpose,library.pageIdList,
              library.bookIdList,
              writingIsOpen,
              privacy,
              contributors,
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
        const contributors= new Contributors(library.commenters,
          library.readers,library.writers,library.editors)
      const newLibrary =new Library(library.id,
                  library.name,library.profileId,
                  library.purpose,pageIdList,
                  bookIdList,
                  library.writingIsOpen,
                  library.privacy,
                  contributors,
                  library.created)
        return { library: newLibrary }
        }catch(error){
    
          return {
            error: new Error(`Error: update conteent Library ${error.message}`)
          }
        }
      
      
      })
const fetchLibrary = createAsyncThunk("libraries/fetchLibrary", async function (params, thunkApi){
    const {id } = params

 

  try {
  const docSnap = await getDoc(doc(db, "library", id))
  const pack = docSnap.data()
    // let lId = pack["id"]
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
    const contributors= new Contributors(commenters,
    readers,writers,editors)
  const library = new Library(id,
                              libName,
                              profileId,
                            purpose,
                            pageIds,
                            bookIds,
                            writingIsOpen,
                            privacy,
                            contributors,
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
  
        const contributors= new Contributors(commenters,
          readers,writers,editors)
    const library =new Library( id,
                                name,
                                profileId,
                                purpose,
                                pageIdList,
                                bookIdList,
                                writingIsOpen,
                                privacy,
                                contributors,
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
      const profile = params["profile"]
      const ref = collection(db, "library")
      let queryReq = query(ref,and(where("profileId","==",profile.id),where("privacy","==",false)))
      if(auth.currentUser.uid == profile.userId){
        queryReq = query(ref, where("profileId", "==", profile.id))
       }else if(auth.currentUser.uid != profile.userId){
      queryReq = query(ref,and(
                     where("profileId", "==", profile.id),
                     or(where('commenters', 'array-contains', auth.currentUser.uid),
                        where('readers','array-contains', auth.currentUser.uid),
                        where('editors', 'array-contains', auth.currentUser.uid),
                        where('writers', 'array-contains', auth.currentUser.uid),
                        where("privacy","==",false))))
     }else{
        queryReq = query(ref,and(where("profileId","==",profile.id),where("privacy","==",false)))
     }
    try {

       
    const snapshot = await getDocs(queryReq);
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
            
                const contributors= new Contributors(commenters,
                  readers,writers,editors)
              const lib = new Library(  id,
                                        name,
                                        profileId,
                                        purpose,
                                        pageIds,
                                        bookIds,
                                        writingIsOpen,
                                        privacy,
                                        contributors,
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
  const setLibraryInView = createAction("libraries/setLibraryInView", (params)=> {
    const {library } = params
    return {
       payload: library
    }
  })
  const setBookmarkLibrary = createAction("libraries/setBookmarkLibrary", (params)=> {
    const {library } = params
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
        const contributors= new Contributors(commenters,
          readers,writers,editors)
      const library = new Library(lId,
                                  libName,
                                  profileId,
                                  purpose,
                                  pageIds,
                                  bookIds,
                                  writingIsOpen,
                                  privacy,
                                 contributors,
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
     
        
        let ref = doc(db,'library',library.id)
       await updateDoc(ref,{ editors: editors.map,
          commenters:commenters,
          writers: writers,
          readers: readers,
        })

        const lib = Library(library.id,
                      library.name,
                      library.profileId,
                      library.purpose,
                      library.pageIdList,
                      library.bookIdList,
                      library.writingIsOpen,
                      library.privacy,
                      readers,
                      writers,
                      editors,
                      commenters,
                      library.created,
                     )
        
        return {
          library:lib
        }
     
     }catch(e){
       const error = e??new Error("Error: SAVE LIBRARY ROLES")
       return {error }
     }                
 })

 const getPublicLibraries = createAsyncThunk(
  'libraries/getPublicLibraries',
  async (thunkApi) => {
      let libraryList = []

  const snapshot = await getDocs(query(collection(db, "library"), where("privacy", "==", false)))

        
        snapshot.docs.forEach(doc => {
              const pack = doc.data();
              const { id } = doc;
              const name =pack["name"]
              const purpose = pack["purpose"]
              const profileId = pack["profileId"]
              const pageIdList = pack["pageIdList"]
              const bookIdList = pack["bookIdList"]
              const writingIsOpen = pack["writingIsOpen"]
              const privacy = pack["privacy"]
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
            const contributors= new Contributors(commenters,
              readers,writers,editors)
            const library = new Library(id,
                                        name,
                                        profileId,
                                        purpose,
                                        pageIdList,
                                        bookIdList,
                                        writingIsOpen,
                                        privacy,
                                        contributors,
                                        created)
                                        
            libraryList = [...libraryList, library]
          })

   
  return {

      libraryList
    }
  
    
  }
)
const deleteLibrary = createAsyncThunk("libraries/deleteLibrary", async (params,thunkApi)=>{
  
  try{
    const {library }=params
  await deleteDoc(doc(db, "library", library.id));
  }catch(e){
    return {error: new Error("Error: Delete Library"+e.message)};
  }
})
const fetchArrayOfLibraries = createAsyncThunk("libraries/fetchArrayOfLibraries",async (params,thunkApi)=>{
  try{
  const ref = collection(db,"library")
  const libraryIdList = params["libraryIdList"]
if(libraryIdList.length == 0){
  return {
    libraryList:[]
  }
}else{
  let queryReq =query(ref,
    and(where("id", "in", libraryIdList),where("privacy","==",false)))
  if(auth.currentUser){
  queryReq = query(ref,
    and(where("id", "in", libraryIdList),
                 or(where("privacy","==",false),
                    where('commenters', 'array-contains', auth.currentUser.uid),
                    where('readers','array-contains', auth.currentUser.uid),
                    where('editors', 'array-contains', auth.currentUser.uid),
                    where('writers', 'array-contains',auth.currentUser.uid),
                    where("privacy","==",false))))
 }
  let libList = []
  const snapshot =await getDocs(queryReq)
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
     
         const contributors= new Contributors(commenters,
          readers,writers,editors)
       const lib = new Library(  id,
                                 name,
                                 profileId,
                                 purpose,
                                 pageIds,
                                 bookIds,
                                 writingIsOpen,
                                 privacy,
                                 contributors,
                                 created)
       libList = [...libList,lib]
     })
return {

 libraryList: libList
}}}catch(err){
  return {
    error: new Error(`Error: Fetch Array Of Libraries: ${err.message}`)
  }
}})
const fetchArrayOfLibrariesAppend = createAsyncThunk("libraries/fetchArrayOfLibrariesAppend",async (params,thunkApi)=>{
  try{
  const ref = collection(db,"library")
  const libraryIdList = params["libraryIdList"]
  const snapshot =await getDocs(query(ref, where('id', 'in', libraryIdList)))
  // const snapshot = await getDocs(queryReq);
  
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
        const contributors= new Contributors(commenters,
          readers,writers,editors)
        const lib = new Library(  id,
                                  name,
                                  profileId,
                                  purpose,
                                  pageIds,
                                  bookIds,
                                  writingIsOpen,
                                  privacy,
                                  contributors,
                                  created)
       libList = [...libList,lib]
     })
    return {
      libraryList: libList
    }
  }catch(err){
    return
  }
})
const clearLibrariesInView = createAction("libraries/clearLibrariesInView")
export {  fetchLibrary,
          updateLibrary,
          updateLibraryContent,
          createLibrary,
          getProfileLibraries,
          fetchBookmarkLibrary,
          setLibraryInView,
          saveRolesForLibrary,
          getPublicLibraries,
          deleteLibrary,
          fetchArrayOfLibraries,
          fetchArrayOfLibrariesAppend,
          clearLibrariesInView,
          setBookmarkLibrary
          }