import { createAsyncThunk ,createAction} from "@reduxjs/toolkit"
import Book from "../domain/models/book"
import BookRole from "../domain/models/bookrole"
import {where,query,arrayUnion,collection,getDocs,startAt,endAt,getDoc,doc,Firestore ,setDoc,deleteDoc, QuerySnapshot,limit, DocumentData, Timestamp,DocumentSnapshot, updateDoc} from "firebase/firestore"
import { db } from "../core/di"

const getPublicBooks = createAsyncThunk(
    'books/getPublicBooks',
    async (thunkApi) => {
        let bookList = []
   
        try{
    const snapshot = await getDocs(query(collection(db, "book"), where("privacy", "==", false)))

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
                const book = new Book(  id,
                                        purpose,
                                        title,
                                        profileId,
                                        pageIdList,
                                        privacy,
                                        writingIsOpen,
                                        editors,
                                        commenters,
                                        readers,
                                        writers,
                                        updatedAt,
                                        created)
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
    let commenters = pack["commenters"]
    let writers = pack["writers"]
    let editors = pack["editors"]
    let readers = pack["readers"]
    const updatedAt = pack["updatedAt"]
    const privacy = pack["privacy"]
    const writingIsOpen = pack["writingIsOpen"]
    const created = pack["created"]
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
    const book = new Book(bId,
                          purpose,
                          title,
                          profileId,
                          pageIdList,
                          privacy,
                          writingIsOpen,
                          updatedAt,
                          writers,
                          readers,
                          commenters,
                          editors,
                          created)    
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
            
          
                const book =  new Book( 
                    id,
                    purpose,
                    title,
                    profileId,
                    pageIdList,
                    privacy,
                    writingIsOpen,
                    writers,
                    readers,
                    commenters,
                    editors,
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
            commenters,
            editors,
            readers,
            writers,

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
                            commenters,
                            editors,
                            readers,
                            writers,
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
    writers,
    readers,
    commenters,
    editors,
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
      let privacy = pack["privacy"]
      const writingIsOpen = pack["writingIsOpen"]
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
      if(!privacy){
        privacy = false
      }
    
      const book =  new Book( 
          id,
          purpose,
          title,
          profileId,
          pageIdList,
          privacy,
          writingIsOpen,
          updatedAt,
          writers,
          readers,
          commenters,
          editors,
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


  const book =  new Book( 
      id,
      purpose,
      title,
      profileId,
      pageIdList,
      privacy,
      writingIsOpen,
      updatedAt,
      editors,
      commenters,
      readers,
      editors,
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

const saveRolesForBook = createAsyncThunk("books/saveRolesForBook",async (params,thunkApi)=>{
    
   try {
    const {book,
          readers,
          commenters,
          editors,
          writers} = params
   
      let ref = collection(db,'book',book.id)
      await updateDoc(ref,{ editors: editors,
        commenters:commenters,
        writers: writers,
        readers: readers,
      })
      return {book: Book(...book,commenters,writers,editors,readers)}

 
    }catch(e){
      const error = e??new Error("Error: CREATE BOOK ROLES")
      return {error }
    }                
})
const updateBook = createAsyncThunk("books/updateBooks",async (params,thunkApi)=>{
      
  try{
    const { book,title,purpose,pageIdList,privacy,writingIsOpen } = params
    let updatedAt =Timestamp.now()
      let ref = doc(db,"book",book.id)
      await updateDoc(ref,{
        title:title,
        pageIdList:pageIdList,
        privacy: privacy,
        writingIsOpen: writingIsOpen,
        purpose: purpose,
        updatedAt: updatedAt
      })
      let newBook = new Book(book.id,purpose,title,book.profileId,pageIdList,privacy,writingIsOpen,updatedAt,book.created)
      return {
        book: newBook
      }
    }catch(e){
    return {error: new Error("Error: UDATE BOOK -" + e.message)}
  }
})
// const fetchBookRoles = createAsyncThunk("books/fetchBookRoles",async (params,thunkApi)=>{
//   const bookId = params["bookId"]
  
//   try {
//     const ref = doc(db,"book",bookId,"book_role")
//     const snapshot = await getDocs(ref) 
//     let roleList = []
//     snapshot.docs.forEach(doc => {
//         const {id }= doc
//         const pack = doc.data()
//         const profileId = pack["profileId"]
//         const bookId = pack["bookId"]
//         const role = pack["role"]
//         const created = pack["created"]
//         let bookRole = new BookRole(id,profileId,bookId,role,created)
//         roleList.push(bookRole)
//     })


//     return {
//       roleList: roleList
//     }
//   }catch(err){
//     return {
//       error: new Error("Error: FETCH BOOK ROLES"+err.message)
//     }
//   }

// })
const appendSaveRolesFoBook= createAsyncThunk("books/appendSaveRolesForBooks",async (params,thunkApi)=>{
  try {
    const { bookIdList,
            readers,
            commenters,
            } = bookIdList
        bookIdList.forEach(id=>{
            let ref =collection(db,'book',id)
            updateDoc(ref,{
              readers: arrayUnion(readers),
              commenters: arrayUnion(commenters),
            })

        }

        )
  }catch(e){
    return {
      error: new Error(`Error: SAVE BOOK ROLES ${e.message}`)
    }
  }
})
const setBookInView = createAction("books/setBookInView", (params)=> {

  const {book} = params
  
  return  {payload:
    book}
    
  
})
const setBooksToBeAdded = createAction("books/setBooksToBeAdded",(params)=>{
  let {bookList} = params
  return {
    payload: bookList
  }
})
// val setBookInView = createAction("book/setBookInView", (state,params)=>{

// })

  export {  getPublicBooks,
            fetchBook,
            fetchArrayOfBooks,
            getProfileBooks,
            createBook,
            fetchArrayOfBooksAppened,
            saveRolesForBook,
            setBookInView,
            // fetchBookRoles,
            updateBook,
            setBooksToBeAdded,
            appendSaveRolesFoBook}