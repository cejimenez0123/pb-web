import { createAsyncThunk,createAction } from "@reduxjs/toolkit"
import Library from "../domain/models/library"
import { deleteDoc,and,or,orderBy,getDoc,collection,setDoc,doc ,Timestamp,getDocs,where,query,updateDoc} from "firebase/firestore"
import { db,auth,client } from "../core/di"
import Contributors from "../domain/models/contributor"
import axios from "axios"
import Enviroment from "../core/Enviroment"


const updateLibrary = createAsyncThunk("libraries/updateLibrary", async function(params,thunkApi){
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
    client.initIndex("library")
    .partialUpdateObject({objectID:library.id,name},{createIfNotExists:true}).wait()
    const contributors= new Contributors( library.commenters,
                                          library.readers,
                                          library.writers,
                                          library.editors)
    const libraryItem =new Library(library.id,
              name,library.profileId,
              purpose,library.pageIdList,
              library.bookIdList,
              writingIsOpen,
              privacy,
              contributors,
              library.updatdedAt,
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

      let updatedAt =  Timestamp.now()
      const ref =doc(db, "library", library.id)
      
    await updateDoc(ref, {
        pageIdList: pageIdList,
            bookIdList: bookIdList,
            updatedAt: updatedAt
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
                  updatedAt,
                  library.created)
        return { library: newLibrary }
        }catch(error){
    
          return {
            error: new Error(`Error: update conteent Library ${error.message}`)
          }
        }
      
      
      })
      
const   appendLibraryContent = createAsyncThunk("libraries/updateLibraryContent", async function(params,thunkApi){

    
        try{
          const {
            library,
           
              }=params
          const newPageIds = params["pageIdList"]
          const newBookIds = params["bookIdList"]
          let updatedAt =  Timestamp.now()
          const ref =doc(db, "library", library.id)
          if(newBookIds.length>0){
            await updateDoc(ref,{bookIdList:newBookIds,
            updatedAt:updatedAt})
          }
          if(newPageIds.length>0){
            await updateDoc(ref,{pageIdList:newPageIds,
              updatedAt:updatedAt})
          }
      
        let snapshot = await getDoc(ref)
        const pack = snapshot.data()
        const { id,
              name,
              profileId,
              purpose,
              pageIdList,
              bookIdList,
              readers,
              commenters,
              writingIsOpen,
              writers,
              editors,
              privacy,
              created}=pack
            const contributors= new Contributors(commenters,
              readers,writers,editors)
        const newLibrary =new Library(id,
                                      name,
                                      profileId,
                                      purpose,
                                      pageIdList,
                                      bookIdList,
                                      writingIsOpen,
                                      privacy,
                                      contributors,
                                      updatedAt,
                                      created)
            return { library: newLibrary }
            }catch(error){
        
              return {
                error: new Error(`Error: append update content Library ${error.message}`)
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
    let updatedAt = pack["updatedAt"]
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
                            updatedAt,
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
   if(!privacy){
    client.initIndex("library").saveObject({objectID:id,name:name}).wait()
   }
   
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
        updatedAt:created,
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
                                created,
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
      let libList =[]
      try {
      const profile = params["profile"]
      const ref = collection(db, "library")
      let queryReq = query(ref,where("profileId","==",profile.id),where("privacy","==",false))
      let queries = [queryReq]
        if(auth.currentUser){
        if(auth.currentUser.uid === profile.userId){

          queryReq=  query(ref,where("profileId","==",profile.id))
          queries = [queryReq]
        }else{
          const queryWriter = query(
            ref,
                where('profileId', '==', profile.id),
                where('writers', 'array-contains', auth.currentUser.uid)
              );
          const queryEditor = query(
                ref,
                    where('profileId', '==', profile.id),
                    where('editors', 'array-contains', auth.currentUser.uid)
                  );
          const queryCommenter = query(
                    ref,
                        where('profileId', '==', profile.id),
                        where('commenters', 'array-contains', auth.currentUser.uid)
                      );
          const queryReader = query(
                    ref,
                        where('profileId', '==', profile.id),
                        where('readers', 'array-contains', auth.currentUser.uid)
                      );
            queries= [...queries,queryWriter,queryEditor,queryCommenter,queryReader]
        }

     }
     let promises = queries.map(query=>{
      return getDocs(query)
    })
    let snapshots = await Promise.all(promises)
    const docs = snapshots.map(snapshot=>snapshot.docs).flat()
    libList = docs.map(doc=>unpackLibraryDoc(doc))
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
        const updatdedAt = pack["updatdedAt"]
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
                                  updatdedAt,
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
       await updateDoc(ref,{ editors: editors,
          commenters:commenters,
          writers: writers,
          readers: readers,
        })
        const contributors = new Contributors(commenters,readers,writers,editors)
        const lib = new Library(  library.id,
                                  library.name,
                                  library.profileId,
                                  library.purpose,
                                  library.pageIdList,
                                  library.bookIdList,
                                  library.writingIsOpen,
                                  library.privacy,
                                  contributors,
                                  library.updatedAt,
                                  library.created
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
      const res = await axios(Enviroment.url+"/collection/library")
      
  //    const ref = collection(db, "library")
  
  // const snapshot = await getDocs(query(ref, where("privacy", "==", false)))

  //       snapshot.docs.forEach(doc => {
  //             const library = unpackLibraryDoc(doc)                      
  //           libraryList = [...libraryList, library]
  //         })
  return {

      libraryList: res.data.libraries
    }
  
    
  }
)
const deleteLibrary = createAsyncThunk("libraries/deleteLibrary", async (params,thunkApi)=>{
  
  try{
    const {library }=params
  await deleteDoc(doc(db, "library", library.id));
  client.initIndex("library").deleteObject(library.id).wait()
    return {library}
  }catch(e){
    return {error: new Error("Error: Delete Library"+e.message)};
  }
})
const fetchArrayOfLibraries = createAsyncThunk("libraries/fetchArrayOfLibraries",async (params,thunkApi)=>{
  try{
    const libraryIdList = params["libraryIdList"]
    const profile = params["profile"]
  const libPromises =libraryIdList.map((libId) => {
    const pageRef = doc(db, "library", libId);
    return getDoc(pageRef);
  });
  // Use Promise.all to resolve all promises concurrently
  let snapshots = await Promise.all(libPromises)
  let libList = snapshots.map(snapshot => unpackPageDoc(snapshot))
// unpackLibraryDoc(snapshot)
return {libraryList:libList}
//   const ref = collection(db,"library")
//   // const libraryIdList = params["libraryIdList"]
// if(libraryIdList.length == 0){
//   return {
//     libraryList:[]
//   }
// }else{
//   let queryReq =query(ref,
//     and(where("id", "in", libraryIdList),where("privacy","==",false)))
//   if(auth.currentUser){
//   queryReq = query(ref,
//     and(where("id", "in", libraryIdList),
//                  or(where("privacy","==",false),
//                     where('commenters', 'array-contains', auth.currentUser.uid),
//                     where('readers','array-contains', auth.currentUser.uid),
//                     where('editors', 'array-contains', auth.currentUser.uid),
//                     where('writers', 'array-contains',auth.currentUser.uid),
//                     where("privacy","==",false))))
//  }
//   let libList = []
//   const snapshot =await getDocs(queryReq)
//    snapshot.docs.forEach(doc => {
   
//          const pack = doc.data();
//          const { id } = doc;
//          const name =pack["name"]
//          const pageIds = pack["pageIdList"]
//          const bookIds = pack["bookIdList"]
//          const profileId = pack["profileId"]
//          const privacy = pack["privacy"]
//          const purpose = pack["purpose"]
//          const writingIsOpen = pack["writingIsOpen"]
//          const created = pack["created"]
//          const updatedAt = pack["updatedAt"]
//          let commenters = pack["commenters"]
//          let editors = pack["editors"]
//          let readers = pack["readers"]
//          let writers = pack["writers"]
//          if(!editors){
//            editors = []
//          }
//          if(!commenters){
//            commenters = []
//          }
//          if(!readers){
//            readers=[]
//          }
//          if(!writers){
//            writers=[]
//          }
     
//          const contributors= new Contributors(commenters,
//           readers,writers,editors)
//        const lib = new Library(  id,
//                                  name,
//                                  profileId,
//                                  purpose,
//                                  pageIds,
//                                  bookIds,
//                                  writingIsOpen,
//                                  privacy,
//                                  contributors,
//                                  updatedAt,
//                                  created)
//        libList = [...libList,lib]
//      })
// return {

//  libraryList: libList
// }}
}catch(err){
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
        const updatedAt = pack["updatedAt"]
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
                                  updatedAt,
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
function unpackLibraryDoc(doc){
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
  const updatedAt = pack["updatdedAt"]
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
                          updatedAt,
                          created)
    return lib
}
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
          setBookmarkLibrary,
          unpackLibraryDoc,
          appendLibraryContent
          }