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
    const docSnap = await getDoc(doc(db, "book", id))
    const pack = docSnap.data()
    console.log(`pack ${pack}`)
    const bId = pack["id"]
    const title =pack["title"]
    const purpose = pack["purpose"]
    const profileId = pack["profileId"]
    const pageIdList = pack["pageIdList"]
    const updatedAt = pack["updatedAt"]
    const privacy = pack["privacy"]
    const writingIsOpen = pack["writingIsOpen"]
    const created = pack["created"]
    const book = new Book(bId,purpose,title,profileId,pageIdList,privacy,writingIsOpen,updatedAt,created)
           
    return {
      book
    }
    }catch(e){
      return {
        error: e
      }
  
    }
  
  
  })
  const getProfileBooks= createAsyncThunk(
    'books/getProfileBooks',
    async (params,thunkApi) => {
      let pageList = []
      const profileId = params["profileId"]
      const userId = params["userId"]
      const page = params["page"]
      const groupBy = params["groupBy"]??9
      const quotient = page * groupBy
  
    try {
    
       
        
       console.log(`params: ${JSON.stringify(params)}`)
       
    const snapshot = await getDocs(
                  query(collection(db, "book"),  where("profileId", "==", profileId)));
          let bookList = []
          snapshot.docs.forEach(doc => {
            
                const pack = doc.data();
                const { id } = doc;
                const title =pack["title"]
                const purpose = pack["purpose"]
                const profileId = pack["profileId"]
                const pageIdList = pack["pageIdList"]
                const updatedAt = pack["updatedAt"]
                const privacy = pack["privacy"]
                const writingIsOpen = pack["writingIsOpen"]
                const created = pack["created"]

            
          
                const book =  new Book( 
                    id= id,
                    purpose=purpose,
                    profileId= profileId,
                    title=title,
                    pageIdList= pageIdList,
                    privacy= privacy,
                    writingIsOpen= writingIsOpen,
                    updatedAt= created,
                    created= created,
                )
           
              bookList = [...bookList, book]
            })
            console.log(`params ${JSON.stringify(bookList)}`)
            return {
                bookList
            }
  
  
    }catch(err){
     const error = err??new Error("Error: Get Profile Pages")
      return {error }
    }}
  )
  const createBook = createAsyncThunk("books/createBook", async function(params,thunkApi){
 
  //  const page = 
    try{
        const ref = collection(db,"book")
        const id = doc(ref).id
      
        const {
            title,
            purpose,
            profileId,
            pageIdList,
            privacy,
            writingIsOpen,
           }=params
            const created = Timestamp.now()
            const updatedAt = created
    const snapshot = await setDoc(doc(db,"book", id), 
                        { 
                            id:id,
                            title:title,
                            purpose:purpose,
                            profileId:profileId,
                            pageIdList:pageIdList,
                            privacy:privacy,
                            writingIsOpen:writingIsOpen,
                            updatedAt: created,
                            created: created
                        })

   const book = new Book(
    id,
    purpose,
    title,
    profileId,
    pageIdList,
    privacy,
    writingIsOpen,
    updatedAt,
    created,
)
                        console.log(`boks ${JSON.stringify(book)}`)
  
    return { book }
    }catch(error){
  
      return {
        error: new Error(`Error: CreateBook ${error.message}`)
      }
    }})


  export {getPublicBooks,fetchBook,getProfileBooks,createBook}