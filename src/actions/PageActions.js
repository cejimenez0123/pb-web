import {db,auth,client} from "../core/di"
import {where,deleteDoc,query,and,orderBy,updateDoc,or,collection,getDocs,getDoc,doc,setDoc, Timestamp, arrayUnion} from "firebase/firestore"
import Page from "../domain/models/page"
import PageComment from "../domain/models/page_comment"
import { createAction,createAsyncThunk } from "@reduxjs/toolkit"
import Contributors from "../domain/models/contributor"
import UserApproval from "../domain/models/user_approval"
import axios from "axios"
import Enviroment from "../core/Enviroment"

const getPublicStories = createAsyncThunk("page/getPublicStories",async (thunkApi)=>{

  try{
    let res = await axios.get(Enviroment.url+"/story/")
    console.log(res.data)

return {
    stories:res.data.stories
  }

    }catch(err){
      return {error: err}
    }
  
})
const getPublicPages = createAsyncThunk(
    'pages/getPublicPages',
    async (thunkApi) => {
        let pageList = []
      try{
        let res = await axios.get(Enviroment.url+"/story/")
        console.log(res.data)
        // let ref = collection(db, "page")
        // const request = query(ref, where("privacy", "==", false), orderBy("created", "desc"))
        // const snapshot = await getDocs(request)
        // snapshot.docs.forEach(doc => {
        //         const page = unpackPageDoc(doc)  
        //         pageList = [...pageList, page]
        //     })
    return {
        pageList:res.data.stories
      }
    
        }catch(err){
          return {error: err}
        }
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
      if(!privacy){
        client.initIndex("page").partialUpdateObject({objectID: page.id,title:title},{createIfNotExists:true}).wait()
      }
      const contributors= new Contributors(page.commenters,
        page.readers,page.writers,page.editors)
      let newPage= new Page(page.id,
                          title,
                          data,
                          page.profileId,
                          page.userId,
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
    try{
    const ref = collection(db, "page")
    let queryReq = query(ref,where("profileId","==",profile.id),where("privacy","==",false))
    let queries= [queryReq]
    if(auth.currentUser && (auth.currentUser.uid == profile.userId)){
      queryReq = query(ref, where("profileId", "==", profile.id))
      queries = [queryReq]
    }else if(auth.currentUser && (auth.currentUser.uid !== profile.userId)){
    
      console.log(auth.currentUser.uid)
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
   queries = [...queries,queryWriter,queryEditor,queryCommenter,queryReader]
    //   // queryReq = query(ref, where("profileId", "==", profile.id))
   
      }

  let promises = queries.map(query=>{
    return getDocs(query)
  })
  let snapshots = await Promise.all(promises)
  const docs = snapshots.map(snapshot=>snapshot.docs).flat()
  pageList = docs.map(doc=>unpackPageDoc(doc))
  return {

      pageList
    }
  }
catch(e){

  return {error:`Page Query Where Error: ${e.message}`}
}
})
      // let readerSnap = await getDocs(queryReaders)
      //   readerSnap.docs.forEach(doc=>{
      //     const page = unpackPageDoc(doc)
      //       pageList = [...pageList, page]
      //       })
      //     let queryCommenter = query(ref,where("profileId", "==", profile.id),where("commenters", "array-contains", auth.currentUser.uid))        
  //     let queryWriter = query(ref,where("profileId", "==", profile.id, where("writers", "array-contains", auth.currentUser.uid)))  
  //     let queryEditor = query(ref,where("profileId","==", profile.id),where("editors", "array-contains",auth.currentUser.uid))
  //     let queryReaders = query(ref,where("profileId","==", profile.id),where("readers", "array-contains", auth.currentUser.uid))
  //   try {
  //     let snapshot = await getDocs(queryCommenter)
  //     snapshot.docs.forEach(doc=>{
  //         const page = unpackPageDoc(doc)
  //         pageList = [...pageList, page]
  //       })
  //     }catch(e){
  //       console.error(e)

  //     }  
  //     try {
  //       let snapshot = await getDocs(queryReq)
  //       snapshot.docs.forEach(doc=>{
  //           const page = unpackPageDoc(doc)
  //           pageList = [...pageList, page]
  //         })
  //       }catch(e){
  //         console.error(`Page Query Where Req Error: ${e.message}`)
  
  //       }  
  //     try{
  //       let readerSnap = await getDocs(queryReaders)
  //       readerSnap.docs.forEach(doc=>{
  //         const page = unpackPageDoc(doc)
  //           pageList = [...pageList, page]
  //           })
  //     }catch(e){
  //       console.error(`Page Query Where Reader Error: ${e.message}`)
  //     }
  //     try{
  //       let editorSnap = await getDocs(queryEditor)
  //       editorSnap.docs.forEach(doc=>{
  //         const page = unpackPageDoc(doc)
  //         pageList = [...pageList, page]
  //         })
  //       }catch(e){
  //         console.error(`Page Query Where Editor Error: ${e.message}`)
  //     }
  //     try{
  //     let writerSnap = await getDocs(queryWriter)
  //     writerSnap.docs.forEach(doc=>{
  //         const page = unpackPageDoc(doc)
  //         pageList = [...pageList, page]
  //       })
  //     }catch (e) {
  //       console.error(`Page Query Where Writer Error: ${e.message}`)
  //     }
  //     return {pageList}
  // }
  // try{
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
          if(!privacy){
            client.initIndex("page").saveObject({objectID:id,title:title}).wait()
            }
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

  return { page }
  }catch(error){
    
    return {
      error: new Error(`Error: SavePage ${error.message}`)
    }
  }


})
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
    const docSnap = await getDoc(doc(db, "page", id))
    const page = unpackPageDoc(docSnap)
    return {
      page
    }
  }catch(e){
    return {
      error: e
    }
  }
})
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
                              auth.currentUser.uid,
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
         const page = unpackPageDoc(doc)
   
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
const createComment = createAsyncThunk("pages/createComment", async function(params,thunkApi){
  try{
    const {profileId,
      text,
      pageId,
      parentCommentId,
      }=params
    const commentRef = collection(db,"page_comment")
    const id = doc(commentRef).id
    const created = Timestamp.now()
      await setDoc(doc(db,"page_comment",id), { 
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
  // const ref = collection(db,"page",page.id,PageComment.className)
  const ref = collection(db,"page_comment")
  let request = query(ref,
       where('pageId',"==",page.id),
  )
  const snapshot =await getDocs(request)

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
const deleteComment = createAsyncThunk("pages/deleteComment",async (params,thunkApi)=>{
  const { comment}= params

  try{
  await deleteDoc(doc(db, "page_comment", comment.id));
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
    client.initIndex("page").deleteObject(page.id).wait()
    return {
      page:page
    }
    }catch(e){
      return {error: new Error("Error: Delete Page"+e.message)};
    }
  })
  const updateComment = createAsyncThunk(`pages/updateComment`, async (params,thunkApi)=>{
    const {comment,newText}=params
    let ref = doc(db,"page_comment",comment.id)
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
    const {pageId,profileId,score}=params
    const id = `${profileId}_${pageId}`
    await setDoc(doc(db,UserApproval.className,id), { 
      id,
      pageId,
      profileId,
      score 
    })
    let userApproval = new UserApproval(id,pageId,profileId,score)
    return {
      userApproval
    }
  }catch(e){
    return {error: e}
  }
  })
  const deletePageApproval = createAsyncThunk("users/deletePageApproval",async (params,thunkApi)=>{
    const {userApproval}=params
   
   await deleteDoc(doc(db,UserApproval.className,userApproval.id))
    try{
      return {
        userApproval
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
          fetchAppendPagesOfProfile,
          fetchPagesWhereProfileCommenters,
          fetchPagesWhereProfileEditor,
          fetchPagesWhereProfileWriter,
          setEditingPage,
          createPageApproval,
          deletePageApproval,
          unpackPageDoc,
          getPublicStories
        } 
        