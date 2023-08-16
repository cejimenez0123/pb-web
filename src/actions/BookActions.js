import { createAsyncThunk } from "@reduxjs/toolkit"
import Book from "../domain/models/book"
import {where,query,collection,getDocs,startAt,endAt,getDoc,doc,Firestore ,setDoc, QuerySnapshot,limit, DocumentData, Timestamp,DocumentSnapshot} from "firebase/firestore"
import { db } from "../core/di"

const getPublicBooks = createAsyncThunk(
    'books/getPublicBooks',
    async (thunkApi) => {
        let bookList = []
        // db.collection("page").where("privacy","==",false).get()

        try{
    const snapshot = await getDocs(query(collection(db, "book"), where("privacy", "==", false)))
    //   snapshot=>{
   
          snapshot.docs.forEach(doc => {

                const pack = doc.data();
                
                const id = pack["id"]
                const title =pack["title"]
                const purpose = pack["purpose"]
                const profileId = pack["profileId"]
                const pageIdList = pack["pageIdList"]
                const updatedAt = pack["updatedAt"]
                const privacy = pack["privacy"]
                const writingIsOpen = pack["writingIsOpen"]
                const created = pack["created"]
                const book = new Book(id,purpose,title,profileId,pageIdList,privacy,writingIsOpen,updatedAt,created)
              bookList = [...bookList,book]
             })
        // })
    return {
  
        bookList
    }
}catch (error) {
    return{
        error: new Error(`getPublicBooks ${error.message}`)
    }
}
      
    }
)

const fetchBook = createAsyncThunk("books/fetchBook", async function(params,thunkApi){
    let id = params["id"]
  
   
  
    try {
    const docSnap = await getDoc(doc(db, "page", id))
    const pack = docSnap.data()
    const id = pack["id"]
    const title =pack["title"]
    const purpose = pack["purpose"]
    const profileId = pack["profileId"]
    const pageIdList = pack["pageIdList"]
    const updatedAt = pack["updatedAt"]
    const privacy = pack["privacy"]
    const writingIsOpen = pack["writingIsOpen"]
    const created = pack["created"]
    const book = new Book(id,purpose,title,profileId,pageIdList,privacy,writingIsOpen,updatedAt,created)
           
    return {
      book
    }
    }catch(e){
      return {
        error: e
      }
  
    }
  
  
  })

  export {getPublicBooks,fetchBook}