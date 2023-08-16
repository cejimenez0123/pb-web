import {db,app,auth} from "../core/di"
import {where,query,collection,getDocs,startAt,endAt,getDoc,doc,Firestore ,setDoc, QuerySnapshot,limit, DocumentData, Timestamp,DocumentSnapshot} from "firebase/firestore"
import Page from "../domain/models/page"
import { createAction,createAsyncThunk } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
// const getPublicPages= ()=>{
//     return (dispatch)=>{
//     let pageList = []
//       // db.collection("page").where("privacy","==",false).get()
//   getDocs(query(collection(db, "page"), where("privacy", "==", false))).then(
// //   db.collection("page").where("privacy","==",false).get().then(
//     snapshot=>{
        
//         snapshot.docs.forEach(doc => {
//             const pack = doc.data();
//             const { id } = doc;
//             const title =pack["title"]
//             const data = pack["data"]
//             const profileId = pack["profileId"]
//             const privacy = pack["privacy"]
//             const type = pack["type"]
//             const created = pack["created"]
//             // const { title, data, profileId, privacy, type, created } = ;
//             const page = new Page(id, title, data, profileId, privacy, type, created)
//             console.log(`pagelist: ${page["profileId"]}`)
//             pageList = [...pageList, page]
//             dispatch(pagesInView(pageList))
//         })})
   

//   }
//   }

const getPublicPages = createAsyncThunk(
    'pages/getPublicPages',
    async (thunkApi) => {
        let pageList = []
        // db.collection("page").where("privacy","==",false).get()
    const snapshot = await getDocs(query(collection(db, "page"), where("privacy", "==", false)))
    //   snapshot=>{
          
          snapshot.docs.forEach(doc => {
                const pack = doc.data();
                const { id } = doc;
                const title =pack["title"]
                const data = pack["data"]
                const profileId = pack["profileId"]
                const privacy = pack["privacy"]
                const type = pack["type"]
                const created = pack["created"]
                const page = new Page(id, title, data, profileId, privacy, type, created)
              pageList = [...pageList, page]
             })
        // })
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
    // if(auth.currentUser==null){
     
      
     
     
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
          
        
              const page =  new Page(id,title,data,profileId,approvalScore,privacy,type,created)
         //new Page(id, title, data, profileId, privacy, type, created)
            
            pageList = [...pageList, page]
          })
          console.log(`params ${JSON.stringify(pageList)}`)

  return {

      pageList
  }


  }catch(err){
   const error = err??new Error("Error: Get Profile Pages")
    return {error }
  }}
)
const savePage = createAsyncThunk("pages/savePage", async function(params,thunkApi){
  const ref = collection(db,"page")
  const id = doc(ref).id
console.log(`params ${JSON.stringify(params)}`)
  const {profileId,data,privacy,approvalScore,type,title}=params
  console.log(`data ${profileId}`)
 const created = Timestamp.now()
//  const page = 
  try{

  
  const snapshot = await setDoc(doc(db,"page", id), {id,title,data,profileId,approvalScore,privacy,type,created:created})
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
  let privacy = pack["privacy"]
  let approvalScore = pack["approvalScore"]
  let type = pack["type"]
  let created = pack["created"]

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
const setPageInView = createAction("pages/setPageInView", function prepare(page) {
  return {
   
      page
    
  }
})
// (createAction('UPDATE_PARTICULAR_VALUE', {
//   id: props.id,
//   value: props.amount,
//   reason: props.reason
// }));

//   const getPublicPage = createAsyncThunk('PAGES_IN_VIEW',async (thunkApi) => {
//   // function prepare() {
//     let pageList = []
//     // db.collection("page").where("privacy","==",false).get()
// const snapshot = await getDocs(query(collection(db, "page"), where("privacy", "==", false)))
// //   snapshot=>{
      
//       snapshot.docs.forEach(doc => {
//             const pack = doc.data();
//             const { id } = doc;
//             const title =pack["title"]
//             const data = pack["data"]
//             const profileId = pack["profileId"]
//             const privacy = pack["privacy"]
//             const type = pack["type"]
//             const created = pack["created"]
//             const page = new Page(id, title, data, profileId, privacy, type, created)
       
//           pageList = [...pageList, page]
//          })
//     // })
//     console.log(`PAGES ${pageList[0].title}`)
// return {
//   payload: {
//     pageList}
// }
//   })

const pagesLoading = createAction("PAGES_LOADING", function prepare(){
    return {
        payload: {
            loading: true
    }}
  })
  const pagesInView = (pages)=>{return{ type: "PAGES_IN_VIEW",pages}}
  export {getPublicPages,pagesLoading,setHtmlContent,getProfilePages,savePage,setPageInView,fetchPage}