import {db,auth,client} from "../core/di"
import {where,query,and,or,collection,getDocs,getDoc,doc} from "firebase/firestore"
import Page from "../domain/models/page"
import { createAction,createAsyncThunk } from "@reduxjs/toolkit"
import Contributors from "../domain/models/contributor"
import {storage} from "../core/di"
import storyRepo from "../data/storyRepo"
import commentRepo from "../data/commentRepo"
import likeRepo from "../data/likeRepo"
import profileRepo from "../data/profileRepo"
import { PageType } from "../core/constants"
import { deleteObject } from "firebase/storage"

const getPublicStories = createAsyncThunk("page/getPublicStories",async (thunkApi)=>{
  
  try{
    const data = await storyRepo.getPublicStories()
    

return {
    stories:data.stories
  }

    }catch(err){
      return {error: err}
    }
  
})

const setHtmlContent = createAction(
  'pages/setHtmlContent',(html)=>{
      return {
        payload:{
          html
        }
      }
  }
)

// const updatePage = createAsyncThunk("pages/updatePage",async (params,thunkApi)=>{
      
//   try{
//     const { page,
//       title,
//       data,
//       commentable,
//       privacy,
    
//     } =params
     
//       let ref = doc(db,"page",page.id)
//       await updateDoc(ref,{
//         title,
//         data,
//         privacy,
//         approvalScore: page.approvalScore,
//       })
//       if(!privacy){
//         client.initIndex("page").partialUpdateObject({objectID: page.id,title:title},{createIfNotExists:true}).wait()
//       }
//       const contributors= new Contributors(page.commenters,
//         page.readers,page.writers,page.editors)
//       let newPage= new Page(page.id,
//                           title,
//                           data,
//                           page.profileId,
//                           page.userId,
//                           page.approvalScore,
//                           privacy,
//                           commentable,
//                           page.type,
//                           contributors,
//                           page.created)
    
//       return {
//         page: newPage
//       }
//     }catch(e){
//     return {error: new Error("Error: UDATE PAGE-" + e.message)}
//   }
// })

const getPublicProfilePages= createAsyncThunk(
  'pages/getPublicProfilePages',
  async ({profile},thunkApi) => {
    try{

    let data= await storyRepo.getPublicProfileStories({profileId:profile.id})

  return {
    pageList:data.stories
  }
  }catch(e){

  return {error:`public pages${e.message}`}
}})
const getProtectedProfilePages= createAsyncThunk(
  'pages/getProtectedProfilePages',
  async ({profile},thunkApi) => {
    try{

    let data= await storyRepo.getProtectedProfileStories({profileId:profile.id})
  
  return {
    pageList:data.stories}
  }catch(e){

  return {error:`Page Query Where Error: ${e.message}`}
}})


const fetchPage=createAsyncThunk("pages/fetchPage", async function(params,thunkApi){
  let id = params["id"]

 

  try {
  const snapshot = await getDoc(doc(db, "page", id))
  const page = unpackPageDoc(snapshot)
  
  return {
    page
  }
  }catch(e){
    return {
      error: e
    }

  }


})
const fetchEditingPage = createAsyncThunk("pages/fetchEditingPage", async function(params,thunkApi){
  let id = params["id"]
  try {
    storyRepo.get
    // const docSnap = await getDoc(doc(db, "page", id))
    // const page = unpackPageDoc(docSnap)
    return {
      page
    }
  }catch(e){
    return {
      error: e
    }
  }
})
// const saveRolesForPage = createAsyncThunk("books/saveRolesForPage",async (params,thunkApi)=>{
    
//   try {
//    const {page,
//          readers,
//          commenters,
//          editors,
//          writers} = params
  
//      let ref = doc(db,'page',page.id)
//      await updateDoc(ref,{ editors: editors,
//        commenters:commenters,
//        writers: writers,
//        readers: readers,
//      })
//      const contributors= new Contributors(commenters,readers,writers,editors)
           
//      return {page: new Page(  page.id,
//                               page.title,
//                               page.data,
//                               page.profileId,
//                               auth.currentUser.uid,
//                               page.approvalScore,
//                               page.privacy,
//                               page.commentable,
//                               page.type,
//                               contributors,
//                               page.created
// )}


//    }catch(e){
//      const error = e??new Error("Error: CREATE PAGE ROLES")
//      return {error }
//    }                
// })
// const appendSaveRolesForPage = createAsyncThunk("pages/appendSaveRolesForPages",async (params,thunkApi)=>{
//   try {
//     const { pageIdList,
//             readers,
           
//             } = params
//         pageIdList.forEach(id=>{
//             let ref =doc(db,'page',id)
//             updateDoc(ref,{
//               readers: arrayUnion(...readers),
//             })

//         }

//         )
//         return{readers: readers}
//   }catch(e){
//     return {
//       error: new Error(`Error:APPEND SAVE PAGE ROLES ${e.message}`)
//     }
//   }
// })
const appendToPagesInView = createAction("pages/appendToPagesInView", (params)=> {

  const {pages} = params
  return  {payload:
    pages}})

const fetchArrayOfPages = createAsyncThunk("pages/fetchArrayOfPages",async (params,thunkApi)=>{
try{ 
  const pageIdList = params["pageIdList"]
    const profile = params["profile"]
  const pagePromises = pageIdList.map((pageId) => {
    const pageRef = doc(db, "page", pageId);
    return getDoc(pageRef);
  });
  // Use Promise.all to resolve all promises concurrently
  let snapshots = await Promise.all(pagePromises)
  let pageList = snapshots.map(snapshot => unpackPageDoc(snapshot))

return {pageList:pageList}


}catch(err){
const error = err??new Error("Error: Fetch Array of Pages")
return {error }
}}

)
const setPageInView = createAction("pages/setPageInView", (params)=> {

  const {page} = params
  return  {payload:
    page}
    
  
})
const setPagesInView = createAction("pages/setPagesInView", (params)=> {

  const {pages} = params
  return  {payload:
    pages}
    
  
})
const setEditingPage = createAction("pages/setEditingPage", (params)=> {

  const {page} = params
  return  {payload:
    page}
    
  
})
const clearEditingPage = createAction("pages/clearEditingPage", (params)=> {


  return  {payload:
    null}
    
  
})

const setPagesToBeAdded = createAction("pages/setPagesToBeAdded",(params)=>{
  let {pageList} = params

  return {
    payload: pageList
  }
})

const clearPagesInView = createAction("pages/clearPagesInView")

const fetchArrayOfPagesAppened = createAsyncThunk("pages/fetchArrayOfPagesAppend",async (params,thunkApi)=>{
  try{
  const ref = collection(db,"page")
  const pageIdList = params["pageIdList"]
  
  if(0==pageIdList.length){
    return {
      pageList: []
    }
  }else{
    let queryReq =query(ref,
      and(where("id", "in", pageIdList),where("privacy","==",false)))
    if(auth.currentUser){
    queryReq = query(ref,
      and(where("id", "in", pageIdList),
                   or(where("privacy","==",false),
                      where('commenters', 'array-contains', auth.currentUser.uid),
                      where('readers','array-contains', auth.currentUser.uid),
                      where('editors', 'array-contains', auth.currentUser.uid),
                      where('writers', 'array-contains',auth.currentUser.uid),
                      where("privacy","==",false))))
   }
  const snapshot =await getDocs(queryReq)

 let pageList = []
  snapshot.docs.forEach(doc => {
      const page = unpackPageDoc(doc)  
      pageList = [...pageList, page]
    })
    return {
      pageList
    }
  }

    }catch(err){
    const error = err??new Error("Error: Fetch Array of Pages")
    return {error }
    }
  }
)
const createComment = createAsyncThunk("pages/createComment", async function({
  profile,
  text,
  storyId,
  parentCommentId,
  },thunkApi){
  try{


 let data = await commentRepo.create({profile:profile,storyId:storyId,text,parentId:parentCommentId})
return {comment:data.comment}

  
  }catch(error){
   
    return {
      error: new Error(`Error: Create Comment ${error.message}`)
    }
  }


})
const appendComment = createAction("pages/appendComment", (params)=> {

  const {comment} = params
  return  {payload:
    comment}
    
  
})
const fetchCommentsOfPage = createAsyncThunk("comments/fetchCommentsOfPages",async (params,thunkApi)=>{
  try{
    let token = localStorage.getItem("token")
    if(token){
      let data = await storyRepo.fetchCommentsOfPageProtected({pageId:params.id})
      return {

        comments: data.comments
      }
    }else{
      let data = await storyRepo.fetchCommentsOfPagePublic({pageId:params.id})
      return {

        comments: data.comments
      }
    }




}catch(err){

throw err

}}

)
const deleteComment = createAsyncThunk("pages/deleteComment",async (params,thunkApi)=>{
  const { comment}= params

  try{
  
     let data = await commentRepo.delete({id:comment.id})

  return {
    comment:data.comment,
    message:data.message
  }
  }catch(e){
    return{ error: new Error("Error Deleteing comment"+e.message)}
  }
})
const pagesLoading = createAction("PAGES_LOADING", function prepare(){
    return {
        payload: {
            loading: true
    }}
  })
const deletePage= createAsyncThunk("pages/deletePage", async (params,thunkApi)=>{
    try{
      const {page}=params
    let data = await storyRepo.deleteStory({id:page.id})
    if(page.type==PageType.picture){
      let refer = ref(storage,page.data)
      deleteObject(refer)
    }
    client.initIndex("page").deleteObject(page.id).wait()
    return {
      page:data
    }
    }catch(e){
      return {error: new Error("Error: Delete Page"+e.message)};
    }
  })
  const updateComment = createAsyncThunk(`pages/updateComment`, async (params,thunkApi)=>{
    const {comment,newText}=params

          let data = await commentRepo.update({id:comment.id,text:newText})


      return {
        comment:data.comment
      }
  })
  const fetchPagesWhereProfileWriter = createAction("books/fetchBooksWhereProfileEditor",(params,thunkApi)=>{
    try{
    const ref = collection(db,"page")
    let snapshot = query(ref,
         where('writers', 'array-contains', auth.currentUser.uid),
    )
    let pageList = []
      snapshot.docs.forEach(doc => {
        const page = unpackPageDoc(doc)
              pageList = [...pageList, page]
            })
    return {
      pageList: pageList,
    }
  }catch(e){
    return {
      error: e
    }
  }
  })
  const fetchPagesWhereProfileEditor = createAsyncThunk("pages/fetchBooksWhereProfileEditor",(params,thunkApi)=>{
    try{
    const ref = collection(db,"page")
    let snapshot = query(ref,
         where('editors', 'array-contains', auth.currentUser.uid),
    )
    let pageList = []
      snapshot.docs.forEach(doc => {
                const pack = doc.data();
                const { id } = doc;
                const title =pack["title"]
                const data = pack["data"]
                const profileId = pack["profileId"]
                const approvalScore = pack["approvalScore"]
                const privacy = pack["privacy"]
                const type = pack["type"]
                const created = pack["created"]
                let commentable = pack["commentable"]
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
              if(commentable==null){
                commentable=true
              }
              const contributors= new Contributors(commenters,
                readers,writers,editors)
                const page = new Page(  id,
                                        title,
                                        data,
                                        profileId,
                                        auth.currentUser.uid,
                                        approvalScore,
                                        privacy,
                                        commentable,
                                        type,
                                        contributors, 
                                        created)
              pageList = [...pageList, page]
            })
    return {
      pageList: pageList,
    }
  }catch(e){
    return {
      error: e
    }
  }
  })
  const fetchPagesWhereProfileCommenters= createAsyncThunk("pages/fetchPagesWhereProfileEditor",(params,thunkApi)=>{
    try{
    const ref = collection(db,"page")
    let snapshot = query(ref,
         where('commenters', 'array-contains', auth.currentUser.uid),
    )
    let pageList = []
      snapshot.docs.forEach(doc => {
                const pack = doc.data();
                const { id } = doc;
                const title =pack["title"]
                const data = pack["data"]
                const profileId = pack["profileId"]
                const approvalScore = pack["approvalScore"]
                const privacy = pack["privacy"]
                const type = pack["type"]
                const created = pack["created"]
                let commentable = pack["commentable"]
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
              if(commentable==null){
                commentable=true
              }
              const contributors= new Contributors(commenters,
                readers,writers,editors)
                const page = new Page(  id,
                                        title,
                                        data,
                                        profileId,
                                        auth.currentUser.uid,
                                        approvalScore,
                                        privacy,
                                        commentable,
                                        type,
                                        contributors, 
                                        created)
              pageList = [...pageList, page]
            })
    return {
      pageList: pageList,
    }
  }catch(e){
    return {
      error: e
    }
  }
  })
 
  const createPageApproval = createAsyncThunk("users/createPageApproval",async (params,thunkApi)=>{
   try{
    const {story,profile,score}=params
    const data = await likeRepo.storyCreate({story,profile})
    return {
      profile:data.profile
    }
  }catch(e){
    return {error: e}
  }
  })
  const deletePageApproval = createAsyncThunk("users/deletePageApproval",async (params,thunkApi)=>{
   
try{
      const data = await likeRepo.storyDelete(params)
      const token = localStorage.getItem("token")
      let profileData = await profileRepo.getMyProfiles({token:token})
        
      return {
      profile: profileData.profile
      }
    }catch(e){
      return {
        error: e
      }
    }
  })
  const unpackPageDoc = (doc)=>{
    const pack = doc.data();
              const { id } = doc;
              const title =pack["title"]
              const data = pack["data"]
              const profileId = pack["profileId"]
              const privacy = pack["privacy"]
              const approvalScore = pack["approvalScore"]
              const type = pack["type"]
              const created = pack["created"]
              const userId = pack["userId"]
              let commentable = pack["commentable"]
              let commenters = pack["commenters"]
              let editors = pack["editors"]
              let readers = pack["readers"]
              let writers = pack["writers"]
    const contributors= new Contributors(commenters,
      readers,writers,editors)
      const page =  new Page( id,
                              title,
                              data,
                              profileId,
                              userId,
                              approvalScore,
                              privacy,
                              commentable,
                              type,
                              contributors,
                              created)
                              return page
  }

  export {
          pagesLoading,
          setHtmlContent,
          getProtectedProfilePages,
          getPublicProfilePages,        
          setPageInView,
          fetchPage,
          fetchArrayOfPages,
          setPagesToBeAdded,
          fetchArrayOfPagesAppened,
          clearPagesInView,
          // saveRolesForPage,
          // updatePage,
          fetchEditingPage,
          // appendSaveRolesForPage,
          createComment,
          fetchCommentsOfPage,
          deleteComment,
          clearEditingPage,
          appendComment,
          updateComment,
          fetchPagesWhereProfileCommenters,
          fetchPagesWhereProfileEditor,
          fetchPagesWhereProfileWriter,
          setEditingPage,
          setPagesInView,
          createPageApproval,
          deletePageApproval,
          unpackPageDoc,
          getPublicStories,
         appendToPagesInView
        } 
// async function doThis(){

//     let data= await storyRepo.getPublicStories()
//     data.stories.map(story=>{

// let names = story.hashtags.map(hs=>hs.hashtag.name)
//     client.initIndex("story").partialUpdateObject(
//       {objectID:story.id,title:story.title,hashtags:names,type:"story"},{createIfNotExists:true}).wait()

//     })
// }  

// doThis().then()