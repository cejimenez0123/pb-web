import {db,app,auth} from "../core/di"
import {where,query,updateDoc,collection,getDocs,startAt,endAt,getDoc,doc,Firestore ,setDoc, QuerySnapshot,limit, DocumentData, Timestamp,DocumentSnapshot} from "firebase/firestore"
import Page from "../domain/models/page"
import { createAction,createAsyncThunk } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"


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
          
                const page = new Page(  id,
                                        title,
                                        data,
                                        profileId,
                                        approvalScore,
                                        privacy,
                                        type,
                                        readers,
                                        writers,
                                        editors,
                                        commenters,
                                        created)
              pageList = [...pageList, page]
            })

        console.log(`PAGES ${pageList[0].title}`)
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
      privacy,
    
    } = params

      let ref = doc(db,"page",page.id)
      await updateDoc(ref,{
        title,
        data,
        profileId:page.profileId,
        privacy,
        approvalScore: page.approvalScore,
        type: page.type,
      })
      let newPage= new Page(page.id,
                          title,
                          data,
                          page.profileId,
                          page.approvalScore,
                          page.privacy,
                          page.type,
                          page.readers,
                          page.writers,
                          page.editors,
                          page.commenters,
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
    const profileId = params["profileId"]
    const userId = params["userId"]
    const page = params["page"]
    const groupBy = params["groupBy"]??9
    const quotient = page * groupBy

  try {

  const snapshot = await getDocs(
                query(collection(db, "page"),  where("profileId", "==", profileId)));
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
        
              const page =  new Page( id,
                                      title,
                                      data,
                                      profileId,
                                      approvalScore,
                                      privacy,
                                      type,
                                      readers,
                                      writers,
                                      editors,
                                      commenters,
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
          writers,
          commenters,
          editors,}=params
 const created = Timestamp.now()
//  const page = 
  try{

  
  const snapshot = await setDoc(doc(db,"page", id), { id,
                                                      title,
                                                      data,
                                                      profileId,
                                                      approvalScore,
                                                      privacy,
                                                      type,
                                                      readers,
                                                      writers,
                                                      commenters,
                                                      editors,
                                                      created:created})
  console.log(`savePage ${JSON.stringify(snapshot)}`)
  const page = new Page(id,title,data,profileId,approvalScore,privacy,type,created)
  console.log(`savePage ${JSON.stringify(page)}`)
  return { page }
  }catch(error){
    console.log(`savePage ${JSON.stringify(error)}`)
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
  const page = new Page(id=pId,
                        title,
                        data,
                        profileId,
                        approvalScore,
                        privacy,
                        type,
                        readers,
                        writers,
                        editors,
                        commenters,
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
  const page = new Page(id=pId,
                        title,
                        data,
                        profileId,
                        approvalScore,
                        privacy,
                        type,
                        readers,
                        writers,
                        editors,
                        commenters,
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
const saveRolesForPage = createAsyncThunk("pages/saveRolesForPages",async (params,thunkApi)=>{
    
  try {
   const {page,
         readers,
         commenters,
         editors,
         writers} = params
  
     let ref = collection(db,'page',page.id)
     await updateDoc(ref,{ editors: editors,
       commenters:commenters,
       writers: writers,
       readers: readers,
     })
     return {page: Page(...Page,commenters,writers,editors,readers)}


   }catch(e){
     const error = e??new Error("Error: SAVE PAGE ROLES")
     return {error }
   }                
})
const fetchArrayOfPages = createAsyncThunk("pages/fetchArrayOfPages",async (params,thunkApi)=>{
  try{
  const ref = collection(db,"page")
  const pageIdList = params["pageIdList"]
  const snapshot =await getDocs(query(ref, where('id', 'in', pageIdList)))

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
  
        const page =  new Page(id,title,data,profileId,approvalScore,privacy,type,readers,writers,editors,commenters,created)
  
      pageList = [...pageList, page]
    })
  
console.log(`pageList ${JSON.stringify(pageList)}`)
return {

pageList
}


}catch(err){
const error = err??new Error("Error: Fetch Array of Pages")
return {error }
}}

)
const setPageInView = createAction("pages/setPageInView", function prepare(page) {
  return {
   
      page
    
  }
})

const setPagesToBeAdded = createAction("pages/setPagesToBeAdded",(params)=>{
  let {pageList} = params
console.log(`GASSX ${JSON.stringify(pageList)}`)
  return {
    payload: pageList
  }
})

const clearPagesInView = createAction("pages/clearPagesInView")

const fetchArrayOfPagesAppened = createAsyncThunk("pages/fetchArrayOfPagesAppend",async (params,thunkApi)=>{
  try{
  const ref = collection(db,"page")
  const pageIdList = params["pageIdList"]
  if(0>=pageIdList.length){
    return {
      pageList: []
    }
  }else{
  const snapshot =await getDocs(query(ref, where('id', 'in', pageIdList)))

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
  
        const page =  new Page( id,
                                title,
                                data,
                                profileId,
                                approvalScore,
                                privacy,
                                type,
                                readers,
                                writers,
                                editors,
                                commenters,
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
const pagesLoading = createAction("PAGES_LOADING", function prepare(){
    return {
        payload: {
            loading: true
    }}
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
          fetchEditingPage
        } 