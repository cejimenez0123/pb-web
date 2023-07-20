import {db,app} from "../core/di"
import {where,query,collection,getDocs,getDoc,doc,Firestore , QuerySnapshot, DocumentData, DocumentSnapshot} from "firebase/firestore"
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
      payload: {
        pageList}
    }
      
    }
  )
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
  export {getPublicPages,pagesLoading}