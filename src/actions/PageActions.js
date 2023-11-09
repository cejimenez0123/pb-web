import {db,auth} from "../core/di"
import {where,deleteDoc,query,and,updateDoc,or,collection,getDocs,getDoc,doc,setDoc, Timestamp, arrayUnion} from "firebase/firestore"
import Page from "../domain/models/page"
import PageComment from "../domain/models/page_comment"
import { createAction,createAsyncThunk } from "@reduxjs/toolkit"
import Contributors from "../domain/models/contributor"


const getPublicPages = createAsyncThunk(
    'pages/getPublicPages',
    async (thunkApi) => {
        let pageList = []

    const snapshot = await getDocs(query(collection(db, "page"), where("privacy", "==", false)))

          
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
                                        approvalScore,
                                        privacy,
                                        commentable,
                                        type,
                                        contributors, 
                                        created)
              pageList = [...pageList, page]
            })

       
    return {
  
        pageList}
    
      
    }
  )

const setHtmlContent = createAction(
  'pages/setHtmlContent',(html)=>{
      return {
        payload:{
          html
        }
      }
  }
)
const updatePage = createAsyncThunk("pages/updatePage",async (params,thunkApi)=>{
      
  try{
    const { page,
      title,
      data,
      commentable,
      privacy,
    
    } = params

      let ref = doc(db,"page",page.id)
      await updateDoc(ref,{
        title,
        data,
        privacy,
        approvalScore: page.approvalScore,
      })
      const contributors= new Contributors(page.commenters,
        page.readers,page.writers,page.editors)
      let newPage= new Page(page.id,
                          title,
                          data,
                          page.profileId,
                          page.approvalScore,
                          privacy,
                          commentable,
                          page.type,
                          contributors,
                          page.created)
    
      return {
        page: newPage
      }
    }catch(e){
    return {error: new Error("Error: UDATE PAGE-" + e.message)}
  }
})

const getProfilePages= createAsyncThunk(
  'pages/getProfilePages',
  async (params,thunkApi) => {
    let pageList = []
    const profile=params["profile"]
   
    const ref = collection(db, "page")
    let queryReq = query(ref,and(where("profileId","==",profile.id),where("privacy","==",false)))
    if(auth.currentUser.uid == profile.userId){
      queryReq = query(ref, where("profileId", "==", profile.id))
     }else if(auth.currentUser.uid != profile.userId){
    queryReq = query(ref,
                   and(where("profileId", "==", profile.id),
                   or(where('commenters', 'array-contains', auth.currentUser.uid),
                      where('readers','array-contains', auth.currentUser.uid),
                      where('editors', 'array-contains', auth.currentUser.uid),
                      where('writers', 'array-contains', auth.currentUser.uid),
                      where("privacy","==",false))))
   }else{
      queryReq = query(ref,and(where("profileId","==",profile.id),where("privacy","==",false)))
   }
  try {

  const snapshot = await getDocs(queryReq
                );
        pageList = []
        snapshot.docs.forEach(doc => {
              const pack = doc.data();
              const { id } = doc;
              const title =pack["title"]
              const data = pack["data"]
              const profileId = pack["profileId"]
              const privacy = pack["privacy"]
              const approvalScore = pack["approvalScore"]
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
              const page =  new Page( id,
                                      title,
                                      data,
                                      profileId,
                                      approvalScore,
                                      privacy,
                                      commentable,
                                      type,
                                      contributors,
                                      created)
     
            pageList = [...pageList, page]
          })
        
  return {

      pageList
  }


  }catch(err){
   const error = err??new Error("Error: Get Profile Pages")
    return {error }
  }}
)
const createPage = createAsyncThunk("pages/createPage", async function(params,thunkApi){
  const ref = collection(db,"page")
  const id = doc(ref).id

  const { profileId,
          data,
          privacy,
          approvalScore,
          type,
          title,
          readers,
          commentable,
          writers,
          commenters,
          editors,}=params
 const created = Timestamp.now()
  try{

  
  await setDoc(doc(db,"page", id), { id,
                                                      title,
                                                      data,
                                                      profileId,
                                                      approvalScore,
                                                      privacy,
                                                      commentable,
                                                      type,
                                                      readers,
                                                      writers,
                                                      commenters,
                                                      editors,
                                                      created:created})
     const contributors= new Contributors(commenters,
          readers,writers,editors)
  const page = new Page(  id,
                          title,
                          data,
                          profileId,
                          approvalScore,
                          privacy,
                          commentable,
                          type,
                          contributors,
                          created)

  return { page }
  }catch(error){
    
    return {
      error: new Error(`Error: SavePage ${error.message}`)
    }
  }


})
const fetchPage = createAsyncThunk("pages/fetchPage", async function(params,thunkApi){
  let id = params["id"]

 

  try {
  const docSnap = await getDoc(doc(db, "page", id))
  const pack = docSnap.data()
  let pId = pack["id"]
  let title =pack["title"]
  let data = pack["data"]
  let profileId = pack["profileId"]
  let commenters = pack["commenters"]
  let editors = pack["editors"]
  let readers = pack["readers"]
  let writers = pack["writers"]
  let privacy = pack["privacy"]
  let approvalScore = pack["approvalScore"]
  let type = pack["type"]
  let created = pack["created"]
  let commentable = pack["commentable"]
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
  if(commentable==null){
    commentable=true
  } const contributors= new Contributors(commenters,
    readers,writers,editors)
  const page = new Page(pId,
                        title,
                        data,
                        profileId,
                        approvalScore,
                        privacy,
                        commentable,
                        type,
                        contributors,
                        created)
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
  const docSnap = await getDoc(doc(db, "page", id))
  const pack = docSnap.data()
  let pId = pack["id"]
  let title =pack["title"]
  let data = pack["data"]
  let profileId = pack["profileId"]
  let commenters = pack["commenters"]
  let editors = pack["editors"]
  let readers = pack["readers"]
  let writers = pack["writers"]
  let privacy = pack["privacy"]
  let approvalScore = pack["approvalScore"]
  let type = pack["type"]
  let created = pack["created"]
  let commentable = pack["commentable"]
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
  if(commentable==null){
    commentable=true
  } const contributors= new Contributors(commenters,
    readers,writers,editors)
  const page = new Page(pId,
                        title,
                        data,
                        profileId,
                        approvalScore,
                        privacy,
                        commentable,
                        type,
                        contributors,
                        created)
  return {
    page
  }
  }catch(e){
    return {
      error: e
    }

  }


})
// const saveRolesForPage = createAsyncThunk("pages/saveRolesForPages",async (params,thunkApi)=>{
    
//   try {
//    const {page,
//           readers,
//           commenters,
//           editors,
//           writers} = params
  
//      let ref = collection(db,'page',page.id)
//      await updateDoc(ref,{ editors: editors,
//         commenters:commenters,
//         writers: writers,
//         readers: readers,
//      })


//    }catch(e){
//      const error = e??new Error("Error: SAVE PAGE ROLES")
//      return {error }
//    }                
// })
const saveRolesForPage = createAsyncThunk("books/saveRolesForPage",async (params,thunkApi)=>{
    
  try {
   const {page,
         readers,
         commenters,
         editors,
         writers} = params
  
     let ref = doc(db,'page',page.id)
     await updateDoc(ref,{ editors: editors,
       commenters:commenters,
       writers: writers,
       readers: readers,
     })
     const contributors= new Contributors(commenters,readers,writers,editors)
           
     return {page: new Page(  page.id,
                              page.title,
                              page.data,
                              page.profileId,
                              page.approvalScore,
                              page.privacy,
                              page.commentable,
                              page.type,
                              contributors,
                              page.created
)}


   }catch(e){
     const error = e??new Error("Error: CREATE PAGE ROLES")
     return {error }
   }                
})
const appendSaveRolesForPage = createAsyncThunk("pages/appendSaveRolesForPages",async (params,thunkApi)=>{
  try {
    const { pageIdList,
            readers,
           
            } = params
        pageIdList.forEach(id=>{
            let ref =doc(db,'page',id)
            updateDoc(ref,{
              readers: arrayUnion(...readers),
            })

        }

        )
        return{readers: readers}
  }catch(e){
    return {
      error: new Error(`Error:APPEND SAVE PAGE ROLES ${e.message}`)
    }
  }
})
const fetchAppendPagesOfProfile = createAsyncThunk("pages/fetchAppendPagesOfProfile", async(params,thunkApi)=>{
  const {id} = params
if(id){
   
  const ref = collection(db, "page")
  let queryReq = query(ref,and(where("profileId","==",id),where("privacy","==",false)))
  if(auth.currentUser.emailVerified){
  queryReq = query(ref,
                 and(where("profileId", "==", id),
                 or(where('commenters', 'array-contains', auth.currentUser.uid),
                    where('readers','array-contains', auth.currentUser.uid),
                    where('editors', 'array-contains', auth.currentUser.uid),
                    where('writers', 'array-contains', auth.currentUser.uid),
                    where("privacy","==",false))))
 }else{
    queryReq = query(ref,and(where("profileId","==",id),where("privacy","==",false)))
 }
let pageList = []
const snapshot = await getDocs(queryReq
              );
   
      snapshot.docs.forEach(doc => {
            const pack = doc.data();
            const { id } = doc;
            const title =pack["title"]
            const data = pack["data"]
            const profileId = pack["profileId"]
            const privacy = pack["privacy"]
            const approvalScore = pack["approvalScore"]
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
            const page =  new Page( id,
                                    title,
                                    data,
                                    profileId,
                                    approvalScore,
                                    privacy,
                                    commentable,
                                    type,contributors,created)
   
          pageList = [...pageList, page]
        })
      
return {

    pageList
}}else{
  return {pageList:[]}
}
})
const fetchArrayOfPages = createAsyncThunk("pages/fetchArrayOfPages",async (params,thunkApi)=>{
  try{
  const ref = collection(db,"page")
  const pageIdList = params["pageIdList"]
  const profile = params["profile"]
  if(pageIdList.length<1){
    return {
      pageList:[]
    }
  }else{
    let pageList = []
    let queryReq = query(ref,and(where("id","in",pageIdList),where("privacy","==",false)));
  
    if(profile){
     
      queryReq = query(ref,
          where("id", "in", pageIdList),
       )
       }
 const snapshot =await getDocs(queryReq)
  snapshot.docs.forEach(doc => {
        const pack = doc.data();
      //  let {readers,commenters,editors,writers,privacy}=pack
       
    
        const { id } = doc;
        let belongs = pageIdList.find(pId=>pId==id)
        if(Boolean(belongs)){
        const title =pack["title"]
        const data = pack["data"]
        const profileId = pack["profileId"]
        const privacy=pack["privacy"]
        const approvalScore = pack["approvalScore"]
        const type = pack["type"]
        const created = pack["created"]
        let commenters = pack["commenters"]
        let editors = pack["editors"]
        let readers = pack["readers"]
        let writers = pack["writers"]
        let commentable = pack["commentable"]
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
        const page =  new Page( id,
                                title,
                                data,
                                profileId,
                                approvalScore,
                                privacy,
                                commentable,
                                type,
                                contributors,
                                created)
  
      pageList = [...pageList, page]
  }})
  

return {

pageList
}

  }
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
        const pack = doc.data();
        const { id } = doc;
        const title =pack["title"]
        const data = pack["data"]
        const profileId = pack["profileId"]
        const privacy = pack["privacy"]
        const approvalScore = pack["approvalScore"]
        const type = pack["type"]
        const created = pack["created"]
        let commenters = pack["commenters"]
        let editors = pack["editors"]
        let readers = pack["readers"]
        let writers = pack["writers"]
        let commentable = pack["commentable"]
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
        const page =  new Page( id,
                                title,
                                data,
                                profileId,
                                approvalScore,
                                privacy,
                                commentable,
                                type,
                                contributors,
                                created)
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
const createComment = createAsyncThunk("pages/createComment", async function(params,thunkApi){

 
//  const page = 
  try{
    const {profileId,
      text,
      pageId,
      parentCommentId,
      }=params
    const commentRef = collection(db,'page',pageId,"comment")
    const id = doc(commentRef).id
    const created = Timestamp.now()
      await setDoc(doc(db,"page", pageId,"comment",id), { 
      id:id,
      profileId: profileId,
      text: text,
      pageId:pageId,
      parentCommentId:parentCommentId,
      approvalScore:0.0,
      created:created})
      const comment =new PageComment(id,text,pageId,profileId,parentCommentId,0.0)
  
  return { comment }
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
const fetchCommentsOfPage = createAsyncThunk("pages/fetchCommentsOfPages",async (params,thunkApi)=>{
  try{
    const {page} = params
  const ref = collection(db,"page",page.id,PageComment.className)

  const snapshot =await getDocs(ref)

  let commentList = []
  snapshot.docs.forEach(doc => {
        const pack = doc.data();
        const { id,
      profileId,
      text,
      pageId,
      parentCommentId,
      approvalScore,
      created}=pack
     const comment = new PageComment(id,text,pageId,profileId,parentCommentId,approvalScore,created)
      
      commentList = [...commentList, comment]
    })
return {

  comments: commentList,
}


}catch(err){
const error = err??new Error("Error: Fetch Comments"+err.message)
return {error }
}}

)
const deleteComment = createAsyncThunk("pagees/deleteComment",async (params,thunkApi)=>{
  const { comment}= params

  try{
  await deleteDoc(doc(db, "page", comment.pageId,"comment",comment.id));
  return {
    comment
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
    await deleteDoc(doc(db, "page", page.id));

    return {
      page:page
    }
    }catch(e){
      return {error: new Error("Error: Delete Page"+e.message)};
    }
  })
  const updateComment = createAsyncThunk(`pages/updateComment`, async (params,thunkApi)=>{
    const {comment,newText}=params
    let ref = doc(db, "page", comment.pageId,"comment",comment.id)
    await updateDoc(ref,{
      text:newText
    })
    const newComment = new PageComment(comment.id,
                    newText,
                    comment.pageId,
                    comment.profileId,
                    comment.parentCommentId,
                    comment.approvalScore,
                    comment.created)

      return {
        comment:newComment
      }
  })
  export {getPublicPages,
          pagesLoading,
          setHtmlContent,
          getProfilePages,
          createPage,
          setPageInView,
          fetchPage,
          fetchArrayOfPages,
          setPagesToBeAdded,
          fetchArrayOfPagesAppened,
          clearPagesInView,
          saveRolesForPage,
          updatePage,
          fetchEditingPage,
          appendSaveRolesForPage,
          createComment,
          fetchCommentsOfPage,
          deletePage,
          deleteComment,
          clearEditingPage,
          appendComment,
          updateComment,
          fetchAppendPagesOfProfile
        } 