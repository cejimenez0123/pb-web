import { createAsyncThunk } from "@reduxjs/toolkit"
import Book from "../domain/models/book"
import BookRole from "../domain/models/bookrole"
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
    
      const profileId = params["profileId"]
      const userId = params["userId"]
      const page = params["page"]
      const groupBy = params["groupBy"]??9
      const quotient = page * groupBy
  
    try {
    
        
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
           
              bookList = [...bookList, book]
            })
         
            return {
                bookList
            }
        }catch(err){
    
      return {
            error: new Error(`Error: GET PROFILE BOOKS: ${err.message}`)
            }
        }
    }
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

    return { book }
    }catch(error){
  
      return {
        error: new Error(`Error: CreateBook ${error.message}`)
      }
    }})


    const fetchArrayOfBooks = createAsyncThunk("books/fetchArrayOfBooks",async (params,thunkApi)=>{
      try{
      const ref = collection(db,"book")
      const bookIdList = params["bookIdList"]
      const snapshot =await getDocs(query(ref, where('id', 'in', bookIdList)))
    
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
    
        bookList = [...bookList, book]
      })
        return {
          bookList
        }
      }catch(err){
        const error = err??new Error("Error: Fetch Array of Books")
        return {error }
      }
})
const fetchArrayOfBooksAppened = createAsyncThunk("books/fetchArrayOfBooksAppend",async (params,thunkApi)=>{
  try{
  const ref = collection(db,"book")
  const bookIdList = params["bookIdList"]
  const snapshot =await getDocs(query(ref, where('id', 'in', bookIdList)))

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

    bookList = [...bookList, book]
  })
    return {
      bookList
    }
  }catch(err){
    const error = err??new Error("Error: Fetch Array of Books")
    return {error }
  }
}
)

const createRolesForBook = createAsyncThunk("books/createRoleForBook",async (params,thunkApi)=>{
    
   try {
    const {id,roles } = params
    const ref =doc(db,"book",id,"book_role")
    let createdRoles = []
    roles.forEach(roleItem =>{
      const bookRoleId = ref.id
      const { profileId,role } = roleItem
      const timestamp = Timestamp.now()
    setDoc(
        doc(db,"book", id,BookRole.className(),bookRoleId),{
                          id: bookRoleId,
                          profileId: profileId,
                          role: role,
                          created: timestamp
                            
                        })
        let bookRole = new BookRole(bookRoleId,profileId,role,timestamp)
        createdRoles.push(bookRole)
                      })
        return {
          roleList: createdRoles
        }
    }catch(e){
      const error = e??new Error("Error: CREATE BOOK ROLES")
      return {error }
    }                
})

const fetchBookRoles = createAsyncThunk("books/fetchBookRoles",async (params,thunkApi)=>{
  const bookId = params["bookId"]
  
  try {
    const ref = doc(db,"book",bookId,"book_role")
    const snapshot = await getDocs(ref) 
    let roleList = []
    snapshot.docs.forEach(doc => {
        const {id }= doc
        const pack = doc.data()
        const profileId = pack["profileId"]
        const bookId = pack["bookId"]
        const role = pack["role"]
        const created = pack["created"]
        let bookRole = new BookRole(id,profileId,bookId,role,created)
        roleList.push(bookRole)
    })


    return {
      roleList: roleList
    }
  }catch(err){
    return {
      error: new Error("Error: FETCH BOOK ROLES"+err.message)
    }
  }

})

  export {  getPublicBooks,
            fetchBook,
            fetchArrayOfBooks,
            getProfileBooks,
            createBook,
            fetchArrayOfBooksAppened,
            createRolesForBook,
            fetchBookRoles}