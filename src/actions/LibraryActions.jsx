import { createAsyncThunk,createAction } from "@reduxjs/toolkit"
import collectionRepo from "../data/collectionRepo"
import profileRepo from "../data/profileRepo"


const updateLibrary = createAsyncThunk("libraries/updateLibrary", async function(params,thunkApi){
  try{
    const {
      library,
      name,
      purpose,
      privacy,
      writingIsOpen
    }=params

    let data = await collectionRepo.updateCollection({id:library.id,
        title:name,
        purpose:purpose,
        isPrivate:privacy,
        isOpenCollaboration:writingIsOpen})

    return { library:data.collection }
    }catch(error){

      return {
        error: new Error(`Error: updateLibrary ${error.message}`)
      }
    }
  
  
  })  

const fetchLibrary = createAsyncThunk("libraries/fetchLibrary", async function (params, thunkApi){
  try {
    const data = await collectionRepo.fetchCollection(params)
  return {
    library: data.collection
  }
  }catch(e){
    return {
      error: new Error(`Error: Fetch Library: ${e.message}`)
    }

  }
})



  
  const getProfileLibraries= createAsyncThunk(
    'libraries/getProfileLibraries',
    async (params,thunkApi) => {
      try {
      const profile = params["profile"]
      const data = await collectionRepo.getProfileLibraries({profile:profile}) 
    return {
  
        libList:data.collections
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
        let data = await profileRepo.getProfileBookmarkCollection({profileId:id})
                                  
    return {
        library:data.collections[0]
      }
      }catch(e){
        return {
          error: new Error(`Error: Fetch Bookmark Library: ${e.message}`)
        }
    
      }
    }
  )
//   const saveRolesForLibrary = createAsyncThunk("libraries/saveRolesForLibrary",async (params,thunkApi)=>{
    
//     try {
//       const {library,
//             readers,
//             commenters,
//             editors,
//             writers} = params
     
        
//         let ref = doc(db,'library',library.id)
//        await updateDoc(ref,{ editors: editors,
//           commenters:commenters,
//           writers: writers,
//           readers: readers,
//         })
//         const contributors = new Contributors(commenters,readers,writers,editors)
//         const lib = new Library(  library.id,
//                                   library.name,
//                                   library.profileId,
//                                   library.purpose,
//                                   library.pageIdList,
//                                   library.bookIdList,
//                                   library.writingIsOpen,
//                                   library.privacy,
//                                   contributors,
//                                   library.updatedAt,
//                                   library.created
//                      )
        
//         return {
//           library:lib
//         }
     
//      }catch(e){
//        const error = e??new Error("Error: SAVE LIBRARY ROLES")
//        return {error }
//      }                
//  })

 const getPublicLibraries = createAsyncThunk(
  'libraries/getPublicLibraries',
  async (thunkApi) => {
     
      let data = await collectionRepo.getPublicLibraries()
   
  return {

      libraries: data.libraries
    }
  
    
  }
)

export {  fetchLibrary,
          updateLibrary,
          getProfileLibraries,
          fetchBookmarkLibrary,
          setLibraryInView,
          getPublicLibraries, 
          setBookmarkLibrary,
          
          }